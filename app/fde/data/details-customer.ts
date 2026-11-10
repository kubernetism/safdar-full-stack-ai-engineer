import type { FdeDetail } from "../types";

const MOM_TEST = { title: "The Mom Test", author: "Rob Fitzpatrick" };
const PYRAMID = { title: "The Pyramid Principle", author: "Barbara Minto" };
const CRUCIAL = {
  title: "Crucial Conversations",
  author: "Kerry Patterson, Joseph Grenny, Ron McMillan, Al Switzler",
};
const LEAN_STARTUP = { title: "The Lean Startup", author: "Eric Ries" };

export const customerDetails: Partial<Record<string, FdeDetail>> = {
  "consulting-delivery-background": {
    summary:
      "A delivery background means you have built technical solutions for clients before, as a consultant, solutions engineer, implementation engineer or similar, where the client judged success and deadlines were real.",
    why: "It is the most-mentioned customer skill in the postings. It signals that you can manage expectations, work inside someone else's organisation and finish projects, not only write good code.",
    roadmap: {
      beginner: [
        "Treat an internal team as a client: gather requirements, agree scope, deliver and get feedback.",
        "Take on a small freelance or volunteer project with a real client.",
      ],
      intermediate: [
        "Run a multi-week project with a statement of work, milestones and status reports.",
        "Handle a scope change formally and keep the client happy.",
      ],
      advanced: [
        "Lead delivery for several clients at once and keep quality consistent.",
        "Turn repeated client work into reusable assets and playbooks.",
      ],
    },
    dos: [
      "Write down what was agreed after every meeting.",
      "Under-promise on dates and over-communicate on progress.",
      "Measure success the way the client measures it.",
    ],
    donts: [
      "Don't say yes to scope changes without discussing time and cost.",
      "Don't disappear between milestones.",
    ],
    pitfalls: [
      "Delivering what was asked instead of what was needed.",
      "No written scope, so every disagreement becomes a debate about memory.",
    ],
    practice: [
      "Find a small business or non-profit and deliver a tiny automation for them end to end.",
      "Write a case study of a past project: problem, approach, result and what you would change.",
    ],
    next: ["discovery-scoping", "stakeholder-management", "end-to-end-ownership"],
    books: [
      { title: "The Trusted Advisor", author: "David H. Maister, Charles H. Green, Robert M. Galford" },
      { title: "Flawless Consulting", author: "Peter Block" },
      { title: "The Secrets of Consulting", author: "Gerald M. Weinberg" },
    ],
    interview: [
      "Tell me about a client project that went off track. What did you do?",
      "How do you handle a client who keeps adding requirements?",
    ],
  },

  "end-to-end-ownership": {
    summary:
      "Ownership means treating the customer's outcome as yours: from the first conversation through design, build, deployment, adoption and follow-up, including the unglamorous parts nobody assigned.",
    why: "FDEs often work alone or in small teams at a customer, so there is nobody to hand problems to. Employers look for people who close loops without being chased.",
    roadmap: {
      beginner: [
        "Take one small project from idea to production and to a real user, yourself.",
        "Keep a list of loose ends and close every one.",
      ],
      intermediate: [
        "Own a feature including monitoring, documentation and user support after launch.",
        "Spot and fix a problem outside your assigned scope that blocked the outcome.",
      ],
      advanced: [
        "Own a customer deployment's success metric and report on it.",
        "Build ownership habits into a team: clear owners, written follow-ups.",
      ],
    },
    dos: [
      "Define what done means in terms of the customer's result.",
      "Raise risks early, with a proposed fix.",
      "Follow up after launch to check it is actually used.",
    ],
    donts: [
      "Don't say it is not my job when it blocks the outcome.",
      "Don't call it done when it is only merged.",
    ],
    pitfalls: [
      "Owning everything alone and burning out instead of asking for help.",
      "Shipping and moving on before adoption is real.",
    ],
    practice: [
      "Run a side project for three months after launch: support, fixes and a usage report.",
      "Write a launch checklist that covers monitoring, docs, training and success metrics.",
    ],
    next: ["production-systems", "business-acumen", "stakeholder-management"],
    books: [
      { title: "Extreme Ownership", author: "Jocko Willink, Leif Babin" },
      { title: "The Effective Engineer", author: "Edmond Lau" },
      { title: "Shape Up", author: "Ryan Singer" },
    ],
    interview: [
      "Tell me about something you owned from start to finish. What did you do that was outside your job description?",
      "How do you decide when a project is truly done?",
    ],
  },

  "customer-facing-time": {
    summary:
      "This is direct experience with customers: support tickets, sales calls, pre-sales demos or client projects. It builds the instincts for listening, handling pressure and reading what people actually need.",
    why: "FDEs spend much of their time with customers. Postings favour people who have already done it, because the hardest parts (frustration, ambiguity, competing asks) are learned in the room.",
    roadmap: {
      beginner: [
        "Shadow support or sales calls and take notes on what customers really ask.",
        "Answer real support tickets for a product you know.",
      ],
      intermediate: [
        "Run technical calls with customers yourself and follow up in writing.",
        "Support a pre-sales evaluation or pilot.",
      ],
      advanced: [
        "Own a set of customer relationships, including difficult ones.",
        "Feed patterns from many customers back into product and sales.",
      ],
    },
    dos: [
      "Listen more than you talk in early calls.",
      "Follow up every call with a short written summary and next steps.",
      "Be honest about what the product cannot do.",
    ],
    donts: [
      "Don't argue with a frustrated customer; understand them first.",
      "Don't overpromise to win the moment.",
    ],
    pitfalls: [
      "Solving the first problem mentioned instead of the important one.",
      "Taking customer frustration personally.",
    ],
    practice: [
      "Volunteer for support rotation or community forums for a tool you use and answer 20 questions well.",
      "Run five user interviews about a problem and summarise what you learned.",
    ],
    next: ["communication", "discovery-scoping", "product-sense"],
    books: [
      MOM_TEST,
      { title: "SPIN Selling", author: "Neil Rackham" },
      { title: "The Challenger Sale", author: "Matthew Dixon, Brent Adamson" },
    ],
    interview: [
      "Tell me about a difficult customer conversation and how you handled it.",
      "How do you find out what a customer really needs when they ask for a specific feature?",
    ],
  },

  communication: {
    summary:
      "Good communication means adapting the same message to engineers, managers and executives: leading with the answer, choosing the right level of detail and checking understanding, in writing and out loud.",
    why: "FDEs translate between the customer's business people, their engineers and your own product team. Clear communication prevents wrong builds, builds trust and makes progress visible.",
    roadmap: {
      beginner: [
        "Write status updates that lead with the conclusion and next steps.",
        "Explain one technical concept to a non-technical friend and refine it.",
      ],
      intermediate: [
        "Present a technical design to engineers and the same plan to a business audience.",
        "Run a meeting with a clear agenda, decisions and written follow-up.",
      ],
      advanced: [
        "Handle tense conversations about delays or failures calmly and honestly.",
        "Coach others on technical communication.",
      ],
    },
    dos: [
      "Lead with the answer, then support it.",
      "Use the audience's words, not internal jargon.",
      "Confirm decisions in writing.",
    ],
    donts: ["Don't hide bad news in long messages.", "Don't use acronyms the audience may not know."],
    pitfalls: [
      "Too much detail for executives, too little for engineers.",
      "Assuming silence means agreement.",
    ],
    practice: [
      "Write a one-page explainer of an AI system for a non-technical executive and get feedback.",
      "Record yourself giving a five-minute technical update and cut it to two minutes.",
    ],
    next: ["executive-presence", "technical-writing", "stakeholder-management"],
    books: [PYRAMID, { title: "Made to Stick", author: "Chip Heath, Dan Heath" }, CRUCIAL],
    interview: [
      "Explain RAG to me as if I were the customer's CFO.",
      "Tell me about a time a miscommunication caused a problem and how you fixed it.",
    ],
  },

  "discovery-scoping": {
    summary:
      "Discovery is finding the customer's real problem, users, data and constraints. Scoping turns that into an agreed plan: what will be built, what will not, by when and how success will be measured.",
    why: "AI projects fail most often from unclear goals, not bad models. An FDE who scopes well picks a problem the technology can solve, with data that exists, and a success measure the customer cares about.",
    roadmap: {
      beginner: [
        "Interview a user about their workflow and write down the problem in their words.",
        "Write a one-page scope with goals, non-goals and success criteria.",
      ],
      intermediate: [
        "Run a discovery workshop with several stakeholders and reconcile their goals.",
        "Check data availability and quality before committing to a solution.",
      ],
      advanced: [
        "Scope a multi-phase engagement with milestones and an evaluation plan.",
        "Talk a customer out of a poor first use case and into a better one.",
      ],
    },
    dos: [
      "Ask about past behaviour and real examples, not hypothetical wishes.",
      "Write non-goals explicitly.",
      "Agree how success will be measured before building.",
    ],
    donts: [
      "Don't start building on the first meeting's request.",
      "Don't accept a success measure nobody can actually measure.",
    ],
    pitfalls: [
      "Choosing the flashiest use case instead of the most valuable feasible one.",
      "Discovering in week four that the needed data does not exist.",
    ],
    practice: [
      "Run discovery for an AI use case at a friend's company and write the scope document.",
      "Take a vague request (for example, use AI for support) and turn it into three scoped options.",
    ],
    next: ["prototypes-pocs-demos", "business-acumen", "evals"],
    books: [
      MOM_TEST,
      { title: "Continuous Discovery Habits", author: "Teresa Torres" },
      { title: "Software Requirements", author: "Karl Wiegers, Joy Beatty" },
    ],
    interview: [
      "A customer says they want an AI agent. What questions do you ask in the first meeting?",
      "How do you define success for an AI project before it starts?",
    ],
  },

  "ambiguity-high-agency": {
    summary:
      "Comfort with ambiguity means making progress when goals, data or ownership are unclear. High agency means you act on that: you find the information, make a reasonable call and move.",
    why: "FDE work rarely comes with a spec. Employers want people who turn a fuzzy situation into a plan and momentum without waiting to be told.",
    roadmap: {
      beginner: [
        "When stuck, write down what you know, what you do not and the cheapest way to find out.",
        "Make small decisions yourself and record why.",
      ],
      intermediate: [
        "Lead a project with unclear requirements by running quick experiments.",
        "Unblock yourself by finding the right person in an unfamiliar organisation.",
      ],
      advanced: [
        "Set direction for a team in an ambiguous engagement.",
        "Know which decisions are reversible (move fast) and which are not (slow down).",
      ],
    },
    dos: [
      "Make assumptions explicit and test the riskiest ones first.",
      "Prefer a quick prototype over a long debate.",
      "Share your plan so others can correct it early.",
    ],
    donts: [
      "Don't wait for perfect information.",
      "Don't confuse acting fast with acting alone on irreversible decisions.",
    ],
    pitfalls: [
      "Moving fast in the wrong direction without checking in.",
      "Analysis paralysis disguised as research.",
    ],
    practice: [
      "Pick an open-ended problem, give yourself one week, and ship the most useful thing you can.",
      "Keep a decision log for a month: decision, assumption, outcome.",
    ],
    next: ["end-to-end-ownership", "startup-founder-experience", "curiosity-fast-learning"],
    books: [{ title: "Thinking in Bets", author: "Annie Duke" }, LEAN_STARTUP],
    interview: [
      "Tell me about a time you had no clear instructions. What did you do first?",
      "How do you decide when you have enough information to act?",
    ],
  },

  travel: {
    summary:
      "Many FDE roles involve working on site with customers, often 25 to 50% of the time according to the postings. Being effective on the road means planning, staying productive and protecting your health.",
    why: "Being in the room builds trust and speeds up discovery and debugging in ways remote calls cannot. Employers want to know you are willing and able to travel without your work suffering.",
    roadmap: {
      beginner: [
        "Prepare a portable setup: laptop, access, offline docs and a checklist.",
        "Plan on-site visits with clear goals for each day.",
      ],
      intermediate: [
        "Run an on-site workshop or deployment week and write a trip report.",
        "Keep focus time while travelling.",
      ],
      advanced: [
        "Balance several customer sites and remote work sustainably.",
        "Use on-site time for the high-value conversations remote work cannot replace.",
      ],
    },
    dos: [
      "Set goals for every visit and share them with the customer beforehand.",
      "Confirm access (badges, VPN, accounts) before you travel.",
      "Write a short summary after each visit.",
    ],
    donts: [
      "Don't travel without a plan for the days on site.",
      "Don't neglect rest; tired engineers make costly mistakes.",
    ],
    pitfalls: [
      "Arriving on site without access to the systems you need.",
      "Losing deep-work time completely during heavy travel periods.",
    ],
    practice: [
      "Plan a mock on-site week for a deployment: agenda, prerequisites, risks and a trip-report template.",
      "Run one in-person workshop for a local team or community group.",
    ],
    next: ["customer-facing-time", "communication", "stakeholder-management"],
    books: [
      { title: "Deep Work", author: "Cal Newport" },
      { title: "Getting Things Done", author: "David Allen" },
    ],
    interview: [
      "How do you make an on-site visit with a customer as productive as possible?",
      "How do you stay effective when travelling half the time?",
    ],
  },

  "stakeholder-management": {
    summary:
      "Stakeholder management is knowing who cares about the project, what each needs, and keeping them informed and supportive: sponsors, users, IT, security, legal and your own team.",
    why: "AI deployments touch many teams, and any one of them can stall the project. FDEs who map and manage stakeholders avoid late surprises such as a security veto the week before launch.",
    roadmap: {
      beginner: [
        "Map the stakeholders of a project: their goals, influence and concerns.",
        "Send a regular, short status update to everyone involved.",
      ],
      intermediate: [
        "Run a steering meeting with decisions and owners.",
        "Bring security and legal in early and track their requirements.",
      ],
      advanced: [
        "Resolve conflicting priorities between powerful stakeholders.",
        "Keep a sponsor engaged through setbacks.",
      ],
    },
    dos: [
      "Identify the decision-maker and the blockers early.",
      "Tailor updates to each group's concerns.",
      "Escalate early, with options, not just problems.",
    ],
    donts: [
      "Don't surprise a stakeholder with bad news in a big meeting.",
      "Don't ignore quiet groups like security until the end.",
    ],
    pitfalls: [
      "Relying on one champion who then leaves.",
      "Agreeing different things with different people.",
    ],
    practice: [
      "Build a stakeholder map and communication plan for a real or sample AI deployment.",
      "Write a status update template with progress, risks, decisions needed and next steps.",
    ],
    next: ["executive-presence", "communication", "discovery-scoping"],
    books: [
      { title: "Getting to Yes", author: "Roger Fisher, William Ury, Bruce Patton" },
      CRUCIAL,
      { title: "Influence: The Psychology of Persuasion", author: "Robert B. Cialdini" },
    ],
    interview: [
      "The customer's security team blocks your deployment a week before launch. What do you do?",
      "How do you keep a busy executive sponsor engaged?",
    ],
  },

  "business-acumen": {
    summary:
      "Business acumen is understanding how the customer makes money, what costs them money and what their leaders are measured on, then tying each piece of technical work to one of those outcomes.",
    why: "Customers renew and expand when they see business results. FDEs who frame work in terms of hours saved, revenue or risk reduced get support, budget and better problems to solve.",
    roadmap: {
      beginner: [
        "For one project, write down the business outcome it serves and how to measure it.",
        "Learn to read a basic income statement.",
      ],
      intermediate: [
        "Estimate the value of an AI use case (time saved, errors avoided) with the customer's numbers.",
        "Report project progress in business terms.",
      ],
      advanced: [
        "Help a customer prioritise a portfolio of use cases by value and feasibility.",
        "Build a business case that a finance team accepts.",
      ],
    },
    dos: [
      "Ask how the customer measures success in their business.",
      "Use the customer's own numbers for value estimates.",
      "Connect every milestone to an outcome.",
    ],
    donts: [
      "Don't lead with technology when the customer cares about results.",
      "Don't invent impact numbers; measure them.",
    ],
    pitfalls: [
      "Optimising a technical metric that no business leader cares about.",
      "Value claims that cannot be checked.",
    ],
    practice: [
      "Write a one-page business case for an AI use case with assumptions and a measurement plan.",
      "Read the annual report of a public company and list three problems AI could address.",
    ],
    next: ["discovery-scoping", "executive-presence", "evals"],
    books: [
      { title: "The Personal MBA", author: "Josh Kaufman" },
      { title: "Good Strategy Bad Strategy", author: "Richard Rumelt" },
      { title: "Financial Intelligence", author: "Karen Berman, Joe Knight, John Case" },
    ],
    interview: [
      "How would you show a customer that your AI deployment was worth the money?",
      "Tell me about a time you changed a technical plan because of business priorities.",
    ],
  },

  "product-sense": {
    summary:
      "Product sense is noticing what customers struggle with in the field and turning it into clear, prioritised input for the product team: the problem, evidence, frequency and impact, not just feature requests.",
    why: "FDEs see the product meet reality. Bringing structured feedback back makes the product better for every customer and is one of the most valuable things the role does for the employer.",
    roadmap: {
      beginner: [
        "Log every workaround you build for a customer and why it was needed.",
        "Write a feedback note in problem, evidence, impact form.",
      ],
      intermediate: [
        "Spot patterns across several customers and present them to the product team.",
        "Turn a repeated workaround into a proposal for a product feature.",
      ],
      advanced: [
        "Influence a roadmap decision with field evidence.",
        "Build reusable components from customer work that become product.",
      ],
    },
    dos: [
      "Describe the problem, not just the requested solution.",
      "Bring evidence: how many customers, how often, what it costs them.",
      "Close the loop with the customer when feedback ships.",
    ],
    donts: [
      "Don't pass on every request as urgent.",
      "Don't promise customers features the product team has not committed to.",
    ],
    pitfalls: [
      "Building one-off custom code instead of improving the product.",
      "Feedback that is anecdotal and easy to ignore.",
    ],
    practice: [
      "Keep a field-notes log for a month and turn it into a prioritised product memo.",
      "Interview three users of a tool and write a problem statement for its makers.",
    ],
    next: ["customer-facing-time", "business-acumen", "technical-writing"],
    books: [
      { title: "Inspired", author: "Marty Cagan" },
      { title: "Escaping the Build Trap", author: "Melissa Perri" },
      MOM_TEST,
    ],
    interview: [
      "Tell me about customer feedback you brought to a product team that changed something.",
      "How do you decide which customer requests deserve to become product features?",
    ],
  },

  "prototypes-pocs-demos": {
    summary:
      "Prototypes, proofs of concept and demos are quick builds that answer a question or win a decision: does this work on our data, is it worth investing in, can users understand it?",
    why: "FDEs win and shape deals by showing working software on the customer's real problem. A focused POC with clear success criteria often decides whether a project goes ahead.",
    roadmap: {
      beginner: [
        "Build a demo on realistic data in a few days and present it.",
        "Prepare a demo script that tells a story about the customer's problem.",
      ],
      intermediate: [
        "Run a POC with written success criteria agreed with the customer.",
        "Handle live-demo failures gracefully with a backup plan.",
      ],
      advanced: [
        "Design POCs that reveal production risks early (data, security, scale).",
        "Turn a successful POC into a production plan with realistic estimates.",
      ],
    },
    dos: [
      "Agree success criteria before building.",
      "Use the customer's real data (with permission) whenever possible.",
      "Show the customer's problem being solved, not every feature.",
    ],
    donts: [
      "Don't let a demo hack become production code without a rebuild plan.",
      "Don't hide limitations; state them.",
    ],
    pitfalls: [
      "A POC that succeeds in a sandbox and fails on real data.",
      "Demos that impress but do not answer the buyer's question.",
    ],
    practice: [
      "Build a two-day POC for an AI use case with written success criteria and a results memo.",
      "Record a five-minute demo video that follows a user story.",
    ],
    next: ["discovery-scoping", "full-stack", "evals"],
    books: [
      { title: "Sprint", author: "Jake Knapp, John Zeratsky, Braden Kowitz" },
      { title: "Great Demo!", author: "Peter E. Cohan" },
      LEAN_STARTUP,
    ],
    interview: [
      "How do you scope a POC so its result actually helps the customer decide?",
      "Tell me about a demo that went wrong and what you did.",
    ],
  },

  "executive-presence": {
    summary:
      "Executive presence is reporting to senior decision-makers briefly and confidently: the status, the risks, the decision you need and your recommendation, with honest numbers.",
    why: "FDEs often present to the customer's leadership, who decide whether to expand, renew or stop. Short, clear, honest updates build the trust that keeps a deployment alive.",
    roadmap: {
      beginner: [
        "Write a five-sentence executive summary of a project.",
        "Practise answering do we proceed? in one minute.",
      ],
      intermediate: [
        "Present a quarterly review with outcomes, risks and asks.",
        "Deliver bad news to a senior audience with a recovery plan.",
      ],
      advanced: [
        "Shape a senior stakeholder's decision with evidence and a clear recommendation.",
        "Handle tough questions from executives without getting defensive.",
      ],
    },
    dos: [
      "Start with the recommendation or decision needed.",
      "Use one chart that tells the story.",
      "Be honest about risks and uncertainty.",
    ],
    donts: [
      "Don't walk executives through technical detail they did not ask for.",
      "Don't spin bad results.",
    ],
    pitfalls: [
      "Burying the ask at the end of a long deck.",
      "Answering a different question from the one asked.",
    ],
    practice: [
      "Turn a technical project report into a three-slide executive briefing.",
      "Practise a five-minute update with a friend who interrupts with hard questions.",
    ],
    next: ["communication", "business-acumen", "stakeholder-management"],
    books: [
      PYRAMID,
      { title: "Resonate", author: "Nancy Duarte" },
      { title: "Storytelling with Data", author: "Cole Nussbaumer Knaflic" },
    ],
    interview: [
      "You have five minutes with the customer's CEO. What do you tell them about the deployment?",
      "How do you present a result that is worse than the customer expected?",
    ],
  },

  "technical-writing": {
    summary:
      "Technical writing covers design docs, runbooks, integration guides, handover documents and decision records: writing that lets others understand, operate and extend your work without you.",
    why: "FDEs leave. Good documentation is how a deployment survives handover to the customer's team, and clear design docs speed up reviews and approvals.",
    roadmap: {
      beginner: [
        "Write a README that lets a stranger run your project in ten minutes.",
        "Write a short decision record for one technical choice.",
      ],
      intermediate: [
        "Write a design doc with options and trade-offs and get it reviewed.",
        "Write a runbook for operating a service you built.",
      ],
      advanced: [
        "Produce a full handover pack for a customer deployment.",
        "Set documentation standards for a team.",
      ],
    },
    dos: [
      "Write for a specific reader and task.",
      "Lead with what the reader needs to do or decide.",
      "Keep docs next to the code and update them with it.",
    ],
    donts: [
      "Don't write walls of text; use headings, lists and examples.",
      "Don't leave docs that describe how things used to work.",
    ],
    pitfalls: [
      "Documentation written once at the end and never tested.",
      "Assuming knowledge the reader does not have.",
    ],
    practice: [
      "Write a handover document for a project and have someone else follow it without your help.",
      "Rewrite a confusing open-source README and submit it as a pull request.",
    ],
    next: ["communication", "mentoring-enablement", "product-sense"],
    books: [
      {
        title: "Docs for Developers",
        author: "Jared Bhatti, Zachary Sarah Corleissen, Jen Lambourne, David Nunez, Heidi Waterhouse",
      },
      { title: "On Writing Well", author: "William Zinsser" },
      { title: "The Elements of Style", author: "William Strunk Jr., E. B. White" },
    ],
    interview: [
      "What goes into a good handover document for a customer's engineering team?",
      "Show me how you would structure a design doc for an AI integration.",
    ],
  },

  "startup-founder-experience": {
    summary:
      "Startup or founder experience means you have built something from zero with limited resources: picking problems, talking to users, shipping fast and doing whatever the business needed.",
    why: "FDE work feels like running a small startup inside each customer. Employers value people who are used to scarce resources, unclear direction and owning the result.",
    roadmap: {
      beginner: [
        "Build and launch a small product, even a tiny one, and find its first users.",
        "Talk to potential users before building.",
      ],
      intermediate: [
        "Join an early-stage startup or run a side business for several months.",
        "Make decisions about what not to build.",
      ],
      advanced: [
        "Own a product or company's growth, sales and engineering trade-offs.",
        "Hire or lead a small team.",
      ],
    },
    dos: [
      "Ship early and learn from real users.",
      "Focus on the one thing that matters most this week.",
      "Track a small set of numbers that show progress.",
    ],
    donts: ["Don't build for months without users.", "Don't romanticise chaos; build simple systems."],
    pitfalls: [
      "Building features instead of finding customers.",
      "Burning out by doing everything yourself.",
    ],
    practice: [
      "Launch a paid or free micro-product and write up what you learned from the first ten users.",
      "Join a hackathon and ship something a real person uses by the end.",
    ],
    next: ["ambiguity-high-agency", "end-to-end-ownership", "product-sense"],
    books: [
      { title: "The Hard Thing About Hard Things", author: "Ben Horowitz" },
      { title: "Zero to One", author: "Peter Thiel, Blake Masters" },
      LEAN_STARTUP,
    ],
    interview: [
      "What did you learn from building something from scratch that you would bring to a customer deployment?",
      "Tell me about a time you had to choose between speed and quality.",
    ],
  },

  "mentoring-enablement": {
    summary:
      "Enablement is teaching the customer's team to run, extend and own the solution: pairing, workshops, documentation and gradually handing over responsibility.",
    why: "A deployment only lasts if the customer can maintain it. FDEs who build the customer's capability leave behind a lasting result and a stronger relationship.",
    roadmap: {
      beginner: [
        "Pair with a less experienced engineer on a task and explain your reasoning.",
        "Run a short internal knowledge-sharing session.",
      ],
      intermediate: [
        "Run a hands-on workshop for a customer's team on your solution.",
        "Plan a handover with clear milestones for the customer taking ownership.",
      ],
      advanced: [
        "Build an enablement programme that scales across several customers.",
        "Mentor engineers to become independent owners.",
      ],
    },
    dos: [
      "Let them drive; you navigate.",
      "Teach the why behind decisions, not just the steps.",
      "Check understanding with real tasks.",
    ],
    donts: [
      "Don't stay the only person who can fix the system.",
      "Don't overload people with everything at once.",
    ],
    pitfalls: [
      "Handover done in one meeting at the end.",
      "Teaching tools without the reasoning, so the team cannot adapt.",
    ],
    practice: [
      "Run a two-hour workshop teaching a team to deploy and debug an AI feature you built.",
      "Mentor someone through their first open-source contribution.",
    ],
    next: ["technical-writing", "communication", "end-to-end-ownership"],
    books: [
      { title: "The Manager's Path", author: "Camille Fournier" },
      { title: "Radical Candor", author: "Kim Scott" },
      { title: "Teaching Tech Together", author: "Greg Wilson" },
    ],
    interview: [
      "How would you hand over an AI system to a customer team that has never run one?",
      "Tell me about someone you helped grow. What did you do?",
    ],
  },

  "domain-expertise": {
    summary:
      "Domain expertise is knowing how a particular industry works: its workflows, vocabulary, regulations and what success looks like there, for example finance, healthcare, government or manufacturing.",
    why: "Customers trust FDEs who understand their world. Domain knowledge speeds up discovery, avoids naive solutions and helps you spot which problems are worth solving.",
    roadmap: {
      beginner: [
        "Pick an industry you serve and learn its key terms, roles and regulations.",
        "Read a few industry publications or reports.",
      ],
      intermediate: [
        "Map a core workflow in the industry and where software fits.",
        "Learn the data standards and compliance rules that apply.",
      ],
      advanced: [
        "Advise customers on use cases specific to their industry.",
        "Build reusable industry-specific assets such as eval sets and templates.",
      ],
    },
    dos: [
      "Learn the customer's vocabulary and use it.",
      "Ask domain experts to check your assumptions.",
      "Respect industry rules from the start.",
    ],
    donts: [
      "Don't assume a generic solution fits a regulated industry.",
      "Don't pretend to expertise you do not have.",
    ],
    pitfalls: [
      "Building something technically good that breaks an industry rule.",
      "Misunderstanding key terms that mean something specific in the domain.",
    ],
    practice: [
      "Write a domain primer for one industry: key workflows, terms, rules and AI opportunities.",
      "Build an eval set with a domain expert for an industry-specific task.",
    ],
    next: ["discovery-scoping", "guardrails-ai-safety", "business-acumen"],
    books: [
      { title: "Domain-Driven Design", author: "Eric Evans" },
      { title: "Learning Domain-Driven Design", author: "Vlad Khononov" },
    ],
    interview: [
      "How do you get up to speed on a new industry before a customer engagement?",
      "Tell me about a time domain knowledge changed your technical approach.",
    ],
  },

  "employer-platform": {
    summary:
      "This means already knowing the hiring company's own product well: its features, APIs, limits and common deployment patterns, so you can deploy and extend it for customers quickly.",
    why: "It is a nice-to-have because companies expect to teach it, but candidates who have already built on the platform ramp up faster and can show real examples in interviews.",
    roadmap: {
      beginner: [
        "Sign up, complete the platform's tutorials and build something small with it.",
        "Read its documentation, API reference and changelog.",
      ],
      intermediate: [
        "Build a realistic project on the platform and note its strengths and limits.",
        "Join its community and answer questions.",
      ],
      advanced: [
        "Contribute examples, integrations or feedback to the platform.",
        "Know the common deployment patterns and pitfalls well enough to advise customers.",
      ],
    },
    dos: [
      "Build a real project on the platform before interviewing.",
      "Note the limitations as well as the features.",
      "Follow the platform's changelog and roadmap.",
    ],
    donts: [
      "Don't fake familiarity; interviewers can tell.",
      "Don't ignore competitors; customers will compare.",
    ],
    pitfalls: ["Knowing the marketing but not the APIs.", "Learning an outdated version of the platform."],
    practice: [
      "Build and publish a small project on the target company's platform with a short write-up.",
      "Write a comparison of the platform with one alternative for a specific use case.",
    ],
    next: ["curiosity-fast-learning", "public-work", "prototypes-pocs-demos"],
    books: [
      { title: "Ultralearning", author: "Scott H. Young" },
      { title: "Make It Stick", author: "Peter C. Brown, Henry L. Roediger III, Mark A. McDaniel" },
    ],
    interview: [
      "What have you built on our platform, and what would you improve?",
      "How would you deploy our product for a customer with strict security requirements?",
    ],
  },

  "curiosity-fast-learning": {
    summary:
      "Curiosity is wanting to understand how things work; fast learning is turning that into competence quickly in new tools, codebases and domains.",
    why: "Every customer brings a new stack, domain and set of problems, and AI tooling changes monthly. FDEs who learn fast stay useful in every new engagement.",
    roadmap: {
      beginner: [
        "Learn one new tool a month by building something small with it.",
        "Keep notes on what you learn and review them.",
      ],
      intermediate: [
        "Learn an unfamiliar codebase or domain in a week with a structured plan.",
        "Teach what you learned to someone else.",
      ],
      advanced: [
        "Build a personal system for learning that you can apply to any new area.",
        "Stay current in AI without chasing every trend.",
      ],
    },
    dos: [
      "Learn by building, not only reading.",
      "Ask why until you understand the mechanism.",
      "Use spaced practice for things you need to remember.",
    ],
    donts: [
      "Don't collect tutorials without finishing projects.",
      "Don't chase every new tool; learn the fundamentals underneath.",
    ],
    pitfalls: [
      "Shallow familiarity with many tools and depth in none.",
      "Forgetting what you learned because nothing was written down.",
    ],
    practice: [
      "Pick an unfamiliar technology and ship a working project in seven days, writing notes each day.",
      "Explain a new AI paper or tool in a short post.",
    ],
    next: ["working-in-unfamiliar-code", "public-work", "other-languages"],
    books: [
      { title: "Ultralearning", author: "Scott H. Young" },
      { title: "Make It Stick", author: "Peter C. Brown, Henry L. Roediger III, Mark A. McDaniel" },
      { title: "A Mind for Numbers", author: "Barbara Oakley" },
    ],
    interview: [
      "Tell me about something you learned quickly for a project. How did you do it?",
      "How do you keep up with changes in AI tooling?",
    ],
  },

  "public-work": {
    summary:
      "Public work is anything others can see: open-source code, blog posts, talks, demos and write-ups. It shows how you think and what you can build.",
    why: "Postings look for proof. Public work lets employers and customers see your skills before meeting you, and writing about your work sharpens your thinking and communication.",
    roadmap: {
      beginner: [
        "Publish one project with a clear README.",
        "Write a short post about something you learned.",
      ],
      intermediate: [
        "Contribute to an open-source project you use.",
        "Write a technical case study of a project with results.",
      ],
      advanced: [
        "Give a talk at a meetup or conference.",
        "Maintain a project or a regular writing habit that others follow.",
      ],
    },
    dos: [
      "Show finished, working things over perfect plans.",
      "Explain the problem and the result, not only the code.",
      "Respect confidentiality; never publish customer details.",
    ],
    donts: [
      "Don't publish anything that exposes customer data or internal code.",
      "Don't wait until something is perfect.",
    ],
    pitfalls: [
      "Many unfinished repositories and no clear showcase.",
      "Posts that explain tools but not decisions and results.",
    ],
    practice: [
      "Write up your best project as a case study: problem, approach, trade-offs, result.",
      "Give a ten-minute lightning talk at a local meetup.",
    ],
    next: ["technical-writing", "curiosity-fast-learning", "communication"],
    books: [
      { title: "Show Your Work!", author: "Austin Kleon" },
      { title: "Working in Public", author: "Nadia Eghbal" },
      { title: "Producing Open Source Software", author: "Karl Fogel" },
    ],
    interview: [
      "Walk me through a project you have published. What would you do differently?",
      "How do you share what you learn with others?",
    ],
  },
};
