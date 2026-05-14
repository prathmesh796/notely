import { prisma } from "../lib/prisma";
import express from "express";

const app = express();

app.use(express.json());

import authRoutes from "./routes/authRoutes";
import noteRoutes from "./routes/noteRoutes";

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});