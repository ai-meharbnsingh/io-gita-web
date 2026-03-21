import { motion } from 'framer-motion';
import { useState } from 'react';

interface Constellation {
  id: string;
  name: string;
  sanskrit: string;
  description: string;
  stars: { x: number; y: number; size: number }[];
  connections: [number, number][];
}

const constellations: Constellation[] = [
  {
    id: 'soul-seeker',
    name: 'Soul Seeker',
    sanskrit: 'जिज्ञासु',
    description: 'Driven by authentic curiosity, seeking truth beyond appearances',
    stars: [
      { x: 20, y: 30, size: 3 },
      { x: 35, y: 25, size: 2 },
      { x: 50, y: 35, size: 4 },
      { x: 65, y: 28, size: 2 },
      { x: 80, y: 32, size: 3 },
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
  {
    id: 'karma-yogi',
    name: 'Karma Yogi',
    sanskrit: 'कर्मयोगी',
    description: 'Action without attachment, finding freedom in dedicated service',
    stars: [
      { x: 25, y: 40, size: 3 },
      { x: 40, y: 35, size: 2 },
      { x: 50, y: 50, size: 4 },
      { x: 60, y: 35, size: 2 },
      { x: 75, y: 40, size: 3 },
    ],
    connections: [[0, 2], [1, 2], [2, 3], [2, 4]],
  },
  {
    id: 'steady-sage',
    name: 'Steady Sage',
    sanskrit: 'स्थितप्रज्ञ',
    description: 'Equanimity in all circumstances, wisdom firmly established',
    stars: [
      { x: 30, y: 30, size: 3 },
      { x: 50, y: 25, size: 4 },
      { x: 70, y: 30, size: 3 },
      { x: 50, y: 50, size: 3 },
    ],
    connections: [[0, 1], [1, 2], [0, 3], [2, 3]],
  },
  {
    id: 'restless-mind',
    name: 'Restless Mind',
    sanskrit: 'चञ्चलचित्त',
    description: 'Constant motion, seeking yet never finding rest',
    stars: [
      { x: 20, y: 35, size: 2 },
      { x: 35, y: 25, size: 3 },
      { x: 45, y: 45, size: 2 },
      { x: 60, y: 30, size: 3 },
      { x: 75, y: 40, size: 2 },
      { x: 85, y: 25, size: 2 },
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]],
  },
  {
    id: 'blind-ruler',
    name: 'Blind Ruler',
    sanskrit: 'अन्धराज',
    description: 'Power without vision, leading others into darkness',
    stars: [
      { x: 30, y: 30, size: 4 },
      { x: 50, y: 20, size: 2 },
      { x: 70, y: 30, size: 3 },
      { x: 50, y: 50, size: 2 },
    ],
    connections: [[0, 1], [1, 2], [0, 3], [2, 3]],
  },
  {
    id: 'bound-soul',
    name: 'Bound Soul',
    sanskrit: 'बद्धात्मा',
    description: 'Trapped in cycles of confusion, unable to see the way forward',
    stars: [
      { x: 40, y: 25, size: 2 },
      { x: 60, y: 25, size: 2 },
      { x: 50, y: 45, size: 3 },
    ],
    connections: [[0, 2], [1, 2]],
  },
];

interface ConstellationMapProps {
  width?: number;
  height?: number;
  onHover?: (constellation: Constellation | null) => void;
  highlightedId?: string | null;
}

export function ConstellationMap({ 
  width = 800, 
  height = 400, 
  onHover,
  highlightedId = null 
}: ConstellationMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  const handleHover = (id: string | null) => {
    setHoveredId(id);
    onHover?.(id ? constellations.find(c => c.id === id) || null : null);
  };

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto"
    >
      <defs>
        {/* Glow filter */}
        <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* Gold gradient */}
        <radialGradient id="goldStar" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F0E6C8" />
          <stop offset="100%" stopColor="#C9A84C" />
        </radialGradient>
      </defs>
      
      {/* Render constellations */}
      {constellations.map((constellation, cIndex) => {
        const isHovered = hoveredId === constellation.id;
        const isHighlighted = highlightedId === constellation.id;
        const opacity = hoveredId && !isHovered ? 0.2 : 0.8;
        
        return (
          <motion.g
            key={constellation.id}
            initial={{ opacity: 0 }}
            animate={{ opacity }}
            transition={{ delay: cIndex * 0.1 }}
            onMouseEnter={() => handleHover(constellation.id)}
            onMouseLeave={() => handleHover(null)}
            className="cursor-pointer"
          >
            {/* Constellation lines */}
            {constellation.connections.map(([start, end], i) => (
              <motion.line
                key={i}
                x1={constellation.stars[start].x * width / 100}
                y1={constellation.stars[start].y * height / 100}
                x2={constellation.stars[end].x * width / 100}
                y2={constellation.stars[end].y * height / 100}
                stroke="#C9A84C"
                strokeWidth={isHovered || isHighlighted ? 1.5 : 0.5}
                opacity={isHovered || isHighlighted ? 0.8 : 0.4}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: cIndex * 0.1 + i * 0.05 }}
              />
            ))}
            
            {/* Stars */}
            {constellation.stars.map((star, i) => (
              <motion.circle
                key={i}
                cx={star.x * width / 100}
                cy={star.y * height / 100}
                r={isHovered || isHighlighted ? star.size * 1.3 : star.size}
                fill={isHovered || isHighlighted ? 'url(#goldStar)' : '#C9A84C'}
                filter="url(#starGlow)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: cIndex * 0.1 + i * 0.05, type: 'spring' }}
              />
            ))}
            
            {/* Label (only when hovered) */}
            {(isHovered || isHighlighted) && (
              <motion.g
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <text
                  x={constellation.stars[Math.floor(constellation.stars.length / 2)].x * width / 100}
                  y={Math.max(...constellation.stars.map(s => s.y)) * height / 100 + 25}
                  textAnchor="middle"
                  fill="#C9A84C"
                  fontSize="12"
                  fontFamily="Cormorant Garamond, serif"
                  fontWeight="500"
                >
                  {constellation.name}
                </text>
                <text
                  x={constellation.stars[Math.floor(constellation.stars.length / 2)].x * width / 100}
                  y={Math.max(...constellation.stars.map(s => s.y)) * height / 100 + 40}
                  textAnchor="middle"
                  fill="#6B4C9A"
                  fontSize="10"
                  fontFamily="Cormorant Garamond, serif"
                  fontStyle="italic"
                >
                  {constellation.sanskrit}
                </text>
              </motion.g>
            )}
          </motion.g>
        );
      })}
    </svg>
  );
}

export { constellations };
export default ConstellationMap;
