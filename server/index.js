import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'

import connectDB from './mongodb/connect.js'
import userRouter from './routes/user.routes.js'
import propertyRouter from './routes/property.routes.js'

dotenv.config()

const PORT = process.env.PORT || 8080
const MONGODB_URL = process.env.MONGODB_URL

const app = express()
app.use(cors())

app.use(express.json({ limit: '50mb' }))

app.get('/', (req, res) => {
  res.send({ message: 'Hello' })
})

app.use('/api/v1/users', userRouter)
app.use('/api/v1/properties', propertyRouter)

const startServer = async () => {
  try {
    connectDB(MONGODB_URL)

    app.listen(PORT, () =>
      console.log(`Server started on port http://localhost:${PORT}`)
    )
  } catch (error) {
    console.error(error)
  }
}

startServer()
