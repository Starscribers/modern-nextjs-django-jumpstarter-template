'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { OutputData } from '@editorjs/editorjs';
import { loadEditorJSTools } from '@/lib/editorjs-tools';

interface EditorJSViewerProps {
  data: OutputData;
  className?: string;
}

const EditorJSViewer = ({ data, className = '' }: EditorJSViewerProps) => {
  const holderRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const initedRef = useRef(false);

  // Create a unique ID that won't change on re-renders
  const uniqueId = useMemo(
    () => `editor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    []
  );

  useEffect(() => {
    // Prevent multiple initializations
    if (initedRef.current || !holderRef.current || !data) return;

    const init = async () => {
      try {
        initedRef.current = true;

        // Set the unique ID on the holder
        holderRef.current!.id = uniqueId;

        // Load all tools using the shared utility
        const { EditorJS, tools, tunes } = await loadEditorJSTools();

        // Create editor with all the same tools as EditorJSEditor
        editorRef.current = new EditorJS({
          holder: uniqueId,
          readOnly: true,
          data: data,
          tools,
          tunes,
          minHeight: 0,
        });
      } catch (error) {
        console.error('EditorJS viewer init error:', error);
        initedRef.current = false;
      }
    };

    init();

    // Cleanup
    return () => {
      if (editorRef.current?.destroy) {
        editorRef.current.destroy();
      }
      initedRef.current = false;
    };
  }, []); // Empty deps - only run once

  return (
    <>
      {/* Style overrides so Quote blocks look like read-only quotes without input borders */}
      <style>{`
        #${uniqueId} .ce-quote {
          padding: 0 !important;
          border: none !important;
          background: transparent !important;
        }
        #${uniqueId} .ce-quote .cdx-input {
          border: none !important;
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
          outline: none !important;
          min-height: 0 !important;
        }
        #${uniqueId} .ce-quote .ce-quote__text {
          font-style: italic;
          color: inherit;
          opacity: 0.9;
          margin: 0 !important;
        }
        #${uniqueId} .ce-quote .ce-quote__caption {
          margin-top: 0.5rem;
          text-align: right;
          color: rgb(100 116 139); /* slate-500 */
        }
        #${uniqueId} .ce-quote .ce-quote__caption:empty {
          display: none !important;
        }
        /* Hide placeholder pseudo-elements on empty inputs */
        #${uniqueId} .cdx-input[data-placeholder]:empty:before {
          display: none !important;
          min-height: 0 !important;
        }
        /* Remove generic EditorJS block padding/borders in viewer */
        #${uniqueId} .ce-block {
          margin: 0.5rem 0;
          padding: 0 !important;
          border: 0 !important;
          background: transparent !important;
        }
          .cdx-quote__text {
          border: none;
          min-height: 0;
          }
          .cdx-quote__caption {
          border: none;
          min-height: 0;
          display:none;
          }
      `}</style>
      <div
        ref={holderRef}
        className={`prose prose-lg max-w-none ${className}`}
        style={{
          fontSize: '16px',
          lineHeight: '1.6',
          color: 'inherit',
        }}
      />
    </>
  );
};

export default EditorJSViewer;
