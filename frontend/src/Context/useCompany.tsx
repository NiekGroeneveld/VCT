import React, { createContext, useContext, useState, ReactNode } from 'react';

type Company = {
    id: string;
    name: string;
};

type CompanyContextType = {
    selectedCompany: Company | null;
    setSelectedCompany: (company: Company) => void;
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  return (
    <CompanyContext.Provider value={{ selectedCompany, setSelectedCompany }}>
      {children}
    </CompanyContext.Provider>
  );
};


export const useCompany = (): CompanyContextType => {
    const context = useContext(CompanyContext);
    if (!context) {
        throw new Error('useCompany must be used within a CompanyProvider');
    }
    return context;
};
