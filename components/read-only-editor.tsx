"use client";

import { Card } from "@/components/ui/card";
import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { githubLight } from "@uiw/codemirror-theme-github";
import { Button } from "./ui/button";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export function ReadOnlyEditor({ content, name }: any) {
  const [copied, setCopied] = useState(false);

  const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));

  async function handleCopy() {
    setCopied(true);
    await wait();
    setCopied(false);
  }

  async function copyToClipboard() {
    navigator.clipboard
      .writeText(content)
      .then(async () => await handleCopy())
      .catch(() => alert("Failed to copy"));
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-4">
      <Card>
        <div className="bg-secondary flex justify-start align-start w-full">
          <Button className="border border-b-0 px-3 pb-1 pt-1.5 cursor-default mt-2 ml-2 h-6 text-xs rounded-t-lg rounded-b-none bg-background text-secondary-foreground hover:bg-background">
            {name}
          </Button>
        </div>
        <div className="relative">
          <Button
            onClick={copyToClipboard}
            className="flex justify-center items-center gap-2 absolute right-2 top-2 z-50 text-xs h-6 bg-secondary text-secondary-foreground hover:bg-card"
          >
            {copied ? (
              <>
                Copied!
                <CheckIcon className="h-3 w-3" />
              </>
            ) : (
              <>
                Copy
                <CopyIcon className="h-3 w-3" />
              </>
            )}
          </Button>
          <CodeMirror
            className="text-md opacity-60 p-2 sm:w-[600px] sm:h-[700px] w-[350px] h-[450px]"
            height="100%"
            width="100%"
            value={content}
            basicSetup={{
              lineNumbers: false,
              foldGutter: false,
              rectangularSelection: false,
            }}
            extensions={[javascript({ jsx: true })]}
            theme={githubLight}
            readOnly
            editable={false}
          />
        </div>
      </Card>
      <Button asChild>
        <Link href="/">Make Another</Link>
      </Button>
    </div>
  );
}
