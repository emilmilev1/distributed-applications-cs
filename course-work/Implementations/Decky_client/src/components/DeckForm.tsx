import React, { useState, useContext } from "react";
import { createDeck } from "../api/decks";
import { AuthContext } from "../context/AuthContext";
import { Card } from "@mui/material";

type Card = {
    id: number;
    name: string;
    iconUrls: string;
};

const DeckForm = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [cards, setCards] = useState<Card[]>([]);
    const { token } = useContext(AuthContext);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (token) {
            createDeck(name, description, cards, token).then(() => {
                setName("");
                setDescription("");
                setCards([]);
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Deck Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Deck Description"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Cards (comma-separated)"
                value={cards.map((card) => card.name).join(", ")}
                onChange={(e) => {
                    const cardNames = e.target.value.split(",");
                    const newCards = cardNames.map((name, index) => ({
                        id: index,
                        name: name.trim(),
                        iconUrls: "",
                    }));
                    setCards(newCards);
                }}
                required
            />
            <button type="submit">Create Deck</button>
        </form>
    );
};

export default DeckForm;
