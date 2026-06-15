'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
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
import { PlusCircle, User, Stethoscope, Edit, Trash2, Activity } from 'lucide-react';
import { PatientForm } from './_components/patient-form';
import type { Patient } from '@/lib/schema';
import { getPatients, deletePatient } from './actions';
import { useRouter } from 'next/navigation';

function renderDiagnoses(ids: string[] | undefined) {
  if (!ids || ids.length === 0) return <span className="text-muted-foreground text-xs">N/A</span>;
  return (
    <div className="flex gap-1 flex-wrap">
      {ids.map((d) => (
        <span key={d} className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs">
          <Activity className="h-3 w-3" />
          {d.replace(/_/g, ' ')}
        </span>
      ))}
    </div>
  );
}

export default function PatientsPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    getPatients().then(setPatients);
  }, [refresh]);

  function handleFormClose() {
    setShowForm(false);
    setEditingPatient(null);
    setRefresh((n) => n + 1);
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this patient?')) return;
    await deletePatient(id);
    setRefresh((n) => n + 1);
  }

  if (showForm || editingPatient) {
    return (
      <div className="mx-auto w-full max-w-2xl px-2 sm:px-0">
        <PatientForm patient={editingPatient ?? undefined} onClose={handleFormClose} />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Patients</CardTitle>
            <CardDescription>View and manage patients for your clinic.</CardDescription>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {patients.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <Stethoscope className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No patients yet. Add your first patient!</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="hidden lg:table-cell">Gender</TableHead>
                <TableHead className="hidden lg:table-cell">DOB</TableHead>
                <TableHead>Back</TableHead>
                <TableHead className="hidden lg:table-cell">Front Body</TableHead>
                <TableHead className="hidden lg:table-cell">Face</TableHead>
                <TableHead className="hidden lg:table-cell">Arms & Legs</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => {
                const imageMap: Record<string, string[]> = patient.diagnoses
                  ? (() => {
                      const parsed = JSON.parse(patient.diagnoses);
                      if (Array.isArray(parsed)) return { back: parsed };
                      return { back: [], front: [], face: [], arms: [], ...parsed };
                    })()
                  : {};
                return (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {patient.firstName} {patient.lastName}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{patient.email || <span className="text-muted-foreground text-xs">N/A</span>}</TableCell>
                    <TableCell className="hidden md:table-cell">{patient.phone || <span className="text-muted-foreground text-xs">N/A</span>}</TableCell>
                    <TableCell className="hidden lg:table-cell capitalize">{patient.gender || <span className="text-muted-foreground text-xs">N/A</span>}</TableCell>
                    <TableCell className="hidden lg:table-cell">{patient.dateOfBirth ? String(patient.dateOfBirth) : <span className="text-muted-foreground text-xs">N/A</span>}</TableCell>
                    <TableCell>
                      {renderDiagnoses(imageMap.back)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {renderDiagnoses(imageMap.front)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {renderDiagnoses(imageMap.face)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {renderDiagnoses(imageMap.arms)}
                    </TableCell>
                    <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingPatient(patient)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(patient.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
