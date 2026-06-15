'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Users, Edit, Trash2, X, Check, PlusCircle } from 'lucide-react';
import type { User } from '@/lib/schema';
import { getAllUsers, updateUser, deleteUser, createUser } from './actions';

const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  business_admin: 'Business Admin',
  staff: 'Staff',
};

export function AdminStaffList({ businesses, currentUserId }: { businesses: { id: number; name: string }[]; currentUserId?: string }) {
  const [users, setUsers] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', password: '', role: 'staff', businessId: '' });
  const [refresh, setRefresh] = useState(0);

  const businessMap = new Map(businesses.map((b) => [b.id, b.name]));

  useEffect(() => {
    getAllUsers().then(setUsers);
  }, [refresh]);

  function startEdit(user: User) {
    setEditingId(user.id);
    setEditForm({ name: user.name, email: user.email, role: user.role });
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(id: number) {
    await updateUser(id, editForm);
    setEditingId(null);
    setRefresh((n) => n + 1);
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    await deleteUser(id);
    setRefresh((n) => n + 1);
  }

  async function handleAdd() {
    await createUser({
      name: addForm.name,
      email: addForm.email,
      password: addForm.password,
      role: addForm.role,
      businessId: addForm.businessId ? Number(addForm.businessId) : null,
    });
    setShowAdd(false);
    setAddForm({ name: '', email: '', password: '', role: 'staff', businessId: '' });
    setRefresh((n) => n + 1);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Staff</CardTitle>
            <CardDescription>Manage all users across the platform.</CardDescription>
          </div>
          <Button onClick={() => setShowAdd(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showAdd && (
          <div className="mb-4 rounded-lg border p-4 space-y-3">
            <h4 className="font-medium text-sm">New User</h4>
            <div className="grid grid-cols-5 gap-3">
              <Input placeholder="Name" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} />
              <Input placeholder="Email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} />
              <Input placeholder="Password" type="password" value={addForm.password} onChange={(e) => setAddForm({ ...addForm, password: e.target.value })} />
              <select
                value={addForm.role}
                onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="business_admin">Business Admin</option>
                <option value="staff">Staff</option>
              </select>
              <select
                value={addForm.businessId}
                onChange={(e) => setAddForm({ ...addForm, businessId: e.target.value })}
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">No clinic</option>
                {businesses.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAdd}>
                <Check className="mr-1 h-4 w-4" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowAdd(false)}>
                <X className="mr-1 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        {users.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No users found.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden md:table-cell">Clinic</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  {editingId === user.id ? (
                    <>
                      <TableCell>
                        <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                      </TableCell>
                      <TableCell>
                        <Input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                      </TableCell>
                      <TableCell>
                        <select
                          value={editForm.role}
                          onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="business_admin">Business Admin</option>
                          <option value="staff">Staff</option>
                        </select>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.businessId ? businessMap.get(user.businessId) ?? '-' : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => saveEdit(user.id)}>
                            <Check className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={cancelEdit}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                          {roleLabels[user.role] ?? user.role}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.businessId ? businessMap.get(user.businessId) ?? '-' : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {String(user.id) !== currentUserId && (
                            <>
                              <Button variant="outline" size="sm" onClick={() => startEdit(user)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDelete(user.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
