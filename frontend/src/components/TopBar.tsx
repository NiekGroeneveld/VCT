import React from 'react'
import logo from '../assets/Logo-blauw-wit.jpg'
import SearchableDropdown from './ui/SearchableDropdown'


type Props = {}

const TopBar: React.FC<Props> = (props: Props) => {
  return (
    <div className="fixed top-0 left-0 w-screen h-32 flex flex-row bg-gray-900 text-white shadow-md">
      {/* Logo */}
      <div className="flex items-center">
        <img src={logo} alt="Vendolution Logo" className="h-32 w-auto" />
      </div>
      <div className = "flex-1 flex items-center justify-center gap-4">
        <SearchableDropdown 
          className = ""
          options={["NomNomNom", "KoffieMax", "van Lopik", "shabushabu", "VVAltena", "VVSleeuwijk", "Hoi"]} 
          placeholder="Kies klant" 
          buttonColor = "bg-vendolutionGreen"
          backgroundColor = "bg-white"
          textColor = "text-black"
          borderColor = "border-black"
          hoverColor = "hover:bg-vendolutionColdBlue"
          focusColor = "focus:ring-vendolutionColdBlue focus:border-vendolutionColdBlue"
          selectedColor = "bg-vendolutionLightBlue text-white"
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
      </div>
    </div>
  );
};

export default TopBar