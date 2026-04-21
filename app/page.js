"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Search, RefreshCw, BookOpen } from "lucide-react";

import NoteCard from "@/components/NoteCard";
import NoteModal from "@/components/NoteModal";
import DeleteModal from "@/components/DeleteModal";
import SkeletonGrid from "@/components/SkeletonGrid";
import Toast from "@/components/Toast";

// ─── Toast helper ──────────────────────────────────────────

let toastId = 0;

function useToasts() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  return { toasts, addToast };
}

// ─── Main Component ────────────────────────────────────────

export default function HomePage() {
  const [notes, setNotes] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Modal state
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null); // null = create mode
  const [mutateLoading, setMutateLoading] = useState(false);

  // Delete state
  const [deletingNote, setDeletingNote] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deletingCardId, setDeletingCardId] = useState(null);

  const { toasts, addToast } = useToasts();

  // ── Debounce search ──────────────────────────────────────
  const debounceTimer = useRef(null);
  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 350);
    return () => clearTimeout(debounceTimer.current);
  }, [searchQuery]);

  // ── Fetch Notes ──────────────────────────────────────────
  const fetchNotes = useCallback(async (query = "") => {
    setFetchLoading(true);
    try {
      const url = query
        ? `/api/notes?search=${encodeURIComponent(query)}`
        : `/api/notes`;
      const res = await fetch(url);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setNotes(json.data);
    } catch (err) {
      addToast("Failed to load notes. Check your connection.", "error");
    } finally {
      setFetchLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchNotes(debouncedQuery);
  }, [debouncedQuery, fetchNotes]);

  // ── Create / Update ──────────────────────────────────────
  const handleModalSubmit = async ({ title, description }) => {
    setMutateLoading(true);
    try {
      const isEdit = Boolean(editingNote);
      const url = isEdit ? `/api/notes/${editingNote._id}` : `/api/notes`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      if (isEdit) {
        setNotes((prev) =>
          prev.map((n) => (n._id === editingNote._id ? json.data : n))
        );
        addToast("Note updated successfully!", "success");
      } else {
        setNotes((prev) => [json.data, ...prev]);
        addToast("Note created successfully!", "success");
      }

      setNoteModalOpen(false);
      setEditingNote(null);
    } catch (err) {
      addToast(err.message || "Something went wrong", "error");
    } finally {
      setMutateLoading(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deletingNote) return;
    setDeleteLoading(true);
    setDeletingCardId(deletingNote._id);

    try {
      const res = await fetch(`/api/notes/${deletingNote._id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      setNotes((prev) => prev.filter((n) => n._id !== deletingNote._id));
      addToast("Note deleted.", "success");
      setDeletingNote(null);
    } catch (err) {
      addToast(err.message || "Delete failed", "error");
    } finally {
      setDeleteLoading(false);
      setDeletingCardId(null);
    }
  };

  // ── Helpers ──────────────────────────────────────────────
  const openCreate = () => {
    setEditingNote(null);
    setNoteModalOpen(true);
  };

  const openEdit = (note) => {
    setEditingNote(note);
    setNoteModalOpen(true);
  };

  const openDelete = (note) => setDeletingNote(note);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <div className="app-container">
        {/* ── Header ── */}
        <header className="app-header">
          <div className="header-top">
            <span className="header-eyebrow">Personal Workspace</span>
            <span className="header-date">{today}</span>
          </div>

          <h1 className="app-title">
            Mini <span>Notes</span>
          </h1>

          <hr className="header-rule" />

          <div className="header-meta">
            <span className="note-count-badge">
              {fetchLoading
                ? "Loading..."
                : `${notes.length} ${notes.length === 1 ? "Note" : "Notes"}${debouncedQuery ? " found" : ""}`}
            </span>
            <button
              className="btn btn-ghost"
              onClick={() => fetchNotes(debouncedQuery)}
              disabled={fetchLoading}
              title="Refresh"
              style={{ padding: "5px 10px", fontSize: "12px" }}
            >
              <RefreshCw size={13} className={fetchLoading ? "spin-icon" : ""} />
              Refresh
            </button>
          </div>
        </header>

        {/* ── Toolbar ── */}
        <div className="toolbar">
          <div className="search-wrapper">
            <Search size={15} className="search-icon" />
            <input
              type="search"
              className="search-input"
              placeholder="Search notes by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search notes"
            />
          </div>
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={16} />
            New Note
          </button>
        </div>

        {/* ── Notes Grid ── */}
        {fetchLoading ? (
          <SkeletonGrid count={6} />
        ) : notes.length === 0 ? (
          <div className="notes-grid">
            <div className="empty-state">
              <div className="empty-state-icon">
                <BookOpen size={48} strokeWidth={1} />
              </div>
              <h2 className="empty-state-title">
                {debouncedQuery ? "No notes found" : "Your notepad is empty"}
              </h2>
              <p className="empty-state-subtitle">
                {debouncedQuery
                  ? `No notes match "${debouncedQuery}". Try a different search term.`
                  : "Start capturing your thoughts. Click 'New Note' to write your first note."}
              </p>
              {!debouncedQuery && (
                <button className="btn btn-primary" onClick={openCreate}>
                  <Plus size={16} />
                  Create First Note
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={openEdit}
                onDelete={openDelete}
                isDeleting={deletingCardId === note._id}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <NoteModal
        isOpen={noteModalOpen}
        onClose={() => { setNoteModalOpen(false); setEditingNote(null); }}
        onSubmit={handleModalSubmit}
        initialNote={editingNote}
        isLoading={mutateLoading}
      />

      <DeleteModal
        isOpen={Boolean(deletingNote)}
        onClose={() => setDeletingNote(null)}
        onConfirm={handleDeleteConfirm}
        noteTitle={deletingNote?.title}
        isLoading={deleteLoading}
      />

      {/* ── Toasts ── */}
      <Toast toasts={toasts} />

      <style jsx global>{`
        .spin-icon { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
