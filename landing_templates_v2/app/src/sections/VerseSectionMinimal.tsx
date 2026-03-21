import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export function VerseSectionMinimal() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-32 px-6">
      <div className="max-w-3xl mx-auto text-center">
        {/* Sanskrit verse */}
        <motion.p
          className="text-4xl sm:text-5xl md:text-6xl sanskrit-display text-[#1a1a1a] mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          सर्वभूतेषु येनैकं भावमव्ययमीक्षते
        </motion.p>
        
        {/* Translation */}
        <motion.p
          className="text-lg text-[#6b6b6b] mb-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          "That knowledge by which one sees one undivided imperishable reality in all beings"
        </motion.p>
        
        {/* Divider */}
        <div className="divider-subtle my-12" />
        
        {/* Energy landscape diagram */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <svg width="300" height="120" viewBox="0 0 300 120">
            {/* Baseline */}
            <line x1="20" y1="100" x2="280" y2="100" stroke="#e5e5e5" strokeWidth="1" />
            
            {/* Three basins */}
            <motion.path
              d="M 20 100 Q 50 40 80 100"
              fill="none"
              stroke="#4A90D9"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <motion.path
              d="M 110 100 Q 140 60 170 100"
              fill="none"
              stroke="#FF6B00"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 1, delay: 0.7 }}
            />
            <motion.path
              d="M 200 100 Q 230 50 260 100"
              fill="none"
              stroke="#6B7280"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 1, delay: 0.9 }}
            />
            
            {/* Labels */}
            <text x="50" y="115" textAnchor="middle" fill="#4A90D9" fontSize="10" fontFamily="Inter">Sattvic</text>
            <text x="140" y="115" textAnchor="middle" fill="#FF6B00" fontSize="10" fontFamily="Inter">Rajasic</text>
            <text x="230" y="115" textAnchor="middle" fill="#6B7280" fontSize="10" fontFamily="Inter">Tamasic</text>
          </svg>
        </motion.div>
        
        <motion.p
          className="text-sm text-[#9b9b9b] mt-6"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
        >
          The same concept. Two languages.
        </motion.p>
      </div>
    </section>
  );
}

export default VerseSectionMinimal;
