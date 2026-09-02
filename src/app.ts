import express from "express"
import cardRouter from "./routes/card.routes.js"
import { errorHandler } from "./middlewares/errorHandler.js"

const app = express()

app.use(express.json())

app.use("/api/cards",cardRouter)
app.use(errorHandler)


export default app