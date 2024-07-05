import { CodeForm } from "@/components/code-form";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start sm:justify-center">
      <Header />
      <CodeForm readOnly={false} content="console.log('hello world!')" />
      <Footer />
    </main>
  );
}
