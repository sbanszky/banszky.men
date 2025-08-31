import React, { useRef, useEffect } from 'react';

const generateIpv6 = () => {
  return Array(8)
    .fill(0)
    .map(() => Math.floor(Math.random() * 65536).toString(16).padStart(4, '0'))
    .join(':');
};

const getRandomColor = () => {
  const colors = [
    '#00FF41',  // Matrix green
    '#4169E1',  // Royal blue
    '#9370DB',  // Medium purple
    '#20B2AA',  // Light sea green
    '#FFD700',  // Gold
    '#FF69B4',  // Hot pink
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const Ipv6Matrix = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const columns = Math.floor(canvas.width / 25); // Increased spacing between columns
    const drops: number[] = new Array(columns).fill(0);
    const ipv6Addresses: string[] = new Array(columns).fill('').map(generateIpv6);
    const colors: string[] = new Array(columns).fill('').map(getRandomColor);

    let lastFrame = 0;
    const frameInterval = 150; // Balanced performance

    const draw = (timestamp: number) => {
      if (timestamp - lastFrame < frameInterval) {
        requestAnimationFrame(draw);
        return;
      }
      lastFrame = timestamp;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        if (Math.random() < 0.01) {
          ipv6Addresses[i] = generateIpv6();
        }
        if (Math.random() < 0.005) {
          colors[i] = getRandomColor();
        }

        const segments = ipv6Addresses[i].split(':');
        const y = drops[i] * 25; // Increased vertical spacing

        segments.forEach((segment, index) => {
          const opacity = Math.max(0, 1 - (drops[i] * 25 - index * 25) / canvas.height);
          const color = colors[i];
          const [r, g, b] = color.match(/\w\w/g)?.map(x => parseInt(x, 16)) || [0, 255, 65];
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.15})`;
          ctx.font = '14px monospace'; // Slightly smaller font
          ctx.fillText(segment, i * 25, y - index * 25);
        });

        if (y > canvas.height) {
          drops[i] = 0;
          ipv6Addresses[i] = generateIpv6();
        } else {
          drops[i] += 0.5;
        }
      }

      requestAnimationFrame(draw);
    };

    const animation = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full opacity-25 pointer-events-none"
      style={{ zIndex: 2 }}
    />
  );
};
