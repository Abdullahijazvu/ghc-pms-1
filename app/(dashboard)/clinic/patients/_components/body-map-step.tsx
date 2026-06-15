'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
import { getBodyPointConfig, saveBodyPointConfig, canManageBodyPoints } from '../actions';
import { imageConfigs, getDefaultBodyPoints, diseases } from '@/lib/body-points-defaults';
import type { BodyPointData } from '@/lib/body-points-defaults';

type BodyPoint = BodyPointData;

export function BodyMapStep({
  imageKey,
  selectedDiseases,
  onChange,
}: {
  imageKey: string;
  selectedDiseases: string[];
  onChange: (ids: string[]) => void;
}) {
  const config = imageConfigs[imageKey];
  const [bodyPoints, setBodyPoints] = useState<BodyPoint[]>([]);
  const [configMode, setConfigMode] = useState(false);
  const [configPointId, setConfigPointId] = useState(config?.pointIds[0] ?? '');
  const [canConfigure, setCanConfigure] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointId: string;
    startLeft: number;
    startTop: number;
    startX: number;
    startY: number;
    containerWidth: number;
    containerHeight: number;
  } | null>(null);
  const bodyPointsRef = useRef(bodyPoints);
  bodyPointsRef.current = bodyPoints;

  useEffect(() => {
    canManageBodyPoints().then(setCanConfigure);
    getBodyPointConfig(imageKey).then((serverPoints) => {
      const defaults = getDefaultBodyPoints(imageKey);
      if (serverPoints) {
        const serverIds = new Set(serverPoints.map((p) => p.id));
        const merged = [...serverPoints, ...defaults.filter((p) => !serverIds.has(p.id))];
        setBodyPoints(merged);
      } else {
        setBodyPoints(defaults);
      }
    });
  }, [imageKey]);

  const selSet = new Set(selectedDiseases);

  function getSelectedPoints(): Set<string> {
    const points = new Set<string>();
    for (const dId of selSet) {
      const disease = diseases.find((d) => d.id === dId);
      if (disease) disease.points.forEach((p) => points.add(p));
    }
    return points;
  }

  function getDiseasesForPoint(pointId: string): string[] {
    return diseases.filter((d) => d.points.includes(pointId)).map((d) => d.id);
  }

  const toggleDisease = useCallback(
    (id: string) => {
      const next = new Set(selSet);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      onChange(Array.from(next));
    },
    [selectedDiseases, onChange]
  );

  const togglePoint = useCallback(
    (pointId: string) => {
      const related = getDiseasesForPoint(pointId);
      const next = new Set(selSet);
      for (const dId of related) {
        if (next.has(dId)) next.delete(dId);
        else next.add(dId);
      }
      onChange(Array.from(next));
    },
    [selectedDiseases, onChange]
  );

  function handleImageClick(e: React.MouseEvent<HTMLImageElement>) {
    if (!configMode || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const left = ((e.clientX - rect.left) / rect.width) * 100;
    const top = ((e.clientY - rect.top) / rect.height) * 100;

    const updated: BodyPointData[] = [...bodyPoints.filter((p) => p.id !== configPointId), { id: configPointId, left, top }];
    setBodyPoints(updated);
    saveBodyPointConfig(imageKey, updated);
  }

  function handlePointerDown(e: React.PointerEvent, pt: BodyPoint) {
    if (!configMode || !containerRef.current) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const rect = containerRef.current.getBoundingClientRect();
    dragRef.current = {
      pointId: pt.id,
      startLeft: pt.left,
      startTop: pt.top,
      startX: e.clientX,
      startY: e.clientY,
      containerWidth: rect.width,
      containerHeight: rect.height,
    };
  }

  function handlePointerMove(e: React.PointerEvent) {
    const drag = dragRef.current;
    if (!drag || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dx = ((e.clientX - drag.startX) / rect.width) * 100;
    const dy = ((e.clientY - drag.startY) / rect.height) * 100;
    const left = Math.max(0, Math.min(100, drag.startLeft + dx));
    const top = Math.max(0, Math.min(100, drag.startTop + dy));
    setBodyPoints((prev) =>
      prev.map((p) => (p.id === drag.pointId ? { ...p, left, top } : p))
    );
  }

  function handlePointerUp(e: React.PointerEvent) {
    const drag = dragRef.current;
    if (!drag) return;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    dragRef.current = null;
    saveBodyPointConfig(imageKey, bodyPointsRef.current);
  }

  const activePoints = getSelectedPoints();

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
      <div className="w-full lg:w-64 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm text-muted-foreground">{config?.label ?? imageKey}</h3>
          {canConfigure && (
            <button
              onClick={() => setConfigMode(!configMode)}
              className={`text-xs px-2 py-1 rounded border transition-colors ${configMode ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'}`}
            >
              {configMode ? 'Done' : 'Configure'}
            </button>
          )}
        </div>

        {configMode && config && (
          <div className="rounded-lg border p-3 space-y-2 text-sm">
            <p className="font-medium">Click on image to place point</p>
            <select
              value={configPointId}
              onChange={(e) => setConfigPointId(e.target.value)}
              className="w-full h-8 rounded border border-input bg-background px-2 text-sm"
            >
              {config.pointIds.map((id) => (
                <option key={id} value={id}>Point {id}</option>
              ))}
            </select>
            <button
              onClick={() => { setBodyPoints([] as BodyPoint[]); saveBodyPointConfig(imageKey, [] as BodyPointData[]); }}
              className="text-xs text-red-500 hover:underline"
            >
              Reset all points
            </button>
          </div>
        )}

        {diseases.map((d) => (
          <label
            key={d.id}
            className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-accent transition-colors"
          >
            <input
              type="checkbox"
              checked={selSet.has(d.id)}
              onChange={() => toggleDisease(d.id)}
              className="h-4 w-4 rounded border-gray-300 accent-primary"
            />
            <div>
              <p className="text-sm font-medium">{d.name}</p>
              <p className="text-xs text-muted-foreground">Points: {d.points.join(', ')}</p>
            </div>
          </label>
        ))}
      </div>

      <div className="flex-1 flex justify-center">
        <div
          ref={containerRef}
          className="relative w-full max-w-sm overflow-hidden"
        >
          <img
            src={config?.src ?? ''}
            alt={config?.label ?? imageKey}
            className={`block w-full h-auto ${configMode ? 'cursor-crosshair' : ''}`}
            onClick={handleImageClick}
            draggable={false}
          />
          {bodyPoints.map((pt) => {
            const isActive = activePoints.has(pt.id);
            return (
              <div
                key={pt.id}
                onClick={() => !configMode && togglePoint(pt.id)}
                onPointerDown={(e) => handlePointerDown(e, pt)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className={`absolute ${configMode ? 'cursor-move' : 'cursor-pointer'}`}
                style={{
                  left: `${pt.left}%`,
                  top: `${pt.top}%`,
                  transform: 'translate(-50%, -50%)',
                  width: 26,
                  height: 26,
                  touchAction: 'none',
                }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  {isActive && (
                    <div className="absolute inset-0 rounded-full bg-red-500/80" />
                  )}
                  <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 ${
                    isActive ? 'bg-red-500/90 border-red-300' : 'bg-blue-500/70 border-white'
                  }`}>
                    {pt.id}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
