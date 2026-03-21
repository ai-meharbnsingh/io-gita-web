import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkle: boolean;
  twinkleDelay: number;
}

interface StarfieldProps {
  starCount?: number;
  className?: string;
}

export function Starfield({ starCount = 200, className = '' }: StarfieldProps) {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: starCount }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      twinkle: Math.random() > 0.7,
      twinkleDelay: Math.random() * 3,
    }));
  }, [starCount]);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Background gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(26, 26, 62, 0.5) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(107, 76, 154, 0.15) 0%, transparent 40%),
            radial-gradient(ellipse at 20% 60%, rgba(26, 26, 62, 0.3) 0%, transparent 40%)
          `,
        }}
      />
      
      {/* Stars */}
      <svg className="absolute inset-0 w-full h-full">
        {stars.map((star, index) => (
          <motion.circle
            key={index}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.size}
            fill="#F0F0F0"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: star.twinkle 
                ? [star.opacity * 0.5, star.opacity, star.opacity * 0.5]
                : star.opacity 
            }}
            transition={{
              duration: star.twinkle ? 2 + Math.random() * 2 : 0,
              delay: star.twinkleDelay,
              repeat: star.twinkle ? Infinity : 0,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>
      
      {/* Nebula effect */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 30% 40%, rgba(107, 76, 154, 0.2) 0%, transparent 30%),
            radial-gradient(circle at 70% 60%, rgba(26, 26, 62, 0.3) 0%, transparent 35%)
          `,
        }}
      />
    </div>
  );
}

export default Starfield;
