'use client';

import { useState } from 'react';
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
import { createPatient, updatePatient } from '../actions';
import { BodyMapStep } from './body-map-step';
import { ChevronLeft, ChevronRight, User, Stethoscope, FileText, Check } from 'lucide-react';
import type { Patient } from '@/lib/schema';

const steps = [
  { id: 'basic', label: 'Basic Info', icon: User },
  { id: 'back', label: 'Back', icon: Stethoscope },
  { id: 'front', label: 'Front Body', icon: Stethoscope },
  { id: 'face', label: 'Face', icon: Stethoscope },
  { id: 'arms', label: 'Arms & Legs', icon: Stethoscope },
  { id: 'review', label: 'Review', icon: FileText },
];

type PatientData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  selectedDiseases: Record<string, string[]>;
};

const imageSteps = ['back', 'front', 'face', 'arms'] as const;
type ImageKey = (typeof imageSteps)[number];

function parseDiagnoses(raw: string | null | undefined): Record<ImageKey, string[]> {
  if (!raw) return { back: [], front: [], face: [], arms: [] };
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return { back: parsed as string[], front: [], face: [], arms: [] };
    }
    return { back: [], front: [], face: [], arms: [], ...parsed };
  } catch {
    return { back: [], front: [], face: [], arms: [] };
  }
}

function toDateString(val: string | Date | null | undefined): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  return val.toISOString().split('T')[0];
}

export function PatientForm({ patient, onClose }: { patient?: Patient; onClose: () => void }) {
  const router = useRouter();
  const isEditing = !!patient;
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [data, setData] = useState<PatientData>({
    firstName: patient?.firstName ?? '',
    lastName: patient?.lastName ?? '',
    email: patient?.email ?? '',
    phone: patient?.phone ?? '',
    dateOfBirth: toDateString(patient?.dateOfBirth),
    gender: patient?.gender ?? '',
    address: patient?.address ?? '',
    selectedDiseases: parseDiagnoses(patient?.diagnoses),
  });

  function update(field: keyof PatientData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  function handleNext() {
    if (step === 0) {
      if (!data.firstName.trim() || !data.lastName.trim()) {
        setError('First name and last name are required');
        return;
      }
    }
    setError('');
    setStep((s) => Math.min(steps.length - 1, s + 1));
  }

  function handlePrev() {
    setError('');
    setStep((s) => Math.max(0, s - 1));
  }

  async function handleSave() {
    setError('');
    const fd = new FormData();
    fd.set('firstName', data.firstName);
    fd.set('lastName', data.lastName);
    fd.set('email', data.email);
    fd.set('phone', data.phone);
    fd.set('dateOfBirth', data.dateOfBirth);
    fd.set('gender', data.gender);
    fd.set('address', data.address);
    fd.set('diagnoses', JSON.stringify(data.selectedDiseases));

    try {
      if (isEditing && patient) {
        await updatePatient(patient.id, fd);
      } else {
        await createPatient(fd);
      }
      router.refresh();
      onClose();
    } catch {
      setError('Failed to save patient');
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{isEditing ? 'Edit Patient' : 'Add Patient'}</CardTitle>
            <CardDescription>
              {isEditing ? 'Update patient information.' : 'Register a new patient in your clinic.'}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
        </div>
        <div className="flex items-center gap-2 pt-4 text-sm">
          <span className="font-medium shrink-0">{steps[step].label}</span>
          {step < steps.length - 1 && (
            <>
              <div className="flex-1 border-t border-border" />
              <span className="text-muted-foreground shrink-0">{steps[step + 1].label}</span>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {step === 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">First Name *</label>
                <Input id="firstName" value={data.firstName} onChange={(e) => update('firstName', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">Last Name *</label>
                <Input id="lastName" value={data.lastName} onChange={(e) => update('lastName', e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input id="email" value={data.email} onChange={(e) => update('email', e.target.value)} type="email" />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                <Input id="phone" value={data.phone} onChange={(e) => update('phone', e.target.value)} type="tel" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="dateOfBirth" className="text-sm font-medium">Date of Birth</label>
                <Input id="dateOfBirth" value={data.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)} type="date" />
              </div>
              <div className="space-y-2">
                <label htmlFor="gender" className="text-sm font-medium">Gender</label>
                <select
                  id="gender"
                  value={data.gender}
                  onChange={(e) => update('gender', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">Address</label>
              <Textarea id="address" value={data.address} onChange={(e) => update('address', e.target.value)} rows={2} />
            </div>
          </div>
        )}

        {(step === 1 || step === 2 || step === 3 || step === 4) && (
          <BodyMapStep
            imageKey={imageSteps[step - 1]}
            selectedDiseases={data.selectedDiseases[imageSteps[step - 1]] ?? []}
            onChange={(ids) => setData((prev) => ({
              ...prev,
              selectedDiseases: { ...prev.selectedDiseases, [imageSteps[step - 1]]: ids },
            }))}
          />
        )}

        {step === 5 && (
          <div className="space-y-4 py-4">
            <h3 className="font-medium">Review Patient Information</h3>
            <div className="rounded-lg border p-4 space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {data.firstName} {data.lastName}</p>
              <p><span className="font-medium">Email:</span> {data.email || '-'}</p>
              <p><span className="font-medium">Phone:</span> {data.phone || '-'}</p>
              <p><span className="font-medium">DOB:</span> {data.dateOfBirth || '-'}</p>
              <p><span className="font-medium">Gender:</span> {data.gender ? data.gender.charAt(0).toUpperCase() + data.gender.slice(1) : '-'}</p>
              <p><span className="font-medium">Address:</span> {data.address || '-'}</p>
              <div className="pt-2 border-t">
                <p className="font-medium mb-1">Diagnoses by Area:</p>
                {imageSteps.map((key) => {
                  const label = steps.find((s) => s.id === key)?.label ?? key;
                  const items = data.selectedDiseases[key] ?? [];
                  return (
                    <p key={key} className="text-xs ml-2">
                      <span className="font-medium">{label}:</span>{' '}
                      {items.length > 0 ? items.map((d) => d.replace(/_/g, ' ')).join(', ') : '-'}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {error && <p className="pt-4 text-sm text-red-500">{error}</p>}

        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={handlePrev} disabled={step === 0}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {step < steps.length - 1 ? (
            <Button type="button" onClick={handleNext}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="button" onClick={handleSave}>
              <Check className="mr-2 h-4 w-4" />
              {isEditing ? 'Update Patient' : 'Save Patient'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
