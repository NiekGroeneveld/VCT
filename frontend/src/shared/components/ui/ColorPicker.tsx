import React from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

// Helper function to convert HSL to Hex
const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

// Helper function to validate hex color
const isValidHex = (hex: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
};

export const ColorPicker: React.FC<ColorPickerProps> = ({ 
  value, 
  onChange, 
  className = '' 
}) => {
  const handleColorClick = (color: string) => {
    onChange(color);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Allow partial input while typing
    if (newValue.startsWith('#') && newValue.length <= 7) {
      onChange(newValue);
    }
  };

  // Generate color grid using HSL
  const generateColorGrid = () => {
    const colors: string[] = [];
    
    // Generate a spectrum of colors
    for (let lightness = 20; lightness <= 80; lightness += 10) {
      for (let hue = 0; hue < 360; hue += 30) {
        const saturation = lightness < 50 ? 80 : 70; // Higher saturation for darker colors
        colors.push(hslToHex(hue, saturation, lightness));
      }
    }
    
    // Add some grayscale colors
    const grayscale = ['#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF'];
    colors.push(...grayscale);
    
    return colors;
  };

  const colorGrid = generateColorGrid();

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Color preview and hex input */}
      <div className="flex items-center gap-3">
        <div 
          className="w-12 h-12 rounded-lg border-2 border-gray-400 flex-shrink-0"
          style={{ backgroundColor: isValidHex(value) ? value : '#3B82F6' }}
          title={`Current color: ${value}`}
        />
        <input
          type="text"
          value={value}
          onChange={handleHexInputChange}
          placeholder="#3B82F6"
          className="flex-1 px-3 py-2 border bg-gray-600 border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent font-mono text-sm uppercase"
        />
      </div>
      
      {/* Color grid */}
      <div className="grid grid-cols-12 gap-1 p-2 bg-gray-700 rounded-lg max-h-32 overflow-y-auto">
        {colorGrid.map((color, index) => (
          <button
            key={`${color}-${index}`}
            type="button"
            onClick={() => handleColorClick(color)}
            className={`w-6 h-6 rounded border transition-all hover:scale-110 hover:z-10 relative ${
              value.toLowerCase() === color.toLowerCase() 
                ? 'border-white border-2 shadow-lg' 
                : 'border-gray-500 hover:border-white'
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
      
      {/* Quick preset colors */}
      <div>
        <div className="text-xs text-gray-300 mb-2">Populaire kleuren:</div>
        <div className="flex gap-2 flex-wrap">
          {[
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
            '#74B9FF', '#A29BFE', '#FD79A8', '#FDCB6E', '#6C5CE7', '#00B894'
          ].map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleColorClick(color)}
              className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                value.toLowerCase() === color.toLowerCase() 
                  ? 'border-white shadow-lg' 
                  : 'border-gray-400 hover:border-white'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
      
      {/* Validation feedback */}
      {value && !isValidHex(value) && (
        <div className="text-red-400 text-xs">
          Ongeldige hex kleurcode. Gebruik formaat: #RRGGBB
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
