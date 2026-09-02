import { validateCardNumber } from "../validators/cardValidator.js";

export function validateCardNumberService(cardNumber: string){
    const isValid = validateCardNumber(cardNumber)

    return{
        valid: isValid
    }
}