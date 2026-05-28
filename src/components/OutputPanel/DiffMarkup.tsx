import type { ReactNode } from 'react';

const DIFF_ADD_CLASS = 'rounded-[3px] px-0.5 bg-[var(--diff-add-bg)] text-[var(--diff-add-text)]';
const DIFF_DEL_CLASS =
  'rounded-[3px] px-0.5 line-through bg-[var(--diff-del-bg)] text-[var(--diff-del-text)]';

/**
 * Splits LLM output containing `((add:NEU))` / `((del:ALT))` markers into
 * React nodes with diff-style highlighting. Unmarked text is rendered as-is.
 */
export function renderDiffMarkup(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let key = 0;

  while (cursor < text.length) {
    const delIdx = text.indexOf('((del:', cursor);
    const addIdx = text.indexOf('((add:', cursor);

    if (delIdx === -1 && addIdx === -1) {
      nodes.push(text.slice(cursor));
      break;
    }

    const next = delIdx === -1 ? addIdx : addIdx === -1 ? delIdx : Math.min(delIdx, addIdx);
    const kind: 'add' | 'del' = next === addIdx ? 'add' : 'del';

    if (next > cursor) nodes.push(text.slice(cursor, next));

    const close = text.indexOf('))', next);
    if (close === -1) {
      // Unterminated marker — render remainder verbatim.
      nodes.push(text.slice(next));
      break;
    }

    const inner = text.slice(next + 6, close);
    const className = kind === 'add' ? DIFF_ADD_CLASS : DIFF_DEL_CLASS;
    nodes.push(
      <span key={key++} className={className}>
        {inner}
      </span>,
    );
    cursor = close + 2;
  }
  return nodes;
}
