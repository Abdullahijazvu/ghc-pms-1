import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq, and, count } from 'drizzle-orm';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ClinicDashboardPage() {
  const session = await auth();
  if (!session?.user) return null;
  const businessId = session.user.businessId;

  if (!businessId) return null;

  const [staffCount] = await db
    .select({ count: count() })
    .from(users)
    .where(
      and(
        eq(users.businessId, businessId),
        eq(users.role, 'staff')
      )
    );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Clinic Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome back, {session.user.name}. Manage your clinic staff and patients.
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffCount?.count ?? 0}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
