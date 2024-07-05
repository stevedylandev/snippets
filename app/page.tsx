import { CodeForm } from "@/components/code-form";
import { Header } from "@/components/header";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col sm:items-center items-start justify-center">
      <Header />
      <CodeForm readOnly={false} content="console.log('hello world!')" />
    </main>
  );
}
