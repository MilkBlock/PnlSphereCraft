
import React from 'react';
import { useCurrentFrame } from 'remotion';

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const offset = (frame * 2) % 50;

  return (
    <div className="absolute inset-0 bg-slate-900 overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(to right, #475569 1px, transparent 1px), linear-gradient(to bottom, #475569 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          transform: `translate(${-offset}px, ${-offset}px)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900 opacity-60" />
    </div>
  );
};
