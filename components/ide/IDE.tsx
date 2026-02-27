"use client";

import { usePyodide } from "@/hooks/usePyodide";
import { useCallback, useEffect, useRef, useState } from "react";

/* ─── Types ─────────────────────────────────────────── */
interface FileNode {
  name: string;
  path: string; // absolute path e.g. /workspace/main.py
  type: "file" | "folder";
  content?: string;
  children?: string[]; // child paths
}

type Files = Record<string, FileNode>;

interface TerminalLine {
  type: "command" | "output" | "error" | "info" | "system";
  text: string;
}

interface OutputResult {
  stdout: string;
  stderr: string | null;
}

/* ─── Helpers ────────────────────────────────────────── */
function basename(p: string) {
  return p.split("/").filter(Boolean).pop() ?? p;
}

function dirname(p: string) {
  const parts = p.split("/").filter(Boolean);
  parts.pop();
  return "/" + parts.join("/");
}

function joinPath(base: string, name: string) {
  return base.replace(/\/$/, "") + "/" + name;
}

function initFiles(initialCode: string): Files {
  return {
    "/workspace": {
      name: "workspace",
      path: "/workspace",
      type: "folder",
      children: ["/workspace/main.py"],
    },
    "/workspace/main.py": {
      name: "main.py",
      path: "/workspace/main.py",
      type: "file",
      content: initialCode,
    },
  };
}

/* ─── Component ─────────────────────────────────────── */
interface IDEProps {
  initialCode?: string;
}

