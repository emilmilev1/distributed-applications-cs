import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { decodeToken } from "../utils/decode";
import { getCards, createDeck } from "../api/decks";

type Card = {
    id: number;
    name: string;
    iconUrls: { medium: string };
};

interface User {
    id: number;
    username: string;
    email: string;
}

const Dashboard = () => {
    const { token, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [cards, setCards] = useState<Card[]>([]);
    const [filteredCards, setFilteredCards] = useState<Card[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchId, setSearchId] = useState("");
    const [username, setUsername] = useState<string | null>(null);

    const [isCreatingDeck, setIsCreatingDeck] = useState(false);
    const [selectedCards, setSelectedCards] = useState<Card[]>([]);
    const [deckName, setDeckName] = useState("");
    const [deckDescription, setDeckDescription] = useState("");

    useEffect(() => {
        if (token) {
            const decodedToken = decodeToken(token) as User;
            setUsername(decodedToken?.username || null);
            if (decodedToken?.email && decodedToken?.id) {
                setUser({
                    username: decodedToken.username,
                    email: decodedToken.email,
                    id: decodedToken.id,
                });
            }
        }
    }, [token]);

    useEffect(() => {
        if (!token) return;

        async function fetchCards() {
            try {
                if (token) {
                    const response = await getCards(token);
                    const transformedCards = response.data.map(
                        (card: {
                            id: number;
                            name: string;
                            iconUrls: string;
                        }) => ({
                            ...card,
                            iconUrls: card.iconUrls,
                        })
                    );

                    setCards(transformedCards);
                    setFilteredCards(transformedCards);
                }
            } catch (error) {
                console.error("Error fetching cards:", error);
            }
        }

        fetchCards();
    }, [token]);

    const handleSearchByName = (query: string) => {
        setSearchQuery(query);
        setFilteredCards(
            cards.filter((card) =>
                card.name.toLowerCase().includes(query.toLowerCase())
            )
        );
    };

    const handleSearchById = (query: string) => {
        setSearchId(query);
        setFilteredCards(
            cards.filter((card) =>
                card.id.toString().toLowerCase().includes(query.toLowerCase())
            )
        );
    };

    const handleCardSelect = (card: Card) => {
        if (selectedCards.find((selectedCard) => selectedCard.id === card.id)) {
            setSelectedCards(
                selectedCards.filter(
                    (selectedCard) => selectedCard.id !== card.id
                )
            );
        } else {
            if (selectedCards.length < 8) {
                setSelectedCards([...selectedCards, card]);
            }
        }
    };

    const handleCreateDeck = async () => {
        if (deckName.trim() === "") {
            alert("Please enter a deck name.");
            return;
        }
        if (deckDescription.trim() === "") {
            alert("Please enter a deck description.");
            return;
        }
        if (selectedCards.length !== 8) {
            alert("You must select 8 cards to create a deck.");
            return;
        }

        try {
            const transformedCards = selectedCards.map((card) => ({
                id: card.id,
                name: card.name,
                iconUrls: card.iconUrls.medium,
            }));
            const response = await createDeck(
                deckName,
                deckDescription,
                transformedCards,
                token as string
            );
            if (response.status !== 201) {
                throw new Error("Error creating deck.");
            }

            navigate("/decks");
        } catch (error) {
            console.error("Error creating deck:", error);
            alert("Error creating deck. Please try again.");
        }
    };

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div>
            {username ? (
                <>
                    <h1>Welcome to your Dashboard, {username}!</h1>
                    <p>Here you can manage your Clash Royale decks.</p>

                    {/* Start Creating Deck Button */}
                    {!isCreatingDeck ? (
                        <button
                            id="start-creating-deck"
                            onClick={() => setIsCreatingDeck(true)}
                        >
                            Start Creating a Deck
                        </button>
                    ) : (
                        <>
                            <h2>Create a New Deck</h2>

                            {/* Deck Name Input */}
                            <input
                                id="deckName"
                                type="text"
                                placeholder="Enter Deck Name"
                                value={deckName}
                                onChange={(e) => setDeckName(e.target.value)}
                            />

                            {/* Deck Description */}
                            <input
                                id="deckDescription"
                                type="text"
                                placeholder="Enter Deck Description"
                                value={deckDescription}
                                onChange={(e) =>
                                    setDeckDescription(e.target.value)
                                }
                            />

                            {/* Search Bar by name */}
                            <input
                                id="searchQuery"
                                type="text"
                                placeholder="Search cards by name..."
                                value={searchQuery}
                                onChange={(e) =>
                                    handleSearchByName(e.target.value)
                                }
                            />

                            {/* Search Bar by id */}
                            <input
                                id="searchId"
                                type="text"
                                placeholder="Search cards by id..."
                                value={searchId}
                                onChange={(e) =>
                                    handleSearchById(e.target.value)
                                }
                            />

                            {/* Card List - Show cards only when creating a deck */}
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "16px",
                                }}
                            >
                                {filteredCards.map((card) => (
                                    <div
                                        key={card.id}
                                        style={{
                                            border: "1px solid #ccc",
                                            borderRadius: "8px",
                                            padding: "16px",
                                            textAlign: "center",
                                            cursor: "pointer",
                                            backgroundColor: selectedCards.some(
                                                (selectedCard) =>
                                                    selectedCard.id === card.id
                                            )
                                                ? "#d3d3d3"
                                                : "#fff",
                                        }}
                                        onClick={() => handleCardSelect(card)}
                                    >
                                        <img
                                            id={card.id.toString()}
                                            src={card.iconUrls.medium}
                                            alt={card.name}
                                            style={{
                                                width: "100px",
                                                height: "130px",
                                            }}
                                        />
                                        <p>{card.id}</p>
                                        <p>{card.name}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Show selected cards in slots */}
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "16px",
                                    marginTop: "20px",
                                }}
                            >
                                {[...Array(8)].map((_, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            border: "1px solid #ccc",
                                            borderRadius: "8px",
                                            padding: "16px",
                                            textAlign: "center",
                                            backgroundColor: "#f0f0f0",
                                            width: "100px",
                                        }}
                                    >
                                        {selectedCards[index] ? (
                                            <>
                                                <img
                                                    id={selectedCards[
                                                        index
                                                    ].id.toString()}
                                                    src={
                                                        selectedCards[index]
                                                            .iconUrls.medium
                                                    }
                                                    alt={
                                                        selectedCards[index]
                                                            .name
                                                    }
                                                    style={{
                                                        width: "80px",
                                                        height: "80px",
                                                        marginBottom: "8px",
                                                    }}
                                                />
                                                <p>
                                                    {selectedCards[index].name}
                                                </p>
                                            </>
                                        ) : (
                                            <p>Slot {index + 1}</p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Create Deck Button */}
                            <button
                                id="createDeck"
                                onClick={handleCreateDeck}
                                disabled={
                                    selectedCards.length !== 8 ||
                                    deckName.trim() === "" ||
                                    deckDescription.trim() === ""
                                }
                            >
                                Create Deck
                            </button>
                        </>
                    )}
                </>
            ) : (
                <div>Error decoding the token or username not found.</div>
            )}
        </div>
    );
};

export default Dashboard;
