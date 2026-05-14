import { Router, type Request, type Response } from "express";
import { prisma } from "../../lib/prisma";

const router = Router();

router.post("/create", async (req: Request, res: Response) => {
    const { title, content, editors, userId } = req.body;
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }
    const note = await prisma.note.create({
        data: {
            title,
            content,
            editors,
            userId: user.id,
        },
    });
    res.json({ message: "Note created successfully", note });
});

router.get("/get", async (req: Request, res: Response) => {
    const { userId } = req.body;
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }
    const notes = await prisma.note.findMany({
        where: { userId: user.id },
    });
    res.json({ message: "Notes fetched successfully", notes });
});

router.put("/update", async (req: Request, res: Response) => {
    const { id, title, content, editors, userId } = req.body;
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }
    const note = await prisma.note.update({
        where: { id },
        data: { title, content, editors, userId: user.id },
    });
    res.json({ message: "Note updated successfully", note });
});

router.delete("/delete", async (req: Request, res: Response) => {
    const { id, userId } = req.params;
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }
    const note = await prisma.note.delete({
        where: { id },
    });
    res.json({ message: "Note deleted successfully", note });
});

export default router;