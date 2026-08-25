// GENERADO por scripts/generar_escudos_seleccion.mjs -- no editar a mano.
//
// El escudo de cada selección, servido desde public/badges/selecciones/ (archivos propios, no
// enlaces a un CDN ajeno: el juego se ve igual sin internet y no depende de que Transfermarkt
// siga sirviendo la imagen).
//
// Existe porque las selecciones se dibujaban con las INICIALES de su nombre -- "SDA" para
// Selección de Alemania. buildNationalTeam les ponía `badgeLogoUrl` (bandera emoji) pero nunca
// `badgeImageUrl`, que es el único campo que ClubBadge dibuja como imagen.
//
// Va aparte de data.ts porque los escudos de CLUB no se tocan por ningún motivo (regla del
// proyecto), y así este mapa se regenera solo cuando se agreguen selecciones.

/** Escudo de cada selección, por su id en el juego. Ruta relativa: la resuelve ClubBadge. */
export const ESCUDO_DE_SELECCION: Readonly<Record<string, string>> = {
  wc_colombia: 'badges/selecciones/wc_colombia.png',                       // Colombia
  wc_alemania: 'badges/selecciones/wc_alemania.png',                       // Alemania
  wc_argentina: 'badges/selecciones/wc_argentina.png',                      // Argentina
  wc_canada: 'badges/selecciones/wc_canada.png',                         // Canadá
  wc_mexico: 'badges/selecciones/wc_mexico.png',                         // México
  wc_usa: 'badges/selecciones/wc_usa.png',                            // Estados Unidos
  wc_panama: 'badges/selecciones/wc_panama.png',                         // Panamá
  wc_brasil: 'badges/selecciones/wc_brasil.png',                         // Brasil
  wc_ecuador: 'badges/selecciones/wc_ecuador.png',                        // Ecuador
  wc_paraguay: 'badges/selecciones/wc_paraguay.png',                       // Paraguay
  wc_uruguay: 'badges/selecciones/wc_uruguay.png',                        // Uruguay
  wc_nueva_zelanda: 'badges/selecciones/wc_nueva_zelanda.png',                  // Nueva Zelanda
  wc_australia: 'badges/selecciones/wc_australia.png',                      // Australia
  wc_irak: 'badges/selecciones/wc_irak.png',                           // Irak
  wc_iran: 'badges/selecciones/wc_iran.png',                           // Irán
  wc_japon: 'badges/selecciones/wc_japon.png',                          // Japón
  wc_jordania: 'badges/selecciones/wc_jordania.png',                       // Jordania
  wc_corea_sur: 'badges/selecciones/wc_corea_sur.png',                      // Corea del Sur
  wc_catar: 'badges/selecciones/wc_catar.png',                          // Catar
  wc_arabia_saudita: 'badges/selecciones/wc_arabia_saudita.png',                 // Arabia Saudita
  wc_uzbekistan: 'badges/selecciones/wc_uzbekistan.png',                     // Uzbekistán
  wc_argelia: 'badges/selecciones/wc_argelia.png',                        // Argelia
  wc_egipto: 'badges/selecciones/wc_egipto.png',                         // Egipto
  wc_ghana: 'badges/selecciones/wc_ghana.png',                          // Ghana
  wc_marruecos: 'badges/selecciones/wc_marruecos.png',                      // Marruecos
  wc_senegal: 'badges/selecciones/wc_senegal.png',                        // Senegal
  wc_sudafrica: 'badges/selecciones/wc_sudafrica.png',                      // Sudáfrica
  wc_tunez: 'badges/selecciones/wc_tunez.png',                          // Túnez
  wc_austria: 'badges/selecciones/wc_austria.png',                        // Austria
  wc_belgica: 'badges/selecciones/wc_belgica.png',                        // Bélgica
  wc_bosnia: 'badges/selecciones/wc_bosnia.png',                         // Bosnia y Herzegovina
  wc_croacia: 'badges/selecciones/wc_croacia.png',                        // Croacia
  wc_chequia: 'badges/selecciones/wc_chequia.png',                        // Chequia
  wc_inglaterra: 'badges/selecciones/wc_inglaterra.png',                     // Inglaterra
  wc_francia: 'badges/selecciones/wc_francia.png',                        // Francia
  wc_holanda: 'badges/selecciones/wc_holanda.png',                        // Holanda
  wc_noruega: 'badges/selecciones/wc_noruega.png',                        // Noruega
  wc_portugal: 'badges/selecciones/wc_portugal.png',                       // Portugal
  wc_escocia: 'badges/selecciones/wc_escocia.png',                        // Escocia
  wc_espana: 'badges/selecciones/wc_espana.png',                         // España
  wc_suecia: 'badges/selecciones/wc_suecia.png',                         // Suecia
  wc_suiza: 'badges/selecciones/wc_suiza.png',                          // Suiza
  wc_turquia: 'badges/selecciones/wc_turquia.png',                        // Türkiye
  wc_italia: 'badges/selecciones/wc_italia.png',                         // Italia
  wc_dinamarca: 'badges/selecciones/wc_dinamarca.png',                      // Dinamarca
  wc_serbia: 'badges/selecciones/wc_serbia.png',                         // Serbia
  wc_polonia: 'badges/selecciones/wc_polonia.png',                        // Polonia
  wc_ucrania: 'badges/selecciones/wc_ucrania.png',                        // Ucrania
  wc_hungria: 'badges/selecciones/wc_hungria.png',                        // Hungría
  wc_rumania: 'badges/selecciones/wc_rumania.png',                        // Rumania
  wc_eslovaquia: 'badges/selecciones/wc_eslovaquia.png',                     // Eslovaquia
  wc_eslovenia: 'badges/selecciones/wc_eslovenia.png',                      // Eslovenia
  wc_albania: 'badges/selecciones/wc_albania.png',                        // Albania
  wc_georgia: 'badges/selecciones/wc_georgia.png',                        // Georgia
  wc_chile: 'badges/selecciones/wc_chile.png',                          // Chile
  wc_peru: 'badges/selecciones/wc_peru.png',                           // Perú
  wc_venezuela: 'badges/selecciones/wc_venezuela.png',                      // Venezuela
  wc_bolivia: 'badges/selecciones/wc_bolivia.png',                        // Bolivia
  wc_costa_rica: 'badges/selecciones/wc_costa_rica.png',                     // Costa Rica
  wc_jamaica: 'badges/selecciones/wc_jamaica.png',                        // Jamaica
  wc_chequia_euro: 'badges/selecciones/wc_chequia_euro.png',                   // República Checa
  wc_gales: 'badges/selecciones/wc_gales.png',                          // Gales
  wc_irlanda: 'badges/selecciones/wc_irlanda.png',                        // Irlanda
  wc_irlanda_norte: 'badges/selecciones/wc_irlanda_norte.png',                  // Irlanda del Norte
  wc_grecia: 'badges/selecciones/wc_grecia.png',                         // Grecia
  wc_islandia: 'badges/selecciones/wc_islandia.png',                       // Islandia
  wc_finlandia: 'badges/selecciones/wc_finlandia.png',                      // Finlandia
  wc_macedonia: 'badges/selecciones/wc_macedonia.png',                      // Macedonia del Norte
  wc_montenegro: 'badges/selecciones/wc_montenegro.png',                     // Montenegro
  wc_kosovo: 'badges/selecciones/wc_kosovo.png',                         // Kosovo
  wc_bulgaria: 'badges/selecciones/wc_bulgaria.png',                       // Bulgaria
  wc_bielorrusia: 'badges/selecciones/wc_bielorrusia.png',                    // Bielorrusia
  wc_israel: 'badges/selecciones/wc_israel.png',                         // Israel
  wc_kazajistan: 'badges/selecciones/wc_kazajistan.png',                     // Kazajistán
  wc_azerbaiyan: 'badges/selecciones/wc_azerbaiyan.png',                     // Azerbaiyán
  wc_armenia: 'badges/selecciones/wc_armenia.png',                        // Armenia
  wc_moldavia: 'badges/selecciones/wc_moldavia.png',                       // Moldavia
  wc_letonia: 'badges/selecciones/wc_letonia.png',                        // Letonia
  wc_lituania: 'badges/selecciones/wc_lituania.png',                       // Lituania
  wc_estonia: 'badges/selecciones/wc_estonia.png',                        // Estonia
  wc_chipre: 'badges/selecciones/wc_chipre.png',                         // Chipre
  wc_malta: 'badges/selecciones/wc_malta.png',                          // Malta
  wc_luxemburgo: 'badges/selecciones/wc_luxemburgo.png',                     // Luxemburgo
  wc_islas_feroe: 'badges/selecciones/wc_islas_feroe.png',                    // Islas Feroe
  wc_andorra: 'badges/selecciones/wc_andorra.png',                        // Andorra
  wc_san_marino: 'badges/selecciones/wc_san_marino.png',                     // San Marino
  wc_gibraltar: 'badges/selecciones/wc_gibraltar.png',                      // Gibraltar
};
