import "./globals.css";
import "@repo/ui/styles.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import SessionProvider from "../utils/SessionProvider";
import { ThemeProvider } from "../components/theme-provider";
import { SidebarProvider } from '@repo/ui/components/sidebar'

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NotesApp",
  description: "Capture your thoughts with clarity.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>{children}</SidebarProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
