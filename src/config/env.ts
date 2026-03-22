import dotenv from 'dotenv'
dotenv.config()


function requireEnv(key: string): string {
    const value = process.env[key]
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`)
    }
    return value
}


export const env = {
    DB_URL: requireEnv("DB_URL"),
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || "development"
}

