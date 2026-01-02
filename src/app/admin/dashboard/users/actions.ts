'use server'

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
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

export async function addUser(userData: Omit<User, 'id'> & { password: string }) {
  const { username, email, password } = userData;
  if (!username || !email || !password) {
    return { success: false, message: 'Username, email, and password are required.' };
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = "Admin"; // All users are admins now
    await db.query(
      'INSERT INTO users (username, email, role, password_hash) VALUES ($1, $2, $3, $4)',
      [username, email, role, hashedPassword]
    );
    revalidatePath('/admin/dashboard/users');
    return { success: true, message: 'User added successfully.' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to add user: ${errorMessage}` };
  }
}

export async function updateUser(userData: User & { password?: string }) {
  const { id, username, email, password } = userData;
  if (!username || !email) {
    return { success: false, message: 'Username and email are required.' };
  }

  try {
    const role = "Admin"; // All users are admins now
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query(
        'UPDATE users SET username = $1, email = $2, role = $3, password_hash = $4 WHERE id = $5',
        [username, email, role, hashedPassword, id]
      );
    } else {
      await db.query(
        'UPDATE users SET username = $1, email = $2, role = $3 WHERE id = $4',
        [username, email, role, id]
      );
    }
    revalidatePath('/admin/dashboard/users');
    return { success: true, message: 'User updated successfully.' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to update user: ${errorMessage}` };
  }
}

export async function deleteUser(userId: number) {
  try {
    const result = await db.query('DELETE FROM users WHERE id = $1', [userId]);
    
    if (result?.rowCount && result.rowCount > 0) {
      revalidatePath('/admin/dashboard/users');
      return { success: true, message: 'User deleted successfully.' };
    } else {
      throw new Error('User not found or already deleted.');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to delete user: ${errorMessage}` };
  }
}
