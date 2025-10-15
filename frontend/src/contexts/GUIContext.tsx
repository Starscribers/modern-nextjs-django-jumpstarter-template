'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ActiveGUI = 'backpack' | 'quests' | 'settings' | 'profile' | null;

interface GUIContextType {
  activeGUI: ActiveGUI;
  setActiveGUI: (gui: ActiveGUI) => void;
  closeAllGUIs: () => void;
  // Guiding Star mode
  guidingStarMode: boolean;
  setGuidingStarMode: (active: boolean) => void;
}

const GUIContext = createContext<GUIContextType | undefined>(undefined);

export function GUIProvider({ children }: { children: ReactNode }) {
  const [activeGUI, setActiveGUI] = useState<ActiveGUI>(null);
  const [guidingStarMode, setGuidingStarMode] = useState(false);

  const closeAllGUIs = () => setActiveGUI(null);

  return (
    <GUIContext.Provider value={{ activeGUI, setActiveGUI, closeAllGUIs, guidingStarMode, setGuidingStarMode }}>
      {children}
    </GUIContext.Provider>
  );
}

export function useGUI() {
  const context = useContext(GUIContext);
  if (context === undefined) {
    throw new Error('useGUI must be used within a GUIProvider');
  }
  return context;
}
