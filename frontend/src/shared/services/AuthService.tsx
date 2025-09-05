import axios from "axios";
import { handleError } from "../utils/ErrorHandler";
import { UserProfileToken } from "../types/User";

const api = "http://localhost:5268/api/";

export const loginAPI = async (email: string, password: string) => {
    try {
        const data = await axios.post<UserProfileToken>(api + "account/login", {
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
        const data = await axios.post<UserProfileToken>(api + "account/register", {
            email: email,
            password: password,
        });
        return data;
    } catch (error) {
        handleError(error);
    }
}