import type { FdeItem, PhaseId, SectionId, Tier } from "../types";

/*
 * All 52 items from the FDE Skills Checklist by @kubernetism, built from 100
 * live Forward Deployed Engineer job postings. Titles, sections, tiers and
 * percentages are copied exactly from the source; the definitions and phases
 * are this site's own.
 */

export const SOURCE = {
  credit: "@kubernetism",
  basis: "100 live Forward Deployed Engineer job postings",
  assumedNote:
    "An asterisk means employers expect you to already have the skill, so postings rarely spell it out.",
} as const;

export const SECTIONS: Record<SectionId, { name: string; short: string }> = {
  software: { name: "Software Engineering", short: "SKILLS_01" },
  ai: { name: "AI Engineering", short: "SKILLS_02" },
  customer: { name: "Customer & Delivery", short: "SKILLS_03" },
};

export const TIERS: Record<Tier, string> = {
  high: "High priority",
  medium: "Medium priority",
  nice: "Nice-to-have",
};

export const PHASES: Record<PhaseId, { name: string; goal: string }> = {
  1: {
    name: "Foundations",
    goal: "Write, read and test real code comfortably, including code you did not write.",
  },
  2: {
    name: "Build with LLMs",
    goal: "Turn model APIs into working features and agents, and prove they work with evals.",
  },
  3: {
    name: "Ship to production",
    goal: "Run it for real users: secure, observable, deployed and integrated with existing systems.",
  },
  4: {
    name: "Customer delivery",
    goal: "Find the real problem, scope it, demo it and keep every stakeholder aligned until it lands.",
  },
  5: {
    name: "Lead and specialise",
    goal: "Own outcomes end to end, feed the product, grow the customer's team and go deep where it pays.",
  },
};

