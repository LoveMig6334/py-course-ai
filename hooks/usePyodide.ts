"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Pyodide types
interface PyodideInterface {
  runPython: (code: string) => unknown;
  runPythonAsync: (code: string) => Promise<unknown>;
  loadPackage: (packages: string | string[]) => Promise<void>;
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

// Declare global loadPyodide function
declare global {
  interface Window {
    loadPyodide: (config?: {
      indexURL?: string;
      stdout?: (text: string) => void;
      stderr?: (text: string) => void;
    }) => Promise<PyodideInterface>;
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

    const loadPyodideScript = async () => {
      try {
        // Check if script is already loaded
        if (window.loadPyodide) {
          await initializePyodide();
          return;
        }

        // Load Pyodide script
        const script = document.createElement("script");
        script.src = `${PYODIDE_CDN}pyodide.js`;
        script.async = true;

        script.onload = async () => {
          if (isMounted) {
            await initializePyodide();
          }
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
            error:
              err instanceof Error
                ? err.message
                : "Unknown error loading Pyodide",
          }));
        }
      }
    };

    const initializePyodide = async () => {
      try {
        const pyodide = await window.loadPyodide({
          indexURL: PYODIDE_CDN,
          stdout: (text: string) => {
            outputRef.current.push(text);
          },
          stderr: (text: string) => {
            errorRef.current.push(text);
          },
        });

        pyodideRef.current = pyodide;

        if (isMounted) {
          setState({
            pyodide,
            isLoading: false,
            isReady: true,
            error: null,
          });
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

    loadPyodideScript();

    return () => {
      isMounted = false;
    };
  }, []);

  const runPython = useCallback(async (code: string): Promise<RunResult> => {
    if (!pyodideRef.current) {
      return {
        output: "",
        error: "Pyodide is not ready yet",
      };
    }

    // Clear previous output
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

  return {
    ...state,
    runPython,
  };
}
