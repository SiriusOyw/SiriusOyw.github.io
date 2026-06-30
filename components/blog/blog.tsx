'use client';

import { motion } from 'framer-motion';
import { BookOpen, ArrowRight } from 'lucide-react';
import SectionWrapper from '@/components/layout/section-wrapper';
import { Button } from '@/components/ui/button';

const posts = [
  {
    title: '基于ABP框架构建可扩展的企业级应用',
    excerpt:
      '深入探讨如何使用ABP框架的模块化架构、DDD设计和多租户支持来构建健壮的企业级.NET应用。',
    date: '2025-03-15',
    readTime: 8,
    tags: ['ABP', '.NET', 'DDD', '架构'],
  },
  {
    title: '使用VLLM实现企业级智能文档识别与处理',
    excerpt:
      '分享基于大语言模型实现发货单智能识别、地址解析和企业知识库搭建的实践经验。',
    date: '2025-02-20',
    readTime: 12,
    tags: ['AI', 'VLLM', 'OCR', '知识库'],
  },
  {
    title: 'EF Core vs Dapper：企业应用性能优化实战',
    excerpt:
      '在高并发场景下，如何选择和使用ORM工具来优化数据库查询性能，附基准测试数据。',
    date: '2025-01-10',
    readTime: 6,
    tags: ['EF Core', 'Dapper', '性能', '.NET'],
  },
];

export default function BlogSection() {
  return (
    <SectionWrapper
      id="blog"
      title="技术文章"
      subtitle="关于 .NET、AI 与架构设计的思考与分享"
    >
      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post, idx) => (
          <motion.article
            key={post.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="glass-card group cursor-pointer rounded-2xl p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-md"
          >
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <BookOpen className="h-3 w-3" />
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readTime} 分钟阅读</span>
            </div>

            <h3 className="mb-2 text-base font-semibold leading-tight group-hover:text-primary transition-colors">
              {post.title}
            </h3>

            <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-primary/5 px-2 py-0.5 text-[9px] uppercase tracking-wider text-primary/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-10 text-center"
      >
        <Button variant="outline" className="gap-2">
          查看所有文章
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </SectionWrapper>
  );
}
