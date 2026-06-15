export type BodyPointData = { id: string; left: number; top: number };

export type ImageConfig = {
  label: string;
  src: string;
  pointIds: string[];
  defaultPositions: Record<string, { left: number; top: number }>;
};

export const imageConfigs: Record<string, ImageConfig> = {
  back: {
    label: 'Back',
    src: '/back-pt.webp',
    pointIds: [
      '44', '43', '40', '41', '42', '1', '21', '20', '46', '45', '55',
      '47L', '47R', '5', '4', '48', '19', '49', '6L', '6R',
      '23', '22', '50', '8', '10', '7', '9', '15', '25', '18', '24',
      '14', '17', '13', '11', '12', '16', '26',
      '30', '31', '29', '28', '51', '52', '27',
    ],
    defaultPositions: {
      '44': { left: 35, top: 4 },
      '43': { left: 65, top: 4 },
      '40': { left: 49.88, top: 5.34 },
      '42': { left: 38.49, top: 7.86 },
      '41': { left: 62.73, top: 8.25 },
      '1':  { left: 49.59, top: 11.73 },
      '21': { left: 27.69, top: 14.83 },
      '20': { left: 71.50, top: 14.64 },
      '46': { left: 41.71, top: 17.93 },
      '55': { left: 49.88, top: 17.93 },
      '45': { left: 58.06, top: 18.51 },
      '47L': { left: 20.68, top: 22.96 },
      '47R': { left: 81.43, top: 22.58 },
      '5':  { left: 42.29, top: 24.71 },
      '4':  { left: 57.77, top: 24.51 },
      '48': { left: 66.24, top: 24.71 },
      '19': { left: 32.94, top: 28.77 },
      '49': { left: 48.71, top: 30.90 },
      '6L': { left: 34.70, top: 41.17 },
      '6R': { left: 65.36, top: 40.97 },
      '23': { left: 39.37, top: 46.39 },
      '22': { left: 61.27, top: 46.59 },
      '50': { left: 33.24, top: 50.65 },
      '8':  { left: 39.37, top: 55.49 },
      '10': { left: 39.37, top: 59.75 },
      '7':  { left: 61.27, top: 55.69 },
      '9':  { left: 61.57, top: 59.95 },
      '15': { left: 25.64, top: 67.69 },
      '25': { left: 39.08, top: 69.82 },
      '18': { left: 50.47, top: 70.60 },
      '24': { left: 60.40, top: 69.24 },
      '14': { left: 75.00, top: 67.50 },
      '17': { left: 24.47, top: 77.37 },
      '13': { left: 42.87, top: 76.41 },
      '11': { left: 51.05, top: 78.34 },
      '12': { left: 58.06, top: 76.60 },
      '16': { left: 77.04, top: 77.18 },
      '26': { left: 85.22, top: 80.47 },
      '27': { left: 15.71, top: 80.47 },
      '31': { left: 28.86, top: 85.31 },
      '30': { left: 42.00, top: 85.51 },
      '29': { left: 61.57, top: 86.09 },
      '28': { left: 73.25, top: 85.12 },
      '51': { left: 83.47, top: 94.03 },
      '52': { left: 18.34, top: 94.80 },
    },
  },
  front: {
    label: 'Front Body',
    src: '/front-pt.webp',
    pointIds: ['1', '2', '3'],
    defaultPositions: {
      '1': { left: 50, top: 15 },
      '2': { left: 50, top: 30 },
      '3': { left: 50, top: 50 },
    },
  },
  face: {
    label: 'Face',
    src: '/face.webp',
    pointIds: ['1', '2', '3'],
    defaultPositions: {
      '1': { left: 50, top: 20 },
      '2': { left: 50, top: 40 },
      '3': { left: 50, top: 60 },
    },
  },
  arms: {
    label: 'Arms & Legs',
    src: '/arm-leg-pt.webp',
    pointIds: ['1', '2', '3'],
    defaultPositions: {
      '1': { left: 50, top: 15 },
      '2': { left: 50, top: 35 },
      '3': { left: 50, top: 60 },
    },
  },
};

export const diseases: { id: string; name: string; points: string[] }[] = [
  { id: 'allergy', name: 'Allergy', points: ['42', '41'] },
  { id: 'back_pain', name: 'Back Pain', points: ['21', '47'] },
  { id: 'joint_pain', name: 'Joint Pain', points: ['5', '4'] },
  { id: 'muscle_strain', name: 'Muscle Strain', points: ['50'] },
];

export function getDefaultBodyPoints(imageKey: string): BodyPointData[] {
  const config = imageConfigs[imageKey];
  if (!config) return [];
  return config.pointIds.map((id) => ({
    id,
    left: config.defaultPositions[id]?.left ?? 50,
    top: config.defaultPositions[id]?.top ?? 50,
  }));
}
