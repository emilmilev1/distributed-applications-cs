import React, { createContext, useState, ReactNode, useEffect } from "react";

interface User {
    id: number;
    username: string;
    email: string;
}

interface AuthContextType {
    token: string | null;
    user: User | null;
    setToken: (token: string | null) => void;
    setUser: (user: User | null) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    token: null,
    user: null,
    setToken: () => {},
    setUser: () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setTokenState] = useState<string | null>(null);
    const [user, setUserState] = useState<User | null>(null);

    const setToken = (newToken: string | null) => {
        setTokenState(newToken);
        if (newToken) {
            localStorage.setItem("token", newToken);
        } else {
            localStorage.removeItem("token");
        }
    };

    const setUser = (newUser: User | null) => {
        setUserState(newUser);
        if (newUser) {
            localStorage.setItem("user", JSON.stringify(newUser));
        } else {
            localStorage.removeItem("user");
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (savedToken) {
            setTokenState(savedToken);
        }

        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setUserState(parsedUser);
            } catch (error) {
                console.error("Failed to parse user data:", error);
                localStorage.removeItem("user");
            }
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{ token, user, setToken, setUser, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};
