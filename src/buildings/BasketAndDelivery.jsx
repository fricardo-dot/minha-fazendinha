// Cesta de coleta (mostra o que está dentro) e caminhão de entregas em 3/4 (tocar para vender).
import { useEffect, useRef, useState } from 'react';
import { LAYOUT } from '../config/layout.js';
import { useGame } from '../state/GameProvider.jsx';
import { useDropTarget } from '../interaction/DragContext.jsx';
import { ItemIcon } from '../components/ItemIcon.jsx';
import { basketIsEmpty } from '../rules/economy.js';
import { Shadow, Gloss, RIM } from '../art/shading.jsx';

export function Basket() {
  const { state, actions, hint } = useGame();
  const { eggs, milk } = state.basket;
  const truffles = state.basket.truffles || 0;
  const wool = state.basket.wool || 0;
  const total = eggs + milk + truffles + wool;
  const [pop, setPop] = useState(false);
  const prev = useRef(total);
  useEffect(() => {
    if (total > prev.current) { setPop(true); const t = setTimeout(() => setPop(false), 450); prev.current = total; return () => clearTimeout(t); }
    prev.current = total;
    return undefined;
  }, [total]);

  const { ref, isHover, wantsHeld } = useDropTarget('basket', {
    accepts: (item) => item.kind === 'egg' && !!item.animalId,
    onDrop: (item) => actions.collectEgg(item.animalId, { x: LAYOUT.basket.x, y: LAYOUT.basket.y - 40 }),
    inflate: 60,
  });

  const cls = ['fz-obj', pop && 'is-popping', isHover && 'is-drop-hover', wantsHeld && 'wants-held', hint === 'basket' && 'is-hinted'].filter(Boolean).join(' ');
  const shownEggs = Math.min(eggs, 6);
  const shownMilk = Math.min(milk, 3);
  const shownTruffles = Math.min(truffles, 3);
  const shownWool = Math.min(wool, 2);

  return (
    <div ref={ref} className={cls} style={{ left: LAYOUT.basket.x, top: LAYOUT.basket.y, width: 190, height: 150 }}>
      <div className="fz-press" style={{ width: 190, height: 150, position: 'relative' }}>
        <svg width="190" height="150" viewBox="0 0 190 150" aria-hidden="true">
          <Shadow x={95} y={142} rx={84} ry={11} />
          <path d="M40 24c0-30 110-30 110 0" fill="none" stroke="#9F6A3C" strokeWidth="10" strokeLinecap="round" />
          <path d="M40 24c0-24 110-24 110 0" fill="none" stroke="#E6B47C" strokeWidth="4" strokeLinecap="round" />
          <path d="M14 70h162l-14 66H28z" fill="url(#f-wood)" stroke={RIM} strokeWidth="1.2" strokeLinejoin="round" />
          <g stroke="#9F6A3C" strokeWidth="3" opacity=".45"><line x1="20" y1="92" x2="170" y2="92" /><line x1="24" y1="112" x2="166" y2="112" /></g>
          <g stroke="#9F6A3C" strokeWidth="3" opacity=".35"><line x1="50" y1="70" x2="46" y2="136" /><line x1="95" y1="70" x2="95" y2="136" /><line x1="140" y1="70" x2="144" y2="136" /></g>
          <ellipse cx="95" cy="72" rx="78" ry="10" fill="#6B4322" opacity=".5" />
        </svg>
        {Array.from({ length: shownEggs }, (_, i) => (
          <div key={`e${i}`} style={{ position: 'absolute', left: 26 + (i % 4) * 34 + (i >= 4 ? 17 : 0), top: i >= 4 ? 28 : 44 }}><ItemIcon kind="egg" size={40} /></div>
        ))}
        {Array.from({ length: shownMilk }, (_, i) => (
          <div key={`m${i}`} style={{ position: 'absolute', left: 120 - i * 26 + (shownEggs > 4 ? 30 : 0), top: 18 - i * 4 }}><ItemIcon kind="milk" size={52} /></div>
        ))}
        {Array.from({ length: shownTruffles }, (_, i) => (
          <div key={`t${i}`} style={{ position: 'absolute', left: 30 + i * 30, top: 30 + (i % 2) * 6 }}><ItemIcon kind="truffle" size={40} /></div>
        ))}
        {Array.from({ length: shownWool }, (_, i) => (
          <div key={`w${i}`} style={{ position: 'absolute', left: 60 + i * 40, top: 24 }}><ItemIcon kind="wool" size={44} /></div>
        ))}
        <svg width="190" height="150" viewBox="0 0 190 150" style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }} aria-hidden="true">
          <path d="M14 70h162v14H14z" fill="url(#f-wood-top)" stroke={RIM} strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

