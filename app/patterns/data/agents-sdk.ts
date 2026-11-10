import { code, e, n } from "../dsl";
import type { Category } from "../types";

export const agentsSdk: Category = {
  slug: "openai-agents-sdk",
  name: "OpenAI Agents SDK design patterns",
  blurb:
    "How the SDK's few primitives (agents, tools, handoffs, guardrails, sessions, tracing) compose into real apps.",
  intro:
    "The OpenAI Agents SDK keeps the primitives small: an Agent is a model with instructions and tools, and a Runner drives the loop. These patterns show how to combine them. The code is Python and follows the SDK's documented API.",
  patterns: [
    {
      slug: "function-tools",
      name: "Single agent with function tools",
      summary: "Turn typed Python functions into tools; the Runner handles the call-observe loop for you.",
      definition:
        "Decorating a function with function_tool turns its signature and docstring into a tool schema. The Runner sends tools to the model, runs the ones it calls and feeds results back until the agent produces a final output.",
      useWhen: [
        "One agent with a handful of actions covers the job.",
        "You want type-checked tool inputs without writing JSON schemas by hand.",
      ],
      pros: [
        "Very little code: the docstring is the tool description.",
        "Start here; split into multiple agents only when this stops working.",
      ],
      cons: [
        "Too many tools on one agent hurts tool selection.",
        "Tool functions run with your app's permissions; scope them carefully.",
      ],
      example:
        "A support agent with get_order_status and create_return tools answers “where is my order?” end to end.",
      code: {
        lang: "python",
        file: "support_agent.py",
        source: code(`
          from agents import Agent, Runner, function_tool

          @function_tool
          def get_order_status(order_id: str) -> str:
              """Look up the shipping status of an order by its ID."""
              return orders.status(order_id)

          support = Agent(
              name="Support",
              instructions="Help customers with orders. Always confirm the order ID.",
              tools=[get_order_status],
          )
          result = await Runner.run(support, "Where is order 1042?")
          print(result.final_output)
        `),
      },
      diagram: {
        title:
          "Single agent with function tools: the Runner loops between the agent and its Python tools until there is a final output.",
        h: 180,
        groups: [{ label: "Runner.run", x: 110, y: 8, w: 362, h: 164 }],
        nodes: [
          n("u", "User", 46, 90, "user"),
          n("agent", "Agent", 200, 90, "accent"),
          n("t1", "get_order_status", 380, 52),
          n("t2", "create_return", 380, 128),
        ],
        edges: [
          e("u", "agent"),
          e("agent", "t1", { both: true }),
          e("agent", "t2", { both: true, dashed: true }),
        ],
      },
    },
    {
      slug: "handoffs",
      name: "Handoffs (triage)",
      summary:
        "A triage agent transfers the whole conversation to the specialist best suited to continue it.",
      definition:
        "Handoffs are offered to the model as tools. When the triage agent calls one, control and the conversation move to that specialist, which then talks to the user directly with its own instructions and tools.",
      useWhen: [
        "Different kinds of requests need different instructions, tools or policies.",
        "The specialist should own the rest of the conversation, not just answer one sub-question.",
      ],
      pros: [
        "Each agent stays small and focused.",
        "Routing logic lives in natural-language instructions, which are easy to change.",
      ],
      cons: [
        "Once handed off, the triage agent no longer controls the answer.",
        "Misroutes are visible to users; trace and evaluate routing.",
      ],
      example: "A triage agent hands billing questions to Billing and refund requests to Refunds.",
      code: {
        lang: "python",
        file: "triage.py",
        source: code(`
          from agents import Agent, Runner

          billing = Agent(name="Billing", instructions="Resolve billing questions.")
          refunds = Agent(name="Refunds", instructions="Process refund requests.")

          triage = Agent(
              name="Triage",
              instructions="Work out what the customer needs and hand off.",
              handoffs=[billing, refunds],
          )
          result = await Runner.run(triage, "I was charged twice this month")
        `),
      },
      diagram: {
        title:
          "Handoffs: a triage agent passes the conversation to either a billing or a refunds agent, which replies to the user.",
        h: 180,
        nodes: [
          n("u", "User", 46, 90, "user"),
          n("tri", "Triage", 170, 90, "accent"),
          n("b", "Billing", 330, 40),
          n("r", "Refunds", 330, 140),
          n("reply", "Reply", 445, 90, "ghost"),
        ],
        edges: [
          e("u", "tri"),
          e("tri", "b", { label: "handoff" }),
          e("tri", "r", { dashed: true }),
          e("b", "reply"),
          e("r", "reply", { dashed: true }),
        ],
      },
    },
    {
      slug: "agents-as-tools",
      name: "Agents as tools (manager)",
      summary:
        "A manager agent calls specialist agents like functions and keeps ownership of the final answer.",
      definition:
        "Agent.as_tool wraps an agent so another agent can call it as a tool. The specialist runs on the sub-task and returns a result, while the manager stays in control of the conversation and writes the final reply.",
      useWhen: [
        "You need several specialists' output combined into one answer.",
        "The user should keep talking to one consistent agent.",
      ],
      pros: [
        "Central control: one place for tone, policy and final checks.",
        "Specialists can run on cheaper models.",
      ],
      cons: [
        "The manager's context grows with every tool result.",
        "More total model calls than a single agent.",
      ],
      example:
        "A writing manager calls a translator agent and a fact-checker agent, then assembles the final post itself.",
      code: {
        lang: "python",
        file: "manager.py",
        source: code(`
          translator = Agent(name="Translator", instructions="Translate the text to Urdu.")

          manager = Agent(
              name="Manager",
              instructions="Use your tools when needed. You write the final answer.",
              tools=[
                  translator.as_tool(
                      tool_name="translate_to_urdu",
                      tool_description="Translate the user's text to Urdu",
                  ),
              ],
          )
        `),
      },
      diagram: {
        title:
          "Agents as tools: a manager agent calls a translator agent and a fact-check agent as tools and writes the final reply itself.",
        h: 180,
        nodes: [
          n("u", "User", 46, 90, "user"),
          n("m", "Manager", 180, 90, "accent"),
          n("t", "Translator", 360, 40),
          n("f", "Fact-checker", 360, 140),
        ],
        edges: [
          e("u", "m", { both: true }),
          e("m", "t", { curve: 14, label: "call" }),
          e("t", "m", { curve: 14 }),
          e("m", "f", { curve: -14 }),
          e("f", "m", { curve: -14, label: "result" }),
        ],
      },
    },
    {
      slug: "guardrails",
      name: "Guardrails (tripwires)",
      summary:
        "Run checks on input or output alongside the agent; a tripped wire stops the run with an exception.",
      definition:
        "An input guardrail inspects the user's input, and an output guardrail inspects the agent's final output. Each returns GuardrailFunctionOutput; if tripwire_triggered is true, the run stops and raises InputGuardrailTripwireTriggered or OutputGuardrailTripwireTriggered.",
      useWhen: [
        "Off-topic or abusive requests should be blocked before an expensive model works on them.",
        "Outputs must never contain certain data, such as personal information.",
      ],
      pros: [
        "A cheap, fast model can guard an expensive one.",
        "Policy checks live outside the main prompt and are testable alone.",
      ],
      cons: [
        "Guardrails add latency or cost if they call a model.",
        "False positives block legitimate users; monitor trip rates.",
      ],
      example:
        "A customer-support agent refuses maths-homework requests through a small classifier guardrail.",
      code: {
        lang: "python",
        file: "guardrail.py",
        source: code(`
          from agents import Agent, GuardrailFunctionOutput, InputGuardrailTripwireTriggered, Runner
          from agents.decorators import input_guardrail

          @input_guardrail
          async def no_homework(ctx, agent, input) -> GuardrailFunctionOutput:
              check = await Runner.run(homework_classifier, input, context=ctx.context)
              return GuardrailFunctionOutput(
                  output_info=check.final_output,
                  tripwire_triggered=check.final_output.is_homework,
              )

          support = Agent(name="Support", instructions="...", input_guardrails=[no_homework])
          try:
              await Runner.run(support, "Solve 2x + 3 = 11 for me")
          except InputGuardrailTripwireTriggered:
              reply = "I can only help with your account."
        `),
      },
      diagram: {
        title:
          "Guardrails: an input guardrail checks the request before the agent, and an output guardrail checks the result; a tripwire stops the run.",
        h: 170,
        nodes: [
          n("u", "Input", 40, 70, "user"),
          n("ig", "Input\nguardrail", 150, 70, "decision"),
          n("a", "Agent", 270, 70, "accent"),
          n("og", "Output\nguardrail", 390, 70, "decision"),
          n("stop", "Tripwire: stop", 270, 148, "ghost"),
        ],
        edges: [
          e("u", "ig"),
          e("ig", "a"),
          e("a", "og"),
          e("ig", "stop", { dashed: true }),
          e("og", "stop", { dashed: true }),
        ],
      },
    },
    {
      slug: "structured-output",
      name: "Structured output",
      summary: "Give the agent an output_type and get a validated object back instead of free text.",
      definition:
        "Setting output_type to a Pydantic model (or another typed structure) makes the agent's final output conform to that schema. The run returns a parsed object your code can use directly.",
      useWhen: [
        "Downstream code needs fields, not prose: extraction, classification, routing decisions.",
        "One agent's output feeds another step in a pipeline.",
      ],
      pros: ["No brittle string parsing.", "The schema documents the contract between steps."],
      cons: [
        "Very strict schemas can push the model into poor answers; keep them simple.",
        "Schema changes are API changes: version them.",
      ],
      example:
        "An intake agent turns a customer email into a Ticket with category, priority and a one-line summary.",
      code: {
        lang: "python",
        file: "intake.py",
        source: code(`
          from pydantic import BaseModel
          from agents import Agent, Runner

          class Ticket(BaseModel):
              category: str
              priority: int
              summary: str

          intake = Agent(name="Intake", instructions="Extract a support ticket.", output_type=Ticket)
          ticket = (await Runner.run(intake, email_body)).final_output   # a Ticket
        `),
      },
      diagram: {
        title:
          "Structured output: free text goes into an agent with an output type, and a validated object comes out.",
        h: 130,
        nodes: [
          n("in", "Email text", 60, 65, "user"),
          n("a", "Agent", 200, 65, "accent"),
          n("schema", "output_type:\nTicket", 330, 65, "decision"),
          n("obj", "{ }", 448, 65, "store"),
        ],
        edges: [e("in", "a"), e("a", "schema"), e("schema", "obj")],
      },
    },
    {
      slug: "sessions",
      name: "Sessions (conversation memory)",
      summary: "Pass a session to the Runner and it stores and replays conversation history for you.",
      definition:
        "A session object keeps the items of a conversation. Passing the same session to each Runner.run call prepends earlier turns automatically and saves the new ones, so you do not manage history by hand. SQLiteSession is the built-in local option.",
      useWhen: [
        "A chat spans many turns or many requests to your server.",
        "You want history persisted per user or per conversation ID.",
      ],
      pros: ["No manual history plumbing.", "Swap the storage backend without touching agent code."],
      cons: [
        "History grows; plan trimming or summarisation for long chats.",
        "Stored conversations are user data: retention and privacy rules apply.",
      ],
      example:
        "A tutoring bot remembers the student's earlier question when they ask a follow-up the next day.",
      code: {
        lang: "python",
        file: "session.py",
        source: code(`
          from agents import Agent, Runner, SQLiteSession

          tutor = Agent(name="Tutor", instructions="Explain step by step.")
          session = SQLiteSession("student_42", "conversations.db")

          await Runner.run(tutor, "What is a hash map?", session=session)
          await Runner.run(tutor, "How is it different from a list?", session=session)  # remembers
        `),
      },
      diagram: {
        title: "Sessions: each run reads earlier turns from the session store and writes the new turn back.",
        h: 170,
        nodes: [
          n("r1", "Run 1", 70, 50, "accent"),
          n("r2", "Run 2", 70, 130, "accent"),
          n("s", "Session store", 300, 90, "store"),
        ],
        edges: [
          e("r1", "s", { label: "save" }),
          e("s", "r2", { label: "replay history" }),
          e("r2", "s", { curve: -26, label: "save", dashed: true }),
        ],
      },
    },
    {
      slug: "tracing",
      name: "Tracing",
      summary: "Every run is traced by default; wrap related runs in one trace to see a whole workflow.",
      definition:
        "The SDK records spans for model calls, tool calls, handoffs and guardrails. Wrapping several runs in a trace block groups them into one trace, which you can inspect in the OpenAI dashboard or export to your own tracing backend.",
      useWhen: [
        "Debugging why an agent chose a tool, a handoff or an answer.",
        "Measuring latency and cost per step in production.",
      ],
      pros: ["Visibility with almost no setup.", "Traces become examples for evaluation sets."],
      cons: [
        "Traces can contain sensitive inputs; configure what is recorded.",
        "Very chatty workflows produce large traces.",
      ],
      example:
        "A two-step “draft then review” flow is wrapped in one trace so both runs appear as a single timeline.",
      code: {
        lang: "python",
        file: "trace.py",
        source: code(`
          from agents import Agent, Runner, trace

          with trace("Draft and review"):
              draft = await Runner.run(writer, brief)
              review = await Runner.run(reviewer, draft.final_output)
        `),
      },
      diagram: {
        title:
          "Tracing: one trace groups two runs, each made of spans for model calls, tool calls and handoffs.",
        h: 170,
        groups: [{ label: "trace: draft and review", x: 10, y: 10, w: 460, h: 150 }],
        nodes: [
          n("r1", "Run: writer", 110, 60, "accent"),
          n("r2", "Run: reviewer", 330, 60, "accent"),
          n("s1", "model span", 70, 126),
          n("s2", "tool span", 190, 126),
          n("s3", "model span", 330, 126),
        ],
        edges: [
          e("r1", "r2"),
          e("r1", "s1", { dashed: true }),
          e("r1", "s2", { dashed: true }),
          e("r2", "s3", { dashed: true }),
        ],
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
      title: "Tools",
      source: "OpenAI Agents SDK docs",
      href: "https://openai.github.io/openai-agents-python/tools/",
    },
    {
      title: "Handoffs",
      source: "OpenAI Agents SDK docs",
      href: "https://openai.github.io/openai-agents-python/handoffs/",
    },
    {
      title: "Orchestrating multiple agents",
      source: "OpenAI Agents SDK docs",
      href: "https://openai.github.io/openai-agents-python/multi_agent/",
    },
    {
      title: "Guardrails",
      source: "OpenAI Agents SDK docs",
      href: "https://openai.github.io/openai-agents-python/guardrails/",
    },
    {
      title: "Sessions",
      source: "OpenAI Agents SDK docs",
      href: "https://openai.github.io/openai-agents-python/sessions/",
    },
    {
      title: "Tracing",
      source: "OpenAI Agents SDK docs",
      href: "https://openai.github.io/openai-agents-python/tracing/",
    },
  ],
};
