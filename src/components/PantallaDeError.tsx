import React from 'react';
import { estadoAntesDeLaCaida } from '../reporteDeBug';
import { avisarDeLaCaida } from '../reporteRemoto';

/**
 * Red de seguridad contra la PANTALLA EN NEGRO.
 *
 * En React, un error tirado durante el render desmonta el arbol ENTERO. Sin nada que lo atrape, lo
 * que queda es un <div id="root"> vacio: la pantalla negra. Peor todavia, el mensaje del error se
 * queda en la consola del navegador, que es justo donde el jugador no mira -- asi que un bug de una
 * linea se reporta como "se crasheo y no se ve nada", sin un solo dato para encontrarlo.
 *
 * Reportado: "al tercer o cuarto partido se crasheo y se queda en negro".
 *
 * Esto no arregla ningun bug: arregla la CONSECUENCIA. Con esto puesto, un error de render muestra
 * el mensaje, deja copiar el detalle tecnico y ofrece volver al menu -- y sobre todo, la partida
 * guardada queda intacta, porque el guardado ya paso antes del render.
 */
interface Props { children: React.ReactNode }
interface State { error: Error | null; detalle: string }

export default class PantallaDeError extends React.Component<Props, State> {
  state: State = { error: null, detalle: '' };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // El componentStack dice EN QUE COMPONENTE reventó, que es la mitad util del diagnostico: el
    // mensaje solo ("cannot read properties of undefined") aparece en veinte lugares distintos.
    //
    // La otra mitad del diagnostico es QUE ESTABA JUGANDO. Esta pantalla envuelve el arbol entero
    // desde main.tsx, asi que cuando se despierta el arbol que tenia el perfil ya se desmonto y no
    // hay de donde leerlo. Por eso App va dejando una foto del estado en una variable de modulo,
    // que sobrevive al desmontaje porque no es parte del arbol (ver src/reporteDeBug.ts). Sin esto,
    // el reporte de una caida traia el stack trace y nada mas -- y el stack dice DONDE reventó,
    // no en que fecha, en que torneo ni contra quien.
    const estado = estadoAntesDeLaCaida();
    const tecnico = `${error.stack ?? error.message}\n\nComponente:${info.componentStack}`;
    this.setState({ detalle: estado ? `${estado}\n\n--- DETALLE TECNICO DEL ERROR ---\n${tecnico}` : tecnico });
    console.error('[Fut Starzz] error de render', error, info);
    // Y si hay reporte remoto configurado, que llegue tambien la caida del que NO va a escribirte
    // (ver src/reporteRemoto.ts). Sin DSN esto no hace nada.
    avisarDeLaCaida(error, estado);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-slate-900 border border-burgundy-500/40 rounded-3xl p-6 space-y-4">
          <h1 className="text-xl font-black uppercase text-burgundy-400">Se rompió algo en la pantalla</h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Tu partida <strong>no se perdió</strong>: lo que falló es el dibujo de la pantalla, y el
            guardado ocurre antes. Volvé al menú y entrá de nuevo a tu carrera.
          </p>
          <p className="text-xs text-slate-400">
            Si puedes, copia el detalle de abajo y pásamelo: con eso el bug se encuentra en minutos.
          </p>
          <pre className="text-3xs bg-slate-950 border border-slate-800 rounded-xl p-3 overflow-auto max-h-64 whitespace-pre-wrap text-slate-400">
            {this.state.detalle || this.state.error.message}
          </pre>
          <div className="flex gap-2">
            <button
              onClick={() => { navigator.clipboard?.writeText(this.state.detalle || this.state.error!.message); }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-bold"
            >
              Copiar detalle
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-burgundy-600 hover:bg-burgundy-500 text-white text-sm font-bold"
            >
              Volver al menú
            </button>
          </div>
        </div>
      </div>
    );
  }
}
