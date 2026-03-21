import { motion } from 'framer-motion';

interface StonePillarProps {
  height?: number;
  width?: number;
  className?: string;
  circuitIntensity?: number;
}

export function StonePillar({ height = 400, width = 80, className = '', circuitIntensity = 0.3 }: StonePillarProps) {
  return (
    <div 
      className={`relative ${className}`}
      style={{ width, height }}
    >
      {/* Pillar base */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-[#0a0a15] to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Main pillar body */}
      <div 
        className="absolute inset-0 temple-pillar rounded-sm"
        style={{
          background: `
            linear-gradient(90deg, 
              #1C1C28 0%, 
              #2a2a3a 15%, 
              #3a3a4a 50%, 
              #2a2a3a 85%, 
              #1C1C28 100%
            )
          `,
        }}
      >
        {/* Vertical circuit traces */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <filter id="pillarGlow">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Left trace */}
          <motion.line
            x1="20%"
            y1="10%"
            x2="20%"
            y2="90%"
            stroke="#B8860B"
            strokeWidth="1"
            opacity={circuitIntensity}
            filter="url(#pillarGlow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2 }}
          />
          
          {/* Right trace */}
          <motion.line
            x1="80%"
            y1="10%"
            x2="80%"
            y2="90%"
            stroke="#B8860B"
            strokeWidth="1"
            opacity={circuitIntensity}
            filter="url(#pillarGlow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.3 }}
          />
          
          {/* Horizontal connections */}
          {[0.2, 0.4, 0.6, 0.8].map((pos, i) => (
            <motion.line
              key={i}
              x1="20%"
              y1={`${pos * 100}%`}
              x2="80%"
              y2={`${pos * 100}%`}
              stroke="#B8860B"
              strokeWidth="0.5"
              opacity={circuitIntensity * 0.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
            />
          ))}
        </svg>
        
        {/* Carved patterns */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-12 border border-[#C4A882]/20 rounded-full" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 border border-[#C4A882]/20 rounded-full" />
      </div>
      
      {/* Pillar capital (top) */}
      <div 
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-[120%] h-6 
                   bg-gradient-to-b from-[#2a2a3a] to-[#1C1C28]
                   rounded-t-sm"
      />
    </div>
  );
}

export default StonePillar;
