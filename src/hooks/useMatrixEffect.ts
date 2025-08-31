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

    let animationId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: Particle[] = [];
    const particleCount = 40; // Reduced from 80
    const maxConnections = 3; // Reduced from 5
    const learningRate = 0.001;
    const energyTransferRate = 0.03;
    const emotionalResonance = 0.1;
    const harmonyFactor = 0.1;

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.3 * (0.8 + Math.random() * 0.4);
      
      particles.push({
        x: canvas.width / 2 + Math.cos(angle) * radius,
        y: canvas.height / 2 + Math.sin(angle) * radius,
        vx: Math.cos(angle) * 0.2,
        vy: Math.sin(angle) * 0.2,
        radius,
        angle,
        speed: 0.0002 + Math.random() * 0.0005,
        intelligence: 0.3 + Math.random() * 0.7,
        energy: 0.4 + Math.random() * 0.6,
        connections: [],
        corners: Math.floor(Math.random() * 5) + 3,
        emotion: 0.4 + Math.random() * 0.6,
        empathy: 0.5 + Math.random() * 0.5,
        harmony: Math.random(),
        gentleness: 0.6 + Math.random() * 0.4
      });
    }

    // Establish connections
    particles.forEach((particle, i) => {
      const connections = new Set<number>();
      while (connections.size < maxConnections) {
        const target = Math.floor(Math.random() * particleCount);
        if (target !== i) connections.add(target);
      }
      particle.connections = Array.from(connections);
    });

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

    const drawStar = (x: number, y: number, radius: number, corners: number, rotation = 0) => {
      ctx.beginPath();
      for (let i = 0; i <= corners * 2; i++) {
        const r = i % 2 === 0 ? radius : radius * 0.6;
        const angle = (Math.PI * i) / corners + rotation;
        const px = x + Math.cos(angle) * r;
        const py = y + Math.sin(angle) * r;
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
    };

    let lastFrameTime = 0;
    const frameInterval = 100; // 10 FPS

    const drawParticles = (timestamp: number) => {
      if (timestamp - lastFrameTime < frameInterval) {
        animationId = requestAnimationFrame(drawParticles);
        return;
      }
      lastFrameTime = timestamp;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const timeOffset = timestamp * 0.0002;

      // Update particles
      particles.forEach((particle, i) => {
        const harmonyInfluence = Math.sin(timeOffset * particle.harmony);
        particle.angle += particle.speed * (1 + harmonyInfluence * harmonyFactor);
        particle.radius += Math.sin(timeOffset + particle.empathy * 2) * 0.2;
        
        // Simplified emotional updates
        particle.connections.forEach(targetIndex => {
          const target = particles[targetIndex];
          if (!target) return;
          
          const emotionalDiff = target.emotion - particle.emotion;
          particle.emotion += emotionalDiff * emotionalResonance * particle.empathy * particle.gentleness;
          
          const energyDiff = target.energy - particle.energy;
          particle.energy += energyDiff * energyTransferRate * particle.intelligence * particle.gentleness;
        });

        particle.x = canvas.width / 2 + Math.cos(particle.angle) * particle.radius;
        particle.y = canvas.height / 2 + Math.sin(particle.angle) * particle.radius;

        // Draw simplified connections
        particle.connections.forEach(targetIndex => {
          const target = particles[targetIndex];
          if (!target) return;
          
          const distance = Math.hypot(target.x - particle.x, target.y - particle.y);
          const maxDistance = Math.min(canvas.width, canvas.height) * 0.3;

          if (distance < maxDistance) {
            const strength = (1 - distance / maxDistance) * 0.1;
            
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(target.x, target.y);
            ctx.strokeStyle = `rgba(147, 51, 234, ${strength})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });

        // Draw particle
        const particleSize = 1 + particle.energy * 2;
        const hue = (timeOffset * 10 + particle.emotion * 30) % 360;
        
        // Simplified glow
        const glow = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particleSize * 2
        );
        glow.addColorStop(0, `hsla(${hue}, 90%, 60%, ${0.3 * particle.energy})`);
        glow.addColorStop(1, 'hsla(0, 0%, 0%, 0)');

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particleSize * 2, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Draw shape based on emotion
        if (particle.emotion > 0.6) {
          drawHeart(particle.x, particle.y, particleSize * 1.5, particle.angle);
        } else {
          drawStar(particle.x, particle.y, particleSize, particle.corners, particle.angle);
        }
        
        ctx.fillStyle = `hsla(${hue}, 90%, 60%, ${0.6 * particle.energy})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(drawParticles);
    };

    animationId = requestAnimationFrame(drawParticles);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [canvasRef]);
};