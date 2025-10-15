import React, { useEffect } from 'react'
import logo from '../../assets/Logo-blauw-wit.jpg'
import SearchableDropdown from '../../shared/components/ui/SearchableDropdown'
import { useAuth } from '../../Context/useAuth';
import { Link} from 'lucide-react';
import  CompanyService from '../../shared/services/CompanyService';
import CreateCompanyModal from '../../shared/modals/createCompanyModal';
import CreateConfigurationModal from '../../shared/modals/createConfigurationModal';
import { useCompany } from '../../Context/useCompany';
import { useConfig } from '../../Context/useConfig';
import { configurationService } from '../../domains/machine-configuration/services/ConfigurationService';



type Props = {}

const NavBar: React.FC<Props> = (props: Props) => {
  const {isLoggedIn, user, token, logoutUser} = useAuth();
  const { selectedCompany, setSelectedCompany } = useCompany();
  const { selectedConfiguration, setSelectedConfiguration } = useConfig();
  const [companies, setCompanies] = React.useState<{ id: string; name: string }[]>([]);
  const [configurations, setConfigurations] = React.useState<{ id: string; name: string }[]>([]);
  // Dropdown menu state and close logic
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [showCreateCompany, setShowCreateCompany] = React.useState(false);
  const [showCreateConfiguration, setShowCreateConfiguration] = React.useState(false);

  useEffect(() => {
    if(!token) return;
    CompanyService.getMyCompaniesAPI().then(res => {
      if (res && res.data) setCompanies(res.data);
    })
    .catch(err => { /* handle error */ });
  }, [token]);

  // Load configurations when a company is selected
  useEffect(() => {
    // Reset selected configuration when company changes
    setSelectedConfiguration(null);
    
    if (!selectedCompany) {
      setConfigurations([]);
      return;
    }
    
    configurationService.GetMyConfigurationsAPI(Number(selectedCompany.id))
      .then((data: any) => {
        if (data && Array.isArray(data)) {
          setConfigurations(data);
        } else {
          setConfigurations([]);
        }
      })
      .catch(() => setConfigurations([]));
  }, [selectedCompany]); // Only depend on selectedCompany

  // Listen for custom event to refresh configurations
  useEffect(() => {
    const handleRefresh = () => {
      if (!selectedCompany) {
        setConfigurations([]);
        return;
      }
      configurationService.GetMyConfigurationsAPI(Number(selectedCompany.id))
        .then((data: any) => {
          if (data && Array.isArray(data)) {
            setConfigurations(data);
          } else {
            setConfigurations([]);
          }
        })
        .catch(() => setConfigurations([]));
    };
    
    window.addEventListener('refreshConfigurations', handleRefresh);
    return () => window.removeEventListener('refreshConfigurations', handleRefresh);
  }, [selectedCompany]);

  React.useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.relative')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);
  return (
    <div className="fixed top-0 left-0 w-screen h-32 flex flex-row bg-vendolutionBlue text-white shadow-md z-[100]">
      {/* Logo */}
      <div className="flex items-center">
        <img src={logo} alt="Vendolution Logo" className="h-32 w-auto" />
      </div>
      <div className = "flex-1 flex items-center justify-center gap-4">

        <SearchableDropdown 
          className = ""
          options={companies.map(c => c.name)}
          placeholder="Kies Bedrijf" 
          value={selectedCompany ? selectedCompany.name : ""}
          buttonColor = "bg-vendolutionGreen"
          backgroundColor = "bg-white"
          textColor = "text-black"
          borderColor = "border-black"
          hoverColor = "hover:bg-vendolutionColdBlue"
          focusColor = "focus:ring-vendolutionColdBlue focus:border-vendolutionColdBlue"
          selectedColor = "bg-vendolutionLightBlue text-white"
          onChange={name=> {
            const company = companies.find(c => c.name === name);
            if (company) {
              setSelectedCompany({ id: company.id, name: company.name });
              setSelectedConfiguration(null); // Clear selected configuration when company changes
            }
          }}
        />

        <SearchableDropdown 
          className = ""
          options={
            !selectedCompany
              ? ["Kies eerst een bedrijf"]
              : configurations.length > 0
                ? ["Kies Machine", ...configurations.map(cfg => cfg.name)]
                : ["Geen configuraties gevonden"]
          }
          placeholder="kies een configuratie"
          value={selectedConfiguration ? selectedConfiguration.name : ""}
          buttonColor = "bg-vendolutionWarm"
          backgroundColor = "bg-white"
          textColor = "text-black"
          borderColor = "border-black"
          hoverColor = "hover:bg-vendolutionColdBlue"
          focusColor = "focus:ring-vendolutionColdBlue focus:border-vendolutionColdBlue"
          selectedColor = "bg-vendolutionLightBlue text-white"
          onChange={async name => {
            const config = configurations.find(cfg => cfg.name === name);
            if (config) {
              const fullConfig = await configurationService.LoadConfigurationAPI(Number(selectedCompany?.id), Number(config.id));
              setSelectedConfiguration(fullConfig);
            }
          }}
        />

        {isLoggedIn() ? (
          <div className ="hidden lg:flex items-center space-x-6 test-back">
            {/* Hamburger menu button with user email inside */}
            <div className="relative">
              <button
                className="flex flex-row items-center justify-between min-w-[200px] h-10 px-4 bg-vendolutionGreen rounded hover:bg-vendolutionColdBlue border border-gray-300 focus:outline-none"
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
              >
                <span className="truncate mr-2 text-white">{user?.email}</span>
                <span className="flex flex-col justify-center ml-2">
                  <span className="block w-6 h-0.5 bg-white mb-1"></span>
                  <span className="block w-6 h-0.5 bg-white mb-1"></span>
                  <span className="block w-6 h-0.5 bg-white"></span>
                </span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-50 border border-gray-200">
                  <button
                    className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={logoutUser}
                  >Uitloggen</button>
                  <button
                    className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => { setShowCreateCompany(true); setMenuOpen(false); }}
                  >Bedrijf Aanmaken</button>
                  <button
                    className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => {setShowCreateConfiguration(true); setMenuOpen(false); }}
                  >Configuratie Aanmaken</button>
                  <button
                    className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => { setSelectedCompany(null); setSelectedConfiguration(null); setMenuOpen(false); }}
                  >Selectie Wissen</button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className ="hidden lg:flex items-center space-x-6 test-back">
            <Link to="/login" className="hover:text-vendolutionLightBlue">Login </Link>
            <Link 
              to = "/register"
              className = "px-8 py-3 font-bold rounded text white bg-vendolutionGreen hover:opacity-70"
            >
              Make Account
            </Link>
          </div>
        )}
      </div>
      {/* Create Company Modal */}
      <CreateCompanyModal
        isOpen={showCreateCompany}
        onClose={() => setShowCreateCompany(false)}
        onCreate={() => {
          // Refresh companies after creating a new one
          if (token) {
            CompanyService.getMyCompaniesAPI().then(res => {
              if (res && res.data) setCompanies(res.data);
            });
          }
        }}
      />

      {/* Create Configuration Modal */}
      <CreateConfigurationModal
        isOpen={showCreateConfiguration}
        onClose={() => setShowCreateConfiguration(false)}
        onCreate={() => {
          // Refresh configurations after creating a new one
          window.dispatchEvent(new Event('refreshConfigurations'));
        }}
      />
            
                  
    </div>
  );
};

export default NavBar