import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Sora, Syncopate } from "next/font/google";
import "./globals.css";
import { MotionRoot } from "./components/ui/motion";
import { SoundProvider } from "./components/ui/sound";

// wide, tracked capitals: the film-title voice
const title = Syncopate({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-syncopate",
  display: "swap",
});

// narration and body
const sans = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

// mission-log and instrument readouts
const mono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fazal Singh",
  description:
    "Fazal Singh, full stack engineer. Built Carpetstory’s store, an AI marketing platform, and a CRM two companies run their sales on.",
};

// browser chrome and scrollbars match the void
export const viewport: Viewport = {
  themeColor: "#03040a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${title.variable} ${sans.variable} ${mono.variable} font-sans text-star antialiased`}
      >
        <SoundProvider>
          <MotionRoot>{children}</MotionRoot>
        </SoundProvider>
      </body>
    </html>
  );
}
