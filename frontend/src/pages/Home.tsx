import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import TiptapEditor from '../components/TiptapEditor';

interface Note {
  id: string;
  title: string;
  content: string;
  updated_at: string;
  version: number;
}

const Home = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate()

  const getToken = () => localStorage.getItem("token");

  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/");
      return;
    }
    fetchNotes(token);
  }, [navigate]);

  useEffect(() => {
    if (activeNoteId) {
      const selected = notes.find(n => n.id === activeNoteId);
      setActiveNote(selected || null);
    } else {
      setActiveNote(null);
    }
  }, [activeNoteId, notes]);

  const fetchNotes = async (token: string) => {
    try {
      const res = await fetch("/api/notes", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes || []);
      } else if (res.status === 401) {
        navigate("/");
      }
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: "Untitled Note",
          content: ""
        })
      });
      if (res.ok) {
        const newItem = await res.json();
        const note: Note = {
          id: newItem.id,
          title: newItem.title,
          content: newItem.content,
          updated_at: new Date().toISOString(),
          version: 0
        };
        setNotes([note, ...notes]);
        setActiveNoteId(note.id);
      }
    } catch (err) {
      console.error("Failed to create note:", err);
    }
  };

  const handleDeleteNote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent selecting note
    const token = getToken();
    if (!token) return;

    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setNotes(notes.filter(n => n.id !== id));
        if (activeNoteId === id) {
          setActiveNoteId(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  const handleNoteUpdate = useCallback((id: string, updates: Partial<Note>) => {
    // Update local state immediately
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));

    // Debounce API call
    if (saveTimeout.current) clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(async () => {
      const token = getToken();
      if (!token) return;

      try {
        await fetch(`/api/notes/${id}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updates)
        });
      } catch (err) {
        console.error("Failed to update note:", err);
      }
    }, 1000); // 1-second debounce
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0b0d14", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#e8eaf0" }}>Loading notes...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#0b0d14", color: "#e8eaf0", fontFamily: "Inter, Segoe UI, system-ui, sans-serif" }}>
      {/* App Topbar */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 32px",
        background: "rgba(11,13,20,0.8)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: "linear-gradient(135deg,#7c3aed,#3b82f6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(124,58,237,0.4)"
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <span style={{
            fontSize: "1.1rem", fontWeight: 700, letterSpacing: "-0.02em",
            background: "linear-gradient(90deg,#c4b5fd,#93c5fd)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>Notely</span>
        </div>
        <button
          onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px",
            borderRadius: 8,
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "#f87171",
            fontSize: "0.82rem",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s"
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>
      </header>

      {/* Main Container */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Sidebar */}
        <aside style={{
          width: 320,
          borderRight: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(17,20,35,0.4)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0
        }}>
          <div style={{ padding: "20px" }}>
            <button
              onClick={handleCreateNote}
              style={{
                width: "100%",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "10px",
                borderRadius: 8,
                background: "linear-gradient(135deg,#7c3aed,#3b82f6)",
                color: "white",
                fontWeight: 600,
                fontSize: "0.95rem",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(124,58,237,0.3)",
                transition: "all 0.2s"
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              New Note
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 20px" }}>
            {notes.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px", color: "#6b7280", fontSize: "0.9rem" }}>
                No notes found.<br />Create one to get started!
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {notes.map(note => (
                  <div
                    key={note.id}
                    onClick={() => setActiveNoteId(note.id)}
                    style={{
                      padding: "14px",
                      borderRadius: 10,
                      cursor: "pointer",
                      background: activeNoteId === note.id ? "rgba(124,58,237,0.15)" : "transparent",
                      border: "1px solid",
                      borderColor: activeNoteId === note.id ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.03)",
                      transition: "all 0.2s"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <h3 style={{
                        margin: 0,
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: activeNoteId === note.id ? "#e8eaf0" : "#d1d5db",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}>
                        {note.title || "Untitled Note"}
                      </h3>
                      <button
                        onClick={(e) => handleDeleteNote(note.id, e)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#9ca3af",
                          cursor: "pointer",
                          padding: 4,
                          display: "flex"
                        }}
                        title="Delete Note"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                    <p style={{
                      margin: "6px 0 0",
                      fontSize: "0.8rem",
                      color: "#6b7280",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}>
                      {note.content.replace(/[#*`~>-]/g, "").slice(0, 50) || "No content"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Editor Area */}
        <main style={{ flex: 1, padding: "40px", overflowY: "auto", position: "relative" }}>
          {activeNote ? (
            <div style={{ maxWidth: 860, margin: "0 auto", height: "100%", display: "flex", flexDirection: "column" }}>
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => handleNoteUpdate(activeNote.id, { title: e.target.value })}
                placeholder="Note Title"
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: "2.2rem",
                  fontWeight: 800,
                  color: "#ffffff",
                  marginBottom: "24px",
                  width: "100%",
                  fontFamily: "inherit"
                }}
              />
              <div style={{ flex: 1, position: "relative" }}>
                <TiptapEditor
                  key={activeNote.id} // Forces remount if switching notes
                  initialMarkdown={activeNote.content}
                  onChange={(md) => handleNoteUpdate(activeNote.id, { content: md })}
                />
              </div>
            </div>
          ) : (
            <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 16, opacity: 0.5 }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 500, margin: "0 0 8px" }}>No Note Selected</h2>
              <p style={{ margin: 0, fontSize: "0.9rem" }}>Select a note from the sidebar or select 'New Note' to start typing.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Home