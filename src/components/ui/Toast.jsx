import { useEffect } from "react";

export function Toast({ title, message, onClose, duration = 5000 }) {
    useEffect(() => {
        if (!duration) return undefined;
        const t = setTimeout(() => onClose?.(), duration);
        return () => clearTimeout(t);
    }, [duration, onClose, title, message]);

    return (
        <div className="toast" role="status" aria-live="polite">
            <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                </svg>
                <div className="flex-1">
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="mt-1 text-sm muted">{message}</p>
                </div>
                <button type="button" className="icon-btn -mr-2 -mt-2 h-9 w-9" onClick={onClose} aria-label="Dismiss notification">
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
