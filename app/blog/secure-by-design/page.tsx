import type { Metadata } from "next";
import { postBySlug } from "../../content";
import { BlogArticle } from "../article";
import { summarySections } from "./summary";

export const metadata: Metadata = {
  title: "Secure by Design: Building Security In | Syed Safdar Ali Shah",
  description:
    "A 100-point introduction to secure by design and secure by default, based on the joint cybersecurity guidance led by CISA.",
};

export default function SecureByDesignPost() {
  return <BlogArticle post={postBySlug("secure-by-design")} sections={summarySections} />;
}
