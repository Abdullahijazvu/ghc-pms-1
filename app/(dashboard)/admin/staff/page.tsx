import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { businesses } from '@/lib/schema';
import { AdminStaffList } from './staff-list';

export const dynamic = 'force-dynamic';

export default async function AdminStaffPage() {
  const session = await auth();
  const allBusinesses = await db.select().from(businesses);

  return <AdminStaffList businesses={allBusinesses} currentUserId={session?.user?.id} />;
}
