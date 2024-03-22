import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function FadeSwitch({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {children}
    </motion.div>
  );
}
