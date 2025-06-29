import React, { useState, useEffect } from 'react';
import { IpMatrix } from './components/IpMatrix';
import { NetworkStats } from './components/NetworkStats';
import { SingleIpDisplay } from './components/SingleIpDisplay';
import { Terminal } from 'lucide-react';
import { FloatingIcons } from './components/FloatingIcons';
import { Ipv6Matrix } from './components/Ipv6Matrix';
import { GlobalInternet } from './components/GlobalInternet';
import { RainbowExplosion } from './components/RainbowExplosion';
import { AIBackground } from './components/AIBackground';
import Header from './components/Header';

function App() {
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);
  const [isHovering, setIsHovering] = useState(false);
  const email = 's@banszky.men';

  useEffect(() => {
    const handleOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    window.addEventListener('resize', handleOrientation);
    window.addEventListener('orientationchange', handleOrientation);

    return () => {
      window.removeEventListener('resize', handleOrientation);
      window.removeEventListener('orientationchange', handleOrientation);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-[#00FF41] overflow-hidden">
      <AIBackground />
      <Header />
      <GlobalInternet />
      <IpMatrix />
      <Ipv6Matrix />
      <FloatingIcons />
      <RainbowExplosion trigger={true} />
      
      {!isLandscape && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <p className="text-[#00FF41] text-xl md:text-2xl font-mono text-center animate-pulse">
            Rotate the screen for best experience
          </p>
        </div>
      )}
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 space-y-6 md:space-y-8">
        <div className="welcome-text text-center mb-8 px-4 max-w-2xl">
          <p className="text-lg md:text-xl lg:text-2xl font-mono leading-relaxed">
            Welcome!<br />
            This site is a fusion of AI and nearly 20 years of network engineering experience. Explore the ideas, tools, and experiments born from this unique collaboration.
          </p>
          <p className="tagline text-sm md:text-base font-mono mt-4 opacity-80">
            It's me, reimagined by AI.
          </p>
          <a 
            href="mailto:s@banszky.men"
            target="_blank"
            rel="noopener noreferrer"
            className="subnetting-text text-sm md:text-base font-mono mt-4 block"
          >
            Master the art of subnetting
          </a>
        </div>

        <div className="flex flex-col items-center space-y-4 backdrop-blur-sm p-4 md:p-8 rounded-xl w-full max-w-md mx-auto">
          <div className="flex flex-col items-center mb-2 md:mb-4">
            <div className="flex items-center space-x-2 md:space-x-3">
              <Terminal className="w-6 h-6 md:w-8 md:h-8" />
              <h1 className="text-xl md:text-3xl font-mono font-bold tracking-wider">
                Status: Online.
              </h1>
            </div>
          </div>
          <SingleIpDisplay />
          <NetworkStats />
          
          <a 
            href="mailto:s@banszky.men" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mt-8 group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="relative">
              <div className="w-16 h-16 border-2 border-[#00FF41] rounded-lg overflow-hidden
                            bg-black/50 backdrop-blur-sm transition-all duration-300
                            group-hover:border-[#00FF41]/80 group-hover:shadow-lg
                            group-hover:shadow-[#00FF41]/20">
                <div className={`text-4xl font-mono font-bold text-[#00FF41] 
                               flex items-center justify-center w-full h-full
                               transition-all duration-500 transform
                               ${isHovering ? '-translate-y-full' : 'translate-y-0'}`}>
                  ?
                </div>
                <div className={`absolute inset-0 text-4xl font-mono font-bold text-[#00FF41]
                                flex items-center justify-center transform transition-all duration-500
                                ${isHovering ? 'translate-y-0' : 'translate-y-full'}`}>
                  ?
                </div>
              </div>
            </div>
          </a>
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center w-full px-4">
          <p className="text-[#00FF41]/70 text-xs md:text-sm font-mono tracking-wider mb-2">
            Contact: <span className="rainbow-text">{email}</span>
          </p>
          <p className="text-[#00FF41]/70 text-xs md:text-sm font-mono tracking-wider">
            System Status: Operational | Last Update: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/0 via-black/20 to-black/40" />
    </div>
  );
}

export default App;