import React, { useRef, useEffect, useState } from 'react';

interface InternetNode {
  x: number;
  y: number;
  connections: number[];
  size: number;
  activity: number;
  intelligence: number;
  dx: number;
  dy: number;
  learningRate: number;
  angle: number;
  radius: number;
}

interface DataPacket {
  x: number;
  y: number;
  dx: number;
  dy: number;
  life: number;
  size: number;
  targetNode: number;
  intelligence: number;
}

interface LaserBeam {
  x: number;
  y: number;
  tx: number;
  ty: number;
  life: number;
  hue: number;
}

export const GlobalInternet = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos] = useState({ x: -100, y: -100 });
  const packetsRef = useRef<DataPacket[]>([]);
  const nodesRef = useRef<InternetNode[]>([]);
  const lasersRef = useRef<LaserBeam[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeNodes();
    };

    const initializeNodes = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.min(canvas.width, canvas.height) * 0.4 * 1.4;

      nodesRef.current = Array.from({ length: 50 }, (_, i) => {
        const angle = (i / 50) * Math.PI * 2;
        const eyeShape = 1 - Math.abs(Math.sin(angle)) * 0.3;
        const radius = maxRadius * (0.2 + Math.random() * 0.8) * eyeShape;
        
        const inIris = Math.random() < 0.3;
        const irisRadius = inIris ? maxRadius * 0.3 * 1.4 : radius;
        
        return {
          x: centerX + Math.cos(angle) * irisRadius,
          y: centerY + Math.sin(angle) * irisRadius * 0.7,
          connections: [],
          size: inIris ? (4 + Math.random() * 3) * 1.5 : (2 + Math.random() * 2) * 1.5,
          activity: 0,
          intelligence: 0.5 + Math.random() * 0.5,
          dx: (Math.random() - 0.5) * 0.1,
          dy: (Math.random() - 0.5) * 0.1,
          learningRate: 0.01 + Math.random() * 0.02,
          angle,
          radius: irisRadius
        };
      });

      nodesRef.current.forEach((node, i) => {
        const connections = new Set<number>();
        const numConnections = 2 + Math.floor(node.intelligence * 4);
        
        while (connections.size < numConnections) {
          const target = Math.floor(Math.random() * nodesRef.current.length);
          if (target !== i) connections.add(target);
        }
        node.connections = Array.from(connections);
      });
    };

    const createLaser = (sourceIdx: number, targetIdx: number) => {
      const source = nodesRef.current[sourceIdx];
      const target = nodesRef.current[targetIdx];
      
      lasersRef.current.push({
        x: source.x,
        y: source.y,
        tx: target.x,
        ty: target.y,
        life: 1,
        hue: Math.random() * 360
      });
    };

    const updateLasers = () => {
      lasersRef.current = lasersRef.current
        .map(laser => ({
          ...laser,
          life: laser.life - 0.1,
          x: laser.x + (laser.tx - laser.x) * 0.3,
          y: laser.y + (laser.ty - laser.y) * 0.3
        }))
        .filter(laser => laser.life > 0);
    };

    const drawLasers = (ctx: CanvasRenderingContext2D) => {
      lasersRef.current.forEach(laser => {
        const gradient = ctx.createLinearGradient(laser.x, laser.y, laser.tx, laser.ty);
        gradient.addColorStop(0, `hsla(${laser.hue}, 100%, 50%, ${laser.life * 0.8})`);
        gradient.addColorStop(1, `hsla(${laser.hue}, 100%, 50%, ${laser.life * 0.2})`);
        
        ctx.beginPath();
        ctx.moveTo(laser.x, laser.y);
        ctx.lineTo(laser.tx, laser.ty);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2 + laser.life * 3;
        ctx.stroke();
      });
    };

    const createPacket = (sourceIdx: number) => {
      const source = nodesRef.current[sourceIdx];
      if (!source.connections.length) return;

      const targetIdx = source.connections[
        Math.floor(Math.random() * source.connections.length)
      ];
      const target = nodesRef.current[targetIdx];

      // Create laser when packet is sent
      createLaser(sourceIdx, targetIdx);

      packetsRef.current.push({
        x: source.x,
        y: source.y,
        dx: (target.x - source.x) * 0.004 * source.intelligence,
        dy: (target.y - source.y) * 0.004 * source.intelligence,
        life: 1,
        size: (1 + Math.random() * 2) * 1.5,
        targetNode: targetIdx,
        intelligence: source.intelligence,
      });
    };

    const applyBlackHoleGravity = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const blackHoleRadius = 30;
      const pullStrength = 0.1;

      nodesRef.current.forEach(node => {
        const dx = centerX - node.x;
        const dy = centerY - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < blackHoleRadius * 5) {
          node.x += dx * pullStrength * (1 - dist/(blackHoleRadius * 5));
          node.y += dy * pullStrength * (1 - dist/(blackHoleRadius * 5));
        }
      });

      packetsRef.current.forEach(p => {
        const dx = centerX - p.x;
        const dy = centerY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < blackHoleRadius * 3) {
          p.dx += dx * 0.0005;
          p.dy += dy * 0.0005;
        }
      });
    };

    const updatePackets = () => {
      packetsRef.current = packetsRef.current
        .map(p => {
          const target = nodesRef.current[p.targetNode];
          const dx = target.x - p.x;
          const dy = target.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          const speedFactor = 0.5 + p.intelligence * 0.5;
          return {
            ...p,
            x: p.x + p.dx * speedFactor,
            y: p.y + p.dy * speedFactor,
            life: dist < 20 ? 0 : p.life - 0.002,
            size: p.size * 0.99,
          };
        })
        .filter(p => p.life > 0);
    };

    const drawBackground = (ctx: CanvasRenderingContext2D) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawBlackHole = (ctx: CanvasRenderingContext2D) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const holeRadius = 30;

      const gradient = ctx.createRadialGradient(
        centerX, centerY, holeRadius * 0.5,
        centerX, centerY, holeRadius * 2
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, holeRadius * 2, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY, holeRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'black';
      ctx.fill();
    };

    const drawConnections = (ctx: CanvasRenderingContext2D, time: number) => {
      nodesRef.current.forEach((node, i) => {
        node.connections.forEach(j => {
          const target = nodesRef.current[j];
          const connectionStrength = (node.intelligence + target.intelligence) / 2;
          
          const gradient = ctx.createLinearGradient(node.x, node.y, target.x, target.y);
          const alpha = 0.1 + Math.sin(time * 0.002 + i) * 0.05;
          gradient.addColorStop(0, `hsla(210, 100%, 60%, ${alpha * connectionStrength})`);
          gradient.addColorStop(1, `hsla(240, 100%, 60%, ${alpha * connectionStrength})`);

          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          
          const cpX = (node.x + target.x)/2 + Math.sin(time*0.001 + i) * 30;
          const cpY = (node.y + target.y)/2 + Math.cos(time*0.001 + i) * 30;
          ctx.quadraticCurveTo(cpX, cpY, target.x, target.y);
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 0.5 + connectionStrength;
          ctx.stroke();
        });
      });
    };

    const drawNodes = (ctx: CanvasRenderingContext2D, time: number) => {
      nodesRef.current.forEach((node, i) => {
        node.activity = 0.5 + Math.sin(time * 0.001 * node.intelligence + i) * 0.5;
        
        const glowSize = node.size * 4;
        const glow = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, glowSize
        );
        glow.addColorStop(0, `hsla(220, 100%, 60%, ${node.activity * 0.3 * node.intelligence})`);
        glow.addColorStop(1, 'hsla(220, 100%, 60%, 0)');
        
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(210, 100%, 60%, ${node.activity * node.intelligence})`;
        ctx.fill();

        if (Math.random() < node.intelligence * 0.03) {
          createPacket(i);
        }
      });
    };

    const drawPackets = (ctx: CanvasRenderingContext2D) => {
      packetsRef.current.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(200, 100%, 60%, ${p.life * p.intelligence})`;
        ctx.fill();
      });
    };

    const animate = (time: number) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      drawBackground(ctx);
      applyBlackHoleGravity();
      updateLasers();
      updatePackets();
      drawConnections(ctx, time);
      drawLasers(ctx);
      drawPackets(ctx);
      drawNodes(ctx, time);
      drawBlackHole(ctx);

      if (time % 5000 < 16) {
        nodesRef.current.forEach(node => {
          if (Math.random() < node.learningRate) {
            node.connections = node.connections
              .filter(() => Math.random() > 0.1)
              .concat([Math.floor(Math.random() * nodesRef.current.length)]);
          }
        });
      }

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
      className="absolute top-0 left-0 w-full h-full opacity-50 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};
