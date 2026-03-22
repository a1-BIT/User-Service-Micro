import mongoose from 'mongoose'
import { env } from './env.js'

mongoose.connect(env.DB_URL)
