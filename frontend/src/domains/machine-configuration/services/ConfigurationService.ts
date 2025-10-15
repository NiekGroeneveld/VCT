import axios from "axios";
import { Configuration } from "../types/configuration.types";
import { handleError } from "../../../shared/utils/ErrorHandler";
import { ProductSpacingService } from "../../../domains/tray-management/services/ProductSpacingService";
import { TrayProductManager } from "../../../domains/tray-management/services/TrayProductManager";
import { TrayPositionService } from "./TrayPositionService";
import { API_BASE_URL } from "../../../shared/constants";

/**
 * Process configuration data after loading from API
 * Handles PascalCase to camelCase mapping, spacing, y-coordinates, and collision detection
 */
const processConfigurationData = (config: Configuration): Configuration => {
    console.log('[processConfigurationData] Processing configuration...');
    
    // Map backend PascalCase properties to frontend camelCase
    if (config.trays) {
        config.trays = config.trays.map(tray => ({
            ...tray,
            products: tray.products?.map((product: any) => ({
                ...product,
                isActive: product.IsActive ?? product.isActive ?? true, // Map IsActive to isActive
            })) || []
        }));
    }
    
    config.trays = ProductSpacingService.spaceOutAllTrays(config.trays || []);
    
    // Ensure all products have correct y coordinates based on stable property
    config.trays = TrayProductManager.ensureCorrectYCoordinatesForAllTrays(config.trays);

    // Ensure collision detection is calculated immediately after loading
    console.log('[processConfigurationData] Running collision detection on loaded trays...');
    config.trays = TrayPositionService.updateCollisionStatus(config.trays, config);
    console.log('[processConfigurationData] Trays after collision detection:', config.trays.map(t => ({
        id: t.id,
        position: t.dotPosition,
        height: t.trayHeight,
        hasCollision: t.hasCollision
    })));

    return config;
};

export const AddTrayToConfigurationAPI = async(companyId: number, configurationId: number, trayPosition: number): Promise<Configuration | null> => {
    try{
        if (!companyId) throw new Error("No company selected");
        if (!configurationId) throw new Error("No configuration selected");
        const response = await axios.put(API_BASE_URL + `companies/${companyId}/configuration/${configurationId}/TrayInConfiguration/addTrayToConfiguration/${trayPosition}`, {});
        return response.data;
    }  catch (error) {
        handleError(error);
        return null;
    }
}

export const RemoveTrayFromConfigurationAPI = async(companyId: number, configurationId: number, trayId: number): Promise<any> => {
    try{
        if (!companyId) throw new Error("No company selected");
        if (!configurationId) throw new Error("No configuration selected");
        const response = await axios.put(API_BASE_URL + `companies/${companyId}/configuration/${configurationId}/TrayInConfiguration/removeTrayFromConfiguration/${trayId}`);
        return response.data;
    }  catch (error) {
        handleError(error);
        return null;
    }
}

export const UpdateTrayPositionInConfigurationAPI = async(companyId: number, configurationId: number, trayId: number, newPosition: number): Promise<any> => {
    try{
        if (!companyId) throw new Error("No company selected");
        if (!configurationId) throw new Error("No configuration selected");
        const response = await axios.put(API_BASE_URL + `companies/${companyId}/configuration/${configurationId}/TrayInConfiguration/updateTrayPosition/${trayId}/${newPosition}`, {});
        return response.data;
    }  catch (error) {
        handleError(error);
        return null;
    }
}

export const LoadConfigurationAPI = async(companyId: number, configurationId: number): Promise<Configuration | null> => {
    try{
        if (!companyId) throw new Error("No company selected");
        if (!configurationId) throw new Error("No configuration selected");

        const response = await axios.get(API_BASE_URL + `companies/${companyId}/configurations/LoadConfigurationArea/${configurationId}`);

        let config = response.data as Configuration;
        console.log('[LoadConfigurationAPI] Configuration loaded from API');
        
        return processConfigurationData(config);
    }  catch (error) {
        handleError(error);
        return null;
    }
}


