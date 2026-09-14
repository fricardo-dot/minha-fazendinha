# Minha Fazendinha — contratos para o Claude

Jogo para criança de 3 anos em tablet touch. Estas regras valem para qualquer alteração.

## Regras de design (não negociáveis)

- Nada de texto para a criança ler; comunicação por ícone, animação, som. Texto só na área dos pais.
- Nunca punir: animais não morrem/adoecem, plantas não se perdem, sem energia, sem game over, sem "você errou".
- Erro = reação divertida + tentar de novo (item volta com balanço; animal balança a cabeça).
- Sem anúncios, compras, loot boxes, links externos acessíveis à criança.
- Toda interação deve funcionar por **arrastar E por tocar-e-tocar** (ver `interaction/DragContext.jsx`). Nunca depender de hover, teclado ou double tap.
- Áreas de toque infladas (`.fz-touch`), mínimo `MIN_TOUCH` em `config/layout.js`. Ao posicionar algo novo, conferir que a área de toque não cai dentro da de outro objeto (o desenhado por último ganha o toque) — foi o que aconteceu com a placa do chiqueiro sobre a vaca.

## Contratos de código

- **Números só em `src/config/balance.js`** (tempos, custos, recompensas, corações, animações). Nunca espalhar valores pelo código.
- Novo animal / cultivo / melhoria começa em `src/config/content.js`; posições em `src/config/layout.js` (palco lógico 1600×1000, nunca pixels reais).
- `state/reducer.js` é puro: sem som, sem efeito, sem `Date.now()` (o `now` vem na ação). Som + efeito + dispatch ficam nas ações do `GameProvider`.
- Timers são timestamps absolutos (`rules/production.js`); o `TICK` só compara com `now`. Isso garante progresso sem punição ao voltar depois de horas.
- Persistência só pela interface de `persistence/storage.js`. Mudou o formato do save: subir `SCHEMA_VERSION` e tratar em `migrate()`.
- Novo minigame: componente com props `{ params, onDone, onExit }` + entrada em `minigames/registry.js`. Sair antes nunca é castigo.
- Animal cuja coleta é um minigame (vaca → ordenha, porco → banho): `collectMinigame` e `readyIcon` em `balance.animals[tipo]`; o minigame chama `actions.finishCollect(animalId)` ao terminar. Produto novo = `PRODUCT_KEY` + `PRODUCT_REWARD` em content.js e campo na cesta (`initialState` + `DELIVER`).
- Animal desbloqueável: `requires: '<upgradeId>'` em `ANIMALS` + `unlocksAnimal` na melhoria. Renderização e dicas só olham `unlockedAnimalDefs(state)`; `depth` define a ordem de desenho (fundo primeiro).
- Áudio só via `audio.play('nome')`; trocar síntese por arquivos é mudança interna em `audio/`.
- Cuidado por gesto (lavar/escovar): a sessão vive em `GameProvider` (`care`, `startCare/careStroke/cancelCare`); a regra fica em `rules/production.js` (`applyCare`). Nova ferramenta = entrada em `CARE_TOOLS` (content.js) + ícone + fonte no `CareKit`.

## Armadilhas conhecidas

- Animação CSS com `transform` em um `<g>` SVG **sobrescreve** o atributo `transform` desse `<g>`. Envolva em um `<g>` externo com o `translate` e anime o interno.
- iOS só libera áudio depois de um gesto: `audio.unlock()` é chamado no primeiro `pointerdown` (já está no `GameProvider`).
- No modo "item na mão" (sticky), o `pointerdown` é interceptado na captura da `window` e o `click` seguinte é engolido; handlers de toque devem usar `onClick` (ações) ou `onPointerDown` (fontes de arraste), não os dois.
- `public/sw.template.js` vira `dist/sw.js` no build com `__VERSION__` = hash do bundle (`replaceAll`: o marcador também aparece no comentário). Nunca editar `dist/sw.js` à mão. Arquivos novos da casca do app entram na lista `SHELL` do template.
- `npm run dev` gera um `index.html` que DESREGISTRA o service worker e limpa caches; só o build de produção registra. Sem isso o preview local serve o bundle antigo do cache.
- O registro do service worker fica só no `index.html` gerado (não no `artifact.html`): o Artifact não é o caminho de instalação, só de demonstração.
- O preview local é registrado em `C:\Users\User\Documents\CLAUDE\.claude\launch.json` (nome `fazendinha`, porta 3040), não nesta pasta.
