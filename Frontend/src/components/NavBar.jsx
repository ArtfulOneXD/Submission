// src/components/NavBar.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react"; // for mobile toggle, if you like

export function NavBar() {
  const pathname = usePathname();
  const isActive = (href) => href === pathname;

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur shadow-md dark:bg-black/80 dark:text-white sticky top-0 z-50">
      {/* ←— logo/title is now a clickable Link */}
      <Link href="/" className="text-2xl font-bold text-blue-600 hover:opacity-80 transition">
        CrowdX
      </Link>

      {/* your nav links */}
      <div className="hidden md:flex gap-6 text-sm font-medium">
        <Link
          href="/dashboard"
          className={`hover:text-blue-600 transition ${isActive("/signup") ? "text-blue-600" : ""}`}
        >
          Dashboard
        </Link>
        <Link
          href="/login"
          className={`hover:text-blue-600 transition ${isActive("/login") ? "text-blue-600" : ""}`}
        >
          Login
        </Link>
        <Link
          href="/about"
          className={`hover:text-blue-600 transition ${isActive("/about") ? "text-blue-600" : ""}`}
        >
          About
        </Link>
      </div>

      {/* (optional) mobile menu toggle */}
      <div className="md:hidden">
        {/* your menu icon here */}
        <Menu className="w-6 h-6" />
      </div>
    </nav>
  );
}
