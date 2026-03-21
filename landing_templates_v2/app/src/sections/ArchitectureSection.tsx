import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { StonePillar } from '../components/temple/StonePillar';

const architectureItems = [
  {
    number: '8',
    label: 'Atoms',
    description: 'DHARMA, SATYA, TYAGA, AHANKARA, ATMA, MOKSHA, KULA, RAJYA',
    sanskrit: 'अष्टावणवः',
  },
  {
    number: '60',
    label: 'Patterns',
    description: 'Compositions shown as temple relief panels',
    sanskrit: 'षष्टिः प्रतिरूपाणि',
  },
  {
    number: '10,000',
    label: 'Dimensions',
    description: 'The full computation space, visualized as infinite corridor',
    sanskrit: 'दशसहस्र प्रमाणानि',
  },
  {
    number: '1',
    label: 'Trajectory',
    description: 'Yours — uniquely computed through the landscape',
    sanskrit: 'एका गतिः',
  },
];

export function ArchitectureSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-24 sm:py-32 stone-texture overflow-hidden">
      {/* Background pillars */}
      <div className="absolute inset-0 flex justify-around opacity-20 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <StonePillar 
            key={i} 
            height={600} 
            width={60} 
            circuitIntensity={0.2 + i * 0.1}
          />
        ))}
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[#B8860B] mono text-xs tracking-[0.3em] mb-4">THE ARCHITECTURE</p>
          <h2 className="text-3xl sm:text-4xl carved-text text-[#C4A882]">
            The Temple's Structure
          </h2>
        </motion.div>
        
        {/* Architecture grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {architectureItems.map((item, index) => (
            <motion.div
              key={item.label}
              className="stone-tablet rounded-lg p-6 text-center relative overflow-hidden group"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              {/* Circuit background pattern */}
              <svg className="absolute inset-0 w-full h-full opacity-10 group-hover:opacity-20 transition-opacity">
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#B8860B" strokeWidth="0.5" />
                <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#B8860B" strokeWidth="0.5" />
                <circle cx="50%" cy="50%" r="20" fill="none" stroke="#B8860B" strokeWidth="0.5" />
              </svg>
              
              {/* Content */}
              <div className="relative z-10">
                <p className="text-4xl sm:text-5xl font-serif text-[#B8860B] mb-2">
                  {item.number}
                </p>
                <p className="text-lg text-[#C4A882] mb-1">{item.label}</p>
                <p className="text-xs text-[#6B4C9A] italic mb-3">{item.sanskrit}</p>
                <p className="text-sm text-[#8B7355]">{item.description}</p>
              </div>
              
              {/* Hover glow */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ boxShadow: 'inset 0 0 20px rgba(184, 134, 11, 0.1)' }}
              />
            </motion.div>
          ))}
        </div>
        
        {/* Infinite corridor visualization */}
        <motion.div
          className="mt-16 relative h-32 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[#8B7355] text-sm mono z-10 bg-[#1C1C28] px-4">
              10,000-dimensional computation corridor
            </p>
          </div>
          
          {/* Perspective lines */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="corridorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#B8860B" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#B8860B" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Vanishing point lines */}
            {[10, 30, 50, 70, 90].map((x, i) => (
              <motion.line
                key={i}
                x1={`${x}%`}
                y1="100%"
                x2="50%"
                y2="0"
                stroke="url(#corridorGrad)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : {}}
                transition={{ duration: 2, delay: 1 + i * 0.1 }}
              />
            ))}
          </svg>
        </motion.div>
      </div>
    </section>
  );
}

export default ArchitectureSection;
