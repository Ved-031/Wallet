import { AppError } from '../utils/AppError.ts';
import type { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('ERROR 💥:', err);

    // Known error
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    // Prisma error
    if (err.code === 'P2002') {
        return res.status(400).json({
            success: false,
            message: 'Duplicate field value',
        });
    }

    // Unknown error
    return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
    });
};

export const notFound = (req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
};
