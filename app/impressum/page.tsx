import type { Metadata } from "next";
import { Impressum } from "@/components/legal/impressum";

export const metadata: Metadata = {
  title: "Impressum — AgentiX Projects",
  alternates: { canonical: "/impressum", languages: { en: "/imprint" } },
};

export default function Page() {
  return <Impressum lang="de" />;
}
