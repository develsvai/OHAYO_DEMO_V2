#!/usr/bin/env node

import { createInterface } from 'node:readline/promises';
import process from 'node:process';
import { StringDecoder } from 'node:string_decoder';
import { buildStages } from '../lib/scenario.ts';

const speed = Math.max(1, Number(process.env.OHAYO_DEMO_SPEED) || 1);
const tty = Boolean(process.stdin.isTTY && process.stdout.isTTY);
const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

const colors = {
  reset: '\x1b[0m', dim: '\x1b[2m', bold: '\x1b[1m', cyan: '\x1b[38;5;51m',
  green: '\x1b[38;5;114m', violet: '\x1b[38;5;207m', gray: '\x1b[38;5;245m',
  cream: '\x1b[38;5;222m', panel: '\x1b[48;5;236m', white: '\x1b[38;5;255m',
};

function color(value, tone) {
  return tty ? `${colors[tone]}${value}${colors.reset}` : value;
}

function sleep(milliseconds) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, Math.max(0, milliseconds)));
}

function visibleWidth(value) {
  return [...value].reduce((width, character) => width + (/[^\u0000-\u00ff]/.test(character) ? 2 : 1), 0);
}

function padLine(value, width) {
  return `${value}${' '.repeat(Math.max(0, width - visibleWidth(value)))}`;
}

function printBox(lines, width) {
  console.log(color(`┌${'─'.repeat(width)}┐`, 'gray'));
  for (const line of lines) {
    const content = padLine(line.text, width - 2);
    console.log(`${color('│', 'gray')} ${line.render(content)} ${color('│', 'gray')}`);
  }
  console.log(color(`└${'─'.repeat(width)}┘`, 'gray'));
}

function printBanner() {
  if (tty) process.stdout.write('\x1bc');

  printBox([
    { text: '✨ Update available! 0.149.1 -> 0.150.1', render: (value) => color(value, 'cyan') },
    { text: 'Run brew upgrade --cask codex to update.', render: (value) => value.replace('brew upgrade --cask codex', color('brew upgrade --cask codex', 'cyan')) },
    { text: '', render: (value) => value },
    { text: 'See full release notes:', render: (value) => value },
    { text: 'https://github.com/openai/codex/releases/latest', render: (value) => color(value, 'cyan') },
  ], 60);

  console.log();
  console.log();
  printBox([
    { text: '>_ OpenAI Codex (v0.149.1)', render: (value) => value.replace('>_', color('>_', 'gray')).replace('OpenAI Codex', color('OpenAI Codex', 'bold')).replace('(v0.149.1)', color('(v0.149.1)', 'gray')) },
    { text: '', render: (value) => value },
    { text: 'model:     gpt-5.6-sol xhigh   fast    /model to change', render: (value) => value.replace('model:', color('model:', 'gray')).replace('gpt-5.6-sol xhigh', color('gpt-5.6-sol xhigh', 'white')).replace('fast', color('fast', 'violet')).replace('/model', color('/model', 'cyan')).replace('to change', color('to change', 'gray')) },
    { text: 'directory: ~/Desktop/Flogy/OHAYO_DEMO_V2', render: (value) => value.replace('directory:', color('directory:', 'gray')) },
  ], 68);

  console.log();
  console.log(`${color('Tip:', 'bold')} Try the ${color('Desktop app', 'bold')}. Run ${color("'codex app'", 'white')} or visit https://chatgpt.com/codex?app-landing-page=true`);
  console.log();
}

function renderPromptBar(value = '') {
  const width = Math.max(20, process.stdout.columns || 100);
  const placeholder = 'Ask Codex to do anything';
  const characters = [...value.replace(/\r\n?/g, '\n').replaceAll('\n', ' ↵ ')];
  let displayWidth = visibleWidth(characters.join(''));
  while (displayWidth > width - 5 && characters.length) {
    displayWidth -= visibleWidth(characters.shift());
  }
  const display = characters.join('');
  const content = value ? `${colors.white}› ${display}` : `${colors.white}› ${colors.gray}${placeholder}`;
  process.stdout.write(`\r\x1b[2K${colors.panel}${content}${colors.reset}`);
  process.stdout.write(`\r\x1b[${2 + visibleWidth(display)}C`);
}

function printStatusLine() {
  console.log(`${color('  gpt-5.6-sol xhigh fast', 'cream')}  ${color('·', 'gray')}  ${color('~/Desktop/Flogy/OHAYO_DEMO_V2', 'green')}`);
}

