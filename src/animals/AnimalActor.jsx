// Ator de animal: posiciona o sprite, cuida do balão de pedido, do medidor de corações,
// do alvo de soltura (comida) e das reações ao toque.
import { useEffect, useRef, useState } from 'react';
import { ANIMALS, CARE_TOOLS } from '../config/content.js';
import { CareOverlay } from './CareOverlay.jsx';
import { BALANCE } from '../config/balance.js';
import { LAYOUT } from '../config/layout.js';
import { useGame } from '../state/GameProvider.jsx';
import { useDropTarget, useDrag } from '../interaction/DragContext.jsx';
import { useAnimalBehavior } from './useAnimalBehavior.js';
import { ChickenSprite, Nest } from './Chicken.jsx';
import { CowSprite } from './Cow.jsx';
import { PigSprite } from './Pig.jsx';
import { ItemIcon } from '../components/ItemIcon.jsx';
import { HeartShape } from '../components/Fx.jsx';
import { stageFor, progressFor } from '../rules/friendship.js';
import { audio } from '../audio/AudioManager.js';

const SPRITES = {
  chicken: { Sprite: ChickenSprite, w: 200, h: 200, zone: 'coopYard' },
  cow: { Sprite: CowSprite, w: 300, h: 240, zone: 'pasture' },
  pig: { Sprite: PigSprite, w: 200, h: 150, zone: 'pigpen' },
};

function homeOf(def) {
  if (def.type === 'chicken') return LAYOUT.chickenSlots[def.slot];
  if (def.type === 'pig') return LAYOUT.pig;
  return LAYOUT.cow;
}

export function AnimalActor({ id }) {
  const { state, actions, hint, heartMeter, care } = useGame();
  const animal = state.animals[id];
  const def = ANIMALS[id];
  const cfg = SPRITES[def.type];
  const home = homeOf(def);
  const zone = LAYOUT[cfg.zone];
  const inCare = !!care && care.animalId === id;
  const { pos, facing, mood, wake } = useAnimalBehavior(animal, zone, home, inCare);
  const [reaction, setReaction] = useState(null); // 'happy' | 'shake'
  const [shiny, setShiny] = useState(false);
  const stage = stageFor(animal.hearts);

  // Ao terminar um cuidado (sujeira/pelo sumiu), o animal fica brilhante por alguns segundos
  const wasInCare = useRef(false);
  useEffect(() => {
    if (wasInCare.current && !inCare && !animal.dirty && !animal.scruffy) {
      setShiny(true); setReaction('happy');
      const t = setTimeout(() => setShiny(false), 3500);
      const t2 = setTimeout(() => setReaction(null), 650);
      wasInCare.current = false;
      return () => { clearTimeout(t); clearTimeout(t2); };
    }
    wasInCare.current = inCare;
    return undefined;
  }, [inCare, animal.dirty, animal.scruffy]);

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
    accepts: (item) => !care && (
      item.kind === BALANCE.animals[def.type].food
      || (!!CARE_TOOLS[item.kind] && !(item.kind === 'sponge' && BALANCE.animals[def.type].mudBath))
    ),
    onDrop: (item) => {
      wake();
      if (CARE_TOOLS[item.kind]) return actions.startCare(id, item.kind);
      const ok = actions.feed(id, item.kind, center());
      if (ok) react('happy'); else react('shake');
      return ok;
    },
    onReject: () => { wake(); react('shake'); },
    inflate: 50,
  });

  const onTap = () => {
    wake();
    if (animal.state === 'ready' && BALANCE.animals[def.type].collectMinigame) { actions.openCollectMinigame(id); return; }
    actions.pet(id, center());
    react('happy');
  };

  const expression =
    reaction === 'happy' ? 'happy'
      : animal.state === 'eating' ? 'eating'
        : mood === 'sleep' ? 'sleep'
          : animal.state === 'hungry' ? 'hungry'
            : 'normal';

  const wantIcon = inCare ? null
    : animal.state === 'hungry' ? BALANCE.animals[def.type].food
      : (animal.state === 'ready' && BALANCE.animals[def.type].readyIcon) ? BALANCE.animals[def.type].readyIcon
        : animal.dirty ? 'sponge'
          : animal.scruffy ? 'brush'
            : null;
  const progress = inCare ? care.strokes / BALANCE.care.strokes : 0;
  const dirtOpacity = animal.dirty ? (inCare && care.kind === 'wash' ? 1 - progress : 1) : 0;
  const scruffOpacity = animal.scruffy ? (inCare && care.kind === 'brush' ? 1 - progress : 1) : 0;
  const mudBath = !!BALANCE.animals[def.type].mudBath;
  const muddy = mudBath ? (animal.state === 'ready' ? 1 : animal.state === 'producing' ? 0.6 : 0) : 0;
  const rolling = mudBath && animal.state === 'producing';
  const moodCls = animal.state === 'eating' ? 'is-eating' : rolling ? 'is-rolling' : mood === 'sleep' ? 'is-sleeping' : mood === 'walk' ? 'is-walking' : 'is-idle';
  const cls = ['fz-animal', 'fz-tappable', moodCls, reaction === 'happy' && 'is-happy', reaction === 'shake' && 'is-shaking', isHover && 'is-drop-hover', wantsHeld && animal.state === 'hungry' && 'wants-held', hint === `animal:${id}` && 'is-hinted'].filter(Boolean).join(' ');

  return (
    <>
      {def.type === 'chicken' && <NestWithEgg id={id} animal={animal} stage={stage} home={home} />}
      <div ref={ref} className={cls} style={{ left: pos.x, top: pos.y, width: cfg.w, height: cfg.h }} onClick={onTap}>
        <div className="fz-press" style={{ width: cfg.w, height: cfg.h }}>
          <div className={`fz-animal-flip ${facing < 0 ? 'face-left' : ''}`}>
            <div className="fz-animal-body">
              <cfg.Sprite expression={rolling ? 'happy' : expression} stage={stage} dirt={dirtOpacity} scruff={scruffOpacity} muddy={muddy} />
            </div>
          </div>
        </div>
        {mood === 'sleep' && animal.state !== 'eating' && <div className="fz-zzz">z</div>}
        {shiny && [[12, 18], [78, 8], [88, 52]].map(([l, t], i) => (
          <svg key={i} className="fz-twinkle" style={{ left: `${l}%`, top: `${t}%`, animationDelay: `${i * 0.3}s` }} width="34" height="34" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2l2 7 7 3-7 3-2 7-2-7-7-3 7-3z" fill="#FFF3B0" stroke="#F0B429" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
        ))}
        {wantIcon && <ThoughtBubble icon={wantIcon} />}
        {heartMeter && heartMeter.animalId === id && <HeartMeter hearts={animal.hearts} />}
        <div className="fz-touch" style={{ width: cfg.w + 60, height: cfg.h + 40 }} />
      </div>
      {inCare && <CareOverlay animalId={id} pos={pos} width={cfg.w + 140} height={cfg.h + 90} />}
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
