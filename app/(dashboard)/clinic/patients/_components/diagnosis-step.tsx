'use client';

import { BodyMapStep } from './body-map-step';

export function DiagnosisStep(props: {
  selectedDiseases: string[];
  onChange: (ids: string[]) => void;
}) {
  return <BodyMapStep imageKey="back" {...props} />;
}
