import { code, e, n } from "../dsl";
import type { Category } from "../types";

export const agenticRag: Category = {
  slug: "agentic-rag",
  name: "Agentic RAG",
  blurb: "Let the model decide when, where and how often to retrieve, and check its own evidence.",
  intro:
    "Classic RAG retrieves once, before the model speaks. Agentic RAG puts retrieval inside the agent loop: the model chooses whether to search, which source to use, judges what came back and searches again when the evidence is weak.",
  patterns: [
    {
      slug: "retrieval-as-tool",
      name: "Retrieval as a tool",
      summary:
        "Give the agent search tools and let it decide when and what to query, possibly several times.",
      definition:
        "Instead of always retrieving up front, retrieval is exposed as one or more tools. The agent decides whether a question needs searching, writes its own queries, reads the results and can search again with a refined query.",
      useWhen: [
        "Many questions need no retrieval at all, or need several searches to answer.",
        "There are several sources (docs, tickets, code) and the right one depends on the question.",
      ],
      pros: [
        "Searches only when useful; multi-hop questions become possible.",
        "The agent writes better queries as it learns more.",
      ],
      cons: [
        "Less predictable cost and latency than one fixed retrieval.",
        "Needs good tool descriptions or the agent will over- or under-search.",
      ],
      example:
        "A developer assistant searches the docs, finds an error code, then searches the issue tracker for that code before answering.",
      code: {
        lang: "python",
        file: "search_tool.py",
        source: code(`
          @function_tool
          def search_docs(query: str, top_k: int = 5) -> list[str]:
              """Search the product docs. Use specific terms, not full sentences."""
              return [hit.text for hit in index.search(embed(query), k=top_k)]

          agent = Agent(name="Docs helper", instructions=INSTRUCTIONS, tools=[search_docs, search_tickets])
        `),
      },
      diagram: {
        title:
          "Retrieval as a tool: the agent loops, choosing between a docs search tool and a tickets search tool, until it answers.",
        h: 180,
        nodes: [
          n("q", "Question", 50, 90, "user"),
          n("agent", "Agent", 190, 90, "accent"),
          n("docs", "search_docs", 370, 36, "store"),
          n("tix", "search_tickets", 370, 144, "store"),
        ],
        edges: [
          e("q", "agent"),
          e("agent", "docs", { curve: 16, label: "query" }),
          e("docs", "agent", { curve: 16 }),
          e("agent", "tix", { curve: -16, dashed: true }),
          e("tix", "agent", { curve: -16, dashed: true }),
        ],
      },
    },
    {
      slug: "self-reflective-rag",
      name: "Self-reflective RAG",
      summary:
        "The model judges whether it needs retrieval and whether its answer is supported by what it found.",
      definition:
        "The generator critiques itself at each stage: is retrieval needed, are these passages relevant, is the answer actually supported by them? Low scores trigger another retrieval or a rewrite. Self-RAG trains these judgements into the model; in practice a grader prompt often plays the role.",
      useWhen: [
        "Unsupported claims are costly, for example in medical, legal or financial answers.",
        "You want answers to cite and stay inside their evidence.",
      ],
      pros: [
        "Catches answers that drift beyond the sources.",
        "Relevance checks drop noisy passages before they reach the answer.",
      ],
      cons: [
        "Several extra model calls per question.",
        "The grader can be wrong too; evaluate it separately.",
      ],
      example:
        "A policy bot drafts an answer, a grader finds one sentence unsupported, and the bot rewrites it using only cited passages.",
      code: {
        lang: "python",
        file: "self_rag.py",
        source: code(`
          docs = [d for d in retrieve(q) if grade(f"Is this relevant to {q}?", d).yes]
          answer = llm(prompt(q, docs))
          if not grade(f"Is every claim supported by the passages?", answer, docs).yes:
              answer = llm(prompt(q, docs, strict=True))   # rewrite, cite only sources
        `),
      },
      diagram: {
        title:
          "Self-reflective RAG: retrieve, grade relevance, generate, then check the answer is supported; unsupported answers loop back.",
        h: 180,
        nodes: [
          n("ret", "Retrieve", 56, 60, "store"),
          n("rel", "Relevant?", 186, 60, "decision"),
          n("gen", "Generate", 330, 60, "accent"),
          n("sup", "Supported?", 330, 150, "decision"),
          n("out", "Answer", 440, 60),
        ],
        edges: [
          e("ret", "rel"),
          e("rel", "gen", { label: "yes" }),
          e("gen", "sup"),
          e("sup", "out", { label: "yes" }),
          e("sup", "ret", { dashed: true, label: "no", curve: -20 }),
        ],
      },
    },
    {
      slug: "corrective-rag",
      name: "Corrective RAG (CRAG)",
      summary:
        "Grade the retrieved documents; if they are poor, rewrite the query and fall back to another source.",
      definition:
        "A lightweight evaluator scores the retrieved set as correct, ambiguous or incorrect. Good results go straight to generation; poor ones trigger a corrective action such as rewriting the query or searching the web, and the evidence is refined before the answer.",
      useWhen: [
        "Your index has gaps and a fallback source exists.",
        "You would rather spend an extra step than answer from irrelevant passages.",
      ],
      pros: [
        "Robust to bad retrieval instead of silently answering from noise.",
        "Each corrective path is simple code you can test.",
      ],
      cons: [
        "More moving parts and latency on the fallback path.",
        "Web fallback brings untrusted content into the prompt.",
      ],
      example:
        "An internal knowledge bot finds nothing useful in the wiki for a new library version, rewrites the query and searches the vendor's docs.",
      code: {
        lang: "python",
        file: "crag.py",
        source: code(`
          docs = retrieve(q)
          verdict = grade_set(q, docs)          # "correct" | "ambiguous" | "incorrect"
          if verdict != "correct":
              docs += web_search(rewrite(q))    # corrective action
          return llm(prompt(q, refine(docs)))
        `),
      },
      diagram: {
        title:
          "Corrective RAG: retrieved documents are graded; good ones go to generation, poor ones trigger a query rewrite and a web search first.",
        h: 180,
        nodes: [
          n("ret", "Retrieve", 56, 60, "store"),
          n("grade", "Grade", 186, 60, "decision"),
          n("gen", "Generate", 420, 60, "accent"),
          n("rw", "Rewrite", 186, 150),
          n("web", "Web search", 320, 150, "ghost"),
        ],
        edges: [
          e("ret", "grade"),
          e("grade", "gen", { label: "good" }),
          e("grade", "rw", { label: "poor" }),
          e("rw", "web"),
          e("web", "gen"),
        ],
      },
    },
    {
      slug: "adaptive-rag",
      name: "Adaptive RAG",
      summary:
        "Classify each question's complexity and pick no retrieval, one retrieval or a multi-step search.",
      definition:
        "A small classifier predicts how hard a question is and routes it: simple questions are answered directly, moderate ones get a single retrieval, and complex ones get an iterative, multi-step retrieval loop.",
      useWhen: [
        "Traffic mixes trivial questions with hard multi-hop ones.",
        "You need to control cost without losing quality on hard questions.",
      ],
      pros: ["Spends effort where it is needed.", "Easy questions get fast answers."],
      cons: [
        "The complexity classifier needs labelled examples.",
        "A wrong call either wastes money or under-serves the user.",
      ],
      example:
        "“What does RAG stand for?” is answered directly; “compare our 2024 and 2025 security incidents by root cause” gets the multi-step path.",
      diagram: {
        title:
          "Adaptive RAG: a complexity classifier routes questions to no retrieval, single-step retrieval or multi-step retrieval.",
        h: 180,
        nodes: [
          n("q", "Question", 50, 90, "user"),
          n("c", "Complexity?", 190, 90, "decision"),
          n("a", "Answer directly", 380, 28, "ghost"),
          n("b", "One retrieval", 380, 90),
          n("m", "Multi-step loop", 380, 152, "accent"),
        ],
        edges: [e("q", "c"), e("c", "a", { label: "easy" }), e("c", "b"), e("c", "m", { label: "hard" })],
      },
      code: {
        lang: "python",
        file: "adaptive.py",
        source: code(`
          level = classify_complexity(q)   # small fine-tuned model or cheap LLM call
          if level == "simple":
              return llm(q)
          if level == "moderate":
              return llm(prompt(q, retrieve(q)))
          return research_loop(q, max_steps=5)
        `),
      },
    },
    {
      slug: "multi-agent-rag",
      name: "Multi-agent RAG",
      summary:
        "A coordinator sends sub-questions to specialist retrieval agents, each owning one source, then merges the answers.",
      definition:
        "A lead agent splits the question and dispatches parts to specialist agents that each know one source well (a SQL database, a document store, the web). The specialists retrieve and summarise in their own contexts, and the lead combines their findings.",
      useWhen: [
        "Sources need different query skills, such as SQL for metrics and semantic search for policies.",
        "Questions are broad and benefit from parallel research.",
      ],
      pros: [
        "Each specialist has a small, focused prompt and toolset.",
        "Parallel retrieval keeps latency in check.",
      ],
      cons: [
        "Coordination overhead and many more tokens overall.",
        "Conflicting findings need a clear merge rule.",
      ],
      example:
        "“Why did churn rise in Q3?” sends one agent to query the billing database and another to search support tickets, and the lead reconciles both.",
      diagram: {
        title:
          "Multi-agent RAG: a lead agent dispatches to SQL, documents and web agents, each with its own source, then merges their findings.",
        h: 200,
        nodes: [
          n("q", "Question", 46, 100, "user"),
          n("lead", "Lead agent", 168, 100, "accent"),
          n("sql", "SQL agent", 318, 34),
          n("doc", "Docs agent", 318, 100),
          n("web", "Web agent", 318, 166, "ghost"),
          n("db", "DB", 440, 34, "store"),
          n("vec", "Index", 440, 100, "store"),
        ],
        edges: [
          e("q", "lead"),
          e("lead", "sql", { both: true }),
          e("lead", "doc", { both: true }),
          e("lead", "web", { both: true, dashed: true }),
          e("sql", "db"),
          e("doc", "vec"),
        ],
      },
      code: {
        lang: "python",
        file: "multi_agent_rag.py",
        source: code(`
          lead = Agent(
              name="Lead researcher",
              instructions="Split the question, ask specialists, reconcile their findings.",
              tools=[sql_agent.as_tool(tool_name="ask_metrics", tool_description="Query billing data"),
                     docs_agent.as_tool(tool_name="ask_docs", tool_description="Search support tickets")],
          )
        `),
      },
    },
  ],
  reading: [
    {
      title: "Agentic retrieval-augmented generation: a survey on agentic RAG",
      source: "arXiv",
      href: "https://arxiv.org/abs/2501.09136",
    },
    {
      title: "Self-RAG: learning to retrieve, generate, and critique through self-reflection",
      source: "arXiv",
      href: "https://arxiv.org/abs/2310.11511",
    },
    {
      title: "Corrective retrieval augmented generation",
      source: "arXiv",
      href: "https://arxiv.org/abs/2401.15884",
    },
    {
      title: "Adaptive-RAG: learning to adapt retrieval-augmented LLMs through question complexity",
      source: "arXiv",
      href: "https://arxiv.org/abs/2403.14403",
    },
    {
      title: "How we built our multi-agent research system",
      source: "Anthropic",
      href: "https://www.anthropic.com/research/multi-agent-research-system",
    },
  ],
};
