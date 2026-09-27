import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./peeks.css";
import "./site.css";
import { ThemeProvider, themeBootScript } from "@/lib/theme";
import { ScrollRuntime } from "@/components/ui/scroll-runtime";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-face",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://agentixprojects.com"),
  title: "Agentix Projects — Two agents. One project.",
  description:
    "AgXP pairs an AI Consultant with an AI Coach on the same transformation project. They run the interview, you answer, and the documents build themselves.",
  applicationName: "Agentix Projects",
  keywords: [
    "Agentix Projects",
    "AgXP",
    "AI consultant",
    "AI change coach",
    "transformation concept",
    "change plan",
  ],
  openGraph: {
    title: "Agentix Projects — Two agents. One project.",
    description:
      "An AI Consultant and an AI Coach, working your transformation through with you. Currently in closed beta.",
    type: "website",
    siteName: "Agentix Projects",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agentix Projects — Two agents. One project.",
    description: "An AI Consultant and an AI Coach, working your transformation through with you.",
  },
  icons: {
    icon: [{ url: "/mark.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF9" },
    { media: "(prefers-color-scheme: dark)", color: "#121316" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Applies the stored theme and accent before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>
        <ThemeProvider>
          <ScrollRuntime />
          {children}
          <div className="grain" aria-hidden="true" />
        </ThemeProvider>
      </body>
    </html>
  );
}
