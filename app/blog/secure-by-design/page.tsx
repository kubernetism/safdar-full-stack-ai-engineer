import type { Metadata } from "next";
import { BlogArticle } from "../article";
import { summarySections } from "./summary";

export const metadata: Metadata = {
  title: "Secure by Design: Building Security In | Syed Safdar Ali Shah",
  description: "A 100-point introduction to secure by design and secure by default, based on the joint cybersecurity guidance led by CISA.",
};

export default function SecureByDesignPost() {
  return (
    <BlogArticle part={1} title="Secure by design: building security in" description="A practical introduction to safer software, from the first design decision to the default settings customers use." image="/images/secure-by-design-cover.png" imageAlt="Layered architectural forms with a protected blue foundation" sourcePages="4–12" sections={summarySections} />
  );
}
