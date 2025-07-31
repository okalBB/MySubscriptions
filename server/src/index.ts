import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import authRoutes from './authRoutes'
import itemRoutes from './itemRoutes'

dotenv.config()

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use('/api/auth', authRoutes)
app.use('/api/items', itemRoutes)

app.listen(4000, () => console.log('Server running on http://localhost:4000'))
