'use client';

import dynamic from 'next/dynamic';
import { useLenis } from '@/lib/lenis';

const Hero = dynamic(() => import('@/components/hero/hero'), { ssr: false });
const AboutSection = dynamic(() => import('@/components/about/about'));
const ExperienceSection = dynamic(() => import('@/components/experience/experience'));
const SkillsSection = dynamic(() => import('@/components/skills/skills'));
const ProjectsSection = dynamic(() => import('@/components/projects/projects'));
const GitHubSection = dynamic(() => import('@/components/github/github'));
const PhotographySection = dynamic(() => import('@/components/photography/photography'));
const BlogSection = dynamic(() => import('@/components/blog/blog'));
const ContactSection = dynamic(() => import('@/components/contact/contact'));
const Footer = dynamic(() => import('@/components/footer/footer'));

export default function Home() {
  useLenis();

  return (
    <>
      <Hero />
      <div className="relative z-10">
        <AboutSection />
        <ExperienceSection />
        <SkillsSection />
        <ProjectsSection />
        <GitHubSection />
        <PhotographySection />
        <BlogSection />
        <ContactSection />
      </div>
      <Footer />
    </>
  );
}
