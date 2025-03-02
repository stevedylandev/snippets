"use client";

import { Card } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
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
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import type { LanguageName } from "@uiw/codemirror-extensions-langs";
import sdk from '@farcaster/frame-sdk';

type ReadOnlyEditorProps = {
  content: string;
  name: string;
  cid: string;
  lang: LanguageName;
  futureDate?: Date;
  slug?: string;
};

export function ReadOnlyEditor({
  content,
  name,
  cid,
  lang,
  futureDate,
  slug,
}: ReadOnlyEditorProps) {
  const [copied, setCopied] = useState(false);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);


  let fileSlug = slug;
  if (slug === "") {
    fileSlug = cid;
  }

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
    try {
      // Check if we have permission to use clipboard
      if (navigator.clipboard && navigator.permissions) {
        const permissionStatus = await navigator.permissions.query({ name: 'clipboard-write' as PermissionName });

        if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
          await navigator.clipboard.writeText(content);
          await handleCopy();
          return;
        }
      }

      // Fallback method using execCommand (deprecated but works in more contexts)
      const textArea = document.createElement('textarea');
      textArea.value = content;
      textArea.style.position = 'fixed';  // Avoid scrolling to bottom
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        await handleCopy();
      } else {
        alert("Failed to copy: Your browser may be blocking clipboard access");
      }
    } catch (err) {
      console.error("Copy failed:", err);
      alert("Failed to copy: " + (err instanceof Error ? err.message : String(err)));
    }
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

  useEffect(() => {
    const load = async () => {
      sdk.actions.ready();
      sdk.actions.addFrame()
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

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
            className="text-md opacity-75 p-2 lg:w-[750px] md:w-[600px] sm:h-[700px] w-[350px] h-[450px] font-commitMono"
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
        <p className="text-muted-foreground font-commitMono">
          {futureDate &&
            `Expires: ${futureDate.toLocaleDateString()} ${futureDate.toLocaleTimeString()}`}
        </p>
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
          <ShareModal url={`https://snippets.so/snip/${slug}`} />
        </div>
      </Dialog>
    </div>
  );
}
