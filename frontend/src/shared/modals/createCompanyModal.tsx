import React, {useState} from "react";
import CompanyService from "../services/CompanyService";

type CreateCompanyModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (companyName: string) => void;
};

interface CompanyFormData{
    companyName: string;
}

const CreateCompanyModal: React.FC<CreateCompanyModalProps> = ({isOpen, onClose, onCreate}) => {
 const [formData, setFormData] = useState<CompanyFormData>({companyName: ''});
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const handleInputChange = (
    field : keyof CompanyFormData,
    value: string
 ) => {
    setFormData(prev => ({...prev, [field]: value}));
    if(error) setError(null);
 };


 const validateForm = (): boolean => {
    if(formData.companyName.trim().length === 0){
        setError("Company name cannot be empty");
        return false;
    }
    if(formData.companyName.length > 50){
        setError("Company name cannot exceed 50 characters");
        return false;
    }
    return true;
 };

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!validateForm()) return;

    setLoading(true);
    setError(null);

    try{
        //create new JSON for companyCreate
        const newCompany = {
            name: formData.companyName.trim()
        };

        await CompanyService.createCompanyAPI(newCompany.name);

        //Reset formdata
        setFormData({companyName: ''});
        onCreate(newCompany.name);
        onClose();
    } catch (err) {
        console.error("Error creating company:", err);
        setError("Failed to create company. Please try again.");
    } finally {
        setLoading(false);
    }
 };

    const handleClose = () => {
        setFormData({companyName: ''});
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
                <h2 className="text-xl font-bold text-gray-100 mb-4">Create Company</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="w-full bg-gray-600 border-gray-300 rounded px-3 py-2 mb-2"
                        placeholder="Company Name"
                        value={formData.companyName}
                        onChange={e => handleInputChange('companyName', e.target.value)}
                        disabled={loading}
                    />
                    {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
                    <div className="flex justify-end space-x-2 mt-4">
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
}

export default CreateCompanyModal;