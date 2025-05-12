import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";

export const Editor = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (editorRef.current && !editor.current) {
      editor.current = monaco.editor.create(editorRef.current, {
        value: "// Your code here",
        language: "typescript",
        theme: "vs-dark",
        automaticLayout: true,
        minimap: {
          enabled: false,
        },
        fontSize: 14,
        fontFamily: "JetBrains Mono, monospace",
        scrollBeyondLastLine: false,
      });
    }

    return () => {
      if (editor.current) {
        editor.current.dispose();
      }
    };
  }, []);

  return <div ref={editorRef} className="editor-wrapper" />;
};