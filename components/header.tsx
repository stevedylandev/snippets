import Link from "next/link";

export function Header() {
  return (
    <div className="flex align-center justify-start w-[350px] sm:w-[600px] mb-4">
      <Link className="font-commitMono text-2xl font-bold" href="/">
        Snippets.so
      </Link>
    </div>
  );
}
