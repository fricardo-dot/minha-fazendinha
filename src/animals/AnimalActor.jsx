// Ator de animal: posiciona o sprite, cuida do balão de pedido, do medidor de corações,
// do alvo de soltura (comida) e das reações ao toque.
import { useEffect, useRef, useState } from 'react';
import { ANIMALS } from '../config/content.js';
import { BALANCE } from '../config/balance.js';
import { LAYOUT } from '../config/layout.js';
import { useGame } from '../state/GameProvider.jsx';
import { useDropTarget, useDrag } from '../interaction/DragContext.jsx';
import { useAnimalBehavior } from './useAnimalBehavior.js';
import { ChickenSprite, Nest } from './Chicken.jsx';
import { CowSprite } from './Cow.jsx';
import { ItemIcon } from '../components/ItemIcon.jsx';
import { HeartShape } from '../components/Fx.jsx';
import { stageFor, progressFor } from '../rules/friendship.js';
import { audio } from '../audio/AudioManager.js';

const SPRITES = {
  chicken: { Sprite: ChickenSprite, w: 200, h: 200, zone: 'coopYard' },
  cow: { Sprite: CowSprite, w: 300, h: 240, zone: 'pasture' },
};

function homeOf(def) {
  if (def.type === 'chicken') return LAYOUT.chickenSlots[def.slot];
  return LAYOUT.cow;
}

export function AnimalActor({ id }) {
  const { state, actions, hint, heartMeter } = useGame();
  const animal = state.animals[id];
  const def = ANIMALS[id];
  const cfg = SPRITES[def.type];
  const home = homeOf(def);
  const zone = LAYOUT[cfg.zone];
  const { pos, facing, mood, wake } = useAnimalBehavior(animal, zone, home);
  const [reaction, setReaction] = useState(null); // 'happy' | 'shake'
  const stage = stageFor(animal.hearts);

  // Sons quando algo fica pronto
  const prevState = useRef(animal.state);
  useEffect(() => {
    if (prevState.current !== animal.state) {
      if (animal.state === 'ready') audio.play(def.type === 'cow' ? 'cow' : 'chicken', 300);
      prevState.current = animal.state;
    }
  }, [animal.state, def.type]);

  const center = () => ({ x: pos.x, y: pos.y - cfg.h * 0.55 });

  const react = (kind) => { setReaction(kind); setTimeout(() => setReaction(null), 650); };

  const { ref, isHover, wantsHeld } = useDropTarget(`animal:${id}`, {
    accepts: (item) => item.kind === BALANCE.animals[def.type].food,
    onDrop: (item) => {
      wake();
      const ok = actions.feed(id, item.kind, center());
      if (ok) react('happy'); else react('shake');
      return ok;
    },
    onReject: () => { wake(); react('shake'); },
    inflate: 50,
  });

  const onTap = () => {
    wake();
    if (def.type === 'cow' && animal.state === 'ready') { actions.openMilking(id); return; }
    actions.pet(id, center());
    react('happy');
  };

  const expression =
    reaction === 'happy' ? 'happy'
      : animal.state === 'eating' ? 'eating'
        : mood === 'sleep' ? 'sleep'
          : animal.state === 'hungry' ? 'hungry'
            : 'normal';

  const wantIcon = animal.state === 'hungry' ? BALANCE.animals[def.type].food : (def.type === 'cow' && animal.state === 'ready') ? 'milk' : null;
  const moodCls = animal.state === 'eating' ? 'is-eating' : mood === 'sleep' ? 'is-sleeping' : mood === 'walk' ? 'is-walking' : 'is-idle';
  const cls = ['fz-animal', 'fz-tappable', moodCls, reaction === 'happy' && 'is-happy', reaction === 'shake' && 'is-shaking', isHover && 'is-drop-hover', wantsHeld && animal.state === 'hungry' && 'wants-held', hint === `animal:${id}` && 'is-hinted'].filter(Boolean).join(' ');

  return (
    <>
      {def.type === 'chicken' && <NestWithEgg id={id} animal={animal} stage={stage} home={home} />}
      <div ref={ref} className={cls} style={{ left: pos.x, top: pos.y, width: cfg.w, height: cfg.h }} onClick={onTap}>
        <div className="fz-press" style={{ width: cfg.w, height: cfg.h }}>
          <div className={`fz-animal-flip ${facing < 0 ? 'face-left' : ''}`}>
            <div className="fz-animal-body">
              <cfg.Sprite expression={expression} stage={stage} />
            </div>
          </div>
        </div>
        {mood === 'sleep' && animal.state !== 'eating' && <div className="fz-zzz">z</div>}
        {wantIcon && <ThoughtBubble icon={wantIcon} />}
        {heartMeter && heartMeter.animalId === id && <HeartMeter hearts={animal.hearts} />}
        <div className="fz-touch" style={{ width: cfg.w + 60, height: cfg.h + 40 }} />
      </div>
    </>
  );
}

