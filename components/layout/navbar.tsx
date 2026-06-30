'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollProgress } from '@/hooks/index';
import { cn } from '@/lib/utils';

const navItems = [
  { label: '关于我', href: '#about' },
  { label: '经历', href: '#experience' },
  { label: '技能', href: '#skills' },
  { label: '项目', href: '#projects' },
  { label: '开源', href: '#github' },
  { label: '摄影', href: '#photography' },
  { label: '联系', href: '#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const progress = useScrollProgress();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = navItems.map((item) => item.href.replace('#', ''));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'glass-strong shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group relative flex items-center gap-2"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-border/30 bg-background/50 backdrop-blur-sm transition-all duration-300 group-hover:border-primary/50">
              <span className="text-sm font-bold text-foreground">O</span>
            </div>
            <span className="hidden text-sm font-medium tracking-tight sm:block">
              欧阳文
            </span>
          </button>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className={cn(
                  'relative rounded-lg px-3 py-2 text-xs font-medium tracking-wide transition-all duration-300',
                  activeSection === item.href.replace('#', '')
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.label}
                {activeSection === item.href.replace('#', '') && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg bg-primary/5"
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="relative z-50 flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
            aria-label="菜单"
          >
            <motion.span
              animate={isMobileMenuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
              className="h-[1.5px] w-5 rounded-full bg-foreground transition-colors"
            />
            <motion.span
              animate={isMobileMenuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
              className="h-[1.5px] w-5 rounded-full bg-foreground"
            />
            <motion.span
              animate={isMobileMenuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
              className="h-[1.5px] w-5 rounded-full bg-foreground"
            />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-background/80"
            style={{
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <nav className="flex flex-col items-center gap-6">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  onClick={() => scrollToSection(item.href)}
                  className="text-2xl font-light tracking-wide text-foreground/80 transition-colors hover:text-foreground"
                >
                  {item.label}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="fixed top-0 left-0 right-0 z-50 h-[1px] origin-left bg-gradient-to-r from-primary/40 via-primary to-primary/40"
        style={{ scaleX: progress }}
      />
    </>
  );
}
