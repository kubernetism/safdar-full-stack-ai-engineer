import { code, e, n } from "../dsl";
import type { Category } from "../types";

export const loopContext: Category = {
  slug: "loop-context-engineering",
  name: "Loop & context engineering",
  blurb: "Run the agent loop well and curate what goes into the context window at every step.",
  intro:
    "Context engineering is deciding which tokens the model sees on each turn. Context is a finite budget: as it fills, recall degrades (context rot), and facts buried in the middle are used less. These patterns keep the loop productive and the window small and relevant.",
  patterns: [
    {
      slug: "gather-act-verify",
      name: "Gather, act, verify loop",
      summary:
        "Structure every agent turn as: gather the context you need, take an action, check the result, repeat.",
      definition:
        "A practical shape for the agent loop. The agent first gathers context (search, read files), then acts (edits, tool calls), then verifies its own work against something objective (tests, linters, a rubric or a screenshot) before deciding the next step.",
      useWhen: [
        "Any agent that changes things: code, documents, data.",
        "You can give it a cheap, objective check to run after acting.",
      ],
      pros: [
        "Verification catches errors while they are cheap to fix.",
        "Clear phases make traces easy to read and debug.",
      ],
      cons: ["Verification steps cost time and tokens.", "A weak check gives false confidence."],
      example:
        "A coding agent reads the failing test, edits the function, runs the test suite, and only reports done when it passes.",
      code: {
        lang: "python",
        file: "loop.py",
        source: code(`
          while not done and steps < MAX_STEPS:
              context = gather(task, memory)        # search, read, list files
              action = agent.decide(context)
              result = execute(action)              # edit, call tool
              done, feedback = verify(result)       # tests, lint, rubric
              memory.append(feedback)
              steps += 1
        `),
      },
      diagram: {
        title:
          "Gather, act, verify: a loop of three phases, gathering context, acting, then verifying the result, repeated until done.",
        h: 190,
        nodes: [
          n("g", "Gather context", 240, 30, "store"),
          n("a", "Act", 400, 140, "accent"),
          n("v", "Verify", 80, 140, "decision"),
          n("done", "Done", 240, 160, "ghost"),
        ],
        edges: [
          e("g", "a", { curve: -24 }),
          e("a", "v"),
          e("v", "g", { curve: -24, label: "feedback" }),
          e("v", "done", { dashed: true, label: "pass" }),
        ],
      },
    },
    {
      slug: "just-in-time-context",
      name: "Just-in-time retrieval",
      summary:
        "Keep light references (paths, IDs, queries) in context and load the actual data only when it is needed.",
      definition:
        "Instead of pasting everything into the prompt up front, the agent holds pointers, such as file paths, URLs or saved queries, and uses tools to pull in content at the moment it needs it. The way it explores (names, folders, timestamps) also tells it what matters.",
      useWhen: [
        "The corpus is far bigger than the context window, as with a codebase or a data warehouse.",
        "Which data is relevant only becomes clear as the task unfolds.",
      ],
      pros: ["The window stays small and relevant.", "Always reads the current version of the data."],
      cons: [
        "Slower than having everything pre-loaded.",
        "Needs good navigation tools such as search, list and head.",
      ],
      example:
        "A code agent lists the src folder, greps for the function name, and reads only the two files that match.",
      code: {
        lang: "python",
        file: "jit.py",
        source: code(`
          tools = [list_dir, grep, read_file]       # navigation, not payloads
          prompt = f"Repo root: {root}. Files of interest are found with grep; read only what you need."
          # the agent's context holds paths like 'src/billing/invoice.py:42', not whole files
        `),
      },
      diagram: {
        title:
          "Just-in-time retrieval: the context holds lightweight references; the agent loads the actual data through tools only when needed.",
        h: 170,
        groups: [{ label: "context window", x: 10, y: 20, w: 200, h: 130 }],
        nodes: [
          n("a", "Agent", 110, 55, "accent"),
          n("refs", "paths · IDs", 110, 115, "ghost"),
          n("tool", "read_file()", 310, 85),
          n("data", "Repo / DB", 430, 85, "store"),
        ],
        edges: [
          e("a", "tool", { label: "need it" }),
          e("tool", "data"),
          e("tool", "a", { curve: 30, dashed: true, label: "just this file" }),
        ],
      },
    },
    {
      slug: "compaction",
      name: "Compaction",
      summary:
        "When the window is nearly full, summarise the conversation and continue in a fresh window from the summary.",
      definition:
        "Near the context limit, the agent (or the harness) writes a dense summary of what matters (decisions, open problems, key file paths) and drops the raw history. Work continues in a new window seeded with that summary. Clearing old tool results is the lightest form.",
      useWhen: [
        "Long tasks with many turns, such as coding sessions or extended research.",
        "Old tool output is no longer needed in full.",
      ],
      pros: ["Lets work continue far past a single window.", "Removes noise that would distract the model."],
      cons: ["Summaries lose detail; a missed fact is gone.", "Tuning what to keep takes iteration."],
      example:
        "After 150 turns, a coding session is compacted to a page of notes: the goal, files changed, decisions and the failing test.",
      code: {
        lang: "python",
        file: "compact.py",
        source: code(`
          if token_count(messages) > 0.8 * CONTEXT_LIMIT:
              summary = llm(COMPACT_PROMPT + render(messages))   # decisions, open issues, file paths
              messages = [system, user(f"Summary of earlier work:\\n{summary}"), *messages[-6:]]
        `),
      },
      diagram: {
        title:
          "Compaction: a nearly full context window is summarised, and the summary seeds a fresh window.",
        h: 170,
        groups: [
          { label: "window 1 (90% full)", x: 10, y: 20, w: 190, h: 130 },
          { label: "window 2", x: 290, y: 20, w: 180, h: 130 },
        ],
        nodes: [
          n("h", "history\n+ tool output", 105, 85, "ghost"),
          n("s", "Summary", 380, 65, "accent"),
          n("new", "new turns", 380, 120),
        ],
        edges: [e("h", "s", { label: "summarise" })],
      },
    },
    {
      slug: "structured-notes",
      name: "Structured note-taking (external memory)",
      summary:
        "The agent writes progress, decisions and to-dos to a file or store and reads them back later.",
      definition:
        "Rather than relying on the context window as memory, the agent keeps notes outside it: a NOTES.md, a to-do list or a memory tool. Notes survive compaction and new sessions, so the agent can pick up where it left off.",
      useWhen: [
        "Tasks span many context windows or sessions.",
        "Progress has structure, such as milestones, test counts or open questions.",
      ],
      pros: ["Persistent memory with almost no overhead.", "Humans can read and correct the notes."],
      cons: [
        "Notes go stale if the agent forgets to update them.",
        "Needs instructions on what is worth writing down.",
      ],
      example:
        "A migration agent keeps PROGRESS.md: 34 of 120 files converted, known issues, and the next file to do.",
      code: {
        lang: "markdown",
        file: "PROGRESS.md",
        source: code(`
          # Migration progress
          - [x] 34/120 files converted to the new API
          - [ ] Next: src/billing/invoice.py
          ## Decisions
          - Keep the legacy date format in exports (customer contracts depend on it)
          ## Open issues
          - test_refund_partial flaky on CI; not caused by the migration
        `),
      },
      diagram: {
        title:
          "Structured note-taking: sessions read and write a notes file outside the context window, so progress survives between them.",
        h: 170,
        nodes: [
          n("s1", "Session 1", 80, 50, "accent"),
          n("s2", "Session 2", 80, 130, "accent"),
          n("notes", "PROGRESS.md", 320, 90, "store"),
        ],
        edges: [
          e("s1", "notes", { label: "write" }),
          e("notes", "s2", { label: "read" }),
          e("s2", "notes", { curve: -30, dashed: true, label: "update" }),
        ],
      },
    },
    {
      slug: "subagent-isolation",
      name: "Sub-agent context isolation",
      summary:
        "Send noisy exploration to a sub-agent with its own window; only its short conclusion comes back.",
      definition:
        "A sub-agent is started with a fresh context for one focused job, such as searching a codebase or reading 30 pages. It may use tens of thousands of tokens internally but returns a condensed answer, keeping the main agent's context clean.",
      useWhen: [
        "A sub-task involves lots of reading whose details the main agent does not need.",
        "Several such explorations could run in parallel.",
      ],
      pros: ["Keeps the main context focused and small.", "Parallel sub-agents finish faster."],
      cons: ["The main agent loses detail it might later want.", "More total tokens across all windows."],
      example:
        "The main agent asks a sub-agent “where is the auth token validated?” and gets back two file paths with one-line explanations.",
      code: {
        lang: "python",
        file: "subagent.py",
        source: code(`
          finding = await run(
              explorer,                       # fresh context, read-only tools
              "Find where auth tokens are validated. Reply with file:line and one sentence each.",
          )
          main_messages.append(user(f"Explorer found:\\n{finding}"))   # ~100 tokens, not 40k
        `),
      },
      diagram: {
        title:
          "Sub-agent isolation: the main agent sends a question to a sub-agent with a large private context and gets back a short answer.",
        h: 170,
        groups: [{ label: "sub-agent window: 40k tokens", x: 250, y: 20, w: 220, h: 130 }],
        nodes: [
          n("main", "Main agent", 90, 85, "accent"),
          n("sub", "Explorer", 360, 60),
          n("raw", "files · search hits", 360, 118, "ghost"),
        ],
        edges: [
          e("main", "sub", { curve: 16, label: "question" }),
          e("sub", "main", { curve: 16, label: "100 tokens" }),
          e("sub", "raw", { dashed: true, both: true }),
        ],
      },
    },
    {
      slug: "stable-prefix-caching",
      name: "Stable prefix (prompt caching)",
      summary:
        "Order the context from most stable to most volatile so the long shared prefix is cached between calls.",
      definition:
        "Providers can cache a prompt prefix and reuse it on later calls at a much lower price and latency. Put tools, system instructions and large reference documents first, never edit earlier turns, and append new content at the end so the cached prefix stays valid.",
      useWhen: [
        "Agent loops and chats that resend the same long instructions or documents every call.",
        "Cost or time-to-first-token matters.",
      ],
      pros: [
        "Large cost and latency savings on long, repeated prefixes.",
        "Pushes you towards a clean, append-only context design.",
      ],
      cons: [
        "Any change early in the prompt invalidates the cache.",
        "Cache entries expire, so idle sessions pay full price again.",
      ],
      example:
        "A support agent sends 20k tokens of policies on every turn; marking them as a cached prefix makes later turns much cheaper.",
      code: {
        lang: "python",
        file: "cache.py",
        source: code(`
          response = client.messages.create(
              model=MODEL,
              system=[
                  {"type": "text", "text": INSTRUCTIONS},
                  {"type": "text", "text": POLICY_DOCS, "cache_control": {"type": "ephemeral"}},
              ],
              messages=history + [new_user_turn],    # append-only
          )
        `),
      },
      diagram: {
        title:
          "Stable prefix: tools, system prompt and documents form a cached prefix; only the newest turns change between calls.",
        h: 130,
        groups: [{ label: "cached prefix", x: 10, y: 24, w: 300, h: 80 }],
        nodes: [
          n("t", "Tools", 60, 70, "store"),
          n("s", "System", 150, 70, "store"),
          n("d", "Docs", 245, 70, "store"),
          n("h", "History", 360, 70),
          n("new", "New", 445, 70, "accent"),
        ],
        edges: [e("t", "s"), e("s", "d"), e("d", "h"), e("h", "new")],
      },
    },
  ],
  reading: [
    {
      title: "Effective context engineering for AI agents",
      source: "Anthropic",
      href: "https://www.anthropic.com/research/effective-context-engineering-for-ai-agents",
    },
    {
      title: "Building agents with the Claude Agent SDK",
      source: "Anthropic",
      href: "https://claude.com/resources/articles/building-agents-with-the-claude-agent-sdk",
    },
    {
      title: "Claude Code best practices",
      source: "Claude Code docs",
      href: "https://code.claude.com/docs/en/best-practices",
    },
    {
      title: "Prompt caching",
      source: "Claude Developer Platform docs",
      href: "https://platform.claude.com/docs/en/build-with-claude/prompt-caching",
    },
    {
      title: "Lost in the middle: how language models use long contexts",
      source: "arXiv",
      href: "https://arxiv.org/abs/2307.03172",
    },
  ],
};