function ThoughtBubble({ icon }) {
  return (
    <div className="fz-bubble" aria-hidden="true">
      <svg className="fz-bubble-cloud" viewBox="0 0 118 104">
        <circle cx="30" cy="96" r="6" fill="#fff" stroke="#5B3D2E" strokeWidth="3" />
        <circle cx="42" cy="82" r="10" fill="#fff" stroke="#5B3D2E" strokeWidth="3" />
        <path d="M20 44c0-22 22-36 40-30 10-14 40-12 46 6 12 2 14 22 4 30 4 16-14 28-30 22-10 10-34 8-40-4-14 2-24-10-20-24z" fill="#fff" stroke="#5B3D2E" strokeWidth="3.5" strokeLinejoin="round" />
      </svg>
      <div className="fz-bubble-icon"><ItemIcon kind={icon} size={56} /></div>
    </div>
  );
}

function HeartMeter({ hearts }) {
  const stage = stageFor(hearts);
  const progress = progressFor(hearts);
  // Três corações: os já conquistados cheios; o atual enche em proporção.
  const items = [0, 1, 2].map((i) => {
    if (i < stage - 1) return 1;
    if (i === stage - 1) return stage === 3 ? 1 : progress;
    return 0;
  });
  return (
    <div className="fz-heartmeter" aria-hidden="true">
      {items.map((f, i) => (
        <div className="h" key={i}>
          <HeartShape size={34} fill="rgba(255,111,145,.22)" />
          <div className="fill" style={{ clipPath: `inset(${(1 - f) * 100}% 0 0 0)` }}>
            <HeartShape size={34} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Ninho da galinha; quando há ovo, ele aparece aqui e pode ser tocado ou arrastado. */
function NestWithEgg({ id, animal, stage, home }) {
  const { actions, hint } = useGame();
  const { startHold } = useDrag();
  const hasEgg = animal.state === 'ready';
  const eggPos = { x: home.x, y: home.y - 22 };

  const onDown = (e) => {
    startHold(e, { kind: 'egg', animalId: id }, { onTap: () => actions.collectEgg(id, eggPos) });
  };

  return (
    <>
      <div className="fz-obj" style={{ left: home.x, top: home.y + 6, width: 150, height: 70, pointerEvents: 'none' }}>
        <Nest stage={stage} />
      </div>
      {hasEgg && (
        <div className={`fz-egg fz-tappable ${hint === `egg:${id}` ? 'is-hinted fz-hint-self' : ''}`} style={{ left: eggPos.x, top: eggPos.y, width: 76, height: 76, zIndex: 5 }} onPointerDown={onDown}>
          <div className="fz-press"><ItemIcon kind="egg" size={76} /></div>
          <div className="fz-touch" style={{ width: 130, height: 130 }} />
        </div>
      )}
    </>
  );
}
