import { createRoot } from 'react-dom/client';
import './styles/app.css';
import { Stage } from './components/Stage.jsx';
import { FxProvider } from './components/Fx.jsx';
import { GameProvider } from './state/GameProvider.jsx';
import { DragProvider } from './interaction/DragContext.jsx';
import { Farm } from './components/Farm.jsx';
import { RotateHint } from './components/RotateHint.jsx';
import { ArtDefs } from './art/ArtDefs.jsx';

function App() {
  return (
    <>
      <ArtDefs />
      <Stage>
        <FxProvider>
          <GameProvider>
            <DragProvider>
              <Farm />
            </DragProvider>
          </GameProvider>
        </FxProvider>
      </Stage>
      <RotateHint />
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
