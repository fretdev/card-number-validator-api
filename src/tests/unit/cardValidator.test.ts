import { validateCardNumber } from "../../validators/cardValidator.js"


describe("validateCardNumber",()=>{
  it("should return true for a valid card number",()=>{
    expect(validateCardNumber("4012888888881881")).toBe(true)
  })
  it("should return false for an invalid card number",()=>{
    expect(validateCardNumber("4012888888881882")).toBe(false)
  })
  it("should return false for an empty card number",()=>{
    expect(validateCardNumber("")).toBe(false)
  })
  it("should return false when the card number contains non-numeric characters",()=>{
    expect(validateCardNumber("40128888888818a1")).toBe(false)
  })
  it("should return false for a card number shorter than 13 digits",()=>{
    expect(validateCardNumber("079927398713")).toBe(false)
  })
  it("should return false for a number longer than 19 digits",()=>{
    expect(validateCardNumber("40000000000000000002")).toBe(false)
  })
  it("should return true for a valid 13 digit card number",()=>{
    expect(validateCardNumber("1234567890128")).toBe(true)
  })
  it("should return true for a valid 19 card number",()=>{
    expect(validateCardNumber("4000000000000000006")).toBe(true)
  })
  it("should return true for a valid card number containing spaces",()=>{
    expect(validateCardNumber("4012 8888 8888 1881")).toBe(true)
  })
  it("should return true for a card number containing hyphens",()=>{
      expect(validateCardNumber("4012-8888-8888-1881")).toBe(true)
    })
  it("should returen false when the card number contain a decimal point",()=>{
    expect(validateCardNumber("4012.8888.8888.1881")).toBe(false)
  })
  it("should return false when the card number contains unsupported symbols",()=>{
    expect(validateCardNumber("4012@8888#8888$1881")).toBe(false)
  })
  it("should return false when the card number contains letters with formatting",()=>{
    expect(validateCardNumber("4012-8888-8888-18a1")).toBe(false)
  })
})
