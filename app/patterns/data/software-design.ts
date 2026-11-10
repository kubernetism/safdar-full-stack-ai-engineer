import { code, e, n } from "../dsl";
import type { Category } from "../types";

export const softwareDesign: Category = {
  slug: "software-design",
  name: "Software design patterns",
  blurb: "The Gang of Four essentials that keep showing up in everyday code, shown in TypeScript.",
  intro:
    "Design patterns are named solutions to recurring design problems in object-oriented code. They are a shared vocabulary, not a checklist: use one when the problem it solves is actually in front of you. Examples are in TypeScript.",
  patterns: [
    {
      slug: "strategy",
      name: "Strategy",
      summary: "Put interchangeable algorithms behind one interface and choose between them at run time.",
      definition:
        "A family of algorithms is defined behind a common interface so the code that uses them (the context) can switch implementations without knowing their details. It replaces long if/else or switch blocks over behaviour.",
      useWhen: [
        "Several variants of the same behaviour exist, such as pricing rules, retry policies or LLM providers.",
        "The choice depends on configuration or the request.",
      ],
      pros: [
        "Add a variant without touching existing code.",
        "Each strategy is small and testable on its own.",
      ],
      cons: [
        "More types for what might be a three-line conditional.",
        "Callers must know which strategy to choose.",
      ],
      example:
        "A chat service picks an Anthropic, OpenAI or local model strategy from configuration; the rest of the code calls complete().",
      code: {
        lang: "ts",
        file: "strategy.ts",
        source: code(`
          interface ModelClient {
            complete(prompt: string): Promise<string>;
          }

          class AnthropicClient implements ModelClient { async complete(p: string) { /* ... */ return ""; } }
          class LocalClient implements ModelClient { async complete(p: string) { /* ... */ return ""; } }

          const clients: Record<string, ModelClient> = { anthropic: new AnthropicClient(), local: new LocalClient() };
          const answer = await clients[config.provider].complete(prompt);
        `),
      },
      diagram: {
        title:
          "Strategy: a context holds a reference to a strategy interface, implemented by two concrete strategies.",
        h: 170,
        nodes: [
          n("ctx", "Context", 70, 50, "accent"),
          n("i", "«interface»\nStrategy", 260, 50, "decision"),
          n("a", "StrategyA", 190, 140),
          n("b", "StrategyB", 330, 140),
        ],
        edges: [
          e("ctx", "i", { label: "uses" }),
          e("a", "i", { dashed: true }),
          e("b", "i", { dashed: true }),
        ],
      },
    },
    {
      slug: "observer",
      name: "Observer",
      summary:
        "Let objects subscribe to events from a subject and be notified automatically when it changes.",
      definition:
        "A subject keeps a list of subscribers and notifies each one when something happens. Subscribers can be added and removed at run time, and the subject does not depend on their concrete types.",
      useWhen: [
        "Several parts of the system react to the same event.",
        "You want to add reactions without editing the code that raises the event.",
      ],
      pros: ["Loose coupling between the event source and the reactions.", "Easy to add new listeners."],
      cons: [
        "Hard to follow the flow when many listeners chain together.",
        "Forgotten subscriptions leak memory.",
      ],
      example:
        "When an order is paid, separate listeners send the receipt, update stock and record analytics.",
      code: {
        lang: "ts",
        file: "observer.ts",
        source: code(`
          type Listener<T> = (event: T) => void;

          class Emitter<T> {
            private listeners = new Set<Listener<T>>();
            subscribe(fn: Listener<T>) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
            emit(event: T) { this.listeners.forEach((fn) => fn(event)); }
          }

          const orderPaid = new Emitter<{ orderId: string }>();
          const stop = orderPaid.subscribe(({ orderId }) => sendReceipt(orderId));
        `),
      },
      diagram: {
        title: "Observer: a subject notifies three subscribed observers when an event happens.",
        h: 180,
        nodes: [
          n("s", "Subject", 90, 90, "accent"),
          n("o1", "Receipt", 340, 32),
          n("o2", "Stock", 340, 90),
          n("o3", "Analytics", 340, 148),
        ],
        edges: [e("s", "o1", { label: "notify" }), e("s", "o2"), e("s", "o3")],
      },
    },
    {
      slug: "adapter",
      name: "Adapter",
      summary: "Wrap an incompatible interface so it looks like the one your code expects.",
      definition:
        "An adapter sits between your code and a class or service with a different interface, translating calls and data in both directions. Your code depends on the interface it wants, not on the third-party shape.",
      useWhen: [
        "Integrating a third-party SDK or legacy system whose API does not match yours.",
        "You want to swap vendors later without rewriting callers.",
      ],
      pros: ["Isolates vendor quirks in one place.", "Makes the dependency easy to fake in tests."],
      cons: ["One more layer to maintain.", "A leaky adapter that exposes vendor types defeats the purpose."],
      example:
        "A PaymentGateway interface is implemented by a Stripe adapter that converts amounts to minor units and maps errors.",
      code: {
        lang: "ts",
        file: "adapter.ts",
        source: code(`
          interface PaymentGateway {
            charge(amountPkr: number, customerId: string): Promise<{ ok: boolean; id: string }>;
          }

          class StripeAdapter implements PaymentGateway {
            constructor(private stripe: Stripe) {}
            async charge(amountPkr: number, customerId: string) {
              const pi = await this.stripe.paymentIntents.create({ amount: amountPkr * 100, currency: "pkr", customer: customerId });
              return { ok: pi.status === "succeeded", id: pi.id };
            }
          }
        `),
      },
      diagram: {
        title:
          "Adapter: the client calls the target interface; the adapter translates the call into the incompatible third-party API.",
        h: 130,
        nodes: [
          n("c", "Client", 44, 65, "user"),
          n("t", "Target\ninterface", 155, 65, "decision"),
          n("ad", "Adapter", 270, 65, "accent"),
          n("x", "Vendor SDK", 415, 65, "ghost"),
        ],
        edges: [e("c", "t"), e("t", "ad", { dashed: true }), e("ad", "x", { label: "maps" })],
      },
    },
    {
      slug: "decorator",
      name: "Decorator",
      summary:
        "Wrap an object to add behaviour (logging, caching, retries) while keeping the same interface.",
      definition:
        "A decorator implements the same interface as the object it wraps and forwards calls to it, adding behaviour before or after. Decorators can be stacked, so features combine without subclass explosions.",
      useWhen: [
        "You want to add cross-cutting behaviour such as caching, metrics or retries to some instances only.",
        "Subclassing for every combination would multiply classes.",
      ],
      pros: [
        "Behaviours compose and can be added at run time.",
        "The wrapped class stays focused on its job.",
      ],
      cons: [
        "Deep stacks are hard to debug.",
        "Order matters, for example cache outside retry versus inside.",
      ],
      example:
        "A ModelClient is wrapped first with caching, then with retries, then with metrics, and callers never notice.",
      code: {
        lang: "ts",
        file: "decorator.ts",
        source: code(`
          class CachedClient implements ModelClient {
            private cache = new Map<string, string>();
            constructor(private inner: ModelClient) {}
            async complete(prompt: string) {
              const hit = this.cache.get(prompt);
              if (hit) return hit;
              const out = await this.inner.complete(prompt);
              this.cache.set(prompt, out);
              return out;
            }
          }

          const client = new MetricsClient(new CachedClient(new RetryingClient(new AnthropicClient())));
        `),
      },
      diagram: {
        title:
          "Decorator: metrics wraps cache, which wraps retry, which wraps the real client; all share one interface.",
        h: 150,
        nodes: [
          n("m", "Metrics", 60, 75),
          n("c", "Cache", 170, 75),
          n("r", "Retry", 280, 75),
          n("real", "Real client", 410, 75, "accent"),
        ],
        edges: [e("m", "c"), e("c", "r"), e("r", "real")],
      },
    },
    {
      slug: "factory-method",
      name: "Factory method",
      summary: "Create objects through a method or function so callers do not depend on concrete classes.",
      definition:
        "Object creation is moved into a factory method that decides which concrete class to instantiate. Callers ask for “a notifier” or “a store” and receive the right implementation for the context.",
      useWhen: [
        "The concrete type depends on configuration, environment or input.",
        "Construction is complex and should live in one place.",
      ],
      pros: ["Callers depend on interfaces only.", "One place to change how objects are built."],
      cons: [
        "Indirection for simple cases where new would do.",
        "Factories can grow into large switch statements.",
      ],
      example:
        "createStorage() returns local disk storage in development and Vercel Blob storage in production.",
      code: {
        lang: "ts",
        file: "factory.ts",
        source: code(`
          interface FileStore { put(key: string, data: Blob): Promise<string>; }

          function createStorage(env: "development" | "production"): FileStore {
            switch (env) {
              case "development": return new DiskStore("./uploads");
              case "production": return new BlobStore(process.env.BLOB_TOKEN!);
            }
          }
        `),
      },
      diagram: {
        title:
          "Factory method: the client asks a factory for a product; the factory returns one of two concrete products.",
        h: 170,
        nodes: [
          n("c", "Client", 50, 85, "user"),
          n("f", "createStorage()", 200, 85, "accent"),
          n("a", "DiskStore", 390, 40),
          n("b", "BlobStore", 390, 130),
        ],
        edges: [e("c", "f", { label: "env" }), e("f", "a", { label: "dev" }), e("f", "b", { label: "prod" })],
      },
    },
    {
      slug: "facade",
      name: "Facade",
      summary: "Offer one simple entry point over a complicated subsystem.",
      definition:
        "A facade exposes a small, task-oriented API and coordinates the many classes behind it. Callers do common things easily, and the subsystem remains available for advanced use.",
      useWhen: [
        "A workflow touches several services in a fixed order.",
        "You want to hide a messy legacy area behind a clean boundary.",
      ],
      pros: [
        "Simpler call sites and fewer dependencies.",
        "A natural seam for testing and later refactoring.",
      ],
      cons: [
        "Can become a god object if everything is pushed into it.",
        "Hides detail some callers may need.",
      ],
      example:
        "checkout.placeOrder(cart) validates stock, charges payment, creates the order and sends the receipt.",
      code: {
        lang: "ts",
        file: "facade.ts",
        source: code(`
          class Checkout {
            constructor(private stock: Stock, private pay: PaymentGateway, private orders: Orders, private mail: Mailer) {}

            async placeOrder(cart: Cart, customerId: string) {
              await this.stock.reserve(cart.items);
              const charge = await this.pay.charge(cart.totalPkr, customerId);
              const order = await this.orders.create(cart, charge.id);
              await this.mail.sendReceipt(order);
              return order;
            }
          }
        `),
      },
      diagram: {
        title:
          "Facade: the client calls one facade, which coordinates stock, payment, orders and mail subsystems.",
        h: 190,
        nodes: [
          n("c", "Client", 50, 95, "user"),
          n("f", "Checkout", 180, 95, "accent"),
          n("s1", "Stock", 380, 28),
          n("s2", "Payment", 380, 73),
          n("s3", "Orders", 380, 118),
          n("s4", "Mail", 380, 163),
        ],
        edges: [e("c", "f"), e("f", "s1"), e("f", "s2"), e("f", "s3"), e("f", "s4")],
      },
    },
    {
      slug: "command",
      name: "Command",
      summary: "Turn a request into an object so it can be queued, logged, retried or undone.",
      definition:
        "Each action is wrapped in a command object holding everything needed to run it. An invoker executes commands without knowing what they do, which enables queues, history, undo and replay.",
      useWhen: ["Actions need to be queued, scheduled, retried or audited.", "Undo or redo is a feature."],
      pros: ["Uniform handling of very different actions.", "Natural fit for job queues and audit logs."],
      cons: [
        "A class or object per action adds boilerplate.",
        "Undo is only as good as each command's reverse logic.",
      ],
      example: "An editor records every change as a command so Ctrl+Z replays the inverse of the last one.",
      code: {
        lang: "ts",
        file: "command.ts",
        source: code(`
          interface Command { run(): void; undo(): void; }

          class RenameCommand implements Command {
            private before = "";
            constructor(private doc: Doc, private title: string) {}
            run() { this.before = this.doc.title; this.doc.title = this.title; }
            undo() { this.doc.title = this.before; }
          }

          const history: Command[] = [];
          function execute(cmd: Command) { cmd.run(); history.push(cmd); }
          function undo() { history.pop()?.undo(); }
        `),
      },
      diagram: {
        title:
          "Command: an invoker runs command objects against a receiver and keeps them in a history for undo.",
        h: 170,
        nodes: [
          n("inv", "Invoker", 60, 60, "user"),
          n("cmd", "Command", 210, 60, "accent"),
          n("rec", "Receiver", 380, 60),
          n("h", "History", 210, 140, "store"),
        ],
        edges: [
          e("inv", "cmd", { label: "run" }),
          e("cmd", "rec"),
          e("cmd", "h", { dashed: true, label: "undo stack" }),
        ],
      },
    },
    {
      slug: "builder",
      name: "Builder",
      summary:
        "Build a complex object step by step with readable calls instead of a constructor with many arguments.",
      definition:
        "A builder collects configuration through named steps and produces the finished object at the end, validating it once. It avoids constructors with long, confusing parameter lists.",
      useWhen: [
        "Objects have many optional parts, such as HTTP requests, queries or prompts.",
        "You want the result validated in one place before use.",
      ],
      pros: ["Readable, self-documenting construction.", "Invalid combinations are caught at build()."],
      cons: [
        "More code than an options object, which is often enough in TypeScript.",
        "Mutable builders can be misused if shared.",
      ],
      example:
        "A prompt builder adds a system role, few-shot examples and context documents, then checks the total token budget.",
      code: {
        lang: "ts",
        file: "builder.ts",
        source: code(`
          const prompt = new PromptBuilder()
            .system("You are a careful support assistant.")
            .examples(fewShots)
            .context(retrievedDocs)
            .user(question)
            .maxTokens(8_000)
            .build();            // throws if the token budget is exceeded
        `),
      },
      diagram: {
        title:
          "Builder: a series of builder steps adds parts, and build() validates and returns the finished object.",
        h: 130,
        nodes: [
          n("s1", ".system()", 60, 65),
          n("s2", ".context()", 180, 65),
          n("s3", ".user()", 295, 65),
          n("b", "build()", 410, 65, "accent"),
        ],
        edges: [e("s1", "s2"), e("s2", "s3"), e("s3", "b")],
      },
    },
  ],
  reading: [
    {
      title: "Design patterns catalog",
      source: "Refactoring.Guru",
      href: "https://refactoring.guru/design-patterns/catalog",
    },
    {
      title: "Strategy",
      source: "Refactoring.Guru",
      href: "https://refactoring.guru/design-patterns/strategy",
    },
    {
      title: "Observer",
      source: "Refactoring.Guru",
      href: "https://refactoring.guru/design-patterns/observer",
    },
    {
      title: "Adapter",
      source: "Refactoring.Guru",
      href: "https://refactoring.guru/design-patterns/adapter",
    },
    {
      title: "Decorator",
      source: "Refactoring.Guru",
      href: "https://refactoring.guru/design-patterns/decorator",
    },
    {
      title: "Factory method",
      source: "Refactoring.Guru",
      href: "https://refactoring.guru/design-patterns/factory-method",
    },
    { title: "Facade", source: "Refactoring.Guru", href: "https://refactoring.guru/design-patterns/facade" },
    {
      title: "Command",
      source: "Refactoring.Guru",
      href: "https://refactoring.guru/design-patterns/command",
    },
    {
      title: "Builder",
      source: "Refactoring.Guru",
      href: "https://refactoring.guru/design-patterns/builder",
    },
    {
      title: "Catalog of patterns of enterprise application architecture",
      source: "Martin Fowler",
      href: "https://martinfowler.com/eaaCatalog/",
    },
  ],
};
