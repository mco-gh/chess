# Chess

Peer-to-peer chess for two, played in the browser at [mco.dev/chess](https://mco.dev/chess/).

You can also play the computer. It is [Stockfish](https://stockfishchess.org/) 19, the
free, open-source engine, in the lite single-threaded WebAssembly build from
[Stockfish.js](https://github.com/nmrugg/stockfish.js) (vendored, unmodified, in
`vendor/stockfish/` with its GPL v3 license). It runs as a Web Worker in the player's
browser; `engine.js` talks to it over UCI. Strengths from 1350 to 2500 use Stockfish's own
Elo limit (`UCI_Elo`, which can't go below 1320); Beginner and Novice instead ask for its
top few moves and pick among them at random, favoring the better ones; Max is full strength.

It is a static app with no build step: open `index.html` from any web server. The two players connect directly to each other using [PeerJS](https://peerjs.com/) (vendored in `vendor/`).

This repo is mounted in [mco-gh/mco.dev](https://github.com/mco-gh/mco.dev) as a git submodule at `static/chess`. After pushing a change here, update the submodule pointer there to publish it:

```bash
cd mco.dev
git submodule update --remote static/chess
git commit -am "Update chess"
git push
```

## Install on a phone

The app is an installable web app: `manifest.webmanifest` describes it, and `sw.js`
is a network-first service worker, so it is always current when online and still
opens offline. Nothing needs bumping on release. The icons in `icons/` are rendered
from the SVG sources by `bash build/icons/render.sh` (needs Google Chrome).

## Connecting through firewalls

Two browsers usually connect directly, with help from a public STUN server. When they
can't (mobile data, strict routers, browsers that block local connections), a TURN
relay carries the traffic. `ice.js` fetches short-lived relay credentials from
`/api/turn`, a Netlify Function in the mco.dev repo that asks Cloudflare for them;
if that isn't available it falls back to STUN only. If no route forms within 20
seconds, the app says so instead of waiting forever.
