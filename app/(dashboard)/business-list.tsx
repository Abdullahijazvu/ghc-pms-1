'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Building2, Edit, Trash2 } from 'lucide-react';
import type { Business } from '@/lib/schema';
import { useRouter } from 'next/navigation';
import { deleteBusiness } from './actions';

export function BusinessList({ businesses }: { businesses: Business[] }) {
  const router = useRouter();

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this business?')) return;
    await deleteBusiness(id);
    router.refresh();
  }

  if (businesses.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <Building2 className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">No businesses yet. Create your first one!</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="hidden md:table-cell">Phone</TableHead>
          <TableHead className="hidden md:table-cell">Email</TableHead>
          <TableHead className="hidden lg:table-cell">Address</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {businesses.map((business) => (
          <TableRow key={business.id}>
            <TableCell className="font-medium">{business.name}</TableCell>
            <TableCell className="hidden md:table-cell">{business.phone || '-'}</TableCell>
            <TableCell className="hidden md:table-cell">{business.email || '-'}</TableCell>
            <TableCell className="hidden lg:table-cell max-w-[200px] truncate">
              {business.address || '-'}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/businesses/${business.id}/edit`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(business.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
