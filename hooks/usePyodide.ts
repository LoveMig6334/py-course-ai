"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface PyodideInterface {
  runPython: (code: string) => unknown;
  runPythonAsync: (code: string) => Promise<unknown>;
  loadPackage: (packages: string | string[]) => Promise<void>;
  FS: {
    mkdir: (path: string) => void;
    writeFile: (
      path: string,
      data: string,
      opts?: { encoding: string },
    ) => void;
    readFile: (path: string, opts?: { encoding: string }) => string;
    readdir: (path: string) => string[];
    unlink: (path: string) => void;
    stat: (path: string) => { mode: number };
  };
}

interface PyodideState {
  pyodide: PyodideInterface | null;
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
}

interface RunResult {
  output: string;
  error: string | null;
}

declare global {
  interface Window {
    loadPyodide: (config?: {
      indexURL?: string;
      stdout?: (text: string) => void;
      stderr?: (text: string) => void;
    }) => Promise<PyodideInterface>;
    _pyodideInstance?: PyodideInterface;
  }
}

const PYODIDE_VERSION = "0.25.1";
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

export function usePyodide() {
  const [state, setState] = useState<PyodideState>({
    pyodide: null,
    isLoading: true,
    isReady: false,
    error: null,
  });

  const outputRef = useRef<string[]>([]);
  const errorRef = useRef<string[]>([]);
  const pyodideRef = useRef<PyodideInterface | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializePyodide = async () => {
      try {
        // Reuse existing instance across components
        if (window._pyodideInstance) {
          pyodideRef.current = window._pyodideInstance;
          if (isMounted) {
            setState({
              pyodide: window._pyodideInstance,
              isLoading: false,
              isReady: true,
              error: null,
            });
          }
          return;
        }

        const pyodide = await window.loadPyodide({
          indexURL: PYODIDE_CDN,
          stdout: (text: string) => {
            outputRef.current.push(text);
          },
          stderr: (text: string) => {
            errorRef.current.push(text);
          },
        });

        // Set up workspace directory
        try {
          pyodide.FS.mkdir("/workspace");
        } catch {}

        window._pyodideInstance = pyodide;
        pyodideRef.current = pyodide;

        if (isMounted) {
          setState({ pyodide, isLoading: false, isReady: true, error: null });
        }
      } catch (err) {
        if (isMounted) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error:
              err instanceof Error
                ? err.message
                : "Failed to initialize Pyodide",
          }));
        }
      }
    };

    const loadScript = async () => {
      try {
        if (typeof window.loadPyodide === "function") {
          await initializePyodide();
          return;
        }
        const script = document.createElement("script");
        script.src = `${PYODIDE_CDN}pyodide.js`;
        script.async = true;
        script.onload = () => {
          if (isMounted) initializePyodide();
        };
        script.onerror = () => {
          if (isMounted) {
            setState((prev) => ({
              ...prev,
              isLoading: false,
              error: "Failed to load Pyodide script",
            }));
          }
        };
        document.head.appendChild(script);
      } catch (err) {
        if (isMounted) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: err instanceof Error ? err.message : "Unknown error",
          }));
        }
      }
    };

    loadScript();
    return () => {
      isMounted = false;
    };
  }, []);

  const runPython = useCallback(async (code: string): Promise<RunResult> => {
    if (!pyodideRef.current) {
      return { output: "", error: "Python ยังไม่พร้อม กรุณารอสักครู่" };
    }
    outputRef.current = [];
    errorRef.current = [];
    try {
      await pyodideRef.current.runPythonAsync(code);
      return {
        output: outputRef.current.join("\n"),
        error: errorRef.current.length > 0 ? errorRef.current.join("\n") : null,
      };
    } catch (err) {
      return {
        output: outputRef.current.join("\n"),
        error: err instanceof Error ? err.message : "Python execution error",
      };
    }
  }, []);

  const runFile = useCallback(async (filePath: string): Promise<RunResult> => {
    if (!pyodideRef.current) {
      return { output: "", error: "Python ยังไม่พร้อม" };
    }
    outputRef.current = [];
    errorRef.current = [];
    try {
      await pyodideRef.current.runPythonAsync(`
import sys
sys.path.insert(0, '/workspace')
with open('${filePath}', 'r', encoding='utf-8') as f:
    exec(compile(f.read(), '${filePath}', 'exec'), {'__name__': '__main__', '__file__': '${filePath}'})
`);
      return {
        output: outputRef.current.join("\n"),
        error: errorRef.current.length > 0 ? errorRef.current.join("\n") : null,
      };
    } catch (err) {
      return {
        output: outputRef.current.join("\n"),
        error: err instanceof Error ? err.message : "Python execution error",
      };
    }
  }, []);

  const installPackage = useCallback(
    async (packageName: string): Promise<RunResult> => {
      if (!pyodideRef.current) {
        return { output: "", error: "Python ยังไม่พร้อม" };
      }
      outputRef.current = [];
      errorRef.current = [];
      try {
        await pyodideRef.current.loadPackage("micropip");
        await pyodideRef.current.runPythonAsync(`
import micropip
await micropip.install('${packageName}')
print(f'Successfully installed ${packageName}')
`);
        return {
          output: outputRef.current.join("\n"),
          error:
            errorRef.current.length > 0 ? errorRef.current.join("\n") : null,
        };
      } catch (err) {
        return {
          output: "",
          error:
            err instanceof Error
              ? err.message
              : `ไม่สามารถติดตั้ง ${packageName}`,
        };
      }
    },
    [],
  );

  const writeFileToFS = useCallback((filePath: string, content: string) => {
    if (!pyodideRef.current) return;
    try {
      pyodideRef.current.FS.writeFile(filePath, content, { encoding: "utf8" });
    } catch {}
  }, []);

  return {
    ...state,
    runPython,
    runFile,
    installPackage,
    writeFileToFS,
  };
}
