import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import PantallaDeError from './components/PantallaDeError.tsx';
import { encenderReporteRemoto } from './reporteRemoto';
import './index.css';

// ANTES de montar React, no despues: un error durante el primer render es justamente el que hay que
// capturar, y encendiendolo despues ese se pierde. Sin DSN configurado no hace nada.
encenderReporteRemoto();

// PantallaDeError envuelve TODO y va por fuera de App a proposito: un error tirado durante el render
// desmonta el arbol entero, asi que si el limite estuviera adentro de App se caeria junto con el.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PantallaDeError>
      <App />
    </PantallaDeError>
  </StrictMode>,
);
