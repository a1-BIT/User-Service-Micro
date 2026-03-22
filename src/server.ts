import { env } from './config/env.js'
import { connectDB, disconnectDB } from './config/db.js'

async function bootstrap(): Promise<void> {

    await connectDB()

    // 2. TODO: Start Express server here
    //    import app from './app.js'
    //    app.listen(env.PORT, () => { ... })

    console.log(`Server is ready (PORT=${env.PORT}, ENV=${env.NODE_ENV})`)
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