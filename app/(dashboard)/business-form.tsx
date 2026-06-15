'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Business } from '@/lib/schema';
import { createBusiness, updateBusiness } from './actions';

export function BusinessForm({ business }: { business?: Business }) {
  const router = useRouter();
  const isEditing = !!business;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    if (business) {
      await updateBusiness(business.id, formData);
      router.push('/admin/businesses');
    } else {
      await createBusiness(formData);
      router.push('/admin/businesses');
    }

    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Business' : 'Add Business'}</CardTitle>
        <CardDescription>
          {isEditing
            ? 'Update clinic details.'
            : 'Register a new clinic with a Business Admin account.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Business Name *</label>
            <Input
              id="name"
              name="name"
              defaultValue={business?.name}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Textarea
              id="description"
              name="description"
              defaultValue={business?.description || ''}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium">Address</label>
            <Textarea
              id="address"
              name="address"
              defaultValue={business?.address || ''}
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Phone</label>
              <Input
                id="phone"
                name="phone"
                defaultValue={business?.phone || ''}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={business?.email || ''}
              />
            </div>
          </div>

          {!isEditing && (
            <>
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Business Admin Account</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  An admin user will be created for this business.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="adminName" className="text-sm font-medium">Admin Name *</label>
                    <Input id="adminName" name="adminName" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="adminEmail" className="text-sm font-medium">Admin Email *</label>
                    <Input id="adminEmail" name="adminEmail" type="email" required />
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <label htmlFor="adminPassword" className="text-sm font-medium">Temporary Password</label>
                  <Input
                    id="adminPassword"
                    name="adminPassword"
                    type="password"
                    placeholder="Leave blank for default (changeme123)"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex gap-2 pt-2">
            <Button type="submit">
              {isEditing ? 'Update Business' : 'Create Business'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/businesses')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
