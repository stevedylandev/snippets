"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { githubLight } from "@uiw/codemirror-theme-github";

export function CodeForm({ readOnly, content }: any) {
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
      <Card>
        <CodeMirror
          className="text-md opacity-60 p-2"
          value={value}
          height="800px"
          width="600px"
          basicSetup={{
            lineNumbers: false,
            foldGutter: false,
            rectangularSelection: false,
          }}
          extensions={[javascript({ jsx: true })]}
          onChange={onChange}
          theme={githubLight}
          readOnly={readOnly}
        />
      </Card>
      <Button onClick={submitHandler}>Submit</Button>
    </div>
  );
}
