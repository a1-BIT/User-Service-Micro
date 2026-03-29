// ── Custom Application Error ───────────────────────────────────────
// Extends native Error with an HTTP status code and operational flag.
// "Operational" errors are expected (bad input, not found, etc.)
// vs programming bugs which should crash the process.

export class AppError extends Error {
    public readonly statusCode: number
    public readonly isOperational: boolean

    constructor(message: string, statusCode: number) {
        super(message)

        this.statusCode = statusCode
        this.isOperational = true

        // Maintain proper stack trace (only available on V8 engines like Node)
        Error.captureStackTrace(this, this.constructor)
    }
}
