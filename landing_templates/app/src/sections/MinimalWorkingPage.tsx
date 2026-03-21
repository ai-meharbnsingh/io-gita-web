import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, RotateCcw } from 'lucide-react';

interface MinimalWorkingPageProps {
  onBack: () => void;
}

interface Question {
  domain: string;
  domainSanskrit: string;
  question: string;
  choices: { text: string; type: 'sattvic' | 'rajasic' | 'tamasic' }[];
}

const questions: Question[] = [
  {
    domain: 'Faith',
    domainSanskrit: 'श्रद्धा',
    question: 'How do you approach the unknown?',
    choices: [
      { text: 'With openness and curiosity', type: 'sattvic' },
      { text: 'With a desire to control outcomes', type: 'rajasic' },
      { text: 'With avoidance or dismissal', type: 'tamasic' },
    ],
  },
  {
    domain: 'Food',
    domainSanskrit: 'आहार',
    question: 'What guides your consumption?',
    choices: [
      { text: 'Balance and nourishment', type: 'sattvic' },
      { text: 'Desire for pleasure', type: 'rajasic' },
      { text: 'Habit without awareness', type: 'tamasic' },
    ],
  },
  {
    domain: 'Action',
    domainSanskrit: 'कर्म',
    question: 'What motivates your actions?',
    choices: [
      { text: 'Duty without attachment', type: 'sattvic' },
      { text: 'Ambition and reward', type: 'rajasic' },
      { text: 'Confusion or avoidance', type: 'tamasic' },
    ],
  },
  {
    domain: 'Happiness',
    domainSanskrit: 'सुख',
    question: 'Where do you find joy?',
    choices: [
      { text: 'In inner peace', type: 'sattvic' },
      { text: 'In achievement', type: 'rajasic' },
      { text: 'In distraction', type: 'tamasic' },
    ],
  },
  {
    domain: 'Knowledge',
    domainSanskrit: 'ज्ञान',
    question: 'How do you seek truth?',
    choices: [
      { text: 'Seeing unity in all', type: 'sattvic' },
      { text: 'Gathering many facts', type: 'rajasic' },
      { text: 'Clinging to narrow views', type: 'tamasic' },
    ],
  },
  {
    domain: 'Determination',
    domainSanskrit: 'धृति',
    question: 'How do you persist?',
    choices: [
      { text: 'With unwavering steadiness', type: 'sattvic' },
      { text: 'With passionate intensity', type: 'rajasic' },
      { text: 'I am easily discouraged', type: 'tamasic' },
    ],
  },
  {
    domain: 'Giving',
    domainSanskrit: 'दान',
    question: 'What moves your generosity?',
    choices: [
      { text: 'Giving without expectation', type: 'sattvic' },
      { text: 'Giving for influence', type: 'rajasic' },
      { text: 'Giving reluctantly', type: 'tamasic' },
    ],
  },
  {
    domain: 'Renunciation',
    domainSanskrit: 'त्याग',
    question: 'How do you let go?',
    choices: [
      { text: 'Releasing attachment', type: 'sattvic' },
      { text: 'Abandoning obstacles', type: 'rajasic' },
      { text: 'Confused release', type: 'tamasic' },
    ],
  },
  {
    domain: 'Pleasure',
    domainSanskrit: 'भोग',
    question: 'How do you engage with joy?',
    choices: [
      { text: 'Enjoying without craving', type: 'sattvic' },
      { text: 'Pursuing intensely', type: 'rajasic' },
      { text: 'Lost in patterns', type: 'tamasic' },
    ],
  },
  {
    domain: 'Ego',
    domainSanskrit: 'अहंकार',
    question: 'What is your sense of self?',
    choices: [
      { text: 'Beyond separateness', type: 'sattvic' },
      { text: 'Roles and achievements', type: 'rajasic' },
      { text: 'Confused identity', type: 'tamasic' },
    ],
  },
  {
    domain: 'Discipline',
    domainSanskrit: 'तपस',
    question: 'What sustains practice?',
    choices: [
      { text: 'Inner clarity', type: 'sattvic' },
      { text: 'Desire to prove', type: 'rajasic' },
      { text: 'Struggle to maintain', type: 'tamasic' },
    ],
  },
];

const patterns = [
  { name: 'The Soul Seeker', sanskrit: 'जिज्ञासु', description: 'Driven by authentic curiosity, seeking truth beyond appearances' },
  { name: 'The Karma Yogi', sanskrit: 'कर्मयोगी', description: 'Action without attachment, finding freedom in dedicated service' },
  { name: 'The Steady Sage', sanskrit: 'स्थितप्रज्ञ', description: 'Equanimity in all circumstances, wisdom firmly established' },
  { name: 'The Restless Mind', sanskrit: 'चञ्चलचित्त', description: 'Constant motion, seeking yet never finding rest' },
  { name: 'The Blind Ruler', sanskrit: 'अन्धराज', description: 'Power without vision, leading others into darkness' },
  { name: 'The Bound Soul', sanskrit: 'बद्धात्मा', description: 'Trapped in cycles of confusion, unable to see the way forward' },
];

