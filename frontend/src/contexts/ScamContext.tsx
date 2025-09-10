import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ScamResult {
  Message: string;
  ML: string;
  Gemini: string;
  Final: string;
  timestamp: number;
}

interface ScamContextType {
  history: ScamResult[];
  addResult: (message: string, ml: string, gemini: string, final: string) => void;
  clearHistory: () => void;
}

const ScamContext = createContext<ScamContextType | undefined>(undefined);

export const useScamContext = () => {
  const context = useContext(ScamContext);
  if (context === undefined) {
    throw new Error('useScamContext must be used within a ScamProvider');
  }
  return context;
};

interface ScamProviderProps {
  children: ReactNode;
}

export const ScamProvider: React.FC<ScamProviderProps> = ({ children }) => {
  const [history, setHistory] = useState<ScamResult[]>([]);

  const addResult = (message: string, ml: string, gemini: string, final: string) => {
    const newResult: ScamResult = {
      Message: message,
      ML: ml.toUpperCase(),
      Gemini: gemini.toUpperCase(),
      Final: final.toUpperCase(),
      timestamp: Date.now()
    };
    
    setHistory(prev => [newResult, ...prev].slice(0, 50)); // Keep only last 50 results
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const value: ScamContextType = {
    history,
    addResult,
    clearHistory
  };

  return (
    <ScamContext.Provider value={value}>
      {children}
    </ScamContext.Provider>
  );
};
