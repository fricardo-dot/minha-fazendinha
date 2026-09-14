// Build da Minha Fazendinha.
// - `node build.mjs`          → gera dist/app.js, dist/app.css, dist/index.html e dist/artifact.html
// - `node build.mjs --serve`  → mesmo, com servidor local em http://localhost:5173 e rebuild automático
import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';

const serve = process.argv.includes('--serve');
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

const options = {
  entryPoints: { app: 'src/main.jsx' },
  bundle: true,
  minify: !serve,
  sourcemap: serve ? 'inline' : false,
  outdir: 'dist',
  jsx: 'automatic',
  target: ['es2019', 'safari14', 'chrome90'],
  define: {
    'process.env.NODE_ENV': serve ? '"development"' : '"production"',
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  logLevel: 'info',
};

function writeHtml() {
  mkdirSync('dist', { recursive: true });
  const body = readFileSync('src/template.body.html', 'utf8');
  const css = readFileSync('dist/app.css', 'utf8');

  // Arquivos estáticos da PWA (manifesto, ícones) + service worker com versão = hash do bundle
  cpSync('public', 'dist', { recursive: true, filter: (src) => !src.endsWith('sw.template.js') });
  const version = createHash('sha1').update(readFileSync('dist/app.js')).update(css).digest('hex').slice(0, 10);
  writeFileSync('dist/sw.js', readFileSync('public/sw.template.js', 'utf8').replaceAll('__VERSION__', version));

  // Página completa (uso local / futura PWA)
  const full = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Fazendinha">
<meta name="mobile-web-app-capable" content="yes">
<meta name="theme-color" content="#C9ECF7">
<meta name="description" content="Jogo de fazenda para crianças pequenas: cuidar dos animais, plantar, colher e melhorar a fazenda.">
<title>Minha Fazendinha</title>
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icons/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" sizes="180x180" href="icons/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&display=swap">
<link rel="stylesheet" href="app.css">
</head>
<body>
${body}
<script src="app.js"></script>
<script>
// Service worker: só em https (ou localhost). Falha silenciosa: o jogo funciona igual sem ele.
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  });
}
</script>
</body>
</html>
`;
  writeFileSync('dist/index.html', full);

  // Fragmento para publicação como Artifact (o publicador adiciona doctype/head/body)
  const artifact = `<title>Minha Fazendinha</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&display=swap">
<style>
${css}
</style>
${body}
<script src="app.js"></script>
`;
  writeFileSync('dist/artifact.html', artifact);
}

if (serve) {
  const ctx = await esbuild.context({
    ...options,
    plugins: [{
      name: 'html',
      setup(build) {
        build.onEnd((result) => {
          if (result.errors.length === 0) writeHtml();
        });
      },
    }],
  });
  await ctx.watch();
  const { hosts, port } = await ctx.serve({ servedir: 'dist', port: Number(process.env.PORT) || 3040 });
  console.log(`Servindo em http://localhost:${port} (${hosts.join(', ')})`);
} else {
  await esbuild.build(options);
  writeHtml();
  console.log('Build concluído: dist/index.html, dist/artifact.html, dist/app.js, dist/app.css');
}
