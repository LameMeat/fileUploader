"use client";
import React from 'react';

type Props = {
  progress: number | null;
  label?: string;
};

export default function ProgressBar({ progress, label }: Props) {
  if (progress === null || progress === undefined) return null;

  const pct = Math.max(0, Math.min(100, Math.round(progress)));

  return (
    <div className="progress-root" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
      <div className="progress-track" style={{ position: 'relative', width: '100%', height: 10, background: '#eee', borderRadius: 6, overflow: 'hidden' }}>
        <div className="progress-bar" style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#06b,#0cf)', transition: 'width 150ms linear' }} />
      </div>
      <div className="progress-label" style={{ marginTop: 6, fontSize: 12, textAlign: 'right' }}>{label ?? `${pct}%`}</div>
    </div>
  );
}
