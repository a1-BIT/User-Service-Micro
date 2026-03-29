import mongoose, { Schema } from "mongoose"
import { COUNTRIES, IUser } from "./user.types.js"

// ── Schema ─────────────────────────────────────────────────────────
const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [50, "Name must be at most 50 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            index: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false,      // never returned in queries by default
        },
        country: {
            type: String,
            enum: {
                values: COUNTRIES,
                message: "{VALUE} is not a supported country",
            },
            default: "India",
        },
        age: {
            type: Number,
            min: [18, "Age must be at least 18"],
            max: [120, "Age must be at most 120"],  // 60 is too restrictive
        },
    },
    {
        timestamps: true,   // auto adds createdAt and updatedAt
        toJSON: {
            transform(_doc, ret: Record<string, unknown>) {
                ret['id'] = ret['_id']?.toString()  // convert ObjectId to string
                delete ret['_id']
                delete ret['__v']
                delete ret['password']              // never leak password
            },
        },
    }
)

// ── Model ──────────────────────────────────────────────────────────
export const User = mongoose.model<IUser>("User", UserSchema)