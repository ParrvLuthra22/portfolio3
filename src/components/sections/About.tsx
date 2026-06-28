'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { skills } from '@/data/experience';

const bio = [
  "I'm Parrv — a software engineer who obsesses over the intersection of engineering and experience.",
  "I build products that are fast, beautiful, and delightfully human. Whether it's a 3D web experience, a distributed backend, or a CLI tool — I care deeply about the craft.",
  "Currently open to full-time roles, freelance projects, and interesting collaborations.",
];

function AnimatedWord({ word, index }: { word: string; index: number }) {
  return (
    <motion.span
      initial={{ opacity: 0.1, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.5, delay: index * 0.015, ease: 'easeOut' }}
      style={{ display: 'inline-block', marginRight: '0.28em' }}
    >
      {word}
    </motion.span>
  );
}

function SkillPill({ label, i }: { label: string; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: i * 0.04, ease: 'backOut' }}
      whileHover={{ scale: 1.05, color: '#FF4500', borderColor: '#FF4500' }}
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        padding: '6px 14px',
        border: '1px solid rgba(255,69,0,0.2)',
        borderRadius: '2px',
        color: 'rgba(245,245,245,0.55)',
        cursor: 'default',
        transition: 'all 0.25s ease',
      }}
    >
      {label}
    </motion.div>
  );
}

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20% 0px' });

  const allSkills = [
    ...skills.languages,
    ...skills.frontend,
    ...skills.backend,
    ...skills.infra,
  ];

  return (
    <section
      id="about"
      ref={ref}
      className="relative"
      style={{
        padding: 'clamp(80px, 10vw, 140px) clamp(24px, 6vw, 80px)',
        borderTop: '1px solid rgba(255,69,0,0.08)',
      }}
    >
      {/* Section label */}
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
        [ 01 — About ]
      </motion.div>

      <div
        className="grid gap-16 md:gap-24"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))' }}
      >
        {/* Bio */}
        <div>
          {bio.map((paragraph, pi) => (
            <p
              key={pi}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(20px, 2.4vw, 30px)',
                fontWeight: 600,
                lineHeight: 1.45,
                letterSpacing: '-0.02em',
                color: pi === 0 ? '#F5F5F5' : 'rgba(245,245,245,0.5)',
                marginBottom: pi < bio.length - 1 ? '2em' : 0,
              }}
            >
              {paragraph.split(' ').map((word, wi) => (
                <AnimatedWord key={wi} word={word} index={pi * 30 + wi} />
              ))}
            </p>
          ))}

          {/* CTA links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center gap-6 flex-wrap"
            style={{ marginTop: '48px' }}
          >
            {[
              { label: 'GitHub', href: 'https://github.com/parrvluthra' },
              { label: 'LinkedIn', href: 'https://linkedin.com/in/parrvluthra' },
              { label: 'Twitter', href: 'https://twitter.com/parrvluthra' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,245,245,0.4)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = '#FF4500')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color =
                    'rgba(245,245,245,0.4)')
                }
              >
                {link.label}
                <span style={{ opacity: 0.4 }}>↗</span>
              </a>
            ))}
          </motion.div>
        </div>

        {/* Skills */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(245,245,245,0.25)',
              marginBottom: '24px',
            }}
          >
            Tech Stack
          </motion.div>

          <div className="flex flex-wrap gap-2">
            {allSkills.map((skill, i) => (
              <SkillPill key={skill} label={skill} i={i} />
            ))}
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-3 gap-6"
            style={{ marginTop: '48px' }}
          >
            {[
              { num: '3+', label: 'Years building' },
              { num: '20+', label: 'Projects shipped' },
              { num: '∞', label: 'Coffee consumed' },
            ].map(({ num, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(32px, 4vw, 48px)',
                    fontWeight: 700,
                    color: '#FF4500',
                    lineHeight: 1,
                    letterSpacing: '-0.03em',
                  }}
                >
                  {num}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'rgba(245,245,245,0.3)',
                    marginTop: '6px',
                  }}
                >
                  {label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
