"use client";

import { acceptCompletion } from "@codemirror/autocomplete";
import { indentMore } from "@codemirror/commands";
import { python } from "@codemirror/lang-python";
import { keymap } from "@codemirror/view";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import CodeMirror from "@uiw/react-codemirror";
import { useCallback, useMemo } from "react";

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

  // Tab: accept autocomplete if open, otherwise indent
  const tabKeymap = useMemo(
    () =>
      keymap.of([
        {
          key: "Tab",
          run: (view) => acceptCompletion(view) || indentMore(view),
        },
      ]),
    [],
  );

  return (
    <CodeMirror
      value={value}
      height={height}
      theme={vscodeDark}
      extensions={[python(), tabKeymap]}
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
        completionKeymap: false,
        lintKeymap: true,
        tabSize: 4,
      }}
    />
  );
}
