import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'trakappli - Job Application Tracker',
        short_name: 'trakappli',
        description: 'Track and manage your job applications efficiently with AI-powered insights',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#2563eb',
        icons: [
            {
                src: '/favicon/web-app-manifest-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/favicon/web-app-manifest-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
    };
}
