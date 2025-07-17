import React, { useEffect, useState } from 'react';

const Header = () => {
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowHeader(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed top-4 left-0 w-full z-[9999] text-center pointer-events-none px-4">
      <div
        className={`text-sm md:text-base font-mono transition-all duration-1000 ${
          showHeader ? 'opacity-100' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="mb-2">
          <span className="text-[#00FF41]">It's me, reimagined by AI.</span>
        </div>
        <div className="mb-2">
          <a 
            href="https://subnetting.online" 
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto transition-colors duration-300"
            style={{
              background: 'linear-gradient(45deg, #3b82f6, #00FF41, #9333ea)',
              backgroundSize: '200% 200%',
              animation: 'colorShift 3s ease infinite',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent'
            }}
          >
            Master the art of subnetting
          </a>
        </div>
        <div>
          <span 
            className="rainbow-text"
            style={{
              background: 'linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #00ff00, #0080ff, #8000ff)',
              backgroundSize: '400% 400%',
              animation: 'rainbow-flow 2s linear infinite',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent'
            }}
          >
            "There is no rule against the rule to change the rules."
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
