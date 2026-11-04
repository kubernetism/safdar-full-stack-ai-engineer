import Image from "next/image";
import styles from "./page.module.css";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import Particles from "./components/particles/Particles";

const areas = [
  {
    number: "01",
    title: "Agentic applications",
    text: "Building practical AI workflows with the OpenAI Agents SDK, Model Context Protocol, and FastAPI.",
    tags: ["Agents SDK", "MCP", "FastAPI"],
  },
  {
    number: "02",
    title: "Backend systems",
    text: "Designing dependable services and technical foundations that make complex work easier to operate.",
    tags: ["APIs", "Data systems", "Support"],
  },
  {
    number: "03",
    title: "Cloud-native delivery",
    text: "Learning and applying container-first practices for software that can grow without losing clarity.",
    tags: ["Docker", "Kubernetes", "Dapr"],
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.particleBackground} aria-hidden="true">
        <Particles
          particleColors={["#000000"]}
          particleCount={600}
          particleSpread={4}
          speed={0.11}
          particleBaseSize={65}
          glow={0.3}
          twinkle={0.45}
          moveParticlesOnHover
          hoverEffect="parallax"
          sizeRandomness={1.7}
          shape="sparkle"
          particleHoverFactor={1.3}
          cameraDistance={33}
          clickBurst={false}
          lightMode
          opacity={0.65}
          pixelRatio={1.5}
        />
      </div>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>

      <SiteHeader />

      <main id="main-content">
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>AI Engineer · Pakistan</p>
            <h1 id="hero-title">Practical AI, built to ship.</h1>
            <p className={styles.heroDescription}>
              I am Syed Safdar Ali Shah, an AI engineer focused on agentic applications,
              backend APIs, and cloud-native delivery.
            </p>
            <div className={styles.actions}>
              <a className={styles.primaryAction} href="#work">
                Explore my work
              </a>
              <a className={styles.secondaryAction} href="#contact">
                Get in touch
              </a>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <Image
              src="/images/ai-sculpture-hero.png"
              alt="Abstract glass and metal neural structure with cobalt circuit details"
              fill
              priority
              sizes="(max-width: 767px) calc(100vw - 2.5rem), (max-width: 1100px) 42vw, 38vw"
            />
          </div>
        </section>

        <section className={styles.work} id="work" aria-labelledby="work-title">
          <div className={styles.sectionHeading}>
            <p className={styles.kicker}>What I focus on</p>
            <h2 id="work-title">Systems with a clear purpose.</h2>
          </div>

          <div className={styles.workGrid}>
            {areas.map((area, index) => (
              <article
                className={`${styles.workCard} ${index === 0 ? styles.featuredCard : ""}`}
                key={area.number}
              >
                <span className={styles.cardNumber}>{area.number}</span>
                <div>
                  <h3>{area.title}</h3>
                  <p>{area.text}</p>
                </div>
                <ul className={styles.tagList} aria-label={`${area.title} technologies`}>
                  {area.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.approach} id="approach" aria-labelledby="approach-title">
          <div className={styles.approachVisual}>
            <Image
              src="/images/cloud-structure.png"
              alt="Abstract modular cloud infrastructure with a cobalt data path"
              fill
              sizes="(max-width: 767px) calc(100vw - 2.5rem), (max-width: 1100px) 48vw, 52vw"
            />
          </div>

          <div className={styles.approachCopy}>
            <p className={styles.kicker}>How I work</p>
            <h2 id="approach-title">Useful technology starts with the problem.</h2>
            <p>
              My work brings together a computer science foundation, technical support
              experience, and a growing focus on AI agents and cloud platforms.
            </p>
            <ul className={styles.principles}>
              <li>
                <strong>Start with the workflow.</strong>
                <span>Understand who needs the system and what should improve.</span>
              </li>
              <li>
                <strong>Make complexity maintainable.</strong>
                <span>Choose tools and architecture that a team can support.</span>
              </li>
              <li>
                <strong>Keep learning in public.</strong>
                <span>Document experiments and share progress through GitHub.</span>
              </li>
            </ul>
          </div>
        </section>

        <section className={styles.contact} id="contact" aria-labelledby="contact-title">
          <div>
            <p className={styles.kicker}>Let&apos;s connect</p>
            <h2 id="contact-title">Have a system worth improving?</h2>
          </div>
          <div className={styles.contactCopy}>
            <p>
              I am open to thoughtful conversations about AI engineering, backend systems,
              and cloud-native development.
            </p>
            <a className={styles.primaryAction} href="mailto:programmersafdar@live.com">
              Email Safdar
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
