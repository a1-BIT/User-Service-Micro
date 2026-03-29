import { Request, Response, NextFunction } from "express"

// ── Async Handler ──────────────────────────────────────────────────
// Wraps an async route handler so that any rejected promise is
// automatically forwarded to Express's next(err) — eliminating
// the need for try/catch in every controller method.

type AsyncRouteHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void>

export const asyncHandler = (fn: AsyncRouteHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next)
    }
}
