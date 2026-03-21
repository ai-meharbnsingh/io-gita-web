import { motion } from 'framer-motion';
import { BookOpen, Github, ExternalLink } from 'lucide-react';

export function ObservatoryFooter() {
  return (
    <footer className="relative py-12 border-t border-[#C9A84C]/10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-2xl font-serif gradient-gold">io-gita</p>
            <p className="text-xs text-[#6B6B8A] mono">Map your inner sky</p>
          </motion.div>
          
          {/* Links */}
          <motion.div
            className="flex items-center gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <a href="#" className="flex items-center gap-2 text-[#6B6B8A] hover:text-[#C9A84C] transition-colors text-sm">
              <BookOpen className="w-4 h-4" />
              <span>Paper</span>
            </a>
            <a href="#" className="flex items-center gap-2 text-[#6B6B8A] hover:text-[#C9A84C] transition-colors text-sm">
              <Github className="w-4 h-4" />
              <span>Source</span>
            </a>
            <a href="#" className="flex items-center gap-2 text-[#6B6B8A] hover:text-[#C9A84C] transition-colors text-sm">
              <ExternalLink className="w-4 h-4" />
              <span>ORCID</span>
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
            <p className="text-sm text-[#6B6B8A]">
              Built by <span className="text-[#9B9BB0]">Meharban Singh</span>
            </p>
            <p className="text-xs text-[#6B6B8A] mono mt-1">
              Powered by <span className="text-[#6B4C9A]">Semantic Gravity</span>
            </p>
          </motion.div>
        </div>
        
        {/* Bottom */}
        <motion.div
          className="mt-8 pt-6 border-t border-[#C9A84C]/10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs text-[#4A4A5A] mono">
            © 2026 · Peer-reviewed physics · Not astrology
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

export default ObservatoryFooter;
