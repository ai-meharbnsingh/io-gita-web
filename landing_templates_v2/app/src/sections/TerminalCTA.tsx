import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface TerminalCTAProps {
  onCompute: () => void;
}

export function TerminalCTA({ onCompute }: TerminalCTAProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-24 sm:py-32 parchment-texture">
      <div className="max-w-3xl mx-auto px-6 text-center">
        {/* Transition indicator */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[#8B7355] mono text-xs tracking-[0.3em]">THE MANUSCRIPT AWAKENS</p>
        </motion.div>
        
        {/* Main text */}
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl handwritten text-[#1a1a2e] mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Every consciousness has a topology.
          <br />
          <span className="text-[#B8860B]">Yours is waiting.</span>
        </motion.h2>
        
        {/* Terminal-style CTA */}
        <motion.div
          className="inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <button
            onClick={onCompute}
            className="group relative px-8 py-4 bg-[#1a1a2e] rounded font-mono text-[#00FF41] 
                     hover:bg-[#2a2a3e] transition-colors duration-300"
          >
            <span className="flex items-center gap-3">
              <span className="text-[#00AA2A]">$</span>
              <span className="terminal-cursor">./compute --self</span>
            </span>
            
            {/* Glow effect */}
            <div className="absolute inset-0 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                 style={{ boxShadow: '0 0 20px rgba(0, 255, 65, 0.3)' }} />
          </button>
        </motion.div>
        
        {/* Subtle hint */}
        <motion.p
          className="mt-6 text-xs text-[#8B7355] mono"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          11 questions · 10,000 dimensions · 22 possible patterns
        </motion.p>
      </div>
    </section>
  );
}

export default TerminalCTA;
