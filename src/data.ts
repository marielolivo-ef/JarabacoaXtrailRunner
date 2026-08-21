export interface Station {
  id: number;
  title: string;
  description: string;
  fact: string;
  color: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
  };
}

export const stations: Station[] = [
  {
    id: 1,
    title: "Municipio Histórico",
    description: "Jarabacoa está ubicada en la Cordillera Central, en la provincia de La Vega. Su territorio de 676 km² comprende Buena Vista y Manabao. En 2026 cumple 168 años de vida municipal.",
    fact: "1858 = inicio de la vida municipal de Jarabacoa.",
    color: "from-pink-500 to-rose-500",
    quiz: {
      question: "¿En qué año adquirió Jarabacoa la categoría de municipio?",
      options: ["1858", "1905", "1844"],
      correctIndex: 0
    }
  },
  {
    id: 2,
    title: "Tierra de Aguas",
    description: "De origen taíno, su nombre se relaciona con un 'lugar de muchas aguas'. Su identidad acuática vive en los ríos Yaque del Norte, Jimenoa, Baiguate y Guanajuma.",
    fact: "Jarabacoa = montañas + ríos + bosques.",
    color: "from-cyan-400 to-blue-500",
    quiz: {
      question: "¿Qué significa la palabra de origen taíno Jarabacoa?",
      options: ["Montaña alta", "Lugar de muchas aguas", "Tierra fría"],
      correctIndex: 1
    }
  },
  {
    id: 3,
    title: "Puesto Militar y Migraciones",
    description: "A comienzos del siglo XIX llegaron personas tras la destrucción de La Vega en 1805. En 1854 fue establecida como puesto militar por su ubicación estratégica entre el Cibao y el Sur.",
    fact: "Jarabacoa tuvo primero una importante función estratégica y militar.",
    color: "from-yellow-400 to-orange-500",
    quiz: {
      question: "Antes de ser un destino turístico, ¿qué función estratégica tuvo Jarabacoa en 1854?",
      options: ["Capital agrícola", "Puesto militar", "Puerto comercial"],
      correctIndex: 1
    }
  },
  {
    id: 4,
    title: "Madera y Aserraderos",
    description: "Durante la primera mitad del siglo XX desarrolló una fuerte industria maderera vinculada al pino criollo. Llegaron a funcionar aproximadamente 30 aserraderos.",
    fact: "Antes del ecoturismo, fue conocida por su industria maderera.",
    color: "from-lime-400 to-green-600",
    quiz: {
      question: "¿Qué industria impulsó la economía local antes del ecoturismo?",
      options: ["Minería de oro", "Cultivo de cacao", "Industria maderera"],
      correctIndex: 2
    }
  },
  {
    id: 5,
    title: "Turismo de Montaña",
    description: "Desde los 60s, con sus cabañas de veraneo, pasó de la madera al turismo. Hoy es capital del senderismo, rafting, parapente y ecoturismo.",
    fact: "Convirtió sus montañas y ríos en sus principales recursos económicos.",
    color: "from-fuchsia-500 to-purple-600",
    quiz: {
      question: "¿Qué transformó las montañas y ríos de Jarabacoa en su principal motor?",
      options: ["El ecoturismo y deportes", "La pesca industrial", "Las fábricas de tela"],
      correctIndex: 0
    }
  },
  {
    id: 6,
    title: "Puerta al Pico Duarte",
    description: "Es el principal acceso a la montaña más alta de las Antillas. Conecta con el Parque Nacional Armando Bermúdez, la Reserva Ébano Verde y grandes saltos de agua.",
    fact: "Es una puerta natural hacia la Cordillera Central y el Pico Duarte.",
    color: "from-emerald-400 to-teal-500",
    quiz: {
      question: "¿Hacia qué gran reserva natural y pico es Jarabacoa la principal puerta de entrada?",
      options: ["Pico Isabel de Torres", "Pico Duarte", "Sierra de Bahoruco"],
      correctIndex: 1
    }
  },
  {
    id: 7,
    title: "Identidad Cultural Propia",
    description: "No es solo naturaleza. Posee un fuerte patrimonio cultural que incluye su Carnaval en febrero, Fiestas Patronales de la Virgen del Carmen, décimas, salves y elaboración de casabe.",
    fact: "Combina tradición campesina, religiosidad, poesía y gastronomía.",
    color: "from-orange-400 to-red-500",
    quiz: {
      question: "¿Qué manifestación cultural antigua se conserva en la comunidad de Los Higos?",
      options: ["Elaboración de casabe", "Danza de los Diablos", "Feria del mango"],
      correctIndex: 0
    }
  },
  {
    id: 8,
    title: "Festival de las Flores",
    description: "Uno de sus grandes símbolos que reúne a productores, artesanos y visitantes. Representa a la perfección la identidad local donde la flora es protagonista.",
    fact: "Flores + naturaleza + cultura = la imagen de Jarabacoa.",
    color: "from-pink-400 to-fuchsia-500",
    quiz: {
      question: "¿Qué elementos se unen para crear la imagen más reconocible de este festival?",
      options: ["Nieve y pinos", "Flores, naturaleza y cultura", "Ríos y caoba"],
      correctIndex: 1
    }
  },
  {
    id: 9,
    title: "Agricultura y Educación",
    description: "Un territorio agrícola vibrante con producción de café, fresas y vegetales. Alberga también a la Universidad Agroforestal Fernando Arturo de Meriño (UAFAM).",
    fact: "Jarabacoa no vive solo del turismo; posee una gran tradición agrícola.",
    color: "from-green-400 to-emerald-600",
    quiz: {
      question: "Además del turismo, Jarabacoa posee una gran tradición en...",
      options: ["Pesca marítima", "Agricultura y educación", "Industria pesada"],
      correctIndex: 1
    }
  },
  {
    id: 10,
    title: "Deporte y Aventura",
    description: "Ofrece condiciones excepcionales para el deporte al aire libre: rafting, ciclismo, maratón de montaña. La naturaleza es un laboratorio pedagógico y físico enorme.",
    fact: "La montaña es espacio educativo, deportivo y de desarrollo humano.",
    color: "from-blue-400 to-indigo-500",
    quiz: {
      question: "En el contexto del deporte escolar, la montaña se convierte en...",
      options: ["Un obstáculo", "Un laboratorio pedagógico", "Una zona restringida"],
      correctIndex: 1
    }
  }
];
