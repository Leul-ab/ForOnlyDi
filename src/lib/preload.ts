// lib/preload.ts
const audioCache = new Map<string, HTMLAudioElement>();

export function preloadAudio(src: string) {
  if (audioCache.has(src)) return;
  const audio = new Audio(src);
  audio.preload = "auto";
  audioCache.set(src, audio);
}

export function getPreloadedAudio(src: string) {
  return audioCache.get(src);
}

export function preloadImage(src: string) {
  const img = new Image();
  img.src = src;
}
