import axios from "axios";
import { handleError } from "../utils/ErrorHandler";
import { UserProfileToken } from "../types/User";
import { API_BASE_URL } from "../constants";

export const getMyCompaniesAPI = async () => {
    try {
        const token  = localStorage.getItem("token");
        const data = await axios.get(API_BASE_URL + "companies/my-companies", {
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
        const data = await axios.get(API_BASE_URL + "companies", {
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
        const data = await axios.post(API_BASE_URL + "companies", {
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
        const data = await axios.delete(API_BASE_URL + `companies/${id}`, {
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
        const data = await axios.put(API_BASE_URL + `companies/${id}`, {
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
        const data = await axios.get(API_BASE_URL + `companies/${id}`, { 
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