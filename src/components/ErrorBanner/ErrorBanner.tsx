interface ErrorBannerProps {
  message: string | null;
  onClose: () => void;
}

export function ErrorBanner({ message, onClose }: ErrorBannerProps) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="mb-4 flex animate-fade-in-up items-start gap-2.5 rounded-card border border-danger bg-danger-bg px-4 py-3 text-sm text-danger-text shadow-soft"
    >
      <div>
        <strong className="text-danger-strong">Fehler:</strong> <span>{message}</span>
      </div>
      <button
        type="button"
        onClick={onClose}
        title="Schließen"
        className="ml-auto cursor-pointer rounded-md px-1 text-xl leading-none text-danger-text opacity-75 transition hover:scale-110 hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}
