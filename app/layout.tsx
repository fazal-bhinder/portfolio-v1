import type { Metadata } from "next";
import { Space_Grotesk, Anton, Space_Mono, Unbounded, Saira_Extra_Condensed, Teko } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./theme/themeswitch";
import SmoothScroll from "./components/ui/smoothscroll";
import { SoundProvider } from "./components/ui/sound";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const logoFont = Unbounded({
  weight: "800",
  subsets: ["latin"],
  variable: "--font-unbounded",
  display: "swap",
});

const saira = Saira_Extra_Condensed({
  weight: ["800", "900"],
  subsets: ["latin"],
  variable: "--font-saira",
  display: "swap",
});

const teko = Teko({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-teko",
  display: "swap",
});

const spacemono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-spacemono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "fazal singh",
  description: "portfolio of Fazal Singh, a full stack engineer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${grotesk.variable} ${anton.variable} ${spacemono.variable} ${logoFont.variable} ${saira.variable} ${teko.variable} font-sans antialiased tracking-[-0.01em] bg-bone text-ink dark:bg-ink dark:text-bone`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <SoundProvider>
            <SmoothScroll />
            {children}
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
