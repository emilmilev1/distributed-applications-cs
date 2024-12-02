import express, { Request, Response, RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client";

const router = express.Router();

interface RegisterResponse {
    message?: string;
    user?: object;
    error?: string;
}

interface LoginResponse {
    token?: string;
    error?: string;
}

router.post(
    "/register",
    async (req: Request, res: Response<RegisterResponse>) => {
        const { username, email, password } = req.body;

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: { username, email, password: hashedPassword },
            });

            res.status(201).json({ message: "User registered", user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to register user" });
        }
    }
);

router.post(
    "/login",
    async (req: Request, res: Response<LoginResponse>): Promise<void> => {
        const { email, password } = req.body;

        try {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }

            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                res.status(401).json({ error: "Invalid credentials" });
                return;
            }

            const token = jwt.sign(
                { userId: user.id, role: user.role, username: user.username },
                process.env.JWT_SECRET!,
                {
                    expiresIn: "8h",
                }
            );

            res.status(200).json({ token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to log in" });
        }
    }
);

export default router;
