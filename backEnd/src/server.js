import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';

import connectDB from './configs/db.js';
import { verifyAzureConnection } from './configs/azureStorage.js';
import { errorHandler } from './middlewares/error.js';
import { apiLimiter } from './middlewares/rateLimiter.js';

// Clean route routers decoupling import mappings
import authRoutes from './routes/auth.js';
import postRoutes from './routes/post.js';

dotenv.config();

const app = express();

// Initialization pipelines
connectDB();
verifyAzureConnection();

// Global Shield Security Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '2mb' })); // Protect against massive JSON injection payloads
app.use(cookieParser());
app.use('/api', apiLimiter); // Apply global API rate limiting protection layer

// Decoupled Endpoint Routers
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Fallback Central Catch-All Error Handler Interceptor
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`[Production Server] Active and execution stable across port: ${PORT}`));