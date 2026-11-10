import { code, e, n } from "../dsl";
import type { Category } from "../types";

export const llmops: Category = {
  slug: "llmops",
  name: "LLMOps",
  blurb: "Ship and run LLM features like software: evaluate, version, observe, and control cost and latency.",
  intro:
    "LLM features fail quietly: a prompt tweak or a model upgrade can make answers worse without a single error. LLMOps brings the usual engineering loop of tests, versioning, monitoring and gradual rollout to prompts and models.",
  patterns: [
    {
      slug: "eval-suite",
      name: "Evaluation suite",
      summary:
        "Keep a set of real test cases with graders, and run it on every prompt, model or tool change.",
      definition:
        "An eval suite is a dataset of inputs with expected outcomes plus graders: exact checks where possible, code-based checks for format, and an LLM-as-judge with a clear rubric for subjective quality. It runs in CI so regressions are caught before release.",
      useWhen: [
        "Always, from the first prototype; start with 20 to 50 real examples.",
        "Before switching models, editing prompts or changing tools.",
      ],
      pros: [
        "Turns “seems better” into a number you can compare.",
        "Failures found in production become new test cases.",
      ],
      cons: [
        "Building good cases and rubrics takes real effort.",
        "LLM judges need their own spot-checks against human labels.",
      ],
      example:
        "A support bot's suite of 200 cases checks correct refund policy, no invented order numbers and a friendly tone, and runs on every pull request.",
      code: {
        lang: "python",
        file: "eval.py",
        source: code(`
          cases = load_jsonl("evals/support.jsonl")      # input, expected, tags
          results = []
          for case in cases:
              out = app.answer(case["input"])
              results.append({
                  "exact": case["expected_policy"] in out,
                  "judge": judge(out, rubric=TONE_RUBRIC),     # 1-5 with reasons
              })
          assert pass_rate(results) >= BASELINE - 0.02, "Regression: blocking merge"
        `),
      },
      diagram: {
        title:
          "Evaluation suite: a change runs against a test dataset, code checks and an LLM judge score it, and CI passes or blocks it.",
        h: 180,
        nodes: [
          n("chg", "Prompt /\nmodel change", 62, 90, "user"),
          n("ds", "Test cases", 210, 40, "store"),
          n("run", "Run app", 210, 140, "accent"),
          n("g", "Code checks\n+ LLM judge", 320, 90),
          n("ci", "CI gate", 430, 90, "accent"),
        ],
        edges: [e("chg", "run"), e("ds", "run"), e("run", "g"), e("g", "ci")],
      },
    },
    {
      slug: "prompt-versioning",
      name: "Prompt versioning and registry",
      summary:
        "Treat prompts as versioned artifacts with IDs, history and evaluation results, not strings buried in code.",
      definition:
        "Prompts (with model name and parameters) are stored with a version, either in the repo or a prompt registry. The app references a version, every change is reviewed and evaluated, and logs record which version produced each output.",
      useWhen: [
        "More than one person edits prompts, or prompts change often.",
        "You need to roll back a bad prompt quickly or compare versions.",
      ],
      pros: ["Reproducible outputs and fast rollback.", "Clear link from any log line to the exact prompt."],
      cons: [
        "A registry is one more system to run.",
        "Prompts and code can drift if versions are not pinned together.",
      ],
      example:
        "support-answer@v14 moves to v15 only after its eval score matches v14 and a 10% canary looks healthy.",
      code: {
        lang: "yaml",
        file: "prompts/support-answer.yaml",
        source: code(`
          id: support-answer
          version: 15
          model: claude-sonnet-5
          temperature: 0.2
          system: |
            You are a support assistant for Acme. Answer only from the policy excerpts.
          eval: { suite: support, min_pass_rate: 0.92 }
        `),
      },
      diagram: {
        title:
          "Prompt versioning: prompt versions v14 and v15 live in a registry; the app pins a version and logs record it.",
        h: 170,
        nodes: [
          n("v14", "v14", 60, 50, "store"),
          n("v15", "v15", 60, 125, "store"),
          n("reg", "Registry", 200, 88),
          n("app", "App pins v15", 340, 88, "accent"),
          n("log", "Logs: v15", 340, 150, "ghost"),
        ],
        edges: [e("v14", "reg"), e("v15", "reg"), e("reg", "app"), e("app", "log", { dashed: true })],
      },
    },
    {
      slug: "llm-observability",
      name: "Tracing and monitoring",
      summary:
        "Trace every model and tool call with tokens, latency, cost and outcome; alert on what users would notice.",
      definition:
        "Each request produces a trace of spans for retrieval, model calls and tool calls, tagged with model, prompt version, token counts, latency and errors. Dashboards and alerts track quality signals (thumbs-down rate, guardrail trips) alongside cost and latency. OpenTelemetry has semantic conventions for generative AI spans.",
      useWhen: [
        "Any LLM feature in production.",
        "You need to explain a bad answer or a cost spike after the fact.",
      ],
      pros: [
        "Debug real failures from real traces.",
        "Standard conventions let you switch observability tools.",
      ],
      cons: [
        "Prompts and outputs may contain personal data: redact and set retention.",
        "High-volume tracing has storage costs; sample wisely.",
      ],
      example:
        "An alert fires when p95 latency passes 6 seconds or when guardrail trips double within an hour.",
      code: {
        lang: "python",
        file: "otel.py",
        source: code(`
          with tracer.start_as_current_span("chat claude-sonnet-5") as span:
              span.set_attribute("gen_ai.request.model", "claude-sonnet-5")
              resp = client.messages.create(...)
              span.set_attribute("gen_ai.usage.input_tokens", resp.usage.input_tokens)
              span.set_attribute("gen_ai.usage.output_tokens", resp.usage.output_tokens)
        `),
      },
      diagram: {
        title:
          "Tracing and monitoring: a request trace has spans for retrieval, the model and a tool, exported to dashboards and alerts.",
        h: 170,
        groups: [{ label: "trace", x: 10, y: 20, w: 300, h: 130 }],
        nodes: [
          n("r", "retrieve 120ms", 160, 50),
          n("m", "model 2.1s 3k tok", 160, 88, "accent"),
          n("t", "tool 300ms", 160, 126),
          n("dash", "Dashboards\n+ alerts", 410, 88, "store"),
        ],
        edges: [e("m", "dash", { label: "export" })],
      },
    },
    {
      slug: "cost-latency-control",
      name: "Cost and latency control (model cascade)",
      summary:
        "Send each request to the cheapest model that can handle it, cache what repeats, and batch what can wait.",
      definition:
        "A set of levers: route easy requests to small models and escalate hard or low-confidence ones; cache prompt prefixes and repeated answers; stream output to cut perceived latency; batch offline jobs at a discount; and cap tokens and steps per request.",
      useWhen: [
        "Traffic grows and the bill or latency starts to matter.",
        "A large share of requests are simple or repetitive.",
      ],
      pros: [
        "Often cuts cost severalfold without hurting quality on the hard cases.",
        "Streaming makes responses feel fast.",
      ],
      cons: [
        "Routing adds a decision that can be wrong.",
        "Each lever needs its own evaluation to confirm quality held.",
      ],
      example:
        "Classification runs on a small model; if its confidence is below 0.8 the request escalates to a larger one. Nightly summaries use the batch API.",
      code: {
        lang: "python",
        file: "cascade.py",
        source: code(`
          small = classify(text, model="claude-haiku-4-5")
          if small.confidence >= 0.8:
              return small.label
          return classify(text, model="claude-sonnet-5").label    # escalate only when unsure
        `),
      },
      diagram: {
        title:
          "Model cascade: requests go to a small model first; confident answers return, unsure ones escalate to a larger model.",
        h: 170,
        nodes: [
          n("req", "Request", 46, 85, "user"),
          n("small", "Small model", 160, 85),
          n("conf", "Sure?", 280, 85, "decision"),
          n("ret", "Return", 420, 30),
          n("big", "Large model", 415, 145, "accent"),
        ],
        edges: [
          e("req", "small"),
          e("small", "conf"),
          e("conf", "ret", { label: "yes" }),
          e("conf", "big", { label: "no" }),
        ],
      },
    },
    {
      slug: "llm-gateway",
      name: "LLM gateway",
      summary:
        "Route all model traffic through one internal proxy for keys, quotas, fallbacks, caching and logs.",
      definition:
        "Apps call an internal gateway instead of providers directly. The gateway holds the API keys, enforces per-team quotas and rate limits, retries or falls back to another model on errors, caches responses and records usage for cost allocation.",
      useWhen: [
        "Several teams or services use LLMs.",
        "You need central control of keys, spend and provider failover.",
      ],
      pros: [
        "One place for security, budgets and observability.",
        "Switch or mix providers without touching every app.",
      ],
      cons: ["A critical hop that must be highly available.", "Adds a little latency to every call."],
      example:
        "When the primary provider returns overload errors, the gateway retries once and then routes to a fallback model.",
      code: {
        lang: "yaml",
        file: "gateway.yaml",
        source: code(`
          routes:
            chat-default:
              primary: anthropic/claude-sonnet-5
              fallback: [openai/gpt-5]
              retry: { attempts: 2, on: [429, 529, 503] }
          quotas:
            team-support: { usd_per_day: 150 }
          logging: { redact: [email, phone] }
        `),
      },
      diagram: {
        title:
          "LLM gateway: several apps call one gateway that holds keys and quotas, logs usage and routes to primary or fallback providers.",
        h: 180,
        nodes: [
          n("a1", "App A", 50, 50, "user"),
          n("a2", "App B", 50, 130, "user"),
          n("gw", "Gateway\nkeys · quotas", 210, 90, "accent"),
          n("p1", "Provider 1", 400, 50),
          n("p2", "Provider 2", 400, 130, "ghost"),
        ],
        edges: [
          e("a1", "gw"),
          e("a2", "gw"),
          e("gw", "p1", { label: "primary" }),
          e("gw", "p2", { dashed: true, label: "fallback" }),
        ],
      },
    },
  ],
  reading: [
    {
      title: "Your AI product needs evals",
      source: "Hamel Husain",
      href: "https://hamel.dev/blog/posts/evals/",
    },
    {
      title: "Evaluating model performance",
      source: "OpenAI API docs",
      href: "https://developers.openai.com/api/docs/guides/evals",
    },
    {
      title: "Define success and create strong empirical evaluations",
      source: "Claude Developer Platform docs",
      href: "https://platform.claude.com/docs/en/test-and-evaluate/develop-tests",
    },
    {
      title: "Semantic conventions for generative AI",
      source: "OpenTelemetry",
      href: "https://opentelemetry.io/docs/specs/semconv/gen-ai/",
    },
    {
      title: "Prompt caching",
      source: "Claude Developer Platform docs",
      href: "https://platform.claude.com/docs/en/build-with-claude/prompt-caching",
    },
    {
      title: "Batch processing",
      source: "Claude Developer Platform docs",
      href: "https://platform.claude.com/docs/en/build-with-claude/batch-processing",
    },
  ],
};
