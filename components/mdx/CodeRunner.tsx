"use client";

import { usePyodide } from "@/hooks/usePyodide";
import { Loader2, Play } from "lucide-react";
import { useState } from "react";

interface CodeRunnerProps {
  initialCode?: string;
}

export default function CodeRunner({ initialCode = "" }: CodeRunnerProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const { isLoading, isReady, error: pyodideError, runPython } = usePyodide();

  const handleRun = async () => {
    if (!isReady) return;

    setIsRunning(true);
    setOutput("");
    setError(null);

    try {
      const result = await runPython(code);
      setOutput(result.output);
      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setIsRunning(false);
    }
  };

  if (pyodideError) {
    return (
      <div className="code-runner-container">
        <div className="code-runner-error">
          ❌ ไม่สามารถโหลด Python ได้: {pyodideError}
        </div>
      </div>
    );
  }

  return (
    <div className="code-runner-container">
      <div className="code-runner-header">
        <span className="code-runner-title">🐍 Python</span>
        {isLoading && (
          <span className="code-runner-loading">
            <Loader2 className="animate-spin" size={16} />
            กำลังโหลด Python...
          </span>
        )}
      </div>

      <textarea
        className="code-runner-editor"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="เขียนโค้ด Python ที่นี่..."
        spellCheck={false}
        disabled={isLoading}
      />

      <div className="code-runner-actions">
        <button
          className="code-runner-button"
          onClick={handleRun}
          disabled={isLoading || !isReady || isRunning}
        >
          {isRunning ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              กำลังรัน...
            </>
          ) : (
            <>
              <Play size={16} />
              รันโค้ด
            </>
          )}
        </button>
      </div>

      {(output || error) && (
        <div className="code-runner-output">
          <div className="code-runner-output-header">ผลลัพธ์:</div>
          {output && <pre className="code-runner-stdout">{output}</pre>}
          {error && <pre className="code-runner-stderr">{error}</pre>}
        </div>
      )}
    </div>
  );
}
