import type { Metadata } from "next";
import { Impressum } from "@/components/legal/impressum";

export const metadata: Metadata = {
  title: "Imprint — AgentiX Projects",
  alternates: { canonical: "/imprint", languages: { de: "/impressum" } },
};

export default function Page() {
  return <Impressum lang="en" />;
}
