import { useEffect, useRef } from 'react';

export default function ParticlesBg() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 25000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.4,
          speedY: (Math.random() - 0.5) * 0.4,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around boundaries
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(110, 255, 140, ${p.opacity})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#22c55e';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-[#030705] via-[#07100c] to-[#020403]" />
      
      {/* Decorative Blur Blobs */}
      <div className="absolute top-[10%] left-[-100px] w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[90px] animate-pulse" />
      <div className="absolute top-[40%] right-[-100px] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />
      <div className="absolute bottom-[-100px] left-[35%] w-[450px] h-[450px] bg-lime-500/8 bg-opacity-70 rounded-full blur-[110px] animate-pulse delay-2000" />
      
      {/* Custom CSS Grid Lines Layer */}
      <div className="absolute inset-0 opacity-[0.03] select-none pointer-events-none" 
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />
      
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none opacity-60" 
      />
    </div>
  );
}
