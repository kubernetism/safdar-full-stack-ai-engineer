import { code, e, n } from "../dsl";
import type { Category } from "../types";

export const systemDesign: Category = {
  slug: "system-design",
  name: "System design",
  blurb: "Classic distributed-systems patterns for speed, scale and resilience.",
  intro:
    "The patterns behind most production backends. Each one fixes a specific pressure (slow reads, traffic spikes, too much data, flaky dependencies) and adds a cost in consistency or complexity, so reach for them when you can measure the problem.",
  patterns: [
    {
      slug: "cache-aside",
      name: "Cache-aside",
      summary: "Read from the cache; on a miss load from the database, store it in the cache, and return it.",
      definition:
        "The application owns the cache. Reads check the cache first and fall back to the data store on a miss, writing the result into the cache with a time-to-live. Writes update the store and invalidate the cached entry.",
      useWhen: [
        "Reads far outnumber writes and the same items are read repeatedly.",
        "Slightly stale data is acceptable for the TTL period.",
      ],
      pros: ["Large latency and load reductions for hot data.", "Only requested data is cached."],
      cons: [
        "Stale reads until the TTL expires or invalidation runs.",
        "A cold or flushed cache sends a burst of traffic to the database.",
      ],
      example: "Product pages read from Redis with a 5-minute TTL; editing a product deletes its cache key.",
      code: {
        lang: "python",
        file: "cache_aside.py",
        source: code(`
          def get_product(pid: str) -> Product:
              if (hit := cache.get(f"product:{pid}")) is not None:
                  return hit
              product = db.fetch_product(pid)
              cache.set(f"product:{pid}", product, ttl=300)
              return product

          def update_product(pid: str, data: dict) -> None:
              db.update_product(pid, data)
              cache.delete(f"product:{pid}")   # invalidate, don't update
        `),
      },
      diagram: {
        title:
          "Cache-aside: the app reads the cache; on a miss it reads the database and writes the value into the cache.",
        h: 170,
        nodes: [
          n("app", "App", 70, 85, "accent"),
          n("cache", "Cache", 260, 40, "store"),
          n("db", "Database", 260, 135, "store"),
        ],
        edges: [
          e("app", "cache", { label: "1 get" }),
          e("app", "db", { label: "2 miss: read", dashed: true }),
          e("app", "cache", { curve: -40, label: "3 set", dashed: true }),
        ],
      },
    },
    {
      slug: "queue-load-leveling",
      name: "Queue-based load leveling",
      summary:
        "Put a queue between producers and workers so spikes wait in line instead of overwhelming the service.",
      definition:
        "Requests are written to a durable queue and workers consume them at a steady rate. The queue absorbs bursts, decouples the two sides and lets you scale workers on queue depth.",
      useWhen: [
        "Traffic is spiky but the work can finish a little later.",
        "The downstream service has a fixed capacity or rate limit, such as an LLM API.",
      ],
      pros: [
        "Smooths spikes and protects downstream services.",
        "Producers stay fast; failed jobs can be retried.",
      ],
      cons: [
        "Work becomes asynchronous; users need status updates.",
        "Needs idempotent consumers and a dead-letter queue.",
      ],
      example:
        "Document uploads enqueue an embedding job; four workers drain the queue within the LLM provider's rate limit.",
      code: {
        lang: "python",
        file: "worker.py",
        source: code(`
          # producer: return immediately
          queue.send({"doc_id": doc.id}, dedupe_id=doc.id)

          # consumer: steady pace, safe to retry
          for msg in queue.receive(batch=10):
              if not already_processed(msg.body["doc_id"]):
                  embed_and_index(msg.body["doc_id"])
              msg.ack()
        `),
      },
      diagram: {
        title:
          "Queue-based load leveling: producers write spiky traffic to a queue and workers consume it at a steady rate.",
        h: 170,
        nodes: [
          n("p1", "Producer", 60, 45),
          n("p2", "Producer", 60, 125),
          n("q", "Queue", 230, 85, "store"),
          n("w1", "Worker", 400, 45, "accent"),
          n("w2", "Worker", 400, 125, "accent"),
        ],
        edges: [
          e("p1", "q", { label: "burst" }),
          e("p2", "q"),
          e("q", "w1", { label: "steady" }),
          e("q", "w2"),
        ],
      },
    },
    {
      slug: "sharding",
      name: "Sharding",
      summary: "Split data across several databases by a shard key so each holds and serves only part of it.",
      definition:
        "Data is partitioned horizontally: a shard key (such as tenant ID) decides which database holds each row. Common strategies are hash-based, range-based and lookup (directory) sharding.",
      useWhen: [
        "One database can no longer hold the data or handle the write load.",
        "Most queries include a natural key, such as tenant or user, that can stay on one shard.",
      ],
      pros: [
        "Near-linear scaling of storage and writes.",
        "Smaller blast radius: one shard failing affects a slice of users.",
      ],
      cons: [
        "Cross-shard queries and transactions become hard.",
        "A poor key creates hot shards; resharding is painful.",
      ],
      example:
        "A multi-tenant SaaS hashes tenant_id to one of 16 Postgres shards; every query is scoped by tenant.",
      code: {
        lang: "python",
        file: "shard.py",
        source: code(`
          SHARDS = [connect(url) for url in SHARD_URLS]   # 16 databases

          def shard_for(tenant_id: str):
              return SHARDS[xxhash64(tenant_id) % len(SHARDS)]

          orders = shard_for(tenant).query("select * from orders where tenant_id = %s", [tenant])
        `),
      },
      diagram: {
        title:
          "Sharding: a router hashes the shard key and sends each request to one of three database shards.",
        h: 180,
        nodes: [
          n("app", "App", 50, 90, "user"),
          n("r", "hash(key)", 180, 90, "decision"),
          n("s1", "Shard A", 380, 32, "store"),
          n("s2", "Shard B", 380, 90, "store"),
          n("s3", "Shard C", 380, 148, "store"),
        ],
        edges: [e("app", "r"), e("r", "s1"), e("r", "s2"), e("r", "s3")],
      },
    },
    {
      slug: "cqrs",
      name: "CQRS",
      summary: "Use separate models (and often stores) for writing data and for reading it.",
      definition:
        "Command Query Responsibility Segregation splits the write side, which validates commands and enforces business rules, from the read side, which serves queries from views shaped for the screens that use them. The read side is updated from the write side, often through events.",
      useWhen: [
        "Read and write workloads are very different in shape or scale.",
        "Complex domains where one model for both becomes tangled.",
      ],
      pros: ["Each side is optimised and scaled independently.", "Read views can be rebuilt from history."],
      cons: [
        "Eventual consistency between the sides.",
        "Real added complexity; most systems do not need it.",
      ],
      example:
        "An order service writes to normalised Postgres tables; an event updates a denormalised “my orders” view read by the dashboard.",
      diagram: {
        title:
          "CQRS: commands go to a write model and database; events update a read model that serves queries.",
        h: 180,
        nodes: [
          n("ui", "Client", 50, 90, "user"),
          n("cmd", "Command\nmodel", 190, 40, "accent"),
          n("w", "Write DB", 360, 40, "store"),
          n("qry", "Query\nmodel", 190, 140),
          n("r", "Read view", 360, 140, "store"),
        ],
        edges: [
          e("ui", "cmd", { label: "commands" }),
          e("cmd", "w"),
          e("w", "r", { dashed: true, label: "events" }),
          e("qry", "r", { both: true }),
          e("ui", "qry", { label: "queries" }),
        ],
      },
      code: {
        lang: "python",
        file: "cqrs.py",
        source: code(`
          def place_order(cmd: PlaceOrder) -> None:          # write side
              order = Order.create(cmd)                       # business rules here
              repo.save(order)
              bus.publish(OrderPlaced(order.id, order.customer_id, order.total))

          @bus.subscribe(OrderPlaced)                         # read side
          def project(evt: OrderPlaced) -> None:
              read_db.upsert("my_orders", evt.order_id, customer=evt.customer_id, total=evt.total)
        `),
      },
    },
    {
      slug: "rate-limiting",
      name: "Rate limiting (token bucket)",
      summary:
        "Allow each client a steady rate of requests with a small burst allowance; reject or delay the rest.",
      definition:
        "A token bucket refills at a fixed rate up to a maximum size. Each request spends a token; when the bucket is empty the request is rejected (HTTP 429) or queued. Limits can apply per user, API key, IP or route.",
      useWhen: [
        "Public APIs, login endpoints and anything that calls a costly downstream such as an LLM.",
        "You need fairness between tenants.",
      ],
      pros: [
        "Protects capacity and budgets from abuse and runaway clients.",
        "Bursts are allowed up to the bucket size.",
      ],
      cons: [
        "Distributed limits need a shared store such as Redis.",
        "Limits set too tight hurt real users.",
      ],
      example:
        "Each user may make 20 chat requests per minute with bursts of 5; extra requests get 429 with a Retry-After header.",
      code: {
        lang: "python",
        file: "token_bucket.py",
        source: code(`
          def allow(key: str, rate: float = 20 / 60, burst: int = 5) -> bool:
              tokens, last = store.get(key, (burst, now()))
              tokens = min(burst, tokens + (now() - last) * rate)   # refill
              if tokens < 1:
                  return False                                      # -> 429 + Retry-After
              store.set(key, (tokens - 1, now()))
              return True
        `),
      },
      diagram: {
        title:
          "Rate limiting: a token bucket refills at a fixed rate; requests spend tokens and are rejected when the bucket is empty.",
        h: 180,
        nodes: [
          n("refill", "refill 20/min", 230, 26, "ghost"),
          n("req", "Requests", 56, 100, "user"),
          n("bucket", "Bucket 3/5", 230, 100, "store"),
          n("ok", "Allowed", 410, 60, "accent"),
          n("no", "429", 410, 140),
        ],
        edges: [
          e("refill", "bucket", { dashed: true }),
          e("req", "bucket"),
          e("bucket", "ok", { label: "token" }),
          e("bucket", "no", { label: "empty" }),
        ],
      },
    },
    {
      slug: "circuit-breaker",
      name: "Circuit breaker",
      summary:
        "After repeated failures, stop calling a dependency for a while and fail fast; probe before resuming.",
      definition:
        "A breaker wraps calls to a remote service. In the closed state calls pass through; too many failures open it so calls fail immediately; after a timeout it goes half-open and lets a trial call through to decide whether to close again.",
      useWhen: [
        "A dependency can fail or slow down, and waiting on it ties up your threads or users.",
        "You have a sensible fallback, such as cached data, a degraded mode or a clear error.",
      ],
      pros: [
        "Prevents cascading failures and gives the dependency room to recover.",
        "Fast, predictable errors instead of timeouts.",
      ],
      cons: ["Thresholds need tuning per dependency.", "A breaker per instance sees only its own traffic."],
      example:
        "If the recommendations API fails 5 times in 30 seconds, the shop shows bestsellers from cache for 60 seconds.",
      code: {
        lang: "python",
        file: "breaker.py",
        source: code(`
          breaker = CircuitBreaker(failure_threshold=5, window_s=30, reset_timeout_s=60)

          def recommendations(user_id):
              try:
                  return breaker.call(reco_api.get, user_id, timeout=0.8)
              except (CircuitOpen, TimeoutError):
                  return cache.get("bestsellers")   # fallback
        `),
      },
      diagram: {
        title:
          "Circuit breaker states: closed to open after failures, open to half-open after a timeout, half-open back to closed on success or open on failure.",
        h: 180,
        nodes: [
          n("closed", "Closed", 80, 60, "accent"),
          n("open", "Open", 400, 60),
          n("half", "Half-open", 240, 150, "decision"),
        ],
        edges: [
          e("closed", "open", { label: "N failures" }),
          e("open", "half", { label: "timeout" }),
          e("half", "closed", { label: "success" }),
          e("half", "open", { curve: -30, dashed: true, label: "fail" }),
        ],
      },
    },
    {
      slug: "retry-backoff",
      name: "Retry with backoff and jitter",
      summary:
        "Retry transient failures after growing, randomised delays, and only for operations that are safe to repeat.",
      definition:
        "When a call fails with a transient error (a timeout, 503 or 429), wait and try again, doubling the delay each time and adding random jitter so many clients do not retry in sync. Cap the attempts and only retry idempotent operations, or use an idempotency key.",
      useWhen: [
        "Network calls, cloud APIs and LLM providers that sometimes fail briefly.",
        "The operation is idempotent or carries an idempotency key.",
      ],
      pros: ["Hides brief glitches from users.", "Jitter avoids synchronised retry storms."],
      cons: [
        "Retries multiply load on a struggling service; pair with a circuit breaker.",
        "Retrying non-idempotent writes can duplicate them.",
      ],
      example:
        "An LLM call retries on 429 and 529 errors up to 4 times, waiting about 0.5 s, 1 s, 2 s and 4 s plus jitter.",
      code: {
        lang: "python",
        file: "retry.py",
        source: code(`
          def with_retry(fn, attempts=4, base=0.5):
              for i in range(attempts):
                  try:
                      return fn()
                  except TransientError:
                      if i == attempts - 1:
                          raise
                      time.sleep(base * 2**i + random.uniform(0, base))   # backoff + jitter
        `),
      },
      diagram: {
        title:
          "Retry with backoff: each failed attempt waits longer before the next, with jitter, until success or the attempt limit.",
        h: 150,
        nodes: [
          n("a1", "try 1", 50, 60),
          n("a2", "try 2", 170, 60),
          n("a3", "try 3", 300, 60),
          n("ok", "OK", 430, 60, "accent"),
          n("dlq", "give up", 300, 128, "ghost"),
        ],
        edges: [
          e("a1", "a2", { label: "0.5s" }),
          e("a2", "a3", { label: "1s+j" }),
          e("a3", "ok"),
          e("a3", "dlq", { dashed: true, label: "max" }),
        ],
      },
    },
  ],
  reading: [
    {
      title: "Cloud design patterns",
      source: "Microsoft Azure Architecture Center",
      href: "https://learn.microsoft.com/en-us/azure/architecture/patterns/",
    },
    {
      title: "Cache-aside pattern",
      source: "Microsoft Azure Architecture Center",
      href: "https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside",
    },
    {
      title: "Queue-based load leveling pattern",
      source: "Microsoft Azure Architecture Center",
      href: "https://learn.microsoft.com/en-us/azure/architecture/patterns/queue-based-load-leveling",
    },
    {
      title: "Sharding pattern",
      source: "Microsoft Azure Architecture Center",
      href: "https://learn.microsoft.com/en-us/azure/architecture/patterns/sharding",
    },
    { title: "CQRS", source: "Martin Fowler", href: "https://martinfowler.com/bliki/CQRS.html" },
    {
      title: "Rate limiting pattern",
      source: "Microsoft Azure Architecture Center",
      href: "https://learn.microsoft.com/en-us/azure/architecture/patterns/rate-limiting-pattern",
    },
    {
      title: "CircuitBreaker",
      source: "Martin Fowler",
      href: "https://martinfowler.com/bliki/CircuitBreaker.html",
    },
    {
      title: "Retry pattern",
      source: "Microsoft Azure Architecture Center",
      href: "https://learn.microsoft.com/en-us/azure/architecture/patterns/retry",
    },
    {
      title: "The Amazon Builders' Library",
      source: "AWS",
      href: "https://builder.aws.com/learn/topics/builders-library",
    },
  ],
};
