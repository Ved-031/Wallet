import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import job from './config/cron.js';
import { initDB } from './config/db.js';
import rateLimiter from './middlewares/rateLimiter.js';
import transactionRoutes from './routes/transaction.route.js';

const app = express();
const PORT = process.env.PORT || 8080;

if(process.env.NODE_ENV === 'production') job.start();

app.use(cors());
app.use(rateLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Healthy' });
});
app.use('/api/transactions', transactionRoutes);

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
