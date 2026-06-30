'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Code2,
  Palette,
  Database,
  Cloud,
  Brain,
  Smartphone,
  Globe,
  Server,
} from 'lucide-react';
import SectionWrapper from '@/components/layout/section-wrapper';
import type { Skill } from '@/types';

const categoryIcons: Record<string, React.ReactNode> = {
  frontend: <Code2 className="h-4 w-4" />,
  backend: <Server className="h-4 w-4" />,
  language: <Code2 className="h-4 w-4" />,
  creative: <Palette className="h-4 w-4" />,
  database: <Database className="h-4 w-4" />,
  devops: <Cloud className="h-4 w-4" />,
  ai: <Brain className="h-4 w-4" />,
  mobile: <Smartphone className="h-4 w-4" />,
};

const categoryLabels: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  language: 'Languages',
  creative: 'Creative',
  database: 'Database',
  devops: 'DevOps',
  ai: 'AI & ML',
  mobile: 'Mobile',
};

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/skills')
      .then((r) => r.json())
      .then(setSkills)
      .catch(console.error);
  }, []);

  const categories = Array.from(new Set(skills.map((s) => s.category)));
  const filteredSkills = activeCategory
    ? skills.filter((s) => s.category === activeCategory)
    : skills;

  return (
    <SectionWrapper
      id="skills"
      title="技术栈"
      subtitle="9年深耕 .NET 技术栈，持续拥抱新技术"
    >
      {/* Category filter */}
      <div className="mb-12 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={`rounded-xl px-4 py-2 text-xs font-medium transition-all duration-300 ${
            !activeCategory
              ? 'bg-primary text-primary-foreground'
              : 'glass hover:bg-accent/50'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() =>
              setActiveCategory(activeCategory === cat ? null : cat)
            }
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium transition-all duration-300 ${
              activeCategory === cat
                ? 'bg-primary text-primary-foreground'
                : 'glass hover:bg-accent/50'
            }`}
          >
            {categoryIcons[cat]}
            {categoryLabels[cat] || cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredSkills.map((skill, idx) => (
          <SkillCard key={skill.name} skill={skill} index={idx} />
        ))}
      </div>
    </SectionWrapper>
  );
}

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
    layoutEffect: false,
  });

  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <motion.div
      ref={cardRef}
      style={{ y }}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="glass-card group relative overflow-hidden rounded-2xl p-4 transition-all duration-500 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Hover background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Level indicator bar */}
      {skill.level && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-border/30">
          <motion.div
            className="h-full bg-gradient-to-r from-primary/40 to-primary"
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.level}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: index * 0.05, ease: 'easeOut' }}
          />
        </div>
      )}

      <div className="relative z-10">
        {/* Icon placeholder */}
        <div className="relative mb-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold"
            style={{ backgroundColor: `${skill.color}15`, color: skill.color }}
          >
            {skill.name.charAt(0)}
          </div>
          {isHovered && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute inset-0 rounded-xl bg-primary/5"
            />
          )}
        </div>

        {/* Name */}
        <h4 className="text-sm font-medium text-foreground">{skill.name}</h4>

        {/* Description - shown on hover */}
        <motion.p
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isHovered ? 'auto' : 0,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="mt-1 text-[10px] leading-relaxed text-muted-foreground overflow-hidden"
        >
          {skill.description}
        </motion.p>

        {/* Category tag */}
        <div className="mt-2">
          <span className="rounded-md bg-primary/5 px-2 py-0.5 text-[9px] uppercase tracking-wider text-primary/60">
            {skill.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

