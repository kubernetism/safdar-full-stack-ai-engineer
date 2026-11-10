/**
 * Single source of truth for the site's real content.
 *
 * Everything here comes from the previous version of the site, the project
 * screenshots in /web-projects, the blog series plan, or the owner's CV.
 * Nothing is invented: when a fact had no source (project URLs, stacks,
 * dates), it is left out and marked with a TODO for the owner to fill in.
 */

export const profile = {
  name: "Syed Safdar Ali Shah",
  shortName: "Safdar Ali Shah",
  role: "Full-stack AI engineer",
  tagline: "Practical AI, built to ship.",
  summary:
    "I am Syed Safdar Ali Shah, an AI engineer focused on agentic applications, backend APIs, and cloud-native delivery.",
  background:
    "My work brings together a computer science foundation, technical support experience, and a growing focus on AI agents and cloud platforms.",
  location: "Peshawar, Pakistan",
  availability:
    "I am open to thoughtful conversations about AI engineering, backend systems, and cloud-native development.",
  email: "programmersafdar@live.com",
  github: "https://github.com/kubernetism",
  linkedin: "https://www.linkedin.com/in/kubernetism/",
} as const;

export const focusAreas = [
  {
    title: "Agentic applications",
    text: "Building practical AI workflows with the OpenAI Agents SDK, Model Context Protocol, and FastAPI.",
    tags: ["Agents SDK", "MCP", "FastAPI"],
  },
  {
    title: "Backend systems",
    text: "Designing dependable services and technical foundations that make complex work easier to operate.",
    tags: ["APIs", "Data systems", "Support"],
  },
  {
    title: "Cloud-native delivery",
    text: "Learning and applying container-first practices for software that can grow without losing clarity.",
    tags: ["Docker", "Kubernetes", "Dapr"],
  },
] as const;

export const principles = [
  {
    title: "Start with the workflow.",
    text: "Understand who needs the system and what should improve.",
  },
  {
    title: "Make complexity maintainable.",
    text: "Choose tools and architecture that a team can support.",
  },
  {
    title: "Keep learning in public.",
    text: "Document experiments and share progress through GitHub.",
  },
] as const;

export type Project = {
  slug: string;
  name: string;
  kind: string;
  description: string;
  features: readonly string[];
  image: { src: string; width: number; height: number; alt: string };
  /** Live URL. TODO(owner): add URLs, stacks and years where they exist. */
  href?: string;
};

export const projects: readonly Project[] = [
  {
    slug: "shahmeer-shafqat",
    name: "Shah Meer Shafqat",
    kind: "Photographer portfolio",
    description:
      "Portfolio site for Shah Meer Shafqat, a wedding photographer and videographer with a studio in Peshawar Cantt. It covers his experience, a filterable photo portfolio, films, services and a blog.",
    features: [
      "Filterable photo portfolio",
      "Films, services and WhatsApp enquiries",
      "Experience timeline and blog",
    ],
    image: {
      src: "/images/projects/shahmeer-shafqat.jpg",
      width: 1200,
      height: 750,
      alt: "Shah Meer Shafqat home page: the headline “Capturing stories that last a lifetime” beside portraits of the photographer on a purple sunset background",
    },
    href: "https://shahmeer-shafqat.netlify.app/",
  },
  {
    slug: "maaher",
    name: "Maaher.pk",
    kind: "Marketplace",
    description:
      "A marketplace for finding trusted local help across Pakistan. Visitors search by service and city, browse city pages and compare provider profiles.",
    features: [
      "Search by service and city",
      "City pages from Islamabad to Peshawar",
      "Provider profiles with availability",
    ],
    image: {
      src: "/images/projects/maaher.jpg",
      width: 800,
      height: 1325,
      alt: "Maaher.pk home page: the headline “Find the right help close to home” over a photo of Islamabad, with a service and city search form",
    },
  },
  {
    slug: "rise-educational-complex",
    name: "Rise Educational Complex",
    kind: "Institute website",
    description:
      "Website for a vocational institute in Peshawar that offers government-approved diplomas and international certifications. It covers programs, events, notices and admissions.",
    features: ["Programs across five career paths", "Events and notices", "Admissions information"],
    image: {
      src: "/images/projects/rise-educational-complex.jpg",
      width: 800,
      height: 1760,
      alt: "Rise Educational Complex home page with a group photo of trainers and the headline “Rise Educational Complex”",
    },
  },
  {
    slug: "kr-cybersecurity",
    name: "KR Cybersecurity",
    kind: "Portfolio",
    description:
      "Portfolio for Khalil Ur Rehman, a cyber security researcher in Peshawar, with terminal-style visuals, skills, projects and certifications.",
    features: ["Terminal-style hero", "Skills and certifications", "Threat and AI security sections"],
    image: {
      src: "/images/projects/kr-cybersecurity.jpg",
      width: 800,
      height: 1760,
      alt: "KR Cybersecurity home page: a large “KR CYBERSECURITY” headline on a dark blue terminal background with a beetle illustration",
    },
  },
  {
    slug: "kr-cybersecurity-threats",
    name: "KR Cybersecurity / Threats",
    kind: "Threat landscape page",
    description:
      "A threat landscape page where every figure links to its source, plus a manually checked CVE snapshot drawn from CISA's Known Exploited Vulnerabilities catalog.",
    features: ["Every figure linked to its source", "Manual CVE snapshot", "Decorative globe animation"],
    image: {
      src: "/images/projects/kr-cybersecurity-threats.jpg",
      width: 800,
      height: 1760,
      alt: "KR Cybersecurity threats page: a large “THREATS” headline beside an illustrated globe centred on Pakistan",
    },
  },
] as const;

