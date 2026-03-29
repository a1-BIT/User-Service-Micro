import { User } from "./user.model.js"
import { CreateUserDTO, UpdateUserDTO } from "./user.types.js"

// ── Repository — Data access layer (only layer that talks to Mongoose) ──

export const userRepository = {

    async findAll() {
        return User.find()
    },

    async findById(id: string) {
        return User.findById(id)
    },

    async findByEmail(email: string) {
        return User.findOne({ email })
    },

    async findByIdWithPassword(id: string) {
        return User.findById(id).select("+password")
    },

    async findByEmailWithPassword(email: string) {
        return User.findOne({ email }).select("+password")
    },

    async create(data: CreateUserDTO) {
        return User.create(data)
    },

    async updateById(id: string, data: UpdateUserDTO) {
        return User.findByIdAndUpdate(id, data, {
            new: true,              // return updated document
            runValidators: true,    // run schema validators on update
        })
    },

    async deleteById(id: string) {
        return User.findByIdAndDelete(id)
    },
}
