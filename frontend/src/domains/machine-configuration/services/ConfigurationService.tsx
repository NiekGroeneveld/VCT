import axios from "axios";
import { handleError } from "../../../shared/utils/ErrorHandler";
import { UserProfileToken } from "../../../shared/types/User";
import {Configuration} from "../types/configuration.types";
// import { useCompany } from "../../../Context/useCompany";
// import { use } from "react";


   
export const GetMyConfigurationsAPI = async(companyId: number) => {
    try {
        const api = "http://localhost:5268/api/";
        const token  = localStorage.getItem("token");   
        if (!token) throw new Error("No token found");
        if (!companyId) throw new Error("No company selected");
        const response = await axios.get(api + `companies/${companyId}/configurations/getCompanyConfigurations`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const CreateConfigurationAPI = async(companyId: number, configurationData: any): Promise<any> => {
    try {
        const api = "http://localhost:5268/api/";
        const token  = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        if (!companyId) throw new Error("No company selected");
        const response = await axios.post(api + `companies/${companyId}/configurations`, configurationData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};
    
export const GetConfigurationByIdAPI = async(companyId: number, configurationid: number): Promise<Configuration | null> => {
    try{
        const api = "http://localhost:5268/api/";
        const token  = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        if (!companyId) throw new Error("No company selected");
        const response = await axios.get(api + `companies/${companyId}/configurations/${configurationid}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data as Configuration;
    }
    catch (error) {
        handleError(error);
        return null;
    }
};
                    // const selectedCompany = useCompany().selectedCompany;


export const configurationService = {
    GetMyConfigurationsAPI,
    CreateConfigurationAPI,
    GetConfigurationByIdAPI

}

