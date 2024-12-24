import "@repo/ui/globals.css";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import type { Metadata } from "next";
import { ThemeProvider } from "@repo/ui/components/theme-provider";

export const metadata: Metadata = {
  title: "PayFlow",
  description: "Send Payments Worldwide 10X Faster",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
      </body>
    </html>
  );
}


