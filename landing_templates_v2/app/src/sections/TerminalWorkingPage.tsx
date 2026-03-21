import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, RotateCcw } from 'lucide-react';

interface TerminalWorkingPageProps {
  onBack: () => void;
}

interface Question {
  domain: string;
  domainSanskrit: string;
  prompt: string;
  options: { key: string; text: string; type: 'sattvic' | 'rajasic' | 'tamasic' }[];
}

const questions: Question[] = [
  {
    domain: 'Faith',
    domainSanskrit: 'श्रद्धा',
    prompt: 'How do you approach the unknown?',
    options: [
      { key: 'S', text: 'With curiosity and openness', type: 'sattvic' },
      { key: 'R', text: 'With a plan to control the outcome', type: 'rajasic' },
      { key: 'T', text: 'With avoidance or denial', type: 'tamasic' },
    ],
  },
  {
    domain: 'Food',
    domainSanskrit: 'आहार',
    prompt: 'What guides your consumption?',
    options: [
      { key: 'S', text: 'Balance, clarity, and gratitude', type: 'sattvic' },
      { key: 'R', text: 'Desire for stimulation and pleasure', type: 'rajasic' },
      { key: 'T', text: 'Habit without awareness', type: 'tamasic' },
    ],
  },
  {
    domain: 'Action',
    domainSanskrit: 'कर्म',
    prompt: 'What moves you to act?',
    options: [
      { key: 'S', text: 'Duty without attachment to results', type: 'sattvic' },
      { key: 'R', text: 'Ambition and desire for reward', type: 'rajasic' },
      { key: 'T', text: 'Confusion or avoidance', type: 'tamasic' },
    ],
  },
  {
    domain: 'Happiness',
    domainSanskrit: 'सुख',
    prompt: 'Where do you find joy?',
    options: [
      { key: 'S', text: 'In inner peace and contentment', type: 'sattvic' },
      { key: 'R', text: 'In achievement and pleasure', type: 'rajasic' },
      { key: 'T', text: 'In distraction and escape', type: 'tamasic' },
    ],
  },
  {
    domain: 'Knowledge',
    domainSanskrit: 'ज्ञान',
    prompt: 'How do you seek truth?',
    options: [
      { key: 'S', text: 'Seeing unity in all things', type: 'sattvic' },
      { key: 'R', text: 'Gathering many separate facts', type: 'rajasic' },
      { key: 'T', text: 'Clinging to narrow views', type: 'tamasic' },
    ],
  },
  {
    domain: 'Determination',
    domainSanskrit: 'धृति',
    prompt: 'How do you persist through difficulty?',
    options: [
      { key: 'S', text: 'With unwavering steadiness', type: 'sattvic' },
      { key: 'R', text: 'With passionate intensity', type: 'rajasic' },
      { key: 'T', text: 'I am easily discouraged', type: 'tamasic' },
    ],
  },
  {
    domain: 'Giving',
    domainSanskrit: 'दान',
    prompt: 'What moves your generosity?',
    options: [
      { key: 'S', text: 'Giving without expectation', type: 'sattvic' },
      { key: 'R', text: 'Giving to gain influence', type: 'rajasic' },
      { key: 'T', text: 'Giving reluctantly or not at all', type: 'tamasic' },
    ],
  },
  {
    domain: 'Renunciation',
    domainSanskrit: 'त्याग',
    prompt: 'How do you let go?',
    options: [
      { key: 'S', text: 'Releasing attachment to fruits', type: 'sattvic' },
      { key: 'R', text: 'Abandoning what hinders my goals', type: 'rajasic' },
      { key: 'T', text: 'Confused about what to release', type: 'tamasic' },
    ],
  },
  {
    domain: 'Pleasure',
    domainSanskrit: 'भोग',
    prompt: 'How do you engage with enjoyment?',
    options: [
      { key: 'S', text: 'Enjoying without craving', type: 'sattvic' },
      { key: 'R', text: 'Pursuing intensely, always wanting more', type: 'rajasic' },
      { key: 'T', text: 'Lost in addictive patterns', type: 'tamasic' },
    ],
  },
  {
    domain: 'Ego',
    domainSanskrit: 'अहंकार',
    prompt: 'What is your sense of self?',
    options: [
      { key: 'S', text: 'Seeing through the illusion of separateness', type: 'sattvic' },
      { key: 'R', text: 'Identifying with roles and achievements', type: 'rajasic' },
      { key: 'T', text: 'Confused about who I truly am', type: 'tamasic' },
    ],
  },
  {
    domain: 'Self-Discipline',
    domainSanskrit: 'तपस',
    prompt: 'What sustains your practice?',
    options: [
      { key: 'S', text: 'Inner clarity and purpose', type: 'sattvic' },
      { key: 'R', text: 'Desire to prove myself', type: 'rajasic' },
      { key: 'T', text: 'I struggle to maintain discipline', type: 'tamasic' },
    ],
  },
];

