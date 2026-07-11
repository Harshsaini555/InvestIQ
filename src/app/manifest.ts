import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'InvestIQ Investment Intelligence Agent',
    short_name: 'InvestIQ',
    description: 'Production-grade automated equity analysis and pipeline orchestration engine.',
    start_url: '/',
    display: 'standalone',
    background_color: '#030303',
    theme_color: '#0070f3',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
