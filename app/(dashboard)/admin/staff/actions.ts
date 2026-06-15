'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function getAllUsers() {
  const session = await auth();
  if (session?.user?.role !== 'super_admin') return [];
  return db.select().from(users).orderBy(users.businessId);
}

export async function updateUser(id: number, data: { name: string; email: string; role: string }) {
  const session = await auth();
  if (session?.user?.role !== 'super_admin') throw new Error('Forbidden');

  await db.update(users).set(data).where(eq(users.id, id));
  revalidatePath('/admin/staff');
}

export async function deleteUser(id: number) {
  const session = await auth();
  if (session?.user?.role !== 'super_admin') throw new Error('Forbidden');
  if (String(id) === session.user.id) throw new Error('Cannot delete yourself');

  await db.delete(users).where(eq(users.id, id));
  revalidatePath('/admin/staff');
}

export async function createUser(data: { name: string; email: string; password: string; role: string; businessId?: number | null }) {
  const session = await auth();
  if (session?.user?.role !== 'super_admin') throw new Error('Forbidden');

  const hashedPassword = await bcrypt.hash(data.password, 12);

  await db.insert(users).values({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role,
    businessId: data.businessId ?? null,
  });

  revalidatePath('/admin/staff');
}
