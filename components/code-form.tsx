"use client";

import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { Button } from "@/components/ui/button";
import { githubDark } from "@uiw/codemirror-theme-github";

export function CodeForm({ readOnly }: any) {
  const [value, setValue] = React.useState("console.log('hello world!');");

  const onChange = React.useCallback((val: any, viewUpdate: any) => {
    console.log("val:", val);
    setValue(val);
  }, []);

  async function submitHandler() {
    try {
      const body = JSON.stringify({
        data: value,
      });
      const req = await fetch(`/api/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });
      const res = await req.json();
      console.log(res);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-4">
      <CodeMirror
        value={value}
        height="500px"
        width="500px"
        theme={githubDark}
        basicSetup={{
          foldGutter: false,
        }}
        extensions={[javascript({ jsx: true })]}
        onChange={onChange}
        readOnly={readOnly}
      />
      <Button onClick={submitHandler}>Submit</Button>
    </div>
  );
}
