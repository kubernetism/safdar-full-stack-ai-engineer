import type { Metadata } from "next";
import { BlogArticle } from "../article";
import { summarySections } from "./summary";

export const metadata: Metadata = {
  title: "Who Owns Customer Security? | Syed Safdar Ali Shah",
  description: "How software manufacturers can take ownership of customer security outcomes.",
};

export default function CustomerSecurityOwnershipPost() {
  return <BlogArticle part={3} title="Who owns customer security?" description="Why software makers should take responsibility for the security outcomes their customers experience." image="/images/customer-security-ownership-cover.png" imageAlt="Interlocking metal structures supporting a protected blue element" sourcePages="11–19" sections={summarySections} />;
}
