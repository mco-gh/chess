// Learning mode's evaluation: a second Stockfish, separate from the computer
// opponent in engine.js, that keeps looking at whatever position is on the board
// and reports who is ahead. A new position stops the old search first.
import { squareName } from './chess.js';

const ENGINE = './vendor/stockfish/stockfish-19-lite-single.js';
const LIMIT = 'go depth 18 movetime 2500';   // whichever comes first

let worker = null;
let ready = null;          // resolves once the engine has said hello
let searching = false;
let wanted = null;         // { moves, onScore } still to be searched
let current = null;        // the search running now

const uci = (m) => squareName(m.from) + squareName(m.to) + (m.promo ?? '');

function start() {
  if (!worker) {
    worker = new Worker(ENGINE);
    ready = new Promise((resolve, reject) => {
      worker.addEventListener('error', () => reject(new Error('Couldn’t start the chess engine.')), { once: true });
      worker.addEventListener('message', function hello(event) {
        if (event.data === 'uciok') worker.postMessage('isready');
        if (event.data === 'readyok') {
          worker.removeEventListener('message', hello);
          resolve();
        }
      });
    });
    worker.addEventListener('message', (event) => onLine(String(event.data)));
    worker.postMessage('uci');
    ready.catch(() => { worker?.terminate(); worker = null; });
  }
  return ready;
}

function onLine(line) {
  if (line.startsWith('bestmove')) {
    searching = false;
    current = null;
    next();
    return;
  }
  const m = /^info .*\bdepth (\d+) .*\bscore (cp|mate) (-?\d+)/.exec(line);
  if (!m || !current || / (lowerbound|upperbound) /.test(line)) return;
  const value = Number(m[3]);
  current.onScore({ depth: Number(m[1]), [m[2]]: value });
}

function next() {
  if (searching || !wanted) return;
  current = wanted;
  wanted = null;
  searching = true;
  const { moves } = current;
  worker.postMessage(`position startpos${moves.length ? ` moves ${moves.map(uci).join(' ')}` : ''}`);
  worker.postMessage(LIMIT);
}

/**
 * Evaluate the position after `moves` ([{ from, to, promo }]). `onScore` is
 * called as the search deepens with { depth, cp } or { depth, mate }, from the
 * point of view of the side to move. Replaces any evaluation still running.
 */
export async function analyze(moves, onScore) {
  const job = { moves: moves.slice(), onScore };
  wanted = job;
  await start();
  if (wanted !== job) return;                  // already started, or replaced by a newer one
  if (searching) worker.postMessage('stop');   // its bestmove starts the next one
  else next();
}

/** Stop looking (learning mode off, or the game is over). */
export function quiet() {
  wanted = null;
  if (current) current.onScore = () => {};
  if (searching) worker?.postMessage('stop');
}
