'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, Loader2 } from 'lucide-react';
import SectionWrapper from '@/components/layout/section-wrapper';
import { Button } from '@/components/ui/button';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('sent');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <SectionWrapper
      id="contact"
      title="联系我"
      subtitle="有项目合作或技术交流？欢迎随时联系"
    >
      <div className="grid gap-12 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-muted-foreground">
              我始终对新的项目合作、创意想法或技术交流保持开放态度。欢迎随时联系！
            </p>

            <div className="space-y-4">
              <div className="glass flex items-center gap-3 rounded-xl px-4 py-3">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm">SiriusOyw@outlook.com</span>
              </div>
              <div className="glass flex items-center gap-3 rounded-xl px-4 py-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm">上海</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                </span>
                <div>
                  <div className="text-sm font-medium">开放合作</div>
                  <div className="text-xs text-muted-foreground">
                    项目合作 / 技术咨询 / 全职机会
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="text"
                placeholder="您的姓名"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="glass w-full rounded-xl px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-300 focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="您的邮箱"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="glass w-full rounded-xl px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-300 focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
              />
            </div>
            <div>
              <textarea
                placeholder="您的留言"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                className="glass w-full resize-none rounded-xl px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-300 focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={status === 'sending'}
              className="w-full gap-2"
            >
              {status === 'sending' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  发送中...
                </>
              ) : status === 'sent' ? (
                '消息已发送！'
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  发送消息
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
