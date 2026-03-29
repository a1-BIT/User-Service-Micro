import { Request, Response, NextFunction } from "express"
import mongoose from "mongoose"
import { AppError } from "../AppError.js"

// ── Response shape ─────────────────────────────────────────────────
interface ErrorResponse {
    success: false
    message: string
    errors?: Record<string, string>   // field-level validation errors
}

// ── Mongoose Validation Error → AppError ───────────────────────────
function handleValidationError(err: mongoose.Error.ValidationError): AppError {
    const fieldErrors: Record<string, string> = {}

    for (const [field, detail] of Object.entries(err.errors)) {
        fieldErrors[field] = detail.message
    }

    const messages = Object.values(fieldErrors).join(", ")
    const appError = new AppError(`Validation failed: ${messages}`, 400)

    // Attach field-level detail so the handler can include it in the response
    ;(appError as AppError & { fieldErrors: Record<string, string> }).fieldErrors = fieldErrors
    return appError
}

// ── Mongoose Cast Error → AppError ─────────────────────────────────
// e.g. invalid ObjectId format
function handleCastError(err: mongoose.Error.CastError): AppError {
    return new AppError(`Invalid ${err.path}: ${err.value}`, 400)
}

// ── MongoDB Duplicate Key Error → AppError ─────────────────────────
// Mongo driver error code 11000
function handleDuplicateKeyError(err: Record<string, unknown>): AppError {
    const keyValue = err['keyValue'] as Record<string, unknown> | undefined
    const field = keyValue ? Object.keys(keyValue).join(", ") : "unknown field"
    return new AppError(`Duplicate value for: ${field}. Please use another value.`, 409)
}

// ── Global Error Handler Middleware ────────────────────────────────
export function globalErrorHandler(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    let statusCode = 500
    let message = "Internal Server Error"
    let fieldErrors: Record<string, string> | undefined
    let isOperational = false   // tracks if we recognized this error type

    // ── Handle known error types ───────────────────────────────────
    if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
        fieldErrors = (err as AppError & { fieldErrors?: Record<string, string> }).fieldErrors
        isOperational = err.isOperational
    } else if (err instanceof mongoose.Error.ValidationError) {
        const converted = handleValidationError(err)
        statusCode = converted.statusCode
        message = converted.message
        fieldErrors = (converted as AppError & { fieldErrors?: Record<string, string> }).fieldErrors
        isOperational = true
    } else if (err instanceof mongoose.Error.CastError) {
        const converted = handleCastError(err)
        statusCode = converted.statusCode
        message = converted.message
        isOperational = true
    } else if ((err as unknown as Record<string, unknown>)['code'] === 11000) {
        const converted = handleDuplicateKeyError(err as unknown as Record<string, unknown>)
        statusCode = converted.statusCode
        message = converted.message
        isOperational = true
    } else if (err instanceof Error) {
        message = err.message
    }

    // ── Only log truly unexpected (non-operational) errors ─────────
    if (!isOperational) {
        console.error("🔥 ERROR:", err)
    }

    // ── Build response ─────────────────────────────────────────────
    const response: ErrorResponse = {
        success: false,
        message,
    }

    if (fieldErrors) {
        response.errors = fieldErrors
    }

    res.status(statusCode).json(response)
}
