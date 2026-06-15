import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { db } from '@/lib/db';
import { businesses } from '@/lib/schema';
import { auth } from '@/lib/auth';
import { PlusCircle } from 'lucide-react';
import { BusinessList } from '../../business-list';

export const dynamic = 'force-dynamic';

export default async function AdminBusinessesPage() {
  const session = await auth();
  if (!session?.user) return null;

  const allBusinesses = await db.select().from(businesses);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Businesses</CardTitle>
            <CardDescription>Manage all clinics and practices on the platform.</CardDescription>
          </div>
          <Button asChild>
            <Link href="/admin/businesses/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Business
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <BusinessList businesses={allBusinesses} />
      </CardContent>
    </Card>
  );
}
