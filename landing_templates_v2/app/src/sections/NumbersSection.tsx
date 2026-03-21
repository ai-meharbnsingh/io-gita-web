import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const numbers = [
  { value: '10,000', label: 'Dimensions of the computation' },
  { value: '120/120', label: 'Prediction accuracy' },
  { value: '22', label: 'Named patterns of consciousness' },
];

export function NumbersSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-32 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 text-center">
          {numbers.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <p className="text-5xl sm:text-6xl heading-elegant text-[#1a1a1a] mb-3">
                {item.value}
              </p>
              <p className="text-sm text-[#6b6b6b] sans">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NumbersSection;
