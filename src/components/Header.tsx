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
        <a 
          href="https://subnetting.online" 
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#00FF41] transition-colors duration-300 pointer-events-auto"
        >
          Master the art of subnetting
        </a>
        <span className="text-[#00FF41]"> "There is no rule against the rule to change the rules."</span>
      </div>
    </div>
  );
};

export default Header;
