import { createContext, useEffect, useState } from "react";
import { UserProfile } from "../shared/types/User";
import {useNavigate} from 'react-router-dom';
import { loginAPI, registerAPI } from "../shared/services/AuthService";
import { toast } from "react-toastify";
import axios from "axios";
import React from "react";

type UserContextType = {
    user: UserProfile | null;

    token: string | null;
    registerUser: (email: string, password: string) => void;
    loginUser: (email: string, password: string) => void;
    logoutUser: () => void;
    isLoggedIn: () => boolean;
}

type Props = {children : React.ReactNode};
const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({children} : Props) => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (user && token) {
            setUser(JSON.parse(user));
            setToken(token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setIsReady(true);
    }, []);

    const registerUser = async(email: string, password: string) => {
        await registerAPI(email, password).then((res) => {
            if(res) {
                localStorage.setItem("token", res?.data.token);
                const userObj = {
                    email: res?.data.email,
                }
                localStorage.setItem("user", JSON.stringify(userObj));
                setToken(res?.data.token!);
                setUser(userObj!);
                toast.success("Registration successful");
                navigate("/home");
            }
        }).catch((e) => toast.warning("Server error occurred"));
    }

    const loginUser = async(email: string, password: string) => {
        await loginAPI(email, password).then((res) => {
            if(res) {
                localStorage.setItem("token", res?.data.token);
                const userObj = {
                    email: res?.data.email,
                }
                localStorage.setItem("user", JSON.stringify(userObj));
                setToken(res?.data.token!);
                setUser(userObj!);
                toast.success("Login successful");
                navigate("/home");
            }
        }).catch((e) => toast.warning("Server error occurred"));
    }

    const isLoggedIn = () => {
        return !!user;
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setToken("");
        navigate("/login");
        toast.success("Logged out successfully");
    };

    return(
        <UserContext.Provider 
            value={{ loginUser, registerUser, logoutUser: logout, isLoggedIn, user, token }}
        >
            {isReady? children : null}
        </UserContext.Provider>
    )

};

export const useAuth = () => React.useContext(UserContext)