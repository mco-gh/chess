// The computer opponent: Stockfish, running in a Web Worker in this browser
// (see vendor/stockfish). We talk to it in UCI, the text protocol chess engines
// share: tell it the moves so far, ask it to think, read back its best move.
import { squareName } from './chess.js';

const ENGINE = './vendor/stockfish/stockfish-19-lite-single.js';

// Strength is shown in Elo, the rating scale chess uses. From 1350 up, Stockfish
// limits itself to that rating (UCI_Elo, which it calibrates against engine
// rating lists). It can't go below 1320 that way, so the two lowest levels ask it
// for its top few moves (`pv` of them, from a shallow search) and pick among them
// at random, favoring the better ones: the lower the "temperature" (in
// centipawns), the fewer blunders. Their settings were tuned by playing them
// against the 1350 level: Novice wins about a third of the time, Beginner never.
export const LEVELS = [
  { id: 'beginner', name: 'Beginner', blurb: 'Just learning. Leaves pieces hanging.', temp: 400, depth: 3, pv: 12 },
  { id: 'novice', name: 'Novice', blurb: 'Knows the moves, misses plenty of tactics.', temp: 150, depth: 5, pv: 8 },
  { id: '1350', name: '1350', blurb: 'A club newcomer. Rated about 1350.', elo: 1350, movetime: 600 },
  { id: '1600', name: '1600', blurb: 'A steady club player. Rated about 1600.', elo: 1600, movetime: 700 },
  { id: '1900', name: '1900', blurb: 'A strong club player. Rated about 1900.', elo: 1900, movetime: 800 },
  { id: '2200', name: '2200', blurb: 'Master strength. Rated about 2200.', elo: 2200, movetime: 900 },
  { id: '2500', name: '2500', blurb: 'Grandmaster strength. Rated about 2500.', elo: 2500, movetime: 1000 },
  { id: 'max', name: 'Max', blurb: 'Stockfish at full strength. Good luck.', movetime: 1500 },
];

let worker = null;
let booting = null;
const listeners = new Set();
let queue = Promise.resolve();

function send(command) {
  worker.postMessage(command);
}

/** Wait for an output line that passes `test`; `onLine` sees every line meanwhile. */
function until(test, { onLine, timeout = 30000 } = {}) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { listeners.delete(listen); reject(new Error('The chess engine stopped answering.')); }, timeout);
    const listen = (line) => {
      onLine?.(line);
      if (!test(line)) return;
      clearTimeout(timer);
      listeners.delete(listen);
      resolve(line);
    };
    listeners.add(listen);
  });
}

/** Start the engine (once). Resolves when it is ready for commands. */
export function boot() {
  if (booting) return booting;
  booting = (async () => {
    worker = new Worker(ENGINE);
    worker.addEventListener('message', (event) => {
      for (const listen of [...listeners]) listen(String(event.data));
    });
    const failed = new Promise((_, reject) => {
      worker.addEventListener('error', () => reject(new Error('Couldn’t start the chess engine.')), { once: true });
    });
    const ready = (async () => {
      send('uci');
      await until((line) => line === 'uciok');
      send('isready');
      await until((line) => line === 'readyok');
    })();
    await Promise.race([ready, failed]);
  })();
  booting.catch(() => {
    worker?.terminate();
    worker = null;
    booting = null;               // let a later game try again
  });
  return booting;
}

/** Forget the last game (its hash table and history). */
export async function newGame() {
  await boot();
  queue = queue.then(async () => {
    send('ucinewgame');
    send('isready');
    await until((line) => line === 'readyok');
  }).catch(() => {});
  return queue;
}

/** Abandon any search in progress; its answer is ignored by the caller. */
export function stop() {
  if (worker) send('stop');
}

const uci = (m) => squareName(m.from) + squareName(m.to) + (m.promo ?? '');

function settingsFor(level) {
  if (level.temp) return ['UCI_LimitStrength value false', 'Skill Level value 20', `MultiPV value ${level.pv ?? 8}`];
  if (level.elo) return ['UCI_LimitStrength value true', `UCI_Elo value ${level.elo}`, 'MultiPV value 1'];
  return ['UCI_LimitStrength value false', 'Skill Level value 20', 'MultiPV value 1'];
}

/** Pick among the engine's candidates, better ones more often. */
function sample(candidates, temp) {
  const best = Math.max(...candidates.map((c) => c.score));
  const weights = candidates.map((c) => Math.exp((c.score - best) / temp));
  let roll = Math.random() * weights.reduce((a, b) => a + b, 0);
  for (let k = 0; k < candidates.length; k++) {
    roll -= weights[k];
    if (roll <= 0) return candidates[k].move;
  }
  return candidates[0].move;
}

/**
 * The computer's move, as a UCI string like "e2e4" or "e7e8q".
 * `moves` is the game so far: [{ from, to, promo }] with board square numbers.
 */
export async function bestMove(moves, levelId) {
  const level = LEVELS.find((l) => l.id === levelId) ?? LEVELS[3];
  await boot();
  const job = queue.then(async () => {
    for (const option of settingsFor(level)) send(`setoption name ${option}`);
    send('isready');
    await until((line) => line === 'readyok');
    send(`position startpos${moves.length ? ` moves ${moves.map(uci).join(' ')}` : ''}`);

    const lines = new Map();           // multipv rank → { move, score }
    const onLine = (line) => {
      const m = /^info .*\bmultipv (\d+) .*\bscore (cp|mate) (-?\d+).* pv (\S+)/.exec(line);
      if (!m) return;
      const value = Number(m[3]);
      const score = m[2] === 'cp' ? value : (value > 0 ? 100000 - value : -100000 - value);
      lines.set(Number(m[1]), { move: m[4], score });
    };
    send(level.depth ? `go depth ${level.depth}` : `go movetime ${level.movetime}`);
    const done = await until((line) => line.startsWith('bestmove'), { onLine });
    const best = done.split(' ')[1];
    if (level.temp && lines.size > 1) return sample([...lines.values()], level.temp);
    return best;
  });
  queue = job.catch(() => {});
  return job;
}
