'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const circleX = useSpring(dotX, { stiffness: 80, damping: 20 });
  const circleY = useSpring(dotY, { stiffness: 80, damping: 20 });
  const isHovering = useRef(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const moveCursor = (e: MouseEvent) => {
  //     dotX.set(e.clientX);
  //     dotY.set(e.clientY);
  //   };

    const handleHoverIn = () => {
      isHovering.current = true;
      dotRef.current?.classList.add('scale-0');
      circleRef.current?.classList.add('scale-150', '!border-accent');
    };

    const handleHoverOut = () => {
      isHovering.current = false;
      dotRef.current?.classList.remove('scale-0');
      circleRef.current?.classList.remove('scale-150', '!border-accent');
    };

    const interactives = document.querySelectorAll('a, button, [data-cursor]');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', handleHoverIn);
      el.addEventListener('mouseleave', handleHoverOut);
    });

    window.addEventListener('mousemove', moveCursor);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', handleHoverIn);
        el.removeEventListener('mouseleave', handleHoverOut);
      });
    };
  }, [dotX, dotY]);

  return (
    <>
      {/* Inner dot */}
      <motion.div
        ref={dotRef}
        className="fixed z-[9999] pointer-events-none"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: '#FF4500',
          transition: 'transform 0.15s ease',
        }}
      />
      {/* Outer ring */}
      <motion.div
        ref={circleRef}
        className="fixed z-[9998] pointer-events-none"
        style={{
          x: circleX,
          y: circleY,
          translateX: '-50%',
          translateY: '-50%',
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '1.5px solid rgba(255, 69, 0, 0.5)',
          transition: 'transform 0.3s ease, border-color 0.3s ease',
        }}
      />
    </>
  );
}
