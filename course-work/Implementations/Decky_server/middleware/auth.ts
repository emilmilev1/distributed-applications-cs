import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client";

interface JwtPayload {
    userId: number;
    role: string;
}

declare module "express-serve-static-core" {
    interface Request {
        user?: JwtPayload;
    }
}

const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token === undefined || token === null || token === "") {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as JwtPayload;

        const { userId, role } = decoded;
        if (!userId || !role) {
            res.status(401).json({ error: "Invalid token" });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            res.status(401).json({ error: "User not found. Unauthorized" });
            return;
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};

export default authMiddleware;
