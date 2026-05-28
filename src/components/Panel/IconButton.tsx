import type { ButtonHTMLAttributes } from 'react';

const BASE_CLASS =
  'inline-flex items-center gap-1.5 rounded-lg border border-border bg-transparent px-[11px] py-1.5 ' +
  'text-xs font-medium text-muted transition ' +
  'not-disabled:cursor-pointer not-disabled:hover:border-border-strong not-disabled:hover:bg-hover ' +
  'not-disabled:hover:text-content not-disabled:active:translate-y-px ' +
  'disabled:cursor-not-allowed disabled:opacity-45';

/**
 * Compact bordered button used for panel header actions (load, paste, copy …).
 * Shared so the input and output panels render identical action chrome (DRY).
 */
export function IconButton({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={className ? `${BASE_CLASS} ${className}` : BASE_CLASS} {...props} />;
}
