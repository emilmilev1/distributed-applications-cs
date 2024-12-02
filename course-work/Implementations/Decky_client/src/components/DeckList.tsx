import React, { useEffect, useState, useContext } from "react";
import { getDecks } from "../api/decks";
import { AuthContext } from "../context/AuthContext";

interface Deck {
    id: number;
    name: string;
    description: string;
    cards: string[];
}

const DeckList = () => {
    const [decks, setDecks] = useState<Deck[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);

    const { token } = useContext(AuthContext);

    useEffect(() => {
        if (token) {
            const query = { search, sortBy, sortOrder, page, pageSize };
            getDecks(token, query).then((response) => {
                setDecks(response.data.decks);
                setTotalCount(response.data.totalCount);
            });
        }
    }, [token, search, sortBy, sortOrder, page]);

    return (
        <div>
            <h2>Your Decks</h2>

            {/* Search */}
            <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Sorting */}
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="createdAt">Date Created</option>
                <option value="name">Name</option>
            </select>
            <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
            >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>

            {/* Decks */}
            <ul>
                {decks.map((deck) => (
                    <li key={deck.id}>
                        <strong>{deck.name}</strong> - {deck.description}
                    </li>
                ))}
            </ul>

            {/* Pagination */}
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
            </button>
            <button
                disabled={page * pageSize >= totalCount}
                onClick={() => setPage(page + 1)}
            >
                Next
            </button>
        </div>
    );
};

export default DeckList;
