// ============================================================
// Types
// ============================================================

export interface Profile {
  name: string;
  title: string;
  subtitle: string;
  bio: string;
  avatar: string;
  location: string;
  email: string;
  social: Social[];
  available: boolean;
  resumeUrl?: string;
}

export interface Social {
  name: string;
  url: string;
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  cover: string;
  tech: string[];
  github?: string;
  demo?: string;
  featured?: boolean;
  year?: number;
  category?: string;
}

export interface Skill {
  name: string;
  icon: string;
  category: string;
  level?: number;
  color?: string;
  description?: string;
  years?: number;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  description: string;
  tech: string[];
  highlights?: string[];
  logo?: string;
  type: 'work' | 'education' | 'freelance';
}

export interface Photo {
  id: string;
  src: string;
  thumbnail?: string;
  title: string;
  description?: string;
  category: 'landscape' | 'street' | 'portrait' | 'night' | 'travel';
  location?: string;
  date?: string;
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  iso?: string;
  shutterSpeed?: string;
  width?: number;
  height?: number;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  src: string;
  cover?: string;
  duration?: number;
  genre?: string;
}

export interface GitHubData {
  username: string;
  avatar: string;
  name: string;
  bio: string;
  followers: number;
  following: number;
  publicRepos: number;
  contributions: ContributionDay[];
  pinnedRepos: GitHubRepo[];
  recentRepos: GitHubRepo[];
  languages: LanguageStat[];
}

export interface GitHubRepo {
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language: string;
  topics: string[];
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface LanguageStat {
  name: string;
  percentage: number;
  color: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: number;
  tags: string[];
  slug: string;
  cover?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
  subject?: string;
}

// Navigation
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

// Shadcn UI types
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline' | 'secondary' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
  asChild?: boolean;
}
