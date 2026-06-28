'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

import Loader from '@/components/Loader';
import Navigation from '@/components/Navigation';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import Experience from '@/components/sections/Experience';
import Contact from '@/components/sections/Contact';

const SmoothScroll = dynamic(() => import('@/components/SmoothScroll'), {
  ssr: false,
});

const CustomCursor = dynamic(() => import('@/components/CustomCursor'), {
  ssr: false,
});

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Loader onComplete={() => setLoaded(true)} />
      <CustomCursor />

      <SmoothScroll>
        <Navigation visible={loaded} />
        <main>
          <Hero />
          <About />
          <Projects />
          <Experience />
          <Contact />
        </main>
      </SmoothScroll>
    </>
  );
}
