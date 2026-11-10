import Image from "next/image";
import Link from "next/link";
import {
  credentials,
  focusAreas,
  goals,
  posts,
  principles,
  profile,
  projects,
  SERIES,
  skills,
  systems,
  type Project,
} from "./content";
import { Arrow, Check, Cursor, Dot, Elbow, Spark, TodoBox } from "./components/glyphs";
import { Intro } from "./components/intro/intro";
import { seconds, T } from "./components/intro/timeline";
import { PostRow } from "./components/post-row";
import { SectionHead } from "./components/section-head";
import { SiteFrame } from "./components/site-frame";
import { Sprite } from "./components/sprite";
import styles from "./home.module.css";

const MARQUEE = ["Agents SDK", "MCP", "FastAPI", "Claude Code", "Docker", "Kubernetes", "Dapr", "CrewAI"];

export default function Home() {
  return (
    <SiteFrame before={<Intro />}>
      <Hero />
      <Marquee />
      <About />
      <Work />
      <Skills />
      <Writing />
      <Contact />
    </SiteFrame>
  );
}

function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title" style={{ "--t-exit": seconds(T.exit) }}>
      <div className={`shell ${styles.heroMeta}`} aria-hidden="true">
        <span>
          <span className={styles.accent}>&gt;</span> whoami
        </span>
        <span className={styles.heroMetaRight}>{profile.location}</span>
      </div>

      <div className="shell">
        <h1 id="hero-title" className={styles.name}>
          <span className={styles.namePre}>Syed</span> <span className={styles.nameLine}>Safdar</span>{" "}
          <span className={styles.nameLine}>
            Ali Shah
            <Cursor />
          </span>
        </h1>
      </div>

      <div className={styles.heroGrid}>
        <div className={styles.heroCopy}>
          <p className={styles.tagline}>{profile.tagline}</p>
          <p className={styles.summary}>{profile.summary}</p>
          <div className={styles.actions}>
            <a className="btn btn--accent" href="#work">
              See the work <Arrow />
            </a>
            <a className="btn btn--ghost" href={`mailto:${profile.email}`}>
              Email Safdar
            </a>
          </div>
        </div>

        <div className={styles.heroSide}>
          <div className={styles.perch}>
            <div className={styles.bubble} aria-hidden="true">
              <span className={styles.accent}>/rebuild</span> to watch me build this
            </div>
            <Sprite className={styles.heroSprite} size={112} mode="idle" />
            <div className={`tool ${styles.profileCard}`}>
              <div className="tool__head">
                <Dot />
                <span>
                  <span className="tool__name">Read</span>
                  <span className="tool__arg">(profile.md)</span>
                </span>
                <span className="tool__status">4 lines</span>
              </div>
              <dl className={styles.profile}>
                <div>
                  <dt>role</dt>
                  <dd>{profile.role}</dd>
                </div>
                <div>
                  <dt>focus</dt>
                  <dd>Agentic apps · backend APIs · cloud-native</dd>
                </div>
                <div>
                  <dt>based</dt>
                  <dd>{profile.location}</dd>
                </div>
                <div>
                  <dt>status</dt>
                  <dd className={styles.statusOpen}>Open to conversations</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const set = (
    <span className={styles.marqueeSet}>
      {MARQUEE.map((item) => (
        <span key={item} className={styles.marqueeItem}>
          {item}
          <Spark className={styles.marqueeSpark} />
        </span>
      ))}
    </span>
  );
  return (
    <div className={styles.marquee} aria-hidden="true">
      <div className={styles.marqueeTrack}>
        {set}
        {set}
      </div>
    </div>
  );
}

