import { code, e, n } from "../dsl";
import type { Category } from "../types";

export const dataEngineering: Category = {
  slug: "data-engineering",
  name: "Data engineering design patterns",
  blurb: "Move, refine and keep data correct: from ETL to change data capture and re-runnable pipelines.",
  intro:
    "Data pipelines run unattended and fail in the middle of the night, so the core goals are correctness when re-run, clear layers of quality, and knowing where every number came from. These patterns are the common building blocks.",
  patterns: [
    {
      slug: "etl-elt",
      name: "ETL vs ELT",
      summary:
        "Transform before loading (ETL) or load raw data first and transform inside the warehouse (ELT).",
      definition:
        "ETL extracts data, transforms it in a separate engine and loads the finished result. ELT loads raw data into a scalable warehouse or lakehouse and transforms it there with SQL. Modern cloud warehouses made ELT the common default.",
      useWhen: [
        "ELT: you have a capable warehouse and want raw data kept for re-processing.",
        "ETL: data must be cleaned or masked before it lands, for privacy or compliance.",
      ],
      pros: [
        "ELT keeps raw history, so transformations can be fixed and re-run.",
        "ETL keeps sensitive fields out of the warehouse entirely.",
      ],
      cons: [
        "ELT stores more data and can expose raw personal data if not governed.",
        "ETL loses the raw input, so mistakes are hard to replay.",
      ],
      example:
        "Raw orders land in the warehouse every hour; SQL models then build daily revenue tables (ELT).",
      code: {
        lang: "sql",
        file: "models/daily_revenue.sql",
        source: code(`
          -- ELT: transform inside the warehouse, from raw data already loaded
          create or replace table analytics.daily_revenue as
          select date_trunc('day', paid_at) as day,
                 sum(amount_minor) / 100.0   as revenue_pkr
          from raw.orders
          where status = 'paid'
          group by 1;
        `),
      },
      diagram: {
        title:
          "ETL versus ELT: ETL transforms before loading into the warehouse; ELT loads raw data and transforms inside the warehouse.",
        h: 170,
        nodes: [
          n("s1", "Sources", 50, 45),
          n("t1", "Transform", 190, 45, "accent"),
          n("w1", "Warehouse", 360, 45, "store"),
          n("s2", "Sources", 50, 130),
          n("w2", "Warehouse: raw", 220, 130, "store"),
          n("t2", "SQL transform", 395, 130, "accent"),
        ],
        edges: [
          e("s1", "t1", { label: "ETL" }),
          e("t1", "w1"),
          e("s2", "w2", { label: "ELT" }),
          e("w2", "t2"),
        ],
      },
    },
    {
      slug: "medallion",
      name: "Medallion architecture",
      summary: "Refine data in layers: bronze (raw), silver (cleaned and joined), gold (business-ready).",
      definition:
        "Data moves through quality layers in a lakehouse. Bronze stores raw data as received, silver cleans, deduplicates and conforms it, and gold holds aggregated, business-level tables for reports and machine learning.",
      useWhen: [
        "Many sources feed many consumers, and quality issues must be traceable.",
        "You want to rebuild downstream tables from raw data when logic changes.",
      ],
      pros: ["Clear contracts and ownership per layer.", "Easy to reprocess from bronze after fixing a bug."],
      cons: [
        "Three copies of data cost storage and pipeline runs.",
        "Can become ceremony for small, simple datasets.",
      ],
      example:
        "Raw clickstream JSON lands in bronze, silver parses and deduplicates sessions, gold computes daily active users.",
      code: {
        lang: "python",
        file: "medallion.py",
        source: code(`
          bronze = spark.read.json("s3://lake/raw/clicks/")                       # as received
          silver = (bronze.dropDuplicates(["event_id"])
                          .withColumn("ts", to_timestamp("ts"))
                          .filter("user_id is not null"))
          gold = silver.groupBy(to_date("ts").alias("day")).agg(countDistinct("user_id").alias("dau"))
          gold.write.mode("overwrite").saveAsTable("gold.daily_active_users")
        `),
      },
      diagram: {
        title:
          "Medallion architecture: sources flow into bronze raw tables, then silver cleaned tables, then gold business tables used by BI and ML.",
        h: 150,
        nodes: [
          n("src", "Sources", 46, 75, "ghost"),
          n("b", "Bronze\nraw", 160, 75, "store"),
          n("s", "Silver\nclean", 270, 75, "store"),
          n("g", "Gold\nbusiness", 380, 75, "accent"),
        ],
        edges: [e("src", "b"), e("b", "s"), e("s", "g")],
      },
    },
    {
      slug: "cdc",
      name: "Change data capture (CDC)",
      summary: "Stream every insert, update and delete from a database's log to other systems, in order.",
      definition:
        "Instead of re-querying tables, a CDC tool reads the database's transaction log (such as the Postgres WAL or the MySQL binlog) and publishes each row change as an event. Consumers keep search indexes, caches or warehouses in sync in near real time.",
      useWhen: [
        "Other systems need fresh copies of operational data.",
        "Full-table extracts are too slow or too heavy on the database.",
      ],
      pros: [
        "Low latency and low load on the source database.",
        "Captures deletes and every intermediate change.",
      ],
      cons: [
        "Schema changes must be handled carefully downstream.",
        "Another streaming system to run, such as Kafka and Debezium.",
      ],
      example:
        "Debezium streams product table changes from Postgres to Kafka, and a consumer updates the search index within seconds.",
      code: {
        lang: "yaml",
        file: "connector.yaml",
        source: code(`
          name: products-cdc
          config:
            connector.class: io.debezium.connector.postgresql.PostgresConnector
            database.hostname: db.internal
            database.dbname: shop
            table.include.list: public.products
            topic.prefix: shop
        `),
      },
      diagram: {
        title:
          "Change data capture: a CDC connector reads the database log and publishes change events to a stream consumed by a search index and a warehouse.",
        h: 180,
        nodes: [
          n("db", "Postgres", 56, 90, "store"),
          n("log", "WAL", 160, 90, "ghost"),
          n("cdc", "CDC connector", 280, 90, "accent"),
          n("idx", "Search", 420, 40),
          n("wh", "Warehouse", 420, 140, "store"),
        ],
        edges: [e("db", "log"), e("log", "cdc"), e("cdc", "idx", { label: "events" }), e("cdc", "wh")],
      },
    },
    {
      slug: "lambda-kappa",
      name: "Lambda and Kappa architectures",
      summary:
        "Lambda runs a batch and a streaming path side by side; Kappa uses one streaming path and replays the log.",
      definition:
        "Lambda architecture combines an accurate batch layer with a fast speed layer and merges them at query time. Kappa architecture drops the batch layer: everything is a stream, and reprocessing means replaying the event log through a new version of the job.",
      useWhen: [
        "Lambda: batch tooling is mature in your team and late corrections matter.",
        "Kappa: your stream processor and log retention can handle full replays.",
      ],
      pros: [
        "Lambda gives accuracy and freshness together.",
        "Kappa keeps one codebase and one path to reason about.",
      ],
      cons: [
        "Lambda means maintaining the same logic twice.",
        "Kappa replays can be slow and expensive for long histories.",
      ],
      example:
        "A fraud dashboard moved from Lambda to Kappa: one Flink job computes features, and fixes are deployed by replaying a week of Kafka events.",
      code: {
        lang: "text",
        file: "kappa-replay.txt",
        source: code(`
          # Kappa: reprocess by replaying the log, not by a separate batch job
          1. deploy features-v2 reading topic 'payments' from offset 0
          2. write to table features_v2 while v1 keeps serving
          3. when v2 catches up, switch readers to features_v2
          4. retire v1
        `),
      },
      diagram: {
        title:
          "Lambda and Kappa: Lambda splits events into batch and speed layers merged for serving; Kappa uses one stream processor that can replay the log.",
        h: 200,
        groups: [
          { label: "lambda", x: 10, y: 8, w: 460, h: 92 },
          { label: "kappa", x: 10, y: 112, w: 460, h: 80 },
        ],
        nodes: [
          n("e1", "Events", 60, 55, "store"),
          n("batch", "Batch", 200, 36),
          n("speed", "Speed", 200, 78),
          n("serve1", "Serve", 400, 55, "accent"),
          n("e2", "Event log", 70, 155, "store"),
          n("stream", "Stream job", 240, 155),
          n("serve2", "Serve", 400, 155, "accent"),
        ],
        edges: [
          e("e1", "batch"),
          e("e1", "speed"),
          e("batch", "serve1"),
          e("speed", "serve1"),
          e("e2", "stream", { label: "replay" }),
          e("stream", "serve2"),
        ],
      },
    },
    {
      slug: "idempotent-pipelines",
      name: "Idempotent pipelines",
      summary: "Design every step so running it twice gives the same result as running it once.",
      definition:
        "Pipelines get retried, backfilled and re-run. Idempotent steps overwrite a whole partition or upsert on a natural key, process data for an explicit date range rather than “now”, and deduplicate on event IDs, so reruns never double-count.",
      useWhen: [
        "Always for scheduled jobs; retries and backfills are inevitable.",
        "Consumers of a queue may receive the same message more than once.",
      ],
      pros: ["Safe retries and painless backfills.", "Failures become “just run it again”."],
      cons: [
        "Needs stable keys and partitioning designed up front.",
        "Overwrite-by-partition can be heavier than appending.",
      ],
      example:
        "The daily revenue job for 2026-11-09 deletes and rewrites only that day's partition, so a rerun yields identical totals.",
      code: {
        lang: "sql",
        file: "upsert.sql",
        source: code(`
          -- re-runnable for any :run_date
          delete from analytics.daily_revenue where day = :run_date;
          insert into analytics.daily_revenue (day, revenue_pkr)
          select :run_date, sum(amount_minor) / 100.0
          from raw.orders
          where status = 'paid' and paid_at::date = :run_date;
        `),
      },
      diagram: {
        title:
          "Idempotent pipelines: a job for a given date replaces exactly that partition, so running it twice yields the same table.",
        h: 170,
        nodes: [
          n("r1", "Run 1", 60, 50, "accent"),
          n("r2", "Run 2 (retry)", 80, 130, "accent"),
          n("p", "Partition\n2026-11-09", 270, 90, "store"),
          n("same", "Same result", 420, 90),
        ],
        edges: [e("r1", "p", { label: "overwrite" }), e("r2", "p", { label: "overwrite" }), e("p", "same")],
      },
    },
    {
      slug: "transactional-outbox",
      name: "Transactional outbox",
      summary:
        "Write the event to an outbox table in the same transaction as the data, then publish it from there.",
      definition:
        "Updating a database and publishing a message are two systems that cannot share a transaction. The outbox pattern writes the business change and an outbox row together, atomically; a relay (or CDC) reads the outbox and publishes to the message broker, retrying until it succeeds.",
      useWhen: [
        "A data change must reliably produce an event, such as OrderPlaced.",
        "Losing or duplicating events would corrupt downstream systems.",
      ],
      pros: ["No lost events when the broker is down.", "Simple to add to an existing service."],
      cons: ["At-least-once delivery: consumers must deduplicate.", "A relay process to run and monitor."],
      example:
        "Placing an order inserts the order row and an outbox row in one transaction; a relay publishes OrderPlaced to the queue.",
      code: {
        lang: "sql",
        file: "outbox.sql",
        source: code(`
          begin;
          insert into orders (id, customer_id, total_minor) values ($1, $2, $3);
          insert into outbox (id, topic, payload)
          values (gen_random_uuid(), 'order.placed', jsonb_build_object('order_id', $1));
          commit;
          -- relay: select * from outbox where published_at is null order by created_at limit 100
        `),
      },
      diagram: {
        title:
          "Transactional outbox: the service writes the order and an outbox row in one transaction; a relay publishes outbox rows to the broker.",
        h: 180,
        groups: [{ label: "one transaction", x: 120, y: 14, w: 160, h: 150 }],
        nodes: [
          n("svc", "Service", 54, 90, "accent"),
          n("orders", "orders", 200, 55, "store"),
          n("outbox", "outbox", 200, 125, "store"),
          n("relay", "Relay", 320, 125),
          n("broker", "Broker", 440, 125, "ghost"),
        ],
        edges: [
          e("svc", "orders"),
          e("svc", "outbox"),
          e("outbox", "relay"),
          e("relay", "broker", { label: "send" }),
        ],
      },
    },
  ],
  reading: [
    {
      title: "Extract, transform, load (ETL)",
      source: "Microsoft Azure Architecture Center",
      href: "https://learn.microsoft.com/en-us/azure/architecture/data-guide/relational-data/etl",
    },
    {
      title: "What is a medallion architecture?",
      source: "Databricks",
      href: "https://www.databricks.com/blog/what-is-medallion-architecture",
    },
    {
      title: "Debezium documentation",
      source: "Debezium",
      href: "https://debezium.io/documentation/reference/stable/index.html",
    },
    {
      title: "Questioning the Lambda architecture",
      source: "O'Reilly (Jay Kreps)",
      href: "https://www.oreilly.com/radar/questioning-the-lambda-architecture/",
    },
    {
      title: "Big data architectures",
      source: "Microsoft Azure Architecture Center",
      href: "https://learn.microsoft.com/en-us/azure/architecture/databases/guide/big-data-architectures",
    },
    {
      title: "Idempotent receiver",
      source: "Martin Fowler (Patterns of Distributed Systems)",
      href: "https://martinfowler.com/articles/patterns-of-distributed-systems/idempotent-receiver.html",
    },
    {
      title: "Transactional outbox pattern",
      source: "Microsoft Azure Architecture Center",
      href: "https://learn.microsoft.com/en-us/azure/architecture/databases/guide/transactional-out-box-cosmos",
    },
  ],
};