export async function readTerminalPrompt() {
  return new Promise((resolvePromise, rejectPromise) => {
    const decoder = new StringDecoder('utf8');
    let value = '';
    let pending = '';
    let pasting = false;
    const pasteStart = '\x1b[200~';
    const pasteEnd = '\x1b[201~';
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdout.write('\x1b[?2004h');
    renderPromptBar();
    process.stdout.write('\n');
    printStatusLine();
    process.stdout.write('\x1b[2A\r\x1b[2C');

    const cleanup = () => {
      process.stdin.off('data', onData);
      process.stdin.off('end', onEnd);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write('\x1b[?2004l');
    };
    const onEnd = () => {
      cleanup();
      rejectPromise(new Error('프롬프트 입력이 종료되었습니다.'));
    };
    const finish = () => {
      renderPromptBar(value);
      process.stdout.write('\x1b[1B\r\n');
      cleanup();
      resolvePromise(value.replace(/\r\n?/g, '\n'));
    };
    const onData = (chunk) => {
      const input = decoder.write(chunk);
      // Terminals without bracketed paste may deliver several lines together.
      // Keep them as one prompt; only a subsequent Enter submits it.
      if (!pasting && !pending && !input.includes('\x1b') && /[\r\n]/.test(input) && /[^\r\n]/.test(input) && !input.includes('\x03')) {
        value += input.replace(/\r\n?/g, '\n').replace(/[\x00-\x08\x0b-\x1f\x7f]/g, '');
        renderPromptBar(value);
        return;
      }
      pending += input;
      while (pending) {
        if (pending.startsWith('\x1b')) {
          if (pending.length < pasteStart.length && (pasteStart.startsWith(pending) || pasteEnd.startsWith(pending))) break;
          const escape = pending.match(/^\x1b\[[0-?]*[ -/]*[@-~]/)?.[0];
          if (escape) {
            if (escape === pasteStart) pasting = true;
            if (escape === pasteEnd) pasting = false;
            pending = pending.slice(escape.length);
          } else {
            pending = pending.slice(1);
          }
          continue;
        }
        const character = String.fromCodePoint(pending.codePointAt(0));
        pending = pending.slice(character.length);
        if (character === '\x03' || (!pasting && character === '\x04')) {
          cleanup();
          rejectPromise(Object.assign(new Error('중단됨'), { code: 'SIGINT' }));
          return;
        }
        if (pasting) {
          if (!/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(character)) value += character;
        } else if (character === '\r' || character === '\n') {
          finish();
          return;
        } else if (character === '\x7f' || character === '\b') {
          value = [...value].slice(0, -1).join('');
        } else if (!/[\x00-\x1f\x7f]/.test(character)) {
          value += character;
        }
      }
      renderPromptBar(value);
    };
    process.stdin.on('data', onData);
    process.stdin.once('end', onEnd);
  });
}

async function waitWithSpinner(milliseconds, label) {
  const duration = Math.max(0, milliseconds / speed);
  if (!tty || duration < 90) {
    await sleep(duration);
    return;
  }
  const startedAt = Date.now();
  let index = 0;
  while (Date.now() - startedAt < duration) {
    process.stdout.write(`\r  ${color(frames[index % frames.length], 'cyan')} ${color(label, 'gray')}`);
    index += 1;
    await sleep(Math.min(80, duration - (Date.now() - startedAt)));
  }
  process.stdout.write('\r\x1b[2K');
}

async function runStage(stage) {
  console.log();
  console.log(`${color(`  STEP ${stage.id} / 5`, 'violet')}  ${color(stage.title, 'bold')}`);
  console.log(`  ${color(stage.eyebrow, 'gray')}`);
  console.log();

  let elapsed = 0;
  for (const log of stage.logs) {
    await waitWithSpinner(log.at - elapsed, log.type === 'thinking' ? '생각 중…' : '작업 중…');
    elapsed = log.at;
    const marker = log.type === 'success' ? color('✓', 'green') : log.type === 'thinking' ? color('•', 'cyan') : color('•', 'violet');
    console.log(`  ${marker} ${log.text}`);
  }
  await waitWithSpinner(stage.duration - elapsed, '단계 마무리 중…');
  console.log(`  ${color('✓', 'green')} ${color(`STEP ${stage.id} 완료`, 'bold')}`);
}

export async function runDemoCli({
  baseUrl = 'http://localhost:3000/',
  openViewer = () => {},
  readInput,
  executeStage = runStage,
} = {}) {
  printBanner();
  const input = !readInput && !tty ? createInterface({ input: process.stdin, output: process.stdout }) : null;
  const lines = input?.[Symbol.asyncIterator]();

  async function nextPrompt() {
    while (true) {
      let answer;
      if (readInput) answer = await readInput();
      else if (tty) answer = await readTerminalPrompt();
      else {
        process.stdout.write('› ');
        const line = await lines.next();
        if (line.done) throw new Error('다음 단계의 프롬프트 입력이 필요합니다.');
        answer = line.value;
      }
      if (answer.trim()) return answer.trim();
      console.log('  프롬프트를 입력한 뒤 Enter를 눌러주세요.');
    }
  }

  try {
    for (const stage of buildStages) {
      console.log(`\n  ${color(`STEP ${stage.id} 입력`, 'violet')} · ${stage.eyebrow}`);
      await nextPrompt();
      await executeStage(stage);
      const url = new URL(`/harness/${stage.id}`, baseUrl);
      url.searchParams.set('speed', String(speed));
      console.log(`\n  ${color(`STEP ${stage.id} Harness Viewer`, 'bold')}  ${color(url.href, 'cyan')}`);
      await openViewer(url.href);
      console.log(color('  다이어그램 설명 후 터미널로 돌아와 다음 입력을 진행하세요.', 'gray'));
    }

    console.log(`\n  ${color('✓ AUTO PLAN LOOM 구성 완료', 'green')}`);
    console.log(`\n  ${color('STEP 6 입력', 'violet')} · /harness — Loom 실행 화면 열기`);
    await nextPrompt();
    const url = new URL('/', baseUrl);
    url.searchParams.set('screen', 'run');
    url.searchParams.set('reset', '1');
    url.searchParams.set('speed', String(speed));
    console.log(`\n  ${color('Loom 제품 프롬프트', 'bold')}  ${color(url.href, 'cyan')}`);
    await openViewer(url.href);
  } finally {
    input?.close();
  }
}
