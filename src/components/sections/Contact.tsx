'use client';

import { motion } from 'framer-motion';

const socials = [
  { label: 'GitHub', handle: '@parrvluthra', href: 'https://github.com/parrvluthra' },
  { label: 'LinkedIn', handle: 'parrvluthra', href: 'https://linkedin.com/in/parrvluthra' },
  { label: 'Twitter', handle: '@parrvluthra', href: 'https://twitter.com/parrvluthra' },
  { label: 'Email', handle: 'hello@parrv.dev', href: 'mailto:hello@parrv.dev' },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden"
      style={{
        padding: 'clamp(80px, 12vw, 160px) clamp(24px, 6vw, 80px)',
        borderTop: '1px solid rgba(255,69,0,0.08)',
      }}
    >
      {/* Background glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-200px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,69,0,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Label */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '10px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: '#FF4500',
          marginBottom: '60px',
        }}
      >
        [ 04 — Contact ]
      </motion.div>

      {/* Big headline */}
      <div style={{ marginBottom: '80px' }}>
        {[
          { text: "Let's Build", color: '#F5F5F5', delay: 0 },
          { text: 'Something', color: '#FF4500', delay: 0.1 },
          { text: 'Remarkable.', color: 'rgba(245,245,245,0.15)', delay: 0.2 },
        ].map(({ text, color, delay }) => (
          <motion.h2
            key={text}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -60px 0px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(52px, 9vw, 120px)',
              fontWeight: 700,
              color,
              letterSpacing: '-0.04em',
              lineHeight: 0.95,
              display: 'block',
              marginBottom: '4px',
            }}
          >
            {text}
          </motion.h2>
        ))}
      </div>

      {/* CTA email button */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.4 }}
        style={{ marginBottom: '80px' }}
      >
        <a
          href="mailto:hello@parrv.dev"
          className="group inline-flex items-center gap-4"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(16px, 2vw, 22px)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: '#F5F5F5',
            textDecoration: 'none',
            padding: '18px 36px',
            border: '1px solid rgba(255,69,0,0.3)',
            borderRadius: '3px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'border-color 0.3s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = '#FF4500';
            (e.currentTarget.querySelector('.cta-bg') as HTMLElement)?.setAttribute(
              'style',
              'transform: scaleX(1)'
            );
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,69,0,0.3)';
            (e.currentTarget.querySelector('.cta-bg') as HTMLElement)?.setAttribute(
              'style',
              'transform: scaleX(0)'
            );
          }}
        >
          <div
            className="cta-bg absolute inset-0"
            style={{
              background: '#FF4500',
              transform: 'scaleX(0)',
              transformOrigin: 'left',
              transition: 'transform 0.4s cubic-bezier(0.76, 0, 0.24, 1)',
              zIndex: 0,
            }}
          />
          <span className="relative z-10">hello@parrv.dev</span>
          <span className="relative z-10" style={{ opacity: 0.5 }}>
            ↗
          </span>
        </a>
      </motion.div>

      {/* Social links */}
      <div
        className="grid gap-0"
        style={{ borderTop: '1px solid rgba(255,69,0,0.08)' }}
      >
        {socials.map((social, i) => (
          <motion.a
            key={social.label}
            href={social.href}
            target={social.href.startsWith('mailto') ? undefined : '_blank'}
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group flex items-center justify-between"
            style={{
              padding: '24px 0',
              borderBottom: '1px solid rgba(255,69,0,0.08)',
              textDecoration: 'none',
              transition: 'padding-left 0.3s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.paddingLeft = '12px';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.paddingLeft = '0px';
            }}
          >
            <div className="flex items-center gap-6">
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '10px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#FF4500',
                  fontWeight: 600,
                  minWidth: '80px',
                }}
              >
                {social.label}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(18px, 2.4vw, 28px)',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  color: 'rgba(245,245,245,0.5)',
                  transition: 'color 0.3s ease',
                }}
              >
                {social.handle}
              </span>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '18px',
                color: 'rgba(255,69,0,0)',
                transform: 'translateX(-8px)',
                transition: 'all 0.3s ease',
              }}
              className="group-hover:!text-[#FF4500] group-hover:!translate-x-0"
            >
              ↗
            </span>
          </motion.a>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="flex items-center justify-between flex-wrap gap-4"
        style={{ marginTop: '48px' }}
      >
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(245,245,245,0.2)',
          }}
        >
          © 2025 Parrv Luthra — All rights reserved
        </span>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(245,245,245,0.2)',
          }}
        >
          Built with Next.js + Three.js
        </span>
      </motion.div>
    </section>
  );
}
