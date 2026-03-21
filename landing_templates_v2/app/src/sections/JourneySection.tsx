import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { CometTrajectory } from '../components/observatory/CometTrajectory';

const steps = [
  {
    number: '01',
    title: 'Set Your Coordinates',
    description: '11 questions from the Gita\'s framework map your position in the consciousness space.',
    icon: 'coordinates',
  },
  {
    number: '02',
    title: 'Launch the Computation',
    description: '10,000-dimensional ODE integration traces your trajectory through the attractor landscape.',
    icon: 'launch',
  },
  {
    number: '03',
    title: 'Find Your Constellation',
    description: 'See which pattern basin your forces converge to — your place in the inner sky.',
    icon: 'constellation',
  },
];

export function JourneySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-24 sm:py-32">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[#6B4C9A] mono text-xs tracking-[0.3em] mb-4">YOUR JOURNEY</p>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#F0F0F0]">
            Three Steps to Your Star
          </h2>
        </motion.div>
        
        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="observatory-panel rounded-lg p-6 sm:p-8"
              initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
            >
              <div className="flex flex-col sm:flex-row items-start gap-6">
                {/* Number and icon */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full border border-[#C9A84C]/30 flex items-center justify-center">
                    {step.icon === 'coordinates' && (
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <circle cx="16" cy="16" r="3" stroke="#C9A84C" strokeWidth="1.5" />
                        <line x1="16" y1="4" x2="16" y2="10" stroke="#C9A84C" strokeWidth="1" />
                        <line x1="16" y1="22" x2="16" y2="28" stroke="#C9A84C" strokeWidth="1" />
                        <line x1="4" y1="16" x2="10" y2="16" stroke="#C9A84C" strokeWidth="1" />
                        <line x1="22" y1="16" x2="28" y2="16" stroke="#C9A84C" strokeWidth="1" />
                      </svg>
                    )}
                    {step.icon === 'launch' && (
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M16 4L20 14H12L16 4Z" fill="#C9A84C" />
                        <rect x="13" y="14" width="6" height="10" fill="#C9A84C" opacity="0.6" />
                        <path d="M10 24L16 28L22 24" stroke="#C9A84C" strokeWidth="1.5" fill="none" />
                      </svg>
                    )}
                    {step.icon === 'constellation' && (
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <circle cx="8" cy="12" r="2" fill="#C9A84C" />
                        <circle cx="16" cy="8" r="2" fill="#C9A84C" />
                        <circle cx="24" cy="12" r="2" fill="#C9A84C" />
                        <circle cx="16" cy="24" r="3" fill="#C9A84C" />
                        <line x1="8" y1="12" x2="16" y2="8" stroke="#C9A84C" strokeWidth="0.5" />
                        <line x1="16" y1="8" x2="24" y2="12" stroke="#C9A84C" strokeWidth="0.5" />
                        <line x1="8" y1="12" x2="16" y2="24" stroke="#C9A84C" strokeWidth="0.5" />
                        <line x1="24" y1="12" x2="16" y2="24" stroke="#C9A84C" strokeWidth="0.5" />
                      </svg>
                    )}
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-baseline gap-4 mb-2">
                    <span className="text-[#6B4C9A] mono text-sm">{step.number}</span>
                    <h3 className="text-xl font-serif text-[#F0F0F0]">{step.title}</h3>
                  </div>
                  <p className="text-[#9B9BB0]">{step.description}</p>
                </div>
                
                {/* Visual */}
                <div className="flex-shrink-0 w-32 h-16">
                  {step.icon === 'launch' && (
                    <CometTrajectory width={128} height={64} />
                  )}
                  {step.icon === 'constellation' && (
                    <div className="flex items-center justify-center h-full">
                      <motion.div
                        className="w-3 h-3 rounded-full bg-[#C9A84C]"
                        animate={{ 
                          boxShadow: [
                            '0 0 10px rgba(201, 168, 76, 0.5)',
                            '0 0 20px rgba(201, 168, 76, 0.8)',
                            '0 0 10px rgba(201, 168, 76, 0.5)',
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default JourneySection;
