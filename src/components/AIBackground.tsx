import React, { useRef, useEffect } from 'react';

interface DataStream {
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
  chars: string[];
}

interface Hologram {
  x: number;
  y: number;
  size: number;
  rotation: number;
  opacity: number;
  speed: number;
}

interface NeuralConnection {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  life: number;
  hue: number;
}

export const AIBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dataStreamsRef = useRef<DataStream[]>([]);
  const hologramsRef = useRef<Hologram[]>([]);
  const connectionsRef = useRef<NeuralConnection[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeElements();
    };

    const initializeElements = () => {
      // Create data streams
      dataStreamsRef.current = Array.from({ length: 20 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 1 + Math.random() * 3,
        length: 5 + Math.floor(Math.random() * 15),
        opacity: 0.1 + Math.random() * 0.3,
        chars: Array.from({ length: 10 }, () => 
          String.fromCharCode(0x30A0 + Math.random() * 0x20)
        )
      }));

      // Create holographic elements
      hologramsRef.current = Array.from({ length: 8 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 30 + Math.random() * 70,
        rotation: Math.random() * Math.PI * 2,
        opacity: 0.1 + Math.random() * 0.2,
        speed: 0.001 + Math.random() * 0.003
      }));

      // Create initial neural connections
      connectionsRef.current = Array.from({ length: 30 }, () => ({
        x1: Math.random() * canvas.width,
        y1: Math.random() * canvas.height,
        x2: Math.random() * canvas.width,
        y2: Math.random() * canvas.height,
        life: 1,
        hue: 200 + Math.random() * 40
      }));
    };

    const drawDataStreams = (ctx: CanvasRenderingContext2D) => {
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      dataStreamsRef.current.forEach(stream => {
        for (let i = 0; i < stream.length; i++) {
          const y = stream.y - i * 15;
          if (y < -15) continue;

          const charIndex = Math.floor(Date.now() / 100 + i) % stream.chars.length;
          const opacity = stream.opacity * (1 - i / stream.length);
          
          ctx.fillStyle = `rgba(0, 255, 100, ${opacity})`;
          ctx.fillText(stream.chars[charIndex], stream.x, y);
        }

        stream.y += stream.speed;
        if (stream.y > canvas.height + stream.length * 15) {
          stream.y = -stream.length * 15;
          stream.x = Math.random() * canvas.width;
        }
      });
    };

    const drawHolograms = (ctx: CanvasRenderingContext2D, time: number) => {
      hologramsRef.current.forEach(hologram => {
        ctx.save();
        ctx.translate(hologram.x, hologram.y);
        ctx.rotate(hologram.rotation + time * hologram.speed);
        
        // Outer glow
        const gradient = ctx.createRadialGradient(
          0, 0, hologram.size * 0.3,
          0, 0, hologram.size
        );
        gradient.addColorStop(0, `rgba(0, 255, 100, ${hologram.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(0, 255, 100, 0)`);
        
        ctx.beginPath();
        ctx.arc(0, 0, hologram.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Inner structure
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const radius = hologram.size * 0.7;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(0, 255, 100, ${hologram.opacity * 0.8})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Center dot
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 100, ${hologram.opacity})`;
        ctx.fill();

        ctx.restore();
      });
    };

    const updateNeuralConnections = () => {
      // Update existing connections
      connectionsRef.current = connectionsRef.current
        .map(conn => ({
          ...conn,
          life: conn.life - 0.002,
          x1: conn.x1 + (Math.random() - 0.5) * 0.5,
          y1: conn.y1 + (Math.random() - 0.5) * 0.5,
          x2: conn.x2 + (Math.random() - 0.5) * 0.5
        }))
        .filter(conn => conn.life > 0);

      // Add new connections
      if (Math.random() < 0.1) {
        connectionsRef.current.push({
          x1: Math.random() * canvas.width,
          y1: Math.random() * canvas.height,
          x2: Math.random() * canvas.width,
          y2: Math.random() * canvas.height,
          life: 1,
          hue: 200 + Math.random() * 40
        });
      }
    };

    const drawNeuralConnections = (ctx: CanvasRenderingContext2D) => {
      connectionsRef.current.forEach(conn => {
        const gradient = ctx.createLinearGradient(conn.x1, conn.y1, conn.x2, conn.y2);
        gradient.addColorStop(0, `hsla(${conn.hue}, 100%, 50%, ${conn.life * 0.1})`);
        gradient.addColorStop(1, `hsla(${conn.hue + 20}, 100%, 50%, ${conn.life * 0.05})`);
        
        ctx.beginPath();
        ctx.moveTo(conn.x1, conn.y1);
        
        // Create a curved path for organic feel
        const cpX = (conn.x1 + conn.x2) / 2 + (Math.random() - 0.5) * 50;
        const cpY = (conn.y1 + conn.y2) / 2 + (Math.random() - 0.5) * 50;
        ctx.quadraticCurveTo(cpX, cpY, conn.x2, conn.y2);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 0.5 + conn.life * 2;
        ctx.stroke();
      });
    };

    const drawGrid = (ctx: CanvasRenderingContext2D, time: number) => {
      const gridSize = 80;
      const pulse = Math.sin(time * 0.001) * 0.2 + 0.3;
      
      ctx.strokeStyle = `rgba(0, 255, 100, ${0.02 * pulse})`;
      ctx.lineWidth = 0.5;

      // Vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const animate = (time: number) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawGrid(ctx, time);
      updateNeuralConnections();
      drawNeuralConnections(ctx);
      drawHolograms(ctx, time);
      drawDataStreams(ctx);

      requestAnimationFrame(animate);
    };

    resizeCanvas();
    const animation = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
};
