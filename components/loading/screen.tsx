'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 400);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.1,
            filter: 'blur(10px)',
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/50" />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative z-10 text-center"
          >
            {/* Logo */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="mb-8"
            >
              <div className="relative mx-auto h-16 w-16">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-primary/50 blur-xl opacity-50 animate-pulse-glow" />
                <div className="relative flex h-full w-full items-center justify-center rounded-full border border-border/30 bg-background/80 backdrop-blur-sm">
                  <span className="text-2xl font-bold tracking-tight text-foreground">O</span>
                </div>
              </div>
            </motion.div>

            {/* Name */}
            <motion.h1
              className="text-2xl font-light tracking-[0.3em] text-foreground/80"
              style={{ textShadow: '0 0 40px rgba(255,255,255,0.05)' }}
            >
              欧阳文
            </motion.h1>

            {/* Loading bar */}
            <div className="mx-auto mt-8 h-[2px] w-48 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary/40 via-primary to-primary/40"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-xs tracking-[0.2em] text-muted-foreground"
            >
              {Math.min(Math.floor(progress), 100)}%
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
