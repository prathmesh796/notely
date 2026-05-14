import { Router, type Request, type Response } from "express";
import { prisma } from "../../lib/prisma";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await prisma.user.create({
        data: {
            email,
            password,
        },
    });
    res.json(user);
});

router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
});

router.post("/logout", async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
});



export default router;