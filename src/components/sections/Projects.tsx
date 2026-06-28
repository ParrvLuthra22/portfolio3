'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '@/data/projects';

gsap.registerPlugin(ScrollTrigger);

function ProjectCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative flex-shrink-0 group"
      style={{
        width: 'clamp(300px, 34vw, 460px)',
        padding: '40px 36px',
        border: '1px solid rgba(255,69,0,0.12)',
        borderRadius: '4px',
        background: 'rgba(255,69,0,0.02)',
        overflow: 'hidden',
        cursor: 'none',
      }}
    >
      {/* Hover background */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,69,0,0.06) 0%, transparent 70%)',
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Top row */}
      <div className="flex items-start justify-between" style={{ marginBottom: '32px' }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '11px',
            letterSpacing: '0.2em',
            color: '#FF4500',
            fontWeight: 600,
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '10px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(245,245,245,0.25)',
            border: '1px solid rgba(255,69,0,0.15)',
            padding: '3px 10px',
            borderRadius: '2px',
          }}
        >
          {project.category}
        </span>
      </div>

      {/* Preview image */}
      <div
        className="overflow-hidden"
        style={{
          height: '180px',
          borderRadius: '3px',
          background: 'rgba(255,69,0,0.05)',
          border: '1px solid rgba(255,69,0,0.1)',
          marginBottom: '28px',
          position: 'relative',
        }}
      >
        {/* Gradient placeholder for image */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg,
              rgba(255,69,0,${0.08 + index * 0.04}) 0%,
              rgba(10,10,10,0.95) 100%)`,
          }}
        />
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '48px',
            fontWeight: 700,
            color: 'rgba(255,69,0,0.12)',
            letterSpacing: '-0.04em',
          }}
        >
          {project.title.substring(0, 2).toUpperCase()}
        </div>
        {/* Scan line */}
        <motion.div
          className="absolute left-0 right-0"
          style={{
            height: '1px',
            background:
              'linear-gradient(to right, transparent, rgba(255,69,0,0.4), transparent)',
            top: 0,
          }}
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: index * 0.5 }}
        />
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(22px, 2.4vw, 30px)',
          fontWeight: 700,
          color: '#F5F5F5',
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          marginBottom: '12px',
        }}
      >
        {project.title}
      </h3>

      {/* Description */}
      <p
        className="line-clamp-2"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          lineHeight: 1.7,
          color: 'rgba(245,245,245,0.4)',
          marginBottom: '24px',
        }}
      >
        {project.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2" style={{ marginBottom: '28px' }}>
        {project.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '3px 10px',
              background: 'rgba(255,69,0,0.08)',
              border: '1px solid rgba(255,69,0,0.15)',
              borderRadius: '2px',
              color: 'rgba(245,245,245,0.5)',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Links */}
      <div
        className="flex items-center gap-6"
        style={{
          borderTop: '1px solid rgba(255,69,0,0.1)',
          paddingTop: '20px',
        }}
      >
        <a
          href={project.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#FF4500',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          Live Demo ↗
        </a>
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(245,245,245,0.35)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'color 0.3s',
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color = '#F5F5F5')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color = 'rgba(245,245,245,0.35)')
          }
        >
          GitHub ↗
        </a>
        <span
          style={{
            marginLeft: 'auto',
            fontFamily: 'var(--font-body)',
            fontSize: '10px',
            letterSpacing: '0.15em',
            color: 'rgba(245,245,245,0.2)',
          }}
        >
          {project.year}
        </span>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const totalWidth = track.scrollWidth - window.innerWidth + 160;

      gsap.to(track, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1.5,
          end: () => `+=${totalWidth}`,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,69,0,0.08)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-end justify-between"
        style={{
          padding: 'clamp(60px, 8vw, 100px) clamp(24px, 6vw, 80px) 0',
          paddingBottom: '48px',
        }}
      >
        <div>
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
              marginBottom: '12px',
            }}
          >
            [ 02 — Selected Work ]
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, 6vw, 80px)',
              fontWeight: 700,
              color: '#F5F5F5',
              letterSpacing: '-0.04em',
              lineHeight: 0.95,
            }}
          >
            Projects
          </motion.h2>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(245,245,245,0.25)',
          }}
        >
          Drag or scroll →
        </motion.div>
      </div>

      {/* Horizontal scroll track */}
      <div
        ref={trackRef}
        className="flex items-center gap-6"
        style={{
          padding: '0 clamp(24px, 6vw, 80px) clamp(60px, 8vw, 100px)',
          willChange: 'transform',
        }}
      >
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}

        {/* End CTA card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex-shrink-0 flex flex-col items-center justify-center text-center"
          style={{
            width: 'clamp(260px, 28vw, 360px)',
            height: '360px',
            border: '1px dashed rgba(255,69,0,0.2)',
            borderRadius: '4px',
            padding: '40px',
            cursor: 'none',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 3.5vw, 44px)',
              fontWeight: 700,
              color: 'rgba(245,245,245,0.15)',
              letterSpacing: '-0.03em',
              marginBottom: '16px',
            }}
          >
            More on GitHub
          </div>
          <a
            href="https://github.com/parrvluthra"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#FF4500',
              textDecoration: 'none',
            }}
          >
            View All ↗
          </a>
        </motion.div>
      </div>
    </section>
  );
}
