'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export default function SectionWrapper({
  id,
  children,
  className,
  title,
  subtitle,
}: SectionWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
    layoutEffect: false,
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [60, 0, 0, -60]);

  return (
    <motion.section
      ref={ref}
      id={id}
      style={{ opacity, y }}
      className={cn(
        'section-wrapper relative border-b border-border/10',
        className
      )}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/[0.02] rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10 mx-auto max-w-6xl px-6">
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="mb-16 md:mb-20"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-primary/40" />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {id}
              </span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-4 max-w-2xl text-muted-foreground">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}
        {children}
      </div>
    </motion.section>
  );
}
