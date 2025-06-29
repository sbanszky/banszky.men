import React, { useRef, useEffect } from 'react';

interface Synapse {
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  pulse: number;
  intelligence: number;
  connections: number[];
}

interface NeuralPulse {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  intensity: number;
  hue: number;
}

export const BlueEyeBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const synapsesRef = useRef<Synapse[]>([]);
  const pulsesRef = useRef<NeuralPulse[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeSynapses();
    };

    const initializeSynapses = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const eyeRadius = Math.min(canvas.width, canvas.height) * 0.35;

      synapsesRef.current = Array.from({ length: 60 }, (_, i) => {
        const angle = (i / 60) * Math.PI * 2;
        const radiusVariation = 0.7 + Math.random() * 0.6;
        const x = centerX + Math.cos(angle) * eyeRadius * radiusVariation;
        const y = centerY + Math.sin(angle) * eyeRadius * radiusVariation * 0.8; // Slightly oval

        return {
          x,
          y,
          dx: (Math.random() - 0.5) * 0.3,
          dy: (Math.random() - 0.5) * 0.3,
          size: 2 + Math.random() * 4,
          pulse: Math.random() * Math.PI * 2,
          intelligence: 0.3 + Math.random() * 0.7,
          connections: []
        };
      });

      // Create intelligent connections
      synapsesRef.current.forEach((synapse, i) => {
        const numConnections = Math.floor(synapse.intelligence * 4) + 1;
        const connections = new Set<number>();
        
        while (connections.size < numConnections) {
          const target = Math.floor(Math.random() * synapsesRef.current.length);
          if (target !== i) {
            const distance = Math.hypot(
              synapse.x - synapsesRef.current[target].x,
              synapse.y - synapsesRef.current[target].y
            );
            if (distance < 200) {
              connections.add(target);
            }
          }
        }
        synapse.connections = Array.from(connections);
      });
    };

    const isInsideEye = (x: number, y: number) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const eyeRadiusX = Math.min(canvas.width, canvas.height) * 0.4;
      const eyeRadiusY = eyeRadiusX * 0.7;
      
      const normalizedX = (x - centerX) / eyeRadiusX;
      const normalizedY = (y - centerY) / eyeRadiusY;
      
      return (normalizedX * normalizedX + normalizedY * normalizedY) <= 1;
    };

    const drawEyeStructure = (ctx: CanvasRenderingContext2D, time: number) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const eyeRadiusX = Math.min(canvas.width, canvas.height) * 0.4;
      const eyeRadiusY = eyeRadiusX * 0.7;

      // Outer eye glow
      const outerGlow = ctx.createRadialGradient(
        centerX, centerY, eyeRadiusX * 0.5,
        centerX, centerY, eyeRadiusX * 1.2
      );
      outerGlow.addColorStop(0, 'rgba(30, 144, 255, 0.15)');
      outerGlow.addColorStop(1, 'rgba(30, 144, 255, 0)');
      
      ctx.save();
      ctx.scale(1, eyeRadiusY / eyeRadiusX);
      ctx.beginPath();
      ctx.arc(centerX, centerY * (eyeRadiusX / eyeRadiusY), eyeRadiusX * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = outerGlow;
      ctx.fill();
      ctx.restore();

      // Iris with dynamic patterns
      const irisRadius = eyeRadiusX * 0.6;
      const iris = ctx.createRadialGradient(
        centerX, centerY, irisRadius * 0.2,
        centerX, centerY, irisRadius
      );
      
      const pulseIntensity = 0.8 + Math.sin(time * 0.003) * 0.2;
      iris.addColorStop(0, `rgba(100, 149, 237, ${pulseIntensity})`);
      iris.addColorStop(0.3, `rgba(65, 105, 225, ${pulseIntensity * 0.9})`);
      iris.addColorStop(0.7, `rgba(30, 144, 255, ${pulseIntensity * 0.7})`);
      iris.addColorStop(1, `rgba(0, 100, 200, ${pulseIntensity * 0.5})`);
      
      ctx.save();
      ctx.scale(1, eyeRadiusY / eyeRadiusX);
      ctx.beginPath();
      ctx.arc(centerX, centerY * (eyeRadiusX / eyeRadiusY), irisRadius, 0, Math.PI * 2);
      ctx.fillStyle = iris;
      ctx.fill();
      ctx.restore();

      // Pupil with subtle movement
      const pupilRadius = irisRadius * 0.3;
      const pupilOffsetX = Math.sin(time * 0.0008) * 5;
      const pupilOffsetY = Math.cos(time * 0.0012) * 3;
      
      ctx.beginPath();
      ctx.arc(
        centerX + pupilOffsetX,
        centerY + pupilOffsetY,
        pupilRadius,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = 'rgba(0, 0, 50, 0.95)';
      ctx.fill();

      // Inner pupil reflection
      ctx.beginPath();
      ctx.arc(
        centerX + pupilOffsetX - pupilRadius * 0.3,
        centerY + pupilOffsetY - pupilRadius * 0.3,
        pupilRadius * 0.2,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = 'rgba(150, 200, 255, 0.4)';
      ctx.fill();
    };

    const createNeuralPulse = (fromIndex: number, toIndex: number) => {
      const from = synapsesRef.current[fromIndex];
      const to = synapsesRef.current[toIndex];
      
      pulsesRef.current.push({
        x: from.x,
        y: from.y,
        targetX: to.x,
        targetY: to.y,
        progress: 0,
        intensity: 0.5 + Math.random() * 0.5,
        hue: 200 + Math.random() * 60
      });
    };

    const updateSynapses = (time: number) => {
      synapsesRef.current.forEach((synapse, i) => {
        // Update pulse
        synapse.pulse += 0.03;
        
        // Gentle movement
        synapse.x += synapse.dx;
        synapse.y += synapse.dy;
        
        // Keep synapses within eye boundary
        if (!isInsideEye(synapse.x, synapse.y)) {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const angle = Math.atan2(synapse.y - centerY, synapse.x - centerX);
          const eyeRadiusX = Math.min(canvas.width, canvas.height) * 0.35;
          const eyeRadiusY = eyeRadiusX * 0.7;
          
          synapse.x = centerX + Math.cos(angle) * eyeRadiusX * 0.9;
          synapse.y = centerY + Math.sin(angle) * eyeRadiusY * 0.9;
          synapse.dx *= -0.5;
          synapse.dy *= -0.5;
        }

        // Create neural pulses occasionally
        if (Math.random() < synapse.intelligence * 0.02) {
          if (synapse.connections.length > 0) {
            const targetIndex = synapse.connections[
              Math.floor(Math.random() * synapse.connections.length)
            ];
            createNeuralPulse(i, targetIndex);
          }
        }
      });
    };

    const updatePulses = () => {
      pulsesRef.current = pulsesRef.current
        .map(pulse => ({
          ...pulse,
          progress: pulse.progress + 0.02,
          x: pulse.x + (pulse.targetX - pulse.x) * 0.02,
          y: pulse.y + (pulse.targetY - pulse.y) * 0.02
        }))
        .filter(pulse => pulse.progress < 1);
    };

    const drawConnections = (ctx: CanvasRenderingContext2D, time: number) => {
      synapsesRef.current.forEach((synapse, i) => {
        synapse.connections.forEach(targetIndex => {
          const target = synapsesRef.current[targetIndex];
          const distance = Math.hypot(target.x - synapse.x, target.y - synapse.y);
          
          if (distance < 150) {
            const connectionStrength = (synapse.intelligence + target.intelligence) * 0.5;
            const alpha = (1 - distance / 150) * connectionStrength * 0.15;
            
            const gradient = ctx.createLinearGradient(
              synapse.x, synapse.y, target.x, target.y
            );
            gradient.addColorStop(0, `rgba(100, 149, 237, ${alpha})`);
            gradient.addColorStop(1, `rgba(30, 144, 255, ${alpha})`);

            ctx.beginPath();
            ctx.moveTo(synapse.x, synapse.y);
            
            // Add subtle curve to connections
            const midX = (synapse.x + target.x) / 2;
            const midY = (synapse.y + target.y) / 2;
            const curve = Math.sin(time * 0.001 + i) * 10;
            ctx.quadraticCurveTo(midX + curve, midY - curve, target.x, target.y);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.5 + connectionStrength;
            ctx.stroke();
          }
        });
      });
    };

    const drawSynapses = (ctx: CanvasRenderingContext2D, time: number) => {
      synapsesRef.current.forEach(synapse => {
        const activity = 0.5 + Math.sin(time * 0.002 + synapse.pulse) * 0.5;
        const glowSize = synapse.size * 3;
        
        // Synapse glow
        const glow = ctx.createRadialGradient(
          synapse.x, synapse.y, 0,
          synapse.x, synapse.y, glowSize
        );
        glow.addColorStop(0, `rgba(100, 149, 237, ${activity * synapse.intelligence * 0.4})`);
        glow.addColorStop(1, 'rgba(100, 149, 237, 0)');
        
        ctx.beginPath();
        ctx.arc(synapse.x, synapse.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Synapse core
        ctx.beginPath();
        ctx.arc(synapse.x, synapse.y, synapse.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 149, 237, ${activity * synapse.intelligence})`;
        ctx.fill();
      });
    };

    const drawPulses = (ctx: CanvasRenderingContext2D) => {
      pulsesRef.current.forEach(pulse => {
        const size = 3 + pulse.intensity * 2;
        const alpha = (1 - pulse.progress) * pulse.intensity;
        
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${pulse.hue}, 80%, 60%, ${alpha})`;
        ctx.fill();
        
        // Pulse trail
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${pulse.hue}, 80%, 60%, ${alpha * 0.3})`;
        ctx.fill();
      });
    };

    const animate = (time: number) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawEyeStructure(ctx, time);
      updateSynapses(time);
      updatePulses();
      drawConnections(ctx, time);
      drawSynapses(ctx, time);
      drawPulses(ctx);

      requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    const animation = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
};