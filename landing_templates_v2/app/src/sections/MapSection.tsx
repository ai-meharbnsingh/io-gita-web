import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ConstellationMap, constellations } from '../components/observatory/ConstellationMap';

export function MapSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredConstellation, setHoveredConstellation] = useState<typeof constellations[0] | null>(null);

  return (
    <section ref={ref} className="relative py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[#6B4C9A] mono text-xs tracking-[0.3em] mb-4">THE MAP</p>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#F0F0F0] mb-4">
            The Atlas of Human Consciousness
          </h2>
          <p className="text-[#6B6B8A] max-w-2xl mx-auto">
            22 constellations. 3,540 possible transitions. Your forces determine which path you take.
          </p>
        </motion.div>
        
        {/* Interactive map */}
        <motion.div
          className="observatory-panel rounded-lg p-6 sm:p-8 mb-8"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <ConstellationMap 
            width={700} 
            height={350} 
            onHover={setHoveredConstellation}
          />
        </motion.div>
        
        {/* Info panel */}
        <motion.div
          className="grid md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Hover info */}
          <div className="observatory-panel rounded-lg p-6 min-h-[120px]">
            {hoveredConstellation ? (
              <motion.div
                key={hoveredConstellation.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-[#C9A84C] font-serif text-xl mb-1">
                  {hoveredConstellation.name}
                </p>
                <p className="text-[#6B4C9A] text-sm italic mb-3">
                  {hoveredConstellation.sanskrit}
                </p>
                <p className="text-[#9B9BB0] text-sm">
                  {hoveredConstellation.description}
                </p>
              </motion.div>
            ) : (
              <p className="text-[#6B6B8A] text-sm italic">
                Hover over a constellation to learn more...
              </p>
            )}
          </div>
          
          {/* Stats */}
          <div className="observatory-panel rounded-lg p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-serif text-[#C9A84C]">22</p>
                <p className="text-xs text-[#6B6B8A] mono">Patterns</p>
              </div>
              <div>
                <p className="text-2xl font-serif text-[#C9A84C]">3,540</p>
                <p className="text-xs text-[#6B6B8A] mono">Transitions</p>
              </div>
              <div>
                <p className="text-2xl font-serif text-[#C9A84C]">∞</p>
                <p className="text-xs text-[#6B6B8A] mono">Trajectories</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default MapSection;
