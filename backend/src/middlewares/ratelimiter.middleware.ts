import ratelimit from '../config/upstash';
import type { NextFunction, Response, Request} from 'express';

const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { success } = await ratelimit.limit('my-rate-limit');

        if (!success) {
            return res.status(429).json({ message: 'Too many requests, please try again later' });
        }

        next();
    } catch (error) {
        console.log('Ratelimit error: ', error);
        next(error);
    }
}

export default rateLimiter;
