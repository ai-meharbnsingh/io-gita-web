import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const verses = [
  {
    sanskrit: 'सर्वभूतेषु येनैकं भावमव्ययमीक्षते |',
    type: 'sattvic',
    basin: 'Sattvic Knowledge',
    color: '#4A90D9',
  },
  {
    sanskrit: 'पृथक्त्वेन तु यज्ज्ञानं नानाभावान्पृथग्विधान् |',
    type: 'rajasic',
    basin: 'Rajasic Knowledge',
    color: '#D4A017',
  },
  {
    sanskrit: 'यत्तु कृत्स्नवदेकस्मिन्कार्ये सक्तमहैतुकम् |',
    type: 'tamasic',
    basin: 'Tamasic Knowledge',
    color: '#6B7280',
  },
];

export function CarvingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-24 sm:py-32 stone-texture">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[#B8860B] mono text-xs tracking-[0.3em] mb-4">THE CARVING</p>
          <h2 className="text-3xl sm:text-4xl carved-text text-[#C4A882]">
            What the Rishis Observed
          </h2>
          <p className="text-[#8B7355] mt-4">
            What physics confirms
          </p>
        </motion.div>
        
        {/* Stone tablet with verses */}
        <motion.div
          className="stone-tablet rounded-lg p-8 sm:p-12"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Circuit traces flowing from top */}
          <svg className="absolute -top-8 left-1/2 -translate-x-1/2 w-64 h-16" viewBox="0 0 256 64">
            {[0, 1, 2].map((i) => (
              <motion.path
                key={i}
                d={`M ${80 + i * 48} 0 L ${80 + i * 48} 32 L 128 64`}
                fill="none"
                stroke="#B8860B"
                strokeWidth="1"
                opacity="0.5"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : {}}
                transition={{ duration: 1.5, delay: i * 0.2 }}
              />
            ))}
          </svg>
          
          {/* Verses */}
          <div className="space-y-8">
            {verses.map((verse, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
              >
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  {/* Sanskrit */}
                  <div className="flex-1">
                    <p className="text-2xl sm:text-3xl text-[#C4A882] carved-text">
                      {verse.sanskrit}
                    </p>
                  </div>
                  
                  {/* Arrow */}
                  <div className="hidden sm:flex items-center">
                    <motion.svg
                      width="40"
                      height="20"
                      viewBox="0 0 40 20"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <line x1="0" y1="10" x2="35" y2="10" stroke="#B8860B" strokeWidth="1" />
                      <path d="M 30 5 L 38 10 L 30 15" fill="none" stroke="#B8860B" strokeWidth="1" />
                    </motion.svg>
                  </div>
                  
                  {/* Basin visualization */}
                  <motion.div
                    className="w-full sm:w-48 p-4 rounded border"
                    style={{ borderColor: `${verse.color}40` }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.6 + index * 0.2 }}
                  >
                    <p className="text-xs mono mb-2" style={{ color: verse.color }}>
                      {verse.basin.toUpperCase()}
                    </p>
                    <div className="h-16 relative">
                      <svg className="w-full h-full" viewBox="0 0 100 40">
                        <ellipse
                          cx="50"
                          cy="35"
                          rx="40"
                          ry="8"
                          fill={verse.color}
                          opacity="0.3"
                        />
                        <ellipse
                          cx="50"
                          cy="30"
                          rx="30"
                          ry="6"
                          fill={verse.color}
                          opacity="0.5"
                        />
                        <circle cx="50" cy="20" r="4" fill={verse.color} />
                      </svg>
                    </div>
                  </motion.div>
                </div>
                
                {/* Divider */}
                {index < verses.length - 1 && (
                  <div className="mt-8 h-px bg-gradient-to-r from-transparent via-[#B8860B]/30 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Bottom insight */}
        <motion.p
          className="text-center mt-12 text-[#8B7355]"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
        >
          The carved verses flow into circuit traces — ancient wisdom encoded in stone, 
          now readable by modern physics.
        </motion.p>
      </div>
    </section>
  );
}

export default CarvingSection;
