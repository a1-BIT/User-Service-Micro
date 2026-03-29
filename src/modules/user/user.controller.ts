import { Request, Response } from "express"
import { userService } from "./user.service.js"
import { CreateUserDTO, UpdateUserDTO } from "./user.types.js"
import { asyncHandler } from "../../shared/middlewares/asyncHandler.js"

// ── Controller — HTTP request/response handling ────────────────────
// No try/catch needed — asyncHandler forwards errors to the
// global error handler automatically.

export const userController = {

    getAll: asyncHandler(async (_req: Request, res: Response) => {
        const users = await userService.getAllUsers()
        res.status(200).json({ success: true, data: users })
    }),

    getById: asyncHandler(async (req: Request, res: Response) => {
        const id = String(req.params.id)
        const user = await userService.getUserById(id)
        res.status(200).json({ success: true, data: user })
    }),

    create: asyncHandler(async (req: Request, res: Response) => {
        const data = req.body as CreateUserDTO
        const user = await userService.createUser(data)
        res.status(201).json({ success: true, data: user })
    }),

    update: asyncHandler(async (req: Request, res: Response) => {
        const data = req.body as UpdateUserDTO
        const id = String(req.params.id)
        const user = await userService.updateUser(id, data)
        res.status(200).json({ success: true, data: user })
    }),

    delete: asyncHandler(async (req: Request, res: Response) => {
        const id = String(req.params.id)
        await userService.deleteUser(id)
        res.status(200).json({ success: true, message: "User deleted" })
    }),
}
