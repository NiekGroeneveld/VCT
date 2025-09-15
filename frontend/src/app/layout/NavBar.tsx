import React, { useEffect } from 'react'
import logo from '../../assets/Logo-blauw-wit.jpg'
import SearchableDropdown from '../../shared/components/ui/SearchableDropdown'
import { useAuth } from '../../Context/useAuth';
import { Link} from 'lucide-react';
import  CompanyService from '../../shared/services/CompanyService';
import * as ConfigurationService from '../../shared/services/ConfigurationService';
import { useCompany } from '../../Context/useCompany';


type Props = {}

const NavBar: React.FC<Props> = (props: Props) => {
  const {isLoggedIn, user, token, logoutUser} = useAuth();
  const { selectedCompany, setSelectedCompany } = useCompany();
  const [companies, setCompanies] = React.useState<{ id: string; name: string }[]>([]);
  const [configurations, setConfigurations] = React.useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if(!token) return;
    CompanyService.getAllCompaniesAPI().then(res => {
      if (res && res.data) setCompanies(res.data);
    })
    .catch(err => { /* handle error */ });
  }, [token]);

  // Load configurations when a company is selected
  useEffect(() => {
    if (!selectedCompany) {
      setConfigurations([]);
      return;
    }
    // Store companyId in localStorage for ConfigurationService
    localStorage.setItem('companyId', selectedCompany.id);
    ConfigurationService.getMyConfigurationsAPI()
      .then((data: any) => {
        if (data && Array.isArray(data)) {
          setConfigurations(data);
        } else {
          setConfigurations([]);
        }
      })
      .catch(() => setConfigurations([]));
  }, [selectedCompany]);
  return (
    <div className="fixed top-0 left-0 w-screen h-32 flex flex-row bg-gray-900 text-white shadow-md z-[100]">
      {/* Logo */}
      <div className="flex items-center">
        <img src={logo} alt="Vendolution Logo" className="h-32 w-auto" />
      </div>
      <div className = "flex-1 flex items-center justify-center gap-4">

        <SearchableDropdown 
          className = ""
          options={companies.map(c => c.name)}
          placeholder="Kies Bedrijf" 
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
              setSelectedCompany(company);
              localStorage.setItem('companyId', company.id);
            }
          }}
        />

        <SearchableDropdown 
          className = ""
          options={
            !selectedCompany
              ? ["Kies eerst een bedrijf"]
              : configurations.length > 0
                ? configurations.map(cfg => cfg.name)
                : ["Geen configuraties gevonden"]
          }
          placeholder="Kies Machine" 
          buttonColor = "bg-vendolutionWarm"
          backgroundColor = "bg-white"
          textColor = "text-black"
          borderColor = "border-black"
          hoverColor = "hover:bg-vendolutionColdBlue"
          focusColor = "focus:ring-vendolutionColdBlue focus:border-vendolutionColdBlue"
          selectedColor = "bg-vendolutionLightBlue text-white"
          onChange={name => {
            const config = configurations.find(cfg => cfg.name === name);
            if (config) {
              localStorage.setItem('configuration', JSON.stringify({ id: config.id, name: config.name }));
            }
          }}
        />

        {isLoggedIn() ? (
          <div className ="hidden lg:flex items-center space-x-6 test-back">
            <div className="hover:text-vendolutionLightBlue"> {user?.email} </div>
            <a
              onClick={logoutUser}
              className = "px-8 py-3 font-bold rounded text white bg-vendolutionGreen hover:opacity-70"
            >
              Logout
            </a>
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
    </div>
  );
};

export default NavBar