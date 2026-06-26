## Knowledge Base (LightRAG — Climbing Training)

You have access to a personal knowledge base via the `lightrag-kb` MCP server.
It contains climbing training knowledge: training plans, strength & conditioning
protocols, technique cues, periodization frameworks, injury prevention, equipment,
and any other climbing-related documents that have been indexed.

### When to query it proactively

- Any question about training plans, periodization, or programming for climbing
- Strength, power, or endurance protocols (finger strength, campus, system board, etc.)
- Technique topics (footwork, body positioning, movement patterns)
- Injury prevention, rehab, or load management for climbers
- Nutrition, recovery, or sleep as they relate to climbing performance
- Gear and equipment selection in a training context
- When the user references a specific coach, method, book, or resource that may be indexed

### When NOT to query

- Pure coding or unrelated dev tasks
- General knowledge questions clearly outside climbing/training

### Tools available

- `query_document` — semantic search across all indexed docs (use this most)
- `get_documents` — list what's currently indexed
- `insert_document` — add text snippets directly to the KB
- `insert_file` — add a file directly to storage
- `upload_document` — upload a file to the /input directory for processing
- `insert_batch` — batch-add documents from a directory
- `scan_for_new_documents` — trigger indexing of new files in /input
- `get_pipeline_status` — check document processing progress
- `get_graph_labels` — explore the knowledge graph structure
- `check_lightrag_health` — verify the LightRAG API is up

### Query modes (pass as `mode` to query_document)

- `hybrid` — default, best for most questions (combines vector + graph)
- `local` — entity-focused, good for "what is X" or specific technique/drill questions
- `global` — theme-focused, good for "what are the main principles of X" type questions
- `naive` — simple vector search, fastest, use when you just need a quick lookup

## Orchestrator Instructions

@orchestrator/.claude/CLAUDE.md
