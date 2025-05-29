import React, { useEffect, useState } from 'react';

interface Star {
  x: number;
  y: number;
  opacity: number;
  scale: number;
}

export const LaSteaua = () => {
  const [star, setStar] = useState<Star | null>(null);

  useEffect(() => {
    const createNewStar = () => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      setStar({
        x,
        y,
        opacity: 1,
        scale: 1
      });

      // Fade out effect
      const fadeInterval = setInterval(() => {
        setStar(prev => {
          if (!prev || prev.opacity <= 0) {
            clearInterval(fadeInterval);
            return null;
          }
          return {
            ...prev,
            opacity: prev.opacity - 0.05,
            scale: prev.scale + 0.1
          };
        });
      }, 50);

      // Clear star after animation
      setTimeout(() => {
        setStar(null);
      }, 2000);
    };

    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance to show a star
        createNewStar();
      }
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (!star) return null;

  return (
    <a
      href="https://www.credly.com/badges/ba1a0da5-339d-473c-b1f8-4a361c21ff37"
      target="_blank"
      rel="noopener noreferrer"
      className="absolute z-20 cursor-pointer"
      style={{
        left: star.x,
        top: star.y,
        transform: `translate(-50%, -50%) scale(${star.scale})`,
        transition: 'transform 2s ease-out'
      }}
    >
      <div
        className="text-[#00FF41] text-2xl hover:text-[#00FF41]/80"
        style={{
          opacity: star.opacity,
          transition: 'opacity 2s ease-out, color 0.3s ease',
          textShadow: '0 0 10px #00FF41, 0 0 20px #00FF41, 0 0 30px #00FF41'
        }}
      >
        ★
      </div>
    </a>
  );
};
