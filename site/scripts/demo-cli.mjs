#!/usr/bin/env node

import { createInterface } from 'node:readline/promises';
import process from 'node:process';
import { buildStages } from '../lib/scenario.ts';

const speed = Math.max(1, Number(process.env.OHAYO_DEMO_SPEED) || 1);
const viewerUrl = process.env.OHAYO_VIEWER_URL || 'http://localhost:3000/?screen=viewer';
const tty = Boolean(process.stdout.isTTY);
const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

const colors = {
  reset: '\x1b[0m', dim: '\x1b[2m', bold: '\x1b[1m', cyan: '\x1b[38;5;87m',
  green: '\x1b[38;5;119m', violet: '\x1b[38;5;141m', gray: '\x1b[38;5;245m',
};

function color(value, tone) {
  return tty ? `${colors[tone]}${value}${colors.reset}` : value;
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, Math.max(0, milliseconds)));
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

function printBanner() {
  if (tty) process.stdout.write('\x1bc');
  console.log(color('╭────────────────────────────────────────────────────────────╮', 'gray'));
  console.log(`${color('│', 'gray')}  ${color('Flogi Agent', 'bold')}                                               ${color('│', 'gray')}`);
  console.log(`${color('│', 'gray')}  ${color('Autonomous Harness Builder · 고정 시나리오', 'gray')}                 ${color('│', 'gray')}`);
  console.log(color('╰────────────────────────────────────────────────────────────╯', 'gray'));
  console.log();
  console.log(color('  아무 문장이나 한 번 입력하면 STEP 1~5가 자동 실행됩니다.', 'gray'));
  console.log(color('  입력 내용은 표시만 되며 실행 순서에는 영향을 주지 않습니다.', 'dim'));
  console.log();
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
  console.log(`  ${color('✓', 'green')} ${color(`STEP ${stage.id} 완료`, 'bold')} ${stage.id < 5 ? color('· 다음 단계 자동 진행', 'gray') : ''}`);
}

async function main() {
  printBanner();
  const input = createInterface({ input: process.stdin, output: process.stdout });
  let answer = '';
  try {
    answer = await input.question(color('› ', 'cyan'));
  } finally {
    input.close();
  }

  console.log();
  console.log(`  ${color('›', 'cyan')} ${answer || '(빈 입력)'}`);
  console.log();
  console.log(`  ${color('• Thinking', 'bold')}`);
  await waitWithSpinner(2_000, '고정 Harness Scenario 확인 중…');
  console.log(`  ${color('✓', 'green')} 5개의 canonical instruction을 불러왔습니다.`);
  console.log(`  ${color('✓', 'green')} 총 실행 시간 약 5분 · 입력 추가 없음`);

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

main().catch((error) => {
  if (error?.code === 'ERR_USE_AFTER_CLOSE') process.exit(0);
  console.error('\nCLI 연출을 완료하지 못했습니다.', error);
  process.exit(1);
});
