import { code, e, n } from "../dsl";
import type { Category } from "../types";

export const devops: Category = {
  slug: "devops",
  name: "DevOps",
  blurb:
    "Ship small changes often and safely: pipelines, progressive delivery, infrastructure as code and observability.",
  intro:
    "Research from DORA shows that teams can move fast and stay stable at the same time, and that small batches, automation and fast feedback are how. These patterns are the delivery side of that.",
  patterns: [
    {
      slug: "ci-cd",
      name: "CI/CD pipeline",
      summary: "Every push is built, tested and checked automatically; every green main can be deployed.",
      definition:
        "Continuous integration merges small changes into the main branch often, with automated builds and tests on each one. Continuous delivery keeps main always releasable, so deploying is a routine, automated step rather than an event.",
      useWhen: [
        "Any team shipping software; it is the foundation for the other patterns.",
        "Releases are risky, manual or infrequent today.",
      ],
      pros: [
        "Bugs surface minutes after they are written.",
        "Small, frequent releases are easier to roll back.",
      ],
      cons: [
        "Needs a reliable, fast test suite; flaky tests erode trust.",
        "Pipeline minutes and maintenance cost money.",
      ],
      example:
        "Each pull request runs typecheck, lint, unit tests and a build; merging to main deploys a preview, then production.",
      code: {
        lang: "yaml",
        file: ".github/workflows/ci.yml",
        source: code(`
          on: [push, pull_request]
          jobs:
            ci:
              runs-on: ubuntu-latest
              steps:
                - uses: actions/checkout@v4
                - uses: actions/setup-node@v4
                  with: { node-version: 22, cache: npm }
                - run: npm ci
                - run: npm run lint && npx tsc --noEmit
                - run: npm test
                - run: npm run build
        `),
      },
      diagram: {
        title:
          "CI/CD pipeline: a commit is built, tested and checked, then deployed to staging and production.",
        h: 130,
        nodes: [
          n("c", "Commit", 44, 65, "user"),
          n("b", "Build", 135, 65),
          n("t", "Test", 220, 65),
          n("s", "Staging", 315, 65),
          n("p", "Prod", 425, 65, "accent"),
        ],
        edges: [e("c", "b"), e("b", "t"), e("t", "s"), e("s", "p")],
      },
    },
    {
      slug: "blue-green",
      name: "Blue-green deployment",
      summary:
        "Run the new version alongside the old one and switch all traffic at once; switch back if needed.",
      definition:
        "Two identical production environments exist. Blue serves users while green receives the new release and is tested. Cutover is a router or DNS switch, and rollback is switching back.",
      useWhen: [
        "You need near-zero downtime and instant rollback.",
        "You can afford two environments during a release.",
      ],
      pros: [
        "Instant rollback by flipping traffic back.",
        "The new version is verified in a production-like setting first.",
      ],
      cons: [
        "Double the infrastructure during releases.",
        "Database schema changes must work for both versions (expand, then contract).",
      ],
      example:
        "Green gets v2.3 and passes smoke tests; the load balancer switches to green; blue stays warm for an hour in case of rollback.",
      code: {
        lang: "bash",
        file: "cutover.sh",
        source: code(`
          deploy --env green --version v2.3
          smoke-test https://green.internal || exit 1
          lb switch --to green          # all traffic moves at once
          # rollback: lb switch --to blue
        `),
      },
      diagram: {
        title:
          "Blue-green deployment: a router sends all traffic to blue while green gets the new version; the router then switches to green.",
        h: 170,
        nodes: [
          n("u", "Users", 50, 85, "user"),
          n("r", "Router", 180, 85, "decision"),
          n("blue", "Blue v2.2", 380, 40),
          n("green", "Green v2.3", 380, 130, "accent"),
        ],
        edges: [
          e("u", "r"),
          e("r", "blue", { dashed: true, label: "before" }),
          e("r", "green", { label: "after" }),
        ],
      },
    },
    {
      slug: "canary",
      name: "Canary release and feature flags",
      summary:
        "Send a small slice of traffic to the new version, watch the metrics, then widen or roll back.",
      definition:
        "The new version first serves a small percentage of users. Automated checks compare its error rate and latency with the old version, and the share grows in steps if healthy. Feature flags apply the same idea inside the code, separating deploying from releasing.",
      useWhen: [
        "Risky changes where real traffic is the only true test.",
        "You have good metrics to compare the canary with the baseline.",
      ],
      pros: [
        "Limits the blast radius of a bad release.",
        "Flags let you turn features off without a deploy.",
      ],
      cons: [
        "Two versions run at once, so they must be compatible.",
        "Old flags pile up as technical debt; remove them.",
      ],
      example:
        "A new retrieval pipeline gets 5% of traffic; error rate and answer ratings are compared for an hour before moving to 25%.",
      code: {
        lang: "yaml",
        file: "rollout.yaml",
        source: code(`
          strategy:
            canary:
              steps:
                - setWeight: 5
                - pause: { duration: 1h }
                - analysis: { templates: [error-rate, p95-latency] }
                - setWeight: 25
                - pause: { duration: 1h }
                - setWeight: 100
        `),
      },
      diagram: {
        title:
          "Canary release: the router sends 95 percent of traffic to the stable version and 5 percent to the canary, while metrics decide whether to widen.",
        h: 170,
        nodes: [
          n("u", "Users", 50, 85, "user"),
          n("r", "Router", 170, 85, "decision"),
          n("stable", "Stable", 330, 40),
          n("canary", "Canary", 330, 130, "accent"),
          n("m", "Metrics", 445, 130, "store"),
        ],
        edges: [
          e("u", "r"),
          e("r", "stable", { label: "95%" }),
          e("r", "canary", { label: "5%" }),
          e("canary", "m", { dashed: true }),
        ],
      },
    },
    {
      slug: "iac",
      name: "Infrastructure as code",
      summary:
        "Describe servers, networks and services in versioned files; tools create and update them to match.",
      definition:
        "Infrastructure is declared in code (Terraform, Pulumi, Kubernetes manifests) and kept in Git. A tool computes the difference between the code and reality, shows a plan, and applies it, so environments are reproducible and reviewed like any other change.",
      useWhen: [
        "More than one environment, or more than one person changing infrastructure.",
        "You need audit history and repeatable disaster recovery.",
      ],
      pros: ["Reviewable, repeatable and reversible infrastructure changes.", "New environments in minutes."],
      cons: ["State files and drift need care.", "Learning curve, and mistakes can apply at scale."],
      example:
        "A pull request adds a Postgres instance in Terraform; the pipeline posts the plan for review and applies it on merge.",
      code: {
        lang: "text",
        file: "main.tf",
        source: code(`
          resource "aws_s3_bucket" "uploads" {
            bucket = "acme-uploads-prod"
          }

          resource "aws_s3_bucket_versioning" "uploads" {
            bucket = aws_s3_bucket.uploads.id
            versioning_configuration { status = "Enabled" }
          }
        `),
      },
      diagram: {
        title:
          "Infrastructure as code: code in Git produces a plan that is reviewed and applied to cloud resources.",
        h: 130,
        nodes: [
          n("git", "Git: *.tf", 56, 65, "store"),
          n("plan", "plan (diff)", 180, 65),
          n("review", "Review", 300, 65, "decision"),
          n("cloud", "Cloud", 435, 65, "accent"),
        ],
        edges: [e("git", "plan"), e("plan", "review"), e("review", "cloud", { label: "apply" })],
      },
    },
    {
      slug: "gitops",
      name: "GitOps",
      summary:
        "Git holds the desired state; an agent in the cluster continuously pulls it and reconciles reality to match.",
      definition:
        "The desired state of a system is declarative and versioned in Git. Software agents in the environment pull that state and keep reconciling the live system towards it, so a merge is a deploy and drift is corrected automatically.",
      useWhen: [
        "You run Kubernetes or another declarative platform.",
        "You want every change audited in Git and nobody running kubectl by hand.",
      ],
      pros: [
        "Git history is the audit log; rollback is a revert.",
        "Pull-based: no cluster credentials in CI.",
      ],
      cons: [
        "Secrets need a separate solution such as sealed or external secrets.",
        "Debugging reconciliation loops takes practice.",
      ],
      example:
        "Merging a new image tag to the config repo makes Argo CD roll the deployment; reverting the commit rolls it back.",
      code: {
        lang: "yaml",
        file: "app.yaml",
        source: code(`
          apiVersion: argoproj.io/v1alpha1
          kind: Application
          metadata: { name: chat-api }
          spec:
            source: { repoURL: https://git.example.com/platform/config, path: apps/chat-api, targetRevision: main }
            destination: { server: https://kubernetes.default.svc, namespace: chat }
            syncPolicy: { automated: { prune: true, selfHeal: true } }
        `),
      },
      diagram: {
        title:
          "GitOps: a developer merges to the config repo; an agent in the cluster pulls the desired state and reconciles the live cluster.",
        h: 190,
        nodes: [
          n("dev", "Merge", 50, 50, "user"),
          n("repo", "Config repo", 180, 50, "store"),
          n("agent", "Sync agent", 340, 50, "accent"),
          n("k8s", "Cluster", 340, 150),
        ],
        edges: [
          e("dev", "repo"),
          e("agent", "repo", { label: "pull" }),
          e("agent", "k8s", { curve: 22, label: "apply" }),
          e("k8s", "agent", { curve: 22, label: "observe" }),
        ],
      },
    },
    {
      slug: "observability",
      name: "Observability and SLOs",
      summary:
        "Emit logs, metrics and traces, define what “good” means as SLOs, and alert on symptoms users feel.",
      definition:
        "Observability is being able to ask new questions about a running system from its telemetry: structured logs, metrics and distributed traces, increasingly via OpenTelemetry. Service level objectives turn user experience into targets, and the error budget tells you when to slow down.",
      useWhen: ["Anything running in production.", "Alerts are noisy or problems are found by users first."],
      pros: [
        "Faster diagnosis of unfamiliar failures.",
        "SLOs give a shared, data-driven answer to “ship or stabilise?”.",
      ],
      cons: [
        "Telemetry volume costs money; sample and set retention.",
        "SLOs need agreement on what users actually care about.",
      ],
      example:
        "SLO: 99.5% of chat requests succeed within 8 s over 28 days; the team pages only when the error budget burns quickly.",
      code: {
        lang: "yaml",
        file: "slo.yaml",
        source: code(`
          slo:
            name: chat-availability
            objective: 99.5          # percent, 28-day window
            sli:
              good: http_request_duration_seconds_bucket{route="/api/chat",code!~"5..",le="8"}
              total: http_request_duration_seconds_count{route="/api/chat"}
            alert: { burn_rate: [14.4, 6], windows: [1h, 6h] }
        `),
      },
      diagram: {
        title:
          "Observability: services emit logs, metrics and traces to a telemetry backend, where SLOs drive dashboards and alerts.",
        h: 180,
        nodes: [
          n("svc", "Services", 56, 90, "accent"),
          n("l", "Logs", 190, 34),
          n("m", "Metrics", 190, 90),
          n("t", "Traces", 190, 146),
          n("otel", "Telemetry\nbackend", 310, 90, "store"),
          n("slo", "SLO alerts", 425, 90, "accent"),
        ],
        edges: [
          e("svc", "l"),
          e("svc", "m"),
          e("svc", "t"),
          e("l", "otel"),
          e("m", "otel"),
          e("t", "otel"),
          e("otel", "slo"),
        ],
      },
    },
  ],
  reading: [
    {
      title: "ContinuousDelivery",
      source: "Martin Fowler",
      href: "https://martinfowler.com/bliki/ContinuousDelivery.html",
    },
    {
      title: "BlueGreenDeployment",
      source: "Martin Fowler",
      href: "https://martinfowler.com/bliki/BlueGreenDeployment.html",
    },
    {
      title: "CanaryRelease",
      source: "Martin Fowler",
      href: "https://martinfowler.com/bliki/CanaryRelease.html",
    },
    {
      title: "Feature toggles (aka feature flags)",
      source: "martinfowler.com",
      href: "https://martinfowler.com/articles/feature-toggles.html",
    },
    {
      title: "What is Terraform?",
      source: "HashiCorp",
      href: "https://developer.hashicorp.com/terraform/intro",
    },
    { title: "OpenGitOps principles", source: "OpenGitOps (CNCF)", href: "https://opengitops.dev/" },
    { title: "OpenTelemetry documentation", source: "OpenTelemetry", href: "https://opentelemetry.io/docs/" },
    {
      title: "Site Reliability Engineering (book)",
      source: "Google",
      href: "https://sre.google/sre-book/table-of-contents/",
    },
    { title: "DORA research", source: "DORA", href: "https://dora.dev/" },
  ],
};
