"use client";

import React, { useEffect, useRef, useState } from "react";
import { loadEditorJSTools, initializeEditorPlugins } from "@/lib/editorjs-tools";

export type EditorJSData = any; // EditorJS OutputData

interface EditorJSEditorProps {
  value?: EditorJSData;
  onChange?: (data: EditorJSData) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  holderId?: string;
}

export const EditorJSEditor: React.FC<EditorJSEditorProps> = ({
  value,
  onChange,
  placeholder,
  readOnly = false,
  className,
  holderId,
}) => {
  const editorRef = useRef<any>(null);
  const holderRef = useRef<HTMLDivElement | null>(null);
  const internalHolderId = useRef<string>(holderId || `editorjs-${Math.random().toString(36).slice(2)}`);
  const debouncedTimer = useRef<any>(null);

  // Track the current content we've last applied/emitted to avoid redundant renders that steal focus
  const currentDataStrRef = useRef<string>(JSON.stringify(value && typeof value === 'object' ? value : { blocks: [] }));
  const isApplyingRef = useRef<boolean>(false);
  const [ initialized, setInitialized ] = useState(false);

  useEffect(() => {

    (async () => {
      try {
        if (!value) return;
        const { EditorJS, tools, tunes } = await loadEditorJSTools();
        console.log(initialized, value)
        if (initialized) return;

        // Ensure holder element exists
        const holderEl = holderRef.current || document.getElementById(internalHolderId.current);
        console.log(holderEl);
        if (!holderEl) return;
        setInitialized(true);


        editorRef.current = new EditorJS({
          // Pass the actual element instead of ID to avoid holder resolution issues
          holder: holderEl,
          tools,
          tunes,
          data: value && typeof value === 'object' ? value : { blocks: [] },
          placeholder: placeholder || "Write course description...",
          readOnly,
          autofocus: false,
          defaultBlock: 'paragraph',
          minHeight: 0,
          onChange: async () => {
            if (!onChange) return;
            if (debouncedTimer.current) clearTimeout(debouncedTimer.current);
            debouncedTimer.current = setTimeout(async () => {
              try {
                const saved = await editorRef.current?.save();
                // Update our snapshot before notifying parent so subsequent parent re-renders don't cause render()
                currentDataStrRef.current = JSON.stringify(saved ?? { blocks: [] });
                onChange(saved);
              } catch {
                // ignore
              }
            }, 400);
          },
          onReady: () => {
            initializeEditorPlugins(editorRef.current);
          },
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("EditorJS init failed", e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Update content if value changes from outside (e.g., server load). Avoid re-rendering
  // when the change originated from this editor (we compare snapshots) or while focused.
  useEffect(() => {
    const applyData = async () => {
      if (!editorRef.current) return;
      const nextStr = JSON.stringify(value && typeof value === 'object' ? value : { blocks: [] });
      if (nextStr === currentDataStrRef.current) return; // No external change
      // If the editor (holder) is focused, don't steal focus; defer until blur by skipping.
      const isFocused = holderRef.current ? holderRef.current.contains(document.activeElement) : false;
      if (isFocused || isApplyingRef.current) return;

      try {
        isApplyingRef.current = true;
        await editorRef.current.isReady;
        await editorRef.current.render(value && typeof value === 'object' ? value : { blocks: [] });
        currentDataStrRef.current = nextStr;
      } catch {
        // ignore
      } finally {
        isApplyingRef.current = false;
      }
    };
    applyData();
  }, [value]);

  return <div id={internalHolderId.current} ref={holderRef} className={className} />;
};

export default EditorJSEditor;
