import React, { useEffect, useState } from 'react';

const StatusOnline = () => {
  const [showText, setShowText] = useState(false);
  const [showRule, setShowRule] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowText(true), 1000);
    const timer2 = setTimeout(() => setShowRule(true), 2000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
      <div className="relative">
        <div
          className={`text-[#00FF41] text-2xl font-mono transition-all duration-1000 ${
            showText ? 'opacity-100' : 'opacity-0 translate-y-10'
          }`}
          style={{
            textShadow: '0 0 10px #00FF41, 0 0 20px #00FF41, 0 0 30px #00FF41'
          }}
        >
          Status: Online
        </div>
        <div
          className={`text-[#00FF41] text-lg font-mono mt-4 transition-all duration-1000 delay-500 ${
            showRule ? 'opacity-100' : 'opacity-0 translate-y-10'
          }`}
          style={{
            textShadow: '0 0 10px #00FF41, 0 0 20px #00FF41, 0 0 30px #00FF41'
          }}
        >
          best networking rule "There is no rule against the rule to change the rules."
        </div>
      </div>
    </div>
  );
};

export default StatusOnline;