export const GetMyConfigurationsAPI = async(companyId: number) => {
    try {
        if (!companyId) throw new Error("No company selected");
        const response = await axios.get(API_BASE_URL + `companies/${companyId}/configurations/getCompanyConfigurations`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const CreateConfigurationAPI = async(companyId: number, configurationData: any): Promise<any> => {
    try {
        if (!companyId) throw new Error("No company selected");
        const response = await axios.post(API_BASE_URL + `companies/${companyId}/configurations`, configurationData);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const GetConfigurationByIdAPI = async(companyId: number, configurationid: number): Promise<Configuration | null> => {
    try{
        if (!companyId) throw new Error("No company selected");
        const configuration = await axios.get(API_BASE_URL + `companies/${companyId}/configurations/${configurationid}`);
        
        return configuration.data as Configuration;
    }
    catch (error) {
        handleError(error);
        return null;
    }
};

export const PlaceProductOnTrayAPI = async(companyId: number, configurationId: number, trayId: number, productId: number, positionOnTray: number): Promise<any> => {
    try{
        if (!companyId) throw new Error("No company selected");
        if (!configurationId) throw new Error("No configuration selected");
        const response = await axios.put(
            API_BASE_URL + `companies/${companyId}/configuration/${configurationId}/placedProduct/addProductToTray/${trayId}/${productId}/${positionOnTray}`,
            {}
        );
        return response.data;
    }  catch (error) {
        handleError(error);
        return null;
    }
};

export const RemoveProductFromTrayAPI = async(companyId: number, configurationId: number, trayId: number, positionOnTray: number): Promise<any> => {
    try{
        if (!companyId) throw new Error("No company selected");
        if (!configurationId) throw new Error("No configuration selected");
        const response = await axios.delete(
            API_BASE_URL + `companies/${companyId}/configuration/${configurationId}/placedProduct/removeProductFromTray/${trayId}/${positionOnTray}`
        );
        return response.data;
    } catch (error) {
        handleError(error);
        return null;
    }
};

export const MoveProductBetweenTraysAPI = async(companyId: number, configurationId: number, fromTrayId: number, toTrayId: number, OldIndex: number): Promise<any> => {
    try{
        if (!companyId) throw new Error("No company selected");
        if (!configurationId) throw new Error("No configuration selected");
        const response = await axios.put(
            API_BASE_URL + `companies/${companyId}/configuration/${configurationId}/placedProduct/moveProductBetweenTrays/${fromTrayId}/${toTrayId}/${OldIndex}`,
            {}
        );
        return response.data;
    } catch (error) {
        handleError(error);
        return null;
    }
};

export const SameTrayReorderAPI = async(companyId: number, configurationId: number, trayId: number, oldIndex: number, newIndex: number): Promise<any> => {
    try{
        if (!companyId) throw new Error("No company selected");
        if (!configurationId) throw new Error("No configuration selected");
        const response = await axios.put(
            API_BASE_URL + `companies/${companyId}/configuration/${configurationId}/placedProduct/updateProductPositionInTray/${trayId}/${oldIndex}/${newIndex}`,
            {}
        );
        return response.data;
    } catch (error) {
        handleError(error);
        return null;
    }
};

export const UpdateElevatorSettingsAPI = async(companyId: number, configurationId: number, elevatorSetting: number, elevatorAddition: string): Promise<any | null> => {
    try{
        if (!companyId) throw new Error("No company selected");
        if (!configurationId) throw new Error("No configuration selected");
        const response = await axios.put(
            API_BASE_URL + `companies/${companyId}/configurations/UpdateElevatorSettings/${configurationId}`,
            {
                elevatorSetting,
                elevatorAddition
            }
        );
        return response.data;
    } catch (error) {
        handleError(error);
        return null;
    }
};

export const CloneConfigurationAPI = async(companyId: number, configurationId: number, newName: string): Promise<Configuration | null> => {
    try{
        if (!companyId) throw new Error("No company selected");
        if (!configurationId) throw new Error("No configuration selected");
        if (!newName) throw new Error("New configuration name is required");
        
        const response = await axios.post(
            API_BASE_URL + `companies/${companyId}/configurations/CloneConfiguration/${configurationId}`,
            { NewName: newName } // Use PascalCase to match C# DTO
        );
        
        let config = response.data as Configuration;
        
        // Process the configuration data the same way as LoadConfigurationAPI
        return processConfigurationData(config);
    } catch (error) {
        handleError(error);
        return null;
    }
};

export const DeleteConfigurationAPI = async(companyId: number, configurationId: number): Promise<boolean> => {
    try{
        if (!companyId) throw new Error("No company selected");
        if (!configurationId) throw new Error("No configuration selected");
        const response = await axios.delete(
            API_BASE_URL + `companies/${companyId}/configurations/${configurationId}`
        );
        return response.status === 204;
    }
    catch (error) {
        handleError(error);
        return false;
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
    UpdateElevatorSettingsAPI,
    CloneConfigurationAPI,
    DeleteConfigurationAPI
}