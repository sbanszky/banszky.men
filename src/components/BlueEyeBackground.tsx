import React, { useRef, useEffect, useState } from 'react';

interface Node {
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  connections: number[];
  intuition: number;
  pulse: number;
  ruleAdaptation: number;
}

export const BlueEyeBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const [rulesVersion, setRulesVersion] = useState(0);

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
      const nodeCount = 40;
      nodesRef.current = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        size: 5 + Math.random() * 5,
        connections: [],
        intuition: 0.5 + Math.random() * 0.5,
        pulse: Math.random() * Math.PI * 2,
        ruleAdaptation: Math.random()
      }));

      applyDynamicRules();
    };

    const applyDynamicRules = () => {
      nodesRef.current.forEach((node, i) => {
        // Clear existing connections
        node.connections = [];

        // Apply new connection rules based on current version
        if (rulesVersion % 2 === 0) {
          // Rule Set A: Connect based on intuition
          for (let j = 0; j < nodesRef.current.length; j++) {
            if (i !== j && Math.random() < node.intuition * 0.5) {
              node.connections.push(j);
            }
          }
        } else {
          // Rule Set B: Connect based on proximity and adaptation
          for (let j = 0; j < nodesRef.current.length; j++) {
            if (i !== j) {
              const distance = Math.sqrt(
                Math.pow(node.x - nodesRef.current[j].x, 2) +
                Math.pow(node.y - nodesRef.current[j].y, 2)
              );
              if (distance < 200 * node.ruleAdaptation) {
                node.connections.push(j);
              }
            }
          }
        }
      });
    };

    const getEyeBoundary = (angle: number) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = Math.min(canvas.width, canvas.height) * 0.4;
      const variation = Math.sin(angle * 3) * 20;
      return {
        x: centerX + Math.cos(angle) * (baseRadius + variation),
        y: centerY + Math.sin(angle) * (baseRadius + variation)
      };
    };

    const drawEye = (ctx: CanvasRenderingContext2D, time: number) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const eyeSize = Math.min(canvas.width, canvas.height) * 0.8;

      // Outer glow
      const outerGlow = ctx.createRadialGradient(
        centerX, centerY, eyeSize * 0.3,
        centerX, centerY, eyeSize
      );
      outerGlow.addColorStop(0, 'rgba(0, 100, 255, 0.3)');
      outerGlow.addColorStop(1, 'rgba(0, 100, 255, 0)');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, eyeSize, 0, Math.PI * 2);
      ctx.fillStyle = outerGlow;
      ctx.fill();

      // Iris with pulsating effect
      const irisSize = eyeSize * 0.4 * (0.95 + Math.sin(time * 0.002) * 0.05);
      const iris = ctx.createRadialGradient(
        centerX, centerY, irisSize * 0.2,
        centerX, centerY, irisSize
      );
      iris.addColorStop(0, `rgba(0, 150, 255, ${0.8 + Math.sin(time * 0.003) * 0.1})`);
      iris.addColorStop(1, `rgba(0, 50, 150, ${0.8 + Math.cos(time * 0.003) * 0.1})`);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, irisSize, 0, Math.PI * 2);
      ctx.fillStyle = iris;
      ctx.fill();

      // Pupil with subtle movement
      const pupilOffsetX = Math.sin(time * 0.001) * 3;
      const pupilOffsetY = Math.cos(time * 0.0015) * 3;
      ctx.beginPath();
      ctx.arc(
        centerX + pupilOffsetX,
        centerY + pupilOffsetY,
        irisSize * 0.25,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = 'rgba(0, 0, 50, 0.9)';
      ctx.fill();
    };

    const drawLaserConnections = (ctx: CanvasRenderingContext2D, time: number) => {
      nodesRef.current.forEach((node, i) => {
        node.connections.forEach(j => {
          const target = nodesRef.current[j];
          const distance = Math.sqrt(
            Math.pow(node.x - target.x, 2) + 
            Math.pow(node.y - target.y, 2)
          );

          if (distance < 300) {
            const gradient = ctx.createLinearGradient(node.x, node.y, target.x, target.y);
            gradient.addColorStop(0, `rgba(0, 150, 255, ${0.3 + 0.2 * Math.sin(time * 0.01 + node.pulse)})`);
            gradient.addColorStop(1, `rgba(0, 200, 255, ${0.3 + 0.2 * Math.cos(time * 0.01 + node.pulse)})`);

            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(target.x, target.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1 + Math.sin(time * 0.01 + node.pulse) * 0.5;
            ctx.stroke();
          }
        });
      });
    };

    const updateNodes = () => {
      nodesRef.current.forEach(node => {
        // Update position
        node.x += node.dx;
        node.y += node.dy;
        node.pulse += 0.02;

        // Calculate angle and distance from center
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const angle = Math.atan2(node.y - centerY, node.x - centerX);
        const boundary = getEyeBoundary(angle);
        const distToBoundary = Math.sqrt(
          Math.pow(node.x - boundary.x, 2) + 
          Math.pow(node.y - boundary.y, 2)
        );

        // Push node back if it tries to escape the eye
        if (distToBoundary < 10) {
          const pushAngle = Math.atan2(node.y - boundary.y, node.x - boundary.x);
          node.dx = Math.cos(pushAngle) * 0.5;
          node.dy = Math.sin(pushAngle) * 0.5;
        }
      });
    };

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drawEye(ctx, time);
      updateNodes();
      drawLaserConnections(ctx, time);

      // Change rules periodically
      if (time % 10000 < 16) {
        setRulesVersion(prev => prev + 1);
        applyDynamicRules();
      }

      requestAnimationFrame(animate);
    };

    resizeCanvas();
    const animation = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [rulesVersion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
};
