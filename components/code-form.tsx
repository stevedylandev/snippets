"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import CodeMirror from "@uiw/react-codemirror";
import { githubLight } from "@uiw/codemirror-theme-github";
import { useRouter } from "next/navigation";
import { defaultCode } from "@/lib/default";
import {
  CheckIcon,
  ReloadIcon,
  EyeOpenIcon,
  EyeClosedIcon,
} from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import type { LanguageName } from "@uiw/codemirror-extensions-langs";
import { languages } from "@/lib/languages";
import sdk from '@farcaster/frame-sdk';


type CodeFormProps = {
  readOnly: boolean;
  content: string;
};

const times = [
  {
    displayName: "No Expiration",
    value: "0",
  },
  {
    displayName: "10 Minutes",
    value: "600",
  },
  {
    displayName: "1 Hour",
    value: "3600",
  },
  {
    displayName: "10 Hours",
    value: "36000",
  },
  {
    displayName: "1 Day",
    value: "86400",
  },
  {
    displayName: "10 Days",
    value: "864000",
  },
];

export function CodeForm({ readOnly, content }: CodeFormProps) {
  const [value, setValue] = useState(defaultCode);
  const [name, setName] = useState("file");
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [lang, setLang] = useState<LanguageName>("tsx");
  const [time, setTime] = useState<string>("0");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  const languageExtension = useMemo(() => {
    const extension = loadLanguage(lang);
    return extension ? [extension] : [];
  }, [lang]);

  const onChange = useCallback((val: string) => {
    console.log("val:", val);
    setValue(val);
  }, []);

  async function submitHandler() {
    try {
      setLoading(true);
      let isPrivate = "true";
      if (time === "0" || password === "") {
        isPrivate = "false";
      }
      const body = JSON.stringify({
        content: value,
        name: name,
        lang: lang,
        isPrivate: isPrivate,
        expires: time,
        password: password || "",
      });
      const req = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });
      const res = await req.json();
      setComplete(true);
      router.push(`/snip/${res.slug}`);
    } catch (error) {
      console.log(error);
      setLoading(false);
      return error;
    }
  }

  useEffect(() => {
    const load = async () => {
      sdk.actions.ready();
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);



  function ButtonLoading() {
    return (
      <Button disabled>
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        Please wait
      </Button>
    );
  }
  function ButtonComplete() {
    return (
      <Button disabled className="bg-green-600">
        <CheckIcon className="mr-2 h-4 w-4" />
        Complete!
      </Button>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-4 mb-6">
      <Card className="overflow-hidden">
        <div className="bg-secondary flex justify-between align-start w-full">
          <Input
            placeholder="filename + extension"
            className="w-56 m-2 py-0 h-6 text-xs rounded-md"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          />
          <Select
            onValueChange={(e: LanguageName) => setLang(e)}
            defaultValue="typescript"
          >
            <SelectTrigger className="w-[125px] h-6 m-2 text-xs rounded-md">
              <SelectValue placeholder="language" />
            </SelectTrigger>
            <SelectContent className="text-xs">
              {languages.map((object) => (
                <SelectItem
                  key={object.value}
                  className="text-xs"
                  value={object.value}
                >
                  {object.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <CodeMirror
          className="text-md opacity-75 p-2 lg:w-[750px] sm:h-[700px] md:w-[600px] w-[350px] h-[450px]"
          height="100%"
          width="100%"
          value={value}
          basicSetup={{
            lineNumbers: false,
            foldGutter: false,
          }}
          extensions={languageExtension}
          onChange={onChange}
          theme={githubLight}
          readOnly={readOnly}
        />
      </Card>
      {loading && !complete && ButtonLoading()}
      {!loading && !complete && (
        <>
          <div className="items-center flex flex-col gap-4">
            <Select onValueChange={(e: string) => setTime(e)}>
              <SelectTrigger className="h-8 m-2 text-xs">
                <SelectValue placeholder="Expiration" />
              </SelectTrigger>
              <SelectContent>
                {times.map((object) => (
                  <SelectItem
                    className="text-xs"
                    key={object.value}
                    value={object.value}
                  >
                    {object.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative w-full">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password (optional)"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full font-commitMono h-8 text-xs pr-10" // Added pr-10 for padding on the right
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeClosedIcon className="h-4 w-4" />
                ) : (
                  <EyeOpenIcon className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <Button onClick={submitHandler}>Create Snippet</Button>
        </>
      )}
      {loading && complete && ButtonComplete()}
    </div>
  );
}
