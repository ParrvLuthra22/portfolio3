'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const duration = 2200;
    const interval = 20;
    const steps = duration / interval;
    let current = 0;

    const timer = setInterval(() => {
      current += 1;
      const eased = Math.round(Math.pow(current / steps, 0.6) * 100);
      setCount(Math.min(eased, 100));

      if (current >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(onComplete, 800);
        }, 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: '#0A0A0A' }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Number */}
          <div
            className="font-display select-none"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(80px, 18vw, 200px)',
              fontWeight: 700,
              color: '#F5F5F5',
              lineHeight: 1,
              letterSpacing: '-0.04em',
            }}
          >
            <span style={{ color: '#FF4500' }}>
              {String(count).padStart(2, '0')}
            </span>
            <span style={{ color: 'rgba(245,245,245,0.2)' }}>%</span>
          </div>

          {/* Progress bar */}
          <div
            className="absolute bottom-0 left-0 h-[2px]"
            style={{ background: 'rgba(255,69,0,0.15)', width: '100%' }}
          >
            <motion.div
              className="h-full"
              style={{ background: '#FF4500' }}
              initial={{ width: '0%' }}
              animate={{ width: `${count}%` }}
              transition={{ ease: 'linear', duration: 0 }}
            />
          </div>

          {/* Label */}
          <div
            className="absolute bottom-8 left-8"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: 'rgba(245,245,245,0.3)',
              textTransform: 'uppercase',
            }}
          >
            Initializing
          </div>

          <div
            className="absolute bottom-8 right-8"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: 'rgba(245,245,245,0.3)',
              textTransform: 'uppercase',
            }}
          >
            Parrv © 2025
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
