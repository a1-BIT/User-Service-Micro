import mongoose from 'mongoose'
import { env } from './env.js'

export async function connectDB(): Promise<void> {

    mongoose.connection.on('connected', () => {
        console.log(`MongoDB connected → ${mongoose.connection.host}:${mongoose.connection.port}/${mongoose.connection.name}`)
    })

    mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected')
    })

    mongoose.connection.on('error', (err: Error) => {
        console.error('MongoDB connection error:', err.message)
    })

    try {
        await mongoose.connect(env.DB_URL)
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err)
        process.exit(1)
    }
}

export async function disconnectDB(): Promise<void> {
    await mongoose.disconnect()
    console.log('MongoDB connection closed')
}
