import { Router } from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';

const router = Router();

// Register all routes
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

// Add other route modules here as they are created
// Example: router.use('/posts', postRoutes);

export default router; 