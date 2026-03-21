import { motion } from 'framer-motion';

interface CometTrajectoryProps {
  width?: number;
  height?: number;
  className?: string;
}

export function CometTrajectory({ width = 400, height = 200, className = '' }: CometTrajectoryProps) {
  // Generate a curved path through the starfield
  const pathD = `M 20 ${height * 0.7} Q ${width * 0.3} ${height * 0.2} ${width * 0.5} ${height * 0.5} T ${width * 0.8} ${height * 0.3}`;
  
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className}>
      <defs>
        {/* Comet trail gradient */}
        <linearGradient id="cometGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0" />
          <stop offset="50%" stopColor="#C9A84C" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#F0E6C8" stopOpacity="1" />
        </linearGradient>
        
        {/* Glow filter */}
        <filter id="cometGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Trail path */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="url(#cometGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        filter="url(#cometGlow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 3, ease: 'easeInOut' }}
      />
      
      {/* Comet head */}
      <motion.circle
        r="6"
        fill="#F0E6C8"
        filter="url(#cometGlow)"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 1, 1, 0],
          offsetDistance: ['0%', '100%', '100%', '100%'],
        }}
        transition={{
          duration: 4,
          times: [0, 0.7, 0.9, 1],
          ease: 'easeInOut',
        }}
        style={{
          offsetPath: `path('${pathD}')`,
        }}
      />
      
      {/* Destination marker */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 3, duration: 0.5 }}
      >
        <circle
          cx={width * 0.8}
          cy={height * 0.3}
          r="8"
          fill="none"
          stroke="#C9A84C"
          strokeWidth="1"
          opacity="0.6"
        />
        <circle
          cx={width * 0.8}
          cy={height * 0.3}
          r="4"
          fill="#C9A84C"
        />
      </motion.g>
    </svg>
  );
}

export default CometTrajectory;
