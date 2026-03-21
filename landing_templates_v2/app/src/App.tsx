import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Minimal
import { MinimalHero } from './sections/MinimalHero';
import { VerseSectionMinimal } from './sections/VerseSectionMinimal';
import { NumbersSection } from './sections/NumbersSection';
import { HowItWorksMinimal } from './sections/HowItWorksMinimal';
import { MinimalFooter } from './sections/MinimalFooter';
import { MinimalWorkingPage } from './sections/MinimalWorkingPage';
// Observatory
import { ObservatoryHero } from './sections/ObservatoryHero';
import { MapSection } from './sections/MapSection';
import { JourneySection } from './sections/JourneySection';
import { ObservatoryProof } from './sections/ObservatoryProof';
import { ObservatoryFooter } from './sections/ObservatoryFooter';
import { ObservatoryWorkingPage } from './sections/ObservatoryWorkingPage';
// Temple
import { TempleHero } from './sections/TempleHero';
import { CarvingSection } from './sections/CarvingSection';
import { ArchitectureSection } from './sections/ArchitectureSection';
import { TempleProof } from './sections/TempleProof';
import { TempleCTA } from './sections/TempleCTA';
import { TempleFooter } from './sections/TempleFooter';
import { TempleWorkingPage } from './sections/TempleWorkingPage';
// Manuscript
import { ManuscriptHero } from './sections/ManuscriptHero';
import { VerseSection } from './sections/VerseSection';
import { ThreePillarsSection } from './sections/ThreePillarsSection';
import { ScienceSection } from './sections/ScienceSection';
import { TerminalCTA } from './sections/TerminalCTA';
import { ManuscriptFooter } from './sections/ManuscriptFooter';
import { TerminalWorkingPage } from './sections/TerminalWorkingPage';

type Template = 'minimal' | 'observatory' | 'temple' | 'manuscript';

function App() {
  const [template, setTemplate] = useState<Template>('minimal');
  const [showWorkingPage, setShowWorkingPage] = useState(false);

  const bgClass = {
    minimal: 'bg-[#FAFAF8]',
    observatory: 'bg-[#050510]',
    temple: 'bg-[#1C1C28]',
    manuscript: 'bg-[#F5F0E8]',
  }[template];

  return (
    <>
      {/* Template Switcher */}
      <div style={{
        position: 'fixed', top: 10, right: 10, zIndex: 9999,
        display: 'flex', gap: 6, padding: 8,
        background: 'rgba(0,0,0,0.85)', borderRadius: 8,
      }}>
        {(['minimal', 'observatory', 'temple', 'manuscript'] as Template[]).map(t => (
          <button
            key={t}
            onClick={() => { setTemplate(t); setShowWorkingPage(false); window.scrollTo(0, 0); }}
            style={{
              padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
              background: template === t ? '#FF6B00' : '#333',
              color: '#fff', fontFamily: 'monospace', fontSize: 12, fontWeight: 600,
            }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* === MINIMAL === */}
        {template === 'minimal' && !showWorkingPage && (
          <motion.div key="minimal-landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`min-h-screen ${bgClass}`}>
            <MinimalHero onBegin={() => setShowWorkingPage(true)} />
            <VerseSectionMinimal />
            <NumbersSection />
            <HowItWorksMinimal onBegin={() => setShowWorkingPage(true)} />
            <MinimalFooter />
          </motion.div>
        )}
        {template === 'minimal' && showWorkingPage && (
          <motion.div key="minimal-working" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MinimalWorkingPage onBack={() => setShowWorkingPage(false)} />
          </motion.div>
        )}

        {/* === OBSERVATORY === */}
        {template === 'observatory' && !showWorkingPage && (
          <motion.div key="observatory-landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`min-h-screen ${bgClass}`}>
            <ObservatoryHero onBegin={() => setShowWorkingPage(true)} />
            <MapSection />
            <JourneySection />
            <ObservatoryProof />
            <ObservatoryFooter />
          </motion.div>
        )}
        {template === 'observatory' && showWorkingPage && (
          <motion.div key="observatory-working" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ObservatoryWorkingPage onBack={() => setShowWorkingPage(false)} />
          </motion.div>
        )}

        {/* === TEMPLE === */}
        {template === 'temple' && !showWorkingPage && (
          <motion.div key="temple-landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`min-h-screen ${bgClass}`}>
            <TempleHero onBegin={() => setShowWorkingPage(true)} />
            <CarvingSection />
            <ArchitectureSection />
            <TempleProof />
            <TempleCTA onBegin={() => setShowWorkingPage(true)} />
            <TempleFooter />
          </motion.div>
        )}
        {template === 'temple' && showWorkingPage && (
          <motion.div key="temple-working" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <TempleWorkingPage onBack={() => setShowWorkingPage(false)} />
          </motion.div>
        )}

        {/* === MANUSCRIPT === */}
        {template === 'manuscript' && !showWorkingPage && (
          <motion.div key="manuscript-landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`min-h-screen ${bgClass}`}>
            <ManuscriptHero onOpenManuscript={() => setShowWorkingPage(true)} />
            <VerseSection />
            <ThreePillarsSection />
            <ScienceSection />
            <TerminalCTA onCompute={() => setShowWorkingPage(true)} />
            <ManuscriptFooter />
          </motion.div>
        )}
        {template === 'manuscript' && showWorkingPage && (
          <motion.div key="manuscript-working" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <TerminalWorkingPage onBack={() => setShowWorkingPage(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
