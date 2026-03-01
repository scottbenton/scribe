# Research

## Search

### Searching TipTap Content

TipTap stores content as a ProseMirror JSON document (the "doc" format). To search it, you need to extract plain text from that JSON.

#### Extracting Text from TipTap JSON

TipTap's schema gives you a `generateText` utility:

```ts
import { generateText } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";

const plainText = generateText(tipTapJsonDoc, [StarterKit]);
```

Store both the raw JSON (for rendering) and the extracted plain text (for searching) in the DB. Regenerate the text whenever the document is saved.

### Search Approaches

**1. SQLite FTS5 (Full-Text Search)** — probably the right call for this

Since you're in Tauri, you likely have SQLite (or Supabase with Postgres). SQLite's FTS5 is built-in, fast, and handles word tokenization, prefix matching, and ranking with zero extra dependencies:

```sql
CREATE VIRTUAL TABLE notes_fts USING fts5(
  title,
  body,        -- plain text extracted from TipTap
  content='notes',
  content_rowid='id'
);
```

Gives you:

- Word-boundary tokenization (not just substring)
- `MATCH 'goblin*'` for prefix matching
- `rank` column for relevance ordering
- Highlighting/snippet extraction

**2. Postgres `tsvector` / `tsquery`** — if you're on Supabase

Same idea, more powerful — stemming, language-aware tokenization, `ts_rank`:

```sql
-- Add a generated column
ALTER TABLE notes ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(body_text, ''))
  ) STORED;

CREATE INDEX notes_search_idx ON notes USING GIN(search_vector);
```

Then query with `search_vector @@ to_tsquery('english', 'goblin & cave')`.

**3. Client-side with Fuse.js** — only if you need fuzzy matching

For small datasets (a few hundred NPCs, locations, session notes), [Fuse.js](https://www.fusejs.io/) running entirely in-browser is dead simple. It handles typos and fuzzy matching but doesn't scale well past ~1000 docs and doesn't do substring well.

### Recommendation

**Use Postgres FTS (tsvector) since you're on Supabase.**

- Store `body_text` as extracted plain text on save
- Add a `tsvector` generated column or update it via trigger
- Query with `websearch_to_tsquery` (friendlier syntax than `to_tsquery`) for natural user input like `"beholder king"` or `goblin -friendly`
- It handles word matching, stemming, prefix — covers everything you'd want without semantic overhead

Semantic search would be overkill here. The content is structured worldbuilding data where users generally know what they're looking for ("find my notes about Baldur's Gate" vs. "find me something similar to this concept"). Word/prefix matching is the right fit.

## Offline / Local Storage

For a fully offline mode where users never interact with the backend, storage permissions work differently between Tauri and the web.

### Tauri (Desktop)

Straightforward — Tauri gives full filesystem access via its `fs` plugin:

- Use the `dialog` plugin to show a native folder picker (`open({ directory: true })`)
- Save the chosen path to persistent app config (via the `store` plugin or app config)
- Read/write freely to that directory on subsequent launches without asking again

Users pick their vault folder once (like Obsidian), and you store that path. No ongoing permission prompts.

### Web (OPFS vs Directory Access API)

Two options:

#### Option A: Origin Private File System (OPFS)

- A sandboxed, browser-managed filesystem — no user picker, no visible path
- Very fast, works in all modern browsers including Safari
- Data is tied to the origin (your domain) — users can't easily browse or back it up
- Good for app-internal storage, bad for "I want to own my files"

#### Option B: File System Access API (Directory picker)

```js
const dirHandle = await window.showDirectoryPicker({ mode: "readwrite" });
```

- Shows a native OS folder picker — user explicitly grants access to a real directory
- Permission persists for the session, but **not across page reloads by default**
- You can store the `FileSystemDirectoryHandle` in IndexedDB and call `requestPermission()` on it next visit — the browser will prompt a small re-authorization (not a full picker)
- **Safari support is limited** — read permission works, but persistent write access and `requestPermission()` are unreliable

#### The Cross-Reload Permission Dance (Web)

```js
// On startup, retrieve stored handle from IndexedDB
const handle = await getStoredHandle();
if (handle) {
  const perm = await handle.queryPermission({ mode: "readwrite" });
  if (perm !== "granted") {
    // Must be triggered by a user gesture
    await handle.requestPermission({ mode: "readwrite" });
  }
}
```

This requires a user gesture (button click) to re-prompt — you can't silently re-acquire on load.

### Comparison

|                 | Tauri                      | Web                                   |
| --------------- | -------------------------- | ------------------------------------- |
| Folder picker   | Native dialog, no friction | `showDirectoryPicker()`               |
| Persistence     | Store path in app config   | Store handle in IndexedDB + re-prompt |
| Images          | Read/write freely          | Read/write via handle API             |
| Safari          | N/A                        | Unreliable for write access           |
| User owns files | Yes                        | Yes (Option B)                        |

### Recommendation

For the web path, **File System Access API (Option B)** is the right fit if users should own their files in a real directory. Be aware of the Safari caveat — you may need an IndexedDB-only fallback for Safari users (data still persists, but no visible folder).

For a single abstraction across both targets, [browser-fs-access](https://github.com/GoogleChromeLabs/browser-fs-access) wraps File System Access API with graceful fallbacks and works nicely alongside Tauri's fs plugin.
