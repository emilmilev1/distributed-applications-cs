import bcrypt from "bcryptjs";
import prisma from "./client";

async function main() {
    const adminExists = await prisma.user.findUnique({
        where: { email: "admin@example.com" },
    });

    if (!adminExists) {
        const hashedPassword = await bcrypt.hash("adminpassword", 10);

        await prisma.user.create({
            data: {
                username: "Vasko",
                email: "admin@example.com",
                password: hashedPassword,
                role: "admin",
            },
        });

        console.log("Admin user seeded!");
    } else {
        console.log("Admin user already exists!");
    }
}

main()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
