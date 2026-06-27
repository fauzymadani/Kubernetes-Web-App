const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;
const MESSAGE = process.env.APP_MESSAGE || "Set APP_MESSAGE to change me";
const POD = process.env.HOSTNAME || "unknown";

let visits = 0;

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.get("/", (_req, res) => {
  visits++;
  res.send(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>KubeApp</title>
<style>
  :root { color-scheme: light dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh;
    display: grid; place-items: center;
    font: 16px/1.5 system-ui, sans-serif;
    background: linear-gradient(135deg, #1e3a8a, #6d28d9);
    color: #f8fafc;
  }
  .card {
    background: rgba(15, 23, 42, 0.55);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 16px;
    padding: 2.5rem;
    width: min(92vw, 460px);
    box-shadow: 0 20px 50px rgba(0,0,0,0.35);
  }
  h1 { margin: 0 0 1.5rem; font-size: 1.4rem; font-weight: 600; }
  .message {
    font-size: 1.6rem; font-weight: 700; text-align: center;
    margin: 0 0 1.75rem; padding: 1.25rem;
    background: rgba(255,255,255,0.08);
    border-radius: 12px;
  }
  dl { display: grid; grid-template-columns: auto 1fr; gap: 0.6rem 1rem; margin: 0; }
  dt { color: #cbd5e1; }
  dd { margin: 0; text-align: right; font-variant-numeric: tabular-nums; word-break: break-all; }
  code { font-family: ui-monospace, monospace; }
</style>
</head>
<body>
  <main class="card">
    <h1>☸️ Kubernetes Learning App</h1>
    <p class="message">${MESSAGE}</p>
    <dl>
      <dt>Pod / hostname</dt><dd><code>${POD}</code></dd>
      <dt>Timestamp</dt><dd>${new Date().toISOString()}</dd>
      <dt>Page visits</dt><dd>${visits}</dd>
    </dl>
  </main>
</body>
</html>`);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
