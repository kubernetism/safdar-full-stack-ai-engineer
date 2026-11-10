import type { Metadata } from "next";
import { postBySlug } from "../../content";
import { BlogArticle } from "../article";
import { summarySections } from "./summary";

export const metadata: Metadata = {
  title: "Who Owns Customer Security? | Syed Safdar Ali Shah",
  description: "How software manufacturers can take ownership of customer security outcomes.",
};

export default function CustomerSecurityOwnershipPost() {
  return <BlogArticle post={postBySlug("customer-security-ownership")} sections={summarySections} />;
}
