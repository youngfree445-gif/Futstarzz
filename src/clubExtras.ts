/**
 * clubExtras.ts
 * -------------------------------------------------------------------------
 * Diccionario separado de "datos volátiles" por club: Director Técnico real
 * y estética (colores/badge). Se mantiene APARTE de CLUBS_DATABASE (data.ts)
 * a propósito: los técnicos cambian todo el tiempo (varias veces por
 * temporada), mientras que el resto de los datos del club (nombre, liga,
 * salario base, etc.) son estables. Separarlo evita tener que tocar el
 * array de 2600 líneas cada vez que un DT es despedido o contratado.
 *
 * CÓMO SE USA:
 * data.ts hace merge automático de esto sobre ULTIMATE_CLUBS_DATABASE.
 * Si un club tiene una entrada acá, sus campos `dt`, `badgeColor` y
 * `badgeLogoUrl` se sobreescriben con estos valores. Si no tiene entrada,
 * se queda con el valor por defecto ("DT Genérico", etc.) hasta que lo
 * agregues.
 *
 * CÓMO SE ACTUALIZA:
 * 1. Agregá o editá entradas directamente en el objeto CLUB_EXTRAS.
 * 2. La `id` DEBE coincidir exactamente con el `id` del club en
 *    CLUBS_DATABASE (data.ts).
 *
 * FORMATO DE badgeColor: clase de Tailwind, mismo patrón que ya usa el
 * resto del archivo, ej: 'border-l-4 border-red-600 bg-red-950/40 text-red-200'
 * FORMATO DE badgeLogoUrl: 1 a 3 emojis representando los colores/escudo
 * del club, ej: '🔴⚪' o '🦊🔴'
 */

export interface ClubExtra {
  dt: string;
  badgeColor?: string;
  badgeLogoUrl?: string;
}

