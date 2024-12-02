import React from "react";
import { Box, Typography, Button } from "@mui/material";

interface DeckCardProps {
    name: string;
    cards: string[];
    onDelete: () => void;
    onUpdate: () => void;
}

const DeckCard: React.FC<DeckCardProps> = ({
    name,
    cards,
    onDelete,
    onUpdate,
}) => {
    return (
        <Box sx={{ border: "1px solid", padding: 2, borderRadius: 2 }}>
            <Typography variant="h6">{name}</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {cards.map((iconUrl, index) => (
                    <img
                        key={index}
                        src={iconUrl}
                        alt="Card icon"
                        width={40}
                        height={40}
                    />
                ))}
            </Box>
            <Box sx={{ marginTop: 2, display: "flex", gap: 1 }}>
                <Button variant="contained" color="primary" onClick={onUpdate}>
                    Update
                </Button>
                <Button variant="outlined" color="error" onClick={onDelete}>
                    Delete
                </Button>
            </Box>
        </Box>
    );
};

export default DeckCard;
