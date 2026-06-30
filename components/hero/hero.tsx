'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import { ChevronDown } from 'lucide-react';
import MagneticButton from './magnetic-button';
import { useMousePosition } from '@/hooks/index';

const HeroShader = dynamic(() => import('./hero-shader'), { ssr: false });

export default function Hero() {
  const [profile, setProfile] = useState<{
    name: string;
    title: string;
    subtitle: string;
    available: boolean;
  } | null>(null);
  const { scrollY } = useScroll();
  const mouse = useMousePosition();

  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.95]);
  const heroY = useTransform(scrollY, [0, 500], [0, 100]);
  const titleY = useTransform(scrollY, [0, 400], [0, -50]);
  const subtitleOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then(setProfile)
      .catch(console.error);
  }, []);

  const scrollToAbout = () => {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.3,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 60, rotateX: -40 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <HeroShader />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background" />
      </div>

      <div className="noise-overlay" />

      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-[1px] w-[1px] rounded-full bg-primary/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 0.5, 0],
              scale: [0, 2, 0],
              y: [0, -100],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative z-10 mx-auto max-w-6xl px-6 text-center"
      >
        {profile?.available && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              开放合作机会
            </div>
          </motion.div>
        )}

        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 overflow-hidden text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
          style={{ perspective: '1000px', y: titleY }}
        >
          {(profile?.name || '欧阳文').split('').map((char, i) => (
            <motion.span
              key={i}
              variants={letterVariants}
              className="inline-block bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
          className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          style={{ opacity: subtitleOpacity }}
        >
          {profile?.title || '高级 .NET 全栈工程师'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton onClick={scrollToAbout}>
            <span className="glow-blue relative inline-flex h-12 items-center gap-2 rounded-2xl bg-foreground px-8 text-sm font-medium text-background transition-all duration-300 hover:shadow-2xl">
              查看我的作品
              <ChevronDown className="h-4 w-4" />
            </span>
          </MagneticButton>

          <MagneticButton onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
            <span className="glass relative inline-flex h-12 items-center gap-2 rounded-2xl px-8 text-sm font-medium text-foreground transition-all duration-300 hover:bg-accent/50">
              联系我
            </span>
          </MagneticButton>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        style={{ opacity: useTransform(scrollY, [0, 200], [1, 0]) }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            向下滚动
          </span>
          <div className="h-8 w-[1px] bg-gradient-to-b from-muted-foreground/50 to-transparent" />
        </motion.div>
      </motion.div>

      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-0 -translate-x-1/2 -translate-y-1/2"
        style={{ x: mouse.x, y: mouse.y }}
      >
        <div className="h-[500px] w-[500px] rounded-full bg-gradient-to-r from-primary/3 to-transparent blur-3xl" />
      </motion.div>
    </section>
  );
}