export function DeliveryBox() {
  const { state, actions, hint } = useGame();
  const hasItems = !basketIsEmpty(state.basket);
  const [shake, setShake] = useState(false);
  const onTap = () => { if (!actions.deliver()) { setShake(true); setTimeout(() => setShake(false), 500); } };
  const cls = ['fz-obj', 'fz-tappable', hint === 'delivery' && 'is-hinted', hasItems && hint !== 'delivery' && 'is-nudging', shake && 'is-shaking'].filter(Boolean).join(' ');
  return (
    <div className={cls} style={{ left: LAYOUT.delivery.x, top: LAYOUT.delivery.y, width: 220, height: 200 }} onClick={onTap}>
      <div className="fz-press" style={{ width: 220, height: 200 }}>
        <svg width="220" height="200" viewBox="0 0 220 200" aria-hidden="true">
          <Shadow x={110} y={188} rx={96} ry={13} />
          {/* Caçamba (3/4) */}
          <polygon points="138,86 166,70 166,132 138,148" fill="#3D9BC9" stroke={RIM} strokeWidth="1" />
          <polygon points="18,86 46,70 166,70 138,86" fill="#B5E6FA" stroke={RIM} strokeWidth="1" />
          <rect x="18" y="86" width="120" height="70" rx="10" fill="url(#s-blue)" stroke={RIM} strokeWidth="1.2" />
          <Gloss x={50} y={100} rx={22} ry={8} opacity={.5} />
          {/* Cabine */}
          <path d="M138 104h40l26 28v28h-66z" fill="url(#s-blue)" stroke={RIM} strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M150 112h22l16 18h-38z" fill="url(#f-glass)" stroke={RIM} strokeWidth="1" strokeLinejoin="round" />
          <rect x="140" y="146" width="66" height="14" rx="4" fill="#3D9BC9" />
          {/* Rodas */}
          {[56, 170].map((cx) => (
            <g key={cx}>
              <circle cx={cx} cy="164" r="21" fill="url(#s-dark)" />
              <circle cx={cx} cy="164" r="10" fill="url(#s-gray)" />
              <circle cx={cx - 3} cy="161" r="3" fill="#fff" opacity=".8" />
            </g>
          ))}
          <rect x="60" y="176" width="130" height="8" rx="4" fill="#2F2724" opacity=".4" />
          {/* Moeda na lateral */}
          <circle cx="78" cy="122" r="20" fill="url(#s-gold)" stroke="#B8860B" strokeWidth="1.5" />
          <path d="M78 110v24M72 116h9a3.5 3.5 0 0 1 0 7h-6a3.5 3.5 0 0 0 0 7h9" fill="none" stroke="#9A7A1A" strokeWidth="3.5" strokeLinecap="round" />
          <Gloss x={72} y={114} rx={7} ry={4} />
          {/* Placa "vender" com seta */}
          <rect x="60" y="30" width="100" height="44" rx="12" fill="url(#f-cream)" stroke={RIM} strokeWidth="1.2" />
          <rect x="66" y="36" width="88" height="32" rx="8" fill="none" stroke="#E3B47C" strokeWidth="2" strokeDasharray="4 6" />
          <path d="M84 52h44M116 40l14 12-14 12" fill="none" stroke="#5B3D2E" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="110" y1="74" x2="110" y2="86" stroke="#7A5A3A" strokeWidth="5" />
        </svg>
      </div>
      <div className="fz-touch" style={{ width: 240, height: 220 }} />
    </div>
  );
}
