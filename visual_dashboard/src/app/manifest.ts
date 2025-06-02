import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Honkai: Star Rail Character Stats Analysis',
    short_name: 'HSR Stats',
    description: 'Analyze Honkai: Star Rail characters stats based on different scenarios or their abilities.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#06b6d4', // Cyan color from your gradient
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      }
    ],
    categories: ['games', 'utilities', 'entertainment', 'Honkai: Star Rail', 'hsr', 'hoyoverse', 'gacha'],
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en',
  }
}