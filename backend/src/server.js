import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { initDB } from './config/db.js';
import rateLimiter from './middlewares/rateLimiter.js';
import transactionRoutes from './routes/transaction.route.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(rateLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/transactions', transactionRoutes);

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
