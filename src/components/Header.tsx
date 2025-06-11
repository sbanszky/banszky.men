import React, { useEffect, useState } from 'react';

const Header = () => {
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowHeader(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed top-8 left-0 w-full z-[9999] text-center pointer-events-none">
      <div
        className={`text-xl font-mono transition-all duration-1000 ${
          showHeader ? 'opacity-100' : 'opacity-0 translate-y-10'
        }`}
      >
        <span className="text-[#00FF41]">best networking rule </span>
        <span className="rainbow-text">"There is no rule against the rule to change the rules."</span>
      </div>
    </div>
  );
};

export default Header;
