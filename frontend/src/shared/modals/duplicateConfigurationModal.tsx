import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface DuplicateConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDuplicate: (newName: string) => void;
  originalName: string;
}

const DuplicateConfigurationModal: React.FC<DuplicateConfigurationModalProps> = ({
  isOpen,
  onClose,
  onDuplicate,
  originalName,
}) => {
  const [newName, setNewName] = useState(`${originalName} - kopie`);
  const [error, setError] = useState('');

  // Update default name when original name changes
  useEffect(() => {
    if (isOpen) {
      setNewName(`${originalName} - kopie`);
      setError('');
    }
  }, [isOpen, originalName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newName.trim()) {
      setError('Configuratie naam is verplicht');
      return;
    }

    if (newName.length > 100) {
      setError('Configuratie naam mag niet langer zijn dan 100 tekens');
      return;
    }

    onDuplicate(newName.trim());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Dupliceer Configuratie</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="configName" className="block text-sm font-medium text-gray-700 mb-2">
              Nieuwe Configuratie Naam
            </label>
            <input
              type="text"
              id="configName"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setError('');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Voer nieuwe naam in"
              autoFocus
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Annuleren
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Dupliceer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DuplicateConfigurationModal;