export const CLUB_EXTRAS: Record<string, ClubExtra> = {
  // ===== EJEMPLO DE FORMATO (bórralo cuando empieces a rellenar) =====
  // arsenal: { dt: 'Mikel Arteta', badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-red-200', badgeLogoUrl: '🔴⚪' },

  // ===== INGLATERRA (20 clubes) — verificado contra premierleague.com/en/managers el 15/07/2026 =====
  arsenal: { dt: 'Mikel Arteta', badgeColor: 'border-l-4 border-red-600 bg-zinc-950/40 text-red-200', badgeLogoUrl: '🔴⚪' },
  chelsea: { dt: 'Xabi Alonso', badgeColor: 'border-l-4 border-blue-600 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵🦁' }, // Corregido: el borrador inicial tenía a Maresca, que se fue al Man City
  liverpool_eng: { dt: 'Andoni Iraola', badgeColor: 'border-l-4 border-red-700 bg-red-950/40 text-red-200', badgeLogoUrl: '🔴🔴' }, // Corregido: reemplazó a Arne Slot en junio 2026
  manchester_city: { dt: 'Enzo Maresca', badgeColor: 'border-l-4 border-sky-400 bg-sky-950/40 text-sky-200', badgeLogoUrl: '🩵👑' }, // Corregido: Guardiola ya no dirige al City
  manchester_united: { dt: 'Michael Carrick', badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-red-200', badgeLogoUrl: '🔴😈' }, // Corregido: Amorim fue destituido en enero 2026
  tottenham_hotspur: { dt: 'Roberto De Zerbi', badgeColor: 'border-l-4 border-slate-200 bg-slate-950/40 text-slate-100', badgeLogoUrl: '⚪🐓' }, // Corregido: Postecoglou ya no está, hubo 2 técnicos después
  newcastle_united: { dt: 'Eddie Howe', badgeColor: 'border-l-4 border-zinc-900 bg-zinc-950/40 text-zinc-100', badgeLogoUrl: '⚫⚪' },
  aston_villa: { dt: 'Unai Emery', badgeColor: 'border-l-4 border-sky-400 bg-amber-950/40 text-sky-200', badgeLogoUrl: '🦁🍷' },
  west_ham_united: { dt: 'Nuno Espírito Santo', badgeColor: 'border-l-4 border-amber-600 bg-red-950/40 text-amber-200', badgeLogoUrl: '⚒️🍷' }, // Corregido, confianza media: reemplazó a Potter en sept. 2025
  brighton_hove_albion: { dt: 'Fabian Hürzeler', badgeColor: 'border-l-4 border-blue-500 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵⚪' },
  brentford: { dt: 'Keith Andrews', badgeColor: 'border-l-4 border-red-600 bg-zinc-950/40 text-red-200', badgeLogoUrl: '🐝🔴' }, // Corregido: Thomas Frank se fue al Tottenham
  crystal_palace: { dt: 'Pierre Sage', badgeColor: 'border-l-4 border-red-600 bg-blue-950/40 text-red-200', badgeLogoUrl: '🦅🔵' }, // Corregido: Glasner se fue al Nottingham Forest
  everton_eng: { dt: 'David Moyes', badgeColor: 'border-l-4 border-blue-700 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵🏰' }, // Corregido: Dyche fue destituido
  fulham: { dt: 'Por confirmar', badgeColor: 'border-l-4 border-zinc-200 bg-zinc-950/40 text-zinc-100', badgeLogoUrl: '⚪⚫' }, // Sin confirmar: la web oficial lo muestra vacante al 15/07/2026
  wolverhampton_wanderers: { dt: 'Rob Edwards', badgeColor: 'border-l-4 border-amber-500 bg-zinc-950/40 text-amber-200', badgeLogoUrl: '🐺💛' }, // Corregido, confianza media: O'Neil en realidad está en Ipswich
  nottingham_forest: { dt: 'Oliver Glasner', badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-red-200', badgeLogoUrl: '🌳🔴' }, // Corregido: Nuno está en West Ham, no en Forest
  afc_bournemouth: { dt: 'Marco Rose', badgeColor: 'border-l-4 border-red-600 bg-zinc-950/40 text-red-200', badgeLogoUrl: '🍒⚫' }, // Corregido: Iraola se fue al Liverpool
  burnley: { dt: 'Por confirmar', badgeColor: 'border-l-4 border-amber-600 bg-sky-950/40 text-amber-200', badgeLogoUrl: '🍷🔵' }, // Sin confirmar: hay indicios de que Burnley volvió a descender
  leeds_united: { dt: 'Daniel Farke', badgeColor: 'border-l-4 border-amber-400 bg-zinc-950/40 text-amber-200', badgeLogoUrl: '🟡⚪' },
  sunderland: { dt: 'Régis Le Bris', badgeColor: 'border-l-4 border-red-600 bg-zinc-950/40 text-red-200', badgeLogoUrl: '🔴⚪' },

  // ===== HOLANDA (17 clubes) — parcialmente verificado el 15/07/2026, ver comentarios de confianza =====
  ajax: { dt: 'Míchel', badgeColor: 'border-l-4 border-red-600 bg-zinc-950/40 text-red-200', badgeLogoUrl: '⚪🔴⚪' }, // Corregido: Farioli ya no está, tras interinato de García llegó Míchel
  almere_city_fc: { dt: 'Hedwiges Maduro', badgeColor: 'border-l-4 border-red-600 bg-zinc-950/40 text-red-200', badgeLogoUrl: '🔴⚫' }, // Sin verificar de forma independiente
  az: { dt: 'Leeroy Echteld', badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-red-200', badgeLogoUrl: '🔴⚪' }, // Corregido, confianza media: Martens ya no dirige al AZ
  fc_groningen: { dt: 'Dick Lukkien', badgeColor: 'border-l-4 border-green-600 bg-zinc-950/40 text-green-200', badgeLogoUrl: '🟢⚪' }, // Sin verificar de forma independiente
  fc_twente: { dt: 'Por confirmar', badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-red-200', badgeLogoUrl: '🔴🐴' }, // Corregido a "sin confirmar": Oosting (dato del borrador inicial) se fue a Go Ahead Eagles
  fc_utrecht: { dt: 'Ron Jans', badgeColor: 'border-l-4 border-red-600 bg-zinc-950/40 text-red-200', badgeLogoUrl: '🔴⚪' }, // Sin verificar de forma independiente
  feyenoord: { dt: 'Robin van Persie', badgeColor: 'border-l-4 border-red-600 bg-zinc-950/40 text-red-200', badgeLogoUrl: '🔴⚪🟢' }, // Confirmado
  go_ahead_eagles: { dt: 'Joseph Oosting', badgeColor: 'border-l-4 border-amber-500 bg-red-950/40 text-amber-200', badgeLogoUrl: '🦅🔴🟡' }, // Corregido: Simonis/Boel ya no están, Oosting llegó en junio 2026
  heracles_almelo: { dt: 'Por confirmar', badgeColor: 'border-l-4 border-zinc-900 bg-zinc-950/40 text-zinc-100', badgeLogoUrl: '⚫⚪' }, // Corregido a "sin confirmar": Van de Looi (dato del borrador inicial) ya se había ido
  nac_breda: { dt: 'Carl Hoefkens', badgeColor: 'border-l-4 border-amber-400 bg-zinc-950/40 text-amber-200', badgeLogoUrl: '🟡⚫' }, // Sin verificar de forma independiente
  nec_nijmegen: { dt: 'Por confirmar', badgeColor: 'border-l-4 border-red-600 bg-green-950/40 text-red-200', badgeLogoUrl: '🔴🟢⚫' }, // Corregido a "sin confirmar": Rogier Meijer (dato del borrador inicial acá) en realidad firmó con Sparta Rotterdam
  pec_zwolle: { dt: 'Por confirmar', badgeColor: 'border-l-4 border-blue-500 bg-zinc-950/40 text-blue-200', badgeLogoUrl: '🔵⚪' }, // Corregido a "sin confirmar": Jansen (dato del borrador inicial) ya había anunciado su salida
  psv: { dt: 'Peter Bosz', badgeColor: 'border-l-4 border-red-600 bg-zinc-950/40 text-red-200', badgeLogoUrl: '🔴⚪' }, // Plausible pero sin re-verificar en esta pasada
  rkc_waalwijk: { dt: 'Sander Duits', badgeColor: 'border-l-4 border-amber-400 bg-blue-950/40 text-amber-200', badgeLogoUrl: '🟡🔵' }, // Corregido, confianza media: reemplazó a Henk Fraser
  sc_heerenveen: { dt: 'Por confirmar', badgeColor: 'border-l-4 border-blue-600 bg-zinc-950/40 text-blue-200', badgeLogoUrl: '🔵⚪' }, // Corregido a "sin confirmar": el borrador inicial repitió a Robin van Persie, que ya está en Feyenoord
  sparta_rotterdam: { dt: 'Rogier Meijer', badgeColor: 'border-l-4 border-red-600 bg-zinc-950/40 text-red-200', badgeLogoUrl: '🔴⚪' }, // Corregido: reemplazó a Maurice Steijn
  willem_ii: { dt: 'Peter Maes', badgeColor: 'border-l-4 border-blue-800 bg-red-950/40 text-blue-200', badgeLogoUrl: '🔴⚪🔵' }, // Sin verificar de forma independiente

  // ===== ITALIA (40 clubes) — verificado contra Wikipedia ES (citas con fecha) el 15/07/2026 =====
  atalanta: { dt: 'Maurizio Sarri', badgeColor: 'border-l-4 border-blue-600 bg-zinc-950/40 text-blue-200', badgeLogoUrl: '⚫🔵' }, // Corregido: Gasperini se fue a la Roma hace tiempo
  bologna: { dt: 'Domenico Tedesco', badgeColor: 'border-l-4 border-red-600 bg-blue-950/40 text-red-200', badgeLogoUrl: '🔴🔵' }, // Corregido: nombrado 02/06/2026, reemplazó a Italiano
  cagliari: { dt: 'Fabio Pisacane', badgeColor: 'border-l-4 border-red-600 bg-blue-950/40 text-red-200', badgeLogoUrl: '🔴🔵🐑' }, // Corregido: continuidad confirmada 11/06/2026
  como: { dt: 'Cesc Fàbregas', badgeColor: 'border-l-4 border-blue-700 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵⚪' }, // Confirmado
  empoli: { dt: 'Roberto D\'Aversa', badgeColor: 'border-l-4 border-blue-600 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵⚪' }, // Sin verificar de forma independiente
  fiorentina: { dt: 'Fabio Grosso', badgeColor: 'border-l-4 border-purple-600 bg-zinc-950/40 text-purple-200', badgeLogoUrl: '🟣⚜️' }, // Corregido: nombrado 08/06/2026, el borrador inicial lo tenía por error enSassuolo
  genoa: { dt: 'Patrick Vieira', badgeColor: 'border-l-4 border-red-700 bg-blue-950/40 text-red-200', badgeLogoUrl: '🔴🔵🦁' }, // Sin verificar de forma independiente
  hellas_verona: { dt: 'Paolo Zanetti', badgeColor: 'border-l-4 border-yellow-500 bg-blue-950/40 text-yellow-200', badgeLogoUrl: '🟡🔵' }, // Plausible pero sin re-verificar
  inter: { dt: 'Cristian Chivu', badgeColor: 'border-l-4 border-blue-600 bg-zinc-950/40 text-blue-200', badgeLogoUrl: '🖤💙⭐️' }, // Corregido: Inzaghi ya no está, Chivu renovó hasta 2028
  juventus: { dt: 'Luciano Spalletti', badgeColor: 'border-l-4 border-zinc-900 bg-zinc-950/40 text-zinc-100', badgeLogoUrl: '⚪⚫🦓' }, // Corregido: Motta fue destituido, Spalletti renovó hasta 2028
  lazio: { dt: 'Gennaro Gattuso', badgeColor: 'border-l-4 border-sky-400 bg-zinc-950/40 text-sky-200', badgeLogoUrl: '🩵⚪🦅' }, // Corregido: nombrado 23/06/2026
  lecce: { dt: 'Eusebio Di Francesco', badgeColor: 'border-l-4 border-yellow-500 bg-red-950/40 text-yellow-200', badgeLogoUrl: '💛❤️🐺' }, // Corregido: renovó 17/06/2026, el borrador inicial lo tenía por error enVenezia
  milan: { dt: 'Rúben Amorim', badgeColor: 'border-l-4 border-red-600 bg-zinc-950/40 text-red-200', badgeLogoUrl: '🔴⚫😈' }, // Corregido: es el mismo que salió del Man Utd (ver clubExtras Inglaterra)
  monza: { dt: 'Alessandro Nesta', badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-red-200', badgeLogoUrl: '🔴⚪⚔️' }, // Sin verificar de forma independiente
  napoli: { dt: 'Antonio Conte', badgeColor: 'border-l-4 border-sky-500 bg-sky-950/40 text-sky-200', badgeLogoUrl: '🔵⚪🐴' }, // Sin verificar de forma independiente
  parma: { dt: 'Fabio Pecchia', badgeColor: 'border-l-4 border-yellow-400 bg-blue-950/40 text-yellow-200', badgeLogoUrl: '🟡🔵' }, // Sin verificar; se limpió un carácter chino suelto (十字) del badge original
  roma: { dt: 'Por confirmar', badgeColor: 'border-l-4 border-red-800 bg-amber-950/40 text-red-200', badgeLogoUrl: '🟡🔴🐺' }, // Sin confirmar: la única fuente que encontré sobre Ranieri/De Rossi es ambigua/vieja
  torino: { dt: 'Paolo Vanoli', badgeColor: 'border-l-4 border-red-900 bg-zinc-950/40 text-red-200', badgeLogoUrl: '🟤🐂' }, // Sin verificar de forma independiente
  udinese: { dt: 'Kosta Runjaic', badgeColor: 'border-l-4 border-zinc-900 bg-zinc-950/40 text-zinc-100', badgeLogoUrl: '⚫⚪🦅' }, // Sin verificar de forma independiente
  venezia: { dt: 'Por confirmar', badgeColor: 'border-l-4 border-orange-500 bg-green-950/40 text-orange-200', badgeLogoUrl: '🧡🖤💚' }, // Corregido a "sin confirmar": Di Francesco (dato del borrador inicial) en realidad está en Lecce
  bari: { dt: 'Moreno Longo', badgeColor: 'border-l-4 border-red-600 bg-zinc-950/40 text-red-200', badgeLogoUrl: '⚪🔴🐓' }, // Sin verificar de forma independiente
  brescia: { dt: 'Rolando Maran', badgeColor: 'border-l-4 border-blue-600 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵⚪🦁' }, // Sin verificar de forma independiente
  carrarese: { dt: 'Antonio Calabro', badgeColor: 'border-l-4 border-yellow-400 bg-blue-950/40 text-yellow-200', badgeLogoUrl: '🟡🔵' }, // Sin verificar de forma independiente
  catanzaro: { dt: 'Fabio Caserta', badgeColor: 'border-l-4 border-yellow-500 bg-red-950/40 text-yellow-200', badgeLogoUrl: '🔴🟡🦅' }, // Sin verificar de forma independiente
  cesena: { dt: 'Michele Mignani', badgeColor: 'border-l-4 border-zinc-900 bg-zinc-950/40 text-zinc-100', badgeLogoUrl: '⚫⚪🐴' }, // Sin verificar de forma independiente
  cittadella: { dt: 'Alessandro Dal Canto', badgeColor: 'border-l-4 border-red-800 bg-zinc-950/40 text-red-200', badgeLogoUrl: '🟤🏰' }, // Sin verificar de forma independiente
  cosenza: { dt: 'Massimiliano Alvini', badgeColor: 'border-l-4 border-red-600 bg-blue-950/40 text-red-200', badgeLogoUrl: '🔴🔵🐺' }, // Sin verificar de forma independiente
  cremonese: { dt: 'Por confirmar', badgeColor: 'border-l-4 border-red-500 bg-zinc-400/40 text-red-200', badgeLogoUrl: '🔴🩶' }, // Corregido a "sin confirmar": confirmé que Davide Nicola (posible confusión con Cagliari) fue destituido de Cremonese el 18/03/2026
  frosinone: { dt: 'Leandro Greco', badgeColor: 'border-l-4 border-yellow-400 bg-blue-950/40 text-yellow-200', badgeLogoUrl: '🟡🔵🦁' }, // Sin verificar DT. Confirmado: ascendió a división 1 (ver data.ts, ya corregido)
  juve_stabia: { dt: 'Guido Pagliuca', badgeColor: 'border-l-4 border-yellow-400 bg-blue-950/40 text-yellow-200', badgeLogoUrl: '💛💙🐝' }, // Sin verificar de forma independiente
  mantova: { dt: 'Davide Possanzini', badgeColor: 'border-l-4 border-red-600 bg-zinc-950/40 text-red-200', badgeLogoUrl: '🔴⚪' }, // Sin verificar de forma independiente
  modena: { dt: 'Paolo Mandelli', badgeColor: 'border-l-4 border-yellow-400 bg-blue-950/40 text-yellow-200', badgeLogoUrl: '🟡🔵' }, // Sin verificar; se limpió la palabra suelta "canary" del badge original
  palermo: { dt: 'Alessio Dionisi', badgeColor: 'border-l-4 border-pink-500 bg-zinc-950/40 text-pink-200', badgeLogoUrl: '💗🖤🦅' }, // Sin verificar de forma independiente
  pisa: { dt: 'Oscar Hiljemark', badgeColor: 'border-l-4 border-red-600 bg-blue-950/40 text-red-200', badgeLogoUrl: '⚫🔵' }, // Corregido: nombrado 03/02/2026, se limpió un carácter chino suelto (十字) del badge original. Nota: Pisa ya estaba correctamente en división 2, no requería cambio
  reggiana: { dt: 'William Viali', badgeColor: 'border-l-4 border-red-800 bg-zinc-950/40 text-red-200', badgeLogoUrl: '🟤🍇' }, // Sin verificar de forma independiente
  salernitana: { dt: 'Stefano Colantuono', badgeColor: 'border-l-4 border-red-900 bg-zinc-950/40 text-red-200', badgeLogoUrl: '🟤🐴' }, // Sin verificar de forma independiente
  sampdoria: { dt: 'Andrea Sottil', badgeColor: 'border-l-4 border-blue-600 bg-zinc-950/40 text-blue-200', badgeLogoUrl: '🔵⚪🔴⚫' }, // Sin verificar de forma independiente
  sassuolo: { dt: 'Por confirmar', badgeColor: 'border-l-4 border-green-600 bg-zinc-950/40 text-green-200', badgeLogoUrl: '🟢⚫' }, // Corregido a "sin confirmar": Fabio Grosso (dato del borrador inicial) en realidad está en Fiorentina
  spezia: { dt: 'Luca D\'Angelo', badgeColor: 'border-l-4 border-zinc-200 bg-zinc-950/40 text-zinc-100', badgeLogoUrl: '⚪⚫🦅' }, // Sin verificar de forma independiente
  sudtirol: { dt: 'Marco Zaffaroni', badgeColor: 'border-l-4 border-red-600 bg-zinc-950/40 text-red-200', badgeLogoUrl: '⚪🔴' }, // Sin verificar de forma independiente

  // ===== ESPAÑA (42 clubes) — verificado el 15/07/2026. Lote original sin búsqueda web (alto riesgo, revisado a fondo) =====
  athletic_club_esp: { dt: 'Edin Terzić', badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-red-200', badgeLogoUrl: '🔴⚪' }, // Corregido: reemplazó a Valverde, contrato hasta 2028
  atletico_de_madrid: { dt: 'Diego Simeone', badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-red-200', badgeLogoUrl: '🔴⚪' }, // Confirmado: 16ª temporada
  ca_osasuna: { dt: 'Luis Miguel Ramis', badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-red-200', badgeLogoUrl: '🔴' }, // Corregido: llega desde el Burgos
  celta: { dt: 'Claudio Giráldez', badgeColor: 'border-l-4 border-sky-500 bg-sky-950/40 text-sky-200', badgeLogoUrl: '🟦' }, // Confirmado
  d_alaves: { dt: 'Luis García Plaza', badgeColor: 'border-l-4 border-blue-600 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵⚪' }, // Sin verificar de forma independiente
  elche_cf: { dt: 'Eder Sarabia', badgeColor: 'border-l-4 border-green-600 bg-green-950/40 text-green-200', badgeLogoUrl: '🟢⚪' }, // Sin verificar de forma independiente
  fc_barcelona: { dt: 'Hansi Flick', badgeColor: 'border-l-4 border-blue-700 bg-blue-950/40 text-red-200', badgeLogoUrl: '🔵🔴' }, // Confirmado
  getafe_cf: { dt: 'José Bordalás', badgeColor: 'border-l-4 border-blue-800 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵' }, // Confirmado: acaba de renovar
  girona_fc: { dt: 'Míchel', badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-red-200', badgeLogoUrl: '🔴⚪' }, // DT sin verificar. Confirmado: descendió a división 2 (ver data.ts, ya corregido)
  levante_ud: { dt: 'Julián Calero', badgeColor: 'border-l-4 border-blue-600 bg-blue-950/40 text-red-200', badgeLogoUrl: '🔵🔴' }, // Sin verificar de forma independiente
  r_oviedo: { dt: 'Javier Calleja', badgeColor: 'border-l-4 border-blue-700 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵' }, // DT sin verificar. Confirmado: descendió a división 2, fue el primer equipo descendido (ver data.ts, ya corregido)
  rcd_espanyol: { dt: 'Manolo González', badgeColor: 'border-l-4 border-blue-600 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵⚪' }, // Confirmado
  rcd_mallorca: { dt: 'Jagoba Arrasate', badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-red-200', badgeLogoUrl: '🔴🖤' }, // DT sin verificar. Confirmado: descendió a división 2 tras 5 años en Primera (ver data.ts, ya corregido)
  rayo_vallecano: { dt: 'Beñat San José', badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-red-200', badgeLogoUrl: '🔴⚪' }, // Corregido: Íñigo Pérez (dato del borrador inicial) se fue al Villarreal
  real_betis: { dt: 'Manuel Pellegrini', badgeColor: 'border-l-4 border-green-600 bg-green-950/40 text-green-200', badgeLogoUrl: '🟢⚪' }, // Confirmado: desde 2020
  real_madrid: { dt: 'José Mourinho', badgeColor: 'border-l-4 border-slate-200 bg-slate-950/40 text-slate-200', badgeLogoUrl: '⚪' }, // Corregido: regresó al club tras las salidas de Xabi Alonso y Arbeloa
  real_sociedad: { dt: 'Por confirmar', badgeColor: 'border-l-4 border-blue-600 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵⚪' }, // Corregido a "sin confirmar": Alguacil aparece como candidato libre en el mercado, no como técnico actual
  sevilla_fc: { dt: 'García Pimienta', badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-red-200', badgeLogoUrl: '🔴⚪' }, // Sin verificar de forma independiente
  valencia_cf: { dt: 'Carlos Corberán', badgeColor: 'border-l-4 border-orange-600 bg-orange-950/40 text-orange-200', badgeLogoUrl: '🟠⚪' }, // Corregido: reemplazó a Rubén Baraja
  villarreal_cf: { dt: 'Iñigo Pérez', badgeColor: 'border-l-4 border-yellow-500 bg-yellow-950/40 text-yellow-200', badgeLogoUrl: '🟡' }, // Corregido: llega desde el Rayo Vallecano, reemplazó a Marcelino
  ad_ceuta_fc: { dt: 'José Juan Romero', badgeColor: 'border-l-4 border-white bg-slate-950/40 text-white', badgeLogoUrl: '⚪⚫' }, // Sin verificar de forma independiente
  albacete_bp: { dt: 'Alberto González', badgeColor: 'border-l-4 border-white bg-red-950/40 text-white', badgeLogoUrl: '⚪🔴' }, // Sin verificar de forma independiente
  burgos_cf: { dt: 'Por confirmar', badgeColor: 'border-l-4 border-white bg-slate-950/40 text-white', badgeLogoUrl: '⚪⚫' }, // Corregido a "sin confirmar": Ramis (dato del borrador inicial) se fue a Osasuna
  cd_castellon: { dt: 'Dick Schreuder', badgeColor: 'border-l-4 border-black bg-slate-950/40 text-white', badgeLogoUrl: '⚫⚪' }, // Sin verificar de forma independiente
  cd_leganes: { dt: 'Borja Jiménez', badgeColor: 'border-l-4 border-blue-600 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵⚪' }, // Sin verificar de forma independiente
  cd_mirandes: { dt: 'Alessio Lisci', badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-red-200', badgeLogoUrl: '🔴⚫' }, // Sin verificar de forma independiente
  cultural_leonesa: { dt: 'Raúl Llona', badgeColor: 'border-l-4 border-white bg-red-950/40 text-white', badgeLogoUrl: '⚪🔴' }, // Sin verificar de forma independiente
  cadiz_cf: { dt: 'Paco López', badgeColor: 'border-l-4 border-yellow-400 bg-yellow-950/40 text-yellow-200', badgeLogoUrl: '🟡🔵' }, // Sin verificar de forma independiente
  cordoba_cf: { dt: 'Iván Ania', badgeColor: 'border-l-4 border-green-600 bg-green-950/40 text-green-200', badgeLogoUrl: '🟢⚪' }, // Sin verificar de forma independiente
  fc_andorra: { dt: 'Ferran Costa', badgeColor: 'border-l-4 border-blue-700 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵🔴' }, // Sin verificar de forma independiente
  granada_cf: { dt: 'Fran Escribá', badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-red-200', badgeLogoUrl: '🔴⚪' }, // Sin verificar de forma independiente
  malaga_cf: { dt: 'Juan Francisco Funes', badgeColor: 'border-l-4 border-blue-600 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵⚪' }, // Corregido DT, confianza media. Confirmado: ganó el playoff y ascendió a división 1 (ver data.ts, ya corregido)
  r_racing_club: { dt: 'José Alberto López', badgeColor: 'border-l-4 border-green-600 bg-green-950/40 text-green-200', badgeLogoUrl: '🟢⚪' }, // Confirmado DT. Confirmado: ascendió a división 1 (ver data.ts, ya corregido)
  r_sporting: { dt: 'Rubén Albés', badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-red-200', badgeLogoUrl: '🔴⚪' }, // Sin verificar de forma independiente
  r_valladolid_cf: { dt: 'Paulo Pezzolano', badgeColor: 'border-l-4 border-violet-600 bg-violet-950/40 text-violet-200', badgeLogoUrl: '🟣⚪' }, // Sin verificar de forma independiente
  rc_deportivo: { dt: 'Antonio Hidalgo', badgeColor: 'border-l-4 border-blue-600 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵⚪' }, // Corregido: el borrador inicial lo tenía por error enSD Huesca. Confirmado: ascendió a división 1 (ver data.ts, ya corregido)
  real_sociedad_b: { dt: 'Sergio Francisco', badgeColor: 'border-l-4 border-blue-600 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵⚪' }, // Sin verificar de forma independiente
  real_zaragoza: { dt: 'Víctor Fernández', badgeColor: 'border-l-4 border-blue-600 bg-blue-950/40 text-blue-200', badgeLogoUrl: '🔵⚪' }, // Sin verificar de forma independiente
  sd_eibar: { dt: 'Joseba Etxeberria', badgeColor: 'border-l-4 border-blue-700 bg-blue-950/40 text-red-200', badgeLogoUrl: '🔵🔴' }, // Sin verificar de forma independiente
  sd_huesca: { dt: 'Por confirmar', badgeColor: 'border-l-4 border-blue-600 bg-blue-950/40 text-red-200', badgeLogoUrl: '🔵🔴' }, // Corregido a "sin confirmar": Antonio Hidalgo (dato del borrador inicial) en realidad está en el Deportivo
  ud_almeria: { dt: 'Rubi', badgeColor: 'border-l-4 border-red-600 bg-red-950/40 text-red-200', badgeLogoUrl: '🔴⚪' }, // Confianza media: su continuidad se menciona como aún no confirmada al 100%
  ud_las_palmas: { dt: 'Luis Carrión', badgeColor: 'border-l-4 border-yellow-500 bg-yellow-950/40 text-yellow-200', badgeLogoUrl: '🟡🔵' }, // Sin verificar de forma independiente

  // ===== ALEMANIA (36 clubes) =====

  // ===== FRANCIA (18 clubes) =====

  // ===== PORTUGAL (18 clubes) =====

  // ===== ESTADOS UNIDOS / MLS (30 clubes) =====

  // ===== ARGENTINA (54 clubes) =====

  // ===== CHILE (27 clubes) =====

  // ===== ECUADOR (24 clubes) =====

  // ===== MÉXICO (15 clubes) =====

  // ===== PERÚ (14 clubes) =====

  // ===== URUGUAY (12 clubes) =====

  // ===== COLOMBIA (11 clubes) =====

  // ===== BOLIVIA (16 clubes) =====

  // ===== VENEZUELA (14 clubes) =====

  // ===== PARAGUAY (12 clubes) =====

  // ===== RESTO DEL MUNDO (30 clubes) =====
};
