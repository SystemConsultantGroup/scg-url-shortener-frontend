'use client';

import { ReactLenis } from 'lenis/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRightIcon } from '@phosphor-icons/react';
import HeroScene from '@/app/components/3d/HeroScene';
import MagneticButton from '@/app/components/ui/MagneticButton';

export default function Home() {
  return (
    <ReactLenis root>
      <div className="relative min-h-screen">
        {/* Navigation */}
        <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-8 py-6 mix-blend-difference">
          <Link href="/" className="z-50 text-2xl font-bold tracking-tighter text-white">
            LinkSnap.
          </Link>
          <div className="hidden gap-2 md:flex">
            <Link href="/auth">
              <MagneticButton variant="ghost" className="text-white hover:text-white/80">
                Sign In
              </MagneticButton>
            </Link>
            <Link href="/auth">
              <MagneticButton variant="primary" className="bg-white text-black hover:bg-white/90">
                Get Started
              </MagneticButton>
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
          <HeroScene />
          
          <div className="relative z-10 mx-auto max-w-[90vw] text-center md:max-w-4xl flex-1 flex flex-col justify-center">
            {/* Visually hidden but present for SEO */}
            <h1 className="sr-only">
              Shorten. Simplify.
            </h1>
            
            {/* Spacer to push content down below the 3D text area */}
            <div className="h-[40vh]" />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="flex flex-col items-center gap-6"
            >
              
              <div className="flex gap-4">
                <Link href="/auth">
                  <MagneticButton className="group flex items-center gap-2 bg-foreground text-background">
                    Start Free
                    <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
                  </MagneticButton>
                </Link>
              </div>
            </motion.div>
          </div>
          
          {/* Footer - moved inside the screen */}
          <footer className="relative z-10 w-full pb-8 text-center text-xs text-zinc-400">
            <p>© 2026 System Consultant Group All rights reserved.</p>
          </footer>
        </section>
      </div>
    </ReactLenis>
  );
}
