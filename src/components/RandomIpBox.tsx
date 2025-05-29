import React, { useState, useEffect } from 'react';
import { generateRandomIp } from '../utils/ipGenerator';
import { IpDisplay } from './IpDisplay';

export const RandomIpBox = () => {
  const [ips, setIps] = useState<string[]>([]);

  useEffect(() => {
    const updateIps = () => {
      const newIps = Array(5).fill(0).map(() => generateRandomIp());
      setIps(newIps);
    };

    updateIps();
    const interval = setInterval(updateIps, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid gap-4">
      {ips.map((ip, index) => (
        <IpDisplay key={`${ip}-${index}`} ip={ip} />
      ))}
    </div>
  );
};
