import { Router } from 'express';
import { AuthService } from '../services/auth.service';
import { registerSchema, loginSchema } from '../validations/auth.validation';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.middleware';
import { UserRole } from '../db/schema/user.schema';

const router = Router();
const authService = new AuthService();

router.post('/register', async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await authService.register(validatedData);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.login(validatedData);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

router.post('/verify-2fa', async (req, res) => {
  try {
    const { userId, token } = req.body;
    if (!userId || !token) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await authService.verifyTwoFactor(userId, token);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

router.post('/setup-2fa', authenticate, async (req: AuthRequest, res) => {
  try {
    const result = await authService.setupTwoFactor(req.user!.id);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Protected route example
router.get('/profile', authenticate, async (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

// Admin only route example
router.get('/admin', authenticate, authorize([UserRole.ADMIN]), async (req: AuthRequest, res) => {
  res.json({ message: 'Admin access granted' });
});

export default router; 