export function validateCardNumber(cardNumber: string): boolean{
    if (!/^[\d -]+$/.test(cardNumber)) {
    return false;
   }

   const normalizedCardNumber = cardNumber.replace(/[\s-]/g, "")

   if(normalizedCardNumber.length < 13 || normalizedCardNumber.length > 19){
    return false
   }

    let sum = 0
    let shouldDouble = false

    for (let i = normalizedCardNumber.length - 1; i >= 0 ;i--){
        let digit = parseInt(normalizedCardNumber[i]!, 10)
            if(shouldDouble){
                digit *= 2
                if(digit > 9){
                    digit -= 9
                }
            }
        sum += digit
        shouldDouble = !shouldDouble 
    }
    return sum % 10 === 0
}