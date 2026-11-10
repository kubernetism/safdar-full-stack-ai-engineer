import { code, e, n } from "../dsl";
import type { Category } from "../types";

export const agentic: Category = {
  slug: "agentic",
  name: "AI / Agentic patterns",
  blurb: "The building blocks for LLM workflows and agents, from one augmented call to an autonomous loop.",
  intro:
    "A workflow runs LLM calls along a path you wrote in code; an agent decides its own next step. Start with the simplest pattern that solves the problem and add autonomy only when it measurably helps.",
  patterns: [
    {
      slug: "augmented-llm",
      name: "Augmented LLM",
      summary: "One model call with retrieval, tools and memory attached. Every other pattern builds on it.",
      definition:
        "A single LLM that can search for information, call tools and remember state. It decides when to use each, so one call can do much more than complete text.",
      useWhen: [
        "A single, well-scoped task needs fresh data or an action, not a multi-step plan.",
        "You are building the base unit that later workflows will chain or route between.",
      ],
      pros: [
        "The simplest thing that works; easy to test and reason about.",
        "Tools and retrieval add capability without adding orchestration code.",
      ],
      cons: [
        "Quality depends heavily on tool descriptions and retrieved context.",
        "One call has a limited budget for long or branching work.",
      ],
      example:
        "A support assistant that looks up the customer's order with a tool, reads the returns policy from a vector index, and answers in one turn.",
      code: {
        lang: "python",
        file: "augmented.py",
        source: code(`
          answer = llm(
              system="You are a support assistant.",
              messages=history,                 # memory
              context=retrieve(question, k=4),  # retrieval
              tools=[get_order, start_return],  # actions
          )
        `),
      },
      diagram: {
        title:
          "Augmented LLM: an input goes to the LLM, which uses retrieval, tools and memory, then returns an output.",
        h: 200,
        nodes: [
          n("in", "Input", 50, 100, "user"),
          n("llm", "LLM", 240, 100, "accent"),
          n("out", "Output", 430, 100),
          n("ret", "Retrieval", 240, 26, "store"),
          n("tools", "Tools", 150, 172),
          n("mem", "Memory", 330, 172, "store"),
        ],
        edges: [
          e("in", "llm"),
          e("llm", "out"),
          e("llm", "ret", { both: true, dashed: true }),
          e("llm", "tools", { both: true, dashed: true }),
          e("llm", "mem", { both: true, dashed: true }),
        ],
      },
    },
    {
      slug: "prompt-chaining",
      name: "Prompt chaining",
      summary: "Split a task into fixed steps; each LLM call works on the previous one's output.",
      definition:
        "A sequence of LLM calls where each step has one narrow job and receives the previous step's output. Plain code between steps can check the result and stop the chain early.",
      useWhen: [
        "The task breaks cleanly into fixed subtasks, such as outline, then draft, then translate.",
        "You would rather trade some latency for higher accuracy on each step.",
      ],
      pros: [
        "Each prompt is small and easy to test on its own.",
        "Gates between steps catch bad output before it spreads.",
      ],
      cons: [
        "Latency adds up with every step.",
        "Rigid: it cannot adapt when a task does not fit the fixed path.",
      ],
      example:
        "Generate marketing copy, check it against brand rules in code, then translate the approved copy into Urdu.",
      code: {
        lang: "python",
        file: "chain.py",
        source: code(`
          outline = llm(f"Outline a post about: {topic}")
          if not passes_checks(outline):   # gate in plain code
              raise ValueError("Outline missed required sections")
          draft = llm(f"Write the post from this outline:\\n{outline}")
          final = llm(f"Translate to Urdu, keep the tone:\\n{draft}")
        `),
      },
      diagram: {
        title:
          "Prompt chaining: input, LLM call one, a gate, LLM call two, output. A failed gate exits early.",
        h: 170,
        nodes: [
          n("in", "In", 34, 70, "user"),
          n("a", "LLM 1", 122, 70, "accent"),
          n("gate", "Gate", 236, 70, "decision"),
          n("b", "LLM 2", 350, 70, "accent"),
          n("out", "Out", 446, 70),
          n("exit", "Exit", 236, 146, "ghost"),
        ],
        edges: [
          e("in", "a"),
          e("a", "gate"),
          e("gate", "b", { label: "pass" }),
          e("b", "out"),
          e("gate", "exit", { label: "fail", dashed: true }),
        ],
      },
    },
    {
      slug: "routing",
      name: "Routing",
      summary: "Classify the input first, then send it to the prompt, model or flow built for that kind.",
      definition:
        "A classifier (an LLM or a traditional model) labels each input and dispatches it to a specialised handler. Each handler can have its own prompt, tools or even a cheaper or stronger model.",
      useWhen: [
        "Inputs fall into distinct categories that are better handled separately.",
        "You want easy questions on a small, fast model and hard ones on a larger model.",
      ],
      pros: [
        "Specialised prompts beat one prompt that tries to cover everything.",
        "Cuts cost by sending simple traffic to cheap models.",
      ],
      cons: [
        "A misroute sends the request down the wrong path entirely.",
        "The classifier needs its own evaluation set.",
      ],
      example:
        "Customer messages are routed to refunds, technical support or general questions, each with its own instructions and tools.",
      code: {
        lang: "python",
        file: "router.py",
        source: code(`
          label = llm(f"Classify as refund, tech or general:\\n{msg}", schema=Label)
          handlers = {"refund": refund_flow, "tech": tech_flow, "general": faq_flow}
          return handlers[label.value](msg)
        `),
      },
      diagram: {
        title: "Routing: an input goes to a router, which sends it to one of three specialised handlers.",
        h: 190,
        nodes: [
          n("in", "Input", 46, 95, "user"),
          n("r", "Router", 170, 95, "decision"),
          n("a", "Refunds", 380, 30),
          n("b", "Tech support", 380, 95),
          n("c", "General (small model)", 380, 160, "ghost"),
        ],
        edges: [e("in", "r"), e("r", "a"), e("r", "b"), e("r", "c")],
      },
    },
    {
      slug: "parallelization",
      name: "Parallelization",
      summary: "Run LLM calls at the same time, then combine them in code: split the work, or vote.",
      definition:
        "Independent LLM calls run concurrently and code merges the results. Sectioning splits a task into independent parts; voting runs the same task several times and compares the answers.",
      useWhen: [
        "Subtasks do not depend on each other and speed matters.",
        "You want several perspectives or attempts, for example a majority vote on a risky judgement.",
      ],
      pros: [
        "Wall-clock time drops to roughly the slowest single call.",
        "Voting raises confidence on borderline decisions.",
      ],
      cons: ["Costs scale with the number of branches.", "Merging conflicting outputs needs a clear rule."],
      example:
        "Review a pull request with three parallel prompts (security, performance, readability) and merge their findings.",
      code: {
        lang: "python",
        file: "parallel.py",
        source: code(`
          checks = ["security", "performance", "readability"]
          reviews = await asyncio.gather(*[
              allm(f"Review this diff for {c} issues only:\\n{diff}") for c in checks
          ])
          report = merge(reviews)  # plain code, not another LLM call
        `),
      },
      diagram: {
        title:
          "Parallelization: an input fans out to three LLM calls that run at once, and code aggregates the results.",
        h: 190,
        nodes: [
          n("in", "Input", 46, 95, "user"),
          n("a", "LLM", 200, 30, "accent"),
          n("b", "LLM", 200, 95, "accent"),
          n("c", "LLM", 200, 160, "accent"),
          n("agg", "Aggregate\n(code)", 352, 95),
          n("out", "Out", 448, 95),
        ],
        edges: [
          e("in", "a"),
          e("in", "b"),
          e("in", "c"),
          e("a", "agg"),
          e("b", "agg"),
          e("c", "agg"),
          e("agg", "out"),
        ],
      },
    },
    {
      slug: "orchestrator-workers",
      name: "Orchestrator-workers",
      summary: "A lead LLM plans the subtasks at run time, hands them to workers and combines the results.",
      definition:
        "A central LLM breaks the task down on the fly, delegates each piece to a worker LLM and synthesises what comes back. Unlike parallelization, the subtasks are not known in advance.",
      useWhen: [
        "You cannot predict which subtasks a request needs, such as which files a code change touches.",
        "The work is broad enough that one context would overflow.",
      ],
      pros: ["Adapts the plan to each request.", "Workers keep clean, focused contexts."],
      cons: [
        "Harder to debug: the plan changes from run to run.",
        "The orchestrator's plan quality caps the whole result.",
      ],
      example:
        "A coding assistant decides which files need edits, sends one worker per file, then checks the combined change.",
      diagram: {
        title:
          "Orchestrator-workers: an orchestrator delegates to workers created at run time, and a synthesizer combines their results.",
        h: 200,
        nodes: [
          n("in", "Task", 40, 100, "user"),
          n("o", "Orchestrator", 150, 100, "accent"),
          n("w1", "Worker", 290, 34),
          n("w2", "Worker", 290, 100),
          n("w3", "Worker n", 290, 166, "ghost"),
          n("s", "Synthesize", 418, 100),
        ],
        edges: [
          e("in", "o"),
          e("o", "w1"),
          e("o", "w2"),
          e("o", "w3", { dashed: true }),
          e("w1", "s"),
          e("w2", "s"),
          e("w3", "s", { dashed: true }),
        ],
      },
      code: {
        lang: "python",
        file: "orchestrator.py",
        source: code(`
          plan = llm(f"List the subtasks needed for: {task}", schema=Plan)
          results = await asyncio.gather(*[
              allm(f"Do this subtask well:\\n{step.description}") for step in plan.steps
          ])
          answer = llm(f"Combine these results into one answer:\\n{results}")
        `),
      },
    },
    {
      slug: "evaluator-optimizer",
      name: "Evaluator-optimizer (reflection)",
      summary:
        "One call drafts, another critiques against clear criteria, and the loop repeats until it passes.",
      definition:
        "A generator produces an answer and an evaluator scores it with specific feedback, in a loop. When one model critiques and revises its own work, the same idea is usually called reflection.",
      useWhen: [
        "There are clear, checkable criteria, and feedback measurably improves the result.",
        "A human editor would naturally go back and forth on drafts, as with translation or tricky code.",
      ],
      pros: [
        "Raises quality on tasks with clear standards.",
        "Feedback is inspectable, which helps debugging.",
      ],
      cons: [
        "Each round adds cost and latency; cap the iterations.",
        "A vague evaluator just approves or loops forever.",
      ],
      example:
        "Translate a legal paragraph, have an evaluator flag lost nuance, and revise until it reports no issues or three rounds pass.",
      code: {
        lang: "python",
        file: "reflect.py",
        source: code(`
          draft = llm(f"Translate:\\n{text}")
          for _ in range(3):                       # always cap the loop
              review = llm(f"Score this translation and list issues:\\n{draft}", schema=Review)
              if review.passed:
                  break
              draft = llm(f"Revise using this feedback:\\n{review.issues}\\n\\n{draft}")
        `),
      },
      diagram: {
        title:
          "Evaluator-optimizer: a generator sends a draft to an evaluator, which returns feedback until the draft is accepted.",
        h: 180,
        nodes: [
          n("in", "Input", 46, 90, "user"),
          n("g", "Generator", 180, 90, "accent"),
          n("ev", "Evaluator", 330, 90),
          n("out", "Accepted", 330, 160, "ghost"),
        ],
        edges: [
          e("in", "g"),
          e("g", "ev", { curve: 36, label: "draft" }),
          e("ev", "g", { curve: 36, label: "feedback" }),
          e("ev", "out", { label: "pass" }),
        ],
      },
    },
    {
      slug: "agent-loop",
      name: "Tool use and the agent loop (ReAct)",
      summary:
        "The model picks an action, a tool runs it, the result comes back, and the loop repeats until done.",
      definition:
        "An autonomous agent alternates between reasoning and acting: it chooses a tool call, observes the result and decides the next step, until it judges the goal met or hits a stop condition. ReAct is the research name for interleaving reasoning with actions.",
      useWhen: [
        "The number of steps is open-ended and cannot be hard-coded.",
        "The environment gives reliable feedback, such as test results or tool errors, and runs in a sandbox you trust.",
      ],
      pros: [
        "Handles open-ended problems that no fixed workflow covers.",
        "Grounded in real feedback at every step, not just the model's guesses.",
      ],
      cons: [
        "Costs and errors can compound over many steps.",
        "Needs guardrails: step limits, sandboxing and clear stopping rules.",
      ],
      example:
        "A coding agent runs the tests, reads the failure, edits a file and reruns the tests until they pass or it reaches 20 steps.",
      code: {
        lang: "python",
        file: "agent_loop.py",
        source: code(`
          messages = [user(goal)]
          for step in range(MAX_STEPS):
              reply = llm(messages, tools=TOOLS)
              if not reply.tool_calls:          # model says it is done
                  return reply.text
              for call in reply.tool_calls:
                  messages.append(tool_result(call.id, run_tool(call)))
          raise StepLimitReached()
        `),
      },
      diagram: {
        title:
          "Agent loop: the LLM sends actions to tools and the environment, gets observations back, and stops when done.",
        h: 180,
        nodes: [
          n("goal", "Goal", 46, 90, "user"),
          n("llm", "LLM", 190, 90, "accent"),
          n("env", "Tools /\nenvironment", 380, 90),
          n("stop", "Stop", 190, 162, "ghost"),
        ],
        edges: [
          e("goal", "llm"),
          e("llm", "env", { curve: 34, label: "action" }),
          e("env", "llm", { curve: 34, label: "observation" }),
          e("llm", "stop", { dashed: true, label: "done" }),
        ],
      },
    },
    {
      slug: "human-in-the-loop",
      name: "Human-in-the-loop",
      summary: "Pause before consequential actions and let a person approve, edit or reject them.",
      definition:
        "The agent proposes an action, and anything risky (spending money, sending messages, deleting data) waits for a human decision before it runs. Approvals can also happen at checkpoints in a long task.",
      useWhen: [
        "Actions are hard to reverse or affect other people.",
        "Trust in the agent is still being built, or rules require a named approver.",
      ],
      pros: [
        "Stops costly mistakes before they happen.",
        "Approvals become labelled data for evaluating the agent.",
      ],
      cons: [
        "Adds waiting time and needs a durable way to pause and resume.",
        "Too many prompts lead to rubber-stamping.",
      ],
      example:
        "An operations agent drafts a refund; it is only issued after a support lead approves it in the dashboard.",
      code: {
        lang: "python",
        file: "approval.py",
        source: code(`
          proposal = agent.plan(task)
          if proposal.tool in RISKY_TOOLS:
              decision = await approvals.request(proposal, reviewer="support-lead")
              if decision.rejected:
                  return agent.revise(proposal, decision.reason)
          return run_tool(proposal)
        `),
      },
      diagram: {
        title:
          "Human-in-the-loop: the agent proposes an action, a gate asks a human, and only approved actions run.",
        h: 190,
        nodes: [
          n("agent", "Agent", 46, 80, "accent"),
          n("gate", "Risky?", 200, 80, "decision"),
          n("human", "Human", 200, 164, "user"),
          n("run", "Run tool", 400, 80),
        ],
        edges: [
          e("agent", "gate", { label: "propose" }),
          e("gate", "run", { label: "no" }),
          e("gate", "human", { label: "yes" }),
          e("human", "run", { label: "approve" }),
          e("human", "agent", { dashed: true, label: "reject" }),
        ],
      },
    },
  ],
  reading: [
    {
      title: "Building effective agents",
      source: "Anthropic",
      href: "https://www.anthropic.com/research/building-effective-agents",
    },
    {
      title: "A practical guide to building agents (PDF)",
      source: "OpenAI",
      href: "https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf",
    },
    {
      title: "AI agent orchestration patterns",
      source: "Microsoft Azure Architecture Center",
      href: "https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns",
    },
    {
      title: "Choose a design pattern for your agentic AI system",
      source: "Google Cloud",
      href: "https://docs.cloud.google.com/architecture/choose-design-pattern-agentic-ai-system",
    },
    {
      title: "ReAct: Synergizing reasoning and acting in language models",
      source: "arXiv",
      href: "https://arxiv.org/abs/2210.03629",
    },
    {
      title: "Reflexion: Language agents with verbal reinforcement learning",
      source: "arXiv",
      href: "https://arxiv.org/abs/2303.11366",
    },
  ],
};
