"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { githubLight } from "@uiw/codemirror-theme-github";
import { useRouter } from "next/navigation";
import { defaultCode } from "@/lib/default";
import { ReloadIcon } from "@radix-ui/react-icons";

export function CodeForm({ readOnly, content }: any) {
  const [value, setValue] = useState(defaultCode);
  const [name, setName] = useState("file");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onChange = React.useCallback((val: any, viewUpdate: any) => {
    console.log("val:", val);
    setValue(val);
  }, []);

  async function submitHandler() {
    try {
      setLoading(true);
      const body = JSON.stringify({
        content: value,
        name: name,
      });
      const req = await fetch(`/api/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });
      const res = await req.json();
      router.push(`http://localhost:3000/snip/${res.IpfsHash}`);
    } catch (error) {
      console.log(error);
      setLoading(false);
      return error;
    }
  }

  function ButtonLoading() {
    return (
      <Button disabled>
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        Please wait
      </Button>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-4">
      <Card className="">
        <div className="bg-secondary flex justify-start align-start w-full">
          <Input
            placeholder="filename + extension"
            className="w-56 m-2 py-0 h-6 text-xs rounded-md"
            onChange={(e: any) => setName(e.target.value)}
          />
        </div>
        <CodeMirror
          className="text-md opacity-60 p-2 sm:w-[600px] sm:h-[700px] w-[350px] h-[450px]"
          height="100%"
          width="100%"
          value={value}
          basicSetup={{
            lineNumbers: false,
            foldGutter: false,
          }}
          extensions={[javascript({ jsx: true })]}
          onChange={onChange}
          theme={githubLight}
          readOnly={readOnly}
        />
      </Card>
      {loading ? (
        ButtonLoading()
      ) : (
        <Button onClick={submitHandler}>Create Snippet</Button>
      )}
    </div>
  );
}
