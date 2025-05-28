import React, { useEffect, useState } from 'react';

interface FloatingIcon {
  x: number;
  y: number;
  opacity: number;
  scale: number;
  type: 'star' | 'whitestar';
  vibrationOffset: number;
  vibrationSpeed: number;
  corners: number;
}

export const FloatingIcons = () => {
  const [icon, setIcon] = useState<FloatingIcon | null>(null);

  useEffect(() => {
    const createNewIcon = () => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const type = Math.random() < 0.5 ? 'star' : 'whitestar';
      
      setIcon({
        x,
        y,
        opacity: 1,
        scale: 1,
        type,
        vibrationOffset: Math.random() * Math.PI * 2,
        vibrationSpeed: 0.5 + Math.random() * 1.5,
        corners: Math.floor(Math.random() * 7) + 3 // Random between 3 and 9 corners
      });

      setTimeout(() => {
        const fadeInterval = setInterval(() => {
          setIcon(prev => {
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
      }, 7000);

      setTimeout(() => {
        setIcon(null);
      }, 9000);
    };

    const interval = setInterval(() => {
      if (Math.random() < 0.5) {
        createNewIcon();
      }
    }, 5000);

    let animationFrame: number;
    const animate = () => {
      setIcon(prev => {
        if (!prev) return null;
        return {
          ...prev,
          vibrationOffset: prev.vibrationOffset + prev.vibrationSpeed * 0.02
        };
      });
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  if (!icon) return null;

  const iconLinks = {
    star: "https://www.credly.com/badges/ba1a0da5-339d-473c-b1f8-4a361c21ff37",
    whitestar: "https://www.credly.com/badges/9cbf36b1-602c-4255-9588-925259526527"
  };

  const vibrationX = Math.sin(icon.vibrationOffset) * 2;
  const vibrationY = Math.cos(icon.vibrationOffset * 1.3) * 2;

  // Create star shape points
  const createStarPoints = (cx: number, cy: number, corners: number, outerRadius: number, innerRadius: number) => {
    let points = '';
    for (let i = 0; i < corners * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (Math.PI * i) / corners;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      points += `${x},${y} `;
    }
    return points.trim();
  };

  const size = 20; // Base size for the star
  const outerRadius = size / 2;
  const innerRadius = outerRadius * 0.4;

  return (
    <a
      href={iconLinks[icon.type]}
      target="_blank"
      rel="noopener noreferrer"
      className="absolute z-20 cursor-pointer"
      style={{
        left: icon.x + vibrationX,
        top: icon.y + vibrationY,
        transform: `translate(-50%, -50%) scale(${icon.scale})`,
        transition: 'transform 2s ease-out'
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={`${icon.type === 'whitestar' ? 'text-white' : 'text-[#00FF41]'}`}
        style={{
          opacity: icon.opacity,
          transition: 'opacity 2s ease-out, color 0.3s ease',
          filter: icon.type === 'whitestar' 
            ? 'drop-shadow(0 0 10px white) drop-shadow(0 0 20px white)'
            : 'drop-shadow(0 0 10px #00FF41) drop-shadow(0 0 20px #00FF41)'
        }}
      >
        <polygon
          points={createStarPoints(size/2, size/2, icon.corners, outerRadius, innerRadius)}
          fill="currentColor"
        />
      </svg>
    </a>
  );
};