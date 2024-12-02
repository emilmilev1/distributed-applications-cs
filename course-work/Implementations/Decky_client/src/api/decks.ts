import axios from "axios";
import { CardData } from "../interface/card";

const API_URL = "http://localhost:4000/decks";

export const getDecks = (token: string, query = {}) => {
    const params = new URLSearchParams(
        query as Record<string, string>
    ).toString();
    return axios.get(`${API_URL}?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const getCards = (token: string) =>
    axios.get(`${API_URL}/cards`, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const createDeck = (
    name: string,
    deckDescription: string,
    cards: CardData[],
    token: string
) =>
    axios.post(
        API_URL,
        { name, deckDescription, cards },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );

export const updateDeck = (
    id: number,
    data: { name: string; cards: string[] },
    token: string
) =>
    axios.put(`${API_URL}/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const deleteDeck = (id: number, token: string) =>
    axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
