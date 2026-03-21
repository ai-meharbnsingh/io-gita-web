import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export function TempleProof() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-24 sm:py-32 stone-texture">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[#B8860B] mono text-xs tracking-[0.3em] mb-4">THE PROOF</p>
          <h2 className="text-3xl sm:text-4xl carved-text text-[#C4A882]">
            Carved in Stone
          </h2>
        </motion.div>
        
        {/* Proof tablet */}
        <motion.div
          className="stone-tablet rounded-lg p-8 sm:p-12 relative overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Circuit pattern overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-10">
            <rect x="5%" y="5%" width="90%" height="90%" fill="none" stroke="#B8860B" strokeWidth="1" />
            <circle cx="50%" cy="50%" r="30%" fill="none" stroke="#B8860B" strokeWidth="0.5" />
          </svg>
          
          <div className="relative z-10 text-center">
            {/* Main stat - in Devanagari numerals style */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4 }}
            >
              <p className="text-6xl sm:text-7xl font-serif text-[#B8860B] carved-text mb-2">
                १२०/१२०
              </p>
              <p className="text-2xl text-[#C4A882]">120/120</p>
              <p className="text-sm text-[#8B7355] mono mt-2">Predictions Correct</p>
            </motion.div>
            
            {/* Additional stats */}
            <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-[#B8860B]/20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
              >
                <p className="text-2xl text-[#4CAF50] mono">R² = 0.68</p>
                <p className="text-xs text-[#8B7355]">Correlation</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
              >
                <p className="text-2xl text-[#4CAF50] mono">p &lt; 0.001</p>
                <p className="text-xs text-[#8B7355]">Significance</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 }}
              >
                <p className="text-2xl text-[#4CAF50] mono">2026</p>
                <p className="text-xs text-[#8B7355]">Published</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Bottom note */}
        <motion.p
          className="text-center mt-8 text-[#8B7355] text-sm"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9 }}
        >
          These numbers are carved not in faith, but in verified computation.
        </motion.p>
      </div>
    </section>
  );
}

export default TempleProof;
