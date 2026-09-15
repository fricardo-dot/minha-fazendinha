# Minha Fazendinha

Jogo infantil de fazenda para tablet e celular (touch), feito para uma criança de 3 anos.
Sem texto para ler, sem punição, sem game over, sem anúncios ou compras.

Ciclo principal: **cuidar dos animais → produzir → coletar → entregar → ganhar moedas → melhorar a fazenda**.

## Rodar

```bash
npm install
npm run dev
```

Abre em `http://localhost:3040` com rebuild automático.

```bash
npm run build
```

Gera em `dist/`:

- `index.html` + `app.js` + `app.css` + `manifest.webmanifest` + `sw.js` + `icons/` — PWA completa, pronta para hospedar em qualquer servidor estático com HTTPS;
- `artifact.html` — fragmento para publicar como Artifact (CSS embutido, referencia `app.js`).

## Instalar no iPad / iPhone / Android (PWA)

A PWA precisa estar em um endereço **https** (o Artifact do Claude não serve para instalar). A pasta `dist/` é estática: GitHub Pages, Render, Netlify ou qualquer servidor.
Este repositório já traz um workflow (`.github/workflows/pages.yml`) que publica no GitHub Pages a cada push na `main` (em Settings → Pages, escolha Source = "GitHub Actions").

- **iPad/iPhone (Safari):** abrir o endereço → botão Compartilhar → "Adicionar à Tela de Início". Abre em tela cheia, paisagem, e funciona offline depois da primeira visita.
- **Android (Chrome):** menu ⋮ → "Instalar app" (ou o aviso automático).

Ícones: `public/icons/` (gerados por `npm run icons` a partir de um SVG próprio em `tools/make-icons.mjs`).
Atualizações: o service worker guarda a casca do app; a versão do cache é o hash do bundle, então cada build novo troca o cache na abertura seguinte.

## Mapa da fazenda

A fazenda é um mapa com áreas lado a lado; a criança passa de uma para outra pelas setas grandes nas bordas (placas redondas com o desenho da área vizinha) ou deslizando o dedo.

- **Quintal** (início): galinheiro, milharal, celeiro com milho e feno, canteiro de flores.
- **Pasto**: vaca com espaço para passear, chiqueiro (comprável) com o porquinho, estação de ração (mesmo milho do celeiro, feno à vontade).
- **Lago**: cenário calmo com sapo e pato para tocar; píer reservado para pescar.

Pote de moedas, cesta, caminhão de entregas e kit de cuidados acompanham a criança em todas as áreas. Um item "na mão" (milho, feno, esponja…) também: dá para pegar milho no Quintal, tocar na seta e entregar ao porquinho no Pasto. Quando a próxima coisa a fazer está em outra área, a seta para lá pulsa.

Áreas ficam em `src/areas/` e são registradas em `src/config/areas.js`.

## Visual

Vista 3/4 em estilo "brinquedo 3D" (gradientes, sombras de contato, adereços, textura de grama), feita só com SVG e CSS. O Quintal, os animais, os ícones e a interface persistente já estão nessa direção; Pasto, Lago e os minigames ainda usam a arte antiga e são o próximo passo.

## O que existe na V1

- 2 galinhas no Quintal (comem milho → ovo no ninho), 1 vaca no Pasto (come feno → leite via minigame de ordenha).
- Milharal com 3 canteiros: plantar → regar → crescer → colher (o milho alimenta as galinhas).
- Cesta de coleta e caminhão de entregas (ovos e leite viram moedas).
- Minigame da cesta de ovos quando há 4+ ovos na entrega (bônus).
- Minigame de lavar o porquinho (esponja + chuveiro).
- Minigame de tosar a ovelha (máquina de tosar sobre os tufos de lã).
- 5 melhorias com mudança física: galinheiro pintado, canteiro de flores, celeiro com silo, chiqueiro (traz o porquinho) e curral no morro (traz a ovelha).
- Porquinho: come milho, rola na lama e fica enlameado; tocar nele abre o minigame de lavar (esfregar a esponja até a lama sumir e abrir o chuveiro). Limpo, fareja uma trufa que vai para a cesta.
- Ovelha (curral no morro do Pasto, comprável): come feno, a lã cresce até ficar bem fofa e ela pede a tesoura; tocar nela abre o minigame de tosar (passar a máquina sobre a lã, tufos voam para o cesto). A tosa rende um novelo para a cesta.
- Cuidados com gesto de esfregar: os animais ficam de vez em quando empoeirados (pedem esponja) ou despenteados (pedem escova); a criança leva a ferramenta do kit até o animal e esfrega com o dedo até ele ficar limpo e brilhante.
- Amizade por animal (corações) com 3 estágios visuais: sino / ninho bonito / pintinho / coroa de flores.
- Dicas automáticas após alguns segundos sem toque; área dos pais por toque longo (3 s).
- Progresso salvo no aparelho (localStorage), com timers por timestamp (nada morre nem apodrece).

## Onde ajustar

- **Todos os números do jogo** (tempos, custos, recompensas, corações): `src/config/balance.js`.
- Registro de animais, cultivos e melhorias: `src/config/content.js`.
- Posições na tela (palco lógico 1600×1000): `src/config/layout.js`.

## Estrutura

```
src/
  config/        balanceamento, conteúdo, layout
  state/         reducer puro, provider (ações de alto nível), seletores (dicas)
  rules/         produção (timers), economia, amizade
  persistence/   interface load/save/clear + adapters (localStorage, memória)
  audio/         AudioManager + sons sintetizados (WebAudio)
  interaction/   sistema "pegar e levar" (arrastar OU tocar-e-tocar)
  components/    palco escalável, fundo, efeitos, HUD, área dos pais
  animals/       sprites SVG, comportamento, ator
  buildings/     galinheiro, celeiro, milharal, cesta, entregas, placas, flores
  minigames/     registro + ordenha + cesta de ovos
```
