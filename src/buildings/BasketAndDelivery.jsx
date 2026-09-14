// Cesta de coleta (mostra ovos e garrafas dentro) e caixa de entregas (tocar para vender).
import { useEffect, useRef, useState } from 'react';
import { LAYOUT } from '../config/layout.js';
import { useGame } from '../state/GameProvider.jsx';
import { useDropTarget } from '../interaction/DragContext.jsx';
import { ItemIcon } from '../components/ItemIcon.jsx';
import { basketIsEmpty } from '../rules/economy.js';

export function Basket() {
  const { state, actions, hint } = useGame();
  const { eggs, milk } = state.basket;
  const truffles = state.basket.truffles || 0;
  const total = eggs + milk + truffles;
  const [pop, setPop] = useState(false);
  const prev = useRef(total);
  useEffect(() => {
    if (total > prev.current) { setPop(true); const t = setTimeout(() => setPop(false), 450); prev.current = total; return () => clearTimeout(t); }
    prev.current = total;
    return undefined;
  }, [total]);

  // A cesta aceita ovos arrastados diretamente do chão.
  const { ref, isHover, wantsHeld } = useDropTarget('basket', {
    accepts: (item) => item.kind === 'egg' && !!item.animalId,
    onDrop: (item) => actions.collectEgg(item.animalId, { x: LAYOUT.basket.x, y: LAYOUT.basket.y - 40 }),
    inflate: 60,
  });

  const cls = ['fz-obj', pop && 'is-popping', isHover && 'is-drop-hover', wantsHeld && 'wants-held', hint === 'basket' && 'is-hinted'].filter(Boolean).join(' ');
  const shownEggs = Math.min(eggs, 6);
  const shownMilk = Math.min(milk, 3);
  const shownTruffles = Math.min(truffles, 3);

  return (
    <div ref={ref} className={cls} style={{ left: LAYOUT.basket.x, top: LAYOUT.basket.y, width: 190, height: 150 }}>
      <div className="fz-press" style={{ width: 190, height: 150, position: 'relative' }}>
        <svg width="190" height="150" viewBox="0 0 190 150" aria-hidden="true">
          <ellipse cx="95" cy="142" rx="82" ry="10" fill="rgba(60,40,20,.15)" />
          <path d="M40 24c0-30 110-30 110 0" fill="none" stroke="#A8703A" strokeWidth="9" strokeLinecap="round" />
          <path d="M40 24c0-22 110-22 110 0" fill="none" stroke="#E3B47C" strokeWidth="4" strokeLinecap="round" />
          <path d="M14 70h162l-14 66H28z" fill="#D19A5B" stroke="#5B3D2E" strokeWidth="4" strokeLinejoin="round" />
          <g stroke="#A8703A" strokeWidth="3" opacity=".8"><line x1="20" y1="92" x2="170" y2="92" /><line x1="24" y1="112" x2="166" y2="112" /></g>
          <g stroke="#A8703A" strokeWidth="3" opacity=".6"><line x1="50" y1="70" x2="46" y2="136" /><line x1="95" y1="70" x2="95" y2="136" /><line x1="140" y1="70" x2="144" y2="136" /></g>
        </svg>
        {/* Itens dentro */}
        {Array.from({ length: shownEggs }, (_, i) => (
          <div key={`e${i}`} style={{ position: 'absolute', left: 26 + (i % 4) * 34 + (i >= 4 ? 17 : 0), top: i >= 4 ? 28 : 44 }}>
            <ItemIcon kind="egg" size={40} />
          </div>
        ))}
        {Array.from({ length: shownMilk }, (_, i) => (
          <div key={`m${i}`} style={{ position: 'absolute', left: 120 - i * 26 + (shownEggs > 4 ? 30 : 0), top: 18 - i * 4 }}>
            <ItemIcon kind="milk" size={52} />
          </div>
        ))}
        {Array.from({ length: shownTruffles }, (_, i) => (
          <div key={`t${i}`} style={{ position: 'absolute', left: 30 + i * 30, top: 30 + (i % 2) * 6 }}>
            <ItemIcon kind="truffle" size={40} />
          </div>
        ))}
        <svg width="190" height="150" viewBox="0 0 190 150" style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }} aria-hidden="true">
          <path d="M14 70h162v14H14z" fill="#E3B47C" stroke="#5B3D2E" strokeWidth="4" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

export function DeliveryBox() {
  const { state, actions, hint } = useGame();
  const hasItems = !basketIsEmpty(state.basket);
  const [shake, setShake] = useState(false);

  const onTap = () => {
    const ok = actions.deliver();
    if (!ok) { setShake(true); setTimeout(() => setShake(false), 500); }
  };

  const cls = ['fz-obj', 'fz-tappable', hint === 'delivery' && 'is-hinted', hasItems && hint !== 'delivery' && 'is-nudging', shake && 'is-shaking'].filter(Boolean).join(' ');
  return (
    <div className={cls} style={{ left: LAYOUT.delivery.x, top: LAYOUT.delivery.y, width: 220, height: 200 }} onClick={onTap}>
      <div className="fz-press" style={{ width: 220, height: 200 }}>
        <svg width="220" height="200" viewBox="0 0 220 200" aria-hidden="true">
          <ellipse cx="110" cy="190" rx="92" ry="12" fill="rgba(60,40,20,.15)" />
          {/* Caminhãozinho de entregas */}
          <rect x="18" y="86" width="120" height="76" rx="12" fill="#6ECBF5" stroke="#5B3D2E" strokeWidth="5" />
          <path d="M138 104h40l26 28v30h-66z" fill="#4FB3E0" stroke="#5B3D2E" strokeWidth="5" strokeLinejoin="round" />
          <path d="M150 112h22l16 18h-38z" fill="#DDF3FB" stroke="#5B3D2E" strokeWidth="4" strokeLinejoin="round" />
          <circle cx="56" cy="166" r="20" fill="#5B3D2E" /><circle cx="56" cy="166" r="9" fill="#DDF3FB" />
          <circle cx="170" cy="166" r="20" fill="#5B3D2E" /><circle cx="170" cy="166" r="9" fill="#DDF3FB" />
          {/* Ícone de moeda na lateral */}
          <circle cx="78" cy="124" r="22" fill="#FFD24A" stroke="#B8860B" strokeWidth="4" />
          <path d="M78 112v24M72 118h9a3.5 3.5 0 0 1 0 7h-6a3.5 3.5 0 0 0 0 7h9" fill="none" stroke="#B8860B" strokeWidth="3.5" strokeLinecap="round" />
          {/* Placa "vender" com seta */}
          <rect x="60" y="30" width="100" height="44" rx="12" fill="#FFF6E4" stroke="#5B3D2E" strokeWidth="5" />
          <path d="M84 52h44M116 40l14 12-14 12" fill="none" stroke="#5B3D2E" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="110" y1="74" x2="110" y2="86" stroke="#5B3D2E" strokeWidth="5" />
        </svg>
      </div>
      <div className="fz-touch" style={{ width: 240, height: 220 }} />
    </div>
  );
}
