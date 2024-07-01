import { CodeForm } from "@/components/code-form";

export default async function Page({ params }: { params: { cid: string } }) {
  const cid = params.cid;
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <CodeForm readOnly={true} />
    </main>
  );
}
