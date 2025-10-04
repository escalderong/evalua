import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, title, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <button
        aria-label="Close modal overlay"
        className="absolute inset-0 bg-kokushoku/50"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg mx-4 bg-gofuniro shadow p-6 text-kokushoku max-h-[80vh] overflow-auto">
        {title && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
        )}
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-0 right-0 m-3 px-2 py-1 text-aisumicha hover:brightness-90"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
