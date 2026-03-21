import { motion } from 'framer-motion';
import { CircuitCarving } from '../components/temple/CircuitCarving';

interface TempleHeroProps {
  onActivate: () => void;
}

export function TempleHero({ onActivate }: TempleHeroProps) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center stone-texture overflow-hidden">
      {/* Background pillars */}
      <div className="absolute inset-0 flex justify-between px-8 opacity-30 pointer-events-none">
        <motion.div
          className="w-16 h-full temple-pillar"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
        />
        <motion.div
          className="w-16 h-full temple-pillar"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.2 }}
        />
      </div>
      
      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        {/* Carved title */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl sm:text-7xl md:text-8xl carved-text text-[#C4A882]">
            io-gita
          </h1>
          
          {/* Circuit traces emerging from title */}
          <motion.div
            className="mt-4 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <CircuitCarving width={300} height={80} animate={true} />
          </motion.div>
        </motion.div>
        
        {/* Tagline */}
        <motion.p
          className="text-xl sm:text-2xl text-[#8B7355] mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Ancient circuits of consciousness
        </motion.p>
        
        <motion.p
          className="text-lg text-[#B8860B] mono mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          powered by modern physics
        </motion.p>
        
        {/* CTA Button - styled as carved stone with circuit */}
        <motion.button
          onClick={onActivate}
          className="group relative px-12 py-5 border-2 border-[#B8860B]/50 rounded-sm
                   bg-gradient-to-b from-[#2a2a3a] to-[#1C1C28]
                   text-[#C4A882] font-serif text-lg tracking-wider
                   hover:border-[#B8860B] transition-all duration-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Circuit pattern on button */}
          <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
            <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#B8860B" strokeWidth="1" />
            <circle cx="20%" cy="50%" r="3" fill="#B8860B" />
            <circle cx="80%" cy="50%" r="3" fill="#B8860B" />
          </svg>
          
          <span className="relative z-10 group-hover:text-[#B8860B] transition-colors">
            Activate the Circuit
          </span>
          
          {/* Glow effect */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ boxShadow: 'inset 0 0 30px rgba(184, 134, 11, 0.2)' }}
          />
        </motion.button>
        
        {/* Bottom stats */}
        <motion.div
          className="mt-12 flex justify-center gap-8 text-xs mono text-[#5a5a6a]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span>8 Atoms</span>
          <span>•</span>
          <span>60 Patterns</span>
          <span>•</span>
          <span>10,000 Dimensions</span>
        </motion.div>
      </div>
      
      {/* Floor gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a15] to-transparent pointer-events-none" />
    </section>
  );
}

export default TempleHero;
