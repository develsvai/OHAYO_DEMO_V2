const segmenter = new Intl.Segmenter('ko', { granularity: 'grapheme' });

export function graphemes(value) {
  return [...segmenter.segment(value)].map(({ segment, index }) => ({ text: segment, offset: index }));
}

export function cellWidth(value) {
  if (!value || /^[\p{Mark}\u200d\ufe0f]+$/u.test(value)) return 0;
  const code = value.codePointAt(0);
  return /\p{Extended_Pictographic}/u.test(value) ||
    (code >= 0x1100 && (code <= 0x115f || code === 0x2329 || code === 0x232a ||
      (code >= 0x2e80 && code <= 0xa4cf) || (code >= 0xac00 && code <= 0xd7a3) ||
      (code >= 0xf900 && code <= 0xfaff) || (code >= 0xfe10 && code <= 0xfe6f) ||
      (code >= 0xff01 && code <= 0xff60) || (code >= 0xffe0 && code <= 0xffe6) ||
      (code >= 0x1f1e6 && code <= 0x1f1ff) || code >= 0x20000)) ? 2 : 1;
}

// Keep every grapheme and source offset: wrapping never crops the input value.
export function layoutPrompt(value, columns) {
  const width = Math.max(2, columns);
  const lines = [''];
  const widths = [0];
  const positions = [];
  let row = 0;
  for (const { text, offset } of graphemes(value)) {
    if (text === '\n') {
      positions.push({ offset, row, column: widths[row] });
      lines.push(''); widths.push(0); row += 1;
      continue;
    }
    const cells = cellWidth(text);
    if (widths[row] + cells > width) { lines.push(''); widths.push(0); row += 1; }
    positions.push({ offset, row, column: widths[row] });
    lines[row] += text;
    widths[row] += cells;
  }
  positions.push({ offset: value.length, row, column: widths[row] });
  return { lines, widths, positions };
}

export function createPromptRenderer(output, colors) {
  let cursorRow = 0;
  let drawn = false;
  let firstRow = 0;
  let lastLayout;

  function render(value = '', cursor = value.length) {
    const columns = Math.max(12, output.columns || 100);
    const width = columns - 4;
    const layout = layoutPrompt(value, width);
    const caret = layout.positions.find((point) => point.offset >= cursor) ?? layout.positions.at(-1);
    const maxRows = Math.max(1, (output.rows || 30) - 6);
    firstRow = Math.max(0, Math.min(firstRow, caret.row, Math.max(0, layout.lines.length - maxRows)));
    if (caret.row >= firstRow + maxRows) firstRow = caret.row - maxRows + 1;
    const count = Math.min(maxRows, Math.max(3, layout.lines.length));
    const panel = (content, used = 0) => `${colors.panel}${content}${' '.repeat(Math.max(0, columns - 1 - used))}${colors.reset}`;
    const rows = [panel('')];
    for (let index = 0; index < count; index += 1) {
      const line = firstRow + index;
      const text = layout.lines[line] ?? '';
      const placeholder = !value && index === 0 ? 'Ask Codex to do anything' : '';
      const display = placeholder ? layoutPrompt(placeholder, width).lines[0] : text;
      const used = placeholder ? layoutPrompt(display, width).widths[0] : (layout.widths[line] ?? 0);
      rows.push(panel(`${line === 0 ? '› ' : '  '}${placeholder ? colors.gray : colors.white}${display}`, used + 2));
    }
    rows.push(panel(''));
    const status = '  gpt-5.6-sol xhigh fast · ~/Desktop/Flogy/OHAYO_DEMO_V2';
    rows.push(`${colors.cream}${layoutPrompt(status, columns - 1).lines[0]}${colors.reset}`);
    const hint = layout.lines.length > maxRows
      ? `  ${firstRow + 1}–${Math.min(firstRow + count, layout.lines.length)} / ${layout.lines.length}줄 · ↑↓ 이동 · Enter 전송`
      : '  Enter 전송 · Alt+Enter 줄바꿈 · ↑↓ 이동';
    rows.push(`${colors.gray}${layoutPrompt(hint, columns - 1).lines[0]}${colors.reset}`);
    const targetRow = 1 + caret.row - firstRow;
    const up = rows.length - 1 - targetRow;
    output.write(`${drawn ? `\r${cursorRow ? `\x1b[${cursorRow}A` : ''}\x1b[J` : '\r'}${rows.join('\r\n')}\r${up ? `\x1b[${up}A` : ''}\x1b[${caret.column + 2}C`);
    cursorRow = targetRow;
    drawn = true;
    lastLayout = { ...layout, caret, renderedRows: rows.length };
    return lastLayout;
  }

  return {
    render,
    resize(value, cursor) {
      // A terminal may reflow the previous lines on resize. Start a fresh block
      // instead of moving through a now-invalid count of physical rows.
      output.write('\r\n'); drawn = false; cursorRow = 0;
      return render(value, cursor);
    },
    finish(value, cursor) {
      const layout = render(value, cursor);
      output.write(`\r\x1b[${layout.renderedRows - 1 - cursorRow}B\r\n`);
    },
  };
}
