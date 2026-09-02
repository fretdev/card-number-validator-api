import {z} from "zod"

export const cardValidationRequestSchema = z.object({
    cardNumber: z.string().min(1,"Card number is required")
})