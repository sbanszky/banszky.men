import React, { useState, useEffect } from 'react';
import { IpMatrix } from './components/IpMatrix';
import { NetworkStats } from './components/NetworkStats';
import { SingleIpDisplay } from './components/SingleIpDisplay';
import { Terminal } from 'lucide-react';
import { FloatingIcons } from './components/FloatingIcons';
import { Ipv6Matrix } from './components/Ipv6Matrix';
import { BlueEyeBackground } from './components/BlueEyeBackground';
import { RainbowExplosion } from './components/RainbowExplosion';
import Header from './components/Header';

function App() {
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);
  const [isHovering, setIsHovering] = useState(false);
  const [showRainbow, setShowRainbow] = useState(false);
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
      <BlueEyeBackground />
      <Header />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center pt-24 px-4 pb-20 space-y-6">
        {!isLandscape ? (
          <>
            <IpMatrix />
            <Ipv6Matrix />
            <FloatingIcons />
            <RainbowExplosion trigger={showRainbow} />
            
            <div className="welcome-text text-center mb-8 px-4 w-full">
              <p className="text-lg font-mono leading-relaxed">
                Welcome!<br />
                This site is a fusion of AI and nearly 20 years of network engineering experience. Explore the ideas, tools, and experiments born from this unique collaboration.
              </p>
              <p className="tagline text-sm font-mono mt-2 opacity-80">
                It's me, reimagined by AI.
              </p>
              <a 
                href="https://subnetting.online"
                target="_blank"
                rel="noopener noreferrer"
                className="subnetting-text text-sm font-mono mt-2 block hover:text-[#00FF41]/80 transition-colors relative z-[100] pointer-events-auto cursor-pointer"
              >
                Master the art of subnetting
              </a>
            </div>

            <div className="flex flex-col items-center space-y-4 backdrop-blur-sm p-6 rounded-xl w-full max-w-md mx-auto">
              <div className="flex flex-col items-center mb-4">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-6 h-6" />
                  <h1 className="text-xl font-mono font-bold tracking-wider">
                    Status: Online.
                  </h1>
                </div>
              </div>
              <SingleIpDisplay />
              <NetworkStats />
              
              <div className="mt-6 group relative z-[9999]">
                <a 
                  href="https://bluecv.banszky.men" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block pointer-events-auto cursor-pointer bg-transparent relative z-[9999] 
                           w-14 h-14 border-2 border-[#00FF41] rounded-lg overflow-hidden
                           bg-black/50 backdrop-blur-sm transition-all duration-300
                           hover:border-[#00FF41]/80 hover:shadow-lg hover:shadow-[#00FF41]/20
                           flex items-center justify-center"
                  onMouseEnter={() => {
                    setIsHovering(true);
                    setShowRainbow(true);
                  }}
                  onMouseLeave={() => {
                    setIsHovering(false);
                    setShowRainbow(false);
                  }}
                >
                  <span className="text-3xl font-mono font-bold text-[#00FF41] pointer-events-none">
                    ?
                  </span>
                </a>
              </div>
            </div>

            <div className="fixed bottom-4 left-0 w-full text-center px-4 z-50">
              <p className="text-[#00FF41]/70 text-xs font-mono tracking-wider mb-1">
                Contact: <a href={`mailto:${email}`} className="rainbow-text">{email}</a>
              </p>
              <p className="text-[#00FF41]/70 text-xs font-mono tracking-wider">
                System Status: Operational | Last Update: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </>
        ) : (
          <>
            <IpMatrix />
            <Ipv6Matrix />
            <FloatingIcons />
            <RainbowExplosion trigger={showRainbow} />
            
            <div className="welcome-text text-center mb-8 px-4 max-w-2xl">
              <p className="text-xl lg:text-2xl font-mono leading-relaxed">
                Welcome!<br />
                This site is a fusion of AI and nearly 20 years of network engineering experience. Explore the ideas, tools, and experiments born from this unique collaboration.
              </p>
              <p className="tagline text-base font-mono mt-4 opacity-80">
                It's me, reimagined by AI.
              </p>
              <a 
                href="https://subnetting.online"
                target="_blank"
                rel="noopener noreferrer"
                className="subnetting-text text-base font-mono mt-4 block hover:text-[#00FF41]/80 transition-colors relative z-[100] pointer-events-auto cursor-pointer"
              >
                Master the art of subnetting
              </a>
            </div>

            <div className="flex flex-col items-center space-y-4 backdrop-blur-sm p-8 rounded-xl w-full max-w-md mx-auto">
              <div className="flex flex-col items-center mb-4">
                <div className="flex items-center space-x-3">
                  <Terminal className="w-8 h-8" />
                  <h1 className="text-3xl font-mono font-bold tracking-wider">
                    Status: Online.
                  </h1>
                </div>
              </div>
              <SingleIpDisplay />
              <NetworkStats />
              
              <div className="mt-8 group relative z-[9999]">
                <a 
                  href="https://bluecv.banszky.men" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block pointer-events-auto cursor-pointer bg-transparent relative z-[9999]
                           w-16 h-16 border-2 border-[#00FF41] rounded-lg overflow-hidden
                           bg-black/50 backdrop-blur-sm transition-all duration-300
                           hover:border-[#00FF41]/80 hover:shadow-lg hover:shadow-[#00FF41]/20
                           flex items-center justify-center"
                  onMouseEnter={() => {
                    setIsHovering(true);
                    setShowRainbow(true);
                  }}
                  onMouseLeave={() => {
                    setIsHovering(false);
                    setShowRainbow(false);
                  }}
                >
                  <span className="text-4xl font-mono font-bold text-[#00FF41] pointer-events-none">
                    ?
                  </span>
                </a>
              </div>
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center w-full px-4 z-50">
              <p className="text-[#00FF41]/70 text-sm font-mono tracking-wider mb-2">
                Contact: <a href={`mailto:${email}`} className="rainbow-text">{email}</a>
              </p>
              <p className="text-[#00FF41]/70 text-sm font-mono tracking-wider">
                System Status: Operational | Last Update: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black/40" />
    </div>
  );
}

export default App;
