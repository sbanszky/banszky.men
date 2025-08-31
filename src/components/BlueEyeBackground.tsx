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

interface EyeState {
  blinkProgress: number;
  isBlinking: boolean;
  nextBlinkTime: number;
  pupilX: number;
  pupilY: number;
  lookDirection: { x: number; y: number };
  lookChangeTime: number;
  blinkScale: number;
}

export const BlueEyeBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const synapsesRef = useRef<Synapse[]>([]);
  const pulsesRef = useRef<NeuralPulse[]>([]);
  const eyeStateRef = useRef<EyeState>({
    blinkProgress: 0,
    isBlinking: false,
    nextBlinkTime: Date.now() + 2000 + Math.random() * 3000,
    pupilX: 0,
    pupilY: 0,
    lookDirection: { x: 0, y: 0 },
    lookChangeTime: Date.now() + 1000,
    blinkScale: 1
  });
  const animationRef = useRef<number>();

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
      const baseRadius = Math.min(canvas.width, canvas.height) * 0.35;

      synapsesRef.current = Array.from({ length: 25 }, (_, i) => {
        const angle = (i / 25) * Math.PI * 2;
        const radiusVariation = 0.7 + Math.random() * 0.6;
        const x = centerX + Math.cos(angle) * baseRadius * radiusVariation;
        const y = centerY + Math.sin(angle) * baseRadius * radiusVariation * 0.6;

        return {
          x,
          y,
          dx: (Math.random() - 0.5) * 0.2,
          dy: (Math.random() - 0.5) * 0.2,
          size: 2 + Math.random() * 3,
          pulse: Math.random() * Math.PI * 2,
          intelligence: 0.3 + Math.random() * 0.7,
          connections: []
        };
      });

      // Create connections
      synapsesRef.current.forEach((synapse, i) => {
        const numConnections = Math.floor(synapse.intelligence * 2) + 1;
        const connections = new Set<number>();
        
        while (connections.size < numConnections && connections.size < 3) {
          const target = Math.floor(Math.random() * synapsesRef.current.length);
          if (target !== i) {
            const distance = Math.hypot(
              synapse.x - synapsesRef.current[target].x,
              synapse.y - synapsesRef.current[target].y
            );
            if (distance < 150) {
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
      const baseRadius = Math.min(canvas.width, canvas.height) * 0.35;
      const eyeRadiusX = baseRadius;
      const eyeRadiusY = baseRadius * 0.6;
      const normalizedX = (x - centerX) / eyeRadiusX;
      const normalizedY = (y - centerY) / eyeRadiusY;
      return (normalizedX * normalizedX + normalizedY * normalizedY) <= 1;
    };

    const updateEyeState = (time: number) => {
      const eyeState = eyeStateRef.current;
      
      if (!eyeState.isBlinking && time > eyeState.nextBlinkTime) {
        eyeState.isBlinking = true;
        eyeState.blinkProgress = 0;
      }
      
      if (eyeState.isBlinking) {
        eyeState.blinkProgress += 0.15;
        if (eyeState.blinkProgress >= 1) {
          eyeState.isBlinking = false;
          eyeState.blinkProgress = 0;
          eyeState.nextBlinkTime = time + 3000 + Math.random() * 5000;
        }
      }
      
      let blinkScale = 1;
      if (eyeState.isBlinking) {
        const blinkCurve = eyeState.blinkProgress < 0.5 
          ? eyeState.blinkProgress * 2 
          : (1 - eyeState.blinkProgress) * 2;
        blinkScale = 1 - (blinkCurve * 0.9);
      }
      eyeState.blinkScale = blinkScale;
      
      if (time > eyeState.lookChangeTime) {
        eyeState.lookDirection.x = (Math.random() - 0.5) * 0.4;
        eyeState.lookDirection.y = (Math.random() - 0.5) * 0.3;
        eyeState.lookChangeTime = time + 2000 + Math.random() * 4000;
      }
      
      const targetX = eyeState.lookDirection.x * 10;
      const targetY = eyeState.lookDirection.y * 8;
      eyeState.pupilX += (targetX - eyeState.pupilX) * 0.03;
      eyeState.pupilY += (targetY - eyeState.pupilY) * 0.03;
    };

    const drawEyeStructure = (ctx: CanvasRenderingContext2D, time: number) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = Math.min(canvas.width, canvas.height) * 0.35;
      const eyeRadiusX = baseRadius;
      const eyeRadiusY = baseRadius * 0.6;
      const eyeState = eyeStateRef.current;
      const blinkScale = eyeState.blinkScale;

      // Outer eye glow
      const outerGlow = ctx.createRadialGradient(
        centerX, centerY, baseRadius * 0.3,
        centerX, centerY, baseRadius * 1.1
      );
      outerGlow.addColorStop(0, 'rgba(30, 144, 255, 0.15)');
      outerGlow.addColorStop(1, 'rgba(30, 144, 255, 0)');
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(1, (eyeRadiusY / eyeRadiusX) * blinkScale);
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 1.1, 0, Math.PI * 2);
      ctx.fillStyle = outerGlow;
      ctx.fill();
      ctx.restore();

      // Iris
      const irisRadius = baseRadius * 0.55;
      const iris = ctx.createRadialGradient(
        centerX, centerY, irisRadius * 0.2,
        centerX, centerY, irisRadius
      );
      const pulseIntensity = 0.6 + Math.sin(time * 0.003) * 0.2;
      iris.addColorStop(0, `rgba(135, 206, 250, ${pulseIntensity * 0.4})`);
      iris.addColorStop(0.5, `rgba(65, 105, 225, ${pulseIntensity * 0.3})`);
      iris.addColorStop(1, `rgba(30, 144, 255, ${pulseIntensity * 0.2})`);
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(1, (eyeRadiusY / eyeRadiusX) * blinkScale);
      ctx.beginPath();
      ctx.arc(0, 0, irisRadius, 0, Math.PI * 2);
      ctx.fillStyle = iris;
      ctx.fill();
      ctx.restore();

      // Pupil
      const pupilRadius = irisRadius * 0.35;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(1, blinkScale);
      ctx.beginPath();
      ctx.arc(eyeState.pupilX, eyeState.pupilY, pupilRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 30, 0.95)';
      ctx.fill();

      // Pupil reflection
      ctx.beginPath();
      ctx.arc(
        eyeState.pupilX - pupilRadius * 0.25,
        eyeState.pupilY - pupilRadius * 0.25,
        pupilRadius * 0.15,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = 'rgba(200, 230, 255, 0.6)';
      ctx.fill();
      ctx.restore();
    };

    const createNeuralPulse = (fromIndex: number, toIndex: number) => {
      if (pulsesRef.current.length >= 15) return;
      
      const from = synapsesRef.current[fromIndex];
      const to = synapsesRef.current[toIndex];
      if (!from || !to) return;
      
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
        synapse.pulse += 0.03;
        synapse.x += synapse.dx;
        synapse.y += synapse.dy;
        
        if (!isInsideEye(synapse.x, synapse.y)) {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const angle = Math.atan2(synapse.y - centerY, synapse.x - centerX);
          const baseRadius = Math.min(canvas.width, canvas.height) * 0.35;
          synapse.x = centerX + Math.cos(angle) * baseRadius * 0.8;
          synapse.y = centerY + Math.sin(angle) * baseRadius * 0.8 * 0.6;
          synapse.dx *= -0.5;
          synapse.dy *= -0.5;
        }

        if (Math.random() < 0.008) {
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
          progress: pulse.progress + 0.04,
          x: pulse.x + (pulse.targetX - pulse.x) * 0.04,
          y: pulse.y + (pulse.targetY - pulse.y) * 0.04
        }))
        .filter(pulse => pulse.progress < 1);
    };

    const drawConnections = (ctx: CanvasRenderingContext2D, time: number) => {
      synapsesRef.current.forEach((synapse, i) => {
        synapse.connections.forEach(targetIndex => {
          const target = synapsesRef.current[targetIndex];
          if (!target) return;
          
          const distance = Math.hypot(target.x - synapse.x, target.y - synapse.y);
          if (distance < 150) {
            const connectionStrength = (synapse.intelligence + target.intelligence) * 0.5;
            const alpha = (1 - distance / 150) * connectionStrength * 0.3;
            
            ctx.beginPath();
            ctx.moveTo(synapse.x, synapse.y);
            ctx.lineTo(target.x, target.y);
            ctx.strokeStyle = `rgba(100, 149, 237, ${alpha})`;
            ctx.lineWidth = 0.8 + connectionStrength * 0.5;
            ctx.stroke();
          }
        });
      });
    };

    const drawSynapses = (ctx: CanvasRenderingContext2D, time: number) => {
      synapsesRef.current.forEach(synapse => {
        const activity = 0.5 + Math.sin(time * 0.002 + synapse.pulse) * 0.5;
        
        // Synapse glow
        const glow = ctx.createRadialGradient(
          synapse.x, synapse.y, 0,
          synapse.x, synapse.y, synapse.size * 3
        );
        glow.addColorStop(0, `rgba(100, 149, 237, ${activity * synapse.intelligence * 0.6})`);
        glow.addColorStop(1, 'rgba(100, 149, 237, 0)');
        
        ctx.beginPath();
        ctx.arc(synapse.x, synapse.y, synapse.size * 3, 0, Math.PI * 2);
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
        
        // Pulse glow
        const glow = ctx.createRadialGradient(
          pulse.x, pulse.y, 0,
          pulse.x, pulse.y, size * 2
        );
        glow.addColorStop(0, `hsla(${pulse.hue}, 80%, 60%, ${alpha})`);
        glow.addColorStop(1, 'hsla(0, 0%, 0%, 0)');
        
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, size * 2, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Pulse core
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${pulse.hue}, 80%, 60%, ${alpha})`;
        ctx.fill();
      });
    };

    let lastFrameTime = 0;
    const frameInterval = 50; // 20 FPS

    const animate = (time: number) => {
      if (time - lastFrameTime < frameInterval) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = time;

      if (!ctx) return;

      // Clear canvas with slight trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      updateEyeState(time);
      drawEyeStructure(ctx, time);
      updateSynapses(time);
      updatePulses();
      drawConnections(ctx, time);
      drawSynapses(ctx, time);
      drawPulses(ctx);

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full opacity-60 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};