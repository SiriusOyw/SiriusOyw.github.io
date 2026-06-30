'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Camera, MapPin, Maximize2 } from 'lucide-react';
import SectionWrapper from '@/components/layout/section-wrapper';
import { stopLenis, startLenis } from '@/lib/lenis';
import type { Photo } from '@/types';

const categories = [
  { id: 'all', label: '全部' },
  { id: 'landscape', label: '风光' },
  { id: 'street', label: '街拍' },
  { id: 'portrait', label: '人像' },
  { id: 'night', label: '夜景' },
  { id: 'travel', label: '旅行' },
];

export default function PhotographySection() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    fetch('/api/photos')
      .then((r) => r.json())
      .then(setPhotos)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (lightbox) {
      stopLenis();
      document.body.style.overflow = 'hidden';
    } else {
      startLenis();
      document.body.style.overflow = '';
    }
    return () => { startLenis(); document.body.style.overflow = ''; };
  }, [lightbox]);

  const filteredPhotos =
    activeCategory === 'all'
      ? photos
      : photos.filter((p) => p.category === activeCategory);

  const openLightbox = (photo: Photo) => {
    const idx = filteredPhotos.findIndex((p) => p.id === photo.id);
    setLightboxIndex(idx);
    setLightbox(photo);
    setFullscreen(false);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    const newIdx =
      direction === 'prev'
        ? (lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length
        : (lightboxIndex + 1) % filteredPhotos.length;
    setLightboxIndex(newIdx);
    setLightbox(filteredPhotos[newIdx]);
  };

  return (
    <SectionWrapper
      id="photography"
      title="摄影作品"
      subtitle="用镜头捕捉时光的痕迹"
    >
      {/* Category filter */}
      <div className="mb-10 flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`rounded-xl px-4 py-2 text-xs font-medium transition-all duration-300 ${
              activeCategory === cat.id
                ? 'bg-primary text-primary-foreground'
                : 'glass hover:bg-accent/50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Featured hero photo */}
      {filteredPhotos.length > 0 && (
        <div
          onClick={() => openLightbox(filteredPhotos[0])}
          className="group relative mb-6 cursor-pointer overflow-hidden rounded-2xl"
        >
          <img
            src={filteredPhotos[0].thumbnail || filteredPhotos[0].src}
            alt={filteredPhotos[0].title}
            loading="lazy"
            className="h-[360px] w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-[480px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-xl font-semibold text-white">{filteredPhotos[0].title}</p>
              <p className="mt-1 text-sm text-white/70">{filteredPhotos[0].description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Grid layout */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {filteredPhotos.slice(1).map((photo, idx) => (
          <div
            key={photo.id}
            onClick={() => openLightbox(photo)}
            className={`group relative cursor-pointer overflow-hidden rounded-2xl ${
              idx % 5 === 0 ? 'col-span-2 row-span-2' : ''
            }`}
          >
            <img
              src={photo.thumbnail || photo.src}
              alt={photo.title}
              loading="lazy"
              className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                idx % 5 === 0 ? 'h-[400px]' : 'h-[200px]'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-sm font-medium text-white truncate">{photo.title}</p>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-white/60">
                  {photo.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {photo.location}
                    </span>
                  )}
                  {photo.camera && (
                    <span className="flex items-center gap-1">
                      <Camera className="h-3 w-3" />
                      {photo.camera.split(' ').slice(0, 1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl"
            onClick={() => setLightbox(null)}
          >
            <div className="relative flex h-full w-full items-center justify-center">
              <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4">
                <span className="text-xs text-muted-foreground">{lightboxIndex + 1} / {filteredPhotos.length}</span>
                <div className="flex items-center gap-3">
                  <button onClick={(e) => { e.stopPropagation(); setFullscreen(!fullscreen); }} className="flex h-10 w-10 items-center justify-center rounded-full glass hover:bg-accent/50 transition-colors">
                    <Maximize2 className="h-4 w-4" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setLightbox(null); }} className="flex h-10 w-10 items-center justify-center rounded-full glass hover:bg-accent/50 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {filteredPhotos.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }} className="absolute left-4 top-1/2 z-30 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full glass hover:bg-accent/50 transition-colors">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }} className="absolute right-4 top-1/2 z-30 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full glass hover:bg-accent/50 transition-colors">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
              <motion.div
                key={lightbox.id}
                initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => e.stopPropagation()}
                className={`flex flex-col items-center justify-center pointer-events-none ${fullscreen ? 'absolute inset-0' : 'relative max-h-[96vh] max-w-[96vw]'}`}
              >
                <img src={lightbox.src} alt={lightbox.title}
                  className={`pointer-events-auto ${fullscreen ? 'h-full w-full object-contain p-14' : 'max-h-[85vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl'}`}
                  style={{ backgroundColor: 'hsl(var(--muted))' }} />
                {!fullscreen && (
                  <div className="pointer-events-auto glass-strong mt-4 w-full max-w-4xl rounded-2xl p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold truncate">{lightbox.title}</h3>
                        {lightbox.description && <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">{lightbox.description}</p>}
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground flex-shrink-0">
                        {lightbox.camera && <span>{lightbox.camera}</span>}
                        {lightbox.focalLength && <span>{lightbox.focalLength}</span>}
                        {lightbox.aperture && <span>{lightbox.aperture}</span>}
                        {lightbox.iso && <span>ISO {lightbox.iso}</span>}
                        {lightbox.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{lightbox.location}</span>}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}
