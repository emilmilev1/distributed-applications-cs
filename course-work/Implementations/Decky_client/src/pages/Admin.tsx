import React, { useContext, useEffect, useState } from "react";
import {
    Box,
    Typography,
    CircularProgress,
    Button,
    Pagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";
import DeckCard from "../components/DeckCard";
import { AuthContext } from "../context/AuthContext";
import { deleteDeck, getDecks, updateDeck } from "../api/decks";

interface Card {
    id: number;
    name: string;
    iconUrl: string;
}

interface Deck {
    id: number;
    name: string;
    cards: Card[];
}

const AdminPage: React.FC = () => {
    const { token } = useContext(AuthContext);
    const [decks, setDecks] = useState<Deck[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize: number = 10;
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
    const [updatedName, setUpdatedName] = useState("");

    const fetchDecks = async (page: number = 1) => {
        setLoading(true);
        try {
            const { data } = await getDecks(token || "", {
                page,
                pageSize,
                sortBy: "createdAt",
                sortOrder: "desc",
            });
            setDecks(data.decks);
            setTotalCount(data.totalCount);
        } catch (error) {
            console.error("Error fetching decks:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchDecks(currentPage);
        }
    }, [token, currentPage]);

    const handleDelete = async (deckId: number) => {
        try {
            await deleteDeck(deckId, token || "");
            setDecks((prevDecks) =>
                prevDecks.filter((deck) => deck.id !== deckId)
            );
        } catch (error) {
            console.error("Error deleting deck:", error);
        }
    };

    const handleUpdate = (deckId: number) => {
        const deck = decks.find((d) => d.id === deckId);
        if (deck) {
            setSelectedDeck(deck);
            setUpdatedName(deck.name);
            setUpdateModalOpen(true);
        }
    };

    const saveUpdatedDeck = async () => {
        if (selectedDeck) {
            try {
                await updateDeck(
                    selectedDeck.id,
                    {
                        name: updatedName,
                        cards: [],
                    },
                    token || ""
                );
                fetchDecks(currentPage);
                setUpdateModalOpen(false);
            } catch (error) {
                console.error("Failed to update deck:", error);
            }
        }
    };

    const handlePageChange = (
        _event: React.ChangeEvent<unknown>,
        value: number
    ) => {
        setCurrentPage(value);
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Admin Dashboard - All Decks
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : decks.length > 0 ? (
                <>
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 2,
                        }}
                    >
                        {decks.map((deck) => (
                            <DeckCard
                                key={deck.id}
                                name={deck.name}
                                cards={deck.cards.map((card) => card.iconUrl)}
                                onDelete={() => handleDelete(deck.id)}
                                onUpdate={() => handleUpdate(deck.id)}
                            />
                        ))}
                    </Box>
                    <Pagination
                        count={Math.ceil(totalCount / pageSize)}
                        page={currentPage}
                        onChange={handlePageChange}
                        sx={{ marginTop: 3 }}
                    />
                </>
            ) : (
                <Typography>No decks found.</Typography>
            )}

            {/* Update Deck Modal */}
            <Dialog
                open={isUpdateModalOpen}
                onClose={() => setUpdateModalOpen(false)}
            >
                <DialogTitle>Update Deck</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Deck Name"
                        fullWidth
                        value={updatedName}
                        onChange={(e) => setUpdatedName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUpdateModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={saveUpdatedDeck}
                        variant="contained"
                        color="primary"
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminPage;
