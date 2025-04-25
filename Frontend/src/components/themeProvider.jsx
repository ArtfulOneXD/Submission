"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }) {
  return (
    <NextThemesProvider
      attribute="class"         // 👈 adds 'dark' class to <html>
      defaultTheme="system"     // 👈 uses system preference
      enableSystem={true}       // 👈 allows switching based on OS
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
