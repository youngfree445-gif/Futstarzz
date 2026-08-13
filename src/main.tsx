import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import PantallaDeError from './components/PantallaDeError.tsx';
import './index.css';

// PantallaDeError envuelve TODO y va por fuera de App a proposito: un error tirado durante el render
// desmonta el arbol entero, asi que si el limite estuviera adentro de App se caeria junto con el.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PantallaDeError>
      <App />
    </PantallaDeError>
  </StrictMode>,
);
