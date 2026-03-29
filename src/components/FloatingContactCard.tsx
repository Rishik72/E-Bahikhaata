import { useState } from 'react';
import { Linkedin, Mail, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingContactCard() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="mb-3 p-5 rounded-2xl border border-border/50 bg-card/70 backdrop-blur-xl shadow-xl shadow-foreground/5 min-w-[260px]"
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-display font-semibold text-foreground">Rushikesh Kalwane</h4>
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors -mt-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              <a
                href="https://www.linkedin.com/in/rushikeshkalwane"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn Profile
              </a>
              <a
                href="mailto:rushikeshkalwane07@gmail.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                rushikeshkalwane07@gmail.com
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 flex items-center justify-center hover:opacity-90 transition-opacity"
      >
        <Mail className="w-5 h-5" />
      </motion.button>
    </div>
  );
}
