import { userRepository } from "./user.repository.js"
import { CreateUserDTO, UpdateUserDTO } from "./user.types.js"
import { AppError } from "../../shared/AppError.js"

// ── Service — Business logic layer ─────────────────────────────────

export const userService = {

    async getAllUsers() {
        return userRepository.findAll()
    },

    async getUserById(id: string) {
        const user = await userRepository.findById(id)
        if (!user) {
            throw new AppError("User not found", 404)
        }
        return user
    },

    async createUser(data: CreateUserDTO) {
        // Check if email already exists
        const existingUser = await userRepository.findByEmail(data.email)
        if (existingUser) {
            throw new AppError("Email already in use", 409)
        }

        // TODO: Hash password before saving (e.g. bcrypt)
        return userRepository.create(data)
    },

    async updateUser(id: string, data: UpdateUserDTO) {
        // If email is being changed, check it's not taken
        if (data.email) {
            const existingUser = await userRepository.findByEmail(data.email)
            if (existingUser && existingUser.id !== id) {
                throw new AppError("Email already in use", 409)
            }
        }

        // TODO: If password is being updated, hash it first
        const user = await userRepository.updateById(id, data)
        if (!user) {
            throw new AppError("User not found", 404)
        }
        return user
    },

    async deleteUser(id: string) {
        const user = await userRepository.deleteById(id)
        if (!user) {
            throw new AppError("User not found", 404)
        }
        return user
    },
}
