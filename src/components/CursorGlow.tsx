import React, { useEffect, useRef } from 'react';

const CursorGlow = () => {
  const trailRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const dots = useRef<{ x: number; y: number }[]>(Array.from({ length: 25 }, () => ({ x: 0, y: 0 })));
  const mouse = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 });
  const glowPos = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 });
  const isHolding = useRef(false);

  useEffect(() => {
    let animationFrameId: number;
    let isActive = false;

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      mouse.current.x = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      mouse.current.y = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      if (!isActive) {
        dots.current.forEach(dot => {
          dot.x = mouse.current.x;
          dot.y = mouse.current.y;
        });
        glowPos.current = { x: mouse.current.x, y: mouse.current.y };
        isActive = true;
      }
    };

    const handleMouseDown = () => {
      isHolding.current = true;
      if (trailRef.current) {
        trailRef.current.style.opacity = '1';
      }
    };

    const handleMouseUp = () => {
      isHolding.current = false;
      if (trailRef.current) {
        trailRef.current.style.opacity = '0';
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('touchstart', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    window.addEventListener('touchend', handleMouseUp, { passive: true });
    window.addEventListener('touchcancel', handleMouseUp, { passive: true });

    const animate = () => {
      if (!isActive) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      // 1. Update slow glow
      glowPos.current.x += (mouse.current.x - glowPos.current.x) * 0.05;
      glowPos.current.y += (mouse.current.y - glowPos.current.y) * 0.05;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${glowPos.current.x}px, ${glowPos.current.y}px)`;
      }

      // 2. Update Trail
      let x = mouse.current.x;
      let y = mouse.current.y;

      dots.current.forEach((dot, index) => {
        dot.x += (x - dot.x) * 0.35;
        dot.y += (y - dot.y) * 0.35;

        const el = trailRef.current?.children[index] as HTMLElement;
        if (el) {
          const scale = 1 - (index / 25);
          el.style.transform = `translate(${dot.x}px, ${dot.y}px) scale(${scale})`;
        }
        x = dot.x;
        y = dot.y;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('touchstart', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('touchcancel', handleMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep, slow-moving ambient glow */}
      <div
        ref={glowRef}
        className="absolute top-0 left-0 w-[800px] h-[800px] -ml-[400px] -mt-[400px] rounded-full mix-blend-screen opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 60%)',
          filter: 'blur(60px)',
          willChange: 'transform'
        }}
      />

      {/* High-fidelity Gold dust trail */}
      <div 
        ref={trailRef} 
        className="absolute inset-0 mix-blend-screen opacity-0 transition-opacity duration-300"
      >
        {dots.current.map((_, index) => (
          <div
            key={index}
            className="absolute top-0 left-0 rounded-full"
            style={{
              width: '16px',
              height: '16px',
              marginLeft: '-8px',
              marginTop: '-8px',
              background: `rgba(212, 175, 55, ${0.8 * Math.pow(1 - index / 25, 2)})`,
              boxShadow: `0 0 ${10 + index}px rgba(212, 175, 55, ${0.4 * (1 - index / 25)})`,
              willChange: 'transform'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(CursorGlow);
