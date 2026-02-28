PRAGMA foreign_keys = ON;

-- =========================================
-- USERS
-- =========================================
CREATE TABLE users (
    id TEXT PRIMARY KEY, -- UUID
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    avatar_url TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);



-- =========================================
-- NOTES (CURRENT SNAPSHOT STATE)
-- =========================================
CREATE TABLE notes (
    id TEXT PRIMARY KEY, -- UUID
    owner_id TEXT NOT NULL,

    title TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',

    -- OT version number (increments per successful op)
    version INTEGER NOT NULL DEFAULT 0,

    -- Metadata
    is_archived INTEGER DEFAULT 0,
    is_deleted INTEGER DEFAULT 0,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_notes_owner ON notes(owner_id);
CREATE INDEX idx_notes_updated ON notes(updated_at);



-- =========================================
-- NOTE COLLABORATORS (SHARING)
-- =========================================
CREATE TABLE note_collaborators (
    id TEXT PRIMARY KEY, -- UUID
    note_id TEXT NOT NULL,
    user_id TEXT NOT NULL,

    role TEXT CHECK(role IN ('viewer', 'editor')) NOT NULL DEFAULT 'viewer',

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    UNIQUE(note_id, user_id)
);

CREATE INDEX idx_collab_note ON note_collaborators(note_id);
CREATE INDEX idx_collab_user ON note_collaborators(user_id);



-- =========================================
-- OPERATION LOG (APPEND-ONLY FOR OT)
-- =========================================
CREATE TABLE note_operations (
    id TEXT PRIMARY KEY, -- UUID
    note_id TEXT NOT NULL,
    user_id TEXT NOT NULL,

    -- JSON string of OT operation
    operation TEXT NOT NULL,

    -- Version client edited against
    base_version INTEGER NOT NULL,

    -- Version after server transform
    new_version INTEGER NOT NULL,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_ops_note ON note_operations(note_id);
CREATE INDEX idx_ops_note_version ON note_operations(note_id, new_version);



-- =========================================
-- SNAPSHOTS (FOR OPERATION COMPACTION)
-- =========================================
CREATE TABLE note_snapshots (
    id TEXT PRIMARY KEY, -- UUID
    note_id TEXT NOT NULL,

    content TEXT NOT NULL,
    version INTEGER NOT NULL,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
);

CREATE INDEX idx_snapshots_note ON note_snapshots(note_id);



-- =========================================
-- ATTACHMENTS (R2 OBJECT STORAGE)
-- =========================================
CREATE TABLE attachments (
    id TEXT PRIMARY KEY, -- UUID
    note_id TEXT NOT NULL,
    uploaded_by TEXT NOT NULL,

    file_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,

    -- R2 object key
    object_key TEXT NOT NULL,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_attachments_note ON attachments(note_id);



-- =========================================
-- CHAT (ONE PER NOTE)
-- =========================================
CREATE TABLE chats (
    id TEXT PRIMARY KEY, -- UUID
    note_id TEXT NOT NULL UNIQUE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
);



-- =========================================
-- CHAT MESSAGES
-- =========================================
CREATE TABLE chat_messages (
    id TEXT PRIMARY KEY, -- UUID
    chat_id TEXT NOT NULL,
    sender_id TEXT NOT NULL,

    message TEXT NOT NULL,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_chat_messages_chat ON chat_messages(chat_id);
CREATE INDEX idx_chat_messages_sender ON chat_messages(sender_id);