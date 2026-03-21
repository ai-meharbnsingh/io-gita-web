import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

export function VerseSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [showMath, setShowMath] = useState(false);
  
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setShowMath(true), 2500);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  const verse = {
    sanskrit: 'सर्वभूतेषु येनैकं भावमव्ययमीक्षते |',
    transliteration: 'Sarva-bhūteṣu yenaikaṁ bhāvam avyayam īkṣate',
    translation: 'That knowledge by which one sees one undivided imperishable reality in all beings',
    math: '∇E(Q) = 0 → Q* = attractor basin',
  };

  return (
    <section ref={ref} className="relative py-24 sm:py-32 parchment-texture">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section label */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[#8B7355] mono text-xs tracking-[0.3em]">THE VERSE</p>
        </motion.div>
        
        {/* Main verse card */}
        <motion.div
          className="relative p-8 sm:p-12 border border-[#8B7355]/20 rounded-lg bg-[#F5F0E8]/80 aged-edges"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Handwritten verse number */}
          <div className="absolute -top-4 left-8 bg-[#F5F0E8] px-4">
            <span className="handwritten text-[#8B7355] text-sm">Gita 18.20</span>
          </div>
          
          {/* Sanskrit */}
          <div className="text-center mb-8 relative">
            <motion.p
              className="text-3xl sm:text-4xl md:text-5xl handwritten text-[#1a1a2e] leading-relaxed"
              animate={{ 
                opacity: showMath ? 0.15 : 1,
              }}
              transition={{ duration: 2 }}
            >
              {verse.sanskrit}
            </motion.p>
            
            {/* Math overlay */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={showMath ? { opacity: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.5 }}
            >
              <p className="mono text-xl sm:text-2xl text-[#B8860B]">
                {verse.math}
              </p>
            </motion.div>
          </div>
          
          {/* Transliteration */}
          <motion.p
            className="text-center text-[#8B7355] italic mb-6"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
          >
            {verse.transliteration}
          </motion.p>
          
          {/* Divider */}
          <motion.div
            className="flex items-center justify-center gap-4 my-8"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.7 }}
          >
            <div className="h-px bg-[#8B7355]/30 w-16" />
            <span className="text-[#8B7355] text-xs">✦</span>
            <div className="h-px bg-[#8B7355]/30 w-16" />
          </motion.div>
          
          {/* Translation */}
          <motion.p
            className="text-center text-lg text-[#4a4a5e] handwritten"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.9 }}
          >
            "{verse.translation}"
          </motion.p>
          
          {/* Annotation */}
          <motion.div
            className="absolute -right-4 top-1/4 w-32"
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 1.2 }}
          >
            <p className="text-[10px] text-[#8B7355] handwritten transform rotate-3">
              * The Rishis observed what physics now confirms: consciousness has topology
            </p>
          </motion.div>
        </motion.div>
        
        {/* Bottom insight */}
        <motion.p
          className="text-center mt-12 text-[#8B7355] handwritten text-lg italic"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5 }}
        >
          The text <span className="text-[#B8860B]">is</span> the math. The observation <span className="text-[#B8860B]">is</span> the equation.
        </motion.p>
      </div>
    </section>
  );
}

export default VerseSection;
