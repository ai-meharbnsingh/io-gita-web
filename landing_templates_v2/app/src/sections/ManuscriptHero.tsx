import { motion } from 'framer-motion';
import { WaxSeal } from '../components/manuscript/WaxSeal';

interface ManuscriptHeroProps {
  onOpenManuscript: () => void;
}

export function ManuscriptHero({ onOpenManuscript }: ManuscriptHeroProps) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center parchment-texture aged-edges overflow-hidden">
      {/* Devanagari watermark */}
      <div className="devanagari-watermark top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        अ
      </div>
      
      {/* Aged paper overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(139, 69, 19, 0.05) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(139, 69, 19, 0.03) 0%, transparent 50%)
          `,
        }}
      />
      
      {/* Coffee stain decorations */}
      <div className="absolute top-20 right-20 w-32 h-32 rounded-full border-2 border-[#8B4513]/10 opacity-50" />
      <div className="absolute bottom-32 left-16 w-24 h-24 rounded-full border border-[#8B4513]/5 opacity-30" />
      
      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        {/* Decorative top line */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: '100%' }}
          transition={{ duration: 1.5 }}
        >
          <div className="h-px bg-[#8B7355]/30 flex-1 max-w-[100px]" />
          <span className="text-[#8B7355] text-xs tracking-[0.3em] mono">ANCIENT TEXT · MODERN PHYSICS</span>
          <div className="h-px bg-[#8B7355]/30 flex-1 max-w-[100px]" />
        </motion.div>
        
        {/* Title */}
        <motion.h1
          className="text-6xl sm:text-7xl md:text-8xl handwritten text-[#1a1a2e] mb-6 ink-bleed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          io-gita
        </motion.h1>
        
        {/* ODE Equation (hidden in plain sight) */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <p className="mono text-sm text-[#8B7355] tracking-wider mb-2">
            THE DYNAMICS OF CONSCIOUSNESS
          </p>
          <p className="mono text-lg text-[#B8860B]">
            dQ/dt = -Q + tanh(β·W·Q) + α·F
          </p>
        </motion.div>
        
        {/* Tagline */}
        <motion.p
          className="text-xl sm:text-2xl handwritten text-[#4a4a5e] mb-12 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          "The oldest map of consciousness.<br />
          The newest physics to read it."
        </motion.p>
        
        {/* Wax seal CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2, type: 'spring' }}
        >
          <WaxSeal onClick={onOpenManuscript} size={100}>
            <div className="text-white text-center">
              <span className="block text-xs tracking-widest opacity-80">OPEN</span>
              <span className="block text-[10px] tracking-wider opacity-60">THE</span>
              <span className="block text-xs tracking-widest opacity-80">MANUSCRIPT</span>
            </div>
          </WaxSeal>
        </motion.div>
        
        {/* Bottom note */}
        <motion.p
          className="mt-12 text-xs text-[#8B7355] mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          Based on Bhagavad Gita Chapter 18 · 10,000-dimensional Hopfield networks
        </motion.p>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <div className="scroll-hint text-[#8B7355]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}

export default ManuscriptHero;
