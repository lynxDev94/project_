# Jungian Knowledge Sources

Put your local source material for journal analysis grounding in this folder.

## Recommended files

- `.pdf` for real source documents (books, papers, articles)
- `.md` or `.txt` for quick editable notes during development

## Suggested naming

- `book_jung_aion.pdf`
- `paper_shadow_projection_analytical_psychology.pdf`
- `notes_persona_shadow_basics.md`

Use lowercase names with underscores so source IDs stay stable in citations.

## How this folder is used

The ingestion script will scan this folder, chunk documents, create embeddings, and upsert vectors to Supabase.

For MVP, keep this simple:

- add file
- run ingestion script
- test analysis

## Important

- Do not commit copyrighted content you cannot redistribute.
- Keep personal/private materials local.
