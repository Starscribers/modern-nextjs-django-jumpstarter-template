'use client';

import React, { ErrorInfo, ReactNode } from 'react';
import { OutputData } from '@editorjs/editorjs';
import EditorJSViewer from './EditorJSViewer';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class EditorJSErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log EditorJS errors but don't crash the app
    console.warn('EditorJS component error caught:', error.message);

    // Only log the first few lines of the stack to avoid noise
    if (errorInfo.componentStack) {
      const stackLines = errorInfo.componentStack.split('\n').slice(0, 3);
      console.warn('Component stack:', stackLines.join('\n'));
    }
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="rounded border border-dashed p-2 text-sm text-muted-foreground">
          Content temporarily unavailable
        </div>
      );
    }

    return this.props.children;
  }
}

interface EditorJSViewerSafeProps {
  data: OutputData;
  className?: string;
}

const EditorJSViewerSafe = ({ data, className }: EditorJSViewerSafeProps) => {
  // If data is empty or invalid, show fallback
  if (!data || !data.blocks || data.blocks.length === 0) {
    return (
      <div className={`text-sm text-muted-foreground ${className}`}>
        No content available
      </div>
    );
  }

  return (
    <EditorJSErrorBoundary>
      <EditorJSViewer data={data} className={className} />
    </EditorJSErrorBoundary>
  );
};

export default EditorJSViewerSafe;
