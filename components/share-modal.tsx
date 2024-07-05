"use client";

import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function ShareModal({ url }: any) {
  const [copied, setCopied] = useState(false);

  const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));

  async function handleCopy() {
    setCopied(true);
    await wait();
    setCopied(false);
  }

  async function copyToClipboard() {
    navigator.clipboard
      .writeText(url)
      .then(async () => await handleCopy())
      .catch(() => alert("Failed to copy"));
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Share link</DialogTitle>
        <DialogDescription>
          Anyone who has this link will be able to view this.
        </DialogDescription>
      </DialogHeader>
      <div className="flex items-center space-x-2">
        <div className="grid flex-1 gap-2">
          <Label htmlFor="link" className="sr-only">
            Link
          </Label>
          <Input id="link" defaultValue={url} readOnly />
        </div>
        <Button
          onClick={copyToClipboard}
          type="submit"
          size="sm"
          className="px-3"
        >
          <span className="sr-only">Copy</span>
          {copied ? (
            <CheckIcon className="h-4 w-4" />
          ) : (
            <CopyIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
      <DialogFooter className="sm:justify-start">
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
