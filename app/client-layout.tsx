'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/layout/navbar';
import LoadingScreen from '@/components/loading/screen';

const GlowCursor = dynamic(() => import('@/components/cursor/glow-cursor'), {
  ssr: false,
});
const BackgroundStars = dynamic(
  () => import('@/components/three/background-stars'),
  { ssr: false }
);
const MusicPlayer = dynamic(
  () => import('@/components/music-player/music-player'),
  { ssr: false }
);

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <LoadingScreen />

      {mounted && (
        <>
          <GlowCursor />
          <BackgroundStars />
        </>
      )}

      <Navbar />

      <main className="relative z-10">{children}</main>

      {mounted && <MusicPlayer />}

      {/* Noise overlay */}
      <div className="noise-overlay" />
    </>
  );
}
