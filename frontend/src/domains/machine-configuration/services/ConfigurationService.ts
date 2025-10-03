import axios from "axios";
import { Configuration } from "../types/configuration.types";
import { handleError } from "../../../shared/utils/ErrorHandler";
import { ProductSpacingService } from "../../../domains/tray-management/services/ProductSpacingService";
import { TrayProductManager } from "../../../domains/tray-management/services/TrayProductManager";
import { API_BASE_URL } from "../../../shared/constants";

export const AddTrayToConfigurationAPI = async(companyId: number, configurationId: number, trayPosition: number): Promise<Configuration | null> => {
    try{
        const token  = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        if (!companyId) throw new Error("No company selected");
        if (!configurationId) throw new Error("No configuration selected");
        const response = await axios.put(API_BASE_URL + `companies/${companyId}/configuration/${configurationId}/TrayInConfiguration/addTrayToConfiguration/${trayPosition}`, {}, {
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
        const token  = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        if (!companyId) throw new Error("No company selected");
        if (!configurationId) throw new Error("No configuration selected");
        const response = await axios.put(API_BASE_URL + `companies/${companyId}/configuration/${configurationId}/TrayInConfiguration/removeTrayFromConfiguration/${trayId}`,  {
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
        const token  = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        if (!companyId) throw new Error("No company selected");
        if (!configurationId) throw new Error("No configuration selected");
        const response = await axios.put(API_BASE_URL + `companies/${companyId}/configuration/${configurationId}/TrayInConfiguration/updateTrayPosition/${trayId}/${newPosition}`, {}, {
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
        const token  = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        if (!companyId) throw new Error("No company selected");
        if (!configurationId) throw new Error("No configuration selected");

        const response = await axios.get(API_BASE_URL + `companies/${companyId}/configurations/LoadConfigurationArea/${configurationId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        let config = response.data as Configuration;
        config.trays = ProductSpacingService.spaceOutAllTrays(config.trays || []);
        
        // Ensure all products have correct y coordinates based on stable property
        config.trays = TrayProductManager.ensureCorrectYCoordinatesForAllTrays(config.trays);

        return config;
    }  catch (error) {
        handleError(error);
        return null;
    }
}


export const GetMyConfigurationsAPI = async(companyId: number) => {
    try {
        const token  = localStorage.getItem("token");   
        if (!token) throw new Error("No token found");
        if (!companyId) throw new Error("No company selected");
        const response = await axios.get(API_BASE_URL + `companies/${companyId}/configurations/getCompanyConfigurations`, {
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
        const token  = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        if (!companyId) throw new Error("No company selected");
        const response = await axios.post(API_BASE_URL + `companies/${companyId}/configurations`, configurationData, {
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
        const token  = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        if (!companyId) throw new Error("No company selected");
        const configuration = await axios.get(API_BASE_URL + `companies/${companyId}/configurations/${configurationid}`, {
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
        const token  = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        if (!companyId) throw new Error("No company selected");
        if (!configurationId) throw new Error("No configuration selected");
        const response = await axios.put(
            API_BASE_URL + `companies/${companyId}/configuration/${configurationId}/placedProduct/addProductToTray/${trayId}/${productId}/${positionOnTray}`,
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

export const RemoveProductFromTrayAPI = async(companyId: number, configurationId: number, trayId: number, positionOnTray: number): Promise<any> => {
    try{
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        if (!companyId) throw new Error("No company selected");
        if (!configurationId) throw new Error("No configuration selected");
        const response = await axios.delete(
            API_BASE_URL + `companies/${companyId}/configuration/${configurationId}/placedProduct/removeProductFromTray/${trayId}/${positionOnTray}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
 
        );
        return response.data;
    } catch (error) {
        handleError(error);
        return null;
    }
};

export const MoveProductBetweenTraysAPI = async(companyId: number, configurationId: number, fromTrayId: number, toTrayId: number, OldIndex: number): Promise<any> => {
    try{
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        if (!companyId) throw new Error("No company selected");
        if (!configurationId) throw new Error("No configuration selected");
        const response = await axios.put(
            API_BASE_URL + `companies/${companyId}/configuration/${configurationId}/placedProduct/moveProductBetweenTrays/${fromTrayId}/${toTrayId}/${OldIndex}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        handleError(error);
        return null;
    }
};

export const SameTrayReorderAPI = async(companyId: number, configurationId: number, trayId: number, oldIndex: number, newIndex: number): Promise<any> => {
    try{
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        if (!companyId) throw new Error("No company selected");
        if (!configurationId) throw new Error("No configuration selected");
        const response = await axios.put(
            API_BASE_URL + `companies/${companyId}/configuration/${configurationId}/placedProduct/updateProductPositionInTray/${trayId}/${oldIndex}/${newIndex}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        handleError(error);
        return null;
    }
};

export const UpdateElevatorSettingsAPI = async(companyId: number, configurationId: number, elevatorSetting: number, elevatorAddition: string): Promise<any | null> => {
    try{
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        if (!companyId) throw new Error("No company selected");
        if (!configurationId) throw new Error("No configuration selected");
        const response = await axios.put(
            API_BASE_URL + `companies/${companyId}/configurations/UpdateElevatorSettings/${configurationId}`,
            {
                elevatorSetting,
                elevatorAddition
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        handleError(error);
        return null;
    }
};

// Export a singleton instance
export const configurationService = {
    AddTrayToConfigurationAPI,
    RemoveTrayFromConfigurationAPI,
    UpdateTrayPositionInConfigurationAPI,
    LoadConfigurationAPI,
    GetMyConfigurationsAPI,
    CreateConfigurationAPI,
    GetConfigurationByIdAPI,
    PlaceProductOnTrayAPI,
    RemoveProductFromTrayAPI,
    MoveProductBetweenTraysAPI,
    SameTrayReorderAPI,
    UpdateElevatorSettingsAPI
}