'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, type Variants } from 'framer-motion';

const WireframeRoom = dynamic(
  () => import('../three/WireframeRoom'),
  { ssr: false }
);

const name = 'PARRV';

const sprung: [number, number, number, number] = [0.16, 1, 0.3, 1];
const smooth: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const letterVariants: Variants = {
  hidden: { y: 140, opacity: 0, rotateX: -90 },
  visible: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: { duration: 1, ease: sprung },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: smooth, delay },
  }),
};

function LiveTime() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'Asia/Kolkata',
        }) + ' IST'
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span>{time}</span>;
}

export default function Hero() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollDown = () => {
    const el = document.querySelector('#about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative flex flex-col overflow-hidden"
      style={{ height: '100svh', minHeight: '600px', background: '#0A0A0A' }}
    >
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <WireframeRoom />
      </div>

      {/* Radial vignette */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, #0A0A0A 100%)',
        }}
      />

      {/* Top metadata row */}
      <div
        className="relative z-10 flex items-center justify-between px-6 md:px-10"
        style={{ paddingTop: '70px' }}
      >
        <motion.div
          custom={0.8}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(245,245,245,0.35)',
          }}
        >
          [ Based in India ]
        </motion.div>
        <motion.div
          custom={0.9}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(245,245,245,0.35)',
          }}
        >
          <LiveTime />
        </motion.div>
      </div>

      {/* Center content */}
      <div
        className="relative z-10 flex flex-1 flex-col items-center justify-center px-6"
        style={{ perspective: '600px' }}
      >
        {/* Name */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center overflow-hidden"
          style={{ lineHeight: 0.9 }}
          aria-label={name}
        >
          {name.split('').map((letter, i) => (
            <motion.span
              key={i}
              variants={letterVariants}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(80px, 18vw, 220px)',
                fontWeight: 700,
                color: '#F5F5F5',
                letterSpacing: '-0.04em',
                display: 'inline-block',
                transformOrigin: 'bottom',
              }}
            >
              {letter === ' ' ? ' ' : letter}
            </motion.span>
          ))}
        </motion.div>

        {/* Subtitle row */}
        <div
          className="flex w-full items-center justify-between"
          style={{ maxWidth: '900px', marginTop: '12px' }}
        >
          <motion.div
            custom={1.0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(12px, 1.2vw, 14px)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(245,245,245,0.4)',
            }}
          >
            [ Portfolio 2025 ]
          </motion.div>

          <motion.div
            custom={1.1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(12px, 1.2vw, 14px)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(245,245,245,0.4)',
            }}
          >
            Software Engineer
          </motion.div>
        </div>

        {/* Orange line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.4, delay: 1.2, ease: [0.76, 0, 0.24, 1] }}
          style={{
            width: '100%',
            maxWidth: '900px',
            height: '1px',
            background: 'rgba(255,69,0,0.3)',
            marginTop: '24px',
            transformOrigin: 'left',
          }}
        />

        {/* Tagline */}
        <motion.p
          custom={1.4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(13px, 1.3vw, 16px)',
            color: 'rgba(245,245,245,0.5)',
            maxWidth: '520px',
            textAlign: 'center',
            marginTop: '28px',
            lineHeight: 1.7,
          }}
        >
          Building immersive digital experiences — from scalable systems to
          pixel-perfect interfaces.
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="relative z-10 flex flex-col items-center pb-10"
      >
        <motion.button
          onClick={scrollDown}
          custom={1.8}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{ cursor: 'none' }}
          className="flex flex-col items-center gap-3"
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(245,245,245,0.25)',
            }}
          >
            Scroll
          </span>
          <motion.div
            style={{
              width: 1,
              background: 'linear-gradient(to bottom, #FF4500, transparent)',
              height: 50,
            }}
            animate={{ scaleY: [0, 1, 0], originY: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </motion.button>
      </div>
    </section>
  );
}
