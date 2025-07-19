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
    lookChangeTime: Date.now() + 1000
  });

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
      const baseRadius = Math.min(canvas.width, canvas.height) * 0.49; // Increased by 40% (0.35 * 1.4)

      synapsesRef.current = Array.from({ length: 60 }, (_, i) => {
        const angle = (i / 60) * Math.PI * 2;
        const radiusVariation = 0.7 + Math.random() * 0.6;
        const x = centerX + Math.cos(angle) * baseRadius * radiusVariation;
        const y = centerY + Math.sin(angle) * baseRadius * radiusVariation * 0.6; // Match eye shape

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
            if (distance < 180) {
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
      const baseRadius = Math.min(canvas.width, canvas.height) * 0.49; // Increased by 40% (0.35 * 1.4)
      const eyeRadiusX = baseRadius;
      const eyeRadiusY = baseRadius * 0.6;
      const eyeState = eyeStateRef.current;
      
      // Calculate blink effect
      let blinkScale = 1;
      if (eyeState.isBlinking) {
        // Create smooth blink animation (close and open)
        const blinkCurve = eyeState.blinkProgress < 0.5 
          ? eyeState.blinkProgress * 2 
          : (1 - eyeState.blinkProgress) * 2;
        blinkScale = 1 - (blinkCurve * 0.95); // Almost complete closure
      }
      
      const normalizedX = (x - centerX) / eyeRadiusX;
      const normalizedY = (y - centerY) / eyeRadiusY;
      
      return (normalizedX * normalizedX + normalizedY * normalizedY) <= 1;
    };

    const updateEyeState = (time: number) => {
      const eyeState = eyeStateRef.current;
      
      // Handle blinking
      if (!eyeState.isBlinking && time > eyeState.nextBlinkTime) {
        eyeState.isBlinking = true;
        eyeState.blinkProgress = 0;
      }
      
      if (eyeState.isBlinking) {
        eyeState.blinkProgress += 0.15; // Blink speed
        if (eyeState.blinkProgress >= 1) {
          eyeState.isBlinking = false;
          eyeState.blinkProgress = 0;
          // Schedule next blink (2-8 seconds)
          eyeState.nextBlinkTime = time + 2000 + Math.random() * 6000;
        }
      }
      
      // Handle looking around
      if (time > eyeState.lookChangeTime) {
        eyeState.lookDirection.x = (Math.random() - 0.5) * 0.6;
        eyeState.lookDirection.y = (Math.random() - 0.5) * 0.4;
        eyeState.lookChangeTime = time + 1500 + Math.random() * 3000;
      }
      
      // Smooth pupil movement
      const targetX = eyeState.lookDirection.x * 15;
      const targetY = eyeState.lookDirection.y * 10;
      eyeState.pupilX += (targetX - eyeState.pupilX) * 0.02;
      eyeState.pupilY += (targetY - eyeState.pupilY) * 0.02;
    };

    const drawEyeStructure = (ctx: CanvasRenderingContext2D, time: number) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = Math.min(canvas.width, canvas.height) * 0.49; // Increased by 40% (0.35 * 1.4)
      const eyeRadiusX = baseRadius;
      const eyeRadiusY = baseRadius * 0.6; // More natural eye shape

      // Outer eye glow
      const outerGlow = ctx.createRadialGradient(
        centerX, centerY, baseRadius * 0.3,
        centerX, centerY, baseRadius * 1.1
      );
      outerGlow.addColorStop(0, 'rgba(30, 144, 255, 0.12)');
      outerGlow.addColorStop(1, 'rgba(30, 144, 255, 0)');
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(1, (eyeRadiusY / eyeRadiusX) * blinkScale);
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 1.1, 0, Math.PI * 2);
      ctx.fillStyle = outerGlow;
      ctx.fill();
      ctx.restore();

      // Iris with dynamic patterns
      const irisRadius = baseRadius * 0.55;
      const iris = ctx.createRadialGradient(
        centerX, centerY, irisRadius * 0.2,
        centerX, centerY, irisRadius
      );
      
      const pulseIntensity = 0.8 + Math.sin(time * 0.003) * 0.2;
      iris.addColorStop(0, `rgba(135, 206, 250, ${pulseIntensity * 0.9})`);
      iris.addColorStop(0.2, `rgba(100, 149, 237, ${pulseIntensity * 0.8})`);
      iris.addColorStop(0.5, `rgba(65, 105, 225, ${pulseIntensity * 0.7})`);
      iris.addColorStop(0.8, `rgba(30, 144, 255, ${pulseIntensity * 0.6})`);
      iris.addColorStop(1, `rgba(0, 100, 200, ${pulseIntensity * 0.4})`);
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(1, (eyeRadiusY / eyeRadiusX) * blinkScale);
      ctx.beginPath();
      ctx.arc(0, 0, irisRadius, 0, Math.PI * 2);
      ctx.fillStyle = iris;
      ctx.fill();
      ctx.restore();

      // Pupil with subtle movement
      const pupilRadius = irisRadius * 0.35;
      const pupilOffsetX = eyeState.pupilX;
      const pupilOffsetY = eyeState.pupilY;
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(1, blinkScale);
      ctx.beginPath();
      ctx.arc(
        pupilOffsetX,
        pupilOffsetY,
        pupilRadius,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = 'rgba(0, 0, 30, 0.98)';
      ctx.fill();

      // Inner pupil reflection
      ctx.beginPath();
      ctx.arc(
        pupilOffsetX - pupilRadius * 0.25,
        pupilOffsetY - pupilRadius * 0.25,
        pupilRadius * 0.15,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = 'rgba(200, 230, 255, 0.6)';
      ctx.fill();
      ctx.restore();
      
      // Draw eyelids during blink
      if (eyeState.isBlinking && blinkScale < 0.3) {
        ctx.save();
        ctx.translate(centerX, centerY);
        
        // Upper eyelid
        ctx.beginPath();
        ctx.ellipse(0, -eyeRadiusY * (1 - blinkScale * 2), eyeRadiusX, eyeRadiusY * 0.3, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(20, 20, 40, 0.9)';
        ctx.fill();
        
        // Lower eyelid
        ctx.beginPath();
        ctx.ellipse(0, eyeRadiusY * (1 - blinkScale * 2), eyeRadiusX, eyeRadiusY * 0.3, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(20, 20, 40, 0.9)';
        ctx.fill();
        
        ctx.restore();
      }
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
          const baseRadius = Math.min(canvas.width, canvas.height) * 0.49; // Increased by 40% (0.35 * 1.4)
          const eyeRadiusX = baseRadius;
          const eyeRadiusY = baseRadius * 0.6;
          
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

      updateEyeState(time);
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
      className="fixed top-0 left-0 w-full h-full opacity-40 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};
