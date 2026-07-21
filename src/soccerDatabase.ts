export interface Player {
  player_id: string;
  nombre_completo: string;
  categoria_tactica: 'portero' | 'defensivo' | 'ofensivo';
  posicion_especifica: string;
  valor_mercado_eur: number;
  media_valoracion: number;
}

export interface Club {
  club_id: string;
  nombre_oficial: string;
  siglas: string;
  pais: string;
  confederacion: string;
  estadio: string;
  director_tecnico: {
    staff_id: string;
    nombre: string;
    nacionalidad: string;
    tactica_preferida: string;
    estilo_juego: string;
  };
  palmares: {
    nombre_torneo: string;
    titulos_ganados: number;
    ultimo_año_campeon: number;
  }[];
  plantilla: {
    porteros: Player[];
    defensivos: Player[];
    ofensivos: Player[];
  };
}

export const soccerDatabase: Record<string, Club> = {
  ARG_BOC: {
    club_id: "ARG_BOC",
    nombre_oficial: "Club Atlético Boca Juniors",
    siglas: "BOC",
    pais: "Argentina",
    confederacion: "CONMEBOL",
    estadio: "La Bombonera",
    director_tecnico: {
      staff_id: "DT_BOC_01",
      nombre: "Fernando Gago",
      nacionalidad: "Argentina",
      tactica_preferida: "4-3-3",
      estilo_juego: "Gegenpressing"
    },
    palmares: [
      { nombre_torneo: "CONMEBOL Libertadores", titulos_ganados: 6, ultimo_año_campeon: 2007 },
      { nombre_torneo: "Primera División Argentina", titulos_ganados: 35, ultimo_año_campeon: 2022 }
    ],
    plantilla: {
      porteros: [
        { player_id: "P_BOC_1", nombre_completo: "Sergio Romero", categoria_tactica: "portero", posicion_especifica: "GK", valor_mercado_eur: 400000, media_valoracion: 74 }
      ],
      defensivos: [
        { player_id: "P_BOC_2", nombre_completo: "Marcos Rojo", categoria_tactica: "defensivo", posicion_especifica: "CB", valor_mercado_eur: 1200000, media_valoracion: 76 },
        { player_id: "P_BOC_3", nombre_completo: "Luis Advíncula", categoria_tactica: "defensivo", posicion_especifica: "RB", valor_mercado_eur: 1000000, media_valoracion: 75 },
        { player_id: "P_BOC_4", nombre_completo: "Lautaro Blanco", categoria_tactica: "defensivo", posicion_especifica: "LB", valor_mercado_eur: 4000000, media_valoracion: 77 }
      ],
      ofensivos: [
        { player_id: "P_BOC_5", nombre_completo: "Edinson Cavani", categoria_tactica: "ofensivo", posicion_especifica: "ST", valor_mercado_eur: 1000000, media_valoracion: 78 },
        { player_id: "P_BOC_6", nombre_completo: "Kevin Zenón", categoria_tactica: "ofensivo", posicion_especifica: "CAM", valor_mercado_eur: 10000000, media_valoracion: 79 },
        { player_id: "P_BOC_7", nombre_completo: "Miguel Merentiel", categoria_tactica: "ofensivo", posicion_especifica: "ST", valor_mercado_eur: 6000000, media_valoracion: 77 }
      ]
    }
  },
  MEX_AMER: {
    club_id: "MEX_AMER",
    nombre_oficial: "Club América",
    siglas: "AME",
    pais: "México",
    confederacion: "CONCACAF",
    estadio: "Estadio Azteca",
    director_tecnico: {
      staff_id: "DT_AME_01",
      nombre: "André Jardine",
      nacionalidad: "Brasil",
      tactica_preferida: "4-2-3-1",
      estilo_juego: "Tiki-Taka"
    },
    palmares: [
      { nombre_torneo: "Liga MX", titulos_ganados: 15, ultimo_año_campeon: 2024 },
      { nombre_torneo: "CONCACAF Champions Cup", titulos_ganados: 7, ultimo_año_campeon: 2016 }
    ],
    plantilla: {
      porteros: [
        { player_id: "P_AME_1", nombre_completo: "Luis Malagón", categoria_tactica: "portero", posicion_especifica: "GK", valor_mercado_eur: 7000000, media_valoracion: 79 }
      ],
      defensivos: [
        { player_id: "P_AME_2", nombre_completo: "Sebastián Cáceres", categoria_tactica: "defensivo", posicion_especifica: "CB", valor_mercado_eur: 7000000, media_valoracion: 76 },
        { player_id: "P_AME_3", nombre_completo: "Kevin Álvarez", categoria_tactica: "defensivo", posicion_especifica: "RB", valor_mercado_eur: 5000000, media_valoracion: 74 }
      ],
      ofensivos: [
        { player_id: "P_AME_4", nombre_completo: "Diego Valdés", categoria_tactica: "ofensivo", posicion_especifica: "CAM", valor_mercado_eur: 6000000, media_valoracion: 80 },
        { player_id: "P_AME_5", nombre_completo: "Henry Martín", categoria_tactica: "ofensivo", posicion_especifica: "ST", valor_mercado_eur: 4500000, media_valoracion: 78 },
        { player_id: "P_AME_6", nombre_completo: "Álvaro Fidalgo", categoria_tactica: "ofensivo", posicion_especifica: "CM", valor_mercado_eur: 8000000, media_valoracion: 79 }
      ]
    }
  },
  RMA_EUR: {
    club_id: "RMA_EUR",
    nombre_oficial: "Real Madrid Club de Fútbol",
    siglas: "RMA",
    pais: "España",
    confederacion: "UEFA",
    estadio: "Santiago Bernabéu",
    director_tecnico: {
      staff_id: "DT_RMA_01",
      nombre: "Carlo Ancelotti",
      nacionalidad: "Italia",
      tactica_preferida: "4-3-3",
      estilo_juego: "Contraataque"
    },
    palmares: [
      { nombre_torneo: "UEFA Champions League", titulos_ganados: 16, ultimo_año_campeon: 2026 },
      { nombre_torneo: "LALIGA", titulos_ganados: 36, ultimo_año_campeon: 2025 }
    ],
    plantilla: {
      porteros: [
        { player_id: "P_RMA_1", nombre_completo: "Thibaut Courtois", categoria_tactica: "portero", posicion_especifica: "GK", valor_mercado_eur: 28000000, media_valoracion: 89 }
      ],
      defensivos: [
        { player_id: "P_RMA_2", nombre_completo: "Antonio Rüdiger", categoria_tactica: "defensivo", posicion_especifica: "CB", valor_mercado_eur: 25000000, media_valoracion: 87 },
        { player_id: "P_RMA_3", nombre_completo: "Ferland Mendy", categoria_tactica: "defensivo", posicion_especifica: "LB", valor_mercado_eur: 22000000, media_valoracion: 84 },
        { player_id: "P_RMA_4", nombre_completo: "Dani Carvajal", categoria_tactica: "defensivo", posicion_especifica: "RB", valor_mercado_eur: 12000000, media_valoracion: 86 }
      ],
      ofensivos: [
        { player_id: "P_RMA_5", nombre_completo: "Kylian Mbappé", categoria_tactica: "ofensivo", posicion_especifica: "ST", valor_mercado_eur: 180000000, media_valoracion: 91 },
        { player_id: "P_RMA_6", nombre_completo: "Vinícius Júnior", categoria_tactica: "ofensivo", posicion_especifica: "LW", valor_mercado_eur: 200000000, media_valoracion: 91 },
        { player_id: "P_RMA_7", nombre_completo: "Jude Bellingham", categoria_tactica: "ofensivo", posicion_especifica: "CM", valor_mercado_eur: 180000000, media_valoracion: 90 }
      ]
    }
  }
};