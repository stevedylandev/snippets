"use client";

import { Card } from "@/components/ui/card";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { githubLight } from "@uiw/codemirror-theme-github";

export function ReadOnlyEditor({ content }: any) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-4">
      <Card>
        <CodeMirror
          className="text-md opacity-60 p-2"
          value={content}
          height="800px"
          width="600px"
          basicSetup={{
            lineNumbers: false,
            foldGutter: false,
            rectangularSelection: false,
          }}
          extensions={[javascript({ jsx: true })]}
          theme={githubLight}
          readOnly={true}
        />
      </Card>
    </div>
  );
}