function About() {
  return (
    <section id="about" className={styles.section} aria-labelledby="about-title">
      <div className="shell">
        <SectionHead index="01" name="about" meta="project memory" />
        <div className={styles.aboutGrid}>
          <div className={styles.aboutIntro}>
            <h2 id="about-title" className={styles.display}>
              CLAUDE<span className={styles.fileExt}>.md</span>
            </h2>
            <p className={styles.lede}>
              The file every session starts from: what I focus on and the rules I build by.
            </p>
          </div>

          <article className={styles.file} aria-label="CLAUDE.md">
            <div className={styles.fileTab} aria-hidden="true">
              <span className={styles.fileTabName}>CLAUDE.md</span>
              <span className={styles.fileTabPath}>~/safdar</span>
            </div>
            <div className={styles.fileBody}>
              <p className={`${styles.ln} ${styles.lnH1}`}>
                <span className={styles.md}># </span>How I work
              </p>
              <p className={styles.ln} aria-hidden="true" />
              <p className={`${styles.ln} ${styles.lnQuote}`}>
                <span className={styles.md}>&gt; </span>
                {profile.background}
              </p>
              <p className={styles.ln} aria-hidden="true" />
              <h3 className={`${styles.ln} ${styles.lnH2}`}>
                <span className={styles.md}>## </span>Focus
              </h3>
              {focusAreas.map((area) => (
                <div key={area.title} className={styles.lnGroup}>
                  <h4 className={`${styles.ln} ${styles.lnH3}`}>
                    <span className={styles.md}>### </span>
                    {area.title}
                  </h4>
                  <p className={styles.ln}>{area.text}</p>
                  <p className={`${styles.ln} ${styles.lnTags}`}>
                    <span className={styles.md}>- </span>
                    <span className={styles.lnKey}>stack:</span>
                    <span className={styles.lnTagList}>
                      {area.tags.map((tag) => (
                        <code key={tag}>{tag}</code>
                      ))}
                    </span>
                  </p>
                </div>
              ))}
              <p className={styles.ln} aria-hidden="true" />
              <h3 className={`${styles.ln} ${styles.lnH2}`}>
                <span className={styles.md}>## </span>Rules
              </h3>
              <ol className={styles.rules} role="list">
                {principles.map((rule, i) => (
                  <li key={rule.title} className={styles.ln}>
                    <span className={styles.md}>{i + 1}. </span>
                    <strong>{rule.title}</strong> {rule.text}
                  </li>
                ))}
              </ol>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function Work() {
  const total = projects.length + systems.length;
  return (
    <section id="work" className={styles.section} aria-labelledby="work-title">
      <div className="shell">
        <SectionHead index="02" name="work" meta={`${total} results`} />
        <div className={styles.sectionIntro}>
          <h2 id="work-title" className={styles.display}>
            Work
          </h2>
          <p className={styles.lede}>
            {projects.length} websites and {systems.length} business systems, logged the way a session logs
            its tool calls.
          </p>
        </div>

        <ol className={styles.projects} role="list">
          {projects.map((project, i) => (
            <li key={project.slug} className={i === 0 ? styles.projectFeatured : undefined}>
              <ProjectCard project={project} index={i} />
            </li>
          ))}
        </ol>

        <h3 className={styles.systemsTitle}>
          <span className={styles.accent} aria-hidden="true">
            ##{" "}
          </span>
          Business systems
        </h3>
        <ol className={styles.systems} role="list">
          {systems.map((system) => (
            <li key={system.slug}>
              <article className={`tool ${styles.system}`} aria-labelledby={`system-${system.slug}`}>
                <div className="tool__head">
                  <Dot />
                  <span>
                    <span className="tool__name">Ship</span>
                    <span className="tool__arg">({system.name})</span>
                  </span>
                  <span className="tool__status">
                    <Check size="0.9em" /> done
                  </span>
                </div>
                <div className={styles.projectBody}>
                  <p className="result">
                    <Elbow />
                    {system.kind}
                  </p>
                  <h4 id={`system-${system.slug}`} className={styles.systemName}>
                    {system.name}
                  </h4>
                  <p className={styles.projectText}>{system.description}</p>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const host = project.href ? new URL(project.href).host : null;
  return (
    <article className={`tool ${styles.project}`} aria-labelledby={`project-${project.slug}`}>
      <div className="tool__head">
        <Dot />
        <span>
          <span className="tool__name">Ship</span>
          <span className="tool__arg">({host ?? project.name})</span>
        </span>
        <span className="tool__status">
          <Check size="0.9em" /> {project.href ? "live" : "done"}
        </span>
      </div>
      <figure className={styles.shot} data-tall={project.image.height > project.image.width ? "" : undefined}>
        <Image
          src={project.image.src}
          alt={project.image.alt}
          width={project.image.width}
          height={project.image.height}
          sizes={
            index === 0
              ? "(max-width: 860px) calc(100vw - 2rem), 760px"
              : "(max-width: 860px) calc(100vw - 2rem), 680px"
          }
        />
        {project.image.height > project.image.width ? (
          <figcaption className={styles.shotTag} aria-hidden="true">
            {String(index + 1).padStart(2, "0")} · hover to scroll
          </figcaption>
        ) : null}
      </figure>
      <div className={styles.projectBody}>
        <p className="result">
          <Elbow />
          {project.kind}
        </p>
        <h3 id={`project-${project.slug}`} className={styles.projectName}>
          {project.name}
        </h3>
        <p className={styles.projectText}>{project.description}</p>
        <ul className="diff" role="list" aria-label={`${project.name} highlights`}>
          {project.features.map((feature) => (
            <li key={feature} className="diff__line" data-op="add">
              {feature}
            </li>
          ))}
        </ul>
        {project.href ? (
          <a
            className={`btn btn--accent ${styles.visit}`}
            href={project.href}
            target="_blank"
            rel="noreferrer"
          >
            Visit live site <Arrow direction="up-right" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ) : null}
      </div>
    </article>
  );
}

function Skills() {
  return (
    <section id="skills" className={styles.section} aria-labelledby="skills-title">
      <div className="shell">
        <SectionHead index="03" name="skills" meta={`${skills.length} commands`} />
        <div className={styles.skillsGrid}>
          <div className={styles.skillsMain}>
            <h2 id="skills-title" className={styles.display}>
              Skills
            </h2>
            <div className={styles.palette}>
              <div className={styles.paletteInput} aria-hidden="true">
                <span className={styles.accent}>/</span>
                <Cursor />
                <span className={styles.palettePlaceholder}>commands I reach for</span>
              </div>
              <ul className={styles.commands} role="list">
                {skills.map((skill) => (
                  <li key={skill.command} className={styles.command}>
                    <code className={styles.commandName}>/{skill.command}</code>
                    <span className={styles.commandLabel}>{skill.label}</span>
                    <span className={styles.commandText}>{skill.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.skillsSide}>
            <h3 className={styles.subhead}>Certifications &amp; education</h3>
            <div className="tool">
              <div className="tool__head">
                <Dot />
                <span>
                  <span className="tool__name">Bash</span>
                  <span className="tool__arg">(ls ~/certs)</span>
                </span>
              </div>
              <ul className={styles.certs} role="list">
                {credentials.map((cred) => (
                  <li key={cred.title} className={styles.cert}>
                    <span className={styles.certYear}>{cred.year ?? "····"}</span>
                    <span className={styles.certTitle}>{cred.title}</span>
                    <span className={styles.certIssuer}>{cred.issuer}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`tool ${styles.todos}`}>
              <div className="tool__head">
                <Dot tone="accent" />
                <span>
                  <span className="tool__name">Update Todos</span>
                </span>
              </div>
              <ul className={styles.todoList} role="list" aria-label="Next certifications">
                {goals.map((goal) => (
                  <li key={goal.title}>
                    <TodoBox />
                    <span>
                      {goal.title} <span className={styles.todoTarget}>target {goal.target}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Writing() {
  return (
    <section id="writing" className={styles.section} aria-labelledby="writing-title">
      <div className="shell">
        <SectionHead index="04" name="blog" meta={`${SERIES.name} · ${posts.length} of ${SERIES.parts}`} />
        <div className={styles.sectionIntro}>
          <h2 id="writing-title" className={styles.display}>
            Writing
          </h2>
          <p className={styles.lede}>
            Notes on software security, AI agents, backend systems, and building for the cloud.
          </p>
          <Link className={`btn btn--ghost ${styles.allPosts}`} href="/blog">
            All articles <Arrow />
          </Link>
        </div>
      </div>
      <ol className={styles.posts} role="list">
        {posts.map((post) => (
          <li key={post.slug}>
            <PostRow post={post} />
          </li>
        ))}
      </ol>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className={`${styles.section} ${styles.contact}`} aria-labelledby="contact-title">
      <div className="shell">
        <SectionHead index="05" name="contact" meta="awaiting input" />
        <div className={styles.contactGrid}>
          <div>
            <h2 id="contact-title" className={styles.contactTitle}>
              Have a system worth improving?
            </h2>
            <p className={styles.lede}>{profile.availability}</p>
          </div>

          <div className={styles.prompt} role="group" aria-labelledby="contact-ask">
            <p className={styles.promptTitle} aria-hidden="true">
              Contact
            </p>
            <p id="contact-ask" className={styles.promptAsk}>
              Start a conversation with Safdar?
            </p>
            <ol className={styles.options} role="list">
              <li>
                <a href={`mailto:${profile.email}`}>
                  <span className={styles.caret} aria-hidden="true">
                    &gt;
                  </span>
                  <span className={styles.optNum} aria-hidden="true">
                    1.
                  </span>
                  <span>
                    Yes, email <strong className={styles.email}>{profile.email}</strong>
                  </span>
                </a>
              </li>
              <li>
                <a href={profile.linkedin} target="_blank" rel="noreferrer">
                  <span className={styles.caret} aria-hidden="true">
                    &gt;
                  </span>
                  <span className={styles.optNum} aria-hidden="true">
                    2.
                  </span>
                  <span>Yes, connect on LinkedIn</span>
                  <Arrow direction="up-right" size="0.9em" />
                </a>
              </li>
              <li>
                <a href={profile.github} target="_blank" rel="noreferrer">
                  <span className={styles.caret} aria-hidden="true">
                    &gt;
                  </span>
                  <span className={styles.optNum} aria-hidden="true">
                    3.
                  </span>
                  <span>Read my code on GitHub</span>
                  <Arrow direction="up-right" size="0.9em" />
                </a>
              </li>
            </ol>
            <p className={styles.promptHint} aria-hidden="true">
              Tab to move · Enter to select
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
