import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Configuration} from '../domains/machine-configuration/types/configuration.types';


type ConfigurationContextType = {
    selectedConfiguration: Configuration | null;
    setSelectedConfiguration: (configuration: Configuration | null) => void;
}
const ConfigurationContext = createContext<ConfigurationContextType | undefined>(undefined);

export const ConfigurationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedConfiguration, setSelectedConfigurationState] = useState<Configuration | null>(null);
    // Load from localStorage on mount
    const stored = localStorage.getItem('selectedConfiguration');
    useEffect(() => {
        if (stored) {
            try {
                setSelectedConfigurationState(JSON.parse(stored));
            } catch {}
        }
    }, []);

    // Save to localStorage whenever selectedConfiguration changes
    useEffect(() => {
        if (selectedConfiguration) {
            localStorage.setItem('selectedConfiguration', JSON.stringify(selectedConfiguration));
        } else {
            localStorage.removeItem('selectedConfiguration');
        }
    }, [selectedConfiguration]);
    // Setter that updates state and localStorage
    const setSelectedConfiguration = (configuration: Configuration | null) => {
        setSelectedConfigurationState(configuration );
    };
    return (
    <ConfigurationContext.Provider value={{ selectedConfiguration, setSelectedConfiguration }}>
        {children}
    </ConfigurationContext.Provider>
    );
};

export const useConfig = (): ConfigurationContextType => {
    const context = useContext(ConfigurationContext);
    if (!context) {
        throw new Error('useConfig must be used within a ConfigurationProvider');
    }
    return context;
}