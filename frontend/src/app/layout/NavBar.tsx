import React, { useEffect } from 'react'
import logo from '../../assets/Logo-blauw-wit.jpg'
import SearchableDropdown from '../../shared/components/ui/SearchableDropdown'
import { useAuth } from '../../Context/useAuth';
import { Link} from 'lucide-react';
import  CompanyService from '../../shared/services/CompanyService';
import { useCompany } from '../../Context/useCompany';


type Props = {}

const NavBar: React.FC<Props> = (props: Props) => {
  const {isLoggedIn, user, token, logoutUser} = useAuth();
  const { selectedCompany, setSelectedCompany } = useCompany();
  const [companies, setCompanies] = React.useState<{ id: string; name: string }[]>([]);
  useEffect(() => {
    if(!token) return;
    CompanyService.getAllCompaniesAPI().then(res => {
      if (res && res.data) setCompanies(res.data);
    })
    .catch(err => { /* handle error */ });
  }, [token]);
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
            if (company) setSelectedCompany(company);
          }}
        />

        <SearchableDropdown 
          className = ""
          options={["Machine 1", "Machine 2", "Machine 3", "Machine 4", "Machine 5", "Machine 6", "Machine 7"]} 
          placeholder="Kies Machine" 
          buttonColor = "bg-vendolutionWarm"
          backgroundColor = "bg-white"
          textColor = "text-black"
          borderColor = "border-black"
          hoverColor = "hover:bg-vendolutionColdBlue"
          focusColor = "focus:ring-vendolutionColdBlue focus:border-vendolutionColdBlue"
          selectedColor = "bg-vendolutionLightBlue text-white"
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