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
      <div className="w-full max-w-3xl mx-auto my-6 bg-red-50 border border-red-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 text-red-600 font-medium">
          ❌ ไม่สามารถโหลด Python ได้: {pyodideError}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto my-6 bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden shadow-sm flex flex-col font-sans">
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
        <span className="font-semibold text-gray-200 text-[0.875rem]">
          🐍 Python
        </span>
        {isLoading && (
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <Loader2 className="animate-spin" size={14} />
            กำลังโหลด Python...
          </span>
        )}
      </div>

      <textarea
        className="w-full bg-transparent text-[#e6edf3] font-mono p-4 text-[0.875rem] leading-relaxed resize-y min-h-[150px] outline-none border-none placeholder-gray-600 focus:ring-1 focus:ring-blue-500/50 transition-all"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="เขียนโค้ด Python ที่นี่..."
        spellCheck={false}
        disabled={isLoading}
      />

      <div className="flex justify-end px-4 py-3 bg-[#161b22] border-t border-[#30363d]">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[0.875rem] font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
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
        <div className="bg-[#010409] border-t border-[#30363d] p-4 font-mono text-[0.875rem]">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-bold">
            ผลลัพธ์:
          </div>
          {output && (
            <pre className="text-[#e6edf3] whitespace-pre-wrap m-0 leading-relaxed">
              {output}
            </pre>
          )}
          {error && (
            <pre className="text-[#f85149] whitespace-pre-wrap m-0 leading-relaxed">
              {error}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
