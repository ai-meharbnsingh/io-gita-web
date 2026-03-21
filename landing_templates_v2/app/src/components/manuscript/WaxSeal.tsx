import { motion } from 'framer-motion';

interface WaxSealProps {
  children: React.ReactNode;
  onClick?: () => void;
  size?: number;
  className?: string;
}

export function WaxSeal({ children, onClick, size = 120, className = '' }: WaxSealProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative group ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Wax seal base */}
      <div
        className="wax-seal flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {/* Inner content */}
        <div className="text-center z-10">
          {children}
        </div>
      </div>
      
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: '0 0 30px rgba(139, 0, 0, 0.4), 0 0 60px rgba(139, 0, 0, 0.2)',
        }}
      />
      
      {/* Imperfections for aged look */}
      <div 
        className="absolute top-2 right-3 w-2 h-2 rounded-full bg-[#5C0000] opacity-40"
      />
      <div 
        className="absolute bottom-4 left-2 w-1.5 h-1.5 rounded-full bg-[#5C0000] opacity-30"
      />
    </motion.button>
  );
}

export default WaxSeal;
