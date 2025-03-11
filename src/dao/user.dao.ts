import { db } from '../config/database';
import { users } from '../db/schema';
import { CreateUserInput } from '../validations/user.validation';
import { eq } from 'drizzle-orm';

export class UserDAO {
  async createUser(data: CreateUserInput & { password: string }) {
    console.log('data', data);
    return await db.insert(users).values(data).returning();
  }

  async getUserById(id: number) {
    return await db.select().from(users).where(eq(users.id, id));
  }

  async getUserByEmail(email: string) {
    return await db.select().from(users).where(eq(users.email, email)).limit(1);
  }

  async getAllUsers() {
    return await db.select().from(users);
  }

  async updateUser(id: number, data: Partial<typeof users.$inferInsert>) {
    return await db.update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
  }
} 