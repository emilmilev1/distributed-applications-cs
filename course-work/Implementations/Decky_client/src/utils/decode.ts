import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
    username: string;
}

/**
 *
 * @param token
 * @returns string | null
 */
export const decodeToken = (token: string): DecodedToken | null => {
    try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        return decodedToken;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};
