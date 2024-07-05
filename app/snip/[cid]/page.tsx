import { Header } from "@/components/header";
import { ReadOnlyEditor } from "@/components/read-only-editor";

async function fetchData(cid: string) {
  try {
    const req = await fetch(`https://snippets.mypinata.cloud/ipfs/${cid}`);
    const res = await req.json();
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export default async function Page({ params }: { params: { cid: string } }) {
  const cid = params.cid;
  const data = await fetchData(cid);
  return (
    <main className="flex min-h-screen flex-col items-center sm:justify-center justify-start">
      <Header />
      <ReadOnlyEditor
        content={data.content}
        name={data.name}
        cid={cid}
        lang={data.lang}
      />
    </main>
  );
}
