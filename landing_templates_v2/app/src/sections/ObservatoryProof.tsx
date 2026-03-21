import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export function ObservatoryProof() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-24 sm:py-32">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[#6B4C9A] mono text-xs tracking-[0.3em] mb-4">THE SCIENCE</p>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#F0F0F0] mb-4">
            Not Astrology. <span className="gradient-gold">Topology.</span>
          </h2>
        </motion.div>
        
        {/* Stats grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {[
            { value: '120/120', label: 'Predictions' },
            { value: 'R²=0.68', label: 'Transition Cost' },
            { value: '0%', label: 'Stochastic Noise' },
            { value: '2026', label: 'Published' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="observatory-panel rounded-lg p-6 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <p className="text-2xl sm:text-3xl font-serif gradient-gold mb-1">{stat.value}</p>
              <p className="text-xs text-[#6B6B8A] mono">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Explanation */}
        <motion.div
          className="observatory-panel rounded-lg p-6 sm:p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p className="text-[#9B9BB0] leading-relaxed mb-4">
            Unlike astrology, which relies on cosmic positions at birth, io-gita uses 
            <span className="text-[#C9A84C]"> deterministic physics</span> to map consciousness. 
            Your answers become force vectors in a 10,000-dimensional Hopfield attractor network. 
            The ODE integration reveals which basin your trajectory converges to — not based on 
            stars, but on the topology of your inner landscape.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-[#1a1a3e] rounded text-xs text-[#6B6B8A] mono">
              Hopfield Networks
            </span>
            <span className="px-3 py-1 bg-[#1a1a3e] rounded text-xs text-[#6B6B8A] mono">
              ODE Integration
            </span>
            <span className="px-3 py-1 bg-[#1a1a3e] rounded text-xs text-[#6B6B8A] mono">
              Attractor Dynamics
            </span>
            <span className="px-3 py-1 bg-[#1a1a3e] rounded text-xs text-[#6B6B8A] mono">
              Peer-Reviewed
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ObservatoryProof;
