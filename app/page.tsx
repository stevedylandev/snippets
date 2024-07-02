import { CodeForm } from "@/components/code-form";
import { Pinnie } from "@/components/pinnie";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <CodeForm readOnly={false} content="console.log('hello world!')" />
      <Pinnie />
    </main>
  );
}
