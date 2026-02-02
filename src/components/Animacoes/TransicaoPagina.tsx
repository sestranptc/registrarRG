import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface TransicaoPaginaProps {
  children: React.ReactNode;
}

export const TransicaoPagina: React.FC<TransicaoPaginaProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(containerRef.current!.children, 
          {
            y: 30,
            opacity: 0
          },
          {
            duration: 0.6,
            y: 0,
            opacity: 1,
            stagger: 0.1,
            ease: 'power2.out'
          }
        );
      }, containerRef);

      return () => ctx.revert();
    }
  }, []);

  return (
    <div ref={containerRef} className="transicao-pagina">
      {children}
    </div>
  );
};