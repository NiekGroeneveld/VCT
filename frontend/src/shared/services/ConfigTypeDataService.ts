import axios from 'axios';
import { API_BASE_URL } from '../constants';

export const getConfigTypesAPI = async () : Promise<string[]> => {
    try {
        const response = await axios.get(`${API_BASE_URL}ConfigurationTypeData/types`);
        return response.data;
    } catch (error) {   
        console.error('Error fetching configuration type data:', error);
        throw error;
    }
};