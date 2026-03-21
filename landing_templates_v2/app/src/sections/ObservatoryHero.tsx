import { motion } from 'framer-motion';
import { ConstellationMap, constellations } from '../components/observatory/ConstellationMap';

interface ObservatoryHeroProps {
  onFindConstellation: () => void;
}

export function ObservatoryHero({ onFindConstellation }: ObservatoryHeroProps) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background constellation rotation */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <motion.div
          className="w-[150vw] h-[150vw]"
          animate={{ rotate: 360 }}
          transition={{ duration: 200, repeat: Infinity, ease: 'linear' }}
        >
          <ConstellationMap width={1500} height={1500} />
        </motion.div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        {/* Label */}
        <motion.p
          className="text-[#6B4C9A] mono text-xs tracking-[0.3em] mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          THE ATLAS OF CONSCIOUSNESS
        </motion.p>
        
        {/* Title */}
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-serif gradient-gold mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          io-gita
        </motion.h1>
        
        {/* Tagline */}
        <motion.p
          className="text-xl sm:text-2xl text-[#B8B8D0] font-light mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Map your inner sky
        </motion.p>
        
        <motion.p
          className="text-[#6B6B8A] text-sm mono mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Every mind gravitates. We show you where.
        </motion.p>
        
        {/* Constellation preview */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <div className="observatory-panel rounded-lg p-6">
            <p className="text-[#6B4C9A] mono text-xs mb-4">22 NAMED PATTERNS</p>
            <div className="flex flex-wrap justify-center gap-2">
              {constellations.slice(0, 6).map((c, i) => (
                <motion.span
                  key={c.id}
                  className="px-3 py-1 text-xs text-[#C9A84C] border border-[#C9A84C]/30 rounded-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                >
                  {c.name}
                </motion.span>
              ))}
              <span className="px-3 py-1 text-xs text-[#6B6B8A]">+16 more</span>
            </div>
          </div>
        </motion.div>
        
        {/* CTA Button */}
        <motion.button
          onClick={onFindConstellation}
          className="group relative px-10 py-4 bg-transparent border border-[#C9A84C] text-[#C9A84C]
                   font-serif text-lg tracking-wider rounded-full overflow-hidden
                   transition-all duration-500 hover:text-[#050510]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="relative z-10">Find Your Constellation</span>
          <motion.div
            className="absolute inset-0 bg-[#C9A84C]"
            initial={{ scale: 0, borderRadius: '100%' }}
            whileHover={{ scale: 2, borderRadius: '0%' }}
            transition={{ duration: 0.4 }}
            style={{ originX: 0.5, originY: 0.5 }}
          />
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ boxShadow: '0 0 30px rgba(201, 168, 76, 0.4)' }}
          />
        </motion.button>
        
        {/* Stats */}
        <motion.div
          className="mt-12 flex justify-center gap-8 text-xs mono text-[#6B6B8A]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span>10,000 dimensions</span>
          <span>•</span>
          <span>60 patterns</span>
          <span>•</span>
          <span>0% noise</span>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-[#C9A84C]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default ObservatoryHero;
