import type { FdeDetail } from "../types";

const AI_ENGINEERING = { title: "AI Engineering", author: "Chip Huyen" };
const HANDS_ON_LLMS = {
  title: "Hands-On Large Language Models",
  author: "Jay Alammar, Maarten Grootendorst",
};
const PROMPT_ENG_LLMS = { title: "Prompt Engineering for LLMs", author: "John Berryman, Albert Ziegler" };

export const aiDetails: Partial<Record<string, FdeDetail>> = {
  "llm-apis": {
    summary:
      "Building on LLM APIs means wrapping model calls in real software: prompts as versioned assets, structured outputs validated against a schema, streaming, retries, timeouts, cost limits and fallbacks.",
    why: "This is the most common AI task in FDE postings. Customers want a feature that works every day on their data, not a chat demo, and the engineering around the call decides whether it does.",
    roadmap: {
      beginner: [
        "Call two providers' APIs, stream a response and handle errors and rate limits.",
        "Get structured JSON output and validate it with a schema.",
      ],
      intermediate: [
        "Build a feature (summarise, classify, extract) with prompt versioning and tests.",
        "Add caching, timeouts, retries and a fallback model.",
      ],
      advanced: [
        "Route requests between models by difficulty and cost.",
        "Run a feature in production with cost per request, latency and quality tracked.",
      ],
    },
    dos: [
      "Validate every model output before using it.",
      "Keep prompts in version control with the code that uses them.",
      "Set token limits and timeouts on every call.",
    ],
    donts: [
      "Don't parse free text with regular expressions when structured output is available.",
      "Don't send customer data to a provider the customer has not approved.",
    ],
    pitfalls: [
      "A prompt tweak that fixes one case and silently breaks others (no evals).",
      "Costs that grow with traffic because nobody measured tokens per request.",
    ],
    practice: [
      "Build an email triage feature: classify, extract fields, draft a reply, with schema validation and an eval set.",
      "Wrap two model providers behind one interface with fallback and per-request cost logging.",
    ],
    next: ["prompt-engineering", "evals", "tool-calling"],
    patterns: [
      { category: "agentic", slug: "augmented-llm" },
      { category: "openai-agents-sdk", slug: "structured-output" },
      { category: "llmops", slug: "cost-latency-control" },
    ],
    books: [AI_ENGINEERING, PROMPT_ENG_LLMS, HANDS_ON_LLMS],
    interview: [
      "How would you make an LLM-powered extraction feature reliable enough for a customer's production workflow?",
      "What would you do if the model provider's latency doubled overnight?",
    ],
  },

  agents: {
    summary:
      "An agent is an LLM in a loop that chooses its next action, calls tools, observes the result and continues until the task is done or a limit is hit. Good agents have narrow tools, clear stopping rules and checks on their own work.",
    why: "Customers increasingly ask for systems that do work, not just answer questions. FDEs must judge when an agent is the right tool, when a simpler workflow is better, and how to keep an agent safe in a customer's environment.",
    roadmap: {
      beginner: [
        "Build a tool-using agent loop by hand with a step limit.",
        "Compare it with a fixed workflow for the same task.",
      ],
      intermediate: [
        "Build a multi-step agent with good tool design, memory and a verification step.",
        "Add human approval for risky actions and trace every step.",
      ],
      advanced: [
        "Design a multi-agent system (orchestrator and workers) and evaluate it against a single agent.",
        "Run an agent in production with sandboxing, budgets and evals.",
      ],
    },
    dos: [
      "Start with the simplest workflow; add autonomy only when it measurably helps.",
      "Give agents few, well-described tools with helpful errors.",
      "Cap steps, cost and time on every run.",
    ],
    donts: [
      "Don't give an agent broad credentials to customer systems.",
      "Don't ship an agent you cannot trace step by step.",
    ],
    pitfalls: [
      "Agents that loop forever or retry the same failing tool.",
      "Using an agent where a three-step workflow would be cheaper and more reliable.",
      "Prompt injection through content the agent reads.",
    ],
    practice: [
      "Build a research agent that searches, reads and writes a cited summary, with a step budget and traces.",
      "Build an ops agent that proposes changes and requires human approval before acting.",
    ],
    next: ["tool-calling", "evals", "agent-frameworks"],
    patterns: [
      { category: "agentic", slug: "agent-loop" },
      { category: "agentic", slug: "orchestrator-workers" },
      { category: "agentic", slug: "human-in-the-loop" },
      { category: "loop-context-engineering", slug: "gather-act-verify" },
    ],
    books: [AI_ENGINEERING, { title: "Building Applications with AI Agents", author: "Michael Albada" }],
    interview: [
      "When would you build an agent instead of a fixed workflow? Give an example of each.",
      "How do you stop an agent from taking a harmful action in a customer's system?",
    ],
  },

  evals: {
    summary:
      "Evals are repeatable measurements of an AI system's quality on real examples: a dataset of inputs, expected outcomes and graders (exact checks, code checks or a model judge with a rubric), run on every change.",
    why: "Customers buy outcomes, not demos. Evals are the hard evidence that the system meets their bar, the safety net for prompt and model changes, and the clearest way to show progress in a steering meeting.",
    roadmap: {
      beginner: [
        "Collect 30 real examples with expected answers and score your system by hand.",
        "Turn the obvious checks into code (format, required fields, forbidden content).",
      ],
      intermediate: [
        "Add an LLM judge with a specific rubric and validate it against human labels.",
        "Run evals in CI and block regressions.",
      ],
      advanced: [
        "Build evals for agents: task success, step efficiency, tool errors.",
        "Turn production failures and user feedback into new eval cases continuously.",
      ],
    },
    dos: [
      "Use real customer examples, with permission, not invented ones.",
      "Agree the pass bar with the customer before building.",
      "Look at failures by hand; numbers alone hide patterns.",
    ],
    donts: [
      "Don't trust a model judge you have not checked against humans.",
      "Don't overfit prompts to a tiny eval set.",
    ],
    pitfalls: [
      "Measuring what is easy instead of what the customer cares about.",
      "An eval set that never grows after launch.",
    ],
    practice: [
      "Build an eval suite for a RAG app: answer correctness, citation support and refusal when the answer is unknown.",
      "Compare two models on your eval set and write a one-page recommendation.",
    ],
    next: ["llm-observability", "prompt-engineering", "business-acumen"],
    patterns: [
      { category: "llmops", slug: "eval-suite" },
      { category: "agentic", slug: "evaluator-optimizer" },
    ],
    books: [
      AI_ENGINEERING,
      { title: "Designing Machine Learning Systems", author: "Chip Huyen" },
      { title: "Trustworthy Online Controlled Experiments", author: "Ron Kohavi, Diane Tang, Ya Xu" },
    ],
    interview: [
      "How would you prove to a customer that your AI system is good enough to launch?",
      "Your LLM judge and human reviewers disagree. What do you do?",
    ],
  },

  "tool-calling": {
    summary:
      "Tool calling lets a model ask your code to run a function: the model returns a function name and structured arguments, your code executes it and sends the result back. It is how models act on real systems.",
    why: "Employers assume this skill (the asterisk). Every agent and most integrations depend on it, and tool design decides whether the model picks the right action with the right arguments.",
    roadmap: {
      beginner: [
        "Define one tool with a JSON schema and handle the call-and-return loop.",
        "Validate the arguments before executing.",
      ],
      intermediate: [
        "Design a small toolset with clear names, descriptions and error messages.",
        "Handle parallel tool calls and tool failures gracefully.",
      ],
      advanced: [
        "Evaluate tool selection accuracy and improve it by redesigning tools.",
        "Scope tools by user permissions in a multi-tenant system.",
      ],
    },
    dos: [
      "Write tool descriptions for a model reader: when to use it, what it returns.",
      "Return compact, relevant results and actionable error messages.",
      "Enforce permissions in the tool, not in the prompt.",
    ],
    donts: [
      "Don't expose one tool per API endpoint by default.",
      "Don't execute tool arguments without validation.",
    ],
    pitfalls: [
      "Overlapping tools that confuse the model.",
      "Tools that return huge payloads and flood the context window.",
    ],
    practice: [
      "Build three task-shaped tools for a support agent and measure how often the model picks correctly.",
      "Add permission checks so the same agent behaves differently for two user roles.",
    ],
    next: ["agents", "mcp", "security-auth-compliance"],
    patterns: [
      { category: "openai-agents-sdk", slug: "function-tools" },
      { category: "agentic-system-design", slug: "agent-tool-interface" },
    ],
    books: [AI_ENGINEERING, PROMPT_ENG_LLMS],
    interview: [
      "How would you design the tools for an agent that manages a customer's support tickets?",
      "The model keeps calling the wrong tool. How do you fix it?",
    ],
  },

  mcp: {
    summary:
      "The Model Context Protocol is an open standard for connecting AI applications to tools and data. MCP servers expose tools, resources and prompts; any MCP-capable host can discover and use them.",
    why: "FDEs connect agents to many customer systems. MCP lets you write an integration once and reuse it across agents and hosts, and gives security teams one clear boundary to review.",
    roadmap: {
      beginner: [
        "Connect an MCP-capable host to an existing MCP server and use its tools.",
        "Write a minimal MCP server with one tool.",
      ],
      intermediate: [
        "Build a server for a real system (a database or ticketing tool) with auth and permissions.",
        "Run a server remotely over HTTP rather than only locally.",
      ],
      advanced: [
        "Design an MCP integration layer for a customer with several internal systems.",
        "Review third-party servers for security before allowing them.",
      ],
    },
    dos: [
      "Scope each server's permissions to what its tools need.",
      "Keep tool outputs compact and well described.",
      "Review and pin third-party servers like any dependency.",
    ],
    donts: [
      "Don't run unknown MCP servers against customer data.",
      "Don't put credentials in tool arguments or prompts.",
    ],
    pitfalls: [
      "Exposing far more tools than the agent needs, which hurts tool choice.",
      "Treating MCP as a security boundary on its own without auth.",
    ],
    practice: [
      "Write an MCP server that exposes read-only queries over a sample database, with row limits.",
      "Connect one MCP server to two different hosts and compare behaviour.",
    ],
    next: ["tool-calling", "apis-integrations", "security-auth-compliance"],
    patterns: [
      { category: "agentic-system-design", slug: "mcp-integration" },
      { category: "tech-stack", slug: "stack-mcp" },
    ],
    books: [
      AI_ENGINEERING,
      { title: "Enterprise Integration Patterns", author: "Gregor Hohpe, Bobby Woolf" },
    ],
    interview: [
      "How would you let an agent query a customer's internal database through MCP safely?",
      "What are the trade-offs of MCP versus calling the API directly from your agent?",
    ],
  },

  "ai-coding-tools": {
    summary:
      "AI coding tools such as Claude Code, Cursor and Codex read codebases, write and edit code, run commands and tests, and explain unfamiliar code. Using them well means giving clear goals and checks, and reviewing everything.",
    why: "Employers assume FDEs use these tools (the asterisk). They make it much faster to get oriented in a customer's codebase and to ship prototypes, as long as you stay accountable for quality.",
    roadmap: {
      beginner: [
        "Use an AI coding tool to explain a repository and verify its claims yourself.",
        "Have it write tests for existing code, then review them.",
      ],
      intermediate: [
        "Give project context (conventions, commands) in a memory file such as CLAUDE.md.",
        "Run multi-file changes with the tool and verify them with tests and review.",
      ],
      advanced: [
        "Automate repeatable engineering chores with headless runs in scripts or CI.",
        "Set team guidelines for safe AI-assisted changes in customer repos.",
      ],
    },
    dos: [
      "Give the tool a clear goal and an objective check, such as tests passing.",
      "Review every diff as if a new colleague wrote it.",
      "Follow the customer's policy on AI tools and code sharing.",
    ],
    donts: [
      "Don't paste customer secrets or restricted code into tools the customer has not approved.",
      "Don't merge changes you do not understand.",
    ],
    pitfalls: [
      "Accepting plausible but wrong code because it compiles.",
      "Large unreviewed diffs that hide subtle behaviour changes.",
    ],
    practice: [
      "Use an AI coding tool to add a feature to an open-source project, keeping a log of what you had to correct.",
      "Write a project memory file and measure how it changes the tool's output.",
    ],
    next: ["working-in-unfamiliar-code", "testing", "prototypes-pocs-demos"],
    patterns: [{ category: "tech-stack", slug: "stack-claude-code" }],
    books: [
      { title: "Beyond Vibe Coding", author: "Addy Osmani" },
      { title: "The Pragmatic Programmer", author: "David Thomas, Andrew Hunt" },
    ],
    interview: [
      "How do you use AI coding tools without lowering code quality?",
      "Tell me about a time an AI tool sped you up, and a time it led you astray.",
    ],
  },

  "prompt-engineering": {
    summary:
      "Prompt engineering is designing what the model sees: clear instructions, the right context, examples and output format, then iterating against evals. It is closer to writing a precise spec than to finding magic words.",
    why: "Many customer issues are fixed with better prompts and context before any code change. FDEs who iterate on prompts against evals can improve quality quickly and explain why it improved.",
    roadmap: {
      beginner: [
        "Write prompts with a role, a task, constraints and an output format.",
        "Add a few examples and compare the results.",
      ],
      intermediate: [
        "Iterate on a prompt against an eval set and track versions.",
        "Use structured output and long-context techniques (put key instructions clearly, quote sources).",
      ],
      advanced: [
        "Design prompt chains and routing for complex tasks.",
        "Tune prompts for cost and latency as well as quality.",
      ],
    },
    dos: [
      "Be explicit about what good output looks like.",
      "Test prompt changes against an eval set, not one example.",
      "Version prompts and record which version produced each output.",
    ],
    donts: ["Don't stuff every rule into one giant prompt.", "Don't rely on prompts to enforce security."],
    pitfalls: ["Overfitting to the demo example.", "Contradictory instructions added over time."],
    practice: [
      "Take a weak prompt, build a 30-case eval set and improve the score while keeping a change log.",
      "Split one complex prompt into a two-step chain and compare quality and cost.",
    ],
    next: ["evals", "llm-apis", "rag-retrieval"],
    patterns: [
      { category: "agentic", slug: "prompt-chaining" },
      { category: "llmops", slug: "prompt-versioning" },
      { category: "loop-context-engineering", slug: "stable-prefix-caching" },
    ],
    books: [
      PROMPT_ENG_LLMS,
      { title: "Prompt Engineering for Generative AI", author: "James Phoenix, Mike Taylor" },
    ],
    interview: [
      "Walk me through how you would improve a prompt that gives inconsistent answers.",
      "How do you know a prompt change made things better?",
    ],
  },

  "rag-retrieval": {
    summary:
      "Retrieval-augmented generation fetches relevant passages from the customer's data at question time and asks the model to answer from them. Quality depends mostly on chunking, search (keyword, vector, hybrid), re-ranking and permissions.",
    why: "Most enterprise AI use cases are about the customer's own documents and data. FDEs build and tune retrieval so answers are correct, cited and limited to what each user may see.",
    roadmap: {
      beginner: [
        "Build a basic RAG app: chunk, embed, retrieve top-k and answer with citations.",
        "Inspect retrieved chunks for real questions.",
      ],
      intermediate: [
        "Add hybrid search and re-ranking and measure the difference with evals.",
        "Filter retrieval by user permissions and metadata.",
      ],
      advanced: [
        "Handle hard cases: multi-hop questions, tables, frequently updated sources.",
        "Use agentic retrieval where the model decides when and what to search.",
      ],
    },
    dos: [
      "Measure retrieval separately from generation.",
      "Show sources so users can verify answers.",
      "Respect document permissions in retrieval.",
    ],
    donts: [
      "Don't judge RAG quality by a few demo questions.",
      "Don't let the index drift out of sync with the source documents.",
    ],
    pitfalls: [
      "Pure vector search missing exact terms such as product codes.",
      "Chunks that lose the context needed to understand them.",
      "Answers that confidently go beyond the retrieved evidence.",
    ],
    practice: [
      "Build RAG over a public documentation site and measure retrieval recall with 50 questions.",
      "Add permission-aware retrieval where two users see different answers.",
    ],
    next: ["evals", "data-pipelines", "databases-data-modeling"],
    patterns: [
      { category: "rag", slug: "naive-rag" },
      { category: "rag", slug: "hybrid-search" },
      { category: "rag", slug: "reranking" },
      { category: "agentic-rag", slug: "retrieval-as-tool" },
    ],
    books: [
      AI_ENGINEERING,
      {
        title: "Introduction to Information Retrieval",
        author: "Christopher D. Manning, Prabhakar Raghavan, Hinrich Schütze",
      },
      { title: "Relevant Search", author: "Doug Turnbull, John Berryman" },
    ],
    interview: [
      "A customer says the assistant misses answers that are clearly in their documents. How do you debug it?",
      "How would you make sure retrieval never shows a user a document they cannot access?",
    ],
  },

  "guardrails-ai-safety": {
    summary:
      "Guardrails are checks around an AI system: input filtering, output validation, policy and PII checks, tool permissions and human review for risky actions. For regulated customers they are also how you show compliance.",
    why: "Banks, hospitals and governments will not deploy AI they cannot control and audit. FDEs design guardrails that satisfy legal and security teams without making the product useless.",
    roadmap: {
      beginner: [
        "Add input and output validation and a refusal path to an AI feature.",
        "Detect and redact personal data in logs and prompts.",
      ],
      intermediate: [
        "Add policy checks with a fast classifier and measure false positives.",
        "Defend against prompt injection by isolating untrusted content.",
      ],
      advanced: [
        "Map a customer's regulatory requirements to concrete controls and evidence.",
        "Red-team an AI system and track fixes.",
      ],
    },
    dos: [
      "Enforce limits in code and permissions, not only in prompts.",
      "Log decisions so they can be audited.",
      "Involve the customer's risk and legal teams early.",
    ],
    donts: [
      "Don't promise that a model will never make mistakes.",
      "Don't add guardrails so strict that users route around the system.",
    ],
    pitfalls: ["Guardrails tested only on obvious attacks.", "Personal data leaking into traces and logs."],
    practice: [
      "Red-team your own RAG app with injection attempts hidden in documents and fix what gets through.",
      "Write a controls matrix mapping an AI feature's risks to mitigations and evidence.",
    ],
    next: ["security-auth-compliance", "evals", "domain-expertise"],
    patterns: [
      { category: "openai-agents-sdk", slug: "guardrails" },
      { category: "agentic-system-design", slug: "prompt-injection-isolation" },
      { category: "agentic", slug: "human-in-the-loop" },
    ],
    books: [AI_ENGINEERING, { title: "The Alignment Problem", author: "Brian Christian" }],
    interview: [
      "A bank wants an AI assistant for customer service. What guardrails would you propose?",
      "How do you defend an agent that reads emails against prompt injection?",
    ],
  },

  "agent-frameworks": {
    summary:
      "Frameworks such as LangChain and LangGraph provide components for model calls, retrieval, memory, tools and stateful multi-step graphs. They speed up building but add abstractions you need to understand.",
    why: "Some customers already use these frameworks, and postings mention them. FDEs should know when a framework helps (state, persistence, many integrations) and when plain code is clearer.",
    roadmap: {
      beginner: [
        "Build the same small agent with plain code and with a framework; compare.",
        "Learn the framework's core concepts and how to trace a run.",
      ],
      intermediate: [
        "Build a stateful multi-step workflow with branching and persistence.",
        "Add human-in-the-loop checkpoints to a graph.",
      ],
      advanced: [
        "Debug and optimise a framework-based system in production.",
        "Decide, with evidence, whether to keep or remove a framework in a codebase.",
      ],
    },
    dos: [
      "Understand what each abstraction does under the hood.",
      "Pin framework versions; APIs change quickly.",
      "Keep business logic outside framework-specific code.",
    ],
    donts: ["Don't add a framework for a single model call.", "Don't chain abstractions you cannot debug."],
    pitfalls: [
      "Breaking changes from unpinned upgrades.",
      "Hidden prompts inside components that you never reviewed.",
    ],
    practice: [
      "Build a LangGraph workflow with a review step and persistence, then rebuild its core in plain code.",
      "Trace a framework run end to end and list every model call it makes.",
    ],
    next: ["agents", "llm-observability", "tool-calling"],
    patterns: [
      { category: "agentic-system-design", slug: "durable-execution" },
      { category: "tech-stack", slug: "stack-crewai" },
    ],
    books: [
      { title: "Learning LangChain", author: "Mayo Oshin, Nuno Campos" },
      { title: "Generative AI with LangChain", author: "Ben Auffarth" },
    ],
    interview: [
      "When would you use LangGraph instead of writing the agent loop yourself?",
      "How do you debug a framework-based agent that gives a wrong answer?",
    ],
  },

  "llm-observability": {
    summary:
      "LLM observability records each request as a trace of retrieval, model and tool calls, with latency, tokens, cost, errors and the prompt version, plus quality signals such as user feedback.",
    why: "Employers assume it (the asterisk). When a customer reports a bad answer or a cost spike, traces are how you explain what happened, and they become the raw material for evals.",
    roadmap: {
      beginner: [
        "Log every model call with latency, tokens, model and prompt version.",
        "Add a request ID that links all calls in one user request.",
      ],
      intermediate: [
        "Add tracing with spans for retrieval, model and tool calls.",
        "Build dashboards for latency, cost per request and error rate.",
      ],
      advanced: [
        "Track quality in production with feedback, sampled reviews and alerts.",
        "Use standard conventions so traces can move between tools.",
      ],
    },
    dos: [
      "Redact personal data before storing prompts and outputs.",
      "Track cost per request and per customer.",
      "Sample production traces into eval sets.",
    ],
    donts: [
      "Don't store sensitive prompts forever; set retention.",
      "Don't watch only averages; look at slow and failed requests.",
    ],
    pitfalls: [
      "No link between a user complaint and the trace that caused it.",
      "Tracing costs that grow unchecked at high volume.",
    ],
    practice: [
      "Instrument an agent with OpenTelemetry-style spans and build a cost and latency dashboard.",
      "Trace one bad answer from user report to root cause and add it to your eval set.",
    ],
    next: ["evals", "production-systems", "inference-gpu-optimization"],
    patterns: [
      { category: "llmops", slug: "llm-observability" },
      { category: "openai-agents-sdk", slug: "tracing" },
    ],
    books: [
      { title: "Observability Engineering", author: "Charity Majors, Liz Fong-Jones, George Miranda" },
      AI_ENGINEERING,
    ],
    interview: [
      "What would you record for every LLM call in production, and why?",
      "A customer's AI bill doubled this month. How do you find out why?",
    ],
  },

  "classical-ml": {
    summary:
      "Classical ML covers models such as linear and logistic regression, decision trees, gradient boosting and clustering, built with libraries like scikit-learn, and the workflow of features, validation and metrics.",
    why: "Not every problem needs an LLM. A forecasting or fraud model may be cheaper and more reliable, and some customers already run ML pipelines that an FDE must integrate with.",
    roadmap: {
      beginner: [
        "Train and evaluate a model with scikit-learn using train, validation and test splits.",
        "Learn precision, recall and when each matters.",
      ],
      intermediate: [
        "Engineer features, handle imbalance and tune hyperparameters.",
        "Compare a classical model with an LLM approach on the same task.",
      ],
      advanced: [
        "Deploy and monitor a model for drift.",
        "Explain model behaviour to non-technical stakeholders.",
      ],
    },
    dos: [
      "Start with a simple baseline.",
      "Keep test data truly unseen.",
      "Choose metrics that match the business cost of errors.",
    ],
    donts: [
      "Don't use an LLM where a simple classifier is cheaper and better.",
      "Don't leak future information into training features.",
    ],
    pitfalls: [
      "Great offline accuracy that collapses on real data.",
      "Optimising accuracy when the costly errors are rare.",
    ],
    practice: [
      "Build a ticket-priority classifier with scikit-learn and compare it with an LLM classifier on cost and accuracy.",
      "Add drift monitoring to a deployed model.",
    ],
    next: ["fine-tuning", "evals", "data-pipelines"],
    books: [
      {
        title: "Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow",
        author: "Aurélien Géron",
      },
      {
        title: "An Introduction to Statistical Learning",
        author: "Gareth James, Daniela Witten, Trevor Hastie, Robert Tibshirani",
      },
      { title: "The Hundred-Page Machine Learning Book", author: "Andriy Burkov" },
    ],
    interview: [
      "When would you recommend a classical model over an LLM for a customer?",
      "How do you know a model will work on next month's data?",
    ],
  },

  "fine-tuning": {
    summary:
      "Fine-tuning further trains a pre-trained model on targeted examples to change its behaviour, format or skill. Post-training methods include supervised fine-tuning and preference-based training.",
    why: "It is a nice-to-have for FDEs, but customers ask about it often. Knowing when it helps (consistent format, style, a narrow task at lower cost) and when prompting or retrieval is better saves weeks.",
    roadmap: {
      beginner: [
        "Learn when fine-tuning helps versus prompting and retrieval.",
        "Prepare a clean training set from real examples.",
      ],
      intermediate: [
        "Fine-tune a small open model or use a provider's fine-tuning API, and evaluate against the base model.",
        "Use parameter-efficient methods such as LoRA.",
      ],
      advanced: [
        "Run a preference-tuning experiment and measure the effect with evals.",
        "Operate fine-tuned models: versioning, retraining and rollback.",
      ],
    },
    dos: [
      "Try prompting and retrieval first and keep them as baselines.",
      "Hold out an eval set the model never trains on.",
      "Check data rights before training on customer data.",
    ],
    donts: [
      "Don't fine-tune to add facts that change often; use retrieval.",
      "Don't skip comparing against the base model.",
    ],
    pitfalls: [
      "Small, noisy datasets that teach the wrong behaviour.",
      "Models that improve on one task and regress on others.",
    ],
    practice: [
      "Fine-tune a small model to produce a strict output format and compare with prompting.",
      "Write a one-page decision memo: prompt, RAG or fine-tune, for a sample customer request.",
    ],
    next: ["classical-ml", "evals", "inference-gpu-optimization"],
    books: [
      {
        title: "Natural Language Processing with Transformers",
        author: "Lewis Tunstall, Leandro von Werra, Thomas Wolf",
      },
      HANDS_ON_LLMS,
      AI_ENGINEERING,
    ],
    interview: [
      "A customer wants to fine-tune a model on their documents. What do you advise?",
      "How would you measure whether fine-tuning was worth it?",
    ],
  },

  "inference-gpu-optimization": {
    summary:
      "Inference optimization makes serving models faster and cheaper: batching, caching, quantisation, choosing the right hardware and serving framework, and measuring latency and throughput.",
    why: "It matters most when customers host models themselves or run high volumes. FDEs who can reason about latency, throughput and GPU cost can unblock deployments that otherwise look too expensive.",
    roadmap: {
      beginner: [
        "Measure time to first token, tokens per second and cost for a hosted model.",
        "Use prompt caching and streaming to reduce latency.",
      ],
      intermediate: [
        "Serve an open model with a production serving framework and measure throughput.",
        "Try quantisation and compare quality and speed.",
      ],
      advanced: [
        "Tune batching and hardware for a target latency and cost.",
        "Plan GPU capacity for a customer's expected load.",
      ],
    },
    dos: [
      "Measure before optimising.",
      "Check quality after every optimisation with evals.",
      "Consider smaller models and caching before more hardware.",
    ],
    donts: [
      "Don't assume self-hosting is cheaper; do the maths.",
      "Don't quantise without measuring the quality impact.",
    ],
    pitfalls: [
      "Optimising throughput while users suffer from slow first tokens.",
      "Idle GPUs costing more than the API they replaced.",
    ],
    practice: [
      "Serve an open model locally, benchmark it, then quantise it and compare.",
      "Build a cost model comparing API usage with self-hosting for a given traffic level.",
    ],
    next: ["llm-observability", "fine-tuning", "cloud-deployment"],
    patterns: [
      { category: "llmops", slug: "cost-latency-control" },
      { category: "loop-context-engineering", slug: "stable-prefix-caching" },
    ],
    books: [
      AI_ENGINEERING,
      {
        title: "Programming Massively Parallel Processors",
        author: "David B. Kirk, Wen-mei W. Hwu, Izzat El Hajj",
      },
    ],
    interview: [
      "A customer wants to self-host a model to save money. How do you evaluate that?",
      "What levers would you pull to cut latency for an LLM feature?",
    ],
  },
};
