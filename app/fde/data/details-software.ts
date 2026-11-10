import type { FdeDetail } from "../types";

export const softwareDetails: Partial<Record<string, FdeDetail>> = {
  "production-systems": {
    summary:
      "Production work means your code serves real users who notice when it fails. It covers structured logging, metrics and alerts, error tracking, safe rollouts and the habit of fixing the root cause rather than the symptom.",
    why: "An FDE's prototype becomes the customer's production system faster than anyone plans. You are often the only engineer who understands it, so you need to see problems before the customer does, diagnose them inside their environment and restore service calmly.",
    roadmap: {
      beginner: [
        "Add structured logs with request IDs to a small app and read them to debug one real bug.",
        "Deploy an app with health checks and a basic uptime alert.",
      ],
      intermediate: [
        "Define two or three service level indicators (latency, error rate) and dashboards for them.",
        "Add error tracking and fix the top three recurring errors at the root.",
        "Roll out a change behind a feature flag and roll it back safely.",
      ],
      advanced: [
        "Set SLOs with error budgets and use them to decide when to ship or stabilise.",
        "Run a blameless postmortem and land the follow-up fixes.",
      ],
    },
    dos: [
      "Log events with context (who, what, request ID), never secrets or personal data.",
      "Alert on symptoms users feel, such as errors and latency, not on every CPU spike.",
      "Keep releases small so a bad one is easy to spot and revert.",
    ],
    donts: [
      "Don't treat a restart as a fix; find out why it broke.",
      "Don't ship without a way to roll back.",
    ],
    pitfalls: [
      "Alert fatigue: so many noisy alerts that the real one is ignored.",
      "Logs that say something failed but not which request, user or input caused it.",
      "Fixing in production by hand and forgetting to put the fix in code.",
    ],
    practice: [
      "Take a side project live for at least a month with real users, logs, an uptime check and an error budget.",
      "Break your own app on purpose (kill the database, add latency) and practise detecting and recovering.",
    ],
    next: ["on-call-incident-response", "llm-observability", "ci-cd-devops"],
    patterns: [
      { category: "devops", slug: "observability" },
      { category: "system-design", slug: "circuit-breaker" },
    ],
    books: [
      {
        title: "Site Reliability Engineering",
        author: "Betsy Beyer, Chris Jones, Jennifer Petoff, Niall Richard Murphy",
      },
      { title: "Release It!", author: "Michael T. Nygard" },
      { title: "Observability Engineering", author: "Charity Majors, Liz Fong-Jones, George Miranda" },
    ],
    interview: [
      "Tell me about a production incident you owned. How did you find the cause and what changed afterwards?",
      "What would you monitor on day one for an LLM feature you just deployed for a customer?",
    ],
  },

  "apis-integrations": {
    summary:
      "Integration work connects your system to the customer's: calling their REST or GraphQL APIs, receiving webhooks, syncing data and fitting into their authentication. It is mostly about contracts, failure handling and data mapping.",
    why: "Almost every FDE project lives or dies on integration. The model may work in a demo, but value only appears when it reads from the customer's CRM, ticketing system or data warehouse and writes results back safely.",
    roadmap: {
      beginner: [
        "Call a public API with authentication, pagination and error handling.",
        "Build a small API of your own with input validation and clear error responses.",
      ],
      intermediate: [
        "Receive and verify webhooks, and make the handler idempotent.",
        "Integrate with an OAuth-protected API, including token refresh.",
        "Add retries with backoff and a timeout to every outbound call.",
      ],
      advanced: [
        "Design an integration layer (adapters) so one product can support several customer systems.",
        "Sync data between systems with change tracking and reconciliation reports.",
      ],
    },
    dos: [
      "Read the customer's API docs and rate limits before writing code.",
      "Wrap each external system behind an adapter with its own tests.",
      "Make writes idempotent so retries cannot create duplicates.",
    ],
    donts: [
      "Don't assume the customer's API behaves as documented; test it.",
      "Don't hard-code credentials or customer-specific IDs.",
    ],
    pitfalls: [
      "Ignoring pagination and silently processing only the first page.",
      "No timeouts, so one slow dependency hangs the whole system.",
      "Mapping fields by guesswork instead of confirming meaning with the customer.",
    ],
    practice: [
      "Build a sync between two SaaS tools you use (for example a form tool and a spreadsheet) with webhooks and retries.",
      "Write an adapter interface for two different ticketing APIs and swap between them with configuration.",
    ],
    next: ["system-design-existing-architecture", "security-auth-compliance", "mcp"],
    patterns: [
      { category: "software-design", slug: "adapter" },
      { category: "system-design", slug: "retry-backoff" },
      { category: "data-engineering", slug: "transactional-outbox" },
    ],
    books: [
      { title: "Enterprise Integration Patterns", author: "Gregor Hohpe, Bobby Woolf" },
      { title: "API Design Patterns", author: "JJ Geewax" },
      { title: "Designing Web APIs", author: "Brenda Jin, Saurabh Sahni, Amir Shevat" },
    ],
    interview: [
      "How would you integrate with a customer API that is slow, rate-limited and occasionally returns errors?",
      "Walk me through making a webhook handler safe to receive the same event twice.",
    ],
  },

  "system-design-existing-architecture": {
    summary:
      "This is system design with constraints you did not choose: the customer's cloud, network rules, identity provider, data residency and approved services. The job is to find a design that works inside those limits.",
    why: "FDEs rarely get a greenfield. Security and platform teams will block anything that ignores their architecture, so a design that fits their rules ships, while a better design that does not fit never leaves review.",
    roadmap: {
      beginner: [
        "Draw the architecture of a system you use at work or study: components, data flows, trust boundaries.",
        "List the constraints (network, identity, data) for one real deployment.",
      ],
      intermediate: [
        "Write a short design doc with two options and trade-offs for a feature inside an existing system.",
        "Design for a constraint such as private networking only or data that must stay in one region.",
      ],
      advanced: [
        "Lead an architecture review with a customer's security and platform teams and get approval.",
        "Plan an incremental migration that keeps the old system running (strangler approach).",
      ],
    },
    dos: [
      "Ask for the customer's architecture diagrams, standards and approved services early.",
      "Present options with trade-offs and a clear recommendation.",
      "Design for their operations team, who will run it after you leave.",
    ],
    donts: [
      "Don't propose new infrastructure they cannot support or approve.",
      "Don't hide constraints you discover late; raise them immediately.",
    ],
    pitfalls: [
      "Designing the ideal system and then discovering network or compliance rules that rule it out.",
      "Forgetting non-functional needs: audit, backup, latency across regions.",
    ],
    practice: [
      "Take an open-source app and design how it would be deployed inside a locked-down company network.",
      "Write a one-page design doc for adding an AI feature to an existing app, including what you would not change.",
    ],
    next: ["apis-integrations", "cloud-deployment", "security-auth-compliance"],
    patterns: [
      { category: "system-design", slug: "cqrs" },
      { category: "system-design", slug: "queue-load-leveling" },
    ],
    books: [
      { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann" },
      { title: "Fundamentals of Software Architecture", author: "Mark Richards, Neal Ford" },
      {
        title: "Software Architecture: The Hard Parts",
        author: "Neal Ford, Mark Richards, Pramod Sadalage, Zhamak Dehghani",
      },
    ],
    interview: [
      "A customer requires all data to stay in their VPC and only allows approved managed services. How do you design an LLM-powered feature?",
      "Tell me about a time an existing system's constraints changed your design.",
    ],
  },

  python: {
    summary:
      "Python is the working language of AI engineering: model SDKs, data tools, notebooks, scripts and many backend APIs. Fluency means writing clear, typed, tested Python and knowing the ecosystem (packaging, async, data libraries).",
    why: "Most LLM SDKs, evaluation tools and data work start in Python, and customers' data teams usually speak it. An FDE who is fast in Python can prototype, script data fixes and ship services without waiting on anyone.",
    roadmap: {
      beginner: [
        "Write scripts with functions, classes, error handling and virtual environments.",
        "Call an HTTP API and an LLM API from Python and parse JSON safely.",
      ],
      intermediate: [
        "Add type hints and check them; validate inputs with Pydantic.",
        "Build an async API service (for example FastAPI) with tests.",
        "Package a project with a lock file and run it in a container.",
      ],
      advanced: [
        "Profile and optimise a slow data or I/O-heavy path.",
        "Structure a larger codebase with clear modules and dependency boundaries.",
      ],
    },
    dos: [
      "Use type hints and a formatter and linter from day one.",
      "Pin dependencies with a lock file.",
      "Prefer the standard library and well-known packages over clever code.",
    ],
    donts: [
      "Don't leave logic in notebooks when it needs to run in production.",
      "Don't block the event loop with synchronous calls in async code.",
    ],
    pitfalls: [
      "Dependency conflicts from unpinned packages in a customer environment.",
      "Silent failures from broad except clauses that swallow errors.",
    ],
    practice: [
      "Build a FastAPI service that wraps an LLM call with validation, retries and tests.",
      "Write a CLI that pulls data from an API, cleans it and loads it into SQLite.",
    ],
    next: ["llm-apis", "testing", "sql"],
    patterns: [{ category: "tech-stack", slug: "stack-fastapi" }],
    books: [
      { title: "Fluent Python", author: "Luciano Ramalho" },
      { title: "Effective Python", author: "Brett Slatkin" },
      { title: "Architecture Patterns with Python", author: "Harry Percival, Bob Gregory" },
    ],
    interview: [
      "How do you structure a Python service so it is easy to test and deploy?",
      "When would you use async in Python, and what can go wrong?",
    ],
  },

  "typescript-javascript": {
    summary:
      "JavaScript runs in every browser and, through Node.js, on many servers. TypeScript adds static types that catch mistakes early and make large codebases easier to change.",
    why: "Customers judge AI work through a user interface. FDEs often need to build or adjust a front end, a Next.js app or a Node integration, and many AI SDKs have first-class TypeScript versions.",
    roadmap: {
      beginner: [
        "Build a small web page with fetch, async/await and DOM updates.",
        "Convert a JavaScript file to TypeScript with strict mode on.",
      ],
      intermediate: [
        "Build a React or Next.js app that calls your API and streams an LLM response.",
        "Model data with types, discriminated unions and runtime validation at the edges.",
      ],
      advanced: [
        "Set up a typed full-stack app with shared types between server and client.",
        "Diagnose a performance problem in a front end (bundle size, rendering).",
      ],
    },
    dos: [
      "Turn on strict mode and avoid any.",
      "Validate external data at runtime; types alone do not check JSON from the network.",
      "Keep the toolchain simple: one package manager, one formatter.",
    ],
    donts: [
      "Don't silence type errors with casts instead of fixing the types.",
      "Don't ship secrets to the browser bundle.",
    ],
    pitfalls: [
      "Trusting API responses because the TypeScript type says they are correct.",
      "Unhandled promise rejections that fail silently.",
    ],
    practice: [
      "Build a chat UI that streams model output with a stop button and error states.",
      "Write a typed SDK wrapper for an API you use, with tests.",
    ],
    next: ["full-stack", "llm-apis", "testing"],
    books: [
      { title: "Effective TypeScript", author: "Dan Vanderkam" },
      { title: "Programming TypeScript", author: "Boris Cherny" },
      { title: "JavaScript: The Definitive Guide", author: "David Flanagan" },
    ],
    interview: [
      "Why would you choose TypeScript over JavaScript for a customer project, and what are the costs?",
      "How do you safely handle data coming from an API in a typed front end?",
    ],
  },

  "working-in-unfamiliar-code": {
    summary:
      "Most FDE code changes land in repositories you did not write: the customer's services, an old integration or a colleague's prototype. The skill is getting oriented quickly, finding the right place to change and not breaking anything.",
    why: "Employers assume this skill, which is why postings rarely list it. You will be dropped into a customer's codebase with little documentation and expected to ship within days.",
    roadmap: {
      beginner: [
        "Clone an open-source project, run it locally and trace one request from entry point to database.",
        "Use search, go-to-definition and git blame to answer why a line exists.",
      ],
      intermediate: [
        "Fix a real bug in an open-source project and get the pull request merged.",
        "Add characterisation tests around code before changing it.",
      ],
      advanced: [
        "Refactor a legacy module in small, safe steps while it keeps running.",
        "Write a short map of a codebase (entry points, key modules, gotchas) for the next person.",
      ],
    },
    dos: [
      "Run it and read the tests first; they show intended behaviour.",
      "Make the smallest change that solves the problem, matching local conventions.",
      "Ask the code's owners about history before removing anything odd.",
    ],
    donts: [
      "Don't rewrite what you have not understood.",
      "Don't reformat whole files in a feature change; it hides the real diff.",
    ],
    pitfalls: [
      "Removing code that looked unused but handled a rare case.",
      "Changing behaviour other teams depend on without telling them.",
    ],
    practice: [
      "Pick an open-source project in a language you know less well and land two small fixes.",
      "Use an AI coding tool to explain a large repo, then verify its explanation by tracing the code yourself.",
    ],
    next: ["testing", "ai-coding-tools", "system-design-existing-architecture"],
    books: [
      { title: "Working Effectively with Legacy Code", author: "Michael Feathers" },
      { title: "Refactoring", author: "Martin Fowler" },
      { title: "Software Design X-Rays", author: "Adam Tornhill" },
    ],
    interview: [
      "You have one day to fix a bug in a large codebase you have never seen. Walk me through your first two hours.",
      "How do you change legacy code that has no tests?",
    ],
  },

  "security-auth-compliance": {
    summary:
      "The basics are authentication (who you are), authorisation (what you may do), secret management, encryption, input validation and an awareness of the rules that apply to the customer, such as data protection and industry regulations.",
    why: "FDEs handle customer data and credentials inside customer environments. One leaked key or over-broad permission can end a deployment, and security reviews are often the longest step before go-live.",
    roadmap: {
      beginner: [
        "Learn the OWASP Top 10 and fix one of each class in a sample app.",
        "Store secrets in environment variables or a secret manager, never in code.",
      ],
      intermediate: [
        "Implement OAuth/OIDC login and role-based access checks on every endpoint.",
        "Prepare answers for a customer security questionnaire about one of your systems.",
      ],
      advanced: [
        "Threat-model an AI feature, including prompt injection and data leakage.",
        "Design audit logging and data retention that meets a regulated customer's needs.",
      ],
    },
    dos: [
      "Check authorisation on the server for every request and resource.",
      "Use the customer's identity provider and least-privilege service accounts.",
      "Log security events, without logging secrets or personal data.",
    ],
    donts: [
      "Don't roll your own crypto or auth.",
      "Don't send customer data to third-party services without explicit approval.",
    ],
    pitfalls: [
      "Checking permissions in the UI but not in the API.",
      "API keys pasted into notebooks, tickets or chat.",
      "Discovering compliance requirements in the final review.",
    ],
    practice: [
      "Add login, roles and audit logs to a small app, then try to break your own authorisation.",
      "Write a one-page security overview for an AI prototype: data flows, storage, access, retention.",
    ],
    next: ["guardrails-ai-safety", "apis-integrations", "cloud-deployment"],
    patterns: [
      { category: "agentic-system-design", slug: "sandbox-least-privilege" },
      { category: "agentic-system-design", slug: "prompt-injection-isolation" },
    ],
    books: [
      { title: "Alice and Bob Learn Application Security", author: "Tanya Janca" },
      { title: "Web Application Security", author: "Andrew Hoffman" },
      { title: "OAuth 2 in Action", author: "Justin Richer, Antonio Sanso" },
    ],
    interview: [
      "How would you make sure an internal AI assistant only shows each employee documents they are allowed to see?",
      "What would you check before connecting a customer's production database to a new service?",
    ],
  },

  "full-stack": {
    summary:
      "Full-stack means you can deliver the whole feature: database, API and the front end people use. For AI products that includes streaming responses, loading and error states and feedback controls.",
    why: "A backend alone does not convince a customer. FDEs often need to put a usable interface in front of stakeholders quickly, and small UI choices (showing sources, a stop button) decide whether users trust an AI feature.",
    roadmap: {
      beginner: [
        "Build a CRUD app with a form, a list and server-side validation.",
        "Learn the basics of accessible HTML and responsive CSS.",
      ],
      intermediate: [
        "Build a chat interface with streaming, retries, and error and empty states.",
        "Add authentication and per-user data to a full-stack app.",
      ],
      advanced: [
        "Ship a production front end with performance budgets and usability testing.",
        "Design AI UX: citations, confidence cues, feedback and human review flows.",
      ],
    },
    dos: [
      "Design every state: loading, empty, error and success.",
      "Show sources and let users give feedback on AI answers.",
      "Use an existing component library rather than building widgets from scratch.",
    ],
    donts: [
      "Don't ship a UI that hangs silently while the model thinks.",
      "Don't treat accessibility as optional.",
    ],
    pitfalls: [
      "Only testing the happy path on a fast laptop.",
      "A beautiful demo UI with no way to handle long or failed responses.",
    ],
    practice: [
      "Build a document Q&A app end to end: upload, retrieval, streamed answer with citations.",
      "Add thumbs up/down feedback to an AI feature and store it for evals.",
    ],
    next: ["typescript-javascript", "llm-apis", "prototypes-pocs-demos"],
    books: [
      { title: "Don't Make Me Think", author: "Steve Krug" },
      { title: "Refactoring UI", author: "Adam Wathan, Steve Schoger" },
      { title: "Learning React", author: "Alex Banks, Eve Porcello" },
    ],
    interview: [
      "How would you design the UI for an AI feature that is sometimes wrong?",
      "Walk me through building a streaming chat interface, front end to back end.",
    ],
  },

  "cloud-deployment": {
    summary:
      "Cloud deployment is getting services running on AWS, GCP or Azure: compute, networking, storage, identity and managed services. For FDEs it usually means deploying into the customer's account under their rules.",
    why: "Enterprise customers often require that software runs inside their own cloud. You need to be productive in whichever provider they use and to work with their platform team's guardrails.",
    roadmap: {
      beginner: [
        "Deploy a containerised app to a managed service on one provider.",
        "Learn the provider's identity model (IAM roles, service accounts).",
      ],
      intermediate: [
        "Set up private networking, a managed database and secrets for an app.",
        "Deploy the same app to a second provider and compare the concepts.",
      ],
      advanced: [
        "Deploy into a locked-down customer account with policies and no public endpoints.",
        "Design for cost, scaling and disaster recovery on a managed platform.",
      ],
    },
    dos: [
      "Use managed services the customer already approves.",
      "Grant the narrowest permissions and use roles rather than long-lived keys.",
      "Tag resources and watch costs from day one.",
    ],
    donts: [
      "Don't click-configure production by hand without recording it.",
      "Don't open services to the public internet by default.",
    ],
    pitfalls: [
      "Permissions that work in your test account but are blocked by customer policies.",
      "Surprise bills from forgotten resources or large model endpoints.",
    ],
    practice: [
      "Deploy an LLM-backed API to two different clouds with private networking and secrets.",
      "Write a runbook for deploying your app into a fresh customer account.",
    ],
    next: ["terraform-iac", "kubernetes-containers", "security-auth-compliance"],
    patterns: [{ category: "devops", slug: "iac" }],
    books: [
      { title: "Cloud Native Patterns", author: "Cornelia Davis" },
      { title: "Cloud Native Infrastructure", author: "Justin Garrison, Kris Nova" },
    ],
    interview: [
      "How do you deploy into a customer's cloud account when you have limited permissions?",
      "Which managed services would you use for an LLM app on your preferred cloud, and why?",
    ],
  },

  "databases-data-modeling": {
    summary:
      "Data modeling is deciding which entities exist, how they relate and which constraints keep them correct. Database skills include choosing between relational, document and vector stores, indexing and migrations.",
    why: "Customer data is messy and the AI feature's quality depends on it. FDEs regularly design schemas for new features, read the customer's existing models and decide where embeddings, logs and feedback live.",
    roadmap: {
      beginner: [
        "Design a normalised schema for a small domain with keys and constraints.",
        "Write migrations and seed data for it.",
      ],
      intermediate: [
        "Add indexes guided by query plans and measure the difference.",
        "Store embeddings with metadata and filter by tenant and permissions.",
      ],
      advanced: [
        "Run a zero-downtime schema change (expand, migrate, contract).",
        "Model multi-tenant data with strong isolation.",
      ],
    },
    dos: [
      "Enforce integrity in the database with constraints, not only in code.",
      "Use timestamps with time zones and store money as integers.",
      "Version every schema change as a migration.",
    ],
    donts: [
      "Don't pick a new database type when the customer's existing one will do.",
      "Don't drop or rename columns that running code still uses.",
    ],
    pitfalls: [
      "N+1 queries that are fine in the demo and slow in production.",
      "No tenant scoping, so one customer's data leaks into another's results.",
    ],
    practice: [
      "Model a support-ticket domain, then add a table for AI-generated summaries and user feedback.",
      "Add pgvector to Postgres and build filtered similarity search.",
    ],
    next: ["sql", "data-pipelines", "rag-retrieval"],
    patterns: [{ category: "system-design", slug: "sharding" }],
    books: [
      { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann" },
      { title: "Database Internals", author: "Alex Petrov" },
      { title: "SQL Antipatterns", author: "Bill Karwin" },
    ],
    interview: [
      "How would you store conversation history, feedback and retrieved sources for an AI assistant?",
      "Explain how you would change a heavily used table's schema without downtime.",
    ],
  },

  "data-pipelines": {
    summary:
      "Pipelines extract data from sources, transform it and load it somewhere useful, on a schedule or as a stream. Good pipelines are idempotent, observable and safe to re-run.",
    why: "AI features need fresh, clean customer data: documents for retrieval, records for context, results written back. FDEs often build the ingestion pipeline that keeps an AI system up to date.",
    roadmap: {
      beginner: [
        "Write a scheduled job that pulls data from an API and loads it into a database.",
        "Make the job safe to run twice without duplicating rows.",
      ],
      intermediate: [
        "Build incremental loads with watermarks and backfills.",
        "Add data quality checks and alerts on failures.",
      ],
      advanced: [
        "Stream changes with change data capture into a search or vector index.",
        "Design a layered (raw, clean, business) pipeline with lineage.",
      ],
    },
    dos: [
      "Process explicit date ranges, never just now.",
      "Keep raw data so you can re-process after a bug fix.",
      "Alert on missing or late data, not only on crashes.",
    ],
    donts: ["Don't append blindly; reruns will double-count.", "Don't ignore deletes in the source system."],
    pitfalls: [
      "A vector index that silently drifts out of date with the source documents.",
      "Personal data copied into places it should not be.",
    ],
    practice: [
      "Build a pipeline that keeps a vector index in sync with a folder of documents, including updates and deletes.",
      "Backfill a year of data in daily partitions and verify totals.",
    ],
    next: ["databases-data-modeling", "sql", "rag-retrieval"],
    patterns: [
      { category: "data-engineering", slug: "idempotent-pipelines" },
      { category: "data-engineering", slug: "cdc" },
      { category: "data-engineering", slug: "medallion" },
    ],
    books: [
      { title: "Fundamentals of Data Engineering", author: "Joe Reis, Matt Housley" },
      { title: "Data Pipelines Pocket Reference", author: "James Densmore" },
      { title: "Streaming Systems", author: "Tyler Akidau, Slava Chernyak, Reuven Lax" },
    ],
    interview: [
      "How would you keep a retrieval index in sync with documents that change every day?",
      "What makes a pipeline safe to re-run?",
    ],
  },

  sql: {
    summary:
      "SQL is how you ask questions of relational data: selecting, joining, aggregating and changing rows. The asterisk in the checklist means employers assume you already know it.",
    why: "Customer data lives in SQL databases and warehouses. FDEs use SQL to explore data during discovery, debug production issues, build evaluation sets and prove impact with numbers.",
    roadmap: {
      beginner: [
        "Write SELECT queries with WHERE, JOIN, GROUP BY and ORDER BY.",
        "Insert, update and delete safely inside transactions.",
      ],
      intermediate: [
        "Use window functions and common table expressions.",
        "Read a query plan and add the right index.",
      ],
      advanced: [
        "Write analytical queries on a warehouse to measure a business outcome.",
        "Diagnose locking and slow queries on a busy database.",
      ],
    },
    dos: [
      "Use parameterised queries, always.",
      "Explore with LIMIT and read-only roles on production data.",
      "Check row counts before and after an update.",
    ],
    donts: [
      "Don't run UPDATE or DELETE without a WHERE clause you have tested.",
      "Don't build SQL by concatenating user input.",
    ],
    pitfalls: [
      "Joins that multiply rows and inflate totals.",
      "NULL handling that silently drops records from counts.",
    ],
    practice: [
      "Answer ten real questions about a public dataset using window functions and CTEs.",
      "Build an eval dataset by querying real support tickets and their resolutions.",
    ],
    next: ["databases-data-modeling", "data-pipelines", "business-acumen"],
    books: [
      { title: "Learning SQL", author: "Alan Beaulieu" },
      { title: "SQL Performance Explained", author: "Markus Winand" },
      { title: "SQL Antipatterns", author: "Bill Karwin" },
    ],
    interview: [
      "Write a query to find each customer's most recent order.",
      "A dashboard number looks too high. How would you debug the SQL behind it?",
    ],
  },

  testing: {
    summary:
      "Automated tests check behaviour that code can verify: unit tests for logic, integration tests for components working together and end-to-end tests for key journeys. For AI systems, evals cover what plain tests cannot.",
    why: "FDEs change customer systems under time pressure. Tests are how you move fast without breaking things you cannot see, and how you hand over a system the customer's team can safely change.",
    roadmap: {
      beginner: [
        "Write unit tests for pure functions, including edge cases.",
        "Run tests automatically on every commit.",
      ],
      intermediate: [
        "Write integration tests against a real database or a test container.",
        "Mock external APIs at the network boundary, not inside your logic.",
      ],
      advanced: [
        "Add end-to-end tests for critical customer journeys.",
        "Combine tests (deterministic parts) with evals (model behaviour) in one pipeline.",
      ],
    },
    dos: [
      "Test behaviour, not implementation details.",
      "Write a failing test before fixing a bug.",
      "Keep tests fast and deterministic.",
    ],
    donts: [
      "Don't delete a failing test to get a green build.",
      "Don't try to unit-test model output with exact string matches.",
    ],
    pitfalls: [
      "Flaky tests that teach everyone to ignore failures.",
      "Mocks so heavy the test passes while production fails.",
    ],
    practice: [
      "Add tests to an untested side project until you can refactor it with confidence.",
      "Write tests for the tool functions of an agent and evals for its answers.",
    ],
    next: ["evals", "ci-cd-devops", "working-in-unfamiliar-code"],
    patterns: [{ category: "llmops", slug: "eval-suite" }],
    books: [
      { title: "Unit Testing Principles, Practices, and Patterns", author: "Vladimir Khorikov" },
      { title: "Test Driven Development: By Example", author: "Kent Beck" },
      { title: "Growing Object-Oriented Software, Guided by Tests", author: "Steve Freeman, Nat Pryce" },
    ],
    interview: [
      "How do you decide what to test in an LLM application?",
      "Tell me about a bug that tests caught before it reached a customer.",
    ],
  },

  "ci-cd-devops": {
    summary:
      "CI/CD automates building, testing and deploying every change. DevOps is the wider practice of developers owning delivery and operations together, with automation and fast feedback.",
    why: "Customers want frequent, safe improvements. A pipeline lets an FDE ship fixes quickly and gives the customer's team a repeatable path once you leave.",
    roadmap: {
      beginner: [
        "Set up a pipeline that runs lint, type checks and tests on every pull request.",
        "Automate a deploy to a staging environment.",
      ],
      intermediate: [
        "Add preview environments and automated production deploys from main.",
        "Run evals in the pipeline for prompt or model changes.",
      ],
      advanced: [
        "Use canary or blue-green releases with automated rollback.",
        "Track delivery metrics such as deployment frequency and change failure rate.",
      ],
    },
    dos: [
      "Keep the pipeline fast; slow pipelines get skipped.",
      "Fit into the customer's existing CI system where possible.",
      "Make rollback a one-step action.",
    ],
    donts: ["Don't store secrets in pipeline files.", "Don't bypass checks to hit a deadline."],
    pitfalls: [
      "Pipelines that work only from your laptop's credentials.",
      "Deploying prompts and configuration outside the pipeline, so changes are untracked.",
    ],
    practice: [
      "Build a pipeline for an LLM app with tests, an eval gate and staged deploys.",
      "Practise a rollback drill on a staging deployment.",
    ],
    next: ["testing", "kubernetes-containers", "terraform-iac"],
    patterns: [
      { category: "devops", slug: "ci-cd" },
      { category: "devops", slug: "canary" },
    ],
    books: [
      { title: "Continuous Delivery", author: "Jez Humble, David Farley" },
      { title: "Accelerate", author: "Nicole Forsgren, Jez Humble, Gene Kim" },
      { title: "The DevOps Handbook", author: "Gene Kim, Jez Humble, Patrick Debois, John Willis" },
    ],
    interview: [
      "What would a good CI/CD pipeline look like for an AI feature with prompts and models?",
      "How do you deploy safely when a change might degrade answer quality?",
    ],
  },

  java: {
    summary:
      "Java is a statically typed language on the JVM that runs a large share of enterprise backends. Knowing it lets you read and change the systems many large customers depend on.",
    why: "When the customer's core services are Java, integrations and fixes often have to happen there. Reading Java comfortably earns trust with their engineers.",
    roadmap: {
      beginner: [
        "Learn the syntax, collections and exceptions; build a small CLI.",
        "Build and run a project with Maven or Gradle.",
      ],
      intermediate: [
        "Build a REST service with Spring Boot and tests.",
        "Call an LLM API from Java with proper error handling.",
      ],
      advanced: [
        "Debug performance and concurrency issues in a JVM service.",
        "Add an integration point to a large existing Java codebase.",
      ],
    },
    dos: [
      "Follow the customer's existing frameworks and conventions.",
      "Use the build tool's dependency management, not copied JARs.",
    ],
    donts: [
      "Don't introduce a new framework into their codebase for one feature.",
      "Don't ignore checked exceptions with empty catch blocks.",
    ],
    pitfalls: [
      "Underestimating build and dependency setup in an enterprise repo.",
      "Thread-safety bugs when adding shared state to services.",
    ],
    practice: [
      "Build a Spring Boot service that calls an LLM and returns structured output.",
      "Read and fix an issue in an open-source Java project.",
    ],
    next: ["other-languages", "working-in-unfamiliar-code", "apis-integrations"],
    books: [
      { title: "Effective Java", author: "Joshua Bloch" },
      { title: "Modern Java in Action", author: "Raoul-Gabriel Urma, Mario Fusco, Alan Mycroft" },
      {
        title: "Java Concurrency in Practice",
        author: "Brian Goetz, Tim Peierls, Joshua Bloch, Joseph Bowbeer, David Holmes, Doug Lea",
      },
    ],
    interview: [
      "How would you add an AI-powered step to an existing Spring Boot service?",
      "What would you check first when a JVM service becomes slow under load?",
    ],
  },

  "kubernetes-containers": {
    summary:
      "Containers package an app with its dependencies so it runs the same everywhere. Kubernetes runs and scales containers across a cluster with declarative configuration.",
    why: "Many enterprises run everything on Kubernetes. FDEs package their services as containers and deploy them to the customer's cluster, often with GPU or private-network requirements.",
    roadmap: {
      beginner: [
        "Write a Dockerfile, build an image and run it locally.",
        "Use multi-stage builds and run as a non-root user.",
      ],
      intermediate: [
        "Deploy a service with a Deployment, Service, ConfigMap and Secret.",
        "Add health probes, resource limits and autoscaling.",
      ],
      advanced: [
        "Package your app with Helm or Kustomize for customer clusters.",
        "Debug networking, scheduling and resource issues in a cluster.",
      ],
    },
    dos: [
      "Keep images small and scanned; pin base image versions.",
      "Set resource requests and limits.",
      "Use the customer's registry and deployment process.",
    ],
    donts: ["Don't run containers as root.", "Don't put secrets in images or plain manifests."],
    pitfalls: [
      "Pods restarting forever because probes are misconfigured.",
      "Images that pull from public registries blocked in the customer's network.",
    ],
    practice: [
      "Containerise an LLM API and deploy it to a local cluster with autoscaling.",
      "Write a Helm chart and install it into a fresh cluster from scratch.",
    ],
    next: ["cloud-deployment", "ci-cd-devops", "terraform-iac"],
    patterns: [
      { category: "tech-stack", slug: "stack-kubernetes" },
      { category: "tech-stack", slug: "stack-docker" },
      { category: "devops", slug: "gitops" },
    ],
    books: [
      {
        title: "Kubernetes: Up and Running",
        author: "Brendan Burns, Joe Beda, Kelsey Hightower, Lachlan Evenson",
      },
      { title: "Kubernetes Patterns", author: "Bilgin Ibryam, Roland Huß" },
      { title: "Docker Deep Dive", author: "Nigel Poulton" },
    ],
    interview: [
      "How would you deploy your service into a customer's Kubernetes cluster with no internet access?",
      "A pod keeps restarting. How do you investigate?",
    ],
  },

  "terraform-iac": {
    summary:
      "Infrastructure as code describes cloud resources in versioned files. Terraform reads them, shows a plan of changes and applies it, so environments are reviewable and reproducible.",
    why: "Customers want deployments they can review, repeat and own. Shipping infrastructure as code makes your work auditable and lets their platform team take over without guesswork.",
    roadmap: {
      beginner: [
        "Create and destroy a few resources with Terraform; read plans carefully.",
        "Store state remotely with locking.",
      ],
      intermediate: [
        "Write reusable modules with variables and outputs.",
        "Run plan in CI on pull requests and apply on merge.",
      ],
      advanced: [
        "Manage several environments and accounts with one codebase.",
        "Import existing hand-made resources and fix drift.",
      ],
    },
    dos: [
      "Review every plan before applying.",
      "Use the customer's modules and conventions if they have them.",
      "Keep secrets out of state where possible.",
    ],
    donts: [
      "Don't change resources by hand once they are managed by code.",
      "Don't commit state files to the repository.",
    ],
    pitfalls: [
      "A plan that silently destroys and recreates a database.",
      "Drift from console changes that the next apply reverts.",
    ],
    practice: [
      "Write Terraform for an LLM app's infrastructure (network, database, secrets, service) and rebuild it from zero.",
      "Import an existing resource into Terraform and make the plan clean.",
    ],
    next: ["cloud-deployment", "ci-cd-devops", "kubernetes-containers"],
    patterns: [{ category: "devops", slug: "iac" }],
    books: [
      { title: "Terraform: Up & Running", author: "Yevgeniy Brikman" },
      { title: "Infrastructure as Code", author: "Kief Morris" },
    ],
    interview: [
      "How do you hand over infrastructure to a customer's team so they can safely change it?",
      "A Terraform plan wants to replace a production database. What do you do?",
    ],
  },

  "on-call-incident-response": {
    summary:
      "On-call means being reachable to respond when production breaks. Incident response is the process: detect, communicate, mitigate, fix and learn through a blameless review.",
    why: "When your deployment breaks at a customer, you are the expert. Handling incidents calmly and communicating well protects the relationship as much as the fix does.",
    roadmap: {
      beginner: [
        "Write a runbook for the three most likely failures of a system you own.",
        "Learn to read dashboards and logs under time pressure.",
      ],
      intermediate: [
        "Join an on-call rotation and handle real alerts.",
        "Run a structured incident with roles: lead, communicator, fixer.",
      ],
      advanced: [
        "Lead blameless postmortems and track follow-up actions to completion.",
        "Improve alerting so pages are rare and always actionable.",
      ],
    },
    dos: [
      "Mitigate first (roll back, disable the feature), then investigate.",
      "Update the customer early and on a schedule, even with no news.",
      "Write the timeline as you go.",
    ],
    donts: [
      "Don't hunt for blame; look for system causes.",
      "Don't make risky fixes without telling the incident lead.",
    ],
    pitfalls: [
      "Silence towards the customer while engineers investigate.",
      "Postmortem actions that never get done.",
    ],
    practice: [
      "Run a game day: break a staging system and practise the full incident process.",
      "Write a postmortem for a past outage you experienced, using a blameless template.",
    ],
    next: ["production-systems", "llm-observability", "communication"],
    patterns: [{ category: "devops", slug: "observability" }],
    books: [
      {
        title: "The Site Reliability Workbook",
        author: "Betsy Beyer, Niall Richard Murphy, David K. Rensin, Kent Kawahara, Stephen Thorne",
      },
      { title: "Incident Management for Operations", author: "Rob Schnepp, Ron Vidal, Chris Hawley" },
      { title: "Seeking SRE", author: "David N. Blank-Edelman" },
    ],
    interview: [
      "Describe how you would run an incident where the AI feature starts giving wrong answers to a customer's users.",
      "What makes a good postmortem?",
    ],
  },

  "other-languages": {
    summary:
      "Customers' systems are written in many languages. This item is about being able to read and make focused changes in Go, C#, Rust, Ruby or Scala when an integration requires it, not mastering all of them.",
    why: "The checklist marks this as only needed when the customer's stack demands it. The skill that matters is learning enough of a new language quickly to integrate safely and earn the trust of the customer's engineers.",
    roadmap: {
      beginner: [
        "Pick the language your target customers use and complete its official tutorial.",
        "Read a small service in that language and trace one request.",
      ],
      intermediate: [
        "Write a small API client or service in the language with tests.",
        "Learn its build tool, package manager and testing conventions.",
      ],
      advanced: [
        "Land a meaningful change in a large codebase written in that language.",
        "Explain the language's concurrency and error-handling model to others.",
      ],
    },
    dos: [
      "Learn the idioms from the customer's own code and style guide.",
      "Pair with a customer engineer on your first change.",
    ],
    donts: [
      "Don't write Python-in-Go; follow the language's idioms.",
      "Don't learn languages speculatively when your customers do not use them.",
    ],
    pitfalls: [
      "Underestimating the build tooling of an unfamiliar ecosystem.",
      "Missing language-specific error handling, such as ignored error returns in Go.",
    ],
    practice: [
      "Port a small Python tool you wrote to Go or C# and compare the result.",
      "Fix a beginner-friendly issue in an open-source project written in a new language.",
    ],
    next: ["java", "working-in-unfamiliar-code", "curiosity-fast-learning"],
    books: [
      { title: "The Go Programming Language", author: "Alan A. A. Donovan, Brian W. Kernighan" },
      { title: "The Rust Programming Language", author: "Steve Klabnik, Carol Nichols" },
      { title: "Seven Languages in Seven Weeks", author: "Bruce A. Tate" },
    ],
    interview: [
      "How do you get productive in a language you have never used, on a deadline?",
      "Tell me about a time you made a change in an unfamiliar language and how you made sure it was safe.",
    ],
  },
};
