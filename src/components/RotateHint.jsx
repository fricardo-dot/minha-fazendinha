// Em retrato, um lembrete suave para girar o aparelho. O jogo continua funcionando.
import { useEffect, useState } from 'react';

export function RotateHint() {
  const [portrait, setPortrait] = useState(() => window.innerHeight > window.innerWidth);
  useEffect(() => {
    const u = () => setPortrait(window.innerHeight > window.innerWidth);
    window.addEventListener('resize', u);
    window.addEventListener('orientationchange', u);
    return () => { window.removeEventListener('resize', u); window.removeEventListener('orientationchange', u); };
  }, []);
  if (!portrait) return null;
  return (
    <div className="fz-rotate" aria-hidden="true">
      <svg width="56" height="56" viewBox="0 0 56 56">
        <rect x="16" y="6" width="24" height="44" rx="6" fill="#fff" stroke="#5B3D2E" strokeWidth="3.5" />
        <circle cx="28" cy="43" r="2.5" fill="#5B3D2E" />
        <path d="M46 20a18 18 0 0 1 0 16" fill="none" stroke="#5B3D2E" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M44 34l2 4 4-2" fill="none" stroke="#5B3D2E" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
