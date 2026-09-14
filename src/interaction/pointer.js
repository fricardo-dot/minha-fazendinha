// Utilitários de ponteiro compartilhados pelos minigames e pela sessão de cuidado.

/** setPointerCapture tolerante: alguns navegadores lançam erro se o ponteiro já foi solto. */
export function capturePointer(e) {
  try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* segue sem captura */ }
}
