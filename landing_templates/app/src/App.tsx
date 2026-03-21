import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ManuscriptHero } from './sections/ManuscriptHero';
import { VerseSection } from './sections/VerseSection';
import { ThreePillarsSection } from './sections/ThreePillarsSection';
import { TerminalCTA } from './sections/TerminalCTA';
import { ManuscriptFooter } from './sections/ManuscriptFooter';
import { MinimalWorkingPage } from './sections/MinimalWorkingPage';

function App() {
  const [showWorking, setShowWorking] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {showWorking ? (
        <motion.div
          key="working"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <MinimalWorkingPage onBack={() => setShowWorking(false)} />
        </motion.div>
      ) : (
        <motion.div
          key="manuscript"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ManuscriptHero onOpenManuscript={() => setShowWorking(true)} />
          <VerseSection />
          <ThreePillarsSection />
          <TerminalCTA onCompute={() => setShowWorking(true)} />
          <ManuscriptFooter />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
