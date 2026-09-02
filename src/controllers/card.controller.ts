import type {Request,Response} from "express"
import { validateCardNumberService } from "../services/card.service.js"

export const validateCard = (req: Request,res:Response)=>{
    const {cardNumber} = req.body
    
    const result = validateCardNumberService(cardNumber)

    return res.status(200).json(result)
}