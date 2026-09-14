// Milharal com canteiros: vazio → semente → broto → crescendo → pronto.
// Tocar: planta (vazio) ou colhe (pronto). Regador: arrastar/tocar sobre o canteiro com semente.
import { useEffect, useRef, useState } from 'react';
import { LAYOUT } from '../config/layout.js';
import { useGame } from '../state/GameProvider.jsx';
import { useDropTarget } from '../interaction/DragContext.jsx';
import { useFx } from '../components/Fx.jsx';
import { audio } from '../audio/AudioManager.js';

export function CornField() {
  const { state } = useGame();
  const f = LAYOUT.field;
  return (
    <>
      {/* Terreno do milharal */}
      <svg className="fz-box" style={{ left: f.x, top: f.y }} width={f.w} height={f.h} viewBox={`0 0 ${f.w} ${f.h}`} aria-hidden="true">
        <rect x="6" y="40" width={f.w - 12} height={f.h - 50} rx="26" fill="#A56F42" stroke="#5B3D2E" strokeWidth="4" />
        <rect x="18" y="52" width={f.w - 36} height={f.h - 74} rx="18" fill="#B9804F" />
        <g stroke="#8E5E36" strokeWidth="3" opacity=".5" strokeLinecap="round">
          <line x1="40" y1="80" x2={f.w - 40} y2="80" /><line x1="40" y1="110" x2={f.w - 40} y2="110" /><line x1="40" y1="140" x2={f.w - 40} y2="140" />
        </g>
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
    if (plot.stage === 'ready') {
      fx.burst({ x: at.x, y: at.y - 40, kind: 'sparkle', size: .6 });
      audio.play('happy', 500);
    }
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

  const cls = ['fz-obj', 'fz-plot', 'fz-tappable', `is-${plot.stage}`, isHover && 'is-drop-hover', wantsHeld && plot.stage === 'seed' && !plot.watered && 'wants-held', hint === `plot:${index}` && 'is-hinted'].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={cls} style={{ left: pos.x, top: pos.y, width: 140, height: 180 }} onClick={onTap}>
      <div className="fz-press" style={{ width: 140, height: 180 }}>
        <svg width="140" height="180" viewBox="0 0 140 180" aria-hidden="true">
          {/* Montinho de terra */}
          <ellipse cx="70" cy="160" rx="58" ry="16" fill={plot.watered || plot.stage !== 'seed' && plot.stage !== 'empty' ? '#8E5E36' : '#A56F42'} stroke="#5B3D2E" strokeWidth="4" />
          {plot.stage === 'empty' && (
            <g opacity=".55">
              <ellipse cx="70" cy="160" rx="40" ry="9" fill="none" stroke="#FFF6E4" strokeWidth="3" strokeDasharray="8 8" />
              <path d="M70 128v20M60 138h20" stroke="#FFF6E4" strokeWidth="5" strokeLinecap="round" />
            </g>
          )}
          <g className={`plant ${grow ? 'grow-in' : ''}`} style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}>
            {plot.stage === 'seed' && (
              <g>
                <ellipse cx="60" cy="152" rx="6" ry="4" fill="#FFD24A" stroke="#5B3D2E" strokeWidth="2" />
                <ellipse cx="78" cy="156" rx="6" ry="4" fill="#FFD24A" stroke="#5B3D2E" strokeWidth="2" />
                <ellipse cx="70" cy="146" rx="6" ry="4" fill="#FFD24A" stroke="#5B3D2E" strokeWidth="2" />
                {plot.watered && (
                  <g fill="#6ECBF5">
                    <path className="drop" style={{ animationDelay: '0s' }} d="M50 128c0-8 8-14 8-14s8 6 8 14a8 8 0 0 1-16 0z" />
                    <path className="drop" style={{ animationDelay: '.4s' }} d="M78 122c0-8 8-14 8-14s8 6 8 14a8 8 0 0 1-16 0z" />
                  </g>
                )}
              </g>
            )}
            {plot.stage === 'sprout' && (
              <g>
                <path d="M70 158v-30" stroke="#5FAF42" strokeWidth="7" strokeLinecap="round" />
                <path d="M70 136c-16-2-26-12-26-24 12 0 24 8 26 24z" fill="#8FD36A" stroke="#5B3D2E" strokeWidth="3" />
                <path d="M70 142c16-2 26-12 26-24-12 0-24 8-26 24z" fill="#8FD36A" stroke="#5B3D2E" strokeWidth="3" />
              </g>
            )}
            {plot.stage === 'growing' && (
              <g>
                <path d="M70 158V70" stroke="#5FAF42" strokeWidth="9" strokeLinecap="round" />
                <path d="M70 130c-20-2-34-16-34-34 16 0 32 12 34 34z" fill="#8FD36A" stroke="#5B3D2E" strokeWidth="3" />
                <path d="M70 112c20-2 34-16 34-34-16 0-32 12-34 34z" fill="#8FD36A" stroke="#5B3D2E" strokeWidth="3" />
                <path d="M70 90c-16-2-26-12-26-24 12 0 24 8 26 24z" fill="#9EDB7A" stroke="#5B3D2E" strokeWidth="3" />
              </g>
            )}
            {plot.stage === 'ready' && (
              <g>
                <path d="M70 158V30" stroke="#5FAF42" strokeWidth="10" strokeLinecap="round" />
                <path d="M70 140c-24-2-40-18-40-40 18 0 38 14 40 40z" fill="#8FD36A" stroke="#5B3D2E" strokeWidth="3" />
                <path d="M70 118c24-2 40-18 40-40-18 0-38 14-40 40z" fill="#8FD36A" stroke="#5B3D2E" strokeWidth="3" />
                <path d="M70 80c-18-2-30-14-30-30 14 0 28 10 30 30z" fill="#9EDB7A" stroke="#5B3D2E" strokeWidth="3" />
                <path d="M70 34c-10-14-6-26 0-30 6 4 10 16 0 30z" fill="#E8C466" stroke="#5B3D2E" strokeWidth="3" />
                {/* Espiga */}
                <g transform="translate(88 92) rotate(18)">
                  <path d="M0 40c-6-6-8-18-4-28S8 0 11 0c6 0 12 8 12 20s-6 22-12 24c-3 1-8 1-11-4z" fill="#FFD24A" stroke="#5B3D2E" strokeWidth="3" />
                  <g fill="#F0B429"><circle cx="8" cy="10" r="2" /><circle cx="14" cy="14" r="2" /><circle cx="7" cy="20" r="2" /><circle cx="14" cy="24" r="2" /><circle cx="8" cy="30" r="2" /></g>
                  <path d="M-2 38c-8-2-12-10-12-16 6 0 12 4 12 8" fill="#7CC15A" stroke="#5B3D2E" strokeWidth="3" strokeLinejoin="round" />
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
