// Contenedor de escritorio de Fut Starzz.
//
// No hay logica de juego aca y no deberia haberla nunca: el juego corre ENTERO en el WebView, igual
// que en el navegador y en la app movil de Capacitor. Este binario solo abre la ventana y le sirve
// los archivos de dist-desktop. Cualquier cosa que se agregue aca seria una cuarta version del
// juego que mantener, con su propio comportamiento y sus propios bugs.
//
// Las partidas van a localStorage, que el WebView guarda en el perfil del usuario. Ojo: es un
// almacenamiento DISTINTO del navegador, asi que las carreras del navegador no aparecen aca ni al
// reves. Para pasarlas se usa exportar/importar partida, que existe justamente por esto.

// Sin consola detras de la ventana en Windows: sin esto, abrir el juego levanta tambien una consola
// negra vacia al lado.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("no se pudo iniciar Fut Starzz");
}
