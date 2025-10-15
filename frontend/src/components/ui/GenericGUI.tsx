'use client';

import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { useGUI } from '@/contexts/GUIContext';

interface GenericGUIProps {
  guiName: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
  height?: string;
}

export function GenericGUI({
  guiName,
  children,
  className = "max-w-5xl h-[600px] p-0 bg-background dark:bg-slate-900",
  maxWidth,
  height
}: GenericGUIProps) {
  const { activeGUI, setActiveGUI } = useGUI();

  if (activeGUI !== guiName) return null;

  const dialogClassName = maxWidth || height
    ? `${maxWidth || 'max-w-5xl'} ${height || 'h-[600px]'} p-0 bg-background dark:bg-slate-900`
    : className;

  return (
    <Dialog open={activeGUI === guiName} onOpenChange={() => setActiveGUI(null)}>
      <DialogContent className={dialogClassName}>
        <DialogHeader>
          <DialogTitle className="sr-only">{guiName} panel</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
