import { spawn, spawnSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const HOST = '127.0.0.1';
const PORT = Number(process.env.STORYBOOK_PORT) || Number(process.env.PORT) || 6006;

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

killPort(PORT);

const url = `http://${HOST}:${PORT}`;
const openCmd = process.platform === 'darwin'
  ? ['open', [url]]
  : process.platform === 'win32'
    ? ['cmd', ['/c', 'start', url]]
    : ['xdg-open', [url]];

const child = spawn('npx', ['storybook', 'dev', '-p', String(PORT), '--host', HOST], {
  stdio: 'inherit',
});

// Give Storybook a moment to boot before opening.
(async () => {
  await delay(1500);
  try {
    spawn(openCmd[0], openCmd[1], { stdio: 'ignore' });
  } catch {
    // Ignore open failures.
  }
})();

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
