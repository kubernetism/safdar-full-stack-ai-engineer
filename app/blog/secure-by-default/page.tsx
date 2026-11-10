import type { Metadata } from "next";
import { postBySlug } from "../../content";
import { BlogArticle } from "../article";
import { summarySections } from "./summary";

export const metadata: Metadata = {
  title: "Secure by Default: The Safer Starting Point | Syed Safdar Ali Shah",
  description: "A practical guide to secure defaults, based on the joint Secure by Design guidance.",
};

export default function SecureByDefaultPost() {
  return <BlogArticle post={postBySlug("secure-by-default")} sections={summarySections} />;
}
