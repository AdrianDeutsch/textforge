import type { ReactNode } from 'react';

interface PanelProps {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}

/**
 * Generic framed panel with a header and an action slot. Used by input and
 * output panels so we don't repeat the chrome twice (DRY).
 */
export function Panel({ title, actions, children }: PanelProps) {
  return (
    <section className="flex flex-col overflow-hidden rounded-card border border-border bg-surface shadow-soft transition focus-within:border-border-strong focus-within:shadow-card">
      <div className="flex items-center justify-between border-b border-border bg-elevated px-4 py-[13px]">
        <h3 className="m-0 text-xs font-semibold tracking-[1px] text-muted uppercase">{title}</h3>
        <div className="flex gap-1.5">{actions}</div>
      </div>
      {children}
    </section>
  );
}
