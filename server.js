import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import dbConnection from './config/database.js';
import categoryRoute from './routes/categoryRoute.js';

dotenv.config({ path: "./config/config.env" });
// express app
const app = express();

// connect to db
dbConnection();

// middleware
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
        console.log(`mode : ${process.env.NODE_ENV}`);
}

// Mount routes
app.use('/api/v1/categories', categoryRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}
);