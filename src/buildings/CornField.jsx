// Milharal em 3/4: terreno em perspectiva (mais estreito ao longe), sulcos convergentes e canteiros.
// Tocar: planta (vazio) ou colhe (pronto). Regador: arrastar/tocar sobre o canteiro com semente.
import { useEffect, useRef, useState } from 'react';
import { LAYOUT } from '../config/layout.js';
import { useGame } from '../state/GameProvider.jsx';
import { useDropTarget } from '../interaction/DragContext.jsx';
import { useFx } from '../components/Fx.jsx';
import { audio } from '../audio/AudioManager.js';
import { Shadow, RIM } from '../art/shading.jsx';

export function CornField() {
  const { state } = useGame();
  const f = LAYOUT.field;
  return (
    <>
      <svg className="fz-box" style={{ left: f.x, top: f.y }} width={f.w} height={f.h} viewBox={`0 0 ${f.w} ${f.h}`} aria-hidden="true">
        <Shadow x={f.w / 2} y={f.h - 6} rx={f.w / 2 - 10} ry={14} />
        {/* Terreno em perspectiva */}
        <polygon points={`40,30 ${f.w - 40},30 ${f.w - 6},${f.h - 14} 6,${f.h - 14}`} fill="url(#f-soil)" stroke={RIM} strokeWidth="1.2" strokeLinejoin="round" />
        <polygon points={`40,30 ${f.w - 40},30 ${f.w - 6},${f.h - 14} 6,${f.h - 14}`} fill="url(#p-soil)" />
        {/* Sulcos convergindo para o fundo */}
        <g stroke="#6E4525" strokeWidth="3" opacity=".35" strokeLinecap="round">
          {[0.2, 0.4, 0.6, 0.8].map((t) => <line key={t} x1={40 + t * (f.w - 80)} y1="34" x2={6 + t * (f.w - 12)} y2={f.h - 18} />)}
        </g>
        <g stroke="#6E4525" strokeWidth="3" opacity=".25">
          <line x1="30" y1="70" x2={f.w - 30} y2="70" /><line x1="20" y1="112" x2={f.w - 20} y2="112" /><line x1="12" y1="154" x2={f.w - 12} y2="154" />
        </g>
        {/* Borda de madeira baixa na frente */}
        <rect x="0" y={f.h - 22} width={f.w} height="12" rx="5" fill="url(#f-wood)" stroke={RIM} strokeWidth="1" />
        <rect x="0" y={f.h - 22} width={f.w} height="4" rx="2" fill="#F5D3A5" opacity=".7" />
      </svg>
      {state.plots.map((p, i) => <Plot key={i} index={i} plot={p} />)}
    </>
  );
}

