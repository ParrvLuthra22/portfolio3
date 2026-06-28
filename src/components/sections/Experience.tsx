'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { experiences, skills } from '@/data/experience';

function ExperienceItem({
  exp,
  index,
}: {
  exp: (typeof experiences)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15% 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      className="grid gap-4 md:gap-0"
      style={{
        gridTemplateColumns: 'auto 1fr',
        paddingBottom: '40px',
        marginBottom: '40px',
        borderBottom:
          index < experiences.length - 1
            ? '1px solid rgba(255,69,0,0.08)'
            : 'none',
      }}
    >
      {/* Left: number + line */}
      <div
        className="flex flex-col items-center"
        style={{ paddingRight: '32px', paddingTop: '4px' }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            color: '#FF4500',
            marginBottom: '12px',
            whiteSpace: 'nowrap',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </div>
        {index < experiences.length - 1 && (
          <motion.div
            style={{
              width: '1px',
              flex: 1,
              background: 'rgba(255,69,0,0.2)',
              minHeight: '40px',
            }}
            initial={{ scaleY: 0, originY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
          />
        )}
      </div>

      {/* Right: content */}
      <div>
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4" style={{ marginBottom: '16px' }}>
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(22px, 2.6vw, 32px)',
                fontWeight: 700,
                color: '#F5F5F5',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
              }}
            >
              {exp.role}
            </h3>
            <div className="flex items-center gap-3" style={{ marginTop: '6px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  color: '#FF4500',
                  fontWeight: 500,
                }}
              >
                {exp.company}
              </span>
              <span style={{ color: 'rgba(245,245,245,0.2)' }}>—</span>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: 'rgba(245,245,245,0.35)',
                }}
              >
                {exp.location}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(245,245,245,0.3)',
                border: '1px solid rgba(255,69,0,0.15)',
                padding: '4px 12px',
                borderRadius: '2px',
              }}
            >
              {exp.type}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                color: 'rgba(245,245,245,0.3)',
                whiteSpace: 'nowrap',
              }}
            >
              {exp.period}
            </span>
          </div>
        </div>

        {/* Bullets */}
        <ul style={{ listStyle: 'none' }}>
          {exp.description.map((bullet, bi) => (
            <li
              key={bi}
              className="flex items-start gap-3"
              style={{ marginBottom: bi < exp.description.length - 1 ? '10px' : 0 }}
            >
              <span style={{ color: '#FF4500', marginTop: '2px', flexShrink: 0 }}>
                ›
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  lineHeight: 1.7,
                  color: 'rgba(245,245,245,0.5)',
                }}
              >
                {bullet}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  return (
    <section
      id="experience"
      style={{
        padding: 'clamp(80px, 10vw, 140px) clamp(24px, 6vw, 80px)',
        borderTop: '1px solid rgba(255,69,0,0.08)',
      }}
    >
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
        [ 03 — Experience ]
      </motion.div>

      <div
        className="grid gap-16 lg:gap-24"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 560px), 1fr))',
          alignItems: 'start',
        }}
      >
        {/* Experience list */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px, 5vw, 68px)',
              fontWeight: 700,
              color: '#F5F5F5',
              letterSpacing: '-0.04em',
              lineHeight: 0.95,
              marginBottom: '56px',
            }}
          >
            Where I've
            <br />
            <span style={{ color: '#FF4500' }}>worked</span>
          </motion.h2>

          {experiences.map((exp, i) => (
            <ExperienceItem key={exp.id} exp={exp} index={i} />
          ))}
        </div>

        {/* Skills breakdown */}
        <div style={{ paddingTop: '8px' }}>
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
              marginBottom: '32px',
            }}
          >
            Capabilities
          </motion.div>

          {Object.entries(skills).map(([category, items], ci) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: ci * 0.08 }}
              style={{
                paddingBottom: '24px',
                marginBottom: '24px',
                borderBottom: ci < Object.keys(skills).length - 1
                  ? '1px solid rgba(255,69,0,0.07)'
                  : 'none',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#FF4500',
                  marginBottom: '12px',
                  fontWeight: 600,
                }}
              >
                {category}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: 'rgba(245,245,245,0.45)',
                  lineHeight: 1.8,
                }}
              >
                {items.join(' · ')}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
