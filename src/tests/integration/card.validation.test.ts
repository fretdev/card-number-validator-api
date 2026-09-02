import request from "supertest"
import app from "../../app.js"

describe("POST /api/cards/validate", () => {

    it("should return valid true for a valid card number", async () => {
        const response = await request(app)
            .post("/api/cards/validate")
            .send({
                cardNumber: "4111111111111111"
            })

        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            valid: true
        })
    })

    it("should return valid false for an invalid card number", async () => {
        const response = await request(app)
            .post("/api/cards/validate")
            .send({
                cardNumber: "1234567890123456"
            })

        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            valid: false
        })
    })

    it("should accept a valid card number containing spaces", async () => {
        const response = await request(app)
            .post("/api/cards/validate")
            .send({
                cardNumber: "4111 1111 1111 1111"
            })

        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            valid: true
        })
    })

    it("should accept a valid card number containing hyphens", async () => {
        const response = await request(app)
            .post("/api/cards/validate")
            .send({
                cardNumber: "4111-1111-1111-1111"
            })

        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            valid: true
        })
    })

    it("should return 400 when card number is missing", async () => {
        const response = await request(app)
            .post("/api/cards/validate")
            .send({})

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Invalid request")
        expect(response.body.errors.fieldErrors.cardNumber).toBeDefined()
    })

    it("should return 400 when card number is not a string", async () => {
        const response = await request(app)
            .post("/api/cards/validate")
            .send({
                cardNumber: 4111111111111111
            })

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Invalid request")
        expect(response.body.errors.fieldErrors.cardNumber).toBeDefined()
    })
    it("should return 400 when card number contains only whitespace", async () => {
    const response = await request(app)
        .post("/api/cards/validate")
        .send({
            cardNumber: "   "
        })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe("Invalid request")
    expect(response.body.errors.fieldErrors.cardNumber).toBeDefined()
})
it("should return 400 when the request contains invalid JSON", async () => {
    const response = await request(app)
        .post("/api/cards/validate")
        .set("Content-Type", "application/json")
        .send('{"cardNumber":')

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
        message: "Invalid JSON"
    })
})
})