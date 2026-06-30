'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Mail, Download } from 'lucide-react';
import SectionWrapper from '@/components/layout/section-wrapper';
import type { Profile } from '@/types';

export default function AboutSection() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
    layoutEffect: false,
  });

  useEffect(() => {
    fetch('/api/profile')
      .then((r) => r.json())
      .then(setProfile)
      .catch(console.error);
  }, []);

  const imageParallax = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const contentX = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  if (!profile) return null;

  return (
    <SectionWrapper
      id="about"
      title="关于我"
      subtitle="9年全栈开发经验，专注企业级应用与AI智能化落地"
    >
      <div ref={ref} className="grid gap-12 md:grid-cols-5">
        <motion.div
          className="relative md:col-span-2"
          style={{ y: imageParallax }}
        >
          <div className="sticky top-32">
            <div className="group relative mx-auto aspect-[3/4] max-w-sm overflow-hidden rounded-2xl md:mx-0">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-background/50 z-10" />
              <div
                className="h-full w-full bg-gradient-to-br from-primary/20 via-primary/5 to-secondary/20"
                style={{
                  backgroundImage: `url(${profile.avatar})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-primary/10" />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="glass flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {profile.location}
              </div>
              <div className="glass flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                {profile.email}
              </div>
              {profile.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-input bg-background px-5 py-2 text-sm font-medium shadow-sm transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Download className="h-3.5 w-3.5" />
                  下载简历
                </a>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div className="md:col-span-3" style={{ x: contentX }}>
          <div className="prose prose-invert max-w-none">
            {profile.bio.split('\n\n').map((paragraph, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-base leading-relaxed text-muted-foreground sm:text-lg"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { value: '9+', label: '年开发经验' },
              { value: '40+', label: '项目交付' },
              { value: '8+', label: '企业客户' },
              { value: '24+', label: '开源项目' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="glass-card rounded-2xl px-4 py-6 text-center"
              >
                <div className="text-3xl font-bold tracking-tight text-foreground">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
