import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export function ScienceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-24 sm:py-32 parchment-texture">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[#8B7355] mono text-xs tracking-[0.3em] mb-4">THE SCIENCE</p>
          <h2 className="text-3xl sm:text-4xl handwritten text-[#1a1a2e]">
            Research Notebook
          </h2>
        </motion.div>
        
        {/* Notebook page */}
        <motion.div
          className="relative p-8 sm:p-12 bg-[#FFFEF8] border border-[#8B7355]/20 rounded-lg"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                transparent,
                transparent 31px,
                #E8E0D4 31px,
                #E8E0D4 32px
              )
            `,
            backgroundSize: '100% 32px',
            lineHeight: '32px',
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Margin line */}
          <div className="absolute left-16 top-8 bottom-8 w-px bg-[#FF6B6B]/30" />
          
          {/* Red margin text */}
          <div className="absolute left-4 top-8 text-[#FF6B6B]/40 text-xs handwritten transform -rotate-90 origin-left">
            CONFIDENTIAL
          </div>
          
          {/* Content */}
          <div className="pl-12 space-y-8">
            {/* Date */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
            >
              <p className="text-[#8B7355] text-sm handwritten">March 2026</p>
            </motion.div>
            
            {/* Main finding */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              <p className="text-[#1a1a2e] handwritten text-lg">
                <span className="line-through text-[#8B7355]/50">Hypothesis: Consciousness patterns are stochastic</span>
              </p>
              <p className="text-[#B8860B] handwritten text-lg ml-4">
                Result: 120/120 escape predictions correct. Deterministic dynamics confirmed.
              </p>
            </motion.div>
            
            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
            >
              <div className="text-center">
                <p className="text-2xl mono text-[#B8860B]">120/120</p>
                <p className="text-xs text-[#8B7355]">Predictions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl mono text-[#B8860B]">R²=0.68</p>
                <p className="text-xs text-[#8B7355]">Fit</p>
              </div>
              <div className="text-center">
                <p className="text-2xl mono text-[#B8860B]">p&lt;0.001</p>
                <p className="text-xs text-[#8B7355]">Significance</p>
              </div>
              <div className="text-center">
                <p className="text-2xl mono text-[#B8860B]">3</p>
                <p className="text-xs text-[#8B7355]">AI Reviews</p>
              </div>
            </motion.div>
            
            {/* Crossed out note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.9 }}
            >
              <p className="text-[#8B7355] handwritten text-sm">
                <span className="line-through">Need to check if this is just astrology rebranded</span>
              </p>
              <p className="text-[#1a1a2e] handwritten text-sm ml-4">
                → It's not. The math is solid. The Gita's framework maps to real attractor basins.
              </p>
            </motion.div>
            
            {/* Equation scribble */}
            <motion.div
              className="py-4"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1.1 }}
            >
              <p className="mono text-sm text-[#4a4a5e]">
                dQ/dt = -Q + tanh(β·W·Q) + α·F
              </p>
              <p className="text-xs text-[#8B7355] handwritten mt-1">
                * This is the actual ODE we integrate. 10,000 dimensions. No shortcuts.
              </p>
            </motion.div>
          </div>
          
          {/* Coffee stain */}
          <div className="absolute bottom-8 right-8 w-16 h-16 rounded-full border border-[#8B4513]/10 opacity-40" />
        </motion.div>
        
        {/* Trust statement */}
        <motion.p
          className="text-center mt-8 text-[#8B7355] handwritten italic"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.3 }}
        >
          Published 2026 · Peer-reviewed by 3 independent AI systems · Not wellness marketing
        </motion.p>
      </div>
    </section>
  );
}

export default ScienceSection;
