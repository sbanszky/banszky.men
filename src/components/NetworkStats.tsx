import React from 'react';

const NetworkStats = () => {
  return (
    <div className="fixed bottom-4 left-0 w-full z-[9999] text-center pointer-events-none px-4">
      <div className="text-sm md:text-base font-mono text-[#00FF41]">
        It's me, reimagined by AI. <a 
          href="https://subnetting.online" 
          target="_blank"
          rel="noopener noreferrer"
          className="rainbow-text hover:text-[#00FF41] transition-colors duration-300 pointer-events-auto"
        >
          Master the art of subnetting
        </a>
      </div>
    </div>
  );
};

export default NetworkStats;
