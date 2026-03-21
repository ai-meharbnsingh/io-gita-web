import { motion } from 'framer-motion';

interface CircuitCarvingProps {
  width?: number;
  height?: number;
  className?: string;
  animate?: boolean;
}

export function CircuitCarving({ width = 400, height = 300, className = '', animate = true }: CircuitCarvingProps) {
  // Generate circuit-like paths that look like they emerge from carved text
  const generateTraces = () => {
    const traces = [];
    const numTraces = 8;
    
    for (let i = 0; i < numTraces; i++) {
      const startY = 50 + (i * 25);
      const path = `M 20 ${startY} 
                    Q 60 ${startY - 10} 100 ${startY} 
                    T 180 ${startY + 5}
                    T 260 ${startY - 5}
                    T ${width - 20} ${startY}`;
      
      traces.push(
        <motion.path
          key={i}
          d={path}
          className="circuit-trace"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={animate ? { pathLength: 1, opacity: 0.6 + (i % 3) * 0.15 } : {}}
          transition={{ duration: 2, delay: i * 0.2, ease: 'easeInOut' }}
        />
      );
      
      // Add circuit nodes
      const nodeX = 100 + (i % 4) * 60;
      traces.push(
        <motion.circle
          key={`node-${i}`}
          cx={nodeX}
          cy={startY}
          r="4"
          fill="#B8860B"
          initial={{ scale: 0 }}
          animate={animate ? { scale: 1 } : {}}
          transition={{ delay: 1 + i * 0.15, type: 'spring' }}
        />
      );
    }
    
    return traces;
  };

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`}
      className={`${className}`}
    >
      <defs>
        {/* Circuit glow filter */}
        <filter id="circuitGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* Gold gradient */}
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B6914" />
          <stop offset="50%" stopColor="#B8860B" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>
      </defs>
      
      {/* Background stone texture hint */}
      <rect 
        width={width} 
        height={height} 
        fill="#1C1C28" 
        opacity="0.5"
        rx="8"
      />
      
      {/* Circuit traces */}
      <g filter="url(#circuitGlow)">
        {generateTraces()}
      </g>
      
      {/* Vertical connecting lines */}
      {[40, 120, 200, 280].map((x, i) => (
        <motion.line
          key={`vert-${i}`}
          x1={x}
          y1="40"
          x2={x}
          y2={height - 40}
          stroke="url(#goldGradient)"
          strokeWidth="0.5"
          opacity="0.3"
          initial={{ pathLength: 0 }}
          animate={animate ? { pathLength: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.5 + i * 0.1 }}
        />
      ))}
      
      {/* Corner decorations (like carved stone) */}
      <motion.path
        d={`M 10 10 L 30 10 L 30 30 M ${width - 30} 10 L ${width - 10} 10 L ${width - 10} 30
            M 10 ${height - 30} L 10 ${height - 10} L 30 ${height - 10}
            M ${width - 30} ${height - 10} L ${width - 10} ${height - 10} L ${width - 10} ${height - 30}`}
        fill="none"
        stroke="#C4A882"
        strokeWidth="1"
        opacity="0.4"
        initial={{ pathLength: 0 }}
        animate={animate ? { pathLength: 1 } : {}}
        transition={{ duration: 1 }}
      />
    </svg>
  );
}

export default CircuitCarving;
