import React, { useState, useEffect } from 'react';
import { Stage } from '../types';

interface CreatureDisplayProps {
  stage: Stage;
  isThinking: boolean;
  color: string;
}

export const CreatureDisplay: React.FC<CreatureDisplayProps> = ({ stage, isThinking, color }) => {
  const [idleAnim, setIdleAnim] = useState('');

  useEffect(() => {
    if (isThinking) {
      setIdleAnim('');
      return;
    }

    // Randomly trigger a short idle animation
    const triggerIdle = () => {
      const animations = [
        'scale-110 brightness-110', // Excited pulse
        'scale-95 brightness-90',   // Breathing out
        'rotate-6',                 // Curious tilt right
        '-rotate-6',                // Curious tilt left
        'skew-x-2',                 // Subtle shift
      ];
      
      const selected = animations[Math.floor(Math.random() * animations.length)];
      setIdleAnim(selected);

      // Reset after short duration
      setTimeout(() => setIdleAnim(''), 600);
    };

    // Random interval between 3 and 8 seconds
    const timeoutId = setTimeout(triggerIdle, Math.random() * 5000 + 3000);

    return () => clearTimeout(timeoutId);
  }, [idleAnim, isThinking]);
  
  // Base classes for the SVG itself - handles specific idle transforms
  // animate-float is removed from here and moved to the wrapper
  const baseSvgClass = `glow-effect transition-all duration-500 ease-in-out ${idleAnim}`;

  const getShape = () => {
    switch (stage) {
      case Stage.EGG:
        return (
          <svg viewBox="0 0 100 100" className={`w-48 h-48 ${baseSvgClass}`}>
            <defs>
              <radialGradient id="eggGrad" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                <stop offset="0%" stopColor="#fff" />
                <stop offset="100%" stopColor={color} />
              </radialGradient>
            </defs>
            <ellipse cx="50" cy="50" rx="30" ry="40" fill="url(#eggGrad)" className="opacity-90" />
            <path d="M 35 40 L 45 50 L 35 60" stroke="rgba(0,0,0,0.2)" strokeWidth="2" fill="none" />
            <path d="M 65 40 L 55 50 L 65 60" stroke="rgba(0,0,0,0.2)" strokeWidth="2" fill="none" />
          </svg>
        );
      case Stage.BABY:
        return (
          <svg viewBox="0 0 100 100" className={`w-40 h-40 ${baseSvgClass}`}>
             <defs>
              <radialGradient id="babyGrad" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                <stop offset="0%" stopColor="#fff" />
                <stop offset="100%" stopColor={color} />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="30" fill="url(#babyGrad)" />
            {/* Eyes */}
            <circle cx="40" cy="45" r="4" fill="black" />
            <circle cx="60" cy="45" r="4" fill="black" />
            <circle cx="41" cy="43" r="1.5" fill="white" />
            <circle cx="61" cy="43" r="1.5" fill="white" />
            {/* Mouth */}
            <path d="M 45 55 Q 50 60 55 55" stroke="black" strokeWidth="2" fill="none" />
          </svg>
        );
      case Stage.ROOKIE:
        return (
          <svg viewBox="0 0 100 100" className={`w-48 h-48 ${baseSvgClass}`}>
            <path d="M 20 80 L 50 20 L 80 80 L 50 70 Z" fill={color} stroke="white" strokeWidth="2" />
            <circle cx="45" cy="50" r="5" fill="black" />
            <circle cx="55" cy="50" r="5" fill="black" />
             {/* Simple limbs */}
            <line x1="25" y1="75" x2="10" y2="85" stroke={color} strokeWidth="4" />
            <line x1="75" y1="75" x2="90" y2="85" stroke={color} strokeWidth="4" />
          </svg>
        );
      default:
        // Generic form for higher levels - becomes more complex geometrically
        return (
           <svg viewBox="0 0 100 100" className={`w-56 h-56 ${baseSvgClass}`}>
            <polygon points="50,10 90,40 70,90 30,90 10,40" fill={color} stroke="white" strokeWidth="1" className="opacity-80" />
            <polygon points="50,20 80,45 65,80 35,80 20,45" fill="rgba(255,255,255,0.3)" />
            <circle cx="40" cy="40" r="3" fill="#000" />
            <circle cx="60" cy="40" r="3" fill="#000" />
            <path d="M 30 10 L 10 5" stroke={color} strokeWidth="2" />
            <path d="M 70 10 L 90 5" stroke={color} strokeWidth="2" />
          </svg>
        );
    }
  };

  return (
    <div className="relative flex items-center justify-center h-64 w-full">
      {/* Wrapper handles the continuous float to avoid conflicting with idle transforms */}
      <div className="animate-float">
        {getShape()}
      </div>
      {isThinking && (
        <div className="absolute top-0 right-10 text-xs animate-pulse text-cyan-200">
          ...
        </div>
      )}
    </div>
  );
};