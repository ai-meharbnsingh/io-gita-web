import { motion } from 'framer-motion';

interface MinimalHeroProps {
  onBegin: () => void;
}

export function MinimalHero({ onBegin }: MinimalHeroProps) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-3xl mx-auto text-center">
        {/* Title */}
        <motion.h1
          className="text-6xl sm:text-7xl md:text-8xl heading-elegant text-[#1a1a1a] mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          io-gita
        </motion.h1>
        
        {/* Tagline */}
        <motion.p
          className="text-xl sm:text-2xl text-[#6b6b6b] font-light mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Consciousness has shape. We compute it.
        </motion.p>
        
        {/* CTA */}
        <motion.button
          onClick={onBegin}
          className="saffron-btn px-10 py-4 rounded-full text-lg sans font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileTap={{ scale: 0.98 }}
        >
          Begin
        </motion.button>
        
        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-[#9b9b9b]"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10 4v12M4 10l6 6 6-6" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default MinimalHero;
