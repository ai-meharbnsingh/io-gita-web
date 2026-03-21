import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, RotateCcw } from 'lucide-react';
import { StonePillar } from '../components/temple/StonePillar';
import { CircuitCarving } from '../components/temple/CircuitCarving';

interface TempleWorkingPageProps {
  onBack: () => void;
}

interface Question {
  domain: string;
  domainSanskrit: string;
  scenario: string;
  choices: { text: string; type: 'sattvic' | 'rajasic' | 'tamasic' }[];
}

const questions: Question[] = [
  {
    domain: 'Faith',
    domainSanskrit: 'श्रद्धा',
    scenario: 'When you approach the unknown, what is your natural response?',
    choices: [
      { text: 'Openness and curiosity', type: 'sattvic' },
      { text: 'Desire to control outcomes', type: 'rajasic' },
      { text: 'Avoidance or dismissal', type: 'tamasic' },
    ],
  },
  {
    domain: 'Food',
    domainSanskrit: 'आहार',
    scenario: 'What guides your consumption?',
    choices: [
      { text: 'Balance and nourishment', type: 'sattvic' },
      { text: 'Desire for pleasure', type: 'rajasic' },
      { text: 'Habit without awareness', type: 'tamasic' },
    ],
  },
  {
    domain: 'Action',
    domainSanskrit: 'कर्म',
    scenario: 'What motivates your actions?',
    choices: [
      { text: 'Duty without attachment', type: 'sattvic' },
      { text: 'Ambition and reward', type: 'rajasic' },
      { text: 'Confusion or avoidance', type: 'tamasic' },
    ],
  },
  {
    domain: 'Happiness',
    domainSanskrit: 'सुख',
    scenario: 'Where do you find joy?',
    choices: [
      { text: 'In inner peace', type: 'sattvic' },
      { text: 'In achievement', type: 'rajasic' },
      { text: 'In distraction', type: 'tamasic' },
    ],
  },
  {
    domain: 'Knowledge',
    domainSanskrit: 'ज्ञान',
    scenario: 'How do you seek truth?',
    choices: [
      { text: 'Seeing unity in all', type: 'sattvic' },
      { text: 'Gathering many facts', type: 'rajasic' },
      { text: 'Clinging to narrow views', type: 'tamasic' },
    ],
  },
  {
    domain: 'Determination',
    domainSanskrit: 'धृति',
    scenario: 'How do you persist through difficulty?',
    choices: [
      { text: 'With unwavering steadiness', type: 'sattvic' },
      { text: 'With passionate intensity', type: 'rajasic' },
      { text: 'I am easily discouraged', type: 'tamasic' },
    ],
  },
  {
    domain: 'Giving',
    domainSanskrit: 'दान',
    scenario: 'What moves your generosity?',
    choices: [
      { text: 'Giving without expectation', type: 'sattvic' },
      { text: 'Giving for influence', type: 'rajasic' },
      { text: 'Giving reluctantly', type: 'tamasic' },
    ],
  },
  {
    domain: 'Renunciation',
    domainSanskrit: 'त्याग',
    scenario: 'How do you let go?',
    choices: [
      { text: 'Releasing attachment', type: 'sattvic' },
      { text: 'Abandoning obstacles', type: 'rajasic' },
      { text: 'Confused release', type: 'tamasic' },
    ],
  },
  {
    domain: 'Pleasure',
    domainSanskrit: 'भोग',
    scenario: 'How do you engage with joy?',
    choices: [
      { text: 'Enjoying without craving', type: 'sattvic' },
      { text: 'Pursuing intensely', type: 'rajasic' },
      { text: 'Lost in patterns', type: 'tamasic' },
    ],
  },
  {
    domain: 'Ego',
    domainSanskrit: 'अहंकार',
    scenario: 'What is your sense of self?',
    choices: [
      { text: 'Beyond separateness', type: 'sattvic' },
      { text: 'Roles and achievements', type: 'rajasic' },
      { text: 'Confused identity', type: 'tamasic' },
    ],
  },
  {
    domain: 'Discipline',
    domainSanskrit: 'तपस',
    scenario: 'What sustains your practice?',
    choices: [
      { text: 'Inner clarity', type: 'sattvic' },
      { text: 'Desire to prove', type: 'rajasic' },
      { text: 'Struggle to maintain', type: 'tamasic' },
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

export function TempleWorkingPage({ onBack }: TempleWorkingPageProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ type: string; index: number }[]>([]);
  const [isComputing, setIsComputing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [circuitIntensity, setCircuitIntensity] = useState(0.2);
  const [selectedPattern, setSelectedPattern] = useState(patterns[0]);

  const handleAnswer = (type: 'sattvic' | 'rajasic' | 'tamasic', index: number) => {
    const newAnswers = [...answers, { type, index }];
    setAnswers(newAnswers);
    
    // Increase circuit intensity as user progresses
    setCircuitIntensity(0.2 + (newAnswers.length / questions.length) * 0.6);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
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
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setIsComputing(false);
    setCircuitIntensity(0.2);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sattvic': return '#4A90D9';
      case 'rajasic': return '#D4A017';
      case 'tamasic': return '#6B7280';
      default: return '#C4A882';
    }
  };

  if (isComputing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center stone-texture px-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Circuit animation */}
          <div className="relative w-48 h-48 mx-auto mb-8">
            <CircuitCarving width={192} height={192} animate={true} />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            >
              <div className="w-32 h-32 border border-[#B8860B]/30 rounded-full" />
            </motion.div>
          </div>
          
          <motion.p
            className="text-[#C4A882] font-serif text-2xl mb-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            The temple transforms...
          </motion.p>
          <p className="text-[#8B7355] mono text-sm">
            Computing your trajectory through 10,000 dimensions
          </p>
        </motion.div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="min-h-screen py-12 px-4 stone-texture">
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
              <span className="text-sm">Exit Temple</span>
            </button>
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 text-[#8B7355] hover:text-[#B8860B] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm">Begin Again</span>
            </button>
          </motion.div>
          
          {/* Result - newly carved */}
          <motion.div
            className="stone-tablet rounded-lg p-8 sm:p-12 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Fresh carving effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-[#B8860B]/10 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            />
            
            {/* Circuit pattern */}
            <CircuitCarving width={300} height={100} className="mx-auto mb-8" />
            
            {/* Pattern info */}
            <div className="text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-[#B8860B] mono text-xs tracking-wider mb-4">
                  NEWLY CARVED BY THE COMPUTATION
                </p>
                <h2 className="text-4xl sm:text-5xl carved-text text-[#C4A882] mb-2">
                  {selectedPattern.name}
                </h2>
                <p className="text-xl text-[#6B4C9A] italic mb-4">
                  {selectedPattern.sanskrit}
                </p>
                <p className="text-[#8B7355]">{selectedPattern.description}</p>
              </motion.div>
              
              {/* Three sections */}
              <div className="grid md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-[#B8860B]/20">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="text-[#4A90D9] font-serif text-lg mb-2">What Drives You</h3>
                  <p className="text-sm text-[#8B7355]">
                    Your trajectory reveals the dominant forces shaping your consciousness.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3 className="text-[#D4A017] font-serif text-lg mb-2">Where Forces Lead</h3>
                  <p className="text-sm text-[#8B7355]">
                    Your current convergence point in the attractor landscape.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <h3 className="text-[#00C9A7] font-serif text-lg mb-2">The Path Through</h3>
                  <p className="text-sm text-[#8B7355]">
                    Understanding your topology is the first step toward evolution.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen py-12 px-4 stone-texture">
      {/* Background pillars with increasing circuit intensity */}
      <div className="fixed inset-0 flex justify-between px-4 opacity-30 pointer-events-none">
        <StonePillar height={800} width={60} circuitIntensity={circuitIntensity} />
        <StonePillar height={800} width={60} circuitIntensity={circuitIntensity} />
      </div>
      
      <div className="relative z-10 max-w-2xl mx-auto">
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
            <span className="text-sm">Exit</span>
          </button>
          <div className="flex gap-1">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  idx < currentQuestion ? 'bg-[#B8860B]' :
                  idx === currentQuestion ? 'bg-[#B8860B] scale-125' :
                  'bg-[#3a3a4a]'
                }`}
              />
            ))}
          </div>
        </motion.div>
        
        {/* Question tablet */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            className="stone-tablet rounded-lg p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Domain */}
            <div className="text-center mb-8">
              <p className="text-[#6B4C9A] text-3xl font-serif mb-1">
                {question.domainSanskrit}
              </p>
              <p className="text-[#8B7355] mono text-xs tracking-wider">
                {question.domain.toUpperCase()}
              </p>
            </div>
            
            {/* Scenario */}
            <p className="text-xl text-[#C4A882] text-center mb-8 carved-text">
              {question.scenario}
            </p>
            
            {/* Choices - styled as doorways */}
            <div className="space-y-3">
              {question.choices.map((choice, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(choice.type, index)}
                  className="w-full p-4 text-left border border-[#B8860B]/30 rounded-lg
                           bg-gradient-to-r from-[#1C1C28] to-[#2a2a3a]
                           hover:border-[#B8860B]/60 hover:from-[#2a2a3a] hover:to-[#3a3a4a]
                           transition-all duration-300 group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4 }}
                >
                  <span 
                    className="inline-block w-6 h-6 rounded-full text-xs flex items-center justify-center mr-3"
                    style={{ 
                      backgroundColor: `${getTypeColor(choice.type)}20`,
                      color: getTypeColor(choice.type),
                    }}
                  >
                    {['S', 'R', 'T'][index]}
                  </span>
                  <span className="text-[#B8A890] group-hover:text-[#C4A882] transition-colors">
                    {choice.text}
                  </span>
                  
                  {/* Circuit hint on hover */}
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 opacity-0 group-hover:opacity-30 transition-opacity">
                    <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#B8860B" strokeWidth="1" />
                    <circle cx="50%" cy="50%" r="2" fill="#B8860B" />
                  </svg>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default TempleWorkingPage;
