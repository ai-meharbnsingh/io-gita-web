import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const pillars = [
  {
    sanskrit: 'प्रकृति',
    name: 'Prakriti',
    subtitle: 'The Landscape',
    description: '60 patterns carved into 10,000 dimensions by the rules of the Gita.',
    visual: 'landscape',
  },
  {
    sanskrit: 'गुण',
    name: 'Guna',
    subtitle: 'The Forces',
    description: 'Sattva lifts. Rajas drives. Tamas binds. Your answers set the direction.',
    visual: 'forces',
  },
  {
    sanskrit: 'गति',
    name: 'Gati',
    subtitle: 'The Trajectory',
    description: 'The physics decides where you land. Not an algorithm. Not AI. Dynamics.',
    visual: 'trajectory',
  },
];

export function ThreePillarsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-24 sm:py-32 parchment-texture">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[#8B7355] mono text-xs tracking-[0.3em] mb-4">THE FRAMEWORK</p>
          <h2 className="text-3xl sm:text-4xl handwritten text-[#1a1a2e]">
            Three Pillars of Understanding
          </h2>
        </motion.div>
        
        {/* Pillars grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.name}
              className="relative group"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
            >
              <div className="p-8 border border-[#8B7355]/20 rounded-lg bg-[#F5F0E8]/60 
                            hover:bg-[#F5F0E8] hover:border-[#B8860B]/40 
                            transition-all duration-500 h-full">
                {/* Sanskrit */}
                <p className="text-3xl handwritten text-[#B8860B] mb-2">{pillar.sanskrit}</p>
                
                {/* Name */}
                <h3 className="text-xl handwritten text-[#1a1a2e] mb-1">{pillar.name}</h3>
                
                {/* Subtitle */}
                <p className="text-sm mono text-[#8B7355] tracking-wider mb-6">
                  — {pillar.subtitle} —
                </p>
                
                {/* Visual representation */}
                <div className="h-24 mb-6 flex items-center justify-center">
                  {pillar.visual === 'landscape' && (
                    <svg viewBox="0 0 100 60" className="w-full h-full">
                      <motion.path
                        d="M 0 50 Q 25 20 50 35 T 100 25"
                        fill="none"
                        stroke="#B8860B"
                        strokeWidth="1"
                        initial={{ pathLength: 0 }}
                        animate={isInView ? { pathLength: 1 } : {}}
                        transition={{ duration: 2, delay: 0.5 + index * 0.3 }}
                      />
                      <motion.path
                        d="M 0 55 Q 25 30 50 45 T 100 35"
                        fill="none"
                        stroke="#8B7355"
                        strokeWidth="0.5"
                        opacity="0.5"
                        initial={{ pathLength: 0 }}
                        animate={isInView ? { pathLength: 1 } : {}}
                        transition={{ duration: 2, delay: 0.7 + index * 0.3 }}
                      />
                      {/* Basin markers */}
                      <circle cx="25" cy="28" r="3" fill="#4A90D9" opacity="0.6" />
                      <circle cx="50" cy="38" r="3" fill="#D4A017" opacity="0.6" />
                      <circle cx="75" cy="30" r="3" fill="#6B7280" opacity="0.6" />
                    </svg>
                  )}
                  {pillar.visual === 'forces' && (
                    <svg viewBox="0 0 100 60" className="w-full h-full">
                      {/* Sattva - upward */}
                      <motion.line
                        x1="30" y1="50" x2="30" y2="20"
                        stroke="#4A90D9"
                        strokeWidth="2"
                        markerEnd="url(#arrowup)"
                        initial={{ pathLength: 0 }}
                        animate={isInView ? { pathLength: 1 } : {}}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                      {/* Rajas - horizontal */}
                      <motion.line
                        x1="20" y1="40" x2="50" y2="40"
                        stroke="#D4A017"
                        strokeWidth="2"
                        markerEnd="url(#arrowright)"
                        initial={{ pathLength: 0 }}
                        animate={isInView ? { pathLength: 1 } : {}}
                        transition={{ duration: 1, delay: 0.7 }}
                      />
                      {/* Tamas - downward */}
                      <motion.line
                        x1="70" y1="20" x2="70" y2="50"
                        stroke="#6B7280"
                        strokeWidth="2"
                        markerEnd="url(#arrowdown)"
                        initial={{ pathLength: 0 }}
                        animate={isInView ? { pathLength: 1 } : {}}
                        transition={{ duration: 1, delay: 0.9 }}
                      />
                      <defs>
                        <marker id="arrowup" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                          <path d="M 0 6 L 3 0 L 6 6" fill="#4A90D9" />
                        </marker>
                        <marker id="arrowright" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                          <path d="M 0 0 L 6 3 L 0 6" fill="#D4A017" />
                        </marker>
                        <marker id="arrowdown" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                          <path d="M 0 0 L 3 6 L 6 0" fill="#6B7280" />
                        </marker>
                      </defs>
                    </svg>
                  )}
                  {pillar.visual === 'trajectory' && (
                    <svg viewBox="0 0 100 60" className="w-full h-full">
                      <motion.path
                        d="M 10 50 Q 30 45 40 30 T 70 25"
                        fill="none"
                        stroke="#00C9A7"
                        strokeWidth="2"
                        strokeDasharray="4,2"
                        initial={{ pathLength: 0 }}
                        animate={isInView ? { pathLength: 1 } : {}}
                        transition={{ duration: 2, delay: 0.5 }}
                      />
                      <motion.circle
                        cx="70"
                        cy="25"
                        r="4"
                        fill="#D4A017"
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : {}}
                        transition={{ delay: 2 }}
                      />
                    </svg>
                  )}
                </div>
                
                {/* Description */}
                <p className="text-[#4a4a5e] text-sm leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ThreePillarsSection;
