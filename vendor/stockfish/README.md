# Stockfish

The chess engine behind "Play the computer": Stockfish 19, as built for the browser
by Stockfish.js (the lite, single-threaded WebAssembly build). It runs as a Web Worker
and the app talks to it over the standard UCI text protocol.

- Version: npm package `stockfish@19.0.1` (`bin/stockfish-19-lite-single.js` and `.wasm`, unmodified)
- Stockfish.js source: https://github.com/nmrugg/stockfish.js (tag v19.0.1)
- Stockfish source: https://github.com/official-stockfish/Stockfish
- License: GNU GPL v3, in `COPYING.txt`. Stockfish is a separate program; these two files are
  distributed unmodified, and the source for them is at the links above.
