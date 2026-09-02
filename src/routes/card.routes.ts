import { Router } from "express";
import { validateCard } from "../controllers/card.controller.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { cardValidationRequestSchema } from "../validators/request.validator.js";

const router = Router()

router.post("/validate",
    validateRequest(cardValidationRequestSchema),
    validateCard
)
export default router