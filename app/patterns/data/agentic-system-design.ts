import { code, e, n } from "../dsl";
import type { Category } from "../types";

export const agenticSystemDesign: Category = {
  slug: "agentic-system-design",
  name: "Agentic system design",
  blurb:
    "The architecture around the agent: tool interfaces, protocols, multi-agent topologies, safety and durability.",
  intro:
    "An agent is only as good as the system it runs in. These patterns cover the parts that sit around the model: the tools it can see, how it connects to them, how work is split across agents, and how to keep it safe and recoverable.",
  patterns: [
    {
      slug: "agent-tool-interface",
      name: "Agent-computer interface (tool design)",
      summary:
        "Design tools for a model reader: few, clearly named, non-overlapping, with compact outputs and helpful errors.",
      definition:
        "Tools are the agent's user interface, so design them with the same care as a human UI. Prefer a few tools that match real tasks over a thin wrapper per API endpoint, give them unambiguous names and descriptions, return only what the model needs, and make error messages say how to fix the call.",
      useWhen: [
        "Every agent project; tool quality is usually the biggest lever after the prompt.",
        "The agent keeps calling the wrong tool or passing bad arguments.",
      ],
      pros: [
        "Fewer wrong tool calls and shorter, cheaper contexts.",
        "Errors that explain themselves let the agent recover alone.",
      ],
      cons: [
        "Task-shaped tools need more design work than raw API wrappers.",
        "Changing a tool changes agent behaviour: evaluate after every change.",
      ],
      example:
        "Instead of list_users, list_events and create_event, a schedule_meeting tool finds free time and books it in one call.",
      code: {
        lang: "python",
        file: "tools.py",
        source: code(`
          @function_tool
          def search_orders(customer_email: str, status: Literal["open", "shipped", "returned"] | None = None) -> str:
              """Find a customer's orders. Returns at most 10, newest first, as 'id | date | status | total'."""
              rows = db.orders(customer_email, status)[:10]
              if not rows:
                  return f"No orders for {customer_email}. Check the address spelling or drop the status filter."
              return "\\n".join(f"{r.id} | {r.date:%Y-%m-%d} | {r.status} | {r.total}" for r in rows)
        `),
      },
      diagram: {
        title:
          "Agent-computer interface: the agent sees three task-shaped tools instead of many thin API wrappers behind them.",
        h: 190,
        nodes: [
          n("a", "Agent", 60, 95, "accent"),
          n("t1", "search_orders", 220, 40),
          n("t2", "schedule_meeting", 220, 95),
          n("t3", "issue_refund", 220, 150),
          n("api", "12 raw API\nendpoints", 410, 95, "ghost"),
        ],
        edges: [
          e("a", "t1"),
          e("a", "t2"),
          e("a", "t3"),
          e("t1", "api", { dashed: true }),
          e("t2", "api", { dashed: true }),
          e("t3", "api", { dashed: true }),
        ],
      },
    },
    {
      slug: "mcp-integration",
      name: "MCP integration layer",
      summary:
        "Connect agents to tools and data through Model Context Protocol servers instead of bespoke integrations.",
      definition:
        "The Model Context Protocol standardises how an AI application (the host, with an MCP client per connection) discovers and calls tools, reads resources and uses prompts exposed by MCP servers. Write a server once and any MCP-capable host can use it.",
      useWhen: [
        "Several agents or apps need the same integrations.",
        "You want to reuse existing servers for files, databases, Git or SaaS tools.",
      ],
      pros: [
        "Decouples agents from integrations: N + M work instead of N × M.",
        "Servers can run locally (stdio) or remotely (HTTP).",
      ],
      cons: [
        "Another process boundary to deploy, secure and monitor.",
        "Third-party servers are code you run: review them and scope their permissions.",
      ],
      example:
        "A coding agent uses one MCP server for the issue tracker and another for the database, with no custom glue code.",
      code: {
        lang: "python",
        file: "notes_server.py",
        source: code(`
          from mcp.server.fastmcp import FastMCP

          mcp = FastMCP("notes")

          @mcp.tool()
          def add_note(title: str, body: str) -> str:
              """Save a note and return its ID."""
              return store.save(title, body)

          if __name__ == "__main__":
              mcp.run()   # stdio by default
        `),
      },
      diagram: {
        title:
          "MCP: a host application with MCP clients connects to separate MCP servers for files, a database and a SaaS tool.",
        h: 190,
        groups: [{ label: "host app", x: 10, y: 30, w: 170, h: 130 }],
        nodes: [
          n("llm", "Agent", 95, 70, "accent"),
          n("client", "MCP clients", 95, 128),
          n("s1", "Files server", 360, 40),
          n("s2", "DB server", 360, 95),
          n("s3", "SaaS server", 360, 150, "ghost"),
        ],
        edges: [
          e("llm", "client", { both: true }),
          e("client", "s1", { both: true }),
          e("client", "s2", { both: true }),
          e("client", "s3", { both: true, dashed: true }),
        ],
      },
    },
    {
      slug: "lead-subagents",
      name: "Lead agent with subagents",
      summary:
        "A lead agent plans and spawns parallel subagents with clean contexts; they return short summaries.",
      definition:
        "A lead agent splits a broad task into independent threads and starts a subagent for each. Every subagent explores in its own context window and returns a condensed result, so the lead's context holds conclusions rather than raw search output.",
      useWhen: [
        "Breadth-first work such as research, where threads are independent.",
        "One agent's context would overflow with raw material.",
      ],
      pros: [
        "Parallel exploration finishes faster.",
        "Clean contexts per subagent reduce confusion and context rot.",
      ],
      cons: [
        "Uses many times the tokens of a single agent.",
        "Poor for tightly coupled work, such as many agents editing the same code.",
      ],
      example:
        "Asked to compare five vector databases, the lead spawns one subagent per database and writes the comparison from their summaries.",
      code: {
        lang: "python",
        file: "lead.py",
        source: code(`
          plan = await run(lead, f"Split into independent research threads: {question}")
          summaries = await asyncio.gather(*[
              run(researcher, f"Research this and reply in under 200 words: {thread}")
              for thread in plan.threads
          ])
          report = await run(lead, f"Write the answer from these findings:\\n{summaries}")
        `),
      },
      diagram: {
        title:
          "Lead agent with subagents: the lead spawns three subagents with their own contexts and receives condensed summaries.",
        h: 190,
        nodes: [
          n("lead", "Lead agent", 90, 95, "accent"),
          n("s1", "Subagent", 300, 36),
          n("s2", "Subagent", 300, 95),
          n("s3", "Subagent", 300, 154),
          n("ctx", "own context", 430, 95, "ghost"),
        ],
        edges: [
          e("lead", "s1", { label: "task" }),
          e("lead", "s2"),
          e("lead", "s3"),
          e("s2", "ctx", { dashed: true }),
          e("s1", "lead", { curve: 24, dashed: true, label: "summary" }),
        ],
      },
    },
    {
      slug: "sandbox-least-privilege",
      name: "Sandboxing and least privilege",
      summary:
        "Run the agent with the narrowest permissions, in an isolated environment, with secrets kept out of reach.",
      definition:
        "Treat an agent like untrusted code. Give it only the tools and scopes the task needs, run code execution in a sandbox with limited file and network access, keep credentials in the tool layer rather than the prompt, and require approval for anything irreversible.",
      useWhen: [
        "The agent can run code, browse, or act on real systems.",
        "Inputs may come from untrusted sources such as emails, web pages or uploaded files.",
      ],
      pros: [
        "Limits the damage from a mistake or a prompt injection.",
        "Makes security review concrete: list the permissions.",
      ],
      cons: [
        "Some tasks become slower or need human steps.",
        "Sandboxes add infrastructure to run and maintain.",
      ],
      example:
        "A data agent can read one schema through a read-only database role and run Python in a container with no internet access.",
      code: {
        lang: "yaml",
        file: "agent-policy.yaml",
        source: code(`
          agent: data-analyst
          tools:
            - sql.query: { role: analytics_readonly, schemas: [reporting] }
            - python.exec: { sandbox: container, network: none, timeout_s: 60 }
          require_approval: [email.send, files.delete]
          secrets: injected-by-tool-layer   # never in the prompt
        `),
      },
      diagram: {
        title:
          "Sandboxing: the agent runs inside a sandbox with a read-only database role and no network; risky tools need approval.",
        h: 190,
        groups: [{ label: "sandbox", x: 10, y: 20, w: 250, h: 150 }],
        nodes: [
          n("a", "Agent", 80, 95, "accent"),
          n("py", "Code exec\nno network", 190, 60),
          n("ro", "DB read-only", 190, 136),
          n("gate", "Approval", 380, 60, "decision"),
          n("sec", "Secrets", 380, 150, "store"),
        ],
        edges: [
          e("a", "py"),
          e("a", "ro"),
          e("py", "gate", { dashed: true, label: "risky" }),
          e("sec", "ro", { dashed: true, label: "tool layer" }),
        ],
      },
    },
    {
      slug: "durable-execution",
      name: "Durable execution (checkpointing)",
      summary:
        "Persist the agent's state after each step so long runs survive crashes, deploys and human pauses.",
      definition:
        "A long-running agent is modelled as a workflow whose state is saved after every step to a durable store. If the process dies, or the agent waits days for an approval, it resumes from the last checkpoint instead of starting over.",
      useWhen: [
        "Tasks run for minutes to days, or wait on people.",
        "Repeating completed steps would be costly or unsafe, such as charging a card twice.",
      ],
      pros: ["Resilient to crashes and deploys.", "Pauses for human input become natural."],
      cons: [
        "Steps must be idempotent or deduplicated.",
        "Needs a workflow engine or careful hand-rolled state handling.",
      ],
      example:
        "An onboarding agent provisions accounts over two days; after a deploy it resumes at step 4 of 7.",
      code: {
        lang: "python",
        file: "workflow.py",
        source: code(`
          def onboarding(ctx, employee):
              accounts = yield ctx.call_activity(create_accounts, input=employee)  # checkpointed
              approval = yield ctx.wait_for_external_event("manager_approval")      # may wait days
              if approval.ok:
                  yield ctx.call_activity(grant_access, input=accounts)
        `),
      },
      diagram: {
        title:
          "Durable execution: each workflow step writes a checkpoint to a durable store, and a crashed run resumes from the last checkpoint.",
        h: 170,
        nodes: [
          n("s1", "Step 1", 60, 50, "accent"),
          n("s2", "Step 2", 180, 50, "accent"),
          n("s3", "Wait for\napproval", 300, 50, "decision"),
          n("s4", "Step 4", 425, 50, "accent"),
          n("store", "Checkpoint store", 240, 140, "store"),
        ],
        edges: [
          e("s1", "s2"),
          e("s2", "s3"),
          e("s3", "s4"),
          e("s1", "store", { dashed: true }),
          e("s2", "store", { dashed: true }),
          e("store", "s4", { dashed: true, label: "resume" }),
        ],
      },
    },
    {
      slug: "prompt-injection-isolation",
      name: "Prompt-injection isolation",
      summary:
        "Keep untrusted content away from privileged instructions and tools; a quarantined model reads it.",
      definition:
        "Text from emails, web pages or documents can contain instructions aimed at the model. Isolate it: a quarantined model with no tools summarises or extracts from untrusted content, and the privileged agent that holds the tools only receives structured, validated results.",
      useWhen: [
        "The agent reads content written by people you do not trust and can also take actions.",
        "A tool call could leak data or cause harm if it were hijacked.",
      ],
      pros: [
        "Breaks the path from injected text to dangerous actions.",
        "Structured hand-offs are easy to validate.",
      ],
      cons: [
        "Extra model calls and plumbing.",
        "Reduces flexibility: the privileged agent never sees raw text.",
      ],
      example:
        "An inbox assistant has a tool-less model extract {sender, intent, dates} from each email; only those fields reach the agent that can send replies.",
      code: {
        lang: "python",
        file: "quarantine.py",
        source: code(`
          class EmailFacts(BaseModel):
              sender: EmailStr
              intent: Literal["meeting", "invoice", "other"]
              dates: list[date]

          facts = quarantined_llm(email.body, schema=EmailFacts, tools=None)   # no tools at all
          plan = privileged_agent.run(facts.model_dump())                        # never sees raw text
        `),
      },
      diagram: {
        title:
          "Prompt-injection isolation: untrusted text goes to a quarantined model with no tools; only validated fields reach the privileged agent with tools.",
        h: 170,
        nodes: [
          n("u", "Untrusted\ntext", 56, 80, "ghost"),
          n("q", "Quarantined\nLLM", 180, 80),
          n("v", "Validate", 300, 80, "decision"),
          n("p", "Agent\n+ tools", 420, 80, "accent"),
        ],
        edges: [e("u", "q"), e("q", "v"), e("v", "p")],
      },
    },
  ],
  reading: [
    {
      title: "Writing effective tools for agents",
      source: "Anthropic",
      href: "https://www.anthropic.com/research/writing-tools-for-agents",
    },
    {
      title: "MCP architecture overview",
      source: "Model Context Protocol",
      href: "https://modelcontextprotocol.io/docs/learn/architecture",
    },
    {
      title: "MCP specification (2025-06-18)",
      source: "Model Context Protocol",
      href: "https://modelcontextprotocol.io/specification/2025-06-18",
    },
    {
      title: "How we built our multi-agent research system",
      source: "Anthropic",
      href: "https://www.anthropic.com/research/multi-agent-research-system",
    },
    {
      title: "OWASP Top 10 for LLM applications",
      source: "OWASP GenAI Security Project",
      href: "https://genai.owasp.org/llm-top-10/",
    },
    {
      title: "Dapr building blocks (including workflows)",
      source: "Dapr docs",
      href: "https://docs.dapr.io/concepts/building-blocks-concept/",
    },
  ],
};
