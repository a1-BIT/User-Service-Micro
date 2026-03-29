import express from "express"
import userRoutes from "./modules/user/user.routes.js"
import { globalErrorHandler } from "./shared/middlewares/globalErrorHandler.js"
import { AppError } from "./shared/AppError.js"

const app = express()

// ── Global middleware ──────────────────────────────────────────────
app.use(express.json())

// ── Routes ─────────────────────────────────────────────────────────
app.use("/api/users", userRoutes)

// ── Health check ───────────────────────────────────────────────────
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" })
})

// ── 404 — Catch unmatched routes ───────────────────────────────────
app.all("/{*path}", (req, _res, next) => {
    next(new AppError(`Cannot find ${req.method} ${req.originalUrl}`, 404))
})

// ── Global error handler (must be the LAST middleware) ─────────────
app.use(globalErrorHandler)

export default app
