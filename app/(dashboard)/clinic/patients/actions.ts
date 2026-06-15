'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { patients, bodyPointConfig } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import type { BodyPointData } from '@/lib/body-points-defaults';

export async function getBodyPointConfig(imageKey: string) {
  const config = await db
    .select()
    .from(bodyPointConfig)
    .where(eq(bodyPointConfig.imageKey, imageKey))
    .limit(1);
  if (!config.length) return null;
  return JSON.parse(config[0].points) as BodyPointData[];
}

export async function saveBodyPointConfig(imageKey: string, points: BodyPointData[]) {
  const session = await auth();
  if (session?.user?.role !== 'super_admin') throw new Error('Forbidden');
  const json = JSON.stringify(points);
  const existing = await db
    .select()
    .from(bodyPointConfig)
    .where(eq(bodyPointConfig.imageKey, imageKey))
    .limit(1);
  if (existing.length) {
    await db
      .update(bodyPointConfig)
      .set({ points: json })
      .where(eq(bodyPointConfig.imageKey, imageKey));
  } else {
    await db.insert(bodyPointConfig).values({ imageKey, points: json });
  }
}

export async function canManageBodyPoints() {
  const session = await auth();
  return session?.user?.role === 'super_admin';
}

export async function createPatient(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');
  const businessId = session.user.businessId;
  if (!businessId && session.user.role !== 'super_admin') throw new Error('No business assigned');

  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const dateOfBirth = formData.get('dateOfBirth') as string;
  const gender = formData.get('gender') as string;
  const address = formData.get('address') as string;
  const diagnoses = formData.get('diagnoses') as string;

  await db.insert(patients).values({
    businessId: businessId ?? 0,
    firstName,
    lastName,
    email: email || null,
    phone: phone || null,
    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
    gender: gender || null,
    address: address || null,
    diagnoses: diagnoses || null,
    createdById: Number(session.user.id),
  });

  revalidatePath('/clinic/patients');
}

export async function updatePatient(id: number, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');
  const isSuper = session.user.role === 'super_admin';

  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const dateOfBirth = formData.get('dateOfBirth') as string;
  const gender = formData.get('gender') as string;
  const address = formData.get('address') as string;
  const diagnoses = formData.get('diagnoses') as string;

  await db
    .update(patients)
    .set({
      firstName,
      lastName,
      email: email || null,
      phone: phone || null,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      gender: gender || null,
      address: address || null,
      diagnoses: diagnoses || null,
    })
    .where(
      isSuper
        ? eq(patients.id, id)
        : and(eq(patients.id, id), eq(patients.businessId, session.user.businessId!))
    );

  revalidatePath('/clinic/patients');
}

export async function deletePatient(id: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');
  const isSuper = session.user.role === 'super_admin';

  await db
    .delete(patients)
    .where(
      isSuper
        ? eq(patients.id, id)
        : and(eq(patients.id, id), eq(patients.businessId, session.user.businessId!))
    );

  revalidatePath('/clinic/patients');
}

export async function getPatients() {
  const session = await auth();
  if (!session?.user) return [];

  if (session.user.role === 'super_admin') {
    return db.select().from(patients).orderBy(patients.createdAt);
  }

  if (!session.user.businessId) return [];

  return db
    .select()
    .from(patients)
    .where(eq(patients.businessId, session.user.businessId))
    .orderBy(patients.createdAt);
}
