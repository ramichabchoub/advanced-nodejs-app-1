import path from 'path';

import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';

import dbConnection from './config/database.js';
import ApiError from './utils/apiError.js';
import { globalError } from './middlewares/errorMiddleware.js';
import categoryRoute from './routes/categoryRoute.js';
import subCategoryRoute from './routes/subCategoryRoute.js';
import brandRoute from './routes/brandRoute.js';
import productRoute from './routes/productRoute.js';
import userRoute from './routes/userRoute.js';

dotenv.config({ path: "./config/config.env" });
// express app
const app = express();

// connect to db
dbConnection();

// middleware
app.use(express.json());
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
        console.log(`mode : ${process.env.NODE_ENV}`);
}

// Mount routes
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/subcategories', subCategoryRoute);
app.use('/api/v1/brands', brandRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/users', userRoute);

app.all('*', (req, res, next) => {
        next(new ApiError(`Can't find ${req.originalUrl} on this server!`, 404));
}
);

// Global error handler middleware for express
app.use(globalError);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}
);

// Handle unhandled promise rejections outside of express
process.on('unhandledRejection', err => {
        console.error(`Unhandled promise rejection: ${err.name} | (${err.message})`);
        server.close(() => {
                console.log('Server closed!');
                process.exit(1);
        }
        );
});