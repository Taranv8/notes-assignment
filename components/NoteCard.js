"use client";

import { Pencil, Trash2 } from "lucide-react";

function formatDate(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function NoteCard({ note, onEdit, onDelete, isDeleting }) {
  return (
    <article className="note-card">
      <div className="note-card-header">
        <h2 className="note-title">{note.title}</h2>
        <div className="note-card-actions">
          <button
            className="btn btn-icon"
            onClick={() => onEdit(note)}
            title="Edit note"
            disabled={isDeleting}
            aria-label="Edit note"
          >
            <Pencil size={14} />
          </button>
          <button
            className="btn btn-icon"
            style={{ color: "var(--accent)", borderColor: "#e8c9c0" }}
            onClick={() => onDelete(note)}
            title="Delete note"
            disabled={isDeleting}
            aria-label="Delete note"
          >
            {isDeleting ? (
              <span className="spinner spinner-dark" style={{ borderTopColor: "var(--accent)", borderColor: "rgba(200,66,26,0.2)" }} />
            ) : (
              <Trash2 size={14} />
            )}
          </button>
        </div>
      </div>

      <p className="note-description">{note.description}</p>

      <div className="note-footer">
        <span className="note-date">{formatDate(note.createdAt)}</span>
      </div>
    </article>
  );
}
