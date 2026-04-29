# Headed Playwright via noVNC (GitHub Actions)

This repo runs Playwright in headed mode on a GitHub Actions runner and exposes the virtual desktop via noVNC using a cloudflared quick tunnel.

## Local usage

1. Install deps:

```sh
npm install
```

2. Install Chromium:

```sh
npm run pw:install
```

3. Run headed:

```sh
node ./src/run-headed.mjs https://example.com
```

## GitHub Actions usage

1. Go to **Actions** tab.
2. Run workflow **Headed Playwright (noVNC + cloudflared)**.
3. Enter the target URL.
4. Open the **noVNC URL** printed in the run summary.

The workflow keeps running until it times out or you cancel it.
