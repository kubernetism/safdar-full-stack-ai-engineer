import type { Metadata } from "next";
import Link from "next/link";
import home from "../home.module.css";
import { Arrow, Dot, Elbow } from "../components/glyphs";
import { PaletteSearch } from "../components/palette-search";
import { SectionHead } from "../components/section-head";
import { SiteFrame } from "../components/site-frame";
import { items, itemsIn, PHASES, SECTION_ORDER, SECTIONS, SOURCE, TIER_ORDER, TIERS } from "./content";
import { FdeChecklist, type ChecklistGroup } from "./fde-checklist";
import { PctChip, TierBadge } from "./pct-chip";
import styles from "./fde.module.css";
import type { PhaseId } from "./types";

export const metadata: Metadata = {
  title: "FDE Roadmap | Syed Safdar Ali Shah",
  description:
    "A Forward Deployed Engineer roadmap, checklist and dictionary: 52 skills from 100 live FDE job postings, grouped into five phases with study notes for each.",
};

const PHASE_IDS: readonly PhaseId[] = [1, 2, 3, 4, 5];

const STEPS = [
  {
    title: "Tick what you already have.",
    text: "Go through the checklist below. Be strict: tick a skill only if you have shipped it, not just read about it.",
  },
  {
    title: "Find your phase.",
    text: "The roadmap orders the skills from foundations to leading delivery. Start at the first phase with gaps.",
  },
  {
    title: "Study one skill at a time.",
    text: "Each skill page has a definition, why it matters for an FDE, a three-level roadmap, guidelines, practice projects, books and interview questions.",
  },
  {
    title: "Prove it with one real project.",
    text: "Postings look for evidence. One end-to-end project with a real user teaches more of this list than any course.",
  },
];

function alphaKey(title: string) {
  return title.replace(/^[^A-Za-z0-9]+/, "").toUpperCase();
}

