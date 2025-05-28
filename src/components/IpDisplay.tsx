import React from 'react';
import { Shield } from 'lucide-react';

interface IpDisplayProps {
  ip: string;
}

export const IpDisplay: React.FC<IpDisplayProps> = ({ ip }) => {
  const ipParts = ip.split('.');

  return (
    <div className="flex items-center space-x-2 bg-black/50 p-6 rounded-lg border border-[#00FF41]/30 
                    backdrop-blur-sm transform transition-all duration-300 hover:border-[#00FF41]/60">
      <Shield className="w-6 h-6 text-[#00FF41] animate-pulse" />
      <div className="flex space-x-2">
        {ipParts.map((part, index) => (
          <React.Fragment key={index}>
            <span className="text-[#00FF41] font-mono text-2xl font-bold">{part}</span>
            {index < ipParts.length - 1 && (
              <span className="text-[#00FF41]/70 text-2xl">.</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};