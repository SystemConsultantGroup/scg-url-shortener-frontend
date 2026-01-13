'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  children: React.ReactNode;
  className?: string;
}

export default function TextReveal({ children, className = '' }: TextRevealProps) {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Split text logic could go here if using SplitType, but for now simple reveal
      gsap.fromTo(
        textRef.current,
        { y: '100%', opacity: 0, rotate: 5 },
        {
          y: '0%',
          opacity: 1,
          rotate: 0,
          duration: 1.5,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: container.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className={`overflow-hidden ${className}`}>
      <div ref={textRef} className="will-change-transform">
        {children}
      </div>
    </div>
  );
}