function Plot({ index, plot }) {
  const { actions, hint } = useGame();
  const fx = useFx();
  const pos = LAYOUT.plots[index];
  const at = { x: pos.x, y: pos.y - 30 };
  const [grow, setGrow] = useState(false);
  const prevStage = useRef(plot.stage);

  useEffect(() => {
    if (plot.stage === prevStage.current) return undefined;
    prevStage.current = plot.stage;
    if (plot.stage === 'empty') return undefined;
    setGrow(true);
    const t = setTimeout(() => setGrow(false), 600);
    if (plot.stage === 'ready') { fx.burst({ x: at.x, y: at.y - 40, kind: 'sparkle', size: .6 }); audio.play('happy', 500); }
    return () => clearTimeout(t);
  }, [plot.stage]); // eslint-disable-line react-hooks/exhaustive-deps

  const { ref, isHover, wantsHeld } = useDropTarget(`plot:${index}`, {
    accepts: (item) => item.kind === 'water',
    onDrop: () => actions.water(index, at),
    inflate: 30,
  });

  const onTap = () => {
    if (plot.stage === 'empty') actions.plant(index, at);
    else if (plot.stage === 'ready') actions.harvest(index, at);
    else { fx.burst({ x: at.x, y: at.y - 20, kind: 'sparkle', size: .4 }); audio.play('happy', 400); }
  };

  const wet = plot.watered || (plot.stage !== 'seed' && plot.stage !== 'empty');
  const cls = ['fz-obj', 'fz-plot', 'fz-tappable', `is-${plot.stage}`, isHover && 'is-drop-hover', wantsHeld && plot.stage === 'seed' && !plot.watered && 'wants-held', hint === `plot:${index}` && 'is-hinted'].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={cls} style={{ left: pos.x, top: pos.y, width: 140, height: 180 }} onClick={onTap}>
      <div className="fz-press" style={{ width: 140, height: 180 }}>
        <svg width="140" height="180" viewBox="0 0 140 180" aria-hidden="true">
          {/* Montinho de terra */}
          <ellipse cx="70" cy="160" rx="56" ry="15" fill={wet ? 'url(#f-soil-wet)' : 'url(#f-soil)'} stroke={RIM} strokeWidth="1" />
          <ellipse cx="60" cy="154" rx="30" ry="6" fill="#C9986A" opacity={wet ? .15 : .4} />
          {plot.stage === 'empty' && (
            <g opacity=".7">
              <ellipse cx="70" cy="160" rx="40" ry="9" fill="none" stroke="#FFF6E4" strokeWidth="3" strokeDasharray="8 8" />
              <circle cx="70" cy="138" r="16" fill="#FFF6E4" opacity=".9" />
              <path d="M70 128v20M60 138h20" stroke="#7CC15A" strokeWidth="5" strokeLinecap="round" />
            </g>
          )}
          <g className={`plant ${grow ? 'grow-in' : ''}`} style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}>
            {plot.stage === 'seed' && (
              <g>
                <ellipse cx="60" cy="152" rx="6" ry="4" fill="url(#s-gold)" /><ellipse cx="78" cy="156" rx="6" ry="4" fill="url(#s-gold)" /><ellipse cx="70" cy="146" rx="6" ry="4" fill="url(#s-gold)" />
                {plot.watered && (
                  <g fill="url(#s-water)">
                    <path className="drop" style={{ animationDelay: '0s' }} d="M50 128c0-8 8-14 8-14s8 6 8 14a8 8 0 0 1-16 0z" />
                    <path className="drop" style={{ animationDelay: '.4s' }} d="M78 122c0-8 8-14 8-14s8 6 8 14a8 8 0 0 1-16 0z" />
                  </g>
                )}
              </g>
            )}
            {plot.stage === 'sprout' && (
              <g>
                <path d="M70 158v-30" stroke="#4F9E36" strokeWidth="7" strokeLinecap="round" />
                <ellipse cx="56" cy="124" rx="16" ry="8" fill="url(#s-leaf)" transform="rotate(-35 56 124)" />
                <ellipse cx="84" cy="128" rx="16" ry="8" fill="url(#s-leaf)" transform="rotate(35 84 128)" />
              </g>
            )}
            {plot.stage === 'growing' && (
              <g>
                <path d="M70 158V70" stroke="#4F9E36" strokeWidth="9" strokeLinecap="round" />
                <ellipse cx="48" cy="112" rx="24" ry="9" fill="url(#s-leaf)" transform="rotate(-35 48 112)" />
                <ellipse cx="92" cy="96" rx="24" ry="9" fill="url(#s-leaf)" transform="rotate(35 92 96)" />
                <ellipse cx="54" cy="82" rx="18" ry="7" fill="url(#s-green)" transform="rotate(-40 54 82)" />
              </g>
            )}
            {plot.stage === 'ready' && (
              <g>
                <path d="M70 158V30" stroke="#4F9E36" strokeWidth="10" strokeLinecap="round" />
                <ellipse cx="44" cy="120" rx="30" ry="10" fill="url(#s-leaf)" transform="rotate(-35 44 120)" />
                <ellipse cx="96" cy="98" rx="30" ry="10" fill="url(#s-leaf)" transform="rotate(35 96 98)" />
                <ellipse cx="50" cy="72" rx="24" ry="8" fill="url(#s-green)" transform="rotate(-40 50 72)" />
                <path d="M70 34c-10-14-6-26 0-30 6 4 10 16 0 30z" fill="url(#s-straw)" />
                {/* Espiga */}
                <g transform="translate(88 92) rotate(18)">
                  <path d="M0 40c-6-6-8-18-4-28S8 0 11 0c6 0 12 8 12 20s-6 22-12 24c-3 1-8 1-11-4z" fill="url(#s-gold)" stroke={RIM} strokeWidth="1" />
                  <g fill="#E0A81E" opacity=".7"><circle cx="8" cy="10" r="2" /><circle cx="14" cy="14" r="2" /><circle cx="7" cy="20" r="2" /><circle cx="14" cy="24" r="2" /><circle cx="8" cy="30" r="2" /></g>
                  <path d="M-2 38c-8-2-12-10-12-16 6 0 12 4 12 8" fill="url(#s-leaf)" />
                </g>
              </g>
            )}
          </g>
        </svg>
      </div>
      <div className="fz-touch" style={{ width: 150, height: 190 }} />
    </div>
  );
}
