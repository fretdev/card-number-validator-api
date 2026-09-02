import express from "express"
import cardRouter from "./routes/card.routes.js"

const app = express()

app.use(express.json())

app.use("/api/cards",cardRouter)


export default app