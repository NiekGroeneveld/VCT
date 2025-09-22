import axios from "axios";
import { Configuration } from "../types/configuration.types";
import { handleError } from "../../../shared/utils/ErrorHandler";
import { Product } from "@/domains/product-management/types/product.types";

export const AddTrayToConfigurationAPI = async(companyId: number, configurationId: number, trayPosition: number): Promise<Configuration | null> => {
    try{
        const api = "http://localhost:5268/api/";
        const token  = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        if (!companyId) throw new Error("No company selected");
        if (!configurationId) throw new Error("No configuration selected");
        const response = await axios.put(api + `companies/${companyId}/configuration/${configurationId}/TrayInConfiguration/addTrayToConfiguration/${trayPosition}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }  catch (error) {
        handleError(error);
        return null;
    }
}

export const RemoveTrayFromConfigurationAPI = async(companyId: number, configurationId: number, trayId: number): Promise<any> => {
    try{
        const api = "http://localhost:5268/api/";
        const token  = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        if (!companyId) throw new Error("No company selected");
        if (!configurationId) throw new Error("No configuration selected");
        const response = await axios.put(api + `companies/${companyId}/configuration/${configurationId}/TrayInConfiguration/removeTrayFromConfiguration/${trayId}`,  {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }  catch (error) {
        handleError(error);
        return null;
    }
}

export const UpdateTrayPositionInConfigurationAPI = async(companyId: number, configurationId: number, trayId: number, newPosition: number): Promise<any> => {
    try{
        const api = "http://localhost:5268/api/";
        const token  = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        if (!companyId) throw new Error("No company selected");
        if (!configurationId) throw new Error("No configuration selected");
        const response = await axios.put(api + `companies/${companyId}/configuration/${configurationId}/TrayInConfiguration/updateTrayPosition/${trayId}/${newPosition}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }  catch (error) {
        handleError(error);
        return null;
    }
}

export const LoadConfigurationAPI = async(companyId: number, configurationId: number): Promise<Configuration | null> => {
    try{
        const api = "http://localhost:5268/api/";
        const token  = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        if (!companyId) throw new Error("No company selected");
        if (!configurationId) throw new Error("No configuration selected");

        const response = await axios.get(api + `companies/${companyId}/configurations/LoadConfigurationArea/${configurationId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }  catch (error) {
        handleError(error);
        return null;
    }
}


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
        const configuration = await axios.get(api + `companies/${companyId}/configurations/${configurationid}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        return configuration.data as Configuration;
    }
    catch (error) {
        handleError(error);
        return null;
    }
};

export const PlaceProductOnTrayAPI = async(companyId: number, configurationId: number, trayId: number, productId: number, positionOnTray: number): Promise<any> => {
    try{
        const api = "http://localhost:5268/api/";
        const token  = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        if (!companyId) throw new Error("No company selected");
        if (!configurationId) throw new Error("No configuration selected");
        const response = await axios.put(
            api + `companies/${companyId}/configuration/${configurationId}/placedProduct/addProductToTray/${trayId}/${productId}/${positionOnTray}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    }  catch (error) {
        handleError(error);
        return null;
    }
};


// Export a singleton instance
export const configurationService = {
    AddTrayToConfigurationAPI,
    RemoveTrayFromConfigurationAPI,
    UpdateTrayPositionInConfigurationAPI,
    LoadConfigurationAPI
    ,GetMyConfigurationsAPI,
    CreateConfigurationAPI,
    GetConfigurationByIdAPI,
    PlaceProductOnTrayAPI
}