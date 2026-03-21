import { motion } from 'framer-motion';

export function MinimalFooter() {
  return (
    <footer className="py-12 px-6 border-t border-[#e5e5e5]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-[#9b9b9b] sans">
            Meharban Singh · 2026 · Peer-reviewed physics · Not a personality test
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

export default MinimalFooter;
