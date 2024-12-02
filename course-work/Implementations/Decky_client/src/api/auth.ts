import axios from "axios";

const API_URL = "http://localhost:4000/auth";

export const register = (data: {
    username: string;
    email: string;
    password: string;
}) => axios.post(`${API_URL}/register`, data);

export const login = (data: { email: string; password: string }) =>
    axios.post(`${API_URL}/login`, data);
