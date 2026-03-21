import { motion } from 'framer-motion';
import { BookOpen, Github, ExternalLink } from 'lucide-react';

export function ManuscriptFooter() {
  return (
    <footer className="relative py-12 parchment-texture border-t border-[#8B7355]/20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-2xl handwritten text-[#1a1a2e]">io-gita</p>
            <p className="text-xs text-[#8B7355] mono">Ancient manuscript · Modern computation</p>
          </motion.div>
          
          {/* Links */}
          <motion.div
            className="flex items-center gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <a href="#" className="flex items-center gap-2 text-[#8B7355] hover:text-[#B8860B] transition-colors text-sm">
              <BookOpen className="w-4 h-4" />
              <span className="handwritten">Paper</span>
            </a>
            <a href="#" className="flex items-center gap-2 text-[#8B7355] hover:text-[#B8860B] transition-colors text-sm">
              <Github className="w-4 h-4" />
              <span className="handwritten">Source</span>
            </a>
            <a href="#" className="flex items-center gap-2 text-[#8B7355] hover:text-[#B8860B] transition-colors text-sm">
              <ExternalLink className="w-4 h-4" />
              <span className="handwritten">ORCID</span>
            </a>
          </motion.div>
          
          {/* Credits */}
          <motion.div
            className="text-center md:text-right"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm text-[#8B7355] handwritten">
              Built by <span className="text-[#1a1a2e]">Meharban Singh</span>
            </p>
            <p className="text-xs text-[#8B7355] mono mt-1">
              Powered by <span className="text-[#00C9A7]">Semantic Gravity</span>
            </p>
          </motion.div>
        </div>
        
        {/* Bottom */}
        <motion.div
          className="mt-8 pt-6 border-t border-[#8B7355]/10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs text-[#8B7355] mono">
            © 2026 · Peer-reviewed physics · Not a personality test
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

export default ManuscriptFooter;
