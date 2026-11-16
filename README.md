# Chess

Peer-to-peer chess for two, played in the browser at [mco.dev/chess](https://mco.dev/chess/).

It is a static app with no build step: open `index.html` from any web server. The two players connect directly to each other using [PeerJS](https://peerjs.com/) (vendored in `vendor/`).

This repo is mounted in [mco-gh/mco.dev](https://github.com/mco-gh/mco.dev) as a git submodule at `static/chess`. After pushing a change here, update the submodule pointer there to publish it:

```bash
cd mco.dev
git submodule update --remote static/chess
git commit -am "Update chess"
git push
```
