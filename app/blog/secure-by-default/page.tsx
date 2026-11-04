import type { Metadata } from "next";
import { BlogArticle } from "../article";
import { summarySections } from "./summary";

export const metadata: Metadata = {
  title: "Secure by Default: The Safer Starting Point | Syed Safdar Ali Shah",
  description: "A practical guide to secure defaults, based on the joint Secure by Design guidance.",
};

export default function SecureByDefaultPost() {
  return <BlogArticle part={2} title="Secure by default: the safer starting point" description="How secure settings and thoughtful choices protect customers from the moment software is installed." image="/images/secure-by-default-cover.png" imageAlt="An engineered structure with protective layers already in place" sourcePages="8–9 and 30–32" sections={summarySections} />;
}
