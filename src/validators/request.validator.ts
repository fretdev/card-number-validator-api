import {z} from "zod"

export const cardValidationRequestSchema = z.object({
    cardNumber: z.string().trim().min(1,"Card number is required")
})