const patterns = [
  { name: 'The Soul Seeker', sanskrit: 'जिज्ञासु', description: 'Driven by authentic curiosity' },
  { name: 'The Karma Yogi', sanskrit: 'कर्मयोगी', description: 'Action without attachment' },
  { name: 'The Steady Sage', sanskrit: 'स्थितप्रज्ञ', description: 'Wisdom firmly established' },
  { name: 'The Restless Mind', sanskrit: 'चञ्चलचित्त', description: 'Constant motion, seeking' },
  { name: 'The Blind Ruler', sanskrit: 'अन्धराज', description: 'Power without vision' },
  { name: 'The Bound Soul', sanskrit: 'बद्धात्मा', description: 'Trapped in confusion' },
];

// Typewriter hook
function useTypewriter(text: string, delay: number = 0, speed: number = 30) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    const startTimer = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= text.length) {
          setDisplayText(text.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
        }
      }, speed);
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(startTimer);
  }, [text, delay, speed]);
  
  return { displayText, isComplete };
}

export function TerminalWorkingPage({ onBack }: TerminalWorkingPageProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ type: string; index: number }[]>([]);
  const [isComputing, setIsComputing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState(patterns[0]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const handleAnswer = (type: 'sattvic' | 'rajasic' | 'tamasic', index: number) => {
    setSelectedOption(index);
    const newAnswers = [...answers, { type, index }];
    
    setTimeout(() => {
      setAnswers(newAnswers);
      setSelectedOption(null);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      } else {
        setIsComputing(true);
        setTimeout(() => {
          const sattvicCount = newAnswers.filter(a => a.type === 'sattvic').length;
          const rajasicCount = newAnswers.filter(a => a.type === 'rajasic').length;
          
          let pattern;
          if (sattvicCount >= 5) pattern = patterns[0];
          else if (sattvicCount >= 3 && rajasicCount >= 3) pattern = patterns[1];
          else if (sattvicCount >= 4) pattern = patterns[2];
          else if (rajasicCount >= 5) pattern = patterns[3];
          else if (rajasicCount >= 3) pattern = patterns[4];
          else pattern = patterns[5];
          
          setSelectedPattern(pattern);
          setIsComputing(false);
          setShowResult(true);
        }, 4000);
      }
    }, 300);
  };
  
  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setIsComputing(false);
  };
  
  if (isComputing) {
    return (
      <div className="min-h-screen terminal flex flex-col items-center justify-center p-6">
        <motion.div
          className="max-w-md w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="mb-8">
            <p className="text-[#00AA2A] mb-2">$ initializing_computation...</p>
            <p className="text-[#00FF41] mb-1">→ Loading 10,000-dimensional attractor network</p>
            <p className="text-[#00FF41] mb-1">→ Integrating ODE: dQ/dt = -Q + tanh(β·W·Q)</p>
            <p className="text-[#00FF41] mb-1">→ Mapping trajectory through energy landscape</p>
          </div>
          
          {/* Progress bar */}
          <div className="w-full h-2 bg-[#2a2a3e] rounded overflow-hidden">
            <motion.div
              className="h-full bg-[#00FF41]"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 4, ease: 'linear' }}
            />
          </div>
          
          <motion.p
            className="text-center mt-4 text-[#00AA2A]"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Computing your trajectory...
          </motion.p>
        </motion.div>
      </div>
    );
  }
  
  if (showResult) {
    return (
      <div className="min-h-screen parchment-texture p-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-[#8B7355] hover:text-[#B8860B] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm handwritten">Return to Manuscript</span>
            </button>
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 text-[#8B7355] hover:text-[#B8860B] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm handwritten">Begin Again</span>
            </button>
          </motion.div>
          
          {/* Result card */}
          <motion.div
            className="p-8 sm:p-12 border border-[#8B7355]/20 rounded-lg bg-[#F5F0E8] aged-edges"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Terminal output header */}
            <div className="mb-8 p-4 bg-[#1a1a2e] rounded font-mono text-sm">
              <p className="text-[#00AA2A]">$ ./compute --self</p>
              <p className="text-[#00FF41]">→ Computation complete</p>
              <p className="text-[#00FF41]">→ Pattern identified: <span className="text-[#D4A017]">{selectedPattern.name}</span></p>
              <p className="text-[#00AA2A]">$ _</p>
            </div>
            
            {/* Pattern display */}
            <div className="text-center mb-8">
              <p className="text-[#8B7355] mono text-xs tracking-wider mb-4">YOUR CONSCIOUSNESS PATTERN</p>
              <h1 className="text-4xl sm:text-5xl handwritten text-[#1a1a2e] mb-2">{selectedPattern.name}</h1>
              <p className="text-xl text-[#B8860B] italic">{selectedPattern.sanskrit}</p>
            </div>
            
            {/* Description */}
            <p className="text-center text-[#4a4a5e] handwritten text-lg mb-8">
              {selectedPattern.description}
            </p>
            
            {/* Three sections */}
            <div className="grid md:grid-cols-3 gap-6 pt-8 border-t border-[#8B7355]/20">
              <div>
                <h3 className="text-[#4A90D9] handwritten text-lg mb-2">What Drives You</h3>
                <p className="text-sm text-[#6B7280]">
                  Your trajectory reveals the dominant forces shaping your consciousness 
                  and the patterns you naturally gravitate toward.
                </p>
              </div>
              <div>
                <h3 className="text-[#D4A017] handwritten text-lg mb-2">Where Forces Lead</h3>
                <p className="text-sm text-[#6B7280]">
                  This is your current convergence point — where your trajectory lands 
                  if forces continue unchanged.
                </p>
              </div>
              <div>
                <h3 className="text-[#00C9A7] handwritten text-lg mb-2">The Path Through</h3>
                <p className="text-sm text-[#6B7280]">
                  Understanding your topology is the first step. The Gita's framework 
                  shows how consciousness can evolve.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen terminal p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#00AA2A] hover:text-[#00FF41] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm mono">exit</span>
          </button>
          <p className="text-[#00AA2A] mono text-sm">
            [{currentQuestion + 1}/{questions.length}]
          </p>
        </div>
        
        {/* Terminal output */}
        <div ref={scrollRef} className="space-y-6">
          {/* Previous answers */}
          {questions.slice(0, currentQuestion).map((q, idx) => (
            <div key={idx} className="opacity-50">
              <p className="text-[#00AA2A] text-sm">
                [{q.domainSanskrit}/{q.domain}] {q.prompt}
              </p>
              <p className="text-[#00FF41] ml-4">
                → {q.options[answers[idx]?.index]?.text}
              </p>
            </div>
          ))}
          
          {/* Current question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <TypewriterPrompt
                question={questions[currentQuestion]}
                onSelect={handleAnswer}
                selectedOption={selectedOption}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

interface TypewriterPromptProps {
  question: Question;
  onSelect: (type: 'sattvic' | 'rajasic' | 'tamasic', index: number) => void;
  selectedOption: number | null;
}

function TypewriterPrompt({ question, onSelect, selectedOption }: TypewriterPromptProps) {
  const { displayText, isComplete } = useTypewriter(
    `[${question.domainSanskrit}/${question.domain}] ${question.prompt}`,
    0,
    25
  );
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sattvic': return '#4A90D9';
      case 'rajasic': return '#D4A017';
      case 'tamasic': return '#6B7280';
      default: return '#00FF41';
    }
  };
  
  return (
    <div>
      <p className="text-[#00FF41]">
        {displayText}
        {!isComplete && <span className="terminal-cursor" />}
      </p>
      
      <AnimatePresence>
        {isComplete && (
          <motion.div
            className="mt-4 ml-4 space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {question.options.map((option, index) => (
              <motion.button
                key={option.key}
                onClick={() => onSelect(option.type, index)}
                className={`block w-full text-left px-3 py-2 rounded transition-all
                  ${selectedOption === index ? 'bg-[#00FF41]/20' : 'hover:bg-[#00FF41]/10'}
                `}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                disabled={selectedOption !== null}
              >
                <span 
                  className="mono font-bold mr-3"
                  style={{ color: getTypeColor(option.type) }}
                >
                  [{option.key}]
                </span>
                <span className={selectedOption === index ? 'text-[#00FF41]' : 'text-[#00AA2A]'}>
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

export default TerminalWorkingPage;
