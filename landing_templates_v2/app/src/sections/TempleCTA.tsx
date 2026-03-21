import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface TempleCTAProps {
  onEnter: () => void;
}

export function TempleCTA({ onEnter }: TempleCTAProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-24 sm:py-32 stone-texture">
      <div className="max-w-3xl mx-auto px-6 text-center">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[#B8860B] mono text-xs tracking-[0.3em] mb-4">THE THRESHOLD</p>
          <h2 className="text-3xl sm:text-4xl carved-text text-[#C4A882] mb-4">
            Enter the Temple
          </h2>
          <p className="text-[#8B7355] mb-12">
            The ancient stones await. The circuits are ready to awaken.
          </p>
        </motion.div>
        
        {/* Doorway */}
        <motion.div
          className="relative inline-block"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Doorway frame */}
          <div className="relative w-48 h-72 sm:w-64 sm:h-80">
            {/* Stone frame */}
            <div className="absolute inset-0 border-4 border-[#3a3a4a] rounded-t-full bg-[#1C1C28]" />
            
            {/* Inner glow */}
            <motion.div
              className="absolute inset-2 rounded-t-full doorway-glow"
              animate={{ 
                boxShadow: [
                  'inset 0 0 40px rgba(184, 134, 11, 0.2)',
                  'inset 0 0 60px rgba(184, 134, 11, 0.3)',
                  'inset 0 0 40px rgba(184, 134, 11, 0.2)',
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            {/* Circuit traces on doorway */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <motion.path
                d="M 20 100 L 20 30 Q 20 10 50 10 Q 80 10 80 30 L 80 100"
                fill="none"
                stroke="#B8860B"
                strokeWidth="0.5"
                opacity="0.5"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : {}}
                transition={{ duration: 2 }}
              />
            </svg>
            
            {/* Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.button
                onClick={onEnter}
                className="px-8 py-4 border border-[#B8860B] rounded-sm
                         bg-[#1C1C28]/80 text-[#C4A882] font-serif
                         hover:bg-[#B8860B]/20 hover:text-[#B8860B]
                         transition-all duration-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="block text-lg">Enter</span>
                <span className="block text-xs mono text-[#8B7355] mt-1">11 questions await</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
        
        {/* Bottom note */}
        <motion.p
          className="mt-12 text-xs text-[#5a5a6a] mono"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          The temple walls will transform as you progress — ancient becoming computational
        </motion.p>
      </div>
    </section>
  );
}

export default TempleCTA;
