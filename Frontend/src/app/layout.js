// src/app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/components/authProvider";
import { ThemeProvider } from "@/components/themeProvider";
import { NavBar } from "@/components/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CrowdX",
  description: "On‑chain crowdfunding",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning={true}
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {/* ← NavBar will now appear on every page */}
            <NavBar />

            {/* your page’s content */}
            <main className="pt-4">{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
