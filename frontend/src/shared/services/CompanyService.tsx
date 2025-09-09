import axios from "axios";
import { handleError } from "../utils/ErrorHandler";
import { UserProfileToken } from "../types/User";

const api = "http://localhost:5268/api/";

export const getMyCompaniesAPI = async () => {
    try {
        const token  = localStorage.getItem("token");
        const data = await axios.get(api + "companies/my-companies", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    } catch (error) {
        handleError(error);
    }
}

export const getAllCompaniesAPI = async () => {
    try {
        const token  = localStorage.getItem("token");
        const data = await axios.get(api + "companies", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    } catch (error) {
        handleError(error);
    }
}

export const createCompanyAPI = async (name: string) => {
    try {
        const token  = localStorage.getItem("token");
        const data = await axios.post(api + "companies", {
            name: name,
        }, { headers: {
            Authorization: `Bearer ${token}`
        }});
        return data;
    } catch (error) {
        handleError(error);
    }   
}

export const deleteCompanyAPI = async (id: number) => {
    try {
        const token  = localStorage.getItem("token");
        const data = await axios.delete(api + `companies/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`    
            }
        });
        return data;
    }
    catch (error) {
        handleError(error);
    }
}

export const updateCompanyAPI = async (id: number, name: string) => {   
    try {
        const token  = localStorage.getItem("token");
        const data = await axios.put(api + `companies/${id}`, {
            name: name,
        }, { headers: { 
            Authorization: `Bearer ${token}`
        }});
        return data;
    } catch (error) {
        handleError(error);
    }
}

export const getCompanyByIdAPI = async (id: number) => {
    try {
        const token  = localStorage.getItem("token");
        const data = await axios.get(api + `companies/${id}`, { 
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    } catch (error) {
        handleError(error);
    }                           
}

const CompanyService = {
    getMyCompaniesAPI,
    getAllCompaniesAPI,
    createCompanyAPI,
    deleteCompanyAPI,
    updateCompanyAPI,
    getCompanyByIdAPI
};

export default CompanyService;