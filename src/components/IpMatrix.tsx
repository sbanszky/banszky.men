import React, { useRef } from 'react';
import { useMatrixEffect } from '../hooks/useMatrixEffect';

export const IpMatrix = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useMatrixEffect(canvasRef);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full opacity-40"
    />
  );
};
