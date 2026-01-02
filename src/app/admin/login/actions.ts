'use server'

import { db } from '@/lib/db';
import type { User } from '@/lib/types';
import bcrypt from 'bcrypt';

export async function loginUser(email: string, password: string) {
  if (!email || !password) {
    return { success: false, message: 'Email and password are required.' };
  }

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1 AND is_active = true', [email]);

    if (result.rows.length === 0) {
      return { success: false, message: 'Invalid email or password.' };
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return { success: false, message: 'Invalid email or password.' };
    }

    // Store user session (simplified - in production use NextAuth or similar)
    // For now, we'll just return the user data
    return { success: true, message: 'Login successful.', user };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Login failed: ${errorMessage}` };
  }
}
