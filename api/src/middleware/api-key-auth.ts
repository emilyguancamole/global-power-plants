import { Request, Response, NextFunction } from 'express';

export function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.header('x-api-key');
    const correctKey = process.env.API_KEY

    if (!apiKey || apiKey !== correctKey) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or missing API key'})
    }
    next(); 
}

// valid key, move on to route handler