export default function IDE({
  initialCode = "# เขียนโค้ด Python ของคุณที่นี่\nprint('Hello, World!')\n",
}: IDEProps) {
  const {
    isReady,
    isLoading,
    error: pyError,
    runPython,
    installPackage,
    writeFileToFS,
  } = usePyodide();

  const [files, setFiles] = useState<Files>(() => initFiles(initialCode));
  const [activeFile, setActiveFile] = useState("/workspace/main.py");
  const [editorContent, setEditorContent] = useState(initialCode);
  const [output, setOutput] = useState<OutputResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentDir, setCurrentDir] = useState("/workspace");
  const [terminalHistory, setTerminalHistory] = useState<TerminalLine[]>([
    { type: "system", text: "mixPie DEV Terminal — พิมพ์ help เพื่อดูคำสั่ง" },
    {
      type: "system",
      text: 'ใช้ "pip install <package>" เพื่อติดตั้ง library',
    },
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const [activePanel, setActivePanel] = useState<"terminal" | "output">(
    "terminal",
  );
  const [newFileName, setNewFileName] = useState("");
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdHistoryIndex, setCmdHistoryIndex] = useState(-1);

  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);

  /* ─── Auto-scroll terminal ─── */
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  /* ─── Sync editor content when switching files ─── */
  const openFile = useCallback(
    (path: string) => {
      // Save current file content
      setFiles((prev) => {
        if (!prev[activeFile] || prev[activeFile].type !== "file") return prev;
        return {
          ...prev,
          [activeFile]: { ...prev[activeFile], content: editorContent },
        };
      });
      // Open new file
      const f = files[path];
      if (f && f.type === "file") {
        setActiveFile(path);
        setEditorContent(f.content ?? "");
      }
    },
    [activeFile, editorContent, files],
  );

  /* ─── File operations ─── */
  const createFile = useCallback(
    (name: string) => {
      const path = joinPath(currentDir, name);
      setFiles((prev) => {
        if (prev[path]) return prev;
        const parent = prev[currentDir];
        return {
          ...prev,
          [currentDir]: {
            ...parent,
            children: [...(parent?.children ?? []), path],
          },
          [path]: { name, path, type: "file", content: "" },
        };
      });
      return path;
    },
    [currentDir],
  );

  const createFolder = useCallback(
    (name: string) => {
      const path = joinPath(currentDir, name);
      setFiles((prev) => {
        if (prev[path]) return prev;
        const parent = prev[currentDir];
        return {
          ...prev,
          [currentDir]: {
            ...parent,
            children: [...(parent?.children ?? []), path],
          },
          [path]: { name, path, type: "folder", children: [] },
        };
      });
    },
    [currentDir],
  );

  const deleteFile = useCallback(
    (path: string) => {
      const parent = dirname(path);
      setFiles((prev) => {
        const next = { ...prev };
        delete next[path];
        if (next[parent]) {
          next[parent] = {
            ...next[parent],
            children: (next[parent].children ?? []).filter((c) => c !== path),
          };
        }
        return next;
      });
      if (activeFile === path) {
        setActiveFile("/workspace/main.py");
        setEditorContent(files["/workspace/main.py"]?.content ?? "");
      }
    },
    [activeFile, files],
  );

  /* ─── Save current file ─── */
  const saveCurrentFile = useCallback(() => {
    setFiles((prev) => ({
      ...prev,
      [activeFile]: { ...prev[activeFile], content: editorContent },
    }));
  }, [activeFile, editorContent]);

  /* ─── Run code ─── */
  const handleRun = useCallback(async () => {
    if (!isReady || isRunning) return;
    saveCurrentFile();

    // Sync all files to Pyodide FS
    const snap = {
      ...files,
      [activeFile]: { ...files[activeFile], content: editorContent },
    };
    Object.values(snap).forEach((f) => {
      if (f.type === "file") {
        writeFileToFS(f.path, f.content ?? "");
      }
    });

    setIsRunning(true);
    setActivePanel("output");

    const result = await runPython(editorContent);
    setOutput({ stdout: result.output, stderr: result.error });
    setIsRunning(false);
  }, [
    isReady,
    isRunning,
    saveCurrentFile,
    files,
    activeFile,
    editorContent,
    writeFileToFS,
    runPython,
  ]);

  /* ─── Terminal: add line ─── */
  const addLine = (type: TerminalLine["type"], text: string) => {
    setTerminalHistory((prev) => [...prev, { type, text }]);
  };

  /* ─── Terminal: resolve path ─── */
  const resolvePath = useCallback(
    (p: string) => {
      if (!p) return currentDir;
      if (p.startsWith("/")) return p;
      if (p === "..") {
        const parts = currentDir.split("/").filter(Boolean);
        parts.pop();
        return "/" + parts.join("/") || "/workspace";
      }
      return joinPath(currentDir, p);
    },
    [currentDir],
  );

  /* ─── Terminal: execute command ─── */
  const execCommand = useCallback(
    async (raw: string) => {
      const cmd = raw.trim();
      if (!cmd) return;

      addLine("command", `${currentDir} $ ${cmd}`);
      setCmdHistory((prev) => [cmd, ...prev.slice(0, 49)]);
      setCmdHistoryIndex(-1);

      const parts = cmd.split(/\s+/);
      const prog = parts[0];
      const args = parts.slice(1);

      if (prog === "help") {
        addLine("info", "คำสั่งที่ใช้ได้:");
        addLine(
          "output",
          "  python [file]       — รันโค้ด Python (ไม่ระบุไฟล์ = รันไฟล์ที่เปิดอยู่)",
        );
        addLine("output", "  pip install <pkg>   — ติดตั้ง Python package");
        addLine("output", "  ls                  — แสดงไฟล์ในโฟลเดอร์");
        addLine("output", "  mkdir <name>        — สร้างโฟลเดอร์");
        addLine("output", "  touch <name>        — สร้างไฟล์");
        addLine("output", "  cat <file>          — แสดงเนื้อหาไฟล์");
        addLine("output", "  rm <file>           — ลบไฟล์");
        addLine("output", "  cd <dir>            — เปลี่ยนโฟลเดอร์");
        addLine("output", "  clear               — ล้างหน้าจอ");
        return;
      }

      if (prog === "clear") {
        setTerminalHistory([
          { type: "system", text: "mixPie DEV Terminal — cleared" },
        ]);
        return;
      }

      if (prog === "ls") {
        const dir = args[0] ? resolvePath(args[0]) : currentDir;
        const node = files[dir];
        if (!node || node.type !== "folder") {
          addLine("error", `ls: ไม่พบโฟลเดอร์ '${dir}'`);
          return;
        }
        const children = node.children ?? [];
        if (children.length === 0) {
          addLine("output", "(โฟลเดอร์ว่าง)");
        } else {
          children.forEach((c) => {
            const child = files[c];
            if (child)
              addLine(
                "output",
                child.type === "folder"
                  ? `📁 ${child.name}/`
                  : `📄 ${child.name}`,
              );
          });
        }
        return;
      }

      if (prog === "mkdir") {
        if (!args[0]) {
          addLine("error", "mkdir: ระบุชื่อโฟลเดอร์");
          return;
        }
        createFolder(args[0]);
        addLine("output", `สร้างโฟลเดอร์ '${args[0]}' แล้ว`);
        return;
      }

      if (prog === "touch") {
        if (!args[0]) {
          addLine("error", "touch: ระบุชื่อไฟล์");
          return;
        }
        const p = createFile(args[0]);
        setActiveFile(p);
        setEditorContent("");
        addLine("output", `สร้างไฟล์ '${args[0]}' แล้ว`);
        return;
      }

      if (prog === "cat") {
        if (!args[0]) {
          addLine("error", "cat: ระบุชื่อไฟล์");
          return;
        }
        const p = resolvePath(args[0]);
        const snap = {
          ...files,
          [activeFile]: { ...files[activeFile], content: editorContent },
        };
        const node = snap[p];
        if (!node || node.type !== "file") {
          addLine("error", `cat: ไม่พบไฟล์ '${args[0]}'`);
          return;
        }
        addLine("output", node.content ?? "(ไฟล์ว่าง)");
        return;
      }

      if (prog === "rm") {
        if (!args[0]) {
          addLine("error", "rm: ระบุชื่อไฟล์");
          return;
        }
        const p = resolvePath(args[0]);
        if (!files[p]) {
          addLine("error", `rm: ไม่พบไฟล์ '${args[0]}'`);
          return;
        }
        deleteFile(p);
        addLine("output", `ลบ '${args[0]}' แล้ว`);
        return;
      }

      if (prog === "cd") {
        const target = args[0] ? resolvePath(args[0]) : "/workspace";
        if (!files[target] || files[target].type !== "folder") {
          addLine("error", `cd: ไม่พบโฟลเดอร์ '${args[0] ?? "~"}'`);
          return;
        }
        setCurrentDir(target);
        addLine("system", `เปลี่ยนไป ${target}`);
        return;
      }

      if (prog === "python") {
        if (!isReady) {
          addLine("error", "Python ยังไม่พร้อม กรุณารอสักครู่...");
          return;
        }
        saveCurrentFile();
        const snap = {
          ...files,
          [activeFile]: { ...files[activeFile], content: editorContent },
        };

        let code = editorContent;
        if (args[0]) {
          const p = resolvePath(args[0]);
          const node = snap[p];
          if (!node || node.type !== "file") {
            addLine("error", `python: ไม่พบไฟล์ '${args[0]}'`);
            return;
          }
          code = node.content ?? "";
        }

        // Sync files to Pyodide FS before running
        Object.values(snap).forEach((f) => {
          if (f.type === "file") writeFileToFS(f.path, f.content ?? "");
        });

        addLine("system", "กำลังรัน...");
        setIsRunning(true);
        const result = await runPython(code);
        setIsRunning(false);

        if (result.output) addLine("output", result.output);
        if (result.error) addLine("error", result.error);
        setOutput({ stdout: result.output, stderr: result.error });
        setActivePanel("output");
        return;
      }

      if (prog === "pip") {
        if (args[0] !== "install" || !args[1]) {
          addLine("error", "pip: ใช้ 'pip install <package>'");
          return;
        }
        if (!isReady) {
          addLine("error", "Python ยังไม่พร้อม");
          return;
        }
        addLine("system", `กำลังติดตั้ง ${args[1]}...`);
        const result = await installPackage(args[1]);
        if (result.error) {
          addLine("error", `ติดตั้งล้มเหลว: ${result.error}`);
        } else {
          addLine("output", result.output || `ติดตั้ง ${args[1]} สำเร็จ ✓`);
        }
        return;
      }

      addLine(
        "error",
        `คำสั่งไม่ถูกต้อง: '${prog}' — พิมพ์ help เพื่อดูคำสั่ง`,
      );
    },
    [
      files,
      activeFile,
      editorContent,
      currentDir,
      isReady,
      createFile,
      createFolder,
      deleteFile,
      saveCurrentFile,
      runPython,
      installPackage,
      writeFileToFS,
      resolvePath,
    ],
  );

  /* ─── Terminal input key handler ─── */
  const handleTerminalKey = async (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      const val = terminalInput;
      setTerminalInput("");
      await execCommand(val);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(cmdHistoryIndex + 1, cmdHistory.length - 1);
      setCmdHistoryIndex(next);
      setTerminalInput(cmdHistory[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(cmdHistoryIndex - 1, -1);
      setCmdHistoryIndex(next);
      setTerminalInput(next === -1 ? "" : (cmdHistory[next] ?? ""));
    }
  };

  /* ─── Editor tab key ─── */
  const handleEditorKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newContent =
        editorContent.slice(0, start) + "    " + editorContent.slice(end);
      setEditorContent(newContent);
      setTimeout(() => {
        ta.selectionStart = ta.selectionEnd = start + 4;
      }, 0);
    }
  };

  /* ─── Render file tree ─── */
  const renderTree = (path: string, depth = 0): React.ReactNode => {
    const node = files[path];
    if (!node) return null;

    if (node.type === "folder") {
      const isRoot = path === "/workspace";
      return (
        <div key={path}>
          {!isRoot && (
            <div
              className="ide-folder-item"
              style={{ paddingLeft: `${0.75 + depth * 1}rem` }}
            >
              <span>📁</span>
              <span>{node.name}</span>
            </div>
          )}
          {(node.children ?? []).map((child) =>
            renderTree(child, isRoot ? depth : depth + 1),
          )}
        </div>
      );
    }

    return (
      <button
        key={path}
        className={`ide-file-item ${activeFile === path ? "active" : ""}`}
        style={{ paddingLeft: `${0.75 + depth * 1}rem` }}
        onClick={() => openFile(path)}
        title={node.name}
      >
        <span>📄</span>
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
          {node.name}
        </span>
        {path !== "/workspace/main.py" && (
          <button
            className="ide-file-delete"
            onClick={(e) => {
              e.stopPropagation();
              deleteFile(path);
            }}
            title="ลบไฟล์"
          >
            ✕
          </button>
        )}
      </button>
    );
  };

  /* ─── Status text ─── */
  const statusText = isRunning
    ? "⏳ กำลังรัน..."
    : pyError
      ? "⚠ โหลดล้มเหลว"
      : isLoading
        ? "⏳ กำลังโหลด Python..."
        : isReady
          ? "● Python พร้อมแล้ว"
          : "";

  const statusClass = isRunning
    ? "text-yellow-600 font-medium"
    : pyError
      ? "text-red-500 font-medium"
      : isLoading
        ? "text-blue-500 font-medium animate-pulse"
        : "text-green-600 font-medium";

  return (
    <div className="flex flex-col flex-1 h-full min-h-125 w-full bg-[#1e1e1e] overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 h-12 bg-[#252526] border-b border-[#3c3c3c] text-[0.8125rem] text-[#cccccc]">
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={!isReady || isRunning}
            onClick={handleRun}
          >
            ▶ รันโค้ด
          </button>
          <button
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded hover:bg-[#3c3c3c] transition-colors"
            onClick={() => setIsCreatingFile(true)}
            title="สร้างไฟล์ใหม่"
          >
            + ไฟล์
          </button>
        </div>
        <span className={`text-[0.8125rem] ${statusClass}`}>{statusText}</span>
      </div>

      {/* Main area */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* File Tree */}
        <div className="w-48 xl:w-56 bg-[#252526] border-r border-[#3c3c3c] flex flex-col shrink-0">
          <div className="px-4 py-2 text-[0.65rem] font-bold text-[#cccccc] uppercase tracking-wider flex items-center justify-between border-b border-[#3c3c3c] mb-1">
            <span>ไฟล์</span>
            <button
              className="text-lg hover:text-white leading-none h-4 w-4 flex items-center justify-center rounded"
              onClick={() => setIsCreatingFile(true)}
              title="ไฟล์ใหม่"
            >
              +
            </button>
          </div>

          {isCreatingFile && (
            <div className="px-3 py-2 border-b border-[#3c3c3c]">
              <input
                autoFocus
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newFileName.trim()) {
                    const p = createFile(newFileName.trim());
                    setActiveFile(p);
                    setEditorContent("");
                    setNewFileName("");
                    setIsCreatingFile(false);
                  } else if (e.key === "Escape") {
                    setNewFileName("");
                    setIsCreatingFile(false);
                  }
                }}
                placeholder="ชื่อไฟล์.py"
                className="w-full bg-[#3c3c3c] border border-blue-500 rounded text-[#cccccc] px-2 py-1 text-xs font-mono outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="flex-1 overflow-y-auto overflow-x-hidden text-[0.8125rem] text-[#cccccc]">
            {renderTree("/workspace")}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
          <div className="flex bg-[#252526] h-9 overflow-x-auto no-scrollbar border-b border-[#3c3c3c]">
            <button className="px-4 text-[0.8125rem] h-full flex items-center bg-[#1e1e1e] text-white border-t border-t-blue-500 whitespace-nowrap min-w-30">
              {basename(activeFile)}
            </button>
          </div>
          <div className="flex-1 relative cursor-text">
            <textarea
              className="absolute inset-0 w-full h-full p-4 bg-transparent text-[#d4d4d4] font-mono text-[0.875rem] leading-relaxed resize-none outline-none whitespace-pre overflow-auto"
              value={editorContent}
              onChange={(e) => setEditorContent(e.target.value)}
              onKeyDown={handleEditorKey}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="h-[35%] min-h-37.5 max-h-[60%] border-t border-[#3c3c3c] bg-[#1e1e1e] flex flex-col font-mono relative z-10 transition-all duration-300 shrink-0">
        <div className="flex bg-[#252526] border-b border-[#3c3c3c] h-8">
          <button
            className={`px-4 text-[0.675rem] font-bold uppercase tracking-wider h-full flex items-center border-b border-transparent transition-colors ${
              activePanel === "terminal"
                ? "text-[#cccccc] border-b-blue-500"
                : "text-[#737373] hover:text-[#cccccc]"
            }`}
            onClick={() => setActivePanel("terminal")}
          >
            Terminal
          </button>
          <button
            className={`px-4 text-[0.675rem] font-bold uppercase tracking-wider h-full flex items-center border-b border-transparent transition-colors ${
              activePanel === "output"
                ? "text-[#cccccc] border-b-blue-500"
                : "text-[#737373] hover:text-[#cccccc]"
            }`}
            onClick={() => setActivePanel("output")}
          >
            Output
          </button>
        </div>

        {activePanel === "terminal" ? (
          <div className="flex-1 flex flex-col overflow-hidden text-[0.8125rem]">
            <div
              className="flex-1 overflow-y-auto p-3 text-[#cccccc] cursor-text"
              ref={terminalBodyRef}
              onClick={() => terminalInputRef.current?.focus()}
            >
              {terminalHistory.map((line, i) => (
                <div
                  key={i}
                  className={`whitespace-pre-wrap leading-relaxed min-h-[1.4em] ${
                    line.type === "error"
                      ? "text-[#f48771]"
                      : line.type === "command"
                        ? "text-yellow-400 font-bold"
                        : line.type === "info"
                          ? "text-[#75beff]"
                          : line.type === "system"
                            ? "text-[#8a8a8a] italic"
                            : "text-[#cccccc]" // output
                  }`}
                >
                  {line.text}
                </div>
              ))}
            </div>
            <div className="flex items-center px-3 pb-3 pt-1 text-[#cccccc]">
              <span className="text-[#3fc56b] mr-2 whitespace-nowrap">
                <span className="text-[#75beff]">{currentDir}</span> $
              </span>
              <input
                ref={terminalInputRef}
                className="flex-1 bg-transparent border-none text-[#cccccc] font-mono outline-none min-w-25"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={handleTerminalKey}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 text-[0.8125rem] text-[#cccccc]">
            {!output ? (
              <p className="text-[#8a8a8a] italic m-0">
                ยังไม่มี output — กด ▶ รันโค้ด เพื่อเริ่ม
              </p>
            ) : (
              <>
                {output.stdout && (
                  <pre className="text-[#cccccc] whitespace-pre-wrap font-mono m-0 mb-2 leading-relaxed">
                    {output.stdout}
                  </pre>
                )}
                {output.stderr && (
                  <pre className="text-[#f48771] whitespace-pre-wrap font-mono m-0 leading-relaxed">
                    {output.stderr}
                  </pre>
                )}
                {!output.stdout && !output.stderr && (
                  <p className="text-[#8a8a8a] italic m-0">
                    (โปรแกรมรันสำเร็จ ไม่มี output)
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
