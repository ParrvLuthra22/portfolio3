'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const links = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation({ visible }: { visible: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-10"
      style={{ height: '60px' }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -20 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Background blur when scrolled */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: scrolled
            ? 'rgba(10, 10, 10, 0.85)'
            : 'rgba(10, 10, 10, 0)',
          backdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)',
          borderBottom: scrolled
            ? '1px solid rgba(255, 69, 0, 0.1)'
            : '1px solid transparent',
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Logo */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="relative z-10"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '20px',
          fontWeight: 700,
          color: '#F5F5F5',
          letterSpacing: '-0.02em',
        }}
      >
        P<span style={{ color: '#FF4500' }}>.</span>
      </button>

      {/* Links */}
      <div className="relative z-10 flex items-center gap-8">
        {links.map((link) => (
          <button
            key={link.href}
            onClick={() => handleNav(link.href)}
            className="group relative"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(245,245,245,0.5)',
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLElement).style.color = '#FF4500')
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLElement).style.color = 'rgba(245,245,245,0.5)')
            }
          >
            {link.label}
          </button>
        ))}

        <a
          href="mailto:hello@parrv.dev"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#0A0A0A',
            background: '#FF4500',
            padding: '8px 16px',
            borderRadius: '2px',
            fontWeight: 600,
            transition: 'opacity 0.2s ease',
            textDecoration: 'none',
          }}
        >
          Hire Me
        </a>
      </div>
    </motion.nav>
  );
}
