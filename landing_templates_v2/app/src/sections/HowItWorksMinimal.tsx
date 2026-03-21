import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const steps = [
  'Answer 11 questions from the Bhagavad Gita Chapter 18.',
  'Your answers become forces in a 10,000-dimensional energy landscape.',
  'Physics — not AI — determines where you converge.',
];

interface HowItWorksMinimalProps {
  onBegin: () => void;
}

export function HowItWorksMinimal({ onBegin }: HowItWorksMinimalProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-32 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Section header */}
        <motion.p
          className="text-xs text-[#9b9b9b] sans tracking-wider mb-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          HOW IT WORKS
        </motion.p>
        
        {/* Steps */}
        <div className="space-y-6 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <span className="text-[#FF6B00] sans font-medium">{index + 1}</span>
              <p className="text-lg text-[#1a1a1a]">{step}</p>
            </motion.div>
          ))}
        </div>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <button
            onClick={onBegin}
            className="saffron-btn px-10 py-4 rounded-full text-lg sans font-medium"
          >
            Begin
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWorksMinimal;
