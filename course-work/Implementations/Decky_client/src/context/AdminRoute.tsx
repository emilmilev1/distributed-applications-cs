import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../context/AuthContext";

interface DecodedToken {
    role: string;
    exp: number;
    userId: string;
}

const AdminRoute = ({ children }: { children: JSX.Element }) => {
    const { token } = useContext(AuthContext);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded: DecodedToken = jwtDecode(token);
        if (decoded.role === "admin") {
            return children;
        } else {
            return <Navigate to="/decks" replace />;
        }
    } catch (error) {
        console.error("Token decoding failed", error);
        return <Navigate to="/login" replace />;
    }
};

export default AdminRoute;
