import type { MetadataRoute } from 'next';
import deMessages from '@/messages/de.json';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: deMessages.manifest.name,
    short_name: deMessages.manifest.shortName,
    description: deMessages.manifest.description,
    start_url: '/',
    scope: '/',
    id: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0b0b0f',
    theme_color: '#9C1180',
    categories: ['finance', 'productivity'],
    lang: 'de-DE',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
