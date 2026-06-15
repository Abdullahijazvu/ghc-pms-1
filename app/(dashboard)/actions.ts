'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { users, businesses } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function createBusiness(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');
  if (session.user.role !== 'super_admin') throw new Error('Forbidden');

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const address = formData.get('address') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const adminName = formData.get('adminName') as string;
  const adminEmail = formData.get('adminEmail') as string;
  const adminPassword = formData.get('adminPassword') as string || 'changeme123';

  const [business] = await db.insert(businesses).values({
    name,
    description,
    address,
    phone,
    email,
    userId: Number(session.user.id),
  });

  const businessId = Number(business.insertId);

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await db.insert(users).values({
    name: adminName,
    email: adminEmail,
    password: hashedPassword,
    role: 'business_admin',
    businessId,
  });

  revalidatePath('/admin/businesses');
}

export async function updateBusiness(id: number, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');
  if (session.user.role !== 'super_admin') throw new Error('Forbidden');

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const address = formData.get('address') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;

  await db
    .update(businesses)
    .set({ name, description, address, phone, email })
    .where(eq(businesses.id, id));

  revalidatePath('/admin/businesses');
}

export async function deleteBusiness(id: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');
  if (session.user.role !== 'super_admin') throw new Error('Forbidden');

  await db.delete(businesses).where(eq(businesses.id, id));

  revalidatePath('/admin/businesses');
}
