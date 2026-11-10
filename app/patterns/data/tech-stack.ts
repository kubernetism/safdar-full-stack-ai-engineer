import { code, e, n } from "../dsl";
import type { Category } from "../types";

/*
 * Only tools from the skills list in app/content.ts and the certifications
 * in the CV. Each entry describes the tool's role and trade-offs; it makes
 * no claims about specific projects.
 */
export const techStack: Category = {
  slug: "tech-stack",
  name: "Tech stack",
  blurb: "The tools I reach for to build and run agentic systems, from my skills and certifications.",
  intro:
    "My working stack for agentic applications: agents and tools on top, an API layer in the middle, and containers, orchestration and Dapr underneath. Certifications are noted where they apply. Each entry says what the tool is for and where it fits.",
  patterns: [
    {
      slug: "stack-openai-agents-sdk",
      name: "OpenAI Agents SDK",
      summary:
        "Agent orchestration: agents, tools, handoffs, guardrails, sessions and tracing in a small Python library.",
      definition:
        "My default for practical AI workflows and agent tooling. It provides a few primitives (Agent, Runner, tools, handoffs, guardrails) and traces every run, which keeps agent code small and debuggable. Covered in my PIAIC Agentic AI Level 2 certification.",
      useWhen: [
        "Building tool-using agents or multi-agent flows in Python.",
        "You want tracing and guardrails without building them yourself.",
      ],
      pros: ["Small API surface, quick to learn and read.", "Built-in tracing, sessions and guardrails."],
      cons: [
        "Opinionated loop; very custom control flow may need your own orchestration.",
        "Some features work best with OpenAI models.",
      ],
      example:
        "A triage agent with handoffs to two specialists, guarded by an input guardrail, served behind a FastAPI endpoint.",
      code: {
        lang: "python",
        file: "agent.py",
        source: code(`
          from agents import Agent, Runner

          triage = Agent(name="Triage", instructions="Route to the right specialist.", handoffs=[billing, tech])
          result = await Runner.run(triage, user_message)
        `),
      },
      diagram: {
        title:
          "OpenAI Agents SDK in the stack: a FastAPI endpoint runs the agent, which uses tools, handoffs and MCP servers and emits traces.",
        h: 170,
        nodes: [
          n("api", "FastAPI", 60, 85),
          n("sdk", "Agents SDK\nRunner", 210, 85, "accent"),
          n("tools", "Tools", 380, 30),
          n("mcp", "MCP servers", 380, 85),
          n("trace", "Traces", 380, 140, "ghost"),
        ],
        edges: [e("api", "sdk"), e("sdk", "tools"), e("sdk", "mcp"), e("sdk", "trace", { dashed: true })],
      },
    },
    {
      slug: "stack-mcp",
      name: "Model Context Protocol (MCP)",
      summary: "The standard way to connect agents to tools and data, so integrations are written once.",
      definition:
        "I use MCP to connect agents to tools and data. Tools, resources and prompts are exposed by MCP servers that any MCP-capable host can use. Certified through Anthropic Academy's Introduction to MCP and the advanced-topics course.",
      useWhen: [
        "The same integration is needed by more than one agent or app.",
        "You want to plug in existing servers instead of writing glue code.",
      ],
      pros: ["Reusable integrations across hosts and models.", "Clear boundary for permissions and review."],
      cons: ["Extra processes to deploy and secure.", "Server quality varies; vet third-party servers."],
      example:
        "A small Python MCP server exposes a notes tool that both a desktop assistant and a backend agent can call.",
      code: {
        lang: "python",
        file: "server.py",
        source: code(`
          from mcp.server.fastmcp import FastMCP

          mcp = FastMCP("notes")

          @mcp.tool()
          def search_notes(query: str) -> list[str]:
              """Search saved notes by keyword."""
              return store.search(query)
        `),
      },
      diagram: {
        title:
          "MCP in the stack: an agent host connects through MCP to a notes server and a database server.",
        h: 150,
        nodes: [
          n("host", "Agent host", 80, 75, "accent"),
          n("proto", "MCP", 220, 75, "decision"),
          n("s1", "notes server", 380, 35),
          n("s2", "db server", 380, 115),
        ],
        edges: [
          e("host", "proto", { both: true }),
          e("proto", "s1", { both: true }),
          e("proto", "s2", { both: true }),
        ],
      },
    },
    {
      slug: "stack-fastapi",
      name: "FastAPI",
      summary: "Typed, async Python APIs that put agents behind clean HTTP endpoints.",
      definition:
        "My backend layer for agentic applications. FastAPI uses Python type hints and Pydantic models to validate requests and generate OpenAPI docs, and its async support suits I/O-heavy work such as model and tool calls.",
      useWhen: [
        "Serving agents or ML features to a web or mobile front end.",
        "You want request validation and API docs from the same type hints.",
      ],
      pros: ["Validation and docs come from your types.", "Async-friendly for slow model calls."],
      cons: [
        "You assemble auth, background jobs and so on yourself.",
        "Blocking code inside async routes stalls the server.",
      ],
      example:
        "A /chat endpoint validates the request with Pydantic, runs the agent and returns the final output.",
      code: {
        lang: "python",
        file: "main.py",
        source: code(`
          from fastapi import FastAPI
          from pydantic import BaseModel

          app = FastAPI()

          class ChatIn(BaseModel):
              session_id: str
              message: str

          @app.post("/chat")
          async def chat(body: ChatIn) -> dict:
              result = await Runner.run(triage, body.message, session=sessions.get(body.session_id))
              return {"reply": result.final_output}
        `),
      },
      diagram: {
        title:
          "FastAPI in the stack: clients call a typed FastAPI endpoint that validates with Pydantic and runs the agent.",
        h: 130,
        nodes: [
          n("client", "Client", 50, 65, "user"),
          n("api", "POST /chat", 175, 65, "accent"),
          n("pyd", "Pydantic", 300, 65, "decision"),
          n("agent", "Agent", 420, 65),
        ],
        edges: [e("client", "api"), e("api", "pyd"), e("pyd", "agent")],
      },
    },
    {
      slug: "stack-claude-code",
      name: "Claude Code",
      summary: "Agentic coding in the terminal; this site was built with it.",
      definition:
        "An agentic coding tool that reads the codebase, edits files, runs commands and verifies its work in a loop. Project memory lives in a CLAUDE.md file, and it can also run headless in scripts and CI.",
      useWhen: [
        "Multi-file changes, refactors and investigations in a real repository.",
        "Automating repeatable engineering chores from the command line.",
      ],
      pros: [
        "Works on the real repo with real tools and tests.",
        "Project memory (CLAUDE.md) keeps conventions consistent.",
      ],
      cons: [
        "Changes still need human review before merge.",
        "Give it clear goals and checks, or it guesses.",
      ],
      example:
        "This portfolio, including its build animation and this patterns library, was built in Claude Code sessions.",
      code: {
        lang: "bash",
        file: "terminal",
        source: code(`
          # interactive session in the repo
          claude

          # headless, for scripts and CI
          claude -p "Run the tests and summarise any failures"
        `),
      },
      diagram: {
        title:
          "Claude Code loop: it reads CLAUDE.md and the repo, edits files, runs commands and tests, and reports back.",
        h: 170,
        nodes: [
          n("mem", "CLAUDE.md", 70, 40, "store"),
          n("cc", "Claude Code", 240, 85, "accent"),
          n("repo", "Repo files", 70, 130, "store"),
          n("run", "Run tests", 420, 85),
        ],
        edges: [
          e("mem", "cc", { dashed: true }),
          e("repo", "cc", { both: true }),
          e("cc", "run", { curve: 22, label: "run" }),
          e("run", "cc", { curve: 22, label: "result" }),
        ],
      },
    },
    {
      slug: "stack-crewai",
      name: "CrewAI",
      summary: "Role-based multi-agent systems: agents with roles and goals working through tasks as a crew.",
      definition:
        "A framework for multi-agent systems where each agent has a role, goal and backstory, tasks are assigned to agents, and a crew runs them in a sequential or hierarchical process. Studied in the Multi AI Agent Systems with CrewAI course (DeepLearning.AI, 2024).",
      useWhen: [
        "The work maps naturally onto roles, such as researcher, writer and reviewer.",
        "You want a quick multi-agent prototype with little orchestration code.",
      ],
      pros: ["Readable role and task definitions.", "Sequential and hierarchical processes out of the box."],
      cons: [
        "Role-play prompting can add tokens without adding quality.",
        "Less low-level control than writing the loop yourself.",
      ],
      example:
        "A researcher agent gathers sources and a writer agent drafts a summary from them, run as a sequential crew.",
      code: {
        lang: "python",
        file: "crew.py",
        source: code(`
          from crewai import Agent, Crew, Process, Task

          researcher = Agent(role="Researcher", goal="Find reliable sources", backstory="A careful analyst")
          writer = Agent(role="Writer", goal="Write a clear summary", backstory="A technical writer")

          crew = Crew(
              agents=[researcher, writer],
              tasks=[Task(description="Research {topic}", expected_output="5 sources", agent=researcher),
                     Task(description="Summarise the sources", expected_output="300 words", agent=writer)],
              process=Process.sequential,
          )
          crew.kickoff(inputs={"topic": "agentic RAG"})
        `),
      },
      diagram: {
        title: "CrewAI: a crew runs a researcher task then a writer task in sequence, passing results along.",
        h: 150,
        groups: [{ label: "crew: sequential", x: 110, y: 20, w: 260, h: 110 }],
        nodes: [
          n("in", "Topic", 50, 75, "user"),
          n("r", "Researcher", 172, 75, "accent"),
          n("w", "Writer", 320, 75, "accent"),
          n("out", "Summary", 430, 75),
        ],
        edges: [e("in", "r"), e("r", "w", { label: "sources" }), e("w", "out")],
      },
    },
    {
      slug: "stack-docker",
      name: "Docker",
      summary:
        "Container-first delivery: package the app and its dependencies into one image that runs the same everywhere.",
      definition:
        "Docker builds images from a Dockerfile and runs them as isolated containers. Multi-stage builds keep production images small. Covered in my PIAIC certification and Panaversity's Containerization and Kubernetes Fundamentals (2026).",
      useWhen: [
        "Any service you deploy; it removes “works on my machine”.",
        "Local development needs the same services as production.",
      ],
      pros: ["Reproducible builds and environments.", "Small, scannable images with multi-stage builds."],
      cons: ["Images need regular rebuilds for security patches.", "Another layer to learn when debugging."],
      example: "A FastAPI agent service is built with a multi-stage Dockerfile and runs as a non-root user.",
      code: {
        lang: "dockerfile",
        file: "Dockerfile",
        source: code(`
          FROM python:3.12-slim AS build
          WORKDIR /app
          COPY pyproject.toml uv.lock ./
          RUN pip install uv && uv sync --frozen --no-dev

          FROM python:3.12-slim
          WORKDIR /app
          COPY --from=build /app/.venv /app/.venv
          COPY src ./src
          USER 1000
          CMD ["/app/.venv/bin/uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
        `),
      },
      diagram: {
        title:
          "Docker: a Dockerfile builds an image in a build stage and a slim runtime stage, which runs as a container.",
        h: 130,
        nodes: [
          n("df", "Dockerfile", 60, 65, "store"),
          n("build", "build stage", 185, 65),
          n("img", "slim image", 310, 65, "accent"),
          n("ctr", "container", 425, 65),
        ],
        edges: [e("df", "build"), e("build", "img"), e("img", "ctr")],
      },
    },
    {
      slug: "stack-kubernetes",
      name: "Kubernetes",
      summary: "Run containers that can grow without losing clarity: declared, self-healing and autoscaled.",
      definition:
        "Kubernetes runs containers across a cluster from declarative manifests: Deployments keep the right number of replicas, Services route traffic and autoscalers adjust capacity. Covered in Panaversity's Containerization and Kubernetes Fundamentals (2026); CKAD and CKA are my next certifications.",
      useWhen: [
        "Several services need scaling, rolling updates and self-healing.",
        "You want one platform for APIs, workers and agent services.",
      ],
      pros: ["Declarative, self-healing deployments.", "Rolling updates and autoscaling built in."],
      cons: ["Real operational complexity; managed clusters help.", "Overkill for one small service."],
      example:
        "An agent API runs as a Deployment with three replicas behind a Service, scaled by a HorizontalPodAutoscaler on CPU.",
      code: {
        lang: "yaml",
        file: "deployment.yaml",
        source: code(`
          apiVersion: apps/v1
          kind: Deployment
          metadata: { name: agent-api }
          spec:
            replicas: 3
            selector: { matchLabels: { app: agent-api } }
            template:
              metadata: { labels: { app: agent-api } }
              spec:
                containers:
                  - name: api
                    image: registry.example.com/agent-api:1.4.0
                    ports: [{ containerPort: 8000 }]
        `),
      },
      diagram: {
        title:
          "Kubernetes: a Service routes traffic to three pods managed by a Deployment, scaled by an autoscaler.",
        h: 180,
        nodes: [
          n("svc", "Service", 60, 90, "decision"),
          n("p1", "Pod", 220, 34, "accent"),
          n("p2", "Pod", 220, 90, "accent"),
          n("p3", "Pod", 220, 146, "accent"),
          n("dep", "Deployment", 390, 70),
          n("hpa", "Autoscaler", 390, 140, "ghost"),
        ],
        edges: [
          e("svc", "p1"),
          e("svc", "p2"),
          e("svc", "p3"),
          e("dep", "p2", { dashed: true, label: "manages" }),
          e("hpa", "dep", { dashed: true }),
        ],
      },
    },
    {
      slug: "stack-dapr-daca",
      name: "Dapr and DACA",
      summary:
        "Dapr sidecars give services state, pub/sub and workflows through one API; DACA uses them to scale AI agents.",
      definition:
        "Dapr runs as a sidecar beside each service and offers building blocks (state management, pub/sub, service invocation, workflows and more) through a standard HTTP or gRPC API, so infrastructure can change without code changes. Dapr Agentic Cloud Ascent (DACA) is the approach I studied for scaling AI agents with Dapr, containers and Kubernetes.",
      useWhen: [
        "Agents or services need state, events and durable workflows without hard-wiring a vendor.",
        "You run on Kubernetes and want portable infrastructure APIs.",
      ],
      pros: [
        "Swap Redis for another store by changing a component file.",
        "Durable workflows and pub/sub fit long-running agents.",
      ],
      cons: [
        "A sidecar per service adds resources and moving parts.",
        "Another abstraction to learn and debug.",
      ],
      example:
        "An agent service saves conversation state through Dapr's state API and publishes task events through pub/sub, all on Kubernetes.",
      code: {
        lang: "bash",
        file: "dapr.sh",
        source: code(`
          # run the agent service with a Dapr sidecar
          dapr run --app-id agent --app-port 8000 -- uvicorn main:app --port 8000

          # save state through the sidecar (the store is configured, not coded)
          curl -X POST http://localhost:3500/v1.0/state/statestore \\
            -H "Content-Type: application/json" \\
            -d '[{"key": "session-42", "value": {"turns": 3}}]'
        `),
      },
      diagram: {
        title:
          "Dapr and DACA: on Kubernetes, an agent service talks to its Dapr sidecar, which provides state, pub/sub and workflows backed by swappable components.",
        h: 190,
        groups: [{ label: "kubernetes pod", x: 10, y: 30, w: 250, h: 120 }],
        nodes: [
          n("agent", "Agent\nservice", 80, 90, "accent"),
          n("dapr", "Dapr\nsidecar", 195, 90, "decision"),
          n("state", "State", 380, 34, "store"),
          n("pubsub", "Pub/sub", 380, 90, "store"),
          n("wf", "Workflows", 380, 146, "store"),
        ],
        edges: [e("agent", "dapr", { both: true }), e("dapr", "state"), e("dapr", "pubsub"), e("dapr", "wf")],
      },
    },
  ],
  reading: [
    {
      title: "OpenAI Agents SDK (Python)",
      source: "OpenAI",
      href: "https://openai.github.io/openai-agents-python/",
    },
    {
      title: "Model Context Protocol",
      source: "modelcontextprotocol.io",
      href: "https://modelcontextprotocol.io/",
    },
    { title: "FastAPI", source: "fastapi.tiangolo.com", href: "https://fastapi.tiangolo.com/" },
    {
      title: "Claude Code overview",
      source: "Claude Code docs",
      href: "https://code.claude.com/docs/en/overview",
    },
    { title: "Crews", source: "CrewAI docs", href: "https://docs.crewai.com/en/concepts/crews" },
    {
      title: "Multi-stage builds",
      source: "Docker docs",
      href: "https://docs.docker.com/build/building/multi-stage/",
    },
    {
      title: "Deployments",
      source: "Kubernetes docs",
      href: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/",
    },
    {
      title: "Dapr building blocks",
      source: "Dapr docs",
      href: "https://docs.dapr.io/concepts/building-blocks-concept/",
    },
    { title: "Panaversity", source: "panaversity.org", href: "https://panaversity.org/" },
    {
      title: "PIAIC (Presidential Initiative for AI & Computing)",
      source: "piaic.org",
      href: "https://www.piaic.org/",
    },
  ],
};
