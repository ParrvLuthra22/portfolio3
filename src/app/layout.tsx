import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Parrv Luthra — Software Engineer',
  description:
    'Software Engineer building immersive digital experiences. Full-stack development, creative coding, and scalable systems.',
  keywords: ['Software Engineer', 'Full Stack Developer', 'React', 'Next.js', 'Three.js'],
  authors: [{ name: 'Parrv Luthra' }],
  openGraph: {
    title: 'Parrv Luthra — Software Engineer',
    description: 'Building immersive digital experiences from scalable systems to pixel-perfect interfaces.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain">{children}</body>
    </html>
  );
}
