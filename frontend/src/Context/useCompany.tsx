
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
type Company = {
    id: string;
    name: string;
};

type CompanyContextType = {
    selectedCompany: Company | null;
    setSelectedCompany: (company: Company | null) => void;
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);



export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCompany, setSelectedCompanyState] = useState<Company | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('selectedCompany');
    if (stored) {
      try {
        setSelectedCompanyState(JSON.parse(stored));
      } catch {}
    }
  }, []);

  // Save to localStorage whenever selectedCompany changes
  useEffect(() => {
    if (selectedCompany) {
      localStorage.setItem('selectedCompany', JSON.stringify(selectedCompany));
    } else {
      localStorage.removeItem('selectedCompany');
    }
  }, [selectedCompany]);

  // Setter that updates state and localStorage
  const setSelectedCompany = (company: Company | null) => {
    setSelectedCompanyState(company);
  };

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
