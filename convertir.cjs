const fs = require('fs');
const XLSX = require('xlsx');

// 1. Cargar el archivo Excel
const workbook = XLSX.readFile('PlayerIDS LTA 26 V2.5.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// 2. Convertir a formato JSON crudo
const rawData = XLSX.utils.sheet_to_json(worksheet);

// 3. Mapear y adaptar las columnas exactamente a tu juego
const parsedPlayers = rawData.map(row => {
    // Normalizar el nombre (usar commonname o firstname + lastname)
    const name = row.commonname || `${row.firstname || ''} ${row.lastname || ''}`.trim();
    
    // Normalizar la posición principal
    const mainPos = row.Position ? row.Position.trim().toUpperCase() : 'CM';

    // Calcular un valor aproximado según la valoración para tu interfaz
    const rating = parseInt(row.overallrating) || 60;
    const valorMercado = rating > 50 ? (rating - 50) * 1000000 : 50000;

    return {
        player_id: String(row.playerid),
        nombre_completo: name,
        posicion_especifica: mainPos,
        valor_mercado_eur: valorMercado,
        media_valoracion: rating,
        // Columnas extras ocultas que usará nuestro inyector dinámico
        team_name: String(row.teamname || ''),
        team_id: parseInt(row.teamid) || 0,
        // Clasificación táctica basada en tu interfaz Player de TypeScript
        categoria_tactica: mainPos === 'GK' ? 'portero' : ['CB', 'LB', 'RB', 'LWB', 'RWB', 'CDM'].includes(mainPos) ? 'defensivo' : 'ofensivo'
    };
});

// 4. Guardar el archivo final optimizado en tu carpeta src
fs.writeFileSync('./src/playersDatabase.json', JSON.stringify(parsedPlayers, null, 2), 'utf-8');
console.log(`¡Éxito total! Se han guardado ${parsedPlayers.length} jugadores en src/playersDatabase.json`);