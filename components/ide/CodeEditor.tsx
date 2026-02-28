"use client";

import { python } from "@codemirror/lang-python";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import CodeMirror from "@uiw/react-codemirror";
import { useCallback } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  editable?: boolean;
  className?: string;
}

export default function CodeEditor({
  value,
  onChange,
  height = "100%",
  editable = true,
  className,
}: CodeEditorProps) {
  const handleChange = useCallback(
    (val: string) => {
      onChange(val);
    },
    [onChange],
  );

  return (
    <CodeMirror
      value={value}
      height={height}
      theme={vscodeDark}
      extensions={[python()]}
      onChange={handleChange}
      editable={editable}
      className={className}
      basicSetup={{
        lineNumbers: true,
        highlightActiveLineGutter: true,
        highlightSpecialChars: true,
        history: true,
        foldGutter: true,
        drawSelection: true,
        dropCursor: true,
        allowMultipleSelections: true,
        indentOnInput: true,
        syntaxHighlighting: true,
        bracketMatching: true,
        closeBrackets: true,
        autocompletion: true,
        rectangularSelection: true,
        crosshairCursor: false,
        highlightActiveLine: true,
        highlightSelectionMatches: true,
        closeBracketsKeymap: true,
        defaultKeymap: true,
        searchKeymap: true,
        historyKeymap: true,
        foldKeymap: true,
        completionKeymap: true,
        lintKeymap: true,
        tabSize: 4,
      }}
    />
  );
}