export const items: readonly FdeItem[] = [
  // ---------- Software Engineering ----------
  {
    slug: "production-systems",
    sourceId:
      "software-engineering::production-systems-with-real-users-logging-monitoring-fixing-what-breaks",
    title: "Production systems with real users: logging, monitoring, fixing what breaks",
    section: "software",
    tier: "high",
    pct: "87%",
    phase: 3,
    definition:
      "Running software that real people depend on: knowing when it breaks, why it broke and how to fix it fast.",
  },
  {
    slug: "apis-integrations",
    sourceId: "software-engineering::apis-and-integrations-into-existing-systems",
    title: "APIs and integrations into existing systems",
    section: "software",
    tier: "high",
    pct: "71%",
    phase: 3,
    definition:
      "Connecting new software to the systems a customer already runs, through their APIs, data and authentication.",
  },
  {
    slug: "system-design-existing-architecture",
    sourceId: "software-engineering::system-design-inside-someone-else-s-architecture",
    title: "System design inside someone else's architecture",
    section: "software",
    tier: "high",
    pct: "70%",
    phase: 3,
    definition:
      "Designing a solution that fits the customer's existing infrastructure, constraints and rules rather than a blank slate.",
  },
  {
    slug: "python",
    sourceId: "software-engineering::python",
    title: "Python",
    section: "software",
    tier: "high",
    pct: "63%",
    phase: 1,
    definition: "The default language for AI and data work, and for most of the glue code an FDE writes.",
  },
  {
    slug: "typescript-javascript",
    sourceId: "software-engineering::typescript-or-javascript",
    title: "TypeScript or JavaScript",
    section: "software",
    tier: "high",
    pct: "49%",
    phase: 1,
    definition:
      "The language of web front ends and many back ends; TypeScript adds static types on top of JavaScript.",
  },
  {
    slug: "working-in-unfamiliar-code",
    sourceId: "software-engineering::working-in-code-you-didn-t-write",
    title: "Working in code you didn't write",
    section: "software",
    tier: "high",
    pct: "*",
    phase: 1,
    definition:
      "Reading, understanding and safely changing an existing codebase, often under time pressure and with little documentation.",
  },
  {
    slug: "security-auth-compliance",
    sourceId: "software-engineering::security-auth-and-compliance-basics",
    title: "Security, auth, and compliance basics",
    section: "software",
    tier: "medium",
    pct: "43%",
    phase: 3,
    definition:
      "Protecting customer data and access: authentication, authorisation, secrets, and the rules regulated customers must follow.",
  },
  {
    slug: "full-stack",
    sourceId: "software-engineering::full-stack-work-a-frontend-not-just-a-backend",
    title: "Full-stack work: a frontend, not just a backend",
    section: "software",
    tier: "medium",
    pct: "39%",
    phase: 3,
    definition:
      "Building the whole feature, including the screen users actually touch, not only the API behind it.",
  },
  {
    slug: "cloud-deployment",
    sourceId: "software-engineering::cloud-deployment-aws-gcp-or-azure",
    title: "Cloud deployment: AWS, GCP, or Azure",
    section: "software",
    tier: "medium",
    pct: "38%",
    phase: 3,
    definition:
      "Getting software running on a major cloud provider, usually inside the customer's own cloud account.",
  },
  {
    slug: "databases-data-modeling",
    sourceId: "software-engineering::databases-and-data-modeling",
    title: "Databases and data modeling",
    section: "software",
    tier: "medium",
    pct: "31%",
    phase: 1,
    definition:
      "Choosing how data is stored and structured so it stays correct, fast to query and easy to change.",
  },
  {
    slug: "data-pipelines",
    sourceId: "software-engineering::data-pipelines",
    title: "Data pipelines",
    section: "software",
    tier: "medium",
    pct: "27%",
    phase: 3,
    definition: "Automated jobs that move and transform data between systems on a schedule or as a stream.",
  },
  {
    slug: "sql",
    sourceId: "software-engineering::sql",
    title: "SQL",
    section: "software",
    tier: "medium",
    pct: "15%*",
    phase: 1,
    definition: "The standard language for querying and changing data in relational databases.",
  },
  {
    slug: "testing",
    sourceId: "software-engineering::tests-for-anything-code-can-check",
    title: "Tests for anything code can check",
    section: "software",
    tier: "medium",
    pct: "*",
    phase: 1,
    definition: "Automated checks that prove code behaves as intended and keeps doing so after every change.",
  },
  {
    slug: "ci-cd-devops",
    sourceId: "software-engineering::ci-cd-and-devops",
    title: "CI/CD and DevOps",
    section: "software",
    tier: "nice",
    pct: "18%",
    phase: 3,
    definition: "Automating build, test and deployment so small changes reach users safely and often.",
  },
  {
    slug: "java",
    sourceId: "software-engineering::java",
    title: "Java",
    section: "software",
    tier: "nice",
    pct: "18%",
    phase: 4,
    definition:
      "A long-established, statically typed language that runs much of the enterprise software FDEs integrate with.",
  },
  {
    slug: "kubernetes-containers",
    sourceId: "software-engineering::kubernetes-and-containers",
    title: "Kubernetes and containers",
    section: "software",
    tier: "nice",
    pct: "16%",
    phase: 3,
    definition:
      "Packaging software into containers and running them at scale on Kubernetes, the common orchestration platform.",
  },
  {
    slug: "terraform-iac",
    sourceId: "software-engineering::terraform-infrastructure-as-code",
    title: "Terraform / infrastructure as code",
    section: "software",
    tier: "nice",
    pct: "9%",
    phase: 3,
    definition:
      "Describing cloud infrastructure in versioned code so environments can be reviewed, repeated and rebuilt.",
  },
  {
    slug: "on-call-incident-response",
    sourceId: "software-engineering::on-call-and-incident-response",
    title: "On-call and incident response",
    section: "software",
    tier: "nice",
    pct: "8%",
    phase: 3,
    definition:
      "Being the person who responds when production breaks, and running the fix and follow-up calmly.",
  },
  {
    slug: "other-languages",
    sourceId: "software-engineering::go-c-rust-ruby-or-scala-only-if-the-customer-s-stack-needs-it",
    title: "Go, C#, Rust, Ruby, or Scala (only if the customer's stack needs it)",
    section: "software",
    tier: "nice",
    pct: "<=11%",
    phase: 4,
    definition:
      "Picking up whatever language the customer's systems are written in, when the work requires it.",
  },

  // ---------- AI Engineering ----------
  {
    slug: "llm-apis",
    sourceId: "ai-engineering::building-features-on-top-of-llm-apis",
    title: "Building features on top of LLM APIs",
    section: "ai",
    tier: "high",
    pct: "67%",
    phase: 2,
    definition:
      "Turning calls to hosted language models into reliable product features with structured inputs and outputs.",
  },
  {
    slug: "agents",
    sourceId:
      "ai-engineering::agents-the-model-picks-the-next-step-calls-tools-works-through-multi-step-tasks",
    title: "Agents: the model picks the next step, calls tools, works through multi-step tasks",
    section: "ai",
    tier: "high",
    pct: "57%",
    phase: 2,
    definition:
      "Systems where the model decides its own next action in a loop, using tools until the task is done.",
  },
  {
    slug: "evals",
    sourceId: "ai-engineering::evals-hard-evidence-the-system-does-what-the-customer-needs",
    title: "Evals: hard evidence the system does what the customer needs",
    section: "ai",
    tier: "high",
    pct: "53%",
    phase: 2,
    definition:
      "Repeatable tests with real examples and graders that measure whether an AI system meets the customer's bar.",
  },
  {
    slug: "tool-calling",
    sourceId: "ai-engineering::tool-calling-function-calling",
    title: "Tool calling / function calling",
    section: "ai",
    tier: "high",
    pct: "17%*",
    phase: 2,
    definition:
      "Letting a model request a function call with structured arguments, which your code runs and returns.",
  },
  {
    slug: "mcp",
    sourceId: "ai-engineering::mcp-for-connecting-agents-to-a-customer-s-systems",
    title: "MCP for connecting agents to a customer's systems",
    section: "ai",
    tier: "high",
    pct: "16%*",
    phase: 2,
    definition:
      "Using the Model Context Protocol to expose a customer's tools and data to agents through a standard interface.",
  },
  {
    slug: "ai-coding-tools",
    sourceId: "ai-engineering::ai-coding-tools-claude-code-cursor-codex",
    title: "AI coding tools: Claude Code, Cursor, Codex",
    section: "ai",
    tier: "high",
    pct: "15%*",
    phase: 2,
    definition:
      "Using AI coding assistants and agents to read, write and change code faster, while staying in control of quality.",
  },
  {
    slug: "prompt-engineering",
    sourceId: "ai-engineering::prompt-engineering",
    title: "Prompt engineering",
    section: "ai",
    tier: "medium",
    pct: "29%",
    phase: 2,
    definition:
      "Writing and iterating on the instructions, examples and context a model receives so it behaves as needed.",
  },
  {
    slug: "rag-retrieval",
    sourceId: "ai-engineering::rag-and-retrieval",
    title: "RAG and retrieval",
    section: "ai",
    tier: "medium",
    pct: "28%",
    phase: 2,
    definition:
      "Fetching relevant passages from the customer's data at question time so the model answers from it.",
  },
  {
    slug: "guardrails-ai-safety",
    sourceId: "ai-engineering::guardrails-and-ai-safety-for-regulated-customers",
    title: "Guardrails and AI safety for regulated customers",
    section: "ai",
    tier: "medium",
    pct: "21%",
    phase: 3,
    definition:
      "Checks and controls that keep an AI system's inputs, outputs and actions within legal, policy and safety limits.",
  },
  {
    slug: "agent-frameworks",
    sourceId: "ai-engineering::agent-frameworks-langchain-langgraph",
    title: "Agent frameworks: LangChain, LangGraph",
    section: "ai",
    tier: "medium",
    pct: "19%",
    phase: 2,
    definition:
      "Libraries that provide ready-made building blocks for chains, agents, memory and multi-step workflows.",
  },
  {
    slug: "llm-observability",
    sourceId: "ai-engineering::llm-observability-tracing-latency-cost-per-call",
    title: "LLM observability: tracing, latency, cost per call",
    section: "ai",
    tier: "medium",
    pct: "*",
    phase: 3,
    definition:
      "Recording every model and tool call with its timing, tokens, cost and outcome so you can debug and tune.",
  },
  {
    slug: "classical-ml",
    sourceId: "ai-engineering::classical-ml-and-ml-frameworks",
    title: "Classical ML and ML frameworks",
    section: "ai",
    tier: "nice",
    pct: "18%",
    phase: 5,
    definition:
      "Traditional machine learning such as regression, trees and clustering, with libraries like scikit-learn and PyTorch.",
  },
  {
    slug: "fine-tuning",
    sourceId: "ai-engineering::fine-tuning-and-post-training",
    title: "Fine-tuning and post-training",
    section: "ai",
    tier: "nice",
    pct: "11%",
    phase: 5,
    definition:
      "Further training a pre-trained model on targeted examples to change its behaviour, style or skill.",
  },
  {
    slug: "inference-gpu-optimization",
    sourceId: "ai-engineering::inference-and-gpu-optimization",
    title: "Inference and GPU optimization",
    section: "ai",
    tier: "nice",
    pct: "5%",
    phase: 5,
    definition:
      "Making models run faster and cheaper when serving them, through batching, quantisation and better GPU use.",
  },

  // ---------- Customer & Delivery ----------
  {
    slug: "consulting-delivery-background",
    sourceId: "customer-delivery::consulting-solutions-engineering-or-similar-delivery-background",
    title: "Consulting, solutions engineering, or similar delivery background",
    section: "customer",
    tier: "high",
    pct: "74%",
    phase: 4,
    definition:
      "Past work delivering technical solutions for clients, where success was judged by the client, not your own team.",
  },
  {
    slug: "end-to-end-ownership",
    sourceId: "customer-delivery::end-to-end-ownership",
    title: "End-to-end ownership",
    section: "customer",
    tier: "high",
    pct: "72%",
    phase: 5,
    definition:
      "Taking responsibility for an outcome from first conversation to working production system, with nothing left on the floor.",
  },
  {
    slug: "customer-facing-time",
    sourceId: "customer-delivery::time-spent-directly-with-customers-support-sales-pre-sales-client-projects",
    title: "Time spent directly with customers: support, sales, pre-sales, client projects",
    section: "customer",
    tier: "high",
    pct: "71%",
    phase: 4,
    definition: "Hands-on experience working directly with the people who buy and use the software.",
  },
  {
    slug: "communication",
    sourceId: "customer-delivery::communication-with-technical-and-non-technical-people",
    title: "Communication with technical and non-technical people",
    section: "customer",
    tier: "high",
    pct: "68%",
    phase: 4,
    definition:
      "Explaining technical work clearly to any audience, from engineers to executives, in writing and in person.",
  },
  {
    slug: "discovery-scoping",
    sourceId: "customer-delivery::discovery-and-scoping",
    title: "Discovery and scoping",
    section: "customer",
    tier: "high",
    pct: "68%",
    phase: 4,
    definition:
      "Finding the customer's real problem and agreeing what will be built, by when, and how success is measured.",
  },
  {
    slug: "ambiguity-high-agency",
    sourceId: "customer-delivery::comfort-with-ambiguity-and-high-agency",
    title: "Comfort with ambiguity and high agency",
    section: "customer",
    tier: "high",
    pct: "65%",
    phase: 4,
    definition: "Making progress without a clear spec or anyone telling you what to do next.",
  },
  {
    slug: "travel",
    sourceId: "customer-delivery::travel-usually-25-to-50-of-the-time",
    title: "Travel, usually 25 to 50% of the time",
    section: "customer",
    tier: "high",
    pct: "45%",
    phase: 4,
    definition:
      "Working on site with customers for a substantial part of the role, and staying effective on the road.",
  },
  {
    slug: "stakeholder-management",
    sourceId: "customer-delivery::stakeholder-management-through-delivery",
    title: "Stakeholder management through delivery",
    section: "customer",
    tier: "medium",
    pct: "56%",
    phase: 4,
    definition:
      "Keeping everyone with a stake in the project informed, aligned and supportive from kickoff to launch.",
  },
  {
    slug: "business-acumen",
    sourceId: "customer-delivery::business-acumen-tying-your-work-to-a-customer-outcome",
    title: "Business acumen: tying your work to a customer outcome",
    section: "customer",
    tier: "medium",
    pct: "54%",
    phase: 5,
    definition:
      "Understanding how the customer makes or saves money, and linking each piece of technical work to that.",
  },
  {
    slug: "product-sense",
    sourceId: "customer-delivery::product-sense-bringing-what-you-learn-back-to-the-product-team",
    title: "Product sense: bringing what you learn back to the product team",
    section: "customer",
    tier: "medium",
    pct: "54%",
    phase: 5,
    definition:
      "Turning what you see in the field into clear, prioritised input for the people who build the product.",
  },
  {
    slug: "prototypes-pocs-demos",
    sourceId: "customer-delivery::prototypes-pocs-and-demos",
    title: "Prototypes, POCs, and demos",
    section: "customer",
    tier: "medium",
    pct: "50%",
    phase: 4,
    definition: "Building something working quickly to prove value, answer a question or win a decision.",
  },
  {
    slug: "executive-presence",
    sourceId: "customer-delivery::executive-presence-reporting-to-decision-makers",
    title: "Executive presence: reporting to decision-makers",
    section: "customer",
    tier: "medium",
    pct: "49%",
    phase: 5,
    definition:
      "Presenting progress, risks and recommendations to senior leaders briefly, confidently and honestly.",
  },
  {
    slug: "technical-writing",
    sourceId: "customer-delivery::technical-writing-and-documentation",
    title: "Technical writing and documentation",
    section: "customer",
    tier: "medium",
    pct: "41%",
    phase: 4,
    definition:
      "Writing designs, guides and handover documents that let others understand, run and extend your work.",
  },
  {
    slug: "startup-founder-experience",
    sourceId: "customer-delivery::startup-or-founder-experience",
    title: "Startup or founder experience",
    section: "customer",
    tier: "nice",
    pct: "41%",
    phase: 5,
    definition:
      "Having built something from zero with few resources, where you did whatever the business needed.",
  },
  {
    slug: "mentoring-enablement",
    sourceId: "customer-delivery::mentoring-and-enabling-the-customer-s-team",
    title: "Mentoring and enabling the customer's team",
    section: "customer",
    tier: "nice",
    pct: "38%",
    phase: 5,
    definition:
      "Teaching the customer's engineers to run and extend the solution so it survives after you leave.",
  },
  {
    slug: "domain-expertise",
    sourceId: "customer-delivery::industry-or-domain-expertise",
    title: "Industry or domain expertise",
    section: "customer",
    tier: "nice",
    pct: "25%",
    phase: 4,
    definition:
      "Knowing how a specific industry works, such as finance, healthcare or government, including its language and rules.",
  },
  {
    slug: "employer-platform",
    sourceId: "customer-delivery::experience-with-the-employer-s-own-platform",
    title: "Experience with the employer's own platform",
    section: "customer",
    tier: "nice",
    pct: "20%",
    phase: 4,
    definition:
      "Already knowing the hiring company's product well enough to deploy and extend it for customers.",
  },
  {
    slug: "curiosity-fast-learning",
    sourceId: "customer-delivery::curiosity-and-fast-learning",
    title: "Curiosity and fast learning",
    section: "customer",
    tier: "nice",
    pct: "19%",
    phase: 1,
    definition:
      "Picking up new tools, domains and codebases quickly because you want to understand how things work.",
  },
  {
    slug: "public-work",
    sourceId: "customer-delivery::public-work-open-source-blog-posts-talks",
    title: "Public work: open source, blog posts, talks",
    section: "customer",
    tier: "nice",
    pct: "10%",
    phase: 5,
    definition:
      "Work anyone can see, such as code, writing or talks, that shows how you think and what you can build.",
  },
];

export function itemBySlug(slug: string): FdeItem | undefined {
  return items.find((item) => item.slug === slug);
}
