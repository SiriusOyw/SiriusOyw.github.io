'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import SectionWrapper from '@/components/layout/section-wrapper';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/types';

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then(setProjects)
      .catch(console.error);
  }, []);

  return (
    <SectionWrapper
      id="projects"
      title="精选项目"
      subtitle="我引以为豪的代表作品"
    >
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, idx) => (
          <ProjectCard key={project.id} project={project} index={idx} />
        ))}
      </div>
    </SectionWrapper>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
    layoutEffect: false,
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [5, 0, -5]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [20, 0, -20]);

  return (
    <motion.div
      ref={cardRef}
      style={{ rotateX, y }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group perspective-[1000px]"
    >
      <div className="glass-card relative h-full overflow-hidden rounded-2xl transition-all duration-500 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
        {/* Cover image */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/20">
          <div
            className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: `url(${project.cover})`,
              backgroundColor: 'hsl(var(--muted))',
            }}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />

          {/* Category badge */}
          {project.category && (
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="text-[10px] backdrop-blur-sm bg-background/50">
                {project.category}
              </Badge>
            </div>
          )}

          {/* Feature badge */}
          {project.featured && (
            <div className="absolute top-3 right-3">
              <Badge variant="soft" className="text-[10px]">
                Featured
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="relative z-10 p-5">
          {/* Year */}
          {project.year && (
            <div className="mb-2 text-[10px] text-muted-foreground">
              {project.year}
            </div>
          )}

          {/* Title */}
          <h3 className="mb-2 text-base font-semibold leading-tight text-foreground group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>

          {/* Description */}
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {project.description}
          </p>

          {/* Tech stack */}
          <div className="mb-5 flex flex-wrap gap-1.5">
            {project.tech.slice(0, 5).map((t) => (
              <Badge
                key={t}
                variant="outline"
                className="text-[9px] border-border/30"
              >
                {t}
              </Badge>
            ))}
            {project.tech.length > 5 && (
              <Badge variant="outline" className="text-[9px] border-border/30">
                +{project.tech.length - 5}
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Github className="h-3.5 w-3.5" />
                Code
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 items-center justify-center gap-1.5 whitespace-nowrap rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Demo
              </a>
            )}
          </div>
        </div>

        {/* Glow effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-primary/5 rounded-full blur-[80px]" />
        </div>
      </div>
    </motion.div>
  );
}
