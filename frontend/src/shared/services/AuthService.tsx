import axios from "axios";
import { handleError } from "../utils/ErrorHandler";
import { UserProfileToken } from "../types/User";
import { API_BASE_URL } from "../constants";

export const loginAPI = async (email: string, password: string) => {
    try {
        const data = await axios.post<UserProfileToken>(API_BASE_URL + "account/login", {
            email: email,
            password: password,
        });
        return data;
    } catch (error) {
        handleError(error);
    }
}

export const registerAPI = async (email: string, password: string) => {
    try {
        const data = await axios.post<UserProfileToken>(API_BASE_URL + "account/register", {
            email: email,
            password: password,
        });
        return data;
    } catch (error) {
        handleError(error);
    }
}