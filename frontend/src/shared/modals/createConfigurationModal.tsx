import React, {useState} from "react";
import {configurationService} from "../../domains/machine-configuration/services/ConfigurationService";
import { useCompany } from "../../Context/useCompany";

type CreateConfigurationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (configurationName: string) => void;
};

interface ConfigurationFormData{
    Name: string;
    ConfigurationType: string;
}

const CreateConfigurationModal: React.FC<CreateConfigurationModalProps> = ({isOpen, onClose, onCreate}) => {
    const [formData, setFormData] = useState<ConfigurationFormData>({Name: '', ConfigurationType: 'VisionV8'});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { selectedCompany } = useCompany();
    const companyId = selectedCompany ? Number(selectedCompany.id) : null;
    const handleInputChange = (
        field : keyof ConfigurationFormData,
        value: string
    ) => {
        setFormData(prev => ({...prev, [field]: value}));
        if(error) setError(null);
    };

    const validateForm = (): boolean => {
        if(formData.Name.trim().length === 0){
            setError("Configuration name cannot be empty");
            return false;
        }
        if(formData.Name.length > 50){
            setError("Configuration name cannot exceed 50 characters");
            return false;
        }
        if(formData.ConfigurationType !== 'VisionV8'){
            setError("Invalid configuration type selected, other types than VisionV8 are not supported yet");
        }
        return true;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!validateForm()) return;

        setLoading(true);
        setError(null);
        try{
            //create new JSON for configurationCreate
            
            // You need to pass companyId as the first argument. This is a placeholder, replace with actual companyId.
            // Example: await configurationService.CreateConfigurationAPI(companyId, { ... })
            await configurationService.CreateConfigurationAPI(Number(companyId),
                {
                    Name: formData.Name.trim(),
                    ConfigurationType: formData.ConfigurationType
                }
            );

            //Reset formdata
            setFormData({Name: '', ConfigurationType: 'VisionV8'});
            onCreate(formData.Name);
            onClose();
        } catch (err) {
            console.error("Error creating configuration:", err);
            setError("Failed to create configuration. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({Name: '', ConfigurationType: 'VisionV8'});
        setError(null);
        onClose();
    };

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-[9999] transition-colors ${
                isOpen
                    ? "bg-black bg-opacity-50 visible pointer-events-auto"
                    : "bg-transparent invisible pointer-events-none"
            }`}
            onClick={handleClose}
        >
            <div className="bg-gray-800 rounded-lg shadow-lg w-96 p-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-gray-100 mb-4">Create Configuration</h2>
                {error && <div className="mb-4 text-red-500">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Configuration Name"    
                        value={formData.Name}
                        onChange={e => handleInputChange('Name', e.target.value)}
                        className="w-full bg-gray-600 border border-gray-300 rounded px-3 py-2 mb-4 text-white"
                        disabled={loading}
                        />
                    <select
                        value={formData.ConfigurationType}
                        onChange={e => handleInputChange('ConfigurationType', e.target.value)}  
                        className="w-full bg-gray-600 border border-gray-300 rounded px-3 py-2 mb-4 text-white"
                        disabled={loading}
                    >     
                        <option value="VisionV8">VisionV8</option>
                        {/* Future configuration types can be added here */}
                        {/* <option value="standard">Standard</option> */}
                    </select>
                    <div className="flex justify-end space-x-2">
                        <button 
                            type="button"
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            onClick={handleClose}
                            disabled={loading}
                        >Cancel</button>
                        <button 
                            type="submit"   
                            className="px-4 py-2 bg-vendolutionGreen text-white rounded hover:bg-vendolutionColdBlue"
                            disabled={loading}
                        >{loading ? 'Creating...' : 'Create'}</button>
                    </div>
                </form>
            </div>
        </div>



    );
};

export default CreateConfigurationModal;
        
