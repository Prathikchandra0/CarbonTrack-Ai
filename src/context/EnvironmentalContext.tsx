import React, { createContext, useContext, useState } from 'react';
import { EnvironmentalRecord } from '@/types/environmental';
import { sampleEnvironmentalData } from '@/data/environmentalData';

interface EnvironmentalContextType {
  environmentalData: EnvironmentalRecord[];
  setEnvironmentalData: React.Dispatch<React.SetStateAction<EnvironmentalRecord[]>>;
  hasCustomData: boolean;
  setHasCustomData: (value: boolean) => void;
  resetToDemo: () => void;
}

const EnvironmentalContext = createContext<EnvironmentalContextType | undefined>(undefined);

export const EnvironmentalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalRecord[]>(sampleEnvironmentalData);
  const [hasCustomData, setHasCustomData] = useState(false);

  const resetToDemo = () => {
    setEnvironmentalData(sampleEnvironmentalData);
    setHasCustomData(false);
  };

  return (
    <EnvironmentalContext.Provider
      value={{
        environmentalData,
        setEnvironmentalData,
        hasCustomData,
        setHasCustomData,
        resetToDemo
      }}
    >
      {children}
    </EnvironmentalContext.Provider>
  );
};

export const useEnvironmental = () => {
  const context = useContext(EnvironmentalContext);
  if (!context) {
    throw new Error('useEnvironmental must be used within an EnvironmentalProvider');
  }
  return context;
};