export function MinimalWorkingPage({ onBack }: MinimalWorkingPageProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ type: string; index: number }[]>([]);
  const [isComputing, setIsComputing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState(patterns[0]);

  const handleAnswer = (type: 'sattvic' | 'rajasic' | 'tamasic', index: number) => {
    const newAnswers = [...answers, { type, index }];
    setAnswers(newAnswers);
    
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
      }, 3000);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setIsComputing(false);
  };

  if (isComputing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#F5F0E8]">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Simple trajectory animation */}
          <div className="w-48 h-24 mx-auto mb-8">
            <svg width="192" height="96" viewBox="0 0 192 96">
              <motion.path
                d="M 10 80 Q 50 20 96 48 T 182 30"
                fill="none"
                stroke="#FF6B00"
                strokeWidth="2"
                strokeDasharray="4,4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: 'easeInOut' }}
              />
              <motion.circle
                r="4"
                fill="#FF6B00"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  offsetDistance: ['0%', '100%', '100%', '100%'],
                }}
                transition={{
                  duration: 3,
                  times: [0, 0.7, 0.9, 1],
                }}
                style={{
                  offsetPath: "path('M 10 80 Q 50 20 96 48 T 182 30')",
                }}
              />
            </svg>
          </div>
          
          <motion.p
            className="text-[#1a1a1a] text-xl"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Computing your trajectory...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="min-h-screen py-12 px-4 bg-[#F5F0E8]">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            className="flex items-center justify-between mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm sans">Back</span>
            </button>
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm sans">Again</span>
            </button>
          </motion.div>
          
          {/* Result */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs text-[#9b9b9b] sans tracking-wider mb-4">
              YOUR PATTERN
            </p>
            <h2 className="text-4xl sm:text-5xl heading-elegant text-[#1a1a1a] mb-2">
              {selectedPattern.name}
            </h2>
            <p className="text-xl text-[#FF6B00] italic mb-8">
              {selectedPattern.sanskrit}
            </p>
            
            {/* Trajectory diagram */}
            <div className="mb-8">
              <svg width="100%" height="120" viewBox="0 0 400 120" className="mx-auto">
                <line x1="20" y1="100" x2="380" y2="100" stroke="#e5e5e5" strokeWidth="1" />
                <motion.path
                  d="M 30 90 Q 100 30 200 60 T 350 40"
                  fill="none"
                  stroke="#FF6B00"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2 }}
                />
                <circle cx="350" cy="40" r="6" fill="#FF6B00" />
              </svg>
            </div>
            
            <p className="text-[#6b6b6b] leading-relaxed mb-8">
              {selectedPattern.description}
            </p>
            
            {/* Three sections */}
            <div className="space-y-6">
              <div className="minimal-card p-4 rounded">
                <h3 className="text-[#4A90D9] sans font-medium mb-1">What Drives You</h3>
                <p className="text-sm text-[#6b6b6b]">
                  Your trajectory reveals the dominant forces shaping your consciousness.
                </p>
              </div>
              <div className="minimal-card p-4 rounded">
                <h3 className="text-[#FF6B00] sans font-medium mb-1">Where Forces Lead</h3>
                <p className="text-sm text-[#6b6b6b]">
                  Your current convergence point in the attractor landscape.
                </p>
              </div>
              <div className="minimal-card p-4 rounded">
                <h3 className="text-[#00C9A7] sans font-medium mb-1">The Path Through</h3>
                <p className="text-sm text-[#6b6b6b]">
                  Understanding your topology is the first step toward evolution.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen py-12 px-4 bg-[#F5F0E8]">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm sans">Exit</span>
          </button>
          
          {/* Progress dots */}
          <div className="flex gap-2">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={`progress-dot ${
                  idx < currentQuestion ? 'completed' :
                  idx === currentQuestion ? 'active' : ''
                }`}
              />
            ))}
          </div>
        </motion.div>
        
        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Domain */}
            <div className="text-center mb-8">
              <p className="text-3xl text-[#9b9b9b] sanskrit-display mb-1">
                {question.domainSanskrit}
              </p>
              <p className="text-xs text-[#9b9b9b] sans tracking-wider">
                {question.domain.toUpperCase()}
              </p>
            </div>
            
            {/* Question */}
            <p className="text-2xl text-[#1a1a1a] text-center mb-12">
              {question.question}
            </p>
            
            {/* Choices */}
            <div className="space-y-3">
              {question.choices.map((choice, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(choice.type, index)}
                  className="minimal-card w-full p-5 text-left rounded-lg
                           border border-transparent hover:border-[#FF6B00]/20"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="text-[#1a1a1a]">{choice.text}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default MinimalWorkingPage;
