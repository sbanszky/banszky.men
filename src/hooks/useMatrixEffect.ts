import { useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  angle: number;
  speed: number;
  intelligence: number;
  energy: number;
  connections: number[];
  corners: number;
  emotion: number;
  empathy: number;
  harmony: number;
  gentleness: number;
}

export const useMatrixEffect = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
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

    const particles: Particle[] = [];
    const particleCount = 80;
    const maxConnections = 5;
    const learningRate = 0.001; // Gentler learning
    const energyTransferRate = 0.05; // Softer energy transfer
    const emotionalResonance = 0.2; // More subtle emotional influence
    const harmonyFactor = 0.15; // Influence of harmony on movement

    // Draw heart shape with gentler curves
    const drawHeart = (x: number, y: number, size: number, rotation = 0) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.moveTo(0, size * 0.35);
      ctx.bezierCurveTo(
        size * 0.4, -size * 0.25,
        size * 0.8, size * 0.35,
        0, size * 0.9
      );
      ctx.bezierCurveTo(
        -size * 0.8, size * 0.35,
        -size * 0.4, -size * 0.25,
        0, size * 0.35
      );
      ctx.closePath();
      ctx.restore();
    };

    // Draw star shape with smooth corners
    const drawStar = (x: number, y: number, radius: number, corners: number, rotation = 0) => {
      ctx.beginPath();
      for (let i = 0; i <= corners * 2; i++) {
        const r = i % 2 === 0 ? radius : radius * 0.6; // Gentler point difference
        const angle = (Math.PI * i) / corners + rotation;
        const px = x + Math.cos(angle) * r;
        const py = y + Math.sin(angle) * r;
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          // Use quadratic curves for smoother corners
          const prevAngle = (Math.PI * (i - 1)) / corners + rotation;
          const prevR = (i - 1) % 2 === 0 ? radius : radius * 0.6;
          const prevX = x + Math.cos(prevAngle) * prevR;
          const prevY = y + Math.sin(prevAngle) * prevR;
          const cpX = x + Math.cos((prevAngle + angle) / 2) * (r * 0.9);
          const cpY = y + Math.sin((prevAngle + angle) / 2) * (r * 0.9);
          ctx.quadraticCurveTo(cpX, cpY, px, py);
        }
      }
      ctx.closePath();
    };

    // Initialize particles with gentle AI properties
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.4 * (0.85 + Math.random() * 0.3);
      
      particles.push({
        x: canvas.width / 2 + Math.cos(angle) * radius,
        y: canvas.height / 2 + Math.sin(angle) * radius,
        vx: Math.cos(angle) * 0.3,
        vy: Math.sin(angle) * 0.3,
        radius,
        angle,
        speed: 0.0003 + Math.random() * 0.0007, // Gentler movement
        intelligence: 0.3 + Math.random() * 0.7,
        energy: 0.4 + Math.random() * 0.6,
        connections: [],
        corners: Math.floor(Math.random() * 7) + 3,
        emotion: 0.4 + Math.random() * 0.6,
        empathy: 0.5 + Math.random() * 0.5,
        harmony: Math.random(),
        gentleness: 0.6 + Math.random() * 0.4
      });
    }

    // Establish harmonious connections
    particles.forEach((particle, i) => {
      const connections = new Set<number>();
      while (connections.size < maxConnections) {
        const target = Math.floor(Math.random() * particleCount);
        if (target !== i) connections.add(target);
      }
      particle.connections = Array.from(connections);
    });

    const drawParticles = (timestamp: number) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const timeOffset = timestamp * 0.0005; // Slower time progression

      // Update particle states with gentle AI behavior
      particles.forEach((particle, i) => {
        // Harmonious movement
        const harmonyInfluence = Math.sin(timeOffset * particle.harmony);
        particle.angle += particle.speed * (1 + harmonyInfluence * harmonyFactor);
        particle.radius += Math.sin(timeOffset + particle.empathy * 2) * 0.3;
        
        // Gentle emotional resonance
        particle.connections.forEach(targetIndex => {
          const target = particles[targetIndex];
          const emotionalDiff = target.emotion - particle.emotion;
          particle.emotion += emotionalDiff * emotionalResonance * particle.empathy * particle.gentleness;
          particle.empathy += learningRate * Math.abs(emotionalDiff) * particle.gentleness;
          
          const energyDiff = target.energy - particle.energy;
          particle.energy += energyDiff * energyTransferRate * particle.intelligence * particle.gentleness;
          particle.harmony = (particle.harmony + target.harmony) * 0.5;
        });

        // Update position with gentle intelligence
        particle.x = canvas.width / 2 + Math.cos(particle.angle) * particle.radius;
        particle.y = canvas.height / 2 + Math.sin(particle.angle) * particle.radius;

        // Draw gentle connections
        particle.connections.forEach(targetIndex => {
          const target = particles[targetIndex];
          const distance = Math.hypot(target.x - particle.x, target.y - particle.y);
          const maxDistance = Math.min(canvas.width, canvas.height) * 0.45;

          if (distance < maxDistance) {
            const emotionalBond = (particle.emotion + target.emotion) * 0.5;
            const strength = (1 - distance / maxDistance) * 
                           ((particle.intelligence + target.intelligence) * 0.5) *
                           emotionalBond * particle.gentleness;
            
            const gradient = ctx.createLinearGradient(
              particle.x, particle.y, target.x, target.y
            );

            // Soft, emotional colors
            const hue1 = (timeOffset * 15 + particle.emotion * 40) % 360;
            const hue2 = (hue1 + 40) % 360;
            
            gradient.addColorStop(0, `hsla(${hue1}, 90%, 60%, ${strength * 0.25})`);
            gradient.addColorStop(1, `hsla(${hue2}, 90%, 60%, ${strength * 0.25})`);

            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            
            // Create gentle curves for connections
            const midX = (particle.x + target.x) * 0.5;
            const midY = (particle.y + target.y) * 0.5;
            const curve = Math.sin(timeOffset + particle.harmony * Math.PI) * 15;
            const controlX = midX + Math.cos(particle.angle) * curve;
            const controlY = midY + Math.sin(particle.angle) * curve;
            
            ctx.quadraticCurveTo(controlX, controlY, target.x, target.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.5 + strength;
            ctx.stroke();
          }
        });

        // Draw particle with gentle transitions
        const particleSize = 1.5 + particle.energy * 2.5;
        const glowSize = particleSize * 2.5;
        
        const glow = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, glowSize
        );
        
        const hue = (timeOffset * 20 + particle.emotion * 40) % 360;
        glow.addColorStop(0, `hsla(${hue}, 90%, 60%, ${0.4 * particle.energy})`);
        glow.addColorStop(1, 'hsla(0, 0%, 0%, 0)');

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Smooth transition between heart and star based on emotion
        const transitionThreshold = 0.5;
        const transitionRange = 0.1;
        const emotionDistance = Math.abs(particle.emotion - transitionThreshold);
        const transitionFactor = Math.max(0, Math.min(1, 1 - emotionDistance / transitionRange));

        if (particle.emotion > transitionThreshold - transitionRange) {
          drawHeart(
            particle.x,
            particle.y,
            particleSize * (1.8 + transitionFactor * 0.4),
            particle.angle + timeOffset
          );
        }
        
        if (particle.emotion < transitionThreshold + transitionRange) {
          drawStar(
            particle.x,
            particle.y,
            particleSize * (1 + (1 - transitionFactor) * 0.4),
            particle.corners,
            particle.angle + timeOffset
          );
        }
        
        ctx.fillStyle = `hsla(${hue}, 90%, 60%, ${0.7 * particle.energy})`;
        ctx.fill();
      });

      // Gentle atmosphere effect
      const atmosphereGlow = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2,
        Math.min(canvas.width, canvas.height) * 0.25,
        canvas.width / 2, canvas.height / 2,
        Math.min(canvas.width, canvas.height) * 0.65
      );

      const pulseIntensity = 0.03 + Math.sin(timeOffset) * 0.015;
      atmosphereGlow.addColorStop(0, 'rgba(0, 255, 65, 0)');
      atmosphereGlow.addColorStop(0.5, `rgba(0, 255, 65, ${pulseIntensity})`);
      atmosphereGlow.addColorStop(1, 'rgba(0, 255, 65, 0)');

      ctx.fillStyle = atmosphereGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      requestAnimationFrame(drawParticles);
    };

    const animation = requestAnimationFrame(drawParticles);

    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [canvasRef]);
};