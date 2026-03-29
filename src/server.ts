import { env } from './config/env.js'
import { connectDB, disconnectDB } from './config/db.js'
import app from './app.js'

async function bootstrap(): Promise<void> {

    await connectDB()

    app.listen(env.PORT, () => {
        console.log(`Server running on port ${env.PORT} (${env.NODE_ENV})`)
    })
}

function shutdown(signal: string): void {
    console.log(`Received ${signal}. Shutting down gracefully...`)
    disconnectDB()
        .then(() => process.exit(0))
        .catch(() => process.exit(1))
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

// ── Start ──────────────────────────────────────────────────────────
bootstrap().catch((err: unknown) => {
    console.error('Unhandled bootstrap error:', err)
    process.exit(1)
})