// Draws a chess board and its pieces. It knows nothing about the rules: app.js
// tells it what the position is and which squares to light up, and it reports
// presses and drags back.
import { squareName, colorOf } from './chess.js';
import { pieceSVG, pieceStyle } from './pieces.js';

export { pieceSVG };

const NAMES = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' };

/** A piece as an element, for use on or off the board. */
export function pieceEl(piece, tag = 'span') {
  const el = document.createElement(tag);
  setPiece(el, piece);
  return el;
}
function setPiece(el, piece) {
  if (el.dataset.p === piece && el.dataset.style === pieceStyle()) return;
  el.dataset.p = piece;
  el.dataset.style = pieceStyle();
  el.className = `pc ${colorOf(piece)}`;
  el.innerHTML = pieceSVG(piece.toLowerCase());
}

/** Redraw every piece on the page, after the piece style changes. */
export function redrawPieces() {
  for (const el of document.querySelectorAll('.pc')) {
    const piece = el.dataset.p ?? el.dataset.piece;
    if (!piece) continue;
    el.innerHTML = pieceSVG(piece.toLowerCase());
    if (el.dataset.p) el.dataset.style = pieceStyle();
  }
}

export class Board {
  /** handlers (optional, makes the board playable): press(sq) → may drag?, release(sq, dragged) → moved? */
  constructor(root, handlers = null) {
    this.root = root;
    this.handlers = handlers;
    this.flip = false;
    this.pieces = new Map();        // square → piece element
    this.position = Array(64).fill(null);
    this.drag = null;
    root.classList.add('board');
    this.grid = Object.assign(document.createElement('div'), { className: 'squares' });
    this.layer = Object.assign(document.createElement('div'), { className: 'pieces' });
    root.append(this.grid, this.layer);
    this.buildSquares();
    if (handlers) this.listen();
  }

  /** Show the board from one side: 'w' has white at the bottom. */
  setView(color) {
    this.flip = color === 'b';
    this.buildSquares();
    this.still(() => { for (const [sq, el] of this.pieces) this.put(el, sq); });
    this.label();
  }

  buildSquares() {
    this.cells = Array(64);
    const made = [];
    for (let n = 0; n < 64; n++) {
      const sq = this.flip ? 63 - n : n;
      const cell = document.createElement(this.handlers ? 'button' : 'div');
      if (this.handlers) cell.type = 'button';
      cell.className = `sq ${((sq >> 3) + sq) & 1 ? 'dark' : 'light'}`;
      cell.dataset.sq = sq;
      const name = squareName(sq);
      if (n % 8 === 0) cell.dataset.rank = name[1];
      if (n >= 56) cell.dataset.file = name[0];
      this.cells[sq] = cell;
      made.push(cell);
    }
    this.grid.replaceChildren(...made);
  }

  put(el, sq) {
    el.style.setProperty('--col', this.flip ? 7 - (sq & 7) : sq & 7);
    el.style.setProperty('--row', this.flip ? 7 - (sq >> 3) : sq >> 3);
  }

  /** Run changes with animation switched off. */
  still(change) {
    this.root.classList.add('still');
    change();
    void this.root.offsetWidth;
    this.root.classList.remove('still');
  }

  label() {
    if (!this.handlers) return;
    this.cells.forEach((cell, sq) => {
      const piece = this.position[sq];
      const what = piece ? `, ${colorOf(piece) === 'w' ? 'white' : 'black'} ${NAMES[piece.toLowerCase()]}` : '';
      cell.setAttribute('aria-label', squareName(sq) + what);
    });
  }

