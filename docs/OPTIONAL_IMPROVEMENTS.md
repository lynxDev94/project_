# Optional Improvements

Ideas for future enhancements. Not required for core functionality.

---

## 1. Client-side caching with Zustand

**Current:** Each page fetches its own data from the API. No shared cache.

**Improvement:** Add a Zustand store for entries and stats. Benefits:
- Sidebar or header can show "12 entries" without refetching when navigating
- After saving an entry, dashboard stats could update optimistically
- Entries list could be cached when going back from detail view

**Example structure:**
```ts
// stores/entries-store.ts
interface EntriesStore {
  entries: Entry[];
  stats: { totalEntries; totalWords; streak; mostActiveDay; weekDays } | null;
  setEntries: (entries: Entry[]) => void;
  setStats: (stats: ...) => void;
  invalidate: () => void;
}
```

**When to add:** When you want cross-page shared state or need to reduce refetches.

---

## 2. React Query / SWR

**Alternative to Zustand:** Use React Query or SWR for data fetching. They provide:
- Automatic caching and deduplication
- Background refetch on window focus
- Stale-while-revalidate UX
- Optimistic updates

**When to add:** When you want request-level caching without manual store logic.

---

## 3. ~~Edit / Delete entry~~ ✅ Done

**Current:** Entry detail page has Edit and Delete buttons but they’re placeholders.

**Improvement:**
- Add `PATCH /api/entries/[id]` for updates
- Add `DELETE /api/entries/[id]` for removal
Implemented: edit via journal page with `?edit=id`, delete with confirmation.

---

## 4. User timezone for entries

**Current:** `entry_date` and dates use UTC.

**Improvement:**
- Store user timezone (e.g. in `users` table or profile)
- Compute "today" and "this week" in the user’s timezone for:
  - Mood one-per-day rule
  - Weekly streak
  - Entry dates

---

## 5. AI analysis (placeholder ready)

**Current:** Entry detail page shows "AI Analysis — coming soon".

**Improvement:**
- Integrate an LLM API to analyze journal content
- Add DB columns for analysis results (or a separate `entry_analyses` table)
- Surface shadow projections, complexes, archetypal imagery
- Consider credit usage if behind a paywall

---

## 6. Full-text search in PostgreSQL

**Current:** Search uses `ILIKE` on title and body.

**Improvement:**
- Use `tsvector` and `tsquery` for full-text search
- Schema already has `idx_entries_search` (GIN on `to_tsvector`)
- Query with `to_tsquery()` for better ranking and relevance

---

## 7. Pagination for entries list

**Current:** All entries are loaded at once.

**Improvement:**
- Add `?limit=20&offset=0` (or cursor-based pagination) to `GET /api/entries`
- Load more on scroll or "Load more" button

---

## 8. Entry date picker

**Current:** Entry date defaults to today on save.

**Improvement:**
- Add a date picker so users can backdate entries
- Send `entryDate` in the POST body (already supported in the API)

---

## 9. Offline support

**Current:** Requires network for all actions.

**Improvement:**
- Persist draft in `localStorage`
- Restore draft on return to journal page
- Optional: service worker + IndexedDB for offline-first

---

## 10. Keyboard shortcuts

**Improvement:**
- `Ctrl/Cmd + S` to save entry
- `Ctrl/Cmd + K` to open prompt ideas modal
- Escape to blur / close modals
