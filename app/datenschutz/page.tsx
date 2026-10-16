import type { Metadata } from "next";
import { Privacy } from "@/components/legal/privacy";

export const metadata: Metadata = {
  title: "Datenschutzerklärung — AgentiX Projects",
  alternates: { canonical: "/datenschutz", languages: { en: "/privacy" } },
};

export default function Page() {
  return <Privacy lang="de" />;
}
