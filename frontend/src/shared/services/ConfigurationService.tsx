import axios from "axios";
import { handleError } from "../utils/ErrorHandler";
import { UserProfileToken } from "../types/User";

const api = "http://localhost:5268/api/";

export const getMyConfigurationsAPI = async () => {
    try {
        const token  = localStorage.getItem("token");
        const companyId = localStorage.getItem("companyId");
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


