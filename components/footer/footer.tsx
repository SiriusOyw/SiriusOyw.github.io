'use client';

import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Instagram, Heart } from 'lucide-react';

const socialLinks = [
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/10">
      {/* Top gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/30 bg-background/50 backdrop-blur-sm">
                <span className="text-sm font-bold">A</span>
              </div>
              <span className="text-sm font-medium">欧阳文</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              高级 .NET 全栈工程师
            </p>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3"
          >
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-all duration-300 hover:text-foreground hover:border-primary/20 hover:shadow-sm"
                aria-label={label}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-10 flex flex-col items-center gap-2 border-t border-border/10 pt-8 text-center text-xs text-muted-foreground md:flex-row md:justify-between"
        >
          <p>
            &copy; {year} 欧阳文. 保留所有权利。
          </p>
          <p className="flex items-center gap-1">
            使用
            <Heart className="h-3 w-3 text-red-500 fill-red-500" />
            构建 · Next.js + Three.js + TypeScript
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

