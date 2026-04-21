"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const TITLE_MAX = 100;

export default function NoteModal({ isOpen, onClose, onSubmit, initialNote, isLoading }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const titleRef = useRef(null);

  const isEdit = Boolean(initialNote);

  // Populate form when editing
  useEffect(() => {
    if (isOpen) {
      setTitle(initialNote?.title || "");
      setDescription(initialNote?.description || "");
      setTimeout(() => titleRef.current?.focus(), 50);
    }
  }, [isOpen, initialNote]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) return;
    onSubmit({ title: title.trim(), description: description.trim() });
  };

  const valid = title.trim().length > 0 && description.trim().length > 0;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title">
            {isEdit ? "Edit Note" : "New Note"}
          </h2>
          <button className="btn btn-icon" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div className="field">
            <label htmlFor="note-title">Title</label>
            <input
              id="note-title"
              ref={titleRef}
              type="text"
              placeholder="Give your note a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, TITLE_MAX))}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              maxLength={TITLE_MAX}
            />
            <span className={`char-count ${title.length > 85 ? "warn" : ""}`}>
              {title.length}/{TITLE_MAX}
            </span>
          </div>

          <div className="field">
            <label htmlFor="note-desc">Description</label>
            <textarea
              id="note-desc"
              placeholder="Write your note here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!valid || isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner" />
                {isEdit ? "Saving..." : "Creating..."}
              </>
            ) : (
              isEdit ? "Save Changes" : "Create Note"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