  /**
   * Make the board match a position. Pieces glide to where they now belong;
   * `move` (the move just played) says which piece went where, so the right
   * one travels. `instant` skips the animation.
   */
  sync(position, { move = null, instant = false } = {}) {
    if (instant) return this.still(() => this.sync(position, { move }));
    const free = new Map(this.pieces);
    const next = new Map();
    const travel = (el, sq) => {
      this.put(el, sq);
      el.classList.add('moving');
      setTimeout(() => el.classList.remove('moving'), 450);
    };

    if (move && free.has(move.from) && position[move.to]) {
      const el = free.get(move.from);
      free.delete(move.from);
      setPiece(el, position[move.to]);          // a promoted pawn changes shape
      travel(el, move.to);
      next.set(move.to, el);
    }
    for (const [sq, el] of free) {
      if (!next.has(sq) && position[sq] === el.dataset.p) {
        next.set(sq, el);
        free.delete(sq);
      }
    }
    for (let sq = 0; sq < 64; sq++) {
      const piece = position[sq];
      if (!piece || next.has(sq)) continue;
      const from = [...free.keys()].find((k) => free.get(k).dataset.p === piece);
      let el;
      if (from !== undefined) {
        el = free.get(from);
        free.delete(from);
        travel(el, sq);
      } else {
        el = pieceEl(piece, 'div');
        el.classList.add('piece');
        this.put(el, sq);
        this.layer.append(el);
      }
      next.set(sq, el);
    }
    // Whatever is left over was captured.
    const quick = this.root.classList.contains('still');
    for (const el of free.values()) {
      if (quick) { el.remove(); continue; }
      el.classList.add('gone');
      setTimeout(() => el.remove(), 500);
    }
    for (const el of next.values()) el.classList.add('piece');
    this.pieces = next;
    this.position = position.slice();
    this.label();
  }

  /** movable: Set of squares; targets: Map square → is a capture; last: [from, to]; check: square. */
  setHints({ movable = new Set(), selected = null, targets = new Map(), last = null, check = null } = {}) {
    this.cells.forEach((cell, sq) => {
      cell.classList.toggle('can', movable.has(sq));
      cell.classList.toggle('sel', sq === selected);
      cell.classList.toggle('target', targets.has(sq));
      cell.classList.toggle('capture', targets.get(sq) === true);
      cell.classList.toggle('last', Boolean(last?.includes(sq)));
      cell.classList.toggle('check', sq === check);
    });
    for (const [sq, el] of this.pieces) el.classList.toggle('sel', sq === selected);
  }

  squareAt(event) {
    const box = this.grid.getBoundingClientRect();
    const col = Math.floor(((event.clientX - box.left) / box.width) * 8);
    const row = Math.floor(((event.clientY - box.top) / box.height) * 8);
    if (col < 0 || col > 7 || row < 0 || row > 7) return null;
    return this.flip ? 63 - (row * 8 + col) : row * 8 + col;
  }

  listen() {
    const { root, handlers } = this;

    root.addEventListener('pointerdown', (event) => {
      if (event.button || this.drag) return;
      const sq = this.squareAt(event);
      if (sq === null || !handlers.press(sq)) return;
      this.drag = { sq, id: event.pointerId, x: event.clientX, y: event.clientY, el: this.pieces.get(sq), active: false };
      try { root.setPointerCapture(event.pointerId); } catch {}
    });

    root.addEventListener('pointermove', (event) => {
      const drag = this.drag;
      if (!drag?.el || event.pointerId !== drag.id) return;
      if (!drag.active && Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 6) return;
      drag.active = true;
      const box = this.layer.getBoundingClientRect();
      const half = box.width / 16;
      drag.el.classList.add('drag');
      drag.el.style.translate = `${event.clientX - box.left - half}px ${event.clientY - box.top - half}px`;
    });

    const drop = (event, cancelled) => {
      const drag = this.drag;
      if (!drag || event.pointerId !== drag.id) return;
      this.drag = null;
      if (!drag.active) {
        if (!cancelled) handlers.release(drag.sq, false);
        return;
      }
      const moved = !cancelled && handlers.release(this.squareAt(event), true);
      const el = drag.el;
      if (moved) {
        // Dropped on its new square: settle there without gliding.
        el.style.translate = '';
        void el.offsetWidth;
        el.classList.remove('drag');
      } else {
        // Not a move: let it glide home.
        el.classList.remove('drag');
        void el.offsetWidth;
        el.style.translate = '';
      }
    };
    root.addEventListener('pointerup', (event) => drop(event, false));
    root.addEventListener('pointercancel', (event) => drop(event, true));

    // Keyboard (and assistive tech) activate a square without pointer events.
    this.grid.addEventListener('click', (event) => {
      if (event.detail !== 0) return;
      const cell = event.target.closest('.sq');
      if (!cell) return;
      const sq = Number(cell.dataset.sq);
      if (handlers.press(sq)) handlers.release(sq, false);
    });
  }
}
