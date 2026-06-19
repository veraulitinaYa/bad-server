import { RateLimiterMemory } from 'rate-limiter-flexible'
import { Request, Response, NextFunction } from 'express'

const rateLimiter = new RateLimiterMemory({
    points: 30,      // разрешено 30 запросов
    duration: 60,    // за 60 секунд
})

export const rateLimiterMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    rateLimiter
        .consume(req.ip || 'unknown')
        .then(() => next())
        .catch(() => {
            res.status(429).json({
                message: 'Too many requests',
            })
        })
}