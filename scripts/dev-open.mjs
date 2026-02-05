import fs from 'node:fs';
import net from 'node:net';
import { spawn, spawnSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const HOST = '127.0.0.1';
const BASE_PORT = Number(process.env.PORT) || 3000;
const MAX_TRIES = 15;
const LOCK_PATH = new URL('../.next/dev/lock', import.meta.url);

const isPortFree = (port) =>
  new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port, HOST);
  });

const isPortOpen = (port) =>
  new Promise((resolve) => {
    const socket = net.connect({ host: HOST, port }, () => {
      socket.end();
      resolve(true);
    });
    socket.setTimeout(250);
    socket.on('error', () => resolve(false));
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
  });

const lockExists = () => fs.existsSync(LOCK_PATH);

if (lockExists()) {
  const killPort = (port) => {
    if (process.platform === 'win32') return;
    const result = spawnSync('lsof', ['-tiTCP:' + port, '-sTCP:LISTEN'], {
      encoding: 'utf-8',
    });
    if (result.status !== 0 || !result.stdout) return;
    const pids = result.stdout
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    if (pids.length === 0) return;
    spawnSync('kill', ['-9', ...pids], { stdio: 'ignore' });
  };

  for (let i = 0; i < MAX_TRIES; i += 1) {
    const candidate = BASE_PORT + i;
    if (await isPortOpen(candidate)) killPort(candidate);
  }

  try {
    fs.unlinkSync(LOCK_PATH);
  } catch {
    // If we can't remove it, Next.js will surface the error.
  }
}

let port = BASE_PORT;
for (let i = 0; i < MAX_TRIES; i += 1) {
  if (await isPortFree(port)) break;
  port += 1;
}

const url = `http://${HOST}:${port}`;
console.log(`Starting Next.js dev server on ${url}`);

const child = spawn('npx', ['next', 'dev', '--hostname', HOST, '--port', String(port)], {
  stdio: 'inherit',
});

const openCmd = process.platform === 'darwin'
  ? ['open', [url]]
  : process.platform === 'win32'
    ? ['cmd', ['/c', 'start', url]]
    : ['xdg-open', [url]];

(async () => {
  await delay(1500);
  try {
    spawn(openCmd[0], openCmd[1], { stdio: 'ignore' });
  } catch {
    // Non-fatal: dev server is still running.
  }
})();

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
