'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useMediaQuery } from '@/hooks/index';

export default function GlowCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springX = useSpring(cursorX, { stiffness: 300, damping: 30 });
  const springY = useSpring(cursorY, { stiffness: 300, damping: 30 });

  useEffect(() => {
    if (isMobile) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-cursor-hover]')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isMobile, isVisible, cursorX, cursorY]);

  if (isMobile) return null;

  return (
    <>
      {/* Cursor glow */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9998] -translate-x-1/2 -translate-y-1/2"
        style={{
          x: springX,
          y: springY,
          width: isHovering ? 80 : 40,
          height: isHovering ? 80 : 40,
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          width: isHovering ? 80 : 40,
          height: isHovering ? 80 : 40,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div
          className={`h-full w-full rounded-full bg-gradient-to-r from-primary/20 to-primary/5 blur-xl transition-all duration-300 ${
            isHovering ? 'scale-150' : 'scale-100'
          }`}
        />
      </motion.div>

      {/* Cursor ring */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9998] -translate-x-1/2 -translate-y-1/2"
        style={{
          x: springX,
          y: springY,
          opacity: isVisible ? 0.5 : 0,
        }}
      >
        <div
          className={`rounded-full border transition-all duration-300 ${
            isHovering
              ? 'h-12 w-12 border-primary/40'
              : 'h-6 w-6 border-foreground/20'
          }`}
        />
      </motion.div>
    </>
  );
}
