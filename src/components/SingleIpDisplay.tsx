import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { generateRandomIp } from '../utils/ipGenerator';

export const SingleIpDisplay = () => {
  const [ip, setIp] = useState(generateRandomIp());

  useEffect(() => {
    const interval = setInterval(() => {
      setIp(generateRandomIp());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const ipParts = ip.split('.');

  return (
    <div className="flex flex-col items-center justify-center bg-black/40 p-3 md:p-4 rounded-2xl 
                    border border-[#00FF41]/30 backdrop-blur-md transform transition-all duration-500 
                    hover:border-[#00FF41] mb-4 md:mb-6 group shadow-lg shadow-[#00FF41]/10 
                    hover:shadow-[#00FF41]/20 w-full">
      <div className="flex items-center justify-center space-x-4">
        <div className="p-2 rounded-lg bg-[#00FF41]/5 group-hover:bg-[#00FF41]/10 
                      transition-colors duration-500">
          <Shield className="w-5 h-5 md:w-6 md:h-6 text-[#00FF41]" />
        </div>
        <div className="flex items-center space-x-1">
          {ipParts.map((part, index) => (
            <React.Fragment key={index}>
              <span className="text-[#00FF41] font-mono text-lg md:text-xl font-bold tracking-wider 
                             transition-all duration-300 hover:text-[#00FF41]/90">{part}</span>
              {index < ipParts.length - 1 && (
                <span className="text-[#00FF41]/70 text-lg md:text-xl">.</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
