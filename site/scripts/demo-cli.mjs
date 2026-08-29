#!/usr/bin/env node

import { createInterface } from 'node:readline/promises';
import process from 'node:process';
import { StringDecoder } from 'node:string_decoder';
import { buildStages } from '../lib/scenario.ts';

const speed = Math.max(1, Number(process.env.OHAYO_DEMO_SPEED) || 1);
const viewerUrl = process.env.OHAYO_VIEWER_URL || 'http://localhost:3000/?screen=viewer';
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
  const width = Math.max(72, process.stdout.columns || 100);
  const placeholder = 'Ask Codex to do anything';
  const raw = `› ${value || placeholder}`;
  const padding = ' '.repeat(Math.max(1, width - visibleWidth(raw)));
  const content = value
    ? `${colors.white}› ${value}`
    : `${colors.white}› ${colors.gray}${placeholder}`;
  process.stdout.write(`\r${colors.panel}${content}${colors.panel}${padding}${colors.reset}`);
  process.stdout.write(`\r\x1b[${2 + visibleWidth(value)}C`);
}

function printStatusLine() {
  console.log(`${color('  gpt-5.6-sol xhigh fast', 'cream')}  ${color('·', 'gray')}  ${color('~/Desktop/Flogy/OHAYO_DEMO_V2', 'green')}`);
}

async function readPrompt() {
  if (!tty) {
    const input = createInterface({ input: process.stdin, output: process.stdout });
    try {
      return await input.question('› ');
    } finally {
      input.close();
    }
  }

  return new Promise((resolvePromise, rejectPromise) => {
    const decoder = new StringDecoder('utf8');
    let value = '';
    process.stdin.setRawMode(true);
    process.stdin.resume();
    renderPromptBar();
    process.stdout.write('\n');
    printStatusLine();
    process.stdout.write('\x1b[2A\r\x1b[2C');

    const cleanup = () => {
      process.stdin.off('data', onData);
      process.stdin.setRawMode(false);
      process.stdin.pause();
    };

    const finish = () => {
      renderPromptBar(value);
      process.stdout.write('\x1b[1B\r\n');
      cleanup();
      resolvePromise(value);
    };

    const onData = (chunk) => {
      const input = decoder.write(chunk);
      if (input === '\u0003') {
        cleanup();
        process.stdout.write(colors.reset);
        rejectPromise(Object.assign(new Error('중단됨'), { code: 'SIGINT' }));
        return;
      }
      const endIndex = input.search(/[\r\n]/);
      const content = endIndex >= 0 ? input.slice(0, endIndex) : input;
      if (content === '\u007f' || content === '\b') {
        value = [...value].slice(0, -1).join('');
      } else if (content && !content.startsWith('\u001b')) {
        value += content.replace(/[\u0000-\u001f\u007f]/g, '');
      }
      renderPromptBar(value);
      if (endIndex >= 0) finish();
    };

    process.stdin.on('data', onData);
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
  console.log(`  ${color('✓', 'green')} ${color(`STEP ${stage.id} 완료`, 'bold')} ${stage.id < 5 ? color('· 다음 단계 진행', 'gray') : ''}`);
}

export async function runDemoCli() {
  printBanner();
  const answer = await readPrompt();

  console.log();
  console.log(`  ${color('• Thinking', 'bold')}`);
  await waitWithSpinner(2_000, '저장소 구조와 현재 Harness 상태를 확인하는 중…');
  console.log(`  ${color('✓', 'green')} 제품 개발 Lifecycle과 Orchestrator 경계를 확인했습니다.`);
  console.log(`  ${color('✓', 'green')} 요청을 5개 Harness Layer로 분해했습니다.`);
  if (answer.trim()) console.log(`  ${color('✓', 'green')} 작업 목표: ${color(answer.trim(), 'gray')}`);

  for (const stage of buildStages) await runStage(stage);

  console.log();
  console.log(color('  ────────────────────────────────────────────────────────', 'gray'));
  console.log(`  ${color('✓ AUTO PLAN LOOM 구성 완료', 'green')}`);
  console.log(`  ${color('✓ 5 / 5 COMPLETE', 'green')}`);
  console.log();
  console.log(`  ${color('Harness Viewer', 'bold')}  ${color(viewerUrl, 'cyan')}`);
  console.log(color('  브라우저에서 최종 Mermaid Viewer를 여는 중…', 'gray'));
  await sleep(Math.max(300, 1_200 / speed));
}