/**
 * Business systems the owner has built. No screenshots or public links yet.
 * TODO(owner): add a screenshot, stack and (if public) a link for each.
 */
export const systems = [
  {
    slug: "point-of-sale",
    name: "Point of Sale",
    kind: "Business system",
    description: "A point of sale system for ringing up sales at the counter.",
  },
  {
    slug: "inventory-management",
    name: "Inventory Management",
    kind: "Business system",
    description: "An inventory management system for keeping track of stock.",
  },
  {
    slug: "restaurant-management",
    name: "Restaurant Management",
    kind: "Business system",
    description: "A restaurant management system for running day-to-day restaurant operations.",
  },
] as const;

export const skills = [
  { command: "agents-sdk", label: "OpenAI Agents SDK", text: "Practical AI workflows and agent tooling." },
  { command: "mcp", label: "Model Context Protocol", text: "Connecting agents to tools and data." },
  { command: "fastapi", label: "FastAPI", text: "Backend APIs for agentic applications." },
  {
    command: "claude-code",
    label: "Claude Code",
    text: "Agentic coding in the terminal. This site was built with it.",
  },
  { command: "crewai", label: "CrewAI", text: "Multi-agent systems." },
  { command: "docker", label: "Docker", text: "Container-first delivery." },
  {
    command: "kubernetes",
    label: "Kubernetes",
    text: "Running containers that can grow without losing clarity.",
  },
  { command: "dapr", label: "Dapr", text: "Dapr Agentic Cloud Ascent (DACA) for scaling AI agents." },
] as const;

/** From the owner's CV. Year is omitted where the CV gives none. */
export const credentials = [
  { year: "2026", title: "Containerization & Kubernetes Fundamentals", issuer: "Panaversity" },
  { year: "2025", title: "Model Context Protocol: Advanced Topics", issuer: "Anthropic Academy" },
  { year: "2025", title: "Introduction to Model Context Protocol", issuer: "Anthropic Academy" },
  { year: "2024", title: "Multi AI Agent Systems with CrewAI", issuer: "DeepLearning.AI" },
  { year: "2023", title: "Introduction to Critical Infrastructure Protection", issuer: "OPSWAT Academy" },
  { year: "2018", title: "CCNA Routing and Switching", issuer: "Qurtuba University" },
  { year: "2018", title: "BS Computer Science (Hons)", issuer: "Qurtuba University, Peshawar" },
  { year: null, title: "Agentic AI Level 2 Developer", issuer: "PIAIC" },
] as const;

export const goals = [
  { title: "Certified Kubernetes Application Developer (CKAD)", target: "Dec 2026" },
  { title: "Certified Kubernetes Administrator (CKA)", target: "Dec 2026" },
] as const;

export type Post = {
  part: number;
  slug: string;
  title: string;
  description: string;
  dek: string;
  sourcePages: string;
  image: string;
  imageAlt: string;
};

export const SERIES = {
  name: "Secure by Design",
  parts: 10,
  sourceTitle: "Secure by Design guidance",
  sourceUrl: "https://www.cisa.gov/sites/default/files/2023-10/SecureByDesign_1025_508c.pdf",
} as const;

export const posts: readonly Post[] = [
  {
    part: 1,
    slug: "secure-by-design",
    title: "Secure by design: building security in",
    description: "A practical introduction to safer software, in 100 short points.",
    dek: "A practical introduction to safer software, from the first design decision to the default settings customers use.",
    sourcePages: "4–12",
    image: "/images/secure-by-design-cover.png",
    imageAlt: "Layered architectural forms with a protected blue foundation",
  },
  {
    part: 2,
    slug: "secure-by-default",
    title: "Secure by default: the safer starting point",
    description: "How secure settings protect customers from the start.",
    dek: "How secure settings and thoughtful choices protect customers from the moment software is installed.",
    sourcePages: "8–9 and 30–32",
    image: "/images/secure-by-default-cover.png",
    imageAlt: "An engineered structure with protective layers already in place",
  },
  {
    part: 3,
    slug: "customer-security-ownership",
    title: "Who owns customer security?",
    description: "Why software makers should take responsibility for customer security outcomes.",
    dek: "Why software makers should take responsibility for the security outcomes their customers experience.",
    sourcePages: "11–19",
    image: "/images/customer-security-ownership-cover.png",
    imageAlt: "Interlocking metal structures supporting a protected blue element",
  },
] as const;

/** Remaining parts from app/blog/series-plan.md. */
export const plannedParts = [
  {
    part: 4,
    title: "Transparency and accountability",
    text: "Vulnerability reporting, accurate advisories, evidence, and customer trust.",
  },
  {
    part: 5,
    title: "Security leadership starts at the top",
    text: "Executive sponsorship, organizational culture, incentives, and investment.",
  },
  {
    part: 6,
    title: "Preventing vulnerabilities at their source",
    text: "Memory safety, secure components, root-cause fixes, and software development practices.",
  },
  {
    part: 7,
    title: "Testing and disclosure throughout development",
    text: "Threat modeling, security review, testing, vulnerability reporting, and defense in depth.",
  },
  {
    part: 8,
    title: "Secure defaults for identity and visibility",
    text: "Authentication, single sign-on, audit logs, and making core controls available.",
  },
  {
    part: 9,
    title: "From hardening guides to loosening guides",
    text: "Secure baselines, optional changes, and clear explanations of risk.",
  },
  {
    part: 10,
    title: "Questions customers should ask vendors",
    text: "Procurement, supplier accountability, security evidence, and risk decisions.",
  },
] as const;

export function postBySlug(slug: string): Post {
  const post = posts.find((p) => p.slug === slug);
  if (!post) throw new Error(`Unknown post: ${slug}`);
  return post;
}
