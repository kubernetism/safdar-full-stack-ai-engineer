import { code, e, n } from "../dsl";
import type { Category } from "../types";

export const rag: Category = {
  slug: "rag",
  name: "RAG",
  blurb:
    "Retrieval-augmented generation: ground the model's answer in your own documents, then make retrieval good.",
  intro:
    "Retrieval-augmented generation fetches relevant passages at question time and puts them in the prompt, so answers come from your data instead of the model's memory. Most of the quality comes from the retrieval side.",
  patterns: [
    {
      slug: "naive-rag",
      name: "Naive RAG",
      summary: "Chunk and embed documents, retrieve the top-k chunks for a question, and answer from them.",
      definition:
        "Documents are split into chunks, embedded and stored in a vector index ahead of time. At question time the query is embedded, the nearest chunks are retrieved and the LLM answers using only those chunks.",
      useWhen: [
        "You need answers grounded in a document set that changes more often than you would retrain a model.",
        "It is your baseline: measure it before adding anything fancier.",
      ],
      pros: ["Simple to build and explain; sources can be cited.", "Fresh data with no fine-tuning."],
      cons: [
        "Pure vector search misses exact terms such as codes, names and IDs.",
        "Chunks lose surrounding context, so answers can be partial.",
      ],
      example:
        "An HR assistant answers leave-policy questions from the handbook and cites the section it used.",
      code: {
        lang: "python",
        file: "rag.py",
        source: code(`
          # offline
          for chunk in split(handbook, size=800, overlap=100):
              index.add(embed(chunk.text), chunk)

          # per question
          hits = index.search(embed(question), k=5)
          answer = llm(f"Answer only from these passages:\\n{hits}\\n\\nQ: {question}")
        `),
      },
      diagram: {
        title:
          "Naive RAG: documents are chunked and embedded into a vector index; a question is embedded, top-k chunks retrieved, and the LLM answers.",
        h: 200,
        groups: [{ label: "offline", x: 8, y: 6, w: 464, h: 64 }],
        nodes: [
          n("docs", "Docs", 60, 42),
          n("chunk", "Chunk + embed", 210, 42),
          n("idx", "Vector index", 380, 42, "store"),
          n("q", "Question", 60, 150, "user"),
          n("search", "Top-k search", 220, 150),
          n("llm", "LLM", 400, 150, "accent"),
        ],
        edges: [
          e("docs", "chunk"),
          e("chunk", "idx"),
          e("q", "search", { label: "embed" }),
          e("idx", "search", { dashed: true }),
          e("search", "llm", { label: "chunks" }),
        ],
      },
    },
    {
      slug: "hybrid-search",
      name: "Hybrid search",
      summary: "Run keyword (BM25) and vector search together and fuse the two result lists.",
      definition:
        "Keyword search catches exact terms and rare words; vector search catches meaning and paraphrase. Hybrid search runs both and merges the rankings, commonly with reciprocal rank fusion (RRF).",
      useWhen: [
        "Queries mix natural language with exact identifiers, product codes or names.",
        "Pure vector search misses documents that obviously contain the query's words.",
      ],
      pros: [
        "Usually beats either method alone on real queries.",
        "RRF needs no score calibration between the two systems.",
      ],
      cons: ["Two indexes to build and keep in sync.", "Another knob (fusion weights) to tune and evaluate."],
      example:
        "Searching a parts catalogue for “PK-220 hinge that does not squeak” matches the code by keyword and the description by meaning.",
      code: {
        lang: "python",
        file: "rrf.py",
        source: code(`
          def rrf(*rankings, k=60):
              scores = defaultdict(float)
              for ranking in rankings:
                  for rank, doc_id in enumerate(ranking):
                      scores[doc_id] += 1 / (k + rank + 1)
              return sorted(scores, key=scores.get, reverse=True)

          results = rrf(bm25.search(q, 50), vectors.search(embed(q), 50))
        `),
      },
      diagram: {
        title:
          "Hybrid search: a query goes to keyword search and vector search, whose rankings are fused into one list.",
        h: 170,
        nodes: [
          n("q", "Query", 50, 85, "user"),
          n("kw", "Keyword (BM25)", 190, 32, "store"),
          n("vec", "Vector search", 190, 138, "store"),
          n("rrf", "Fuse (RRF)", 330, 85, "decision"),
          n("out", "Top-k", 440, 85),
        ],
        edges: [e("q", "kw"), e("q", "vec"), e("kw", "rrf"), e("vec", "rrf"), e("rrf", "out")],
      },
    },
    {
      slug: "reranking",
      name: "Re-ranking",
      summary:
        "Retrieve generously, then let a stronger model reorder the candidates and keep only the best few.",
      definition:
        "A fast first stage retrieves many candidates (say 50), and a slower, more accurate model such as a cross-encoder or a semantic ranker scores each against the query. Only the top few reach the LLM.",
      useWhen: [
        "The right passage is usually in the top 50 but not the top 5.",
        "Context space is precious and you want fewer, better chunks.",
      ],
      pros: [
        "Large precision gains for little code.",
        "Shorter prompts: lower cost and less distraction for the model.",
      ],
      cons: [
        "Adds latency, since every candidate is scored.",
        "Cannot recover a document the first stage never retrieved.",
      ],
      example:
        "A legal search retrieves 50 clauses with hybrid search, re-ranks them, and sends the best 5 to the model.",
      code: {
        lang: "python",
        file: "rerank.py",
        source: code(`
          candidates = hybrid_search(query, k=50)
          scored = reranker.score(query, [c.text for c in candidates])
          top = [c for c, _ in sorted(zip(candidates, scored), key=lambda x: -x[1])][:5]
        `),
      },
      diagram: {
        title:
          "Re-ranking: a retriever returns fifty candidates, a re-ranker keeps the best five, and the LLM answers from them.",
        h: 130,
        nodes: [
          n("q", "Query", 44, 65, "user"),
          n("ret", "Retriever", 140, 65, "store"),
          n("rr", "Re-ranker", 300, 65),
          n("llm", "LLM", 430, 65, "accent"),
        ],
        edges: [e("q", "ret"), e("ret", "rr", { label: "top 50" }), e("rr", "llm", { label: "top 5" })],
      },
    },
    {
      slug: "query-rewriting",
      name: "Query rewriting and HyDE",
      summary: "Turn a vague or chatty question into better search queries before retrieving.",
      definition:
        "An LLM rewrites the user's message into one or more standalone search queries, resolving pronouns from the chat history. HyDE (hypothetical document embeddings) goes further: it drafts a plausible answer and searches with that draft's embedding, because an answer looks more like the target documents than a question does.",
      useWhen: [
        "Follow-up questions such as “what about for contractors?” depend on earlier turns.",
        "Users phrase questions very differently from how the documents are written.",
      ],
      pros: [
        "Big recall gains on conversational and vague queries.",
        "Multi-query rewriting covers several interpretations.",
      ],
      cons: [
        "An extra LLM call before every search.",
        "A hallucinated HyDE draft can steer retrieval the wrong way.",
      ],
      example:
        "After “How many leave days do I get?”, the follow-up “and contractors?” is rewritten to “annual leave entitlement for contractors”.",
      code: {
        lang: "python",
        file: "rewrite.py",
        source: code(`
          standalone = llm(f"Rewrite as a standalone search query:\\n{history}\\n{message}")
          draft = llm(f"Write a short passage that answers: {standalone}")  # HyDE
          hits = index.search(embed(draft), k=8)
        `),
      },
      diagram: {
        title:
          "Query rewriting: the message and chat history go to an LLM that writes a standalone query or a hypothetical answer, which is embedded and searched.",
        h: 170,
        nodes: [
          n("msg", "Message +\nhistory", 60, 85, "user"),
          n("rw", "Rewrite / HyDE", 210, 85, "accent"),
          n("q1", "Query A", 350, 32),
          n("q2", "Hypothetical\nanswer", 350, 138, "ghost"),
          n("idx", "Index", 445, 85, "store"),
        ],
        edges: [
          e("msg", "rw"),
          e("rw", "q1"),
          e("rw", "q2", { dashed: true }),
          e("q1", "idx"),
          e("q2", "idx", { dashed: true }),
        ],
      },
    },
    {
      slug: "contextual-retrieval",
      name: "Contextual chunking",
      summary: "Prefix every chunk with a short note about where it sits in the document before indexing it.",
      definition:
        "Before embedding, an LLM writes one or two sentences of context for each chunk (which document, which section, what it refers to) and prepends it. The chunk then carries its own context into both the vector and keyword indexes. Anthropic calls this contextual retrieval.",
      useWhen: [
        "Chunks like “Revenue grew 3% over the quarter” are meaningless without the document around them.",
        "You can afford a one-off indexing cost to improve retrieval permanently.",
      ],
      pros: [
        "Fewer failed retrievals, especially combined with hybrid search and re-ranking.",
        "No change to the query path.",
      ],
      cons: [
        "One LLM call per chunk at indexing time (prompt caching makes this much cheaper).",
        "Re-index when the context prompt changes.",
      ],
      example:
        "A chunk from an annual report becomes “From Acme's 2025 annual report, Q2 results section: Revenue grew 3%…” before indexing.",
      code: {
        lang: "python",
        file: "contextualize.py",
        source: code(`
          for chunk in chunks:
              note = llm(f"<document>{doc}</document>\\nIn 1-2 sentences, situate this chunk: {chunk}")
              text = f"{note}\\n\\n{chunk}"
              vectors.add(embed(text)); bm25.add(text)
        `),
      },
      diagram: {
        title:
          "Contextual chunking: each chunk and its whole document go to an LLM that writes a context note; the note plus chunk is indexed in vector and keyword stores.",
        h: 180,
        nodes: [
          n("doc", "Document", 56, 40),
          n("chunk", "Chunk", 56, 140),
          n("llm", "LLM: situate", 210, 90, "accent"),
          n("ctx", "Note + chunk", 350, 90),
          n("v", "Vectors", 436, 40, "store"),
          n("k", "BM25", 436, 140, "store"),
        ],
        edges: [e("doc", "llm"), e("chunk", "llm"), e("llm", "ctx"), e("ctx", "v"), e("ctx", "k")],
      },
    },
    {
      slug: "graphrag",
      name: "GraphRAG",
      summary:
        "Extract entities and relationships into a knowledge graph, then answer from graph structure and summaries.",
      definition:
        "An LLM extracts entities and their relationships from the corpus into a graph, groups them into communities and summarises each community. Questions are answered from the relevant entities (local search) or from community summaries (global search).",
      useWhen: [
        "Questions span the whole corpus, such as “what are the main themes?”, which top-k chunks cannot answer.",
        "The domain is relationship-heavy: people, organisations, systems and how they connect.",
      ],
      pros: [
        "Answers big-picture and multi-hop questions that chunk search misses.",
        "The graph is inspectable and reusable.",
      ],
      cons: [
        "Expensive, slow indexing with many LLM calls.",
        "Extraction errors become wrong facts in the graph.",
      ],
      example:
        "Across 2,000 incident reports, “which systems fail together most often?” is answered from graph communities.",
      diagram: {
        title:
          "GraphRAG: documents go through LLM extraction into a knowledge graph with community summaries; a question is answered by local or global search over it.",
        h: 190,
        nodes: [
          n("docs", "Docs", 46, 50),
          n("ext", "LLM extract", 165, 50, "accent"),
          n("g", "Graph +\ncommunities", 320, 50, "store"),
          n("q", "Question", 46, 150, "user"),
          n("s", "Local / global\nsearch", 230, 150),
          n("llm", "LLM", 420, 150, "accent"),
        ],
        edges: [e("docs", "ext"), e("ext", "g"), e("q", "s"), e("g", "s", { dashed: true }), e("s", "llm")],
      },
      code: {
        lang: "python",
        file: "graphrag.py",
        source: code(`
          # indexing
          triples = llm(f"Extract (entity, relation, entity) triples:\\n{chunk}", schema=Triples)
          graph.add(triples)
          for community in graph.communities():
              community.summary = llm(f"Summarise this group:\\n{community.facts}")

          # global question
          answer = llm(f"Using these summaries:\\n{graph.summaries()}\\nQ: {question}")
        `),
      },
    },
  ],
  reading: [
    {
      title: "Retrieval-augmented generation for knowledge-intensive NLP tasks",
      source: "arXiv (Lewis et al.)",
      href: "https://arxiv.org/abs/2005.11401",
    },
    {
      title: "Design and develop a RAG solution",
      source: "Microsoft Azure Architecture Center",
      href: "https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-solution-design-and-evaluation-guide",
    },
    {
      title: "Hybrid search overview",
      source: "Microsoft Learn",
      href: "https://learn.microsoft.com/en-us/azure/search/hybrid-search-overview",
    },
    {
      title: "Semantic ranking overview",
      source: "Microsoft Learn",
      href: "https://learn.microsoft.com/en-us/azure/search/semantic-search-overview",
    },
    {
      title: "Precise zero-shot dense retrieval without relevance labels (HyDE)",
      source: "arXiv",
      href: "https://arxiv.org/abs/2212.10496",
    },
    {
      title: "Introducing contextual retrieval",
      source: "Anthropic",
      href: "https://www.anthropic.com/research/contextual-retrieval",
    },
    { title: "GraphRAG", source: "Microsoft Research", href: "https://microsoft.github.io/graphrag/" },
    {
      title: "From local to global: a GraphRAG approach to query-focused summarization",
      source: "arXiv",
      href: "https://arxiv.org/abs/2404.16130",
    },
  ],
};
