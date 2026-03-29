// ── Constants ──────────────────────────────────────────────────────
export const COUNTRIES = ["India", "US", "UK", "Canada", "Australia"] as const
export type Country = typeof COUNTRIES[number]

// ── Entity Interface ───────────────────────────────────────────────
// Plain interface — no Document extension (modern Mongoose v6+ approach)
export interface IUser {
    name: string
    email: string
    password?: string       // optional — select: false hides it in most queries
    country: Country
    age?: number
}

// ── DTOs (Data Transfer Objects) ───────────────────────────────────
// What the API accepts for creating a user
export interface CreateUserDTO {
    name: string
    email: string
    password: string
    country?: Country
    age?: number
}

// What the API accepts for updating a user (all fields optional)
export interface UpdateUserDTO {
    name?: string
    email?: string
    password?: string
    country?: Country
    age?: number
}
