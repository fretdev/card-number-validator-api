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
})
