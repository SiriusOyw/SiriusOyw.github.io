import type {
  Profile,
  Project,
  Skill,
  Experience,
  Photo,
  MusicTrack,
  GitHubData,
  ContactForm,
} from '@/types';

const BASE_URL = '/api';

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  return res.json();
}

export const api = {
  profile: {
    get: () => fetchJSON<Profile>(`${BASE_URL}/profile`),
  },

  projects: {
    list: () => fetchJSON<Project[]>(`${BASE_URL}/projects`),
    get: (id: string) => fetchJSON<Project>(`${BASE_URL}/projects?id=${id}`),
  },

  skills: {
    list: () => fetchJSON<Skill[]>(`${BASE_URL}/skills`),
  },

  experience: {
    list: () => fetchJSON<Experience[]>(`${BASE_URL}/experience`),
  },

  photos: {
    list: () => fetchJSON<Photo[]>(`${BASE_URL}/photos`),
    get: (id: string) => fetchJSON<Photo>(`${BASE_URL}/photos?id=${id}`),
  },

  music: {
    list: () => fetchJSON<MusicTrack[]>(`${BASE_URL}/music`),
  },

  github: {
    get: () => fetchJSON<GitHubData>(`${BASE_URL}/github`),
  },

  contact: {
    send: (data: ContactForm) =>
      fetch(`${BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
  },
};
