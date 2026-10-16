import type { Metadata } from "next";
import { Privacy } from "@/components/legal/privacy";

export const metadata: Metadata = {
  title: "Privacy policy — AgentiX Projects",
  alternates: { canonical: "/privacy", languages: { de: "/datenschutz" } },
};

export default function Page() {
  return <Privacy lang="en" />;
}
