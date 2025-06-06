import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

interface SearchableDropdownProps {
  options: string[];
  placeholder?: string;
  onSelect?: (value: string) => void;
  value?: string;
  className?: string;
  // Color customization props
  buttonColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  hoverColor?: string;
  focusColor?: string;
  selectedColor?: string;
  // Scroll configuration
  maxVisibleOptions?: number;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({ 
  options = [], 
  placeholder = "Select an option...", 
  onSelect = () => {},
  value = "",
  className = "",
  buttonColor = "bg-white",
  backgroundColor = "bg-white",
  textColor = "text-gray-900",
  borderColor = "border-gray-300",
  hoverColor = "hover:bg-gray-100",
  focusColor = "focus:ring-blue-500 focus:border-blue-500",
  selectedColor = "bg-blue-50 text-blue-700",
  maxVisibleOptions = 6
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValue, setSelectedValue] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Calculate dynamic max height based on number of visible options
  const optionHeight = 40; // Approximate height of each option in pixels
  const maxHeight = maxVisibleOptions * optionHeight;

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
    }
  };

  const handleSelect = (option: string) => {
    setSelectedValue(option);
    setIsOpen(false);
    setSearchTerm('');
    onSelect(option);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={`relative w-64 ${className}`} ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        onClick={handleToggle}
        className={`w-full flex items-center justify-between px-6 py-5 text-left ${buttonColor} ${borderColor} rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 ${focusColor} transition-colors`}
      >
        <span className={`truncate ${selectedValue ? textColor : 'text-white'}`}>
          {selectedValue || placeholder}
        </span>
        <ChevronDown 
          className={`w-5 h-5 text-white transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute z-10 w-full mt-1 ${backgroundColor} ${borderColor} rounded-lg shadow-lg`}>
          {/* Search Bar */}
          <div className={`p-2 border-b ${borderColor}`}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search options..."
                className={`w-full pl-10 pr-4 py-2 text-sm border ${borderColor} rounded-md focus:outline-none focus:ring-2 ${focusColor} ${backgroundColor} ${textColor} placeholder-gray-400`}
              />
            </div>
          </div>

          {/* Options List */}
          <div 
            className="overflow-y-auto"
            style={{ maxHeight: `${maxHeight}px` }}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left px-4 py-2 text-sm ${hoverColor} focus:outline-none transition-colors ${
                    selectedValue === option ? selectedColor : textColor
                  }`}
                >
                  {option}
                </button>
              ))
            ) : (
              <div className={`px-4 py-2 text-sm text-gray-500 italic`}>
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;