import React, { useRef, useEffect, useState } from 'react';

interface ExplosionParticle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  life: number;
  size: number;
  hue: number;
}

export const RainbowExplosion = ({ trigger }: { trigger: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<ExplosionParticle[]>([]);
  const [exploding, setExploding] = useState(false);

  useEffect(() => {
    if (trigger && !exploding) {
      setExploding(true);
      createExplosion();
    }
  }, [trigger]);

  const createExplosion = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    particlesRef.current = Array.from({ length: 100 }, () => ({
      x: centerX,
      y: centerY,
      dx: (Math.random() - 0.5) * 8,
      dy: (Math.random() - 0.5) * 8,
      life: 1,
      size: 3 + Math.random() * 4,
      hue: Math.random() * 360
    }));

    const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current
        .map(p => ({
          ...p,
          x: p.x + p.dx,
          y: p.y + p.dy,
          life: p.life - 0.01,
          size: p.size * 0.98,
          dy: p.dy + 0.1
        }))
        .filter(p => p.life > 0);

      particlesRef.current.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 50%, ${p.life * 0.8})`;
        ctx.fill();
      });

      if (particlesRef.current.length > 0) {
        requestAnimationFrame(animate);
      } else {
        setExploding(false);
      }
    };

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  if (!exploding) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 9999 }}
    />
  );
};
