import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

interface SanskritMathMorphProps {
  sanskrit: string;
  math: string;
  className?: string;
}

export function SanskritMathMorph({ sanskrit, math, className = '' }: SanskritMathMorphProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [showMath, setShowMath] = useState(false);
  
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setShowMath(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
      >
        {/* Sanskrit text */}
        <motion.p
          className="text-3xl sm:text-4xl md:text-5xl handwritten text-[#1a1a2e] text-center leading-relaxed"
          animate={{ 
            opacity: showMath ? 0.2 : 1,
            filter: showMath ? 'blur(2px)' : 'blur(0px)'
          }}
          transition={{ duration: 1.5 }}
        >
          {sanskrit}
        </motion.p>
        
        {/* Math equation (overlays) */}
        <motion.p
          className="absolute inset-0 flex items-center justify-center text-xl sm:text-2xl md:text-3xl mono text-[#B8860B]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={showMath ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          {math}
        </motion.p>
      </motion.div>
      
      {/* Label */}
      <motion.p
        className="text-center text-xs mono text-[#8B7355] mt-4"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 3 }}
      >
        {showMath ? 'The same truth, expressed in symbols' : 'Scroll to reveal the mathematics'}
      </motion.p>
    </div>
  );
}

export default SanskritMathMorph;
