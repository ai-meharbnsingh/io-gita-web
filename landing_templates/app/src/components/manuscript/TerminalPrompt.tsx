import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface TerminalPromptProps {
  prompt: string;
  options: { key: string; text: string; type: 'sattvic' | 'rajasic' | 'tamasic' }[];
  onSelect: (type: 'sattvic' | 'rajasic' | 'tamasic', index: number) => void;
  delay?: number;
}

export function TerminalPrompt({ prompt, options, onSelect, delay = 0 }: TerminalPromptProps) {
  const [visibleChars, setVisibleChars] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  useEffect(() => {
    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleChars(prev => {
          if (prev >= prompt.length) {
            clearInterval(interval);
            setTimeout(() => setShowOptions(true), 300);
            return prev;
          }
          return prev + 1;
        });
      }, 30);
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(startTimer);
  }, [prompt, delay]);
  
  const handleSelect = (index: number, type: 'sattvic' | 'rajasic' | 'tamasic') => {
    setSelectedIndex(index);
    setTimeout(() => onSelect(type, index), 300);
  };
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sattvic': return '#4A90D9';
      case 'rajasic': return '#D4A017';
      case 'tamasic': return '#6B7280';
      default: return '#00FF41';
    }
  };

  return (
    <div className="font-mono">
      {/* Prompt line */}
      <div className="mb-4">
        <span className="text-[#00AA2A]">➜</span>
        <span className="text-[#00FF41] ml-2">{prompt.slice(0, visibleChars)}</span>
        {visibleChars < prompt.length && (
          <span className="text-[#00FF41] terminal-cursor" />
        )}
      </div>
      
      {/* Options */}
      <AnimatePresence>
        {showOptions && (
          <motion.div
            className="space-y-2 ml-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {options.map((option, index) => (
              <motion.button
                key={option.key}
                onClick={() => handleSelect(index, option.type)}
                className={`block w-full text-left px-4 py-2 rounded transition-all duration-200
                  ${selectedIndex === index ? 'bg-[#00FF41]/20' : 'hover:bg-[#00FF41]/10'}
                `}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                disabled={selectedIndex !== null}
              >
                <span 
                  className="mono font-bold mr-3"
                  style={{ color: getTypeColor(option.type) }}
                >
                  [{option.key}]
                </span>
                <span className={selectedIndex === index ? 'text-[#00FF41]' : 'text-[#00AA2A]'}>
                  {option.text}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Need to import AnimatePresence
import { AnimatePresence } from 'framer-motion';

export default TerminalPrompt;
