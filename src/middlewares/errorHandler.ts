import type { Request, Response, NextFunction } from "express"

export const errorHandler = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (
        err instanceof SyntaxError &&
        typeof err === "object" &&
        err !== null &&
        "status" in err &&
        err.status === 400
    ) {
        res.status(400).json({
            message: "Invalid JSON"
        })
        return
    }

    console.error(err)

    res.status(500).json({
        message: "Internal server error"
    })
}