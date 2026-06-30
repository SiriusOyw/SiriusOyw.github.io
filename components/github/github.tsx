'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  GitFork,
  Star,
  Users,
  BookOpen,
  Code2,
} from 'lucide-react';
import SectionWrapper from '@/components/layout/section-wrapper';
import { Badge } from '@/components/ui/badge';
import type { GitHubData, GitHubRepo } from '@/types';

export default function GitHubSection() {
  const [data, setData] = useState<GitHubData | null>(null);

  useEffect(() => {
    fetch('/api/github')
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return null;

  return (
    <SectionWrapper
      id="github"
      title="开源项目"
      subtitle="我在开源社区的技术贡献与分享"
    >
      {/* Profile summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card mb-12 overflow-hidden rounded-2xl"
      >
        <div className="flex flex-col items-center gap-6 p-8 sm:flex-row">
          <div className="relative">
            <div className="h-20 w-20 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5">
              <img
                src={data.avatar}
                alt={data.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-background bg-emerald-500" />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-semibold">{data.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{data.bio}</p>
          </div>

          <div className="flex gap-6">
            {[
              { icon: Users, value: data.followers, label: '关注者' },
              { icon: Users, value: data.following, label: '正在关注' },
              { icon: BookOpen, value: data.publicRepos, label: '仓库' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-lg font-bold">{stat.value}</div>
                <div className="text-[10px] text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Pinned repos */}
      <div className="mb-12">
        <h4 className="mb-6 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          精选仓库
        </h4>
        <div className="grid gap-4 md:grid-cols-2">
          {data.pinnedRepos.map((repo, idx) => (
            <RepoCard key={repo.name} repo={repo} index={idx} />
          ))}
        </div>
      </div>

      {/* Language stats */}
      <div>
        <h4 className="mb-6 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          语言分布
        </h4>
        <div className="glass-card rounded-2xl p-6">
          <div className="flex h-2 overflow-hidden rounded-full bg-border/30">
            {data.languages.map((lang) => (
              <motion.div
                key={lang.name}
                initial={{ width: 0 }}
                whileInView={{ width: `${lang.percentage}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                className="h-full first:rounded-l-full last:rounded-r-full"
                style={{ backgroundColor: lang.color }}
              />
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-4">
            {data.languages.map((lang) => (
              <div key={lang.name} className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: lang.color }}
                />
                <span className="text-xs text-muted-foreground">
                  {lang.name}
                </span>
                <span className="text-xs text-muted-foreground/60">
                  {lang.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

function RepoCard({ repo, index }: { repo: GitHubRepo; index: number }) {
  return (
    <motion.a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="glass-card group block rounded-2xl p-5 transition-all duration-300 hover:border-primary/20 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
            {repo.name}
          </h4>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {repo.description}
          </p>
        </div>
      </div>

      {repo.topics.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {repo.topics.map((topic) => (
            <Badge
              key={topic}
              variant="secondary"
              className="text-[9px] px-2 py-0.5"
            >
              {topic}
            </Badge>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Code2 className="h-3 w-3" />
          {repo.language}
        </div>
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3" />
          {repo.stars}
        </div>
        <div className="flex items-center gap-1">
          <GitFork className="h-3 w-3" />
          {repo.forks}
        </div>
      </div>
    </motion.a>
  );
}
