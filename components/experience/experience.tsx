'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Briefcase, GraduationCap } from 'lucide-react';
import SectionWrapper from '@/components/layout/section-wrapper';
import { Badge } from '@/components/ui/badge';
import type { Experience } from '@/types';

const typeIcons: Record<string, React.ReactNode> = {
  work: <Briefcase className="h-5 w-5 text-primary" />,
  education: <GraduationCap className="h-5 w-5 text-primary" />,
  freelance: <UserCheck className="h-5 w-5 text-primary" />,
};

function UserCheck({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  );
}

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
    layoutEffect: false,
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    fetch('/api/experience')
      .then((r) => r.json())
      .then(setExperiences)
      .catch(console.error);
  }, []);

  return (
    <SectionWrapper
      id="experience"
      title="工作经历"
      subtitle="9年企业级开发经验，服务过多家知名企业"
    >
      <div ref={containerRef} className="relative">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-0 h-full w-[1px] bg-border/50 md:left-1/2 md:-translate-x-px">
          <motion.div
            className="h-full w-full bg-gradient-to-b from-primary via-primary/50 to-transparent"
            style={{ scaleY: lineHeight, originY: 0 }}
          />
        </div>

        <div className="space-y-16 md:space-y-24">
          {experiences.map((exp, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`relative flex flex-col gap-6 pl-12 md:flex-row md:pl-0 ${
                  isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-[11px] top-1 z-10 flex h-[17px] w-[17px] items-center justify-center rounded-full border-2 border-primary bg-background md:left-1/2 md:-translate-x-1/2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>

                {/* Icon */}
                <div
                  className={`hidden md:flex md:w-1/2 ${
                    isEven ? 'justify-end pr-12' : 'justify-start pl-12'
                  }`}
                >
                  <div className="glass flex h-12 w-12 items-center justify-center rounded-xl">
                    {typeIcons[exp.type]}
                  </div>
                </div>

                {/* Content */}
                <div
                  className={`md:w-1/2 ${
                    isEven ? 'md:pl-12' : 'md:pr-12'
                  }`}
                >
                  <div className="glass-card group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:border-primary/20 hover:shadow-lg">
                    {/* Hover gradient */}
                    <div className="absolute inset-0 opacity-0 bg-gradient-to-br from-primary/[0.02] to-transparent transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="relative z-10">
                      {/* Period */}
                      <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <CalendarIcon className="h-3 w-3" />
                        <span>
                          {formatPeriod(exp.startDate, exp.endDate)}
                        </span>
                        <span className="text-border">路</span>
                        <span className="capitalize">{exp.type}</span>
                      </div>

                      {/* Position */}
                      <h3 className="mb-1 text-lg font-semibold">
                        {exp.position}
                      </h3>

                      {/* Company */}
                      <p className="mb-4 text-sm text-primary/80">
                        {exp.company}
                      </p>

                      {/* Description */}
                      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                        {exp.description}
                      </p>

                      {/* Highlights */}
                      {exp.highlights && exp.highlights.length > 0 && (
                        <ul className="mb-4 space-y-1.5">
                          {exp.highlights.map((h, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary/60" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Tech stack */}
                      <div className="flex flex-wrap gap-1.5">
                        {exp.tech.map((t) => (
                          <Badge
                            key={t}
                            variant="soft"
                            className="text-[10px]"
                          >
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      height="12"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="12"
    >
      <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

function formatPeriod(start: string, end: string | null): string {
  const fmt = (d: string) => {
    const [y, m] = d.split('-');
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    return `${months[parseInt(m) - 1]} ${y}`;
  };
  return `${fmt(start)} – ${end ? fmt(end) : 'Present'}`;
}


