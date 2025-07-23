import React, { useEffect, useState } from 'react';

interface FloatingIcon {
  x: number;
  y: number;
  opacity: number;
  scale: number;
  type: 'star' | 'hat';
  vibrationOffset: number;
  vibrationSpeed: number;
}

interface TextAnimation {
  visible: boolean;
  opacity: number;
  x: number;
  y: number;
  type: 'hacker' | 'ai';
}

export const FloatingIcons = () => {
  const [icon, setIcon] = useState<FloatingIcon | null>(null);
  const [textAnim, setTextAnim] = useState<TextAnimation>({
    visible: false,
    opacity: 0,
    x: 0,
    y: 0,
    type: 'hacker'
  });

  useEffect(() => {
    const createNewIcon = () => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const type = Math.random() < 0.5 ? 'star' : 'hat';
      
      setIcon({
        x,
        y,
        opacity: 1,
        scale: 1,
        type,
        vibrationOffset: Math.random() * Math.PI * 2,
        vibrationSpeed: 0.5 + Math.random() * 1.5
      });

      setTimeout(() => {
        const fadeInterval = setInterval(() => {
          setIcon(prev => {
            if (!prev || prev.opacity <= 0) {
              clearInterval(fadeInterval);
              if (prev) {
                setTextAnim({
                  visible: true,
                  opacity: 1,
                  x: prev.x,
                  y: prev.y,
                  type: prev.type === 'hat' ? 'hacker' : 'ai'
                });
                
                setTimeout(() => {
                  setTextAnim(t => ({ ...t, opacity: 0 }));
                  setTimeout(() => {
                    setTextAnim(t => ({ ...t, visible: false }));
                  }, 500);
                }, 1000);
              }
              return null;
            }
            return {
              ...prev,
              opacity: prev.opacity - 0.05,
              scale: prev.scale + 0.1
            };
          });
        }, 50);
      }, 7000);
    };

    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // Reduced frequency
        createNewIcon();
      }
    }, 8000); // Increased interval

    let animationFrame: number;
    const animate = () => {
      setIcon(prev => {
        if (!prev) return null;
        return {
          ...prev,
          vibrationOffset: prev.vibrationOffset + prev.vibrationSpeed * 0.01 // Reduced vibration speed
        };
      });
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  const iconLinks = {
    star: "https://www.credly.com/badges/ba1a0da5-339d-473c-b1f8-4a361c21ff37",
    hat: "https://www.credly.com/badges/9cbf36b1-602c-4255-9588-925259526527"
  };

  const size = 20;

  return (
    <>
      {icon && (
        <a
          href={iconLinks[icon.type]}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed z-20 cursor-pointer"
          style={{
            left: icon.x + Math.sin(icon.vibrationOffset) * 2,
            top: icon.y + Math.cos(icon.vibrationOffset * 1.3) * 2,
            transform: `translate(-50%, -50%) scale(${icon.scale})`,
            transition: 'transform 2s ease-out'
          }}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className={`${icon.type === 'hat' ? 'text-white' : 'text-[#00FF41]'}`}
            style={{
              opacity: icon.opacity,
              transition: 'opacity 2s ease-out, color 0.3s ease',
              filter: icon.type === 'hat' 
                ? 'drop-shadow(0 0 10px white) drop-shadow(0 0 20px white)'
                : 'drop-shadow(0 0 10px #00FF41) drop-shadow(0 0 20px #00FF41)'
            }}
          >
            {icon.type === 'star' ? (
              <polygon
                points="10,2 4,20 18,8 2,8 16,20"
                fill="currentColor"
              />
            ) : (
              <path
                d="M3 14 L8 6 L12 6 L17 14 L3 14"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            )}
          </svg>
        </a>
      )}

      {textAnim.visible && (
        <div
          className="fixed z-20 font-mono text-sm font-bold pointer-events-none"
          style={{
            left: textAnim.x,
            top: textAnim.y,
            transform: 'translate(-50%, -50%)',
            opacity: textAnim.opacity,
            transition: 'opacity 0.5s ease-out',
            textShadow: textAnim.type === 'hacker' 
              ? '0 0 10px rgba(255,255,255,0.5)'
              : '0 0 10px rgba(0,255,65,0.5)',
            pointerEvents: 'none',
            color: textAnim.type === 'hacker' ? 'white' : '#00FF41'
          }}
        >
          {textAnim.type === 'hacker' ? 'ethical hacker' : 'AI for Networking'}
        </div>
      )}
    </>
  );
};
