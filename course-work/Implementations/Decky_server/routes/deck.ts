import express, { Request, Response } from "express";
import axios from "axios";
import prisma from "../prisma/client";
import authMiddleware from "../middleware/auth";

const router = express.Router();

router.get("/", authMiddleware, async (req, res): Promise<void> => {
    const userId = req.user?.userId;
    const role = req.user?.role;

    let decks;

    try {
        if (role === "admin") {
            decks = await prisma.deck.findMany({
                include: { cards: true },
            });
        } else {
            decks = await prisma.deck.findMany({
                where: { userId },
                include: { cards: true },
            });
        }

        if (!decks) {
            res.status(404).json({ error: "No decks found" });
            return;
        }

        const {
            search = "",
            sortBy = "createdAt",
            sortOrder = "desc",
            page = 1,
            pageSize = 10,
        } = req.query;

        const skip =
            (parseInt(page as string) - 1) * parseInt(pageSize as string);

        const filteredDecks = await prisma.deck.findMany({
            where: {
                OR: [
                    { name: { contains: search as string } },
                    { description: { contains: search as string } },
                ],
            },
            orderBy: { [sortBy as string]: sortOrder },
            skip: skip,
            take: parseInt(pageSize as string),
            include: { cards: true },
        });

        const totalCount = await prisma.deck.count({
            where: {
                OR: [
                    { name: { contains: search as string } },
                    { description: { contains: search as string } },
                ],
            },
        });

        res.json({ decks: filteredDecks, totalCount });
    } catch (error) {
        console.error("Failed to fetch decks:", error);
        res.status(500).json({ error: "Failed to fetch decks" });
    }
});

router.get("/cards", async (req, res) => {
    try {
        const clashApiUrl = (process.env.CLASH_API_URL + "/cards") as string;
        const response = await axios.get(clashApiUrl, {
            headers: { Authorization: `Bearer ${process.env.CLASH_API_KEY}` },
        });
        res.status(200).json(response.data.items);
    } catch (error) {
        console.error("Error fetching cards:", error);
        res.status(500).json({ error: "Failed to fetch cards" });
    }
});

router.post(
    "/",
    authMiddleware,
    async (req: Request, res: Response): Promise<void> => {
        const { name, deckDescription, cards } = req.body;

        const userId = req.user?.userId;
        if (!userId) {
            res.status(403).json({ error: "Forbidden" });
            return;
        }

        try {
            console.log(name, userId, deckDescription);
            const deck = await prisma.deck.create({
                data: {
                    name,
                    userId,
                    description: deckDescription,
                },
            });

            const cardData = cards.map((card: any) => ({
                name: card.name,
                iconUrl: card.iconUrls,
                deckId: deck.id,
                rarity: card.rarity || "Common",
                cost: card.cost || 0,
                power: card.power || 0.0,
            }));

            await prisma.card.createMany({
                data: cardData,
            });

            res.status(201).json({ deck, cards: cardData });
        } catch (error) {
            res.status(500).json({ error: "Failed to create deck" });
        }
    }
);

router.put(
    "/:id",
    authMiddleware,
    async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { name } = req.body;

        const userId = req.user?.userId;
        if (!userId) {
            res.status(403).json({ error: "Unauthorized" });
            return;
        }

        try {
            const deck = await prisma.deck.findUnique({
                where: { id: Number(id) },
            });

            if (!deck) {
                res.status(404).json({ error: "Deck not found" });
                return;
            }

            if (deck.userId !== userId) {
                res.status(403).json({
                    error: "Forbidden: You can only update your own decks",
                });
                return;
            }

            const updatedDeck = await prisma.deck.update({
                where: { id: Number(id) },
                data: { name },
            });

            res.json(updatedDeck);
        } catch (error) {
            console.error("Failed to update deck:", error);
            res.status(500).json({ error: "Failed to update deck" });
        }
    }
);

router.delete("/:id", authMiddleware, async (req, res): Promise<void> => {
    const { id } = req.params;

    const userId = req.user?.userId;
    if (!userId) {
        res.status(403).json({ error: "Unauthorized" });
        return;
    }

    try {
        const deckToDelete = await prisma.deck.findUnique({
            where: { id: Number(id) },
            include: { cards: true },
        });

        if (!deckToDelete) {
            res.status(404).json({ error: "Deck not found" });
            return;
        }

        await prisma.deck.delete({ where: { id: Number(id) } });

        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: "Failed to delete deck" });
    }
});

export default router;
