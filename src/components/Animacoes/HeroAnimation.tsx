import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface HeroAnimationProps {
  titulo: string;
  subtitulo: string;
}

export const HeroAnimation: React.FC<HeroAnimationProps> = ({ titulo, subtitulo }) => {
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const subtituloRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.from(tituloRef.current, {
      duration: 1,
      y: -50,
      opacity: 0,
      ease: 'power3.out'
    })
    .from(subtituloRef.current, {
      duration: 0.8,
      y: -30,
      opacity: 0,
      ease: 'power3.out'
    }, '-=0.5');

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="text-center mb-8">
      <h1 
        ref={tituloRef}
        className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
      >
        {titulo}
      </h1>
      <p 
        ref={subtituloRef}
        className="hero-subtitle text-lg md:text-xl text-blue-100 max-w-2xl mx-auto"
      >
        {subtitulo}
      </p>
    </div>
  );
};