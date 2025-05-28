import React, { useRef, useEffect } from 'react';

interface Neuron {
  x: number;
  y: number;
  connections: number[];
  activity: number;
  pulseOffset: number;
  happiness: number;
  intuition: number;
  empathy: number;
  joy: number;
}

export const NeuralNetwork = () => {
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

    // Create neurons with emotional properties
    const neurons: Neuron[] = Array(30).fill(null).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      connections: [],
      activity: Math.random(),
      pulseOffset: Math.random() * Math.PI * 2,
      happiness: 0.6 + Math.random() * 0.4, // High base happiness
      intuition: 0.5 + Math.random() * 0.5,
      empathy: 0.7 + Math.random() * 0.3,
      joy: 0.8 + Math.random() * 0.2
    }));

    // Establish intuitive connections
    neurons.forEach((neuron, i) => {
      for (let j = 0; j < neurons.length; j++) {
        if (i !== j && Math.random() < neuron.intuition * 0.5) {
          neuron.connections.push(j);
        }
      }
    });

    const animate = (time: number) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw connections with emotional influence
      neurons.forEach((neuron, i) => {
        neuron.pulseOffset += 0.02;
        neuron.activity = 0.5 + Math.sin(time * 0.001 + neuron.pulseOffset) * 0.5;

        // Joy influences connection brightness
        neuron.connections.forEach(j => {
          const target = neurons[j];
          const gradient = ctx.createLinearGradient(neuron.x, neuron.y, target.x, target.y);
          
          const emotionalBond = (neuron.happiness + target.happiness) * 0.5;
          const joyfulGlow = (neuron.joy + target.joy) * 0.5;
          const alpha = Math.min(neuron.activity, target.activity) * 0.15 * joyfulGlow;

          // Happiness influences color
          const hue = 120 + (emotionalBond * 40); // Shifts towards happy green
          gradient.addColorStop(0, `hsla(${hue}, 100%, 50%, ${alpha})`);
          gradient.addColorStop(1, `hsla(${hue + 30}, 100%, 50%, ${alpha})`);

          ctx.beginPath();
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1 + (joyfulGlow * 0.5);
          
          // Intuitive curved connections
          const midX = (neuron.x + target.x) * 0.5;
          const midY = (neuron.y + target.y) * 0.5;
          const intuitionCurve = Math.sin(time * 0.001 + neuron.intuition * Math.PI) * 20;
          
          ctx.moveTo(neuron.x, neuron.y);
          ctx.quadraticCurveTo(
            midX + intuitionCurve,
            midY - intuitionCurve,
            target.x,
            target.y
          );
          ctx.stroke();
        });

        // Draw neurons with emotional aura
        const glowSize = 20 + (neuron.happiness * 10);
        const glow = ctx.createRadialGradient(
          neuron.x, neuron.y, 0,
          neuron.x, neuron.y, glowSize
        );

        const joyColor = `rgba(0, ${155 + (neuron.joy * 100)}, 65, ${neuron.activity * 0.3})`;
        glow.addColorStop(0, joyColor);
        glow.addColorStop(1, 'rgba(0, 255, 65, 0)');

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(neuron.x, neuron.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Core of the neuron
        ctx.beginPath();
        ctx.arc(neuron.x, neuron.y, 3 + (neuron.happiness * 2), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, ${155 + (neuron.joy * 100)}, 65, ${neuron.activity})`;
        ctx.fill();
      });

      // Create a joyful atmosphere
      const atmosphereGlow = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2,
        Math.min(canvas.width, canvas.height) * 0.25,
        canvas.width / 2, canvas.height / 2,
        Math.min(canvas.width, canvas.height) * 0.65
      );

      const pulseIntensity = 0.03 + Math.sin(time * 0.001) * 0.015;
      atmosphereGlow.addColorStop(0, 'rgba(0, 255, 65, 0)');
      atmosphereGlow.addColorStop(0.5, `rgba(0, 255, 65, ${pulseIntensity})`);
      atmosphereGlow.addColorStop(1, 'rgba(0, 255, 65, 0)');

      ctx.fillStyle = atmosphereGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      requestAnimationFrame(animate);
    };

    const animation = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full opacity-30"
      style={{ zIndex: 0 }}
    />
  );
};