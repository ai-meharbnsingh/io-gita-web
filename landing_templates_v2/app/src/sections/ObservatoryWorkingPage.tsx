import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, RotateCcw, Star } from 'lucide-react';
import { ConstellationMap, constellations } from '../components/observatory/ConstellationMap';
import { CometTrajectory } from '../components/observatory/CometTrajectory';

interface ObservatoryWorkingPageProps {
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

export function ObservatoryWorkingPage({ onBack }: ObservatoryWorkingPageProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ type: string; index: number }[]>([]);
  const [isComputing, setIsComputing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [highlightedConstellation, setHighlightedConstellation] = useState<string | null>(null);

  const handleAnswer = (type: 'sattvic' | 'rajasic' | 'tamasic', index: number) => {
    const newAnswers = [...answers, { type, index }];
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsComputing(true);
      setTimeout(() => {
        // Determine constellation based on answers
        const sattvicCount = newAnswers.filter(a => a.type === 'sattvic').length;
        const rajasicCount = newAnswers.filter(a => a.type === 'rajasic').length;
        
        let constellationId;
        if (sattvicCount >= 5) constellationId = 'soul-seeker';
        else if (sattvicCount >= 3 && rajasicCount >= 3) constellationId = 'karma-yogi';
        else if (sattvicCount >= 4) constellationId = 'steady-sage';
        else if (rajasicCount >= 5) constellationId = 'restless-mind';
        else if (rajasicCount >= 3) constellationId = 'blind-ruler';
        else constellationId = 'bound-soul';
        
        setHighlightedConstellation(constellationId);
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
    setHighlightedConstellation(null);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sattvic': return '#4A90D9';
      case 'rajasic': return '#D4A017';
      case 'tamasic': return '#6B7280';
      default: return '#C9A84C';
    }
  };

  if (isComputing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Animated starfield */}
          <div className="relative w-48 h-48 mx-auto mb-8">
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-4 bg-[#C9A84C]/40 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * 30}deg) translateY(-80px)`,
                    transformOrigin: 'center bottom',
                  }}
                />
              ))}
            </motion.div>
            <CometTrajectory width={192} height={192} className="absolute inset-0" />
          </div>
          
          <motion.p
            className="text-[#F0F0F0] font-serif text-2xl mb-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Computing your trajectory...
          </motion.p>
          <p className="text-[#6B6B8A] mono text-sm">
            10,000 dimensions · ODE integration
          </p>
        </motion.div>
      </div>
    );
  }

  if (showResult) {
    const constellation = constellations.find(c => c.id === highlightedConstellation);
    
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-[#6B6B8A] hover:text-[#C9A84C] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Return to Observatory</span>
            </button>
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 text-[#6B6B8A] hover:text-[#C9A84C] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm">Begin Again</span>
            </button>
          </motion.div>
          
          {/* Result */}
          <motion.div
            className="observatory-panel rounded-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Constellation visualization */}
            <div className="mb-8">
              <ConstellationMap 
                width={600} 
                height={300} 
                highlightedId={highlightedConstellation || undefined}
              />
            </div>
            
            {/* Pattern info */}
            {constellation && (
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Star className="w-8 h-8 text-[#C9A84C] mx-auto mb-4" />
                  <p className="text-[#6B4C9A] mono text-xs tracking-wider mb-2">
                    YOUR CONSTELLATION
                  </p>
                  <h2 className="text-4xl font-serif gradient-gold mb-2">
                    {constellation.name}
                  </h2>
                  <p className="text-[#6B4C9A] text-lg italic mb-4">
                    {constellation.sanskrit}
                  </p>
                  <p className="text-[#9B9BB0] max-w-lg mx-auto">
                    {constellation.description}
                  </p>
                </motion.div>
                
                {/* Three sections */}
                <div className="grid md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-[#C9A84C]/20">
                  <div>
                    <h3 className="text-[#4A90D9] font-serif text-lg mb-2">What Drives You</h3>
                    <p className="text-sm text-[#6B6B8A]">
                      Your trajectory reveals the dominant forces shaping your consciousness.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-[#D4A017] font-serif text-lg mb-2">Where Forces Lead</h3>
                    <p className="text-sm text-[#6B6B8A]">
                      Your current convergence point in the attractor landscape.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-[#00C9A7] font-serif text-lg mb-2">The Path Through</h3>
                    <p className="text-sm text-[#6B6B8A]">
                      Understanding your topology is the first step toward evolution.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#6B6B8A] hover:text-[#C9A84C] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Exit Journey</span>
          </button>
          <div className="flex gap-1">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  idx < currentQuestion ? 'bg-[#C9A84C]' :
                  idx === currentQuestion ? 'bg-[#C9A84C] scale-125' :
                  'bg-[#1a1a3e]'
                }`}
              />
            ))}
          </div>
        </motion.div>
        
        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            className="observatory-panel rounded-lg p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Domain */}
            <div className="text-center mb-8">
              <p className="text-[#6B4C9A] text-3xl font-serif mb-1">
                {question.domainSanskrit}
              </p>
              <p className="text-[#6B6B8A] mono text-xs tracking-wider">
                {question.domain.toUpperCase()}
              </p>
            </div>
            
            {/* Question text */}
            <p className="text-xl text-[#F0F0F0] text-center mb-8">
              {question.question}
            </p>
            
            {/* Choices */}
            <div className="space-y-3">
              {question.choices.map((choice, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(choice.type, index)}
                  className="w-full p-4 text-left border border-[#C9A84C]/20 rounded-lg
                           hover:border-[#C9A84C]/50 hover:bg-[#1a1a3e]/50
                           transition-all duration-300"
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
                  <span className="text-[#B8B8D0]">{choice.text}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ObservatoryWorkingPage;
