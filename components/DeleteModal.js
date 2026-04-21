"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function DeleteModal({ isOpen, onClose, onConfirm, noteTitle, isLoading }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal delete-modal" role="alertdialog" aria-modal="true">
        <div className="modal-body">
          <div className="delete-icon-wrap">
            <AlertTriangle size={24} />
          </div>
          <h3>Delete Note?</h3>
          <p>
            <strong>&ldquo;{noteTitle}&rdquo;</strong> will be permanently removed.
            This action cannot be undone.
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button className="btn btn-accent" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
