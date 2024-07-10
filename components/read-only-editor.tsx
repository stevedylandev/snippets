"use client";

import { Card } from "@/components/ui/card";
import { useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { githubLight } from "@uiw/codemirror-theme-github";
import { Button } from "./ui/button";
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  Share1Icon,
} from "@radix-ui/react-icons";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { ShareModal } from "./share-modal";
import {
  loadLanguage,
  langNames,
  langs,
} from "@uiw/codemirror-extensions-langs";
import { languages } from "@/lib/languages";

export function ReadOnlyEditor({ content, name, cid, lang }: any) {
  const [copied, setCopied] = useState(false);

  const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));

  const languageExtension = useMemo(() => {
    const extension = loadLanguage(lang);
    return extension ? [extension] : [];
  }, [lang]);

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

  function downloadContent() {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-4">
      <Dialog>
        <Card className="overflow-hidden">
          <div className="bg-secondary flex justify-between align-center w-full">
            <Button className="border border-b-0 px-3 pb-1 pt-1.5 cursor-default mt-2 ml-2 h-6 text-xs rounded-t-lg rounded-b-none bg-background text-secondary-foreground hover:bg-background">
              {name}
            </Button>
          </div>
          <CodeMirror
            className="text-md opacity-75 p-2 sm:w-[600px] sm:h-[700px] w-[350px] h-[450px] font-commitMono"
            height="100%"
            width="100%"
            value={content}
            basicSetup={{
              lineNumbers: false,
              foldGutter: false,
              rectangularSelection: false,
            }}
            extensions={languageExtension}
            theme={githubLight}
            readOnly
            editable={false}
          />
        </Card>
        <div className="flex align-center gap-4 my-4">
          <Button onClick={copyToClipboard} className="flex gap-2" size="sm">
            {copied ? (
              <>
                <CheckIcon className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <CopyIcon className="h-4 w-4" />
                Copy
              </>
            )}
          </Button>
          <Button onClick={downloadContent} className="flex gap-2" size="sm">
            <DownloadIcon className="h-4 w-5" />
            Download
          </Button>
          <DialogTrigger>
            <Button className="flex gap-2" size="sm">
              <Share1Icon className="h-4 w-4" />
              Share
            </Button>
          </DialogTrigger>
          <ShareModal url={`https://snippets.so/snip/${cid}`} />
        </div>
      </Dialog>
    </div>
  );
}
