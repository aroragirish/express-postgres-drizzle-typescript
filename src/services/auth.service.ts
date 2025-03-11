import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { UserDAO } from '../dao/user.dao';
import { RedisService } from './redis.service';
import { RegisterInput, LoginInput } from '../validations/auth.validation';
import { UserRole } from '../db/schema/user.schema';

export class AuthService {
  private userDAO: UserDAO;
  private redisService: RedisService;
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private readonly JWT_EXPIRES_IN = '24h';
  private readonly CACHE_TTL = 3600; // 1 hour

  constructor() {
    this.userDAO = new UserDAO();
    this.redisService = new RedisService();
  }

  async register(data: RegisterInput) {
    const existingUser = await this.userDAO.getUserByEmail(data.email);
    if (existingUser.length > 0) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    console.log('hashedPassword', hashedPassword);
    const user = await this.userDAO.createUser({
      ...data,
      password: hashedPassword,
    });

    const token = this.generateToken(user[0]);
    await this.redisService.set(`user:${user[0].id}`, JSON.stringify(user[0]), this.CACHE_TTL);
    return { user: user[0], token };
  }

  async login(data: LoginInput) {
    const users = await this.userDAO.getUserByEmail(data.email);
    if (users.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    if (user.twoFactorEnabled) {
      return { requiresTwoFactor: true, userId: user.id };
    }

    const token = this.generateToken(user);
    await this.redisService.set(`user:${user.id}`, JSON.stringify(user), this.CACHE_TTL);
    return { user, token };
  }

  async verifyTwoFactor(userId: number, token: string) {
    const cachedUser = await this.redisService.get(`user:${userId}`);
    const user = cachedUser ? JSON.parse(cachedUser) : (await this.userDAO.getUserById(userId))[0];

    if (!user || !user.twoFactorSecret || !user.twoFactorEnabled) {
      throw new Error('2FA not enabled for this user');
    }

    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
    });

    if (!isValid) {
      throw new Error('Invalid 2FA token');
    }

    const jwtToken = this.generateToken(user);
    return { user, token: jwtToken };
  }

  async setupTwoFactor(userId: number) {
    const user = (await this.userDAO.getUserById(userId))[0];
    if (!user) {
      throw new Error('User not found');
    }

    const secret = speakeasy.generateSecret();
    const qrCode = await QRCode.toDataURL(secret.otpauth_url || '');

    await this.userDAO.updateUser(userId, {
      twoFactorSecret: secret.base32,
      twoFactorEnabled: true,
    });

    return { secret: secret.base32, qrCode };
  }

  private generateToken(user: any) {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        role: user.role 
      },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
} 