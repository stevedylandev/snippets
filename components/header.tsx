"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <div className="flex align-center justify-between mt-4 w-[350px] sm:w-[600px] mb-4">
      <Link className="font-commitMono text-2xl font-bold" href="/">
        Snippets.so
      </Link>
      <ThemeToggle />
    </div>
  );
}
