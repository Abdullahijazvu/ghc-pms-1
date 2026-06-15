'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function getClinicUsers() {
  const session = await auth();
  if (!session?.user?.businessId) return [];
  return db
    .select()
    .from(users)
    .where(eq(users.businessId, session.user.businessId))
    .orderBy(users.role);
}

export async function updateClinicStaff(id: number, data: { name: string; email: string }) {
  const session = await auth();
  if (!session?.user?.businessId) throw new Error('Forbidden');

  const [target] = await db
    .select()
    .from(users)
    .where(and(eq(users.id, id), eq(users.businessId, session.user.businessId)))
    .limit(1);

  if (!target) throw new Error('User not found');
  if (target.role !== 'staff') throw new Error('Can only edit staff members');

  await db.update(users).set(data).where(eq(users.id, id));
  revalidatePath('/clinic/staff');
}

export async function deleteClinicStaff(id: number) {
  const session = await auth();
  if (!session?.user?.businessId) throw new Error('Forbidden');

  const [target] = await db
    .select()
    .from(users)
    .where(and(eq(users.id, id), eq(users.businessId, session.user.businessId)))
    .limit(1);

  if (!target) throw new Error('User not found');
  if (target.role !== 'staff') throw new Error('Can only delete staff members');

  await db.delete(users).where(eq(users.id, id));
  revalidatePath('/clinic/staff');
}

export async function createClinicStaff(data: { name: string; email: string; password: string }) {
  const session = await auth();
  if (!session?.user?.businessId) throw new Error('Forbidden');

  const hashedPassword = await bcrypt.hash(data.password, 12);

  await db.insert(users).values({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: 'staff',
    businessId: session.user.businessId,
  });

  revalidatePath('/clinic/staff');
}
