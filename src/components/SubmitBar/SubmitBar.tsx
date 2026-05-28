import { Spinner } from '../Spinner/Spinner';

interface SubmitBarProps {
  loading: boolean;
  status: string;
  onSubmit: () => void;
}

export function SubmitBar({ loading, status, onSubmit }: SubmitBarProps) {
  return (
    <div className="mt-[18px] flex items-center justify-end gap-3">
      <div className="mr-auto text-[13px] text-muted">{status}</div>
      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className="inline-flex items-center gap-2.5 rounded-btn bg-accent px-[30px] py-3 text-[15px] font-semibold text-on-accent shadow-[0_4px_16px_var(--accent-glow)] transition not-disabled:cursor-pointer not-disabled:hover:-translate-y-px not-disabled:hover:bg-accent-hover not-disabled:hover:shadow-[0_6px_20px_var(--accent-glow)] not-disabled:active:translate-y-0 not-disabled:active:bg-accent-active disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
      >
        {loading ? (
          <>
            <Spinner /> Lädt...
          </>
        ) : (
          'Senden'
        )}
      </button>
    </div>
  );
}
