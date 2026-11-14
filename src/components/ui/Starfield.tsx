import { useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';

/**
 * Lightweight 2D canvas starfield with drifting dust. `warp` turns it into a light tunnel
 * (used by the teleport transition). No WebGL needed, so the hub stays light on phones.
 */
export function Starfield({ warp = false, density = 1, className = '' }: { warp?: boolean; density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useAppStore((s) => s.reduceMotion);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const g = c.getContext('2d');
    if (!g) return;
    let w = 0;
    let h = 0;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);
    const N = Math.round(((w * h) / 2600) * density);
    const stars = Array.from({ length: N }, () => ({
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
      z: Math.random(),
      tw: Math.random() * Math.PI * 2,
      hue: Math.random() < 0.12 ? 'warm' : Math.random() < 0.2 ? 'cool' : 'white',
    }));
    const dust = Array.from({ length: Math.round(40 * density) }, () => ({ x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 1.8, v: 0.002 + Math.random() * 0.006 }));
    let t0 = performance.now();
    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - t0) / 1000);
      t0 = now;
      g.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const speed = warp ? 1.6 : 0.012;
      for (const s of stars) {
        if (!reduce) s.z -= dt * speed;
        if (s.z <= 0.02) {
          s.z = 1;
          s.x = (Math.random() - 0.5) * 2;
          s.y = (Math.random() - 0.5) * 2;
        }
        const k = 1 / s.z;
        const x = cx + s.x * k * w * 0.35;
        const y = cy + s.y * k * h * 0.35;
        if (x < -20 || x > w + 20 || y < -20 || y > h + 20) {
          s.z = 1;
          continue;
        }
        const size = Math.max(0.4, (1 - s.z) * 2.2);
        s.tw += dt * 2;
        const alpha = Math.min(1, (1 - s.z) * 1.4) * (0.75 + 0.25 * Math.sin(s.tw));
        const col = s.hue === 'warm' ? '255,214,160' : s.hue === 'cool' ? '170,210,255' : '238,241,248';
        if (warp) {
          const k2 = 1 / Math.min(1, s.z + 0.06);
          const x2 = cx + s.x * k2 * w * 0.35;
          const y2 = cy + s.y * k2 * h * 0.35;
          g.strokeStyle = `rgba(${col},${alpha})`;
          g.lineWidth = size;
          g.beginPath();
          g.moveTo(x2, y2);
          g.lineTo(x, y);
          g.stroke();
        } else {
          g.fillStyle = `rgba(${col},${alpha})`;
          g.beginPath();
          g.arc(x, y, size * 0.6, 0, Math.PI * 2);
          g.fill();
        }
      }
      if (!warp) {
        for (const d of dust) {
          if (!reduce) {
            d.x += d.v * dt * 6;
            d.y -= d.v * dt * 2;
          }
          if (d.x > 1.05) d.x = -0.05;
          if (d.y < -0.05) d.y = 1.05;
          const grd = g.createRadialGradient(d.x * w, d.y * h, 0, d.x * w, d.y * h, d.r * 6);
          grd.addColorStop(0, 'rgba(255,200,150,0.10)');
          grd.addColorStop(1, 'rgba(255,200,150,0)');
          g.fillStyle = grd;
          g.fillRect(d.x * w - d.r * 6, d.y * h - d.r * 6, d.r * 12, d.r * 12);
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [warp, density, reduce]);

  return <canvas ref={ref} className={`absolute inset-0 h-full w-full ${className}`} aria-hidden />;
}
