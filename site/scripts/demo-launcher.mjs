#!/usr/bin/env node

import { closeSync, existsSync, openSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import process from 'node:process';
import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const siteDirectory = resolve(scriptDirectory, '..');
const port = Math.max(1, Number(process.env.DEMO_PORT) || 3000);
const serverUrl = `http://localhost:${port}/`;
const logPath = resolve(process.env.TMPDIR || tmpdir(), 'flogi-ohayo-demo-v2.log');
const modes = {
  test: { id: '1', name: '5분 테스트 모드', speed: 7 },
  demo: { id: '2', name: '데모 모드', speed: 1 },
};

function sleep(milliseconds) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));
}

async function serverIsReady() {
  try {
    const response = await fetch(serverUrl, { signal: AbortSignal.timeout(900) });
    return response.ok;
  } catch {
    return false;
  }
}

async function ensureViewerServer() {
  if (!existsSync(resolve(siteDirectory, 'node_modules'))) {
    throw new Error('site 의존성이 없습니다. 먼저 site 폴더에서 npm install을 실행하세요.');
  }

  if (await serverIsReady()) return;

  const logFile = openSync(logPath, 'a');
  const server = spawn('npm', ['run', 'dev', '--', '--port', String(port)], {
    cwd: siteDirectory,
    detached: true,
    env: process.env,
    stdio: ['ignore', logFile, logFile],
  });
  server.unref();
  closeSync(logFile);

  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (await serverIsReady()) return;
    await sleep(250);
  }

  throw new Error(`Web Viewer를 시작하지 못했습니다. 로그: ${logPath}`);
}

function requestedMode() {
  const value = process.env.DEMO_MODE?.trim().toLowerCase();
  if (value === '1' || value === 'test') return modes.test;
  if (value === '2' || value === 'demo') return modes.demo;
  return null;
}

async function chooseMode() {
  const preset = requestedMode();
  if (preset) return preset;
  if (!process.stdin.isTTY || !process.stdout.isTTY) return modes.test;

  const input = createInterface({ input: process.stdin, output: process.stdout });
  try {
    console.log('\nOHAYO DEMO\n');
    console.log('실행 모드를 선택하세요.\n');
    console.log('  1  5분 테스트 모드');
    console.log('     전체 흐름을 5분 이내로 빠르게 검증합니다.\n');
    console.log('  2  데모 모드');
    console.log('     발표 기준 시간으로 실행합니다.\n');

    while (true) {
      const answer = (await input.question('선택 › ')).trim();
      if (answer === modes.test.id) return modes.test;
      if (answer === modes.demo.id) return modes.demo;
      console.log('1 또는 2를 입력해주세요.\n');
    }
  } finally {
    input.close();
  }
}

function openViewer(viewerUrl) {
  if (process.env.DEMO_NO_OPEN === '1') {
    console.log(`Harness Viewer  ${viewerUrl}`);
    return;
  }

  const command = process.platform === 'darwin' ? 'open' : 'xdg-open';
  const browser = spawn(command, [viewerUrl], { detached: true, stdio: 'ignore' });
  browser.on('error', () => console.log(`브라우저에서 다음 주소를 열어주세요: ${viewerUrl}`));
  browser.unref();
}

async function main() {
  const mode = await chooseMode();
  const speed = mode.speed;
  const viewerUrl = `${serverUrl}?screen=viewer&reset=1&speed=${speed}`;
  await ensureViewerServer();
  process.env.OHAYO_DEMO_SPEED = String(speed);
  process.env.OHAYO_VIEWER_URL = viewerUrl;
  const { runDemoCli } = await import('./demo-cli.mjs');
  await runDemoCli();
  openViewer(viewerUrl);
}

main().catch((error) => {
  console.error(`[오류] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