export default function FdePage() {
  const groups: ChecklistGroup[] = SECTION_ORDER.map((section) => ({
    id: section,
    name: SECTIONS[section].name,
    short: SECTIONS[section].short,
    tiers: TIER_ORDER.map((tier) => ({
      name: TIERS[tier],
      items: itemsIn(section, tier).map((i) => ({
        slug: i.slug,
        sourceId: i.sourceId,
        title: i.title,
        pct: i.pct,
        tier: i.tier,
      })),
    })).filter((t) => t.items.length),
  }));

  const dictionary = [...items].sort((a, b) => alphaKey(a.title).localeCompare(alphaKey(b.title)));
  const letters = [...new Set(dictionary.map((i) => alphaKey(i.title)[0]))];

  return (
    <SiteFrame current="fde">
      <section className={styles.head} aria-labelledby="fde-title">
        <div className="shell">
          <p className={styles.cmd} aria-hidden="true">
            <span className={styles.accent}>&gt;</span> cat ~/fde/roadmap.md
          </p>
          <h1 id="fde-title" className={styles.title}>
            FDE roadmap
          </h1>
          <div className={styles.headGrid}>
            <div className={styles.intro}>
              <p className={home.lede}>
                A Forward Deployed Engineer is a software engineer who works directly with customers, inside
                their systems, to turn a product into a working solution for their problem. The job mixes
                building, integrating and shipping with discovery, communication and delivery.
              </p>
              <p className={styles.introSmall}>
                This guide turns that job into a checklist, a five-phase roadmap and a dictionary, with study
                notes for every skill.
              </p>
            </div>
            <div className={`tool ${styles.source}`}>
              <div className="tool__head">
                <Dot />
                <span>
                  <span className="tool__name">Read</span>
                  <span className="tool__arg">(checklist.data)</span>
                </span>
              </div>
              <div className="tool__body">
                <p className={styles.sourceLine}>
                  Checklist data: <strong>{SOURCE.credit}</strong>, from {SOURCE.basis}.
                </p>
                <p className={styles.sourceNote}>
                  The % on each skill is the share of those postings that mention it. {SOURCE.assumedNote}
                </p>
                <p className={styles.sourceStats}>{items.length} skills · 3 sections · 5 phases</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.block} aria-labelledby="how-title">
        <div className="shell">
          <SectionHead index="01" name="how-to-use" meta="4 steps" />
          <h2 id="how-title" className={styles.blockTitle}>
            How to use this guide
          </h2>
          <ol className={styles.steps} role="list">
            {STEPS.map((step, i) => (
              <li key={step.title} className={styles.step}>
                <span className={styles.stepNum} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <strong>{step.title}</strong> {step.text}
                </span>
              </li>
            ))}
          </ol>
          <p className={styles.takeaway}>
            <Elbow />
            <span>
              The checklist&rsquo;s own takeaway, paraphrased: postings want proof you have done this kind of
              work, so one end-to-end project plus one real customer feedback loop beats learning the skills
              one at a time.
            </span>
          </p>
        </div>
      </section>

      <section className={styles.block} id="roadmap" aria-labelledby="roadmap-title">
        <div className="shell">
          <SectionHead index="02" name="roadmap" meta="5 phases" />
          <h2 id="roadmap-title" className={styles.blockTitle}>
            The roadmap
          </h2>
          <ol className={styles.phases} role="list">
            {PHASE_IDS.map((phase) => {
              const phaseItems = items.filter((i) => i.phase === phase);
              return (
                <li key={phase}>
                  <article className={`tool ${styles.phase}`} aria-labelledby={`phase-${phase}`}>
                    <div className="tool__head">
                      <span className={styles.phaseNum}>Phase {phase}</span>
                      <span className="tool__status">{phaseItems.length} skills</span>
                    </div>
                    <div className={styles.phaseBody}>
                      <h3 id={`phase-${phase}`} className={styles.phaseName}>
                        {PHASES[phase].name}
                      </h3>
                      <p className={styles.phaseGoal}>{PHASES[phase].goal}</p>
                      <ul className={styles.phaseItems} role="list">
                        {phaseItems.map((item) => (
                          <li key={item.slug}>
                            <Link href={`/fde/${item.slug}`}>{shortTitle(item.title)}</Link>
                            <PctChip pct={item.pct} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className={styles.block} id="checklist" aria-labelledby="checklist-title">
        <div className="shell">
          <SectionHead index="03" name="checklist" meta={`${items.length} skills`} />
          <h2 id="checklist-title" className={styles.blockTitle}>
            The checklist
          </h2>
          <p className={styles.blockLede}>
            Grouped by section and priority, as in the source. Tick what you can already prove; the % chip
            opens the study notes.
          </p>
          <FdeChecklist groups={groups} />
        </div>
      </section>

      <section className={styles.dictionaryBlock} id="dictionary" aria-labelledby="dictionary-title">
        <div className="shell">
          <SectionHead index="04" name="dictionary" meta="A–Z" />
          <h2 id="dictionary-title" className={styles.blockTitle}>
            Dictionary
          </h2>
        </div>
        <PaletteSearch
          entries={items.map((i) => ({
            key: i.slug,
            href: `/fde/${i.slug}`,
            kicker: `${i.pct} · ${SECTIONS[i.section].name}`,
            name: i.title,
            summary: i.definition,
            keywords: `${TIERS[i.tier]} ${PHASES[i.phase].name}`,
          }))}
          placeholder="search skills: evals, discovery, kubernetes…"
          noun="skills"
          label="Search the FDE dictionary"
        >
          <div className="shell">
            <nav className={styles.letters} aria-label="Dictionary letters">
              {letters.map((l) => (
                <a key={l} href={`#letter-${l}`}>
                  {l}
                </a>
              ))}
            </nav>
            <dl className={styles.dictionary}>
              {letters.map((letter) => (
                <div key={letter} className={styles.letterGroup} id={`letter-${letter}`}>
                  <p className={styles.letter} aria-hidden="true">
                    {letter}
                  </p>
                  <div className={styles.entries}>
                    {dictionary
                      .filter((i) => alphaKey(i.title)[0] === letter)
                      .map((item) => (
                        <div key={item.slug} className={styles.entry}>
                          <dt>
                            <Link className={styles.term} href={`/fde/${item.slug}`}>
                              {item.title}
                            </Link>
                            <span className={styles.entryMeta}>
                              <TierBadge tier={item.tier} />
                              <PctChip pct={item.pct} />
                            </span>
                          </dt>
                          <dd>{item.definition}</dd>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </dl>
            <p className={styles.dictionaryFoot}>
              <Link className="link" href="/patterns">
                Looking for design patterns instead? Open the patterns library
              </Link>{" "}
              <Arrow size="0.9em" />
            </p>
          </div>
        </PaletteSearch>
      </section>
    </SiteFrame>
  );
}

/** Drop the explanatory tail after a colon so roadmap lists stay scannable. */
function shortTitle(title: string) {
  const cut = title.indexOf(":");
  return cut > 0 ? title.slice(0, cut) : title;
}
