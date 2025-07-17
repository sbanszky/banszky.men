import React, { useState } from 'react';
import { RainbowExplosion } from './RainbowExplosion';

const QuestionBox = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [showRainbow, setShowRainbow] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
    setShowRainbow(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setShowRainbow(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[9999]">
      <a 
        href="https://bluecv.banszky.men" 
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-12 h-12 bg-black/50 rounded-full text-white text-2xl font-mono hover:bg-black/70 transition-colors duration-300 pointer-events-auto"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        ?
      </a>
      {showRainbow && <RainbowExplosion trigger={isHovering} />}
    </div>
  );
};

export default QuestionBox;
