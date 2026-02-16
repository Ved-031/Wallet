import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import job from './config/cron.ts';
import routes from './routes/index.ts';
import { clerkMiddleware } from '@clerk/express';
import rateLimiter from './middlewares/ratelimiter.middleware.ts';
import express, { type Application, type Response } from 'express';
import { errorHandler, notFound } from './middlewares/error.middleware.ts';

const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(rateLimiter);
app.use(morgan('dev'));
app.use(express.json());
app.use(clerkMiddleware());
app.use(express.urlencoded({ extended: true }));

job.start();

app.get('/', (_, res: Response) => {
    res.send('API Running...');
});

app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

export default app;

