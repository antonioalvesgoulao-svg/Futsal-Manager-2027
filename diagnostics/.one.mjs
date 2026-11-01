// src/core/types.ts
var SAVE_VERSION = 7;

// src/data/por/clubs.json
var clubs_default = {
  league: {
    id: "por1",
    name: "Liga Placard",
    country: "Portugal",
    season: "2026/27",
    teams: 12
  },
  clubs: [
    {
      id: "scp",
      name: "Sporting CP",
      shortName: "SCP",
      city: "Lisboa",
      arena: "Pavilh\xE3o Jo\xE3o Rocha",
      colors: [
        "#00804a",
        "#ffffff"
      ],
      reputation: 96,
      check: [],
      level: 95,
      wealth: 92
    },
    {
      id: "slb",
      name: "SL Benfica",
      shortName: "SLB",
      city: "Lisboa",
      arena: "Pavilh\xE3o Fidelidade",
      colors: [
        "#e30613",
        "#ffffff"
      ],
      reputation: 93,
      check: [],
      level: 94,
      wealth: 98
    },
    {
      id: "scb",
      name: "SC Braga",
      shortName: "SCB",
      city: "Braga",
      arena: "AMCO Arena",
      colors: [
        "#e30613",
        "#ffffff"
      ],
      reputation: 82,
      check: [],
      level: 82,
      wealth: 75
    },
    {
      id: "fun",
      name: "AD Fund\xE3o",
      shortName: "ADF",
      city: "Fund\xE3o",
      arena: "Pavilh\xE3o Municipal do Fund\xE3o",
      colors: [
        "#582321",
        "#000000"
      ],
      reputation: 72,
      check: [
        "colors"
      ],
      level: 72,
      wealth: 40
    },
    {
      id: "lps",
      name: "Le\xF5es de Porto Salvo",
      shortName: "LPS",
      city: "Porto Salvo",
      arena: "Pavilh\xE3o dos Le\xF5es de Porto Salvo",
      colors: [
        "#1b4937",
        "#ffffff"
      ],
      reputation: 70,
      check: [
        "colors"
      ],
      level: 70,
      wealth: 35
    },
    {
      id: "fzz",
      name: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
      shortName: "FZZ",
      city: "Ferreira do Z\xEAzere",
      arena: "Pavilh\xE3o Municipal de Ferreira do Z\xEAzere",
      colors: [
        "#f2e44f",
        "#000000"
      ],
      reputation: 60,
      check: [
        "arena",
        "colors"
      ],
      level: 60,
      wealth: 30
    },
    {
      id: "ele",
      name: "El\xE9ctrico FC",
      shortName: "EFC",
      city: "Ponte de Sor",
      arena: "Pavilh\xE3o Gimnodesportivo de Ponte de Sor",
      colors: [
        "#0b8a3e",
        "#000000"
      ],
      reputation: 66,
      check: [
        "colors"
      ],
      level: 66,
      wealth: 35
    },
    {
      id: "rav",
      name: "Rio Ave FC",
      shortName: "RAV",
      city: "Vila do Conde",
      arena: "Pavilh\xE3o Municipal de Vila do Conde",
      colors: [
        "#024b3a",
        "#ffffff"
      ],
      reputation: 64,
      check: [
        "arena"
      ],
      level: 64,
      wealth: 55
    },
    {
      id: "uvn",
      name: "UP Venda Nova",
      shortName: "UVN",
      city: "Venda Nova",
      arena: "Pavilh\xE3o da Venda Nova",
      colors: [
        "#facc15",
        "#000000"
      ],
      reputation: 58,
      check: [
        "arena",
        "colors",
        "city"
      ],
      level: 58,
      wealth: 30
    },
    {
      id: "por",
      name: "Portimonense SC",
      shortName: "PSC",
      city: "Portim\xE3o",
      arena: "Pavilh\xE3o Gimnodesportivo de Portim\xE3o",
      colors: [
        "#111111",
        "#ffffff"
      ],
      reputation: 63,
      check: [],
      level: 63,
      wealth: 50
    },
    {
      id: "fam",
      name: "FC Famalic\xE3o",
      shortName: "FCF",
      city: "Vila Nova de Famalic\xE3o",
      arena: "Pavilh\xE3o Multiusos de Famalic\xE3o",
      colors: [
        "#ffffff",
        "#18214e"
      ],
      reputation: 60,
      check: [
        "arena"
      ],
      level: 60,
      wealth: 55
    },
    {
      id: "tor",
      name: "SCU Torreense",
      shortName: "SCU",
      city: "Torres Vedras",
      arena: "Pavilh\xE3o F\xEDsica de Torres Vedras",
      colors: [
        "#881732",
        "#34497e"
      ],
      reputation: 62,
      check: [],
      level: 62,
      wealth: 45
    }
  ],
  _info: "Escalas MUNDIAIS 1-100. reputation: prest\xEDgio no futsal (t\xEDtulos, Europa). level: qualidade atual do plantel (gera atributos). wealth: poder financeiro e dimens\xE3o do clube (contrata\xE7\xF5es, sal\xE1rios, or\xE7amento)."
};

// src/data/por/players.json
var players_default = {
  source: "zerozero.pt, 30/10/2026",
  coaches: {
    scp: "Nuno Dias",
    slb: "Cassiano Klein",
    scb: "Joel Rocha",
    fun: "Nuno Couto",
    lps: "Miguel Velez",
    fzz: "Cristiano Coelho",
    ele: "Jorge Monteiro",
    rav: "Bruno Guimar\xE3es",
    uvn: "Alcides Lopes",
    por: "Jos\xE9 Santos",
    fam: "Cl\xE1udio Martins",
    tor: "Nan\xE1"
  },
  players: [
    {
      id: "scp01",
      clubId: "scp",
      name: "Gon\xE7alo Portugal",
      position: "GR",
      number: 1,
      age: 34,
      nationality: "Portugal"
    },
    {
      id: "scp02",
      clubId: "scp",
      name: "Bernardo Pa\xE7\xF3",
      position: "GR",
      number: 16,
      age: 26,
      nationality: "Portugal"
    },
    {
      id: "scp03",
      clubId: "scp",
      name: "Oleksandr Sukhov",
      position: "GR",
      number: 77,
      age: 29,
      nationality: "Ucr\xE2nia"
    },
    {
      id: "scp04",
      clubId: "scp",
      name: "Tom\xE1s Pa\xE7\xF3",
      position: "FIX",
      number: 4,
      age: 26,
      nationality: "Portugal"
    },
    {
      id: "scp05",
      clubId: "scp",
      name: "Bruno Maior",
      position: "FIX",
      number: 44,
      age: 22,
      nationality: "Portugal"
    },
    {
      id: "scp06",
      clubId: "scp",
      name: "Wesley",
      position: "FIX/ALA",
      number: 8,
      age: 26,
      nationality: "Brasil"
    },
    {
      id: "scp07",
      clubId: "scp",
      name: "Erick Mendon\xE7a",
      position: "UNI",
      number: 17,
      age: 31,
      nationality: "Portugal"
    },
    {
      id: "scp08",
      clubId: "scp",
      name: "Diogo Santos",
      position: "ALA",
      number: 7,
      age: 23,
      nationality: "Portugal"
    },
    {
      id: "scp09",
      clubId: "scp",
      name: "R\xFAben Teixeira",
      position: "ALA",
      number: 10,
      age: 23,
      nationality: "Portugal"
    },
    {
      id: "scp10",
      clubId: "scp",
      name: "Ivan Chishkala",
      position: "ALA",
      number: 11,
      age: 31,
      nationality: "R\xFAssia"
    },
    {
      id: "scp11",
      clubId: "scp",
      name: "Tiaguinho",
      position: "ALA",
      number: 13,
      age: 18,
      nationality: "Portugal"
    },
    {
      id: "scp12",
      clubId: "scp",
      name: "Felipe Val\xE9rio",
      position: "ALA",
      number: 14,
      age: 33,
      nationality: "Brasil"
    },
    {
      id: "scp13",
      clubId: "scp",
      name: "Bruno Pinto",
      position: "ALA",
      number: 25,
      age: 33,
      nationality: "Portugal"
    },
    {
      id: "scp14",
      clubId: "scp",
      name: "Alex Merlim",
      position: "ALA",
      number: 29,
      age: 40,
      nationality: "It\xE1lia"
    },
    {
      id: "scp15",
      clubId: "scp",
      name: "Rafael Ruela",
      position: "PIV",
      number: 2,
      age: 18,
      nationality: "Portugal"
    },
    {
      id: "scp16",
      clubId: "scp",
      name: "Zicky T\xE9",
      position: "PIV",
      number: 6,
      age: 25,
      nationality: "Portugal"
    },
    {
      id: "scp17",
      clubId: "scp",
      name: "Felipe Rufino",
      position: "PIV",
      number: 30,
      age: 20,
      nationality: "Brasil"
    },
    {
      id: "scp18",
      clubId: "scp",
      name: "Rocha",
      position: "PIV",
      number: 70,
      age: 31,
      nationality: "Brasil"
    },
    {
      id: "slb01",
      clubId: "slb",
      name: "Andr\xE9 Correia",
      position: "GR",
      number: 1,
      age: 28,
      nationality: "Portugal"
    },
    {
      id: "slb02",
      clubId: "slb",
      name: "Vasco Pinto",
      position: "GR",
      number: 16,
      age: 17,
      nationality: "Portugal"
    },
    {
      id: "slb03",
      clubId: "slb",
      name: "L\xE9o Gugiel",
      position: "GR",
      number: 22,
      age: 30,
      nationality: "Brasil"
    },
    {
      id: "slb04",
      clubId: "slb",
      name: "Afonso Jesus",
      position: "FIX",
      number: 4,
      age: 28,
      nationality: "Portugal"
    },
    {
      id: "slb05",
      clubId: "slb",
      name: "Ra\xFAl Moreira",
      position: "FIX",
      number: 6,
      age: 23,
      nationality: "Portugal"
    },
    {
      id: "slb06",
      clubId: "slb",
      name: "Andr\xE9 Coelho",
      position: "FIX",
      number: 8,
      age: 33,
      nationality: "Portugal"
    },
    {
      id: "slb07",
      clubId: "slb",
      name: "Silvestre Ferreira",
      position: "FIX/ALA",
      number: 2,
      age: 27,
      nationality: "Portugal"
    },
    {
      id: "slb08",
      clubId: "slb",
      name: "L\xFAcio Rocha",
      position: "ALA",
      number: 7,
      age: 22,
      nationality: "Portugal"
    },
    {
      id: "slb09",
      clubId: "slb",
      name: "Arthur",
      position: "ALA",
      number: 10,
      age: 32,
      nationality: "Brasil"
    },
    {
      id: "slb10",
      clubId: "slb",
      name: "Edmilson Kutchy",
      position: "ALA",
      number: 14,
      age: 24,
      nationality: "Portugal"
    },
    {
      id: "slb11",
      clubId: "slb",
      name: "Carlos Monteiro",
      position: "ALA",
      number: 17,
      age: 24,
      nationality: "Portugal"
    },
    {
      id: "slb12",
      clubId: "slb",
      name: "Pany Varela",
      position: "ALA",
      number: 18,
      age: 37,
      nationality: "Portugal"
    },
    {
      id: "slb13",
      clubId: "slb",
      name: "Anderson Fortes",
      position: "ALA",
      number: 20,
      age: 22,
      nationality: "Angola"
    },
    {
      id: "slb14",
      clubId: "slb",
      name: "Cl\xE9ber Souza",
      position: "ALA",
      number: 77,
      age: 29,
      nationality: "Brasil"
    },
    {
      id: "slb15",
      clubId: "slb",
      name: "Diogo Almeida",
      position: "ALA",
      number: 5,
      age: 19,
      nationality: "Portugal"
    },
    {
      id: "slb16",
      clubId: "slb",
      name: "Eduardo Tchuda",
      position: "PIV",
      number: 11,
      age: 18,
      nationality: "Portugal"
    },
    {
      id: "slb17",
      clubId: "slb",
      name: "R\xFAben G\xF3is",
      position: "PIV",
      number: 19,
      age: 25,
      nationality: "Portugal"
    },
    {
      id: "scb01",
      clubId: "scb",
      name: "Giovanni Danti",
      position: "GR",
      number: 1,
      age: 30,
      nationality: "Brasil"
    },
    {
      id: "scb02",
      clubId: "scb",
      name: "L\xE9o Souza",
      position: "GR",
      number: 2,
      age: 24,
      nationality: "Brasil"
    },
    {
      id: "scb03",
      clubId: "scb",
      name: "Gon\xE7alo Pereira",
      position: "GR",
      number: 22,
      age: 18,
      nationality: "Portugal"
    },
    {
      id: "scb04",
      clubId: "scb",
      name: "Tiago Sousa",
      position: "FIX",
      number: 3,
      age: 29,
      nationality: "Portugal"
    },
    {
      id: "scb05",
      clubId: "scb",
      name: "Ricardo Lopes",
      position: "FIX",
      number: 9,
      age: 25,
      nationality: "Portugal"
    },
    {
      id: "scb06",
      clubId: "scb",
      name: "Peixinho",
      position: "FIX",
      number: 20,
      age: 25,
      nationality: "Portugal"
    },
    {
      id: "scb07",
      clubId: "scb",
      name: "Ricardo Marques",
      position: "FIX/ALA",
      number: 8,
      age: 22,
      nationality: "Portugal"
    },
    {
      id: "scb08",
      clubId: "scb@jun",
      name: "Rika",
      position: "UNI",
      number: 21,
      age: 19,
      nationality: "Portugal"
    },
    {
      id: "scb09",
      clubId: "scb",
      name: "Tiago Brito",
      position: "ALA",
      number: 6,
      age: 35,
      nationality: "Portugal"
    },
    {
      id: "scb10",
      clubId: "scb",
      name: "Tom\xE1s Cola\xE7o",
      position: "ALA",
      number: 7,
      age: 22,
      nationality: "Portugal"
    },
    {
      id: "scb11",
      clubId: "scb",
      name: "Mamad\xFA Tur\xE9",
      position: "ALA",
      number: 10,
      age: 28,
      nationality: "Portugal"
    },
    {
      id: "scb12",
      clubId: "scb",
      name: "Sim\xE3o Nogueira",
      position: "ALA",
      number: 12,
      age: 20,
      nationality: "Portugal"
    },
    {
      id: "scb13",
      clubId: "scb",
      name: "\xC1ngel Claudino",
      position: "ALA",
      number: 17,
      age: 30,
      nationality: "Argentina"
    },
    {
      id: "scb14",
      clubId: "scb",
      name: "Daniel Airoso",
      position: "ALA",
      number: 90,
      age: 27,
      nationality: "Brasil"
    },
    {
      id: "scb15",
      clubId: "scb@jun",
      name: "Andr\xE9 Gomes",
      position: "ALA",
      number: 88,
      age: 18,
      nationality: "Portugal"
    },
    {
      id: "scb16",
      clubId: "scb",
      name: "Willian Carioca",
      position: "PIV",
      number: 14,
      age: 36,
      nationality: "Brasil"
    },
    {
      id: "scb17",
      clubId: "scb",
      name: "Lu\xEDs Fernandes",
      position: "PIV",
      number: 19,
      age: 21,
      nationality: "Portugal"
    },
    {
      id: "scb18",
      clubId: "scb",
      name: "Barreto",
      position: "PIV",
      number: 87,
      age: 22,
      nationality: "Brasil"
    },
    {
      id: "scb19",
      clubId: "scb@jun",
      name: "Bruno Barros",
      position: "PIV",
      number: 11,
      age: 17,
      nationality: "Portugal"
    },
    {
      id: "scb20",
      clubId: "scb@jun",
      name: "Rodrigo Mirancos",
      position: "PIV",
      number: 27,
      age: 18,
      nationality: "Portugal"
    },
    {
      id: "fun01",
      clubId: "fun",
      name: "Gaza",
      position: "GR",
      number: 14,
      age: 34,
      nationality: "Portugal"
    },
    {
      id: "fun02",
      clubId: "fun",
      name: "Martim Borrego",
      position: "GR",
      number: 24,
      age: 19,
      nationality: "Portugal"
    },
    {
      id: "fun03",
      clubId: "fun",
      name: "Jaime Arthur",
      position: "GR",
      number: 30,
      age: 21,
      nationality: "Brasil"
    },
    {
      id: "fun04",
      clubId: "fun",
      name: "Uesler",
      position: "FIX",
      number: 6,
      age: 33,
      nationality: "Brasil"
    },
    {
      id: "fun05",
      clubId: "fun@jun",
      name: "Guina",
      position: "FIX",
      number: 60,
      age: 19,
      nationality: "Portugal"
    },
    {
      id: "fun06",
      clubId: "fun",
      name: "Pel\xE9h",
      position: "FIX/ALA",
      number: 12,
      age: 27,
      nationality: "Brasil"
    },
    {
      id: "fun07",
      clubId: "fun@jun",
      name: "Artur Vicente",
      position: "UNI",
      number: 20,
      age: 16,
      nationality: "Portugal"
    },
    {
      id: "fun08",
      clubId: "fun",
      name: "Nuno Miranda",
      position: "ALA",
      number: 10,
      age: 28,
      nationality: "Portugal"
    },
    {
      id: "fun09",
      clubId: "fun",
      name: "Renato Almeida",
      position: "ALA",
      number: 11,
      age: 20,
      nationality: "Portugal"
    },
    {
      id: "fun10",
      clubId: "fun",
      name: "Louren\xE7o Aguiar",
      position: "ALA",
      number: 13,
      age: 21,
      nationality: "Portugal"
    },
    {
      id: "fun11",
      clubId: "fun",
      name: "M\xE1rio Freitas",
      position: "ALA",
      number: 17,
      age: 36,
      nationality: "Portugal"
    },
    {
      id: "fun12",
      clubId: "fun",
      name: "Nem",
      position: "ALA",
      number: 27,
      age: 31,
      nationality: "Brasil"
    },
    {
      id: "fun13",
      clubId: "fun",
      name: "Eduardo Job",
      position: "PIV",
      number: 9,
      age: 19,
      nationality: "Portugal"
    },
    {
      id: "fun14",
      clubId: "fun",
      name: "Landelino Neto",
      position: "PIV",
      number: 47,
      age: 24,
      nationality: "Brasil"
    },
    {
      id: "fun15",
      clubId: "fun",
      name: "Tiago Tavares",
      position: "PIV",
      number: 77,
      age: 23,
      nationality: "Portugal"
    },
    {
      id: "lps01",
      clubId: "lps",
      name: "Guilherme Cintra",
      position: "GR",
      number: 1,
      age: 21,
      nationality: "Portugal"
    },
    {
      id: "lps02",
      clubId: "lps",
      name: "Daniel Osuji",
      position: "GR",
      number: 21,
      age: 21,
      nationality: "Portugal"
    },
    {
      id: "lps03",
      clubId: "lps",
      name: "Rodrigo Prazeres",
      position: "GR",
      number: 16,
      age: 21,
      nationality: "Portugal"
    },
    {
      id: "lps04",
      clubId: "lps",
      name: "R\xFAben Carrilho",
      position: "FIX",
      number: 6,
      age: 21,
      nationality: "Portugal"
    },
    {
      id: "lps05",
      clubId: "lps",
      name: "Henrique Rodrigues",
      position: "FIX",
      number: 29,
      age: 24,
      nationality: "Portugal"
    },
    {
      id: "lps06",
      clubId: "lps",
      name: "Tiago Pereira",
      position: "FIX",
      number: 53,
      age: 17,
      nationality: "Portugal"
    },
    {
      id: "lps07",
      clubId: "lps",
      name: "Machado",
      position: "FIX",
      number: 70,
      age: 26,
      nationality: "Brasil"
    },
    {
      id: "lps08",
      clubId: "lps",
      name: "Leonildo Injai",
      position: "FIX/ALA",
      number: 4,
      age: 19,
      nationality: "Portugal"
    },
    {
      id: "lps09",
      clubId: "lps",
      name: "Diego Gabriel",
      position: "FIX/ALA",
      number: 27,
      age: 16,
      nationality: "Portugal"
    },
    {
      id: "lps10",
      clubId: "lps",
      name: "Sim\xE3o Fernandes",
      position: "ALA",
      number: 78,
      age: 18,
      nationality: "Portugal"
    },
    {
      id: "lps11",
      clubId: "lps",
      name: "F\xE1bio Paulo",
      position: "ALA",
      number: 23,
      age: 18,
      nationality: "Portugal"
    },
    {
      id: "lps12",
      clubId: "lps",
      name: "Jo\xE3o Mar\xE7al",
      position: "ALA",
      number: 3,
      age: 18,
      nationality: "Portugal"
    },
    {
      id: "lps13",
      clubId: "lps",
      name: "Bruno S\xE1",
      position: "ALA",
      number: 7,
      age: 26,
      nationality: "Portugal"
    },
    {
      id: "lps14",
      clubId: "lps",
      name: "Pedro Marques",
      position: "ALA",
      number: 10,
      age: 21,
      nationality: "Portugal"
    },
    {
      id: "lps15",
      clubId: "lps",
      name: "Natan Minatti",
      position: "ALA",
      number: 11,
      age: 23,
      nationality: "Brasil"
    },
    {
      id: "lps16",
      clubId: "lps",
      name: "R\xE9",
      position: "ALA",
      number: 14,
      age: 41,
      nationality: "Portugal"
    },
    {
      id: "lps17",
      clubId: "lps",
      name: "Francisco Oliveira",
      position: "ALA",
      number: 18,
      age: 25,
      nationality: "Portugal"
    },
    {
      id: "lps18",
      clubId: "lps",
      name: "Bruno Marques",
      position: "ALA",
      number: 8,
      age: 19,
      nationality: "Portugal"
    },
    {
      id: "lps19",
      clubId: "lps",
      name: "Ricardinho",
      position: "ALA",
      number: 30,
      age: 20,
      nationality: "Portugal"
    },
    {
      id: "lps20",
      clubId: "lps",
      name: "Pedro Santos",
      position: "PIV",
      number: 9,
      age: 21,
      nationality: "Portugal"
    },
    {
      id: "lps21",
      clubId: "lps",
      name: "Isa\xEDas Furtado",
      position: "PIV",
      number: 99,
      age: 26,
      nationality: "Cabo Verde"
    },
    {
      id: "lps22",
      clubId: "lps",
      name: "Davy Mendes",
      position: "PIV",
      number: 25,
      age: 19,
      nationality: "Portugal"
    },
    {
      id: "fzz01",
      clubId: "fzz",
      name: "Pedro Martinho",
      position: "GR",
      number: 1,
      age: 25,
      nationality: "Portugal"
    },
    {
      id: "fzz02",
      clubId: "fzz",
      name: "Nilton",
      position: "GR",
      number: 13,
      age: 38,
      nationality: "S\xE3o Tom\xE9 e Pr\xEDncipe"
    },
    {
      id: "fzz03",
      clubId: "fzz",
      name: "F\xE1bio Madeira",
      position: "GR",
      number: 14,
      age: 24,
      nationality: "Portugal"
    },
    {
      id: "fzz04",
      clubId: "fzz",
      name: "Djaelson",
      position: "FIX",
      number: 92,
      age: 34,
      nationality: "Brasil"
    },
    {
      id: "fzz05",
      clubId: "fzz",
      name: "Daniel Sodr\xE9",
      position: "FIX/ALA",
      number: 20,
      age: 24,
      nationality: "Brasil"
    },
    {
      id: "fzz06",
      clubId: "fzz",
      name: "Chapinha",
      position: "FIX/ALA",
      number: 36,
      age: 26,
      nationality: "Brasil"
    },
    {
      id: "fzz07",
      clubId: "fzz",
      name: "Guilherme Canuto",
      position: "UNI",
      number: 90,
      age: 18,
      nationality: "Portugal"
    },
    {
      id: "fzz08",
      clubId: "fzz",
      name: "Afonso Mourinha",
      position: "ALA",
      number: 2,
      age: 19,
      nationality: "Portugal"
    },
    {
      id: "fzz10",
      clubId: "fzz",
      name: "Wendell",
      position: "ALA",
      number: 10,
      age: 31,
      nationality: "Brasil"
    },
    {
      id: "fzz11",
      clubId: "fzz",
      name: "Leonardo Travessa",
      position: "ALA",
      number: 19,
      age: 21,
      nationality: "Portugal"
    },
    {
      id: "fzz12",
      clubId: "fzz",
      name: "David Costa",
      position: "ALA",
      number: 23,
      age: 28,
      nationality: "Portugal"
    },
    {
      id: "fzz13",
      clubId: "fzz",
      name: "Oct\xE1vio Alves",
      position: "ALA",
      number: 31,
      age: 26,
      nationality: "Cabo Verde"
    },
    {
      id: "fzz14",
      clubId: "fzz",
      name: "Sandro Silva",
      position: "ALA",
      number: 88,
      age: 25,
      nationality: "Portugal"
    },
    {
      id: "fzz15",
      clubId: "fzz",
      name: "Rui Fortes",
      position: "PIV",
      number: 7,
      age: 32,
      nationality: "Cabo Verde"
    },
    {
      id: "ele01",
      clubId: "ele",
      name: "Leonardo Atan\xE1sio",
      position: "GR",
      number: 16,
      age: 16,
      nationality: "Portugal"
    },
    {
      id: "ele02",
      clubId: "ele",
      name: "Kiko",
      position: "GR",
      number: 88,
      age: 20,
      nationality: "Portugal"
    },
    {
      id: "ele03",
      clubId: "ele",
      name: "Diogo Bas\xEDlio",
      position: "GR",
      number: 99,
      age: 30,
      nationality: "Portugal"
    },
    {
      id: "ele04",
      clubId: "ele",
      name: "Ferrugem",
      position: "FIX",
      number: 5,
      age: 38,
      nationality: "Brasil"
    },
    {
      id: "ele05",
      clubId: "ele",
      name: "Telmo Sousa",
      position: "FIX",
      number: 33,
      age: 26,
      nationality: "Angola"
    },
    {
      id: "ele06",
      clubId: "ele",
      name: "Mateus Silva",
      position: "FIX/ALA",
      number: 8,
      age: 16,
      nationality: "Portugal"
    },
    {
      id: "ele07",
      clubId: "ele",
      name: "Gon\xE7alo Paix\xE3o",
      position: "FIX/ALA",
      number: 76,
      age: 21,
      nationality: "Portugal"
    },
    {
      id: "ele08",
      clubId: "ele",
      name: "Miguel Malh\xE3o",
      position: "ALA",
      number: 7,
      age: 19,
      nationality: "Portugal"
    },
    {
      id: "ele09",
      clubId: "ele",
      name: "Thales Alves",
      position: "ALA",
      number: 10,
      age: 25,
      nationality: "Brasil"
    },
    {
      id: "ele10",
      clubId: "ele",
      name: "Lucas Mestre",
      position: "ALA",
      number: 15,
      age: 22,
      nationality: "Portugal"
    },
    {
      id: "ele11",
      clubId: "ele",
      name: "Henrique Vicente",
      position: "ALA",
      number: 20,
      age: 28,
      nationality: "Portugal"
    },
    {
      id: "ele12",
      clubId: "ele",
      name: "Mart\xEDn Arriagada",
      position: "ALA",
      number: 21,
      age: 19,
      nationality: "Chile"
    },
    {
      id: "ele13",
      clubId: "ele",
      name: "Gabriel Hoffelder",
      position: "ALA",
      number: 74,
      age: 25,
      nationality: "Brasil"
    },
    {
      id: "ele14",
      clubId: "ele",
      name: "Arthur Saraiva",
      position: "PIV",
      number: 14,
      age: 20,
      nationality: "Portugal"
    },
    {
      id: "ele15",
      clubId: "ele",
      name: "Matheus Marqueti",
      position: "PIV",
      number: 18,
      age: 23,
      nationality: "Brasil"
    },
    {
      id: "rav01",
      clubId: "rav",
      name: "Tom\xE1s Ramos",
      position: "GR",
      number: 1,
      age: 19,
      nationality: "Portugal"
    },
    {
      id: "rav02",
      clubId: "rav",
      name: "Moreira",
      position: "GR",
      number: 12,
      age: 31,
      nationality: "Portugal"
    },
    {
      id: "rav03",
      clubId: "rav",
      name: "Tiago Sacramento",
      position: "GR",
      number: 33,
      age: 37,
      nationality: "Portugal"
    },
    {
      id: "rav04",
      clubId: "rav",
      name: "Dinis Ramos",
      position: "FIX",
      number: 3,
      age: 28,
      nationality: "Portugal"
    },
    {
      id: "rav05",
      clubId: "rav",
      name: "Martim Castela",
      position: "FIX",
      number: 27,
      age: 19,
      nationality: "Portugal"
    },
    {
      id: "rav06",
      clubId: "rav",
      name: "Pedro Rodrigues",
      position: "UNI",
      number: 10,
      age: 30,
      nationality: "Portugal"
    },
    {
      id: "rav07",
      clubId: "rav",
      name: "R\xFAben Freire",
      position: "ALA",
      number: 7,
      age: 28,
      nationality: "Portugal"
    },
    {
      id: "rav08",
      clubId: "rav",
      name: "Gustavo Rodrigues",
      position: "ALA",
      number: 8,
      age: 25,
      nationality: "Portugal"
    },
    {
      id: "rav09",
      clubId: "rav",
      name: "Z\xE9zinho",
      position: "ALA",
      number: 11,
      age: 26,
      nationality: "Portugal"
    },
    {
      id: "rav10",
      clubId: "rav",
      name: "Beb\xE9",
      position: "ALA",
      number: 13,
      age: 28,
      nationality: "Portugal"
    },
    {
      id: "rav11",
      clubId: "rav",
      name: "Miguel \xC2ngelo",
      position: "ALA",
      number: 14,
      age: 32,
      nationality: "Portugal"
    },
    {
      id: "rav12",
      clubId: "rav",
      name: "Cigano",
      position: "ALA",
      number: 15,
      age: 32,
      nationality: "Portugal"
    },
    {
      id: "rav13",
      clubId: "rav",
      name: "Serginho",
      position: "ALA",
      number: 18,
      age: 31,
      nationality: "Portugal"
    },
    {
      id: "rav14",
      clubId: "rav",
      name: "Gon\xE7alo Souto",
      position: "ALA",
      number: 20,
      age: 17,
      nationality: "Portugal"
    },
    {
      id: "rav15",
      clubId: "rav",
      name: "Francisco Silva",
      position: "PIV",
      number: 4,
      age: 22,
      nationality: "Portugal"
    },
    {
      id: "rav16",
      clubId: "rav",
      name: "Mart\xEDn Dorda",
      position: "PIV",
      number: 19,
      age: 28,
      nationality: "Argentina"
    },
    {
      id: "uvn01",
      clubId: "uvn",
      name: "Afonso Silva",
      position: "GR",
      number: 31,
      age: 17,
      nationality: "Portugal"
    },
    {
      id: "uvn02",
      clubId: "uvn",
      name: "Lu\xEDs Correia",
      position: "GR",
      number: 16,
      age: 23,
      nationality: "Portugal"
    },
    {
      id: "uvn03",
      clubId: "uvn",
      name: "Jackson Ryan",
      position: "GR",
      number: 30,
      age: 24,
      nationality: "Brasil"
    },
    {
      id: "uvn04",
      clubId: "uvn",
      name: "Rodrigo Costa",
      position: "GR",
      number: 99,
      age: 22,
      nationality: "Portugal"
    },
    {
      id: "uvn05",
      clubId: "uvn",
      name: "Abel Vaz",
      position: "FIX",
      number: 2,
      age: 21,
      nationality: "Portugal"
    },
    {
      id: "uvn06",
      clubId: "uvn",
      name: "Tom\xE1s Silva",
      position: "FIX",
      number: 21,
      age: 23,
      nationality: "Portugal"
    },
    {
      id: "uvn07",
      clubId: "uvn",
      name: "David Tavares",
      position: "FIX",
      number: 59,
      age: 18,
      nationality: "Portugal"
    },
    {
      id: "uvn08",
      clubId: "uvn",
      name: "Vicente Mourato",
      position: "FIX/ALA",
      number: 6,
      age: 22,
      nationality: "Portugal"
    },
    {
      id: "uvn09",
      clubId: "uvn",
      name: "Rafael Freire",
      position: "FIX/ALA",
      number: 18,
      age: 23,
      nationality: "Portugal"
    },
    {
      id: "uvn10",
      clubId: "uvn",
      name: "Lucas Santos",
      position: "ALA",
      number: 7,
      age: 32,
      nationality: "Brasil"
    },
    {
      id: "uvn11",
      clubId: "uvn",
      name: "Sissi",
      position: "ALA",
      number: 8,
      age: 26,
      nationality: "Cabo Verde"
    },
    {
      id: "uvn12",
      clubId: "uvn",
      name: "Lu\xEDs Nunes",
      position: "ALA",
      number: 10,
      age: 27,
      nationality: "Portugal"
    },
    {
      id: "uvn13",
      clubId: "uvn",
      name: "Dura",
      position: "ALA",
      number: 11,
      age: 39,
      nationality: "Portugal"
    },
    {
      id: "uvn14",
      clubId: "uvn",
      name: "Diogo Silva",
      position: "ALA",
      number: 17,
      age: 22,
      nationality: "Portugal"
    },
    {
      id: "uvn15",
      clubId: "uvn",
      name: "Lucas Veras",
      position: "ALA",
      number: 20,
      age: 26,
      nationality: "Brasil"
    },
    {
      id: "uvn16",
      clubId: "uvn",
      name: "Lu\xEDs Montes",
      position: "ALA",
      number: 80,
      age: 19,
      nationality: "Portugal"
    },
    {
      id: "uvn17",
      clubId: "uvn",
      name: "Rodrigo Lemos",
      position: "ALA",
      number: 3,
      age: 23,
      nationality: "Portugal"
    },
    {
      id: "uvn18",
      clubId: "uvn",
      name: "Gerson Sanches",
      position: "ALA",
      number: 70,
      age: 27,
      nationality: "Cabo Verde"
    },
    {
      id: "uvn19",
      clubId: "uvn",
      name: "Vanilson Nazar\xE9",
      position: "PIV",
      number: 26,
      age: 21,
      nationality: "Portugal"
    },
    {
      id: "uvn20",
      clubId: "uvn",
      name: "Andr\xE9 Galv\xE3o",
      position: "PIV",
      number: 27,
      age: 34,
      nationality: "Portugal"
    },
    {
      id: "por01",
      clubId: "por",
      name: "Andr\xE9 Vieira",
      position: "GR",
      number: 13,
      age: 24,
      nationality: "Portugal"
    },
    {
      id: "por02",
      clubId: "por",
      name: "Juan Pinheiro",
      position: "GR",
      number: 2,
      age: 26,
      nationality: "Brasil"
    },
    {
      id: "por03",
      clubId: "por",
      name: "Nuno Costa",
      position: "GR",
      number: 24,
      age: 26,
      nationality: "Portugal"
    },
    {
      id: "por04",
      clubId: "por",
      name: "Tiago Marques",
      position: "GR",
      number: 31,
      age: 16,
      nationality: "Portugal"
    },
    {
      id: "por05",
      clubId: "por",
      name: "Rui Moreira",
      position: "FIX",
      number: 18,
      age: 25,
      nationality: "Portugal"
    },
    {
      id: "por06",
      clubId: "por",
      name: "Vitinho",
      position: "FIX",
      number: 94,
      age: 32,
      nationality: "Brasil"
    },
    {
      id: "por07",
      clubId: "por",
      name: "Gui",
      position: "UNI",
      number: 51,
      age: 27,
      nationality: "Brasil"
    },
    {
      id: "por08",
      clubId: "por",
      name: "Andr\xE9 Silva",
      position: "UNI",
      number: 88,
      age: 17,
      nationality: "Portugal"
    },
    {
      id: "por09",
      clubId: "por",
      name: "Filipinho",
      position: "ALA",
      number: 8,
      age: 31,
      nationality: "Portugal"
    },
    {
      id: "por10",
      clubId: "por",
      name: "Tom\xE1s Reis",
      position: "ALA",
      number: 10,
      age: 26,
      nationality: "Portugal"
    },
    {
      id: "por11",
      clubId: "por",
      name: "Ada\xEDlton Souza",
      position: "ALA",
      number: 33,
      age: 28,
      nationality: "Brasil"
    },
    {
      id: "por13",
      clubId: "por",
      name: "Jo\xE3o Alves",
      position: "ALA",
      number: 37,
      age: 23,
      nationality: "Portugal"
    },
    {
      id: "por14",
      clubId: "por",
      name: "Santi",
      position: "ALA",
      number: 60,
      age: 18,
      nationality: "Portugal"
    },
    {
      id: "por15",
      clubId: "por",
      name: "Andr\xE9 Rochato",
      position: "PIV",
      number: 9,
      age: 36,
      nationality: "Portugal"
    },
    {
      id: "por16",
      clubId: "por",
      name: "Andriy Dzyalo",
      position: "PIV",
      number: 17,
      age: 20,
      nationality: "Portugal"
    },
    {
      id: "por17",
      clubId: "por",
      name: "Luiggi Baptista",
      position: "PIV",
      number: 29,
      age: 30,
      nationality: "Brasil"
    },
    {
      id: "por18",
      clubId: "por",
      name: "Afonso Serra",
      position: "PIV",
      number: 11,
      age: 21,
      nationality: "Portugal"
    },
    {
      id: "fam01",
      clubId: "fam",
      name: "Pedro Nunes",
      position: "GR",
      number: 1,
      age: 23,
      nationality: "Portugal"
    },
    {
      id: "fam02",
      clubId: "fam",
      name: "Cl\xE1udio Carvalho",
      position: "GR",
      number: 14,
      age: 31,
      nationality: "Portugal"
    },
    {
      id: "fam03",
      clubId: "fam@jun",
      name: "Miguel Ferreira",
      position: "GR",
      number: 16,
      age: 18,
      nationality: "Portugal"
    },
    {
      id: "fam04",
      clubId: "fam",
      name: "Guilherme Rego",
      position: "GR",
      number: 31,
      age: 25,
      nationality: "Brasil"
    },
    {
      id: "fam05",
      clubId: "fam",
      name: "Filipe Costa",
      position: "FIX",
      number: 5,
      age: 19,
      nationality: "Portugal"
    },
    {
      id: "fam06",
      clubId: "fam",
      name: "Buzuzu",
      position: "FIX",
      number: 22,
      age: 30,
      nationality: "Portugal"
    },
    {
      id: "fam07",
      clubId: "fam",
      name: "Diogo Mesquita",
      position: "FIX/ALA",
      number: 6,
      age: 31,
      nationality: "Portugal"
    },
    {
      id: "fam08",
      clubId: "fam@jun",
      name: "Afonso Vieira",
      position: "ALA",
      number: 93,
      age: 19,
      nationality: "Portugal"
    },
    {
      id: "fam09",
      clubId: "fam",
      name: "Daniel Silva",
      position: "ALA",
      number: 7,
      age: 28,
      nationality: "Brasil"
    },
    {
      id: "fam10",
      clubId: "fam",
      name: "Sim\xE3o Cordeiro",
      position: "ALA",
      number: 8,
      age: 20,
      nationality: "Portugal"
    },
    {
      id: "fam11",
      clubId: "fam",
      name: "R\xFAben Santos",
      position: "ALA",
      number: 19,
      age: 27,
      nationality: "Portugal"
    },
    {
      id: "fam12",
      clubId: "fam@jun",
      name: "Mathis Pereira",
      position: "ALA",
      number: 21,
      age: 18,
      nationality: "Portugal"
    },
    {
      id: "fam13",
      clubId: "fam",
      name: "Gui Torres",
      position: "ALA",
      number: 28,
      age: 25,
      nationality: "Portugal"
    },
    {
      id: "fam14",
      clubId: "fam",
      name: "Jefferson",
      position: "ALA",
      number: 77,
      age: 22,
      nationality: "Brasil"
    },
    {
      id: "fam15",
      clubId: "fam",
      name: "Ruizinho",
      position: "ALA/PIV",
      number: 10,
      age: 30,
      nationality: "Portugal"
    },
    {
      id: "fam16",
      clubId: "fam",
      name: "Jo\xE3o Miguel",
      position: "PIV",
      number: 11,
      age: 34,
      nationality: "Portugal"
    },
    {
      id: "fam18",
      clubId: "fam",
      name: "Leandro Ribeiro",
      position: "PIV",
      number: 97,
      age: 20,
      nationality: "Portugal"
    },
    {
      id: "tor01",
      clubId: "tor",
      name: "Tiago Correia",
      position: "GR",
      number: 1,
      age: 21,
      nationality: "Portugal"
    },
    {
      id: "tor02",
      clubId: "tor",
      name: "Eurico Cunha",
      position: "GR",
      number: 13,
      age: 20,
      nationality: "Portugal"
    },
    {
      id: "tor03",
      clubId: "tor",
      name: "Andr\xE9 Santos",
      position: "GR",
      number: 22,
      age: 19,
      nationality: "Portugal"
    },
    {
      id: "tor04",
      clubId: "tor",
      name: "Tiago Reis",
      position: "FIX",
      number: 2,
      age: 21,
      nationality: "Portugal"
    },
    {
      id: "tor05",
      clubId: "tor",
      name: "L\xE9o Evangelista",
      position: "FIX",
      number: 4,
      age: 30,
      nationality: "Brasil"
    },
    {
      id: "tor06",
      clubId: "tor@jun",
      name: "Leonardo Hashimoto",
      position: "FIX",
      number: 28,
      age: 18,
      nationality: "Espanha"
    },
    {
      id: "tor07",
      clubId: "tor",
      name: "Nicolas Tom\xE9",
      position: "FIX",
      number: 88,
      age: 31,
      nationality: "Brasil"
    },
    {
      id: "tor08",
      clubId: "tor",
      name: "Tom\xE1s Silva",
      position: "FIX/ALA",
      number: 6,
      age: 20,
      nationality: "Portugal"
    },
    {
      id: "tor09",
      clubId: "tor",
      name: "Vicente Guia",
      position: "FIX/ALA",
      number: 11,
      age: 19,
      nationality: "Portugal"
    },
    {
      id: "tor10",
      clubId: "tor",
      name: "Jair Pereira",
      position: "UNI",
      number: 7,
      age: 29,
      nationality: "Cabo Verde"
    },
    {
      id: "tor11",
      clubId: "tor",
      name: "Paulo Major",
      position: "ALA",
      number: 10,
      age: 35,
      nationality: "Portugal"
    },
    {
      id: "tor12",
      clubId: "tor",
      name: "Vitinho",
      position: "ALA",
      number: 14,
      age: 25,
      nationality: "Brasil"
    },
    {
      id: "tor13",
      clubId: "tor",
      name: "Felipinho",
      position: "ALA",
      number: 18,
      age: 30,
      nationality: "Brasil"
    },
    {
      id: "tor14",
      clubId: "tor",
      name: "David Gita",
      position: "ALA",
      number: 20,
      age: 20,
      nationality: "Portugal"
    },
    {
      id: "tor15",
      clubId: "tor@jun",
      name: "Gon\xE7alo Lima",
      position: "ALA/PIV",
      number: 9,
      age: 18,
      nationality: "Portugal"
    },
    {
      id: "tor16",
      clubId: "tor",
      name: "Edson Patrick",
      position: "PIV",
      number: 5,
      age: 28,
      nationality: "Cabo Verde"
    },
    {
      id: "tor17",
      clubId: "tor",
      name: "Manuel Monteiro",
      position: "PIV",
      number: 17,
      age: 18,
      nationality: "Portugal"
    },
    {
      id: "tor18",
      clubId: "tor",
      name: "Tintim",
      position: "PIV",
      number: 90,
      age: 24,
      nationality: "Brasil"
    },
    {
      id: "porf18230",
      clubId: "por",
      name: "David Grilo",
      position: "UNI",
      number: 3,
      age: 24,
      nationality: "Portugal"
    },
    {
      id: "porf67377",
      clubId: "por",
      name: "Edgar Senra",
      position: "UNI",
      number: 4,
      age: 29,
      nationality: "Portugal"
    },
    {
      id: "porf25789",
      clubId: "por",
      name: "Gabriel Boas",
      position: "UNI",
      number: 5,
      age: 30,
      nationality: "Brasil"
    },
    {
      id: "porf28645",
      clubId: "por",
      name: "Mateus Morais",
      position: "UNI",
      number: 6,
      age: 19,
      nationality: "Brasil"
    },
    {
      id: "porf27748",
      clubId: "por",
      name: "Miguel Nobre",
      position: "UNI",
      number: 7,
      age: 20,
      nationality: "Portugal"
    },
    {
      id: "porf27663",
      clubId: "por",
      name: "Pedro Bartolomeu",
      position: "GR",
      number: 12,
      age: 19,
      nationality: "Portugal"
    },
    {
      id: "porf67378",
      clubId: "por",
      name: "Samuel Andrade",
      position: "UNI",
      number: 14,
      age: 20,
      nationality: "Portugal"
    },
    {
      id: "porf67379",
      clubId: "por",
      name: "Walter Alves",
      position: "UNI",
      number: 16,
      age: 19,
      nationality: "Portugal"
    },
    {
      id: "slbf44395",
      clubId: "slb",
      name: "Diego Ferreira",
      position: "UNI",
      number: 3,
      age: 15,
      nationality: "Portugal"
    },
    {
      id: "famf51901",
      clubId: "fam",
      name: "Gustavo Santos",
      position: "PIV",
      number: 2,
      age: 22,
      nationality: "Portugal"
    },
    {
      id: "uvnf278869",
      clubId: "uvn",
      name: "Valentin Abrantes",
      position: "UNI",
      number: 4,
      age: 26,
      nationality: "Portugal"
    },
    {
      id: "lpsf18169",
      clubId: "lps",
      name: "Tom\xE1s Guerra",
      position: "GR",
      number: 2,
      age: 18,
      nationality: "Portugal"
    },
    {
      id: "funf17961",
      clubId: "fun",
      name: "Luis Correia",
      position: "UNI",
      number: 2,
      age: 19,
      nationality: "Portugal"
    },
    {
      id: "fzzf44261",
      clubId: "fzz",
      name: "Gon\xE7alo Marmelo",
      position: "UNI",
      number: 3,
      age: 19,
      nationality: "Portugal"
    },
    {
      id: "fzzf48889",
      clubId: "fzz",
      name: "Hugo Coelho",
      position: "UNI",
      number: 4,
      age: 19,
      nationality: "Portugal"
    },
    {
      id: "fzzf2182",
      clubId: "fzz",
      name: "Jo\xE3o Alcobia",
      position: "ALA",
      number: 5,
      age: 34,
      nationality: "Portugal"
    },
    {
      id: "fzzf48784",
      clubId: "fzz",
      name: "Nuno Pinho",
      position: "UNI",
      number: 6,
      age: 19,
      nationality: "Portugal"
    },
    {
      id: "fzzf2282",
      clubId: "fzz",
      name: "Rafael Silva",
      position: "ALA",
      number: 9,
      age: 26,
      nationality: "Portugal"
    },
    {
      id: "fzzf17968",
      clubId: "fzz",
      name: "Ruben Basilio",
      position: "FIX",
      number: 11,
      age: 20,
      nationality: "Portugal"
    },
    {
      id: "scbf27054",
      clubId: "scb",
      name: "Afonso Ferreira",
      position: "UNI",
      number: 4,
      age: 18,
      nationality: "Portugal"
    },
    {
      id: "scbf1683",
      clubId: "scb",
      name: "Hugo Neves",
      position: "PIV",
      number: 5,
      age: 26,
      nationality: "Portugal"
    }
  ]
};

// src/data/por/overrides.json
var overrides_default = {
  _info: "Ajustes manuais por cima do modelo moneyball (history.json). boost entre -3 e +3 (cada ponto sobe cerca de 1 em todos os atributos). Vazio por defeito.",
  boost: {},
  attrs: {}
};

// src/data/por/fpstats.json
var fpstats_default = {
  _info: "Estat\xEDsticas oficiais (futsalportugal.com, dados FPF) dos jogadores, seniores, desde 2021/22: jogos, amarelos, vermelhos; jogos e golos por \xE9poca; t\xEDtulos. Recolha 1/11/2026.",
  players: {
    por11: {
      fpId: 16330,
      games: 71,
      yellow: 20,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Portimonense SC",
          games: 6,
          goals: 3
        },
        {
          s: "25",
          team: "Viseu 2001",
          games: 17,
          goals: 10
        },
        {
          s: "25",
          team: "ADCR Caxinas",
          games: 15,
          goals: 3
        },
        {
          s: "24",
          team: "ADCR Caxinas",
          games: 7,
          goals: 4
        },
        {
          s: "21",
          team: "SCU Torreense",
          games: 26,
          goals: 11
        }
      ],
      titles: []
    },
    por18: {
      fpId: 19349,
      games: 61,
      yellow: 6,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Portimonense SC",
          games: 2,
          goals: 0
        },
        {
          s: "25",
          team: "Portimonense SC",
          games: 30,
          goals: 11
        },
        {
          s: "24",
          team: "Portimonense SC",
          games: 15,
          goals: 9
        },
        {
          s: "24",
          team: "AD Fund\xE3o",
          games: 10,
          goals: 0
        },
        {
          s: "22",
          team: "SL Benfica",
          games: 4,
          goals: 2
        }
      ],
      titles: [
        "Ta\xE7a de Portugal (2022/2023, 2022/2023)",
        "Campeonato Nacional Sub 17 (2021/2022)",
        "Campeonato Europa Sub 19 (2023/2024)",
        "2\xAA Divis\xE3o (2025/2026)"
      ]
    },
    por08: {
      fpId: 49898,
      games: 1,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Portimonense SC",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    por01: {
      fpId: 27083,
      games: 2,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Portimonense SC",
          games: 1,
          goals: 0
        },
        {
          s: "24",
          team: "CDR Pedra Mourinha",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    por16: {
      fpId: 10318,
      games: 96,
      yellow: 8,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Portimonense SC",
          games: 6,
          goals: 1
        },
        {
          s: "25",
          team: "Le\xF5es de Porto Salvo B",
          games: 6,
          goals: 6
        },
        {
          s: "25",
          team: "Le\xF5es de Porto Salvo",
          games: 31,
          goals: 3
        },
        {
          s: "24",
          team: "Sporting CP",
          games: 34,
          goals: 3
        },
        {
          s: "23",
          team: "Sporting CP",
          games: 11,
          goals: 2
        },
        {
          s: "22",
          team: "CCRD Burinhosa",
          games: 8,
          goals: 6
        }
      ],
      titles: [
        "Campeonato Nacional Sub 19 (2023/2024, 2023/2024)",
        "Liga Placard (2023/2024, 2023/2024)",
        "Campeonato Europa Sub 19 (2023/2024)",
        "Ta\xE7a de Portugal (2024/2025)",
        "Ta\xE7a da Liga (2024/2025)"
      ]
    },
    porf18230: {
      fpId: 18230,
      games: 1,
      yellow: 1,
      red: 0,
      seasons: [
        {
          s: "21",
          team: "Portimonense SC",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    porf67377: {
      fpId: 67377,
      games: 0,
      yellow: 0,
      red: 0,
      seasons: [],
      titles: []
    },
    por09: {
      fpId: 597,
      games: 102,
      yellow: 18,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Portimonense SC",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "Portimonense SC",
          games: 28,
          goals: 12
        },
        {
          s: "24",
          team: "Albufeira Futsal",
          games: 24,
          goals: 15
        },
        {
          s: "22",
          team: "Albufeira Futsal",
          games: 28,
          goals: 9
        },
        {
          s: "21",
          team: "Portimonense SC",
          games: 16,
          goals: 7
        }
      ],
      titles: [
        "2\xAA Divis\xE3o (2025/2026)"
      ]
    },
    porf25789: {
      fpId: 25789,
      games: 68,
      yellow: 23,
      red: 3,
      seasons: [
        {
          s: "26",
          team: "Portimonense SC",
          games: 6,
          goals: 2
        },
        {
          s: "25",
          team: "Portimonense SC",
          games: 27,
          goals: 14
        },
        {
          s: "24",
          team: "Portimonense SC",
          games: 25,
          goals: 6
        },
        {
          s: "23",
          team: "Portimonense SC",
          games: 10,
          goals: 2
        }
      ],
      titles: [
        "2\xAA Divis\xE3o (2025/2026)"
      ]
    },
    por07: {
      fpId: 23911,
      games: 73,
      yellow: 15,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Portimonense SC",
          games: 6,
          goals: 3
        },
        {
          s: "25",
          team: "Portimonense SC",
          games: 9,
          goals: 4
        },
        {
          s: "25",
          team: "AD M\xF3dicus",
          games: 12,
          goals: 13
        },
        {
          s: "24",
          team: "AD M\xF3dicus",
          games: 29,
          goals: 9
        },
        {
          s: "23",
          team: "SC Lusit\xE2nia",
          games: 17,
          goals: 21
        }
      ],
      titles: [
        "2\xAA Divis\xE3o (2025/2026)"
      ]
    },
    por13: {
      fpId: 6179,
      games: 90,
      yellow: 35,
      red: 7,
      seasons: [
        {
          s: "25",
          team: "SC Barbarense",
          games: 22,
          goals: 15
        },
        {
          s: "24",
          team: "SC Barbarense",
          games: 23,
          goals: 9
        },
        {
          s: "23",
          team: "Le\xF5es de Porto Salvo",
          games: 1,
          goals: 0
        },
        {
          s: "23",
          team: "Le\xF5es de Porto Salvo B",
          games: 20,
          goals: 7
        },
        {
          s: "22",
          team: "Reguilas de Tires",
          games: 8,
          goals: 0
        },
        {
          s: "22",
          team: "SC Lusit\xE2nia",
          games: 13,
          goals: 0
        },
        {
          s: "21",
          team: "Sporting CP",
          games: 3,
          goals: 0
        }
      ],
      titles: [
        "Liga Placard (2021/2022, 2021/2022)"
      ]
    },
    por02: {
      fpId: 11569,
      games: 145,
      yellow: 15,
      red: 4,
      seasons: [
        {
          s: "26",
          team: "Portimonense SC",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "Portimonense SC",
          games: 28,
          goals: 2
        },
        {
          s: "24",
          team: "Portimonense SC",
          games: 26,
          goals: 2
        },
        {
          s: "23",
          team: "AD Fund\xE3o",
          games: 25,
          goals: 0
        },
        {
          s: "22",
          team: "AD Fund\xE3o",
          games: 27,
          goals: 0
        },
        {
          s: "21",
          team: "ACD Ladoeiro",
          games: 33,
          goals: 0
        }
      ],
      titles: [
        "2\xAA Divis\xE3o (2020/2021, 2025/2026)"
      ]
    },
    por17: {
      fpId: 51900,
      games: 38,
      yellow: 1,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Portimonense SC",
          games: 6,
          goals: 2
        },
        {
          s: "25",
          team: "Araz Nax\xE7ivan",
          games: 8,
          goals: 5
        },
        {
          s: "24",
          team: "Semey FC",
          games: 6,
          goals: 0
        },
        {
          s: "23",
          team: "Halad\xE1s VSE",
          games: 6,
          goals: 1
        },
        {
          s: "22",
          team: "Halad\xE1s VSE",
          games: 3,
          goals: 0
        },
        {
          s: "21",
          team: "Halad\xE1s VSE",
          games: 9,
          goals: 3
        }
      ],
      titles: []
    },
    porf28645: {
      fpId: 28645,
      games: 3,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "25",
          team: "Portimonense SC",
          games: 2,
          goals: 0
        },
        {
          s: "24",
          team: "Portimonense SC",
          games: 1,
          goals: 0
        }
      ],
      titles: [
        "2\xAA Divis\xE3o (2025/2026)"
      ]
    },
    porf27748: {
      fpId: 27748,
      games: 8,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "24",
          team: "Portimonense SC",
          games: 8,
          goals: 0
        }
      ],
      titles: []
    },
    por03: {
      fpId: 9008,
      games: 133,
      yellow: 22,
      red: 6,
      seasons: [
        {
          s: "26",
          team: "Portimonense SC",
          games: 3,
          goals: 0
        },
        {
          s: "25",
          team: "Rio Ave FC",
          games: 24,
          goals: 0
        },
        {
          s: "24",
          team: "Rio Ave FC",
          games: 27,
          goals: 3
        },
        {
          s: "23",
          team: "Rio Ave FC",
          games: 28,
          goals: 1
        },
        {
          s: "22",
          team: "Rio Ave FC",
          games: 24,
          goals: 2
        },
        {
          s: "21",
          team: "GRC D\xEDnamo Sanjoanense",
          games: 14,
          goals: 0
        },
        {
          s: "21",
          team: "AD Fafe",
          games: 13,
          goals: 1
        }
      ],
      titles: []
    },
    porf27663: {
      fpId: 27663,
      games: 31,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "25",
          team: "Portimonense SC",
          games: 19,
          goals: 0
        },
        {
          s: "24",
          team: "Portimonense SC",
          games: 12,
          goals: 0
        }
      ],
      titles: [
        "2\xAA Divis\xE3o (2025/2026)"
      ]
    },
    por15: {
      fpId: 1601,
      games: 100,
      yellow: 36,
      red: 3,
      seasons: [
        {
          s: "26",
          team: "Portimonense SC",
          games: 6,
          goals: 1
        },
        {
          s: "25",
          team: "Portimonense SC",
          games: 24,
          goals: 21
        },
        {
          s: "24",
          team: "Albufeira Futsal",
          games: 24,
          goals: 44
        },
        {
          s: "22",
          team: "Albufeira Futsal",
          games: 22,
          goals: 28
        },
        {
          s: "21",
          team: "Portimonense SC",
          games: 24,
          goals: 8
        }
      ],
      titles: [
        "2\xAA Divis\xE3o (2025/2026)"
      ]
    },
    por05: {
      fpId: 2550,
      games: 104,
      yellow: 14,
      red: 3,
      seasons: [
        {
          s: "26",
          team: "Portimonense SC",
          games: 5,
          goals: 0
        },
        {
          s: "25",
          team: "AD Fund\xE3o",
          games: 17,
          goals: 4
        },
        {
          s: "24",
          team: "AD Fund\xE3o",
          games: 12,
          goals: 1
        },
        {
          s: "23",
          team: "AD Fund\xE3o",
          games: 23,
          goals: 3
        },
        {
          s: "22",
          team: "AD Fund\xE3o",
          games: 22,
          goals: 3
        },
        {
          s: "21",
          team: "AD Fund\xE3o",
          games: 25,
          goals: 2
        }
      ],
      titles: [
        "Campeonato Nacional Sub 17 (2017/2018)",
        "Campeonato Nacional Sub 19 (2018/2019)"
      ]
    },
    porf67378: {
      fpId: 67378,
      games: 0,
      yellow: 0,
      red: 0,
      seasons: [],
      titles: []
    },
    por14: {
      fpId: 24704,
      games: 48,
      yellow: 3,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Portimonense SC",
          games: 5,
          goals: 0
        },
        {
          s: "25",
          team: "Portimonense SC",
          games: 9,
          goals: 0
        },
        {
          s: "24",
          team: "Portimonense SC",
          games: 21,
          goals: 1
        },
        {
          s: "23",
          team: "Portimonense SC",
          games: 13,
          goals: 1
        }
      ],
      titles: [
        "2\xAA Divis\xE3o (2025/2026)"
      ]
    },
    por04: {
      fpId: 20957,
      games: 2,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Portimonense SC",
          games: 2,
          goals: 0
        }
      ],
      titles: []
    },
    por10: {
      fpId: 1682,
      games: 128,
      yellow: 19,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Portimonense SC",
          games: 5,
          goals: 3
        },
        {
          s: "25",
          team: "Portimonense SC",
          games: 30,
          goals: 25
        },
        {
          s: "24",
          team: "Portimonense SC",
          games: 13,
          goals: 5
        },
        {
          s: "23",
          team: "SCU Torreense",
          games: 9,
          goals: 1
        },
        {
          s: "23",
          team: "FC Famalic\xE3o",
          games: 17,
          goals: 7
        },
        {
          s: "22",
          team: "Portimonense SC",
          games: 12,
          goals: 8
        },
        {
          s: "22",
          team: "CRC Quinta dos Lombos",
          games: 10,
          goals: 0
        },
        {
          s: "21",
          team: "CRC Quinta dos Lombos",
          games: 32,
          goals: 4
        }
      ],
      titles: [
        "Campeonato Nacional Sub 17 (2016/2017, 2016/2017)",
        "Campeonato Nacional Sub 19 (2018/2019, 2018/2019)",
        "Ta\xE7a Nacional Sub 17 (2015/2016)",
        "2\xAA Divis\xE3o (2025/2026)"
      ]
    },
    por06: {
      fpId: 4936,
      games: 146,
      yellow: 34,
      red: 5,
      seasons: [
        {
          s: "26",
          team: "Portimonense SC",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "Portimonense SC",
          games: 25,
          goals: 9
        },
        {
          s: "24",
          team: "AD M\xF3dicus",
          games: 24,
          goals: 4
        },
        {
          s: "23",
          team: "AD M\xF3dicus",
          games: 28,
          goals: 19
        },
        {
          s: "22",
          team: "AD M\xF3dicus",
          games: 33,
          goals: 12
        },
        {
          s: "21",
          team: "ACD Ladoeiro",
          games: 30,
          goals: 17
        }
      ],
      titles: [
        "2\xAA Divis\xE3o (2025/2026)"
      ]
    },
    porf67379: {
      fpId: 67379,
      games: 0,
      yellow: 0,
      red: 0,
      seasons: [],
      titles: []
    },
    slb04: {
      fpId: 375,
      games: 156,
      yellow: 30,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "SL Benfica",
          games: 11,
          goals: 3
        },
        {
          s: "25",
          team: "SL Benfica",
          games: 40,
          goals: 12
        },
        {
          s: "24",
          team: "SL Benfica",
          games: 38,
          goals: 17
        },
        {
          s: "23",
          team: "SL Benfica",
          games: 11,
          goals: 9
        },
        {
          s: "22",
          team: "SL Benfica",
          games: 10,
          goals: 1
        },
        {
          s: "21",
          team: "SL Benfica",
          games: 46,
          goals: 11
        }
      ],
      titles: [
        "Liga Placard (2015/2016, 2018/2019, 2024/2025, 2025/2026)",
        "Campeonato Nacional Sub 19 (2015/2016, 2016/2017, 2017/2018, 2017/2018)",
        "Ta\xE7a da Liga (2017/2018, 2017/2018, 2019/2020, 2025/2026)",
        "Campeonato do Mundo (2021/2022)",
        "Campeonato da Europa (2021/2022)",
        "Final\xEDssima (2022/2023)",
        "Ta\xE7a de Portugal (2025/2026)"
      ]
    },
    slb13: {
      fpId: 23533,
      games: 114,
      yellow: 17,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "SL Benfica",
          games: 4,
          goals: 1
        },
        {
          s: "25",
          team: "Le\xF5es de Porto Salvo",
          games: 32,
          goals: 11
        },
        {
          s: "24",
          team: "Le\xF5es de Porto Salvo B",
          games: 5,
          goals: 3
        },
        {
          s: "24",
          team: "Le\xF5es de Porto Salvo",
          games: 33,
          goals: 16
        },
        {
          s: "23",
          team: "Le\xF5es de Porto Salvo B",
          games: 22,
          goals: 23
        },
        {
          s: "23",
          team: "Le\xF5es de Porto Salvo",
          games: 17,
          goals: 6
        },
        {
          s: "22",
          team: "Le\xF5es de Porto Salvo B",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    slb06: {
      fpId: 307,
      games: 225,
      yellow: 67,
      red: 3,
      seasons: [
        {
          s: "26",
          team: "SL Benfica",
          games: 11,
          goals: 4
        },
        {
          s: "25",
          team: "SL Benfica",
          games: 41,
          goals: 13
        },
        {
          s: "24",
          team: "SL Benfica",
          games: 37,
          goals: 12
        },
        {
          s: "23",
          team: "FC Barcelona",
          games: 44,
          goals: 12
        },
        {
          s: "22",
          team: "FC Barcelona",
          games: 48,
          goals: 7
        },
        {
          s: "21",
          team: "FC Barcelona",
          games: 44,
          goals: 13
        }
      ],
      titles: [
        "Ta\xE7a da Liga (2017/2018, 2018/2019, 2019/2020, 2025/2026)",
        "Liga Placard (2018/2019, 2024/2025, 2025/2026)",
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2020/2021, 2021/2022, 2022/2023)",
        "Campeonato da Europa (2017/2018, 2021/2022)",
        "Supercopa Espa\xF1a  (2021/2022, 2022/2023)",
        "UEFA Futsal Champions League (2021/2022)",
        "Campeonato do Mundo (2021/2022)",
        "Final\xEDssima (2022/2023)",
        "Copa de Espa\xF1a (2022/2023)",
        "Ta\xE7a de Portugal (2025/2026)"
      ]
    },
    slb01: {
      fpId: 155,
      games: 165,
      yellow: 18,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "SL Benfica",
          games: 9,
          goals: 0
        },
        {
          s: "25",
          team: "SL Benfica",
          games: 30,
          goals: 1
        },
        {
          s: "24",
          team: "SL Benfica",
          games: 28,
          goals: 0
        },
        {
          s: "23",
          team: "Le\xF5es de Porto Salvo",
          games: 34,
          goals: 2
        },
        {
          s: "22",
          team: "Le\xF5es de Porto Salvo",
          games: 30,
          goals: 2
        },
        {
          s: "21",
          team: "El\xE9ctrico FC",
          games: 34,
          goals: 2
        }
      ],
      titles: [
        "Campeonato Nacional Sub 19 (2016/2017, 2016/2017, 2017/2018, 2017/2018)",
        "Ta\xE7a da Liga (2017/2018, 2017/2018, 2019/2020, 2025/2026)",
        "Ta\xE7a de Portugal (2016/2017, 2016/2017, 2025/2026)",
        "Liga Placard (2018/2019, 2024/2025, 2025/2026)"
      ]
    },
    slb09: {
      fpId: 5164,
      games: 237,
      yellow: 56,
      red: 7,
      seasons: [
        {
          s: "26",
          team: "SL Benfica",
          games: 10,
          goals: 4
        },
        {
          s: "25",
          team: "SL Benfica",
          games: 47,
          goals: 32
        },
        {
          s: "25",
          team: "Brasil",
          games: 6,
          goals: 2
        },
        {
          s: "24",
          team: "SL Benfica",
          games: 36,
          goals: 18
        },
        {
          s: "24",
          team: "Brasil",
          games: 7,
          goals: 2
        },
        {
          s: "23",
          team: "SL Benfica",
          games: 41,
          goals: 35
        },
        {
          s: "22",
          team: "SL Benfica",
          games: 47,
          goals: 23
        },
        {
          s: "21",
          team: "SL Benfica",
          games: 37,
          goals: 16
        },
        {
          s: "21",
          team: "Brasil",
          games: 6,
          goals: 1
        }
      ],
      titles: [
        "Copa de Espa\xF1a (2018/2019, 2019/2020)",
        "Ta\xE7a da Liga (2022/2023, 2025/2026)",
        "Ta\xE7a de Portugal (2022/2023, 2025/2026)",
        "Liga Placard (2024/2025, 2025/2026)",
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2018/2019)",
        "Supercopa Espa\xF1a  (2019/2020)",
        "UEFA Futsal Champions League (2019/2020)",
        "Campeonato do Mundo (2024/2025)",
        "Copa Am\xE9rica (2025/2026)"
      ]
    },
    slb11: {
      fpId: 2607,
      games: 174,
      yellow: 39,
      red: 4,
      seasons: [
        {
          s: "26",
          team: "SL Benfica",
          games: 11,
          goals: 3
        },
        {
          s: "25",
          team: "SL Benfica",
          games: 45,
          goals: 17
        },
        {
          s: "24",
          team: "SL Benfica",
          games: 32,
          goals: 7
        },
        {
          s: "23",
          team: "SL Benfica",
          games: 28,
          goals: 11
        },
        {
          s: "22",
          team: "SL Benfica",
          games: 32,
          goals: 3
        },
        {
          s: "21",
          team: "SL Benfica",
          games: 26,
          goals: 4
        }
      ],
      titles: [
        "Ta\xE7a da Liga (2022/2023, 2025/2026)",
        "Ta\xE7a de Portugal (2022/2023, 2025/2026)",
        "Liga Placard (2024/2025, 2025/2026)",
        "Superta\xE7a (2023/2024)"
      ]
    },
    slb14: {
      fpId: 51906,
      games: 119,
      yellow: 42,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "SL Benfica",
          games: 9,
          goals: 3
        },
        {
          s: "25",
          team: "Brasil",
          games: 5,
          goals: 3
        },
        {
          s: "23",
          team: "Islas Baleares Palma Futsal",
          games: 42,
          goals: 13
        },
        {
          s: "22",
          team: "Islas Baleares Palma Futsal",
          games: 44,
          goals: 23
        },
        {
          s: "21",
          team: "Real Betis Futsal",
          games: 19,
          goals: 10
        }
      ],
      titles: [
        "UEFA Futsal Champions League (2022/2023, 2023/2024)",
        "Copa Am\xE9rica (2025/2026)"
      ]
    },
    slbf44395: {
      fpId: 44395,
      games: 2,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "SL Benfica",
          games: 1,
          goals: 0
        },
        {
          s: "25",
          team: "SL Benfica",
          games: 1,
          goals: 0
        }
      ],
      titles: [
        "Campeonato Nacional Sub 17 (2025/2026, 2025/2026, 2025/2026)",
        "Campeonato Nacional Sub 19 (2025/2026, 2025/2026, 2025/2026)",
        "Liga Placard (2025/2026, 2025/2026, 2025/2026)",
        "Campeonato Nacional Sub 15 (2024/2025, 2024/2025)"
      ]
    },
    slb15: {
      fpId: 17725,
      games: 28,
      yellow: 2,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "SL Benfica B",
          games: 1,
          goals: 0
        },
        {
          s: "26",
          team: "SL Benfica",
          games: 11,
          goals: 0
        },
        {
          s: "25",
          team: "SL Benfica",
          games: 15,
          goals: 1
        },
        {
          s: "24",
          team: "SL Benfica",
          games: 1,
          goals: 0
        }
      ],
      titles: [
        "Liga Placard (2024/2025, 2024/2025, 2025/2026, 2025/2026)",
        "Campeonato Nacional Sub 17 (2022/2023, 2023/2024)",
        "Campeonato Nacional Sub 19 (2025/2026, 2025/2026)",
        "Ta\xE7a de Portugal (2025/2026, 2025/2026)",
        "Campeonato Nacional Sub 15 (2021/2022)"
      ]
    },
    slb10: {
      fpId: 2521,
      games: 172,
      yellow: 29,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "SL Benfica",
          games: 10,
          goals: 4
        },
        {
          s: "25",
          team: "SL Benfica",
          games: 43,
          goals: 21
        },
        {
          s: "24",
          team: "SL Benfica",
          games: 27,
          goals: 10
        },
        {
          s: "23",
          team: "SL Benfica",
          games: 38,
          goals: 10
        },
        {
          s: "22",
          team: "AD Fund\xE3o",
          games: 25,
          goals: 13
        },
        {
          s: "21",
          team: "AD Fund\xE3o",
          games: 29,
          goals: 5
        }
      ],
      titles: [
        "Liga Placard (2024/2025, 2025/2026)",
        "Campeonato Nacional Sub 17 (2018/2019)",
        "Superta\xE7a (2023/2024)",
        "Ta\xE7a da Liga (2025/2026)",
        "Ta\xE7a de Portugal (2025/2026)"
      ]
    },
    slb16: {
      fpId: 22429,
      games: 39,
      yellow: 6,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "SL Benfica B",
          games: 1,
          goals: 0
        },
        {
          s: "26",
          team: "SL Benfica",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "SL Benfica",
          games: 32,
          goals: 4
        }
      ],
      titles: [
        "Campeonato Nacional Sub 17 (2022/2023, 2023/2024, 2023/2024)",
        "Campeonato Nacional Sub 19 (2025/2026, 2025/2026)",
        "Liga Placard (2025/2026, 2025/2026)",
        "Ta\xE7a da Liga (2025/2026, 2025/2026)",
        "Ta\xE7a de Portugal (2025/2026, 2025/2026)",
        "Campeonato Europa Sub 19 (2025/2026)"
      ]
    },
    slb03: {
      fpId: 5411,
      games: 188,
      yellow: 15,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "SL Benfica",
          games: 11,
          goals: 1
        },
        {
          s: "25",
          team: "SL Benfica",
          games: 46,
          goals: 5
        },
        {
          s: "24",
          team: "SL Benfica",
          games: 36,
          goals: 5
        },
        {
          s: "23",
          team: "SL Benfica",
          games: 43,
          goals: 6
        },
        {
          s: "22",
          team: "SL Benfica",
          games: 46,
          goals: 4
        },
        {
          s: "21",
          team: "MFK Tyumen",
          games: 6,
          goals: 0
        }
      ],
      titles: [
        "Ta\xE7a da Liga (2022/2023, 2025/2026)",
        "Ta\xE7a de Portugal (2022/2023, 2025/2026)",
        "Liga Placard (2024/2025, 2025/2026)",
        "Superta\xE7a (2023/2024)"
      ]
    },
    slb08: {
      fpId: 4219,
      games: 211,
      yellow: 31,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "SL Benfica",
          games: 10,
          goals: 4
        },
        {
          s: "25",
          team: "SL Benfica",
          games: 43,
          goals: 15
        },
        {
          s: "24",
          team: "SL Benfica",
          games: 38,
          goals: 12
        },
        {
          s: "23",
          team: "SL Benfica",
          games: 42,
          goals: 14
        },
        {
          s: "22",
          team: "SL Benfica",
          games: 43,
          goals: 6
        },
        {
          s: "21",
          team: "ADCR Caxinas",
          games: 35,
          goals: 24
        }
      ],
      titles: [
        "Campeonato Nacional Sub 19 (2021/2022, 2021/2022)",
        "2\xAA Divis\xE3o (2021/2022, 2021/2022)",
        "Ta\xE7a da Liga (2022/2023, 2025/2026)",
        "Ta\xE7a de Portugal (2022/2023, 2025/2026)",
        "Campeonato Europa Sub 19 (2023/2024, 2023/2024)",
        "Liga Placard (2024/2025, 2025/2026)"
      ]
    },
    slb12: {
      fpId: 19,
      games: 181,
      yellow: 29,
      red: 3,
      seasons: [
        {
          s: "26",
          team: "SL Benfica",
          games: 10,
          goals: 3
        },
        {
          s: "25",
          team: "SL Benfica",
          games: 44,
          goals: 17
        },
        {
          s: "23",
          team: "Sporting CP",
          games: 49,
          goals: 17
        },
        {
          s: "22",
          team: "Sporting CP",
          games: 44,
          goals: 19
        },
        {
          s: "21",
          team: "Sporting CP",
          games: 34,
          goals: 17
        }
      ],
      titles: [
        "Liga Placard (2008/2009, 2011/2012, 2016/2017, 2017/2018, 2020/2021, 2021/2022, 2022/2023, 2023/2024, 2025/2026)",
        "Ta\xE7a de Portugal (2008/2009, 2013/2014, 2017/2018, 2018/2019, 2019/2020, 2021/2022, 2025/2026)",
        "Superta\xE7a (2009/2010, 2011/2012, 2017/2018, 2018/2019, 2019/2020, 2021/2022, 2022/2023)",
        "Ta\xE7a da Liga (2016/2017, 2020/2021, 2021/2022, 2023/2024, 2025/2026)",
        "UEFA Futsal Champions League (2009/2010, 2018/2019, 2020/2021)",
        "Campeonato da Europa (2017/2018, 2021/2022)",
        "Campeonato do Mundo (2021/2022)",
        "Final\xEDssima (2022/2023)"
      ]
    },
    slb05: {
      fpId: 2617,
      games: 160,
      yellow: 39,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "SL Benfica",
          games: 9,
          goals: 2
        },
        {
          s: "25",
          team: "SL Benfica",
          games: 36,
          goals: 6
        },
        {
          s: "24",
          team: "SL Benfica",
          games: 27,
          goals: 5
        },
        {
          s: "23",
          team: "ADCR Caxinas",
          games: 28,
          goals: 11
        },
        {
          s: "22",
          team: "ADCR Caxinas",
          games: 26,
          goals: 13
        },
        {
          s: "21",
          team: "ADCR Caxinas",
          games: 34,
          goals: 7
        }
      ],
      titles: [
        "Campeonato Nacional Sub 19 (2021/2022, 2021/2022)",
        "2\xAA Divis\xE3o (2021/2022, 2021/2022)",
        "Liga Placard (2024/2025, 2025/2026)",
        "Ta\xE7a da Liga (2025/2026)",
        "Ta\xE7a de Portugal (2025/2026)"
      ]
    },
    slb17: {
      fpId: 2608,
      games: 97,
      yellow: 36,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "SL Benfica",
          games: 10,
          goals: 2
        },
        {
          s: "25",
          team: "Rio Ave FC",
          games: 24,
          goals: 23
        },
        {
          s: "24",
          team: "Rio Ave FC",
          games: 17,
          goals: 25
        },
        {
          s: "24",
          team: "Le\xF5es de Porto Salvo B",
          games: 1,
          goals: 1
        },
        {
          s: "24",
          team: "Le\xF5es de Porto Salvo",
          games: 7,
          goals: 3
        },
        {
          s: "23",
          team: "Le\xF5es de Porto Salvo B",
          games: 5,
          goals: 6
        },
        {
          s: "23",
          team: "Le\xF5es de Porto Salvo",
          games: 27,
          goals: 7
        },
        {
          s: "21",
          team: "ADCR Caxinas",
          games: 6,
          goals: 2
        }
      ],
      titles: [
        "2\xAA Divis\xE3o (2021/2022)"
      ]
    },
    slb07: {
      fpId: 1670,
      games: 173,
      yellow: 38,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "SL Benfica",
          games: 9,
          goals: 5
        },
        {
          s: "25",
          team: "SL Benfica",
          games: 45,
          goals: 14
        },
        {
          s: "24",
          team: "SL Benfica",
          games: 26,
          goals: 8
        },
        {
          s: "23",
          team: "SL Benfica",
          games: 26,
          goals: 10
        },
        {
          s: "22",
          team: "SL Benfica",
          games: 26,
          goals: 6
        },
        {
          s: "21",
          team: "SL Benfica",
          games: 41,
          goals: 11
        }
      ],
      titles: [
        "Liga Placard (2018/2019, 2018/2019, 2024/2025, 2025/2026)",
        "Campeonato Nacional Sub 19 (2016/2017, 2017/2018)",
        "Ta\xE7a de Portugal (2022/2023, 2025/2026)",
        "Final\xEDssima (2022/2023)",
        "Ta\xE7a da Liga (2025/2026)"
      ]
    },
    slb02: {
      fpId: 26833,
      games: 12,
      yellow: 1,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "SL Benfica B",
          games: 5,
          goals: 1
        },
        {
          s: "26",
          team: "SL Benfica",
          games: 2,
          goals: 0
        },
        {
          s: "25",
          team: "SL Benfica",
          games: 5,
          goals: 0
        }
      ],
      titles: [
        "Campeonato Nacional Sub 19 (2025/2026, 2025/2026)",
        "Liga Placard (2025/2026, 2025/2026)"
      ]
    },
    rav10: {
      fpId: 1156,
      games: 153,
      yellow: 23,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Rio Ave FC",
          games: 4,
          goals: 2
        },
        {
          s: "25",
          team: "SC Braga",
          games: 25,
          goals: 7
        },
        {
          s: "24",
          team: "SC Braga",
          games: 34,
          goals: 13
        },
        {
          s: "23",
          team: "SC Braga",
          games: 31,
          goals: 2
        },
        {
          s: "22",
          team: "AD Fund\xE3o",
          games: 26,
          goals: 10
        },
        {
          s: "21",
          team: "AD Fund\xE3o",
          games: 33,
          goals: 11
        }
      ],
      titles: [
        "Ta\xE7a de Portugal (2023/2024)",
        "Superta\xE7a (2024/2025)"
      ]
    },
    rav04: {
      fpId: 133,
      games: 129,
      yellow: 42,
      red: 4,
      seasons: [
        {
          s: "26",
          team: "Rio Ave FC",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "Rio Ave FC",
          games: 25,
          goals: 8
        },
        {
          s: "24",
          team: "Rio Ave FC",
          games: 25,
          goals: 5
        },
        {
          s: "23",
          team: "FC Famalic\xE3o",
          games: 24,
          goals: 5
        },
        {
          s: "22",
          team: "FC Pa\xE7os de Ferreira Dreamcouch Futsal",
          games: 29,
          goals: 5
        },
        {
          s: "21",
          team: "FC Pa\xE7os de Ferreira Dreamcouch Futsal",
          games: 9,
          goals: 2
        },
        {
          s: "21",
          team: "AD Fafe",
          games: 11,
          goals: 6
        }
      ],
      titles: []
    },
    rav15: {
      fpId: 17383,
      games: 112,
      yellow: 25,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Rio Ave FC",
          games: 6,
          goals: 1
        },
        {
          s: "25",
          team: "Boavista FC",
          games: 5,
          goals: 0
        },
        {
          s: "25",
          team: "Rio Ave FC",
          games: 20,
          goals: 5
        },
        {
          s: "24",
          team: "Boavista FC",
          games: 23,
          goals: 16
        },
        {
          s: "23",
          team: "Boavista FC",
          games: 25,
          goals: 14
        },
        {
          s: "22",
          team: "Boavista FC",
          games: 21,
          goals: 9
        },
        {
          s: "21",
          team: "Boavista FC",
          games: 12,
          goals: 1
        }
      ],
      titles: []
    },
    rav14: {
      fpId: 52811,
      games: 1,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Rio Ave FC",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    rav08: {
      fpId: 2367,
      games: 141,
      yellow: 29,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Rio Ave FC",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "Rio Ave FC",
          games: 24,
          goals: 2
        },
        {
          s: "24",
          team: "GRC D\xEDnamo Sanjoanense",
          games: 12,
          goals: 4
        },
        {
          s: "24",
          team: "SCU Torreense",
          games: 10,
          goals: 1
        },
        {
          s: "23",
          team: "El\xE9ctrico FC",
          games: 26,
          goals: 2
        },
        {
          s: "22",
          team: "ADCR Caxinas",
          games: 27,
          goals: 4
        },
        {
          s: "21",
          team: "El\xE9ctrico FC",
          games: 36,
          goals: 4
        }
      ],
      titles: [
        "Campeonato Nacional Sub 19 (2018/2019, 2018/2019)"
      ]
    },
    rav12: {
      fpId: 140,
      games: 125,
      yellow: 19,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Rio Ave FC",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "Rio Ave FC",
          games: 23,
          goals: 4
        },
        {
          s: "24",
          team: "GRC D\xEDnamo Sanjoanense",
          games: 25,
          goals: 1
        },
        {
          s: "23",
          team: "GRC D\xEDnamo Sanjoanense",
          games: 29,
          goals: 8
        },
        {
          s: "22",
          team: "CR Candoso",
          games: 12,
          goals: 1
        },
        {
          s: "21",
          team: "CR Candoso",
          games: 30,
          goals: 0
        }
      ],
      titles: [
        "2\xAA Divis\xE3o (2023/2024)"
      ]
    },
    rav09: {
      fpId: 2238,
      games: 147,
      yellow: 33,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Rio Ave FC",
          games: 1,
          goals: 0
        },
        {
          s: "25",
          team: "Rio Ave FC",
          games: 27,
          goals: 3
        },
        {
          s: "24",
          team: "Rio Ave FC",
          games: 27,
          goals: 13
        },
        {
          s: "23",
          team: "Rio Ave FC",
          games: 28,
          goals: 17
        },
        {
          s: "22",
          team: "ADCR Caxinas",
          games: 28,
          goals: 7
        },
        {
          s: "21",
          team: "ADCR Caxinas",
          games: 36,
          goals: 7
        }
      ],
      titles: [
        "2\xAA Divis\xE3o (2021/2022)"
      ]
    },
    rav05: {
      fpId: 17791,
      games: 31,
      yellow: 9,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Rio Ave FC",
          games: 6,
          goals: 2
        },
        {
          s: "25",
          team: "ADCR Caxinas",
          games: 20,
          goals: 3
        },
        {
          s: "24",
          team: "ADCR Caxinas",
          games: 5,
          goals: 0
        }
      ],
      titles: [
        "Campeonato Europa Sub 19 (2025/2026)"
      ]
    },
    rav16: {
      fpId: 26718,
      games: 42,
      yellow: 10,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Rio Ave FC",
          games: 6,
          goals: 4
        },
        {
          s: "25",
          team: "ADCR Caxinas",
          games: 14,
          goals: 10
        },
        {
          s: "24",
          team: "ADCR Caxinas",
          games: 22,
          goals: 11
        }
      ],
      titles: []
    },
    rav11: {
      fpId: 168,
      games: 72,
      yellow: 15,
      red: 3,
      seasons: [
        {
          s: "26",
          team: "Rio Ave FC",
          games: 5,
          goals: 4
        },
        {
          s: "22",
          team: "Sporting CP",
          games: 28,
          goals: 7
        },
        {
          s: "21",
          team: "Sporting CP",
          games: 39,
          goals: 8
        }
      ],
      titles: [
        "Liga Placard (2012/2013, 2012/2013, 2013/2014, 2015/2016, 2018/2019, 2021/2022, 2022/2023)",
        "Ta\xE7a da Liga (2015/2016, 2017/2018, 2019/2020, 2021/2022)",
        "Superta\xE7a (2013/2014, 2014/2015, 2021/2022)",
        "Ta\xE7a de Portugal (2015/2016, 2016/2017, 2021/2022)",
        "Campeonato do Mundo (2021/2022)",
        "Campeonato da Europa (2021/2022)"
      ]
    },
    rav02: {
      fpId: 131,
      games: 126,
      yellow: 37,
      red: 6,
      seasons: [
        {
          s: "26",
          team: "Rio Ave FC",
          games: 5,
          goals: 0
        },
        {
          s: "25",
          team: "Rio Ave FC",
          games: 25,
          goals: 1
        },
        {
          s: "24",
          team: "CS Mar\xEDtimo",
          games: 22,
          goals: 1
        },
        {
          s: "23",
          team: "CS Mar\xEDtimo",
          games: 16,
          goals: 1
        },
        {
          s: "22",
          team: "CS Mar\xEDtimo",
          games: 25,
          goals: 2
        },
        {
          s: "21",
          team: "CS Mar\xEDtimo",
          games: 33,
          goals: 7
        }
      ],
      titles: []
    },
    rav06: {
      fpId: 7109,
      games: 121,
      yellow: 31,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Rio Ave FC",
          games: 5,
          goals: 1
        },
        {
          s: "25",
          team: "Rio Ave FC",
          games: 25,
          goals: 5
        },
        {
          s: "24",
          team: "Rio Ave FC",
          games: 24,
          goals: 5
        },
        {
          s: "23",
          team: "Rio Ave FC",
          games: 30,
          goals: 22
        },
        {
          s: "22",
          team: "Rio Ave FC",
          games: 23,
          goals: 11
        },
        {
          s: "21",
          team: "CA Sangemil",
          games: 14,
          goals: 8
        }
      ],
      titles: []
    },
    rav07: {
      fpId: 557,
      games: 141,
      yellow: 33,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Rio Ave FC",
          games: 6,
          goals: 3
        },
        {
          s: "25",
          team: "Sporting CP",
          games: 13,
          goals: 2
        },
        {
          s: "24",
          team: "Sporting CP",
          games: 38,
          goals: 7
        },
        {
          s: "24",
          team: "El\xE9ctrico FC",
          games: 4,
          goals: 1
        },
        {
          s: "23",
          team: "El\xE9ctrico FC",
          games: 23,
          goals: 7
        },
        {
          s: "22",
          team: "El\xE9ctrico FC",
          games: 27,
          goals: 12
        },
        {
          s: "21",
          team: "Futsal Cube Azem\xE9is",
          games: 30,
          goals: 7
        }
      ],
      titles: [
        "Ta\xE7a de Portugal (2024/2025)",
        "Ta\xE7a da Liga (2024/2025)",
        "Superta\xE7a (2025/2026)",
        "UEFA Futsal Champions League (2025/2026)"
      ]
    },
    rav13: {
      fpId: 11606,
      games: 139,
      yellow: 25,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Rio Ave FC",
          games: 6,
          goals: 2
        },
        {
          s: "25",
          team: "Rio Ave FC",
          games: 27,
          goals: 17
        },
        {
          s: "24",
          team: "GRC D\xEDnamo Sanjoanense",
          games: 20,
          goals: 16
        },
        {
          s: "23",
          team: "GRC D\xEDnamo Sanjoanense",
          games: 28,
          goals: 30
        },
        {
          s: "22",
          team: "GRC D\xEDnamo Sanjoanense",
          games: 32,
          goals: 25
        },
        {
          s: "21",
          team: "SC Braga",
          games: 26,
          goals: 6
        }
      ],
      titles: [
        "2\xAA Divis\xE3o (2023/2024)"
      ]
    },
    rav03: {
      fpId: 1148,
      games: 149,
      yellow: 17,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Rio Ave FC",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "ADCR Caxinas",
          games: 25,
          goals: 0
        },
        {
          s: "24",
          team: "ADCR Caxinas",
          games: 26,
          goals: 0
        },
        {
          s: "23",
          team: "ADCR Caxinas",
          games: 29,
          goals: 1
        },
        {
          s: "22",
          team: "ADCR Caxinas",
          games: 27,
          goals: 0
        },
        {
          s: "21",
          team: "ADCR Caxinas",
          games: 36,
          goals: 1
        }
      ],
      titles: [
        "2\xAA Divis\xE3o (2021/2022)"
      ]
    },
    rav01: {
      fpId: 29016,
      games: 15,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Rio Ave FC",
          games: 5,
          goals: 0
        },
        {
          s: "25",
          team: "Rio Ave FC",
          games: 9,
          goals: 0
        },
        {
          s: "24",
          team: "Rio Ave FC",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    ele14: {
      fpId: 17939,
      games: 32,
      yellow: 3,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "El\xE9ctrico FC",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "UP Venda Nova",
          games: 25,
          goals: 7
        },
        {
          s: "23",
          team: "AMSAC",
          games: 1,
          goals: 0
        }
      ],
      titles: [
        "Campeonato Nacional Sub 19 (2023/2024, 2024/2025)"
      ]
    },
    ele03: {
      fpId: 105,
      games: 150,
      yellow: 7,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "El\xE9ctrico FC",
          games: 6,
          goals: 1
        },
        {
          s: "25",
          team: "El\xE9ctrico FC",
          games: 28,
          goals: 0
        },
        {
          s: "24",
          team: "El\xE9ctrico FC",
          games: 27,
          goals: 0
        },
        {
          s: "23",
          team: "El\xE9ctrico FC",
          games: 25,
          goals: 1
        },
        {
          s: "22",
          team: "El\xE9ctrico FC",
          games: 28,
          goals: 0
        },
        {
          s: "21",
          team: "El\xE9ctrico FC",
          games: 36,
          goals: 0
        }
      ],
      titles: []
    },
    ele04: {
      fpId: 1764,
      games: 129,
      yellow: 24,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "El\xE9ctrico FC",
          games: 6,
          goals: 1
        },
        {
          s: "25",
          team: "Riga FC",
          games: 5,
          goals: 1
        },
        {
          s: "24",
          team: "El\xE9ctrico FC",
          games: 25,
          goals: 4
        },
        {
          s: "23",
          team: "El\xE9ctrico FC",
          games: 25,
          goals: 4
        },
        {
          s: "22",
          team: "El\xE9ctrico FC",
          games: 28,
          goals: 4
        },
        {
          s: "21",
          team: "El\xE9ctrico FC",
          games: 33,
          goals: 8
        },
        {
          s: "21",
          team: "Tubar\xE3o",
          games: 7,
          goals: 1
        }
      ],
      titles: []
    },
    ele02: {
      fpId: 12901,
      games: 38,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "El\xE9ctrico FC",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "AD Fund\xE3o",
          games: 25,
          goals: 0
        },
        {
          s: "24",
          team: "Sporting CP",
          games: 2,
          goals: 0
        },
        {
          s: "23",
          team: "Sporting CP",
          games: 5,
          goals: 0
        }
      ],
      titles: [
        "Campeonato Nacional Sub 19 (2022/2023, 2022/2023, 2023/2024, 2023/2024, 2024/2025, 2024/2025)",
        "Liga Placard (2023/2024, 2023/2024)"
      ]
    },
    ele13: {
      fpId: 51942,
      games: 5,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "El\xE9ctrico FC",
          games: 5,
          goals: 0
        }
      ],
      titles: []
    },
    ele07: {
      fpId: 6222,
      games: 77,
      yellow: 17,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "El\xE9ctrico FC",
          games: 6,
          goals: 2
        },
        {
          s: "25",
          team: "El\xE9ctrico FC",
          games: 13,
          goals: 2
        },
        {
          s: "25",
          team: "SC Braga",
          games: 8,
          goals: 0
        },
        {
          s: "24",
          team: "CRC Quinta dos Lombos",
          games: 25,
          goals: 7
        },
        {
          s: "23",
          team: "SC Lusit\xE2nia",
          games: 25,
          goals: 11
        }
      ],
      titles: [
        "Ta\xE7a Nacional Sub 15 (2017/2018)"
      ]
    },
    ele11: {
      fpId: 1641,
      games: 141,
      yellow: 36,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "El\xE9ctrico FC",
          games: 6,
          goals: 3
        },
        {
          s: "25",
          team: "El\xE9ctrico FC",
          games: 28,
          goals: 11
        },
        {
          s: "24",
          team: "El\xE9ctrico FC",
          games: 24,
          goals: 10
        },
        {
          s: "23",
          team: "CRC Quinta dos Lombos",
          games: 24,
          goals: 8
        },
        {
          s: "22",
          team: "CRC Quinta dos Lombos",
          games: 28,
          goals: 15
        },
        {
          s: "21",
          team: "CRC Quinta dos Lombos",
          games: 31,
          goals: 15
        }
      ],
      titles: []
    },
    ele01: {
      fpId: 44396,
      games: 9,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "El\xE9ctrico FC",
          games: 5,
          goals: 0
        },
        {
          s: "25",
          team: "El\xE9ctrico FC",
          games: 4,
          goals: 0
        }
      ],
      titles: []
    },
    ele10: {
      fpId: 21490,
      games: 88,
      yellow: 16,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "El\xE9ctrico FC",
          games: 6,
          goals: 3
        },
        {
          s: "25",
          team: "El\xE9ctrico FC",
          games: 29,
          goals: 3
        },
        {
          s: "24",
          team: "Portimonense SC",
          games: 24,
          goals: 8
        },
        {
          s: "23",
          team: "Portimonense SC",
          games: 29,
          goals: 22
        }
      ],
      titles: []
    },
    ele12: {
      fpId: 51940,
      games: 8,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "El\xE9ctrico FC",
          games: 3,
          goals: 0
        },
        {
          s: "25",
          team: "Chile",
          games: 5,
          goals: 0
        }
      ],
      titles: []
    },
    ele06: {
      fpId: 52812,
      games: 3,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "El\xE9ctrico FC",
          games: 3,
          goals: 0
        }
      ],
      titles: []
    },
    ele15: {
      fpId: 51941,
      games: 5,
      yellow: 1,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "El\xE9ctrico FC",
          games: 5,
          goals: 0
        }
      ],
      titles: []
    },
    ele08: {
      fpId: 44288,
      games: 9,
      yellow: 1,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "El\xE9ctrico FC",
          games: 5,
          goals: 0
        },
        {
          s: "25",
          team: "Sporting CP",
          games: 4,
          goals: 0
        }
      ],
      titles: [
        "Campeonato Nacional Sub 19 (2022/2023, 2022/2023, 2023/2024, 2023/2024, 2024/2025)",
        "Campeonato Europa Sub 19 (2025/2026)"
      ]
    },
    ele05: {
      fpId: 2358,
      games: 145,
      yellow: 36,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "El\xE9ctrico FC",
          games: 6,
          goals: 3
        },
        {
          s: "25",
          team: "El\xE9ctrico FC",
          games: 28,
          goals: 7
        },
        {
          s: "24",
          team: "El\xE9ctrico FC",
          games: 27,
          goals: 10
        },
        {
          s: "23",
          team: "CRC Quinta dos Lombos",
          games: 22,
          goals: 5
        },
        {
          s: "22",
          team: "CRC Quinta dos Lombos",
          games: 29,
          goals: 9
        },
        {
          s: "21",
          team: "AMSAC",
          games: 33,
          goals: 17
        }
      ],
      titles: [
        "Campeonato Nacional Sub 19 (2017/2018, 2017/2018)"
      ]
    },
    ele09: {
      fpId: 23912,
      games: 71,
      yellow: 29,
      red: 5,
      seasons: [
        {
          s: "26",
          team: "El\xE9ctrico FC",
          games: 6,
          goals: 3
        },
        {
          s: "25",
          team: "CRC Quinta dos Lombos",
          games: 19,
          goals: 7
        },
        {
          s: "24",
          team: "ADCR Caxinas",
          games: 23,
          goals: 5
        },
        {
          s: "23",
          team: "SC Lusit\xE2nia",
          games: 23,
          goals: 15
        }
      ],
      titles: []
    },
    fam06: {
      fpId: 421,
      games: 139,
      yellow: 38,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "FC Famalic\xE3o",
          games: 6,
          goals: 1
        },
        {
          s: "25",
          team: "FC Famalic\xE3o",
          games: 25,
          goals: 5
        },
        {
          s: "24",
          team: "SC Braga",
          games: 24,
          goals: 1
        },
        {
          s: "23",
          team: "SC Braga",
          games: 9,
          goals: 0
        },
        {
          s: "23",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 16,
          goals: 3
        },
        {
          s: "22",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 25,
          goals: 4
        },
        {
          s: "21",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 34,
          goals: 10
        }
      ],
      titles: [
        "Ta\xE7a de Portugal (2023/2024)",
        "Superta\xE7a (2024/2025)"
      ]
    },
    fam02: {
      fpId: 431,
      games: 111,
      yellow: 6,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "FC Famalic\xE3o",
          games: 4,
          goals: 0
        },
        {
          s: "25",
          team: "FC Famalic\xE3o",
          games: 15,
          goals: 0
        },
        {
          s: "24",
          team: "FC Famalic\xE3o",
          games: 19,
          goals: 0
        },
        {
          s: "23",
          team: "FC Famalic\xE3o",
          games: 26,
          goals: 0
        },
        {
          s: "22",
          team: "FC Famalic\xE3o",
          games: 25,
          goals: 0
        },
        {
          s: "21",
          team: "FC Famalic\xE3o",
          games: 22,
          goals: 0
        }
      ],
      titles: [
        "2\xAA Divis\xE3o (2016/2017, 2018/2019, 2024/2025)"
      ]
    },
    fam09: {
      fpId: 1136,
      games: 124,
      yellow: 31,
      red: 3,
      seasons: [
        {
          s: "26",
          team: "FC Famalic\xE3o",
          games: 6,
          goals: 2
        },
        {
          s: "25",
          team: "ACD Ladoeiro",
          games: 25,
          goals: 19
        },
        {
          s: "24",
          team: "FC Famalic\xE3o",
          games: 28,
          goals: 16
        },
        {
          s: "23",
          team: "AD Fund\xE3o",
          games: 22,
          goals: 2
        },
        {
          s: "22",
          team: "SC Lusit\xE2nia",
          games: 22,
          goals: 7
        },
        {
          s: "21",
          team: "SC Lusit\xE2nia",
          games: 21,
          goals: 6
        }
      ],
      titles: [
        "2\xAA Divis\xE3o (2020/2021, 2024/2025)"
      ]
    },
    fam07: {
      fpId: 23463,
      games: 81,
      yellow: 14,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "FC Famalic\xE3o",
          games: 3,
          goals: 1
        },
        {
          s: "25",
          team: "CS S\xE3o Jo\xE3o",
          games: 12,
          goals: 3
        },
        {
          s: "25",
          team: "Boavista FC",
          games: 12,
          goals: 2
        },
        {
          s: "24",
          team: "S\xE3o Martinho de Mouros",
          games: 12,
          goals: 1
        },
        {
          s: "24",
          team: "Boavista FC",
          games: 8,
          goals: 0
        },
        {
          s: "23",
          team: "Arsenal da Maia",
          games: 20,
          goals: 4
        },
        {
          s: "22",
          team: "CS Mar\xEDtimo",
          games: 14,
          goals: 1
        }
      ],
      titles: []
    },
    fam05: {
      fpId: 17802,
      games: 20,
      yellow: 1,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "FC Famalic\xE3o",
          games: 6,
          goals: 1
        },
        {
          s: "25",
          team: "ADCR Caxinas",
          games: 8,
          goals: 0
        },
        {
          s: "24",
          team: "ADC Nogueir\xF3 e Ten\xF5es",
          games: 6,
          goals: 2
        }
      ],
      titles: []
    },
    fam13: {
      fpId: 2551,
      games: 127,
      yellow: 18,
      red: 3,
      seasons: [
        {
          s: "26",
          team: "FC Famalic\xE3o",
          games: 3,
          goals: 1
        },
        {
          s: "25",
          team: "AD Fund\xE3o",
          games: 18,
          goals: 2
        },
        {
          s: "24",
          team: "Le\xF5es de Porto Salvo B",
          games: 4,
          goals: 2
        },
        {
          s: "24",
          team: "Le\xF5es de Porto Salvo",
          games: 33,
          goals: 2
        },
        {
          s: "23",
          team: "Le\xF5es de Porto Salvo B",
          games: 6,
          goals: 3
        },
        {
          s: "23",
          team: "Le\xF5es de Porto Salvo",
          games: 26,
          goals: 3
        },
        {
          s: "22",
          team: "Le\xF5es de Porto Salvo",
          games: 7,
          goals: 0
        },
        {
          s: "22",
          team: "Le\xF5es de Porto Salvo B",
          games: 14,
          goals: 12
        },
        {
          s: "21",
          team: "Le\xF5es de Porto Salvo B",
          games: 16,
          goals: 12
        }
      ],
      titles: [
        "Campeonato Nacional Sub 17 (2016/2017, 2017/2018, 2017/2018)",
        "Ta\xE7a Nacional Sub 17 (2015/2016)"
      ]
    },
    fam04: {
      fpId: 19622,
      games: 126,
      yellow: 12,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "FC Famalic\xE3o",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "FC Famalic\xE3o",
          games: 21,
          goals: 1
        },
        {
          s: "24",
          team: "FC Famalic\xE3o",
          games: 14,
          goals: 0
        },
        {
          s: "24",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 14,
          goals: 0
        },
        {
          s: "23",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 26,
          goals: 0
        },
        {
          s: "22",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 28,
          goals: 2
        },
        {
          s: "21",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 17,
          goals: 2
        }
      ],
      titles: [
        "2\xAA Divis\xE3o (2024/2025)"
      ]
    },
    famf51901: {
      fpId: 51901,
      games: 5,
      yellow: 2,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "FC Famalic\xE3o",
          games: 5,
          goals: 0
        }
      ],
      titles: []
    },
    fam14: {
      fpId: 51902,
      games: 5,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "FC Famalic\xE3o",
          games: 5,
          goals: 0
        }
      ],
      titles: []
    },
    fam16: {
      fpId: 9388,
      games: 60,
      yellow: 10,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "FC Famalic\xE3o",
          games: 5,
          goals: 1
        },
        {
          s: "23",
          team: "ADCR Caxinas",
          games: 12,
          goals: 2
        },
        {
          s: "23",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 6,
          goals: 4
        },
        {
          s: "22",
          team: "Ribera Navarra FS",
          games: 5,
          goals: 1
        },
        {
          s: "21",
          team: "Ribera Navarra FS",
          games: 32,
          goals: 14
        }
      ],
      titles: []
    },
    fam18: {
      fpId: 18107,
      games: 65,
      yellow: 8,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "FC Famalic\xE3o",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 14,
          goals: 0
        },
        {
          s: "25",
          team: "SC Braga",
          games: 16,
          goals: 0
        },
        {
          s: "24",
          team: "SC Braga",
          games: 7,
          goals: 0
        },
        {
          s: "23",
          team: "SC Braga",
          games: 5,
          goals: 0
        },
        {
          s: "22",
          team: "Futsal Cube Azem\xE9is",
          games: 17,
          goals: 0
        }
      ],
      titles: [
        "Ta\xE7a de Portugal (2023/2024, 2023/2024)",
        "Campeonato Nacional Sub 19 - 2\xAA DIVIS\xC3O (2023/2024, 2023/2024)",
        "Superta\xE7a (2024/2025, 2024/2025)"
      ]
    },
    fam01: {
      fpId: 18357,
      games: 115,
      yellow: 1,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "FC Famalic\xE3o",
          games: 5,
          goals: 0
        },
        {
          s: "25",
          team: "CRC Quinta dos Lombos",
          games: 24,
          goals: 1
        },
        {
          s: "24",
          team: "AD Fund\xE3o",
          games: 28,
          goals: 1
        },
        {
          s: "23",
          team: "SC Braga",
          games: 25,
          goals: 0
        },
        {
          s: "22",
          team: "SC Braga",
          games: 18,
          goals: 0
        },
        {
          s: "21",
          team: "SC Braga",
          games: 15,
          goals: 0
        }
      ],
      titles: [
        "Ta\xE7a de Portugal (2023/2024)"
      ]
    },
    fam11: {
      fpId: 4998,
      games: 129,
      yellow: 35,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "FC Famalic\xE3o",
          games: 6,
          goals: 1
        },
        {
          s: "25",
          team: "FC Famalic\xE3o",
          games: 10,
          goals: 2
        },
        {
          s: "25",
          team: "GRC D\xEDnamo Sanjoanense",
          games: 14,
          goals: 12
        },
        {
          s: "24",
          team: "FC Famalic\xE3o",
          games: 25,
          goals: 8
        },
        {
          s: "23",
          team: "FC Famalic\xE3o",
          games: 26,
          goals: 9
        },
        {
          s: "22",
          team: "FC Famalic\xE3o",
          games: 26,
          goals: 12
        },
        {
          s: "21",
          team: "ACR Lordelo",
          games: 22,
          goals: 25
        }
      ],
      titles: [
        "2\xAA Divis\xE3o (2024/2025)"
      ]
    },
    fam15: {
      fpId: 1215,
      games: 121,
      yellow: 50,
      red: 3,
      seasons: [
        {
          s: "26",
          team: "FC Famalic\xE3o",
          games: 5,
          goals: 2
        },
        {
          s: "25",
          team: "FC Famalic\xE3o",
          games: 21,
          goals: 2
        },
        {
          s: "24",
          team: "FC Famalic\xE3o",
          games: 26,
          goals: 13
        },
        {
          s: "23",
          team: "FC Famalic\xE3o",
          games: 23,
          goals: 18
        },
        {
          s: "22",
          team: "FC Famalic\xE3o",
          games: 24,
          goals: 26
        },
        {
          s: "21",
          team: "FC Famalic\xE3o",
          games: 22,
          goals: 22
        }
      ],
      titles: [
        "2\xAA Divis\xE3o (2024/2025)"
      ]
    },
    fam10: {
      fpId: 19342,
      games: 16,
      yellow: 3,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "FC Famalic\xE3o",
          games: 6,
          goals: 1
        },
        {
          s: "25",
          team: "Piast Gliwice Futsal",
          games: 5,
          goals: 0
        },
        {
          s: "24",
          team: "SL Benfica",
          games: 5,
          goals: 0
        }
      ],
      titles: [
        "Liga Placard (2024/2025, 2024/2025)",
        "Campeonato Nacional Sub 17 (2022/2023)",
        "Campeonato Europa Sub 19 (2025/2026)"
      ]
    },
    uvn05: {
      fpId: 11981,
      games: 56,
      yellow: 5,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "UP Venda Nova",
          games: 5,
          goals: 0
        },
        {
          s: "25",
          team: "UP Venda Nova",
          games: 21,
          goals: 5
        },
        {
          s: "24",
          team: "AMSAC",
          games: 26,
          goals: 5
        },
        {
          s: "23",
          team: "Sporting CP",
          games: 2,
          goals: 0
        },
        {
          s: "22",
          team: "Sporting CP",
          games: 2,
          goals: 0
        }
      ],
      titles: [
        "Liga Placard (2022/2023, 2022/2023, 2023/2024, 2023/2024)",
        "Campeonato Nacional Sub 19 (2022/2023, 2022/2023, 2023/2024, 2023/2024)"
      ]
    },
    uvn01: {
      fpId: 28942,
      games: 4,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "UP Venda Nova",
          games: 4,
          goals: 0
        }
      ],
      titles: []
    },
    uvn20: {
      fpId: 1314,
      games: 96,
      yellow: 20,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "UP Venda Nova",
          games: 6,
          goals: 1
        },
        {
          s: "25",
          team: "UP Venda Nova",
          games: 22,
          goals: 11
        },
        {
          s: "24",
          team: "UP Venda Nova",
          games: 26,
          goals: 13
        },
        {
          s: "23",
          team: "CRC Quinta dos Lombos",
          games: 18,
          goals: 2
        },
        {
          s: "22",
          team: "UP Venda Nova",
          games: 17,
          goals: 14
        },
        {
          s: "22",
          team: "Le\xF5es de Porto Salvo",
          games: 7,
          goals: 0
        }
      ],
      titles: [
        "Liga Placard (2012/2013, 2013/2014)",
        "Ta\xE7a de Portugal (2012/2013)",
        "2\xAA Divis\xE3o (2017/2018)"
      ]
    },
    uvn07: {
      fpId: 66428,
      games: 1,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "UP Venda Nova",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    uvn14: {
      fpId: 6208,
      games: 74,
      yellow: 14,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "UP Venda Nova",
          games: 4,
          goals: 0
        },
        {
          s: "25",
          team: "UP Venda Nova",
          games: 12,
          goals: 10
        },
        {
          s: "25",
          team: "AMSAC",
          games: 12,
          goals: 11
        },
        {
          s: "24",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 18,
          goals: 4
        },
        {
          s: "23",
          team: "CRC Quinta dos Lombos",
          games: 24,
          goals: 4
        },
        {
          s: "22",
          team: "Sporting CP",
          games: 1,
          goals: 0
        },
        {
          s: "21",
          team: "Sporting CP",
          games: 3,
          goals: 0
        }
      ],
      titles: [
        "Liga Placard (2021/2022, 2021/2022, 2022/2023, 2022/2023)",
        "Ta\xE7a Nacional Sub 15 (2018/2019, 2018/2019)",
        "Campeonato Nacional Sub 19 (2022/2023, 2022/2023)",
        "Campeonato Europa Sub 19 (2023/2024)"
      ]
    },
    uvn13: {
      fpId: 37,
      games: 141,
      yellow: 19,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "UP Venda Nova",
          games: 6,
          goals: 2
        },
        {
          s: "25",
          team: "UP Venda Nova",
          games: 22,
          goals: 6
        },
        {
          s: "24",
          team: "UP Venda Nova",
          games: 29,
          goals: 11
        },
        {
          s: "23",
          team: "UP Venda Nova",
          games: 25,
          goals: 18
        },
        {
          s: "22",
          team: "UP Venda Nova",
          games: 33,
          goals: 27
        },
        {
          s: "21",
          team: "Le\xF5es de Porto Salvo B",
          games: 1,
          goals: 2
        },
        {
          s: "21",
          team: "Le\xF5es de Porto Salvo",
          games: 25,
          goals: 9
        }
      ],
      titles: []
    },
    uvn18: {
      fpId: 2313,
      games: 76,
      yellow: 12,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Reguilas de Tires",
          games: 2,
          goals: 0
        },
        {
          s: "25",
          team: "CF Belenenses",
          games: 18,
          goals: 9
        },
        {
          s: "24",
          team: "CF Belenenses",
          games: 25,
          goals: 8
        },
        {
          s: "23",
          team: "CF Belenenses",
          games: 8,
          goals: 4
        },
        {
          s: "22",
          team: "CF Belenenses",
          games: 5,
          goals: 1
        },
        {
          s: "21",
          team: "Le\xF5es de Porto Salvo",
          games: 18,
          goals: 2
        }
      ],
      titles: []
    },
    uvn03: {
      fpId: 51930,
      games: 9,
      yellow: 1,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Juventude AG",
          games: 3,
          goals: 0
        },
        {
          s: "26",
          team: "UP Venda Nova",
          games: 6,
          goals: 0
        }
      ],
      titles: []
    },
    uvn10: {
      fpId: 51932,
      games: 7,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "UP Venda Nova",
          games: 4,
          goals: 1
        },
        {
          s: "21",
          team: "United Galati",
          games: 3,
          goals: 0
        }
      ],
      titles: []
    },
    uvn15: {
      fpId: 51931,
      games: 4,
      yellow: 1,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "UP Venda Nova",
          games: 4,
          goals: 3
        }
      ],
      titles: []
    },
    uvn02: {
      fpId: 17308,
      games: 102,
      yellow: 10,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "UP Venda Nova",
          games: 3,
          goals: 0
        },
        {
          s: "25",
          team: "UP Venda Nova",
          games: 9,
          goals: 0
        },
        {
          s: "24",
          team: "AMSAC",
          games: 23,
          goals: 3
        },
        {
          s: "23",
          team: "UP Venda Nova",
          games: 24,
          goals: 1
        },
        {
          s: "22",
          team: "SCU Torreense",
          games: 16,
          goals: 0
        },
        {
          s: "22",
          team: "AMSAC",
          games: 16,
          goals: 1
        },
        {
          s: "21",
          team: "Sporting CP",
          games: 11,
          goals: 0
        }
      ],
      titles: [
        "Liga Placard (2021/2022, 2021/2022, 2021/2022)",
        "Ta\xE7a de Portugal (2021/2022, 2021/2022, 2021/2022)",
        "2\xAA Divis\xE3o (2022/2023)"
      ]
    },
    uvn16: {
      fpId: 44358,
      games: 4,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "UP Venda Nova",
          games: 2,
          goals: 1
        },
        {
          s: "25",
          team: "Sporting CP",
          games: 1,
          goals: 0
        },
        {
          s: "23",
          team: "Le\xF5es de Porto Salvo",
          games: 1,
          goals: 2
        }
      ],
      titles: [
        "Campeonato Nacional Sub 19 (2024/2025, 2024/2025)",
        "Ta\xE7a Nacional Sub 15 (2021/2022)"
      ]
    },
    uvn12: {
      fpId: 1667,
      games: 141,
      yellow: 28,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "UP Venda Nova",
          games: 5,
          goals: 3
        },
        {
          s: "25",
          team: "UP Venda Nova",
          games: 23,
          goals: 13
        },
        {
          s: "24",
          team: "UP Venda Nova",
          games: 30,
          goals: 28
        },
        {
          s: "23",
          team: "SCU Torreense",
          games: 10,
          goals: 3
        },
        {
          s: "23",
          team: "CF Belenenses",
          games: 14,
          goals: 7
        },
        {
          s: "22",
          team: "SCU Torreense",
          games: 25,
          goals: 8
        },
        {
          s: "21",
          team: "AMSAC",
          games: 34,
          goals: 25
        }
      ],
      titles: [
        "Campeonato Nacional Sub 19 (2016/2017, 2017/2018)",
        "2\xAA Divis\xE3o (2022/2023)"
      ]
    },
    uvn09: {
      fpId: 4948,
      games: 103,
      yellow: 23,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "UP Venda Nova",
          games: 6,
          goals: 1
        },
        {
          s: "25",
          team: "UP Venda Nova",
          games: 23,
          goals: 8
        },
        {
          s: "24",
          team: "AMSAC",
          games: 25,
          goals: 12
        },
        {
          s: "23",
          team: "CF Belenenses",
          games: 21,
          goals: 6
        },
        {
          s: "22",
          team: "AD Fund\xE3o",
          games: 27,
          goals: 2
        },
        {
          s: "21",
          team: "SL Benfica",
          games: 1,
          goals: 0
        }
      ],
      titles: [
        "Ta\xE7a Nacional Sub 15 (2017/2018, 2017/2018)",
        "Campeonato Nacional Sub 17 (2018/2019)"
      ]
    },
    uvn04: {
      fpId: 26276,
      games: 8,
      yellow: 1,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "UP Venda Nova",
          games: 3,
          goals: 0
        },
        {
          s: "24",
          team: "Le\xF5es de Porto Salvo B",
          games: 5,
          goals: 0
        }
      ],
      titles: []
    },
    uvn17: {
      fpId: 4946,
      games: 103,
      yellow: 16,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "CF Belenenses",
          games: 5,
          goals: 2
        },
        {
          s: "25",
          team: "UP Venda Nova",
          games: 26,
          goals: 12
        },
        {
          s: "24",
          team: "CF Sassoeiros",
          games: 23,
          goals: 12
        },
        {
          s: "23",
          team: "AMSAC",
          games: 30,
          goals: 10
        },
        {
          s: "22",
          team: "Le\xF5es de Porto Salvo B",
          games: 19,
          goals: 11
        }
      ],
      titles: [
        "Ta\xE7a Nacional Sub 15 (2017/2018, 2017/2018)",
        "Campeonato Nacional Sub 17 (2018/2019)"
      ]
    },
    uvn06: {
      fpId: 6180,
      games: 116,
      yellow: 23,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "UP Venda Nova",
          games: 6,
          goals: 2
        },
        {
          s: "25",
          team: "CRC Quinta dos Lombos",
          games: 23,
          goals: 3
        },
        {
          s: "24",
          team: "SCU Torreense",
          games: 16,
          goals: 1
        },
        {
          s: "24",
          team: "CRC Quinta dos Lombos",
          games: 15,
          goals: 4
        },
        {
          s: "23",
          team: "AMSAC",
          games: 21,
          goals: 6
        },
        {
          s: "22",
          team: "AMSAC",
          games: 28,
          goals: 5
        },
        {
          s: "21",
          team: "SL Benfica",
          games: 7,
          goals: 1
        }
      ],
      titles: []
    },
    uvn19: {
      fpId: 17865,
      games: 65,
      yellow: 17,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "UP Venda Nova",
          games: 4,
          goals: 0
        },
        {
          s: "25",
          team: "AMSAC",
          games: 25,
          goals: 13
        },
        {
          s: "24",
          team: "UP Venda Nova",
          games: 22,
          goals: 4
        },
        {
          s: "24",
          team: "AMSAC",
          games: 2,
          goals: 0
        },
        {
          s: "23",
          team: "AMSAC",
          games: 12,
          goals: 0
        }
      ],
      titles: [
        "Campeonato Nacional Sub 19 (2022/2023)"
      ]
    },
    uvn08: {
      fpId: 6181,
      games: 84,
      yellow: 15,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "UP Venda Nova",
          games: 4,
          goals: 0
        },
        {
          s: "25",
          team: "AMSAC",
          games: 22,
          goals: 7
        },
        {
          s: "24",
          team: "AMSAC",
          games: 27,
          goals: 8
        },
        {
          s: "23",
          team: "AMSAC",
          games: 29,
          goals: 5
        },
        {
          s: "22",
          team: "Sporting CP",
          games: 1,
          goals: 0
        },
        {
          s: "21",
          team: "Sporting CP",
          games: 1,
          goals: 0
        }
      ],
      titles: [
        "Liga Placard (2021/2022, 2021/2022, 2022/2023, 2022/2023)",
        "Ta\xE7a Nacional Sub 15 (2018/2019, 2018/2019)",
        "Campeonato Nacional Sub 19 (2022/2023, 2022/2023)"
      ]
    },
    uvn11: {
      fpId: 1671,
      games: 126,
      yellow: 44,
      red: 4,
      seasons: [
        {
          s: "26",
          team: "UP Venda Nova",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "AD Fund\xE3o",
          games: 25,
          goals: 1
        },
        {
          s: "24",
          team: "AD Fund\xE3o",
          games: 26,
          goals: 3
        },
        {
          s: "23",
          team: "SC Lusit\xE2nia",
          games: 23,
          goals: 10
        },
        {
          s: "22",
          team: "ACD Ladoeiro",
          games: 12,
          goals: 3
        },
        {
          s: "22",
          team: "CCRD Burinhosa",
          games: 10,
          goals: 1
        },
        {
          s: "21",
          team: "AD Fund\xE3o",
          games: 24,
          goals: 0
        }
      ],
      titles: [
        "Campeonato Nacional Sub 19 (2017/2018, 2017/2018)"
      ]
    },
    scp14: {
      fpId: 20,
      games: 273,
      yellow: 46,
      red: 5,
      seasons: [
        {
          s: "26",
          team: "Sporting CP",
          games: 12,
          goals: 4
        },
        {
          s: "25",
          team: "Sporting CP",
          games: 49,
          goals: 26
        },
        {
          s: "25",
          team: "It\xE1lia",
          games: 6,
          goals: 0
        },
        {
          s: "24",
          team: "Sporting CP",
          games: 47,
          goals: 23
        },
        {
          s: "24",
          team: "It\xE1lia",
          games: 4,
          goals: 1
        },
        {
          s: "23",
          team: "Sporting CP",
          games: 49,
          goals: 25
        },
        {
          s: "23",
          team: "It\xE1lia",
          games: 5,
          goals: 2
        },
        {
          s: "22",
          team: "Sporting CP",
          games: 44,
          goals: 18
        },
        {
          s: "22",
          team: "It\xE1lia",
          games: 6,
          goals: 0
        },
        {
          s: "21",
          team: "Sporting CP",
          games: 48,
          goals: 30
        },
        {
          s: "21",
          team: "It\xE1lia",
          games: 3,
          goals: 1
        }
      ],
      titles: [
        "Liga Placard (2015/2016, 2016/2017, 2017/2018, 2020/2021, 2021/2022, 2022/2023, 2023/2024)",
        "Superta\xE7a (2017/2018, 2018/2019, 2019/2020, 2021/2022, 2022/2023, 2025/2026, 2026/2027)",
        "Ta\xE7a de Portugal (2015/2016, 2017/2018, 2018/2019, 2019/2020, 2021/2022, 2024/2025)",
        "Ta\xE7a da Liga (2015/2016, 2016/2017, 2020/2021, 2021/2022, 2023/2024, 2024/2025)",
        "UEFA Futsal Champions League (2018/2019, 2020/2021, 2025/2026)",
        "Campeonato da Europa (2013/2014)"
      ]
    },
    scp02: {
      fpId: 447,
      games: 206,
      yellow: 12,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Sporting CP",
          games: 11,
          goals: 1
        },
        {
          s: "25",
          team: "Sporting CP",
          games: 45,
          goals: 5
        },
        {
          s: "24",
          team: "Sporting CP",
          games: 44,
          goals: 3
        },
        {
          s: "23",
          team: "Sporting CP",
          games: 31,
          goals: 3
        },
        {
          s: "22",
          team: "Sporting CP",
          games: 40,
          goals: 1
        },
        {
          s: "21",
          team: "Sporting CP",
          games: 35,
          goals: 1
        }
      ],
      titles: [
        "Liga Placard (2017/2018, 2017/2018, 2020/2021, 2021/2022, 2022/2023, 2023/2024)",
        "Ta\xE7a de Portugal (2018/2019, 2018/2019, 2019/2020, 2019/2020, 2021/2022, 2024/2025)",
        "Superta\xE7a (2018/2019, 2018/2019, 2022/2023, 2025/2026, 2026/2027)",
        "Ta\xE7a da Liga (2021/2022, 2023/2024, 2024/2025)",
        "Campeonato Nacional Sub 17 (2016/2017, 2016/2017)",
        "Campeonato Nacional Sub 19 (2018/2019, 2018/2019)",
        "UEFA Futsal Champions League (2020/2021, 2025/2026)",
        "Ta\xE7a Nacional Sub 17 (2015/2016)"
      ]
    },
    scp05: {
      fpId: 6215,
      games: 134,
      yellow: 19,
      red: 4,
      seasons: [
        {
          s: "26",
          team: "Sporting CP",
          games: 12,
          goals: 2
        },
        {
          s: "25",
          team: "Sporting CP",
          games: 40,
          goals: 7
        },
        {
          s: "24",
          team: "Le\xF5es de Porto Salvo",
          games: 31,
          goals: 3
        },
        {
          s: "23",
          team: "Le\xF5es de Porto Salvo",
          games: 31,
          goals: 5
        },
        {
          s: "22",
          team: "Sporting CP",
          games: 8,
          goals: 1
        },
        {
          s: "21",
          team: "Sporting CP",
          games: 12,
          goals: 0
        }
      ],
      titles: [
        "Liga Placard (2021/2022, 2021/2022, 2022/2023, 2022/2023)",
        "Superta\xE7a (2021/2022, 2021/2022, 2025/2026, 2026/2027)",
        "Ta\xE7a de Portugal (2021/2022, 2021/2022)",
        "Campeonato Nacional Sub 19 (2022/2023, 2022/2023)",
        "Ta\xE7a Nacional Sub 15 (2018/2019)",
        "Campeonato Europa Sub 19 (2023/2024)",
        "UEFA Futsal Champions League (2025/2026)"
      ]
    },
    scp13: {
      fpId: 119,
      games: 155,
      yellow: 26,
      red: 3,
      seasons: [
        {
          s: "26",
          team: "Sporting CP",
          games: 13,
          goals: 4
        },
        {
          s: "25",
          team: "Sporting CP",
          games: 51,
          goals: 56
        },
        {
          s: "23",
          team: "Le\xF5es de Porto Salvo",
          games: 32,
          goals: 22
        },
        {
          s: "22",
          team: "Le\xF5es de Porto Salvo",
          games: 29,
          goals: 19
        },
        {
          s: "21",
          team: "Le\xF5es de Porto Salvo",
          games: 30,
          goals: 24
        }
      ],
      titles: [
        "Superta\xE7a (2025/2026, 2026/2027)",
        "Ta\xE7a de Portugal (2014/2015)",
        "Liga Placard (2014/2015)",
        "Ta\xE7a da Liga (2017/2018)",
        "UEFA Futsal Champions League (2025/2026)"
      ]
    },
    scp08: {
      fpId: 2553,
      games: 177,
      yellow: 37,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Sporting CP",
          games: 11,
          goals: 5
        },
        {
          s: "25",
          team: "Sporting CP",
          games: 47,
          goals: 37
        },
        {
          s: "24",
          team: "Sporting CP",
          games: 47,
          goals: 15
        },
        {
          s: "23",
          team: "Sporting CP",
          games: 39,
          goals: 18
        },
        {
          s: "22",
          team: "Sporting CP",
          games: 33,
          goals: 12
        }
      ],
      titles: [
        "Liga Placard (2020/2021, 2020/2021, 2022/2023, 2023/2024)",
        "Ta\xE7a da Liga (2020/2021, 2020/2021, 2023/2024, 2024/2025)",
        "UEFA Futsal Champions League (2020/2021, 2020/2021, 2025/2026)",
        "Campeonato Nacional Sub 17 (2016/2017, 2017/2018)",
        "Campeonato Nacional Sub 19 (2018/2019, 2018/2019)",
        "Superta\xE7a (2025/2026, 2026/2027)",
        "Ta\xE7a de Portugal (2024/2025)"
      ]
    },
    scp07: {
      fpId: 179,
      games: 201,
      yellow: 54,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Sporting CP",
          games: 4,
          goals: 0
        },
        {
          s: "25",
          team: "FC Barcelona",
          games: 36,
          goals: 5
        },
        {
          s: "24",
          team: "FC Barcelona",
          games: 33,
          goals: 3
        },
        {
          s: "23",
          team: "FC Barcelona",
          games: 47,
          goals: 7
        },
        {
          s: "22",
          team: "Sporting CP",
          games: 44,
          goals: 9
        },
        {
          s: "21",
          team: "Sporting CP",
          games: 37,
          goals: 13
        }
      ],
      titles: [
        "Superta\xE7a (2014/2015, 2018/2019, 2019/2020, 2021/2022, 2022/2023)",
        "Ta\xE7a de Portugal (2018/2019, 2019/2020, 2021/2022)",
        "Liga Placard (2020/2021, 2021/2022, 2022/2023)",
        "UEFA Futsal Champions League (2018/2019, 2020/2021)",
        "Ta\xE7a da Liga (2020/2021, 2021/2022)",
        "Campeonato do Mundo (2021/2022)",
        "Campeonato da Europa (2021/2022)",
        "Final\xEDssima (2022/2023)",
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2025/2026)"
      ]
    },
    scp17: {
      fpId: 51936,
      games: 48,
      yellow: 7,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Joinville",
          games: 14,
          goals: 9
        },
        {
          s: "26",
          team: "Sporting CP",
          games: 12,
          goals: 5
        },
        {
          s: "25",
          team: "Joinville",
          games: 22,
          goals: 2
        }
      ],
      titles: [
        "Superta\xE7a (2026/2027)"
      ]
    },
    scp12: {
      fpId: 5133,
      games: 211,
      yellow: 28,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Sporting CP",
          games: 12,
          goals: 7
        },
        {
          s: "25",
          team: "Sporting CP",
          games: 45,
          goals: 22
        },
        {
          s: "25",
          team: "Brasil",
          games: 6,
          goals: 1
        },
        {
          s: "24",
          team: "ElPozo Murcia",
          games: 37,
          goals: 22
        },
        {
          s: "24",
          team: "Brasil",
          games: 7,
          goals: 3
        },
        {
          s: "23",
          team: "ElPozo Murcia",
          games: 36,
          goals: 9
        },
        {
          s: "22",
          team: "ElPozo Murcia",
          games: 33,
          goals: 9
        },
        {
          s: "21",
          team: "ElPozo Murcia",
          games: 35,
          goals: 13
        }
      ],
      titles: [
        "Campeonato do Mundo (2024/2025)",
        "UEFA Futsal Champions League (2025/2026)",
        "Copa Am\xE9rica (2025/2026)",
        "Superta\xE7a (2026/2027)"
      ]
    },
    scp01: {
      fpId: 3,
      games: 137,
      yellow: 3,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Sporting CP",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "Sporting CP",
          games: 28,
          goals: 0
        },
        {
          s: "24",
          team: "Sporting CP",
          games: 28,
          goals: 0
        },
        {
          s: "23",
          team: "Sporting CP",
          games: 33,
          goals: 0
        },
        {
          s: "22",
          team: "Sporting CP",
          games: 17,
          goals: 0
        },
        {
          s: "21",
          team: "Sporting CP",
          games: 24,
          goals: 2
        }
      ],
      titles: [
        "Liga Placard (2010/2011, 2010/2011, 2012/2013, 2013/2014, 2015/2016, 2016/2017, 2016/2017, 2017/2018, 2017/2018, 2020/2021, 2021/2022, 2022/2023, 2023/2024)",
        "Ta\xE7a de Portugal (2012/2013, 2017/2018, 2017/2018, 2018/2019, 2019/2020, 2021/2022, 2024/2025)",
        "Superta\xE7a (2017/2018, 2017/2018, 2018/2019, 2019/2020, 2021/2022, 2025/2026)",
        "Ta\xE7a da Liga (2016/2017, 2016/2017, 2020/2021, 2023/2024, 2024/2025)",
        "UEFA Futsal Champions League (2018/2019, 2020/2021, 2025/2026)",
        "Ta\xE7a Nacional Sub 17 (2015/2016)"
      ]
    },
    scp10: {
      fpId: 4798,
      games: 195,
      yellow: 26,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Sporting CP",
          games: 7,
          goals: 1
        },
        {
          s: "25",
          team: "Sporting CP",
          games: 23,
          goals: 5
        },
        {
          s: "24",
          team: "SL Benfica",
          games: 31,
          goals: 27
        },
        {
          s: "23",
          team: "SL Benfica",
          games: 37,
          goals: 11
        },
        {
          s: "22",
          team: "SL Benfica",
          games: 42,
          goals: 21
        },
        {
          s: "21",
          team: "SL Benfica",
          games: 44,
          goals: 34
        },
        {
          s: "21",
          team: "R\xFAssia",
          games: 11,
          goals: 10
        }
      ],
      titles: [
        "UEFA Futsal Champions League (2015/2016, 2025/2026)",
        "Ta\xE7a da Liga (2022/2023)",
        "Ta\xE7a de Portugal (2022/2023)",
        "Superta\xE7a (2023/2024)",
        "Liga Placard (2024/2025)"
      ]
    },
    scp03: {
      fpId: 51935,
      games: 49,
      yellow: 1,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Sporting CP",
          games: 13,
          goals: 0
        },
        {
          s: "26",
          team: "Ucr\xE2nia",
          games: 1,
          goals: 0
        },
        {
          s: "25",
          team: "FC HIT Kiev",
          games: 5,
          goals: 1
        },
        {
          s: "25",
          team: "Ucr\xE2nia",
          games: 4,
          goals: 0
        },
        {
          s: "24",
          team: "FC HIT Kiev",
          games: 3,
          goals: 0
        },
        {
          s: "24",
          team: "Ucr\xE2nia",
          games: 13,
          goals: 1
        },
        {
          s: "23",
          team: "FC HIT Kiev",
          games: 6,
          goals: 2
        },
        {
          s: "23",
          team: "Ucr\xE2nia",
          games: 2,
          goals: 0
        },
        {
          s: "22",
          team: "Ucr\xE2nia",
          games: 2,
          goals: 0
        }
      ],
      titles: [
        "Superta\xE7a (2026/2027)"
      ]
    },
    scp15: {
      fpId: 44340,
      games: 12,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Sporting CP",
          games: 10,
          goals: 1
        },
        {
          s: "25",
          team: "Sporting CP",
          games: 2,
          goals: 0
        }
      ],
      titles: [
        "Campeonato Nacional Sub 19 (2024/2025, 2024/2025)",
        "Campeonato Nacional Sub 17 (2024/2025, 2024/2025)",
        "Superta\xE7a (2026/2027, 2026/2027)"
      ]
    },
    scp18: {
      fpId: 5156,
      games: 189,
      yellow: 31,
      red: 5,
      seasons: [
        {
          s: "26",
          team: "Sporting CP",
          games: 12,
          goals: 8
        },
        {
          s: "25",
          team: "Sporting CP",
          games: 47,
          goals: 27
        },
        {
          s: "25",
          team: "Brasil",
          games: 6,
          goals: 1
        },
        {
          s: "24",
          team: "Sporting CP",
          games: 22,
          goals: 13
        },
        {
          s: "23",
          team: "SL Benfica",
          games: 25,
          goals: 19
        },
        {
          s: "22",
          team: "SL Benfica",
          games: 48,
          goals: 38
        },
        {
          s: "21",
          team: "SL Benfica",
          games: 23,
          goals: 15
        },
        {
          s: "21",
          team: "Brasil",
          games: 6,
          goals: 1
        }
      ],
      titles: [
        "Ta\xE7a de Portugal (2018/2019, 2019/2020, 2022/2023, 2024/2025)",
        "UEFA Futsal Champions League (2018/2019, 2020/2021, 2025/2026)",
        "Superta\xE7a (2019/2020, 2025/2026, 2026/2027)",
        "Ta\xE7a da Liga (2020/2021, 2022/2023)",
        "Liga Placard (2020/2021)",
        "Copa Am\xE9rica (2025/2026)"
      ]
    },
    scp09: {
      fpId: 2525,
      games: 143,
      yellow: 27,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Sporting CP",
          games: 13,
          goals: 7
        },
        {
          s: "25",
          team: "Le\xF5es de Porto Salvo",
          games: 30,
          goals: 14
        },
        {
          s: "24",
          team: "Le\xF5es de Porto Salvo",
          games: 29,
          goals: 8
        },
        {
          s: "23",
          team: "Le\xF5es de Porto Salvo",
          games: 7,
          goals: 1
        },
        {
          s: "22",
          team: "ADCR Caxinas",
          games: 27,
          goals: 6
        },
        {
          s: "21",
          team: "ADCR Caxinas",
          games: 37,
          goals: 20
        }
      ],
      titles: [
        "Campeonato Nacional Sub 17 (2018/2019)",
        "2\xAA Divis\xE3o (2021/2022)",
        "Superta\xE7a (2026/2027)"
      ]
    },
    scp11: {
      fpId: 17776,
      games: 30,
      yellow: 1,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Sporting CP",
          games: 10,
          goals: 1
        },
        {
          s: "25",
          team: "Sporting CP",
          games: 17,
          goals: 4
        },
        {
          s: "24",
          team: "Sporting CP",
          games: 3,
          goals: 0
        }
      ],
      titles: [
        "Campeonato Nacional Sub 19 (2022/2023, 2022/2023, 2023/2024, 2023/2024, 2024/2025, 2024/2025)",
        "UEFA Futsal Champions League (2025/2026, 2025/2026)",
        "Campeonato Europa Sub 19 (2025/2026)",
        "Superta\xE7a (2026/2027)"
      ]
    },
    scp04: {
      fpId: 450,
      games: 214,
      yellow: 40,
      red: 3,
      seasons: [
        {
          s: "26",
          team: "Sporting CP",
          games: 12,
          goals: 9
        },
        {
          s: "25",
          team: "Sporting CP",
          games: 46,
          goals: 44
        },
        {
          s: "24",
          team: "Sporting CP",
          games: 31,
          goals: 15
        },
        {
          s: "23",
          team: "Sporting CP",
          games: 42,
          goals: 25
        },
        {
          s: "22",
          team: "Sporting CP",
          games: 41,
          goals: 16
        },
        {
          s: "21",
          team: "Sporting CP",
          games: 42,
          goals: 12
        }
      ],
      titles: [
        "Ta\xE7a de Portugal (2019/2020, 2019/2020, 2021/2022, 2024/2025)",
        "Liga Placard (2020/2021, 2021/2022, 2022/2023, 2023/2024)",
        "Ta\xE7a da Liga (2020/2021, 2021/2022, 2023/2024, 2024/2025)",
        "Superta\xE7a (2021/2022, 2022/2023, 2025/2026, 2026/2027)",
        "UEFA Futsal Champions League (2020/2021, 2025/2026)",
        "Ta\xE7a Nacional Sub 17 (2015/2016)",
        "Campeonato Nacional Sub 17 (2016/2017)",
        "Campeonato Nacional Sub 19 (2018/2019)",
        "Campeonato do Mundo (2021/2022)",
        "Campeonato da Europa (2021/2022)",
        "Final\xEDssima (2022/2023)"
      ]
    },
    scp06: {
      fpId: 9421,
      games: 222,
      yellow: 41,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Sporting CP",
          games: 13,
          goals: 8
        },
        {
          s: "25",
          team: "Sporting CP",
          games: 49,
          goals: 15
        },
        {
          s: "24",
          team: "Sporting CP",
          games: 50,
          goals: 17
        },
        {
          s: "23",
          team: "Sporting CP",
          games: 49,
          goals: 9
        },
        {
          s: "22",
          team: "Le\xF5es de Porto Salvo",
          games: 30,
          goals: 6
        },
        {
          s: "21",
          team: "Le\xF5es de Porto Salvo",
          games: 31,
          goals: 10
        }
      ],
      titles: [
        "Ta\xE7a da Liga (2023/2024, 2024/2025)",
        "Superta\xE7a (2025/2026, 2026/2027)",
        "Campeonato Nacional Sub 19 (2018/2019)",
        "Liga Placard (2023/2024)",
        "Ta\xE7a de Portugal (2024/2025)",
        "UEFA Futsal Champions League (2025/2026)"
      ]
    },
    scp16: {
      fpId: 2547,
      games: 170,
      yellow: 36,
      red: 1,
      seasons: [
        {
          s: "25",
          team: "Sporting CP",
          games: 22,
          goals: 14
        },
        {
          s: "24",
          team: "Sporting CP",
          games: 33,
          goals: 27
        },
        {
          s: "23",
          team: "Sporting CP",
          games: 44,
          goals: 42
        },
        {
          s: "22",
          team: "Sporting CP",
          games: 38,
          goals: 24
        },
        {
          s: "21",
          team: "Sporting CP",
          games: 33,
          goals: 11
        }
      ],
      titles: [
        "Ta\xE7a de Portugal (2019/2020, 2019/2020, 2021/2022, 2024/2025)",
        "Ta\xE7a da Liga (2020/2021, 2021/2022, 2023/2024, 2024/2025)",
        "Liga Placard (2020/2021, 2021/2022, 2022/2023, 2023/2024)",
        "Campeonato Nacional Sub 17 (2016/2017, 2017/2018)",
        "Campeonato Nacional Sub 19 (2018/2019, 2018/2019)",
        "UEFA Futsal Champions League (2020/2021, 2025/2026)",
        "Superta\xE7a (2021/2022, 2022/2023)",
        "Campeonato do Mundo (2021/2022)",
        "Campeonato da Europa (2021/2022)",
        "Final\xEDssima (2022/2023)"
      ]
    },
    lps18: {
      fpId: 19890,
      games: 56,
      yellow: 5,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Le\xF5es de Porto Salvo B",
          games: 2,
          goals: 3
        },
        {
          s: "26",
          team: "Le\xF5es de Porto Salvo",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "Le\xF5es de Porto Salvo",
          games: 19,
          goals: 0
        },
        {
          s: "25",
          team: "Le\xF5es de Porto Salvo B",
          games: 16,
          goals: 9
        },
        {
          s: "24",
          team: "Le\xF5es de Porto Salvo B",
          games: 12,
          goals: 2
        },
        {
          s: "23",
          team: "Le\xF5es de Porto Salvo",
          games: 1,
          goals: 0
        }
      ],
      titles: [
        "Ta\xE7a Nacional Sub 15 (2021/2022)"
      ]
    },
    lps13: {
      fpId: 14116,
      games: 108,
      yellow: 15,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Le\xF5es de Porto Salvo",
          games: 6,
          goals: 1
        },
        {
          s: "25",
          team: "Le\xF5es de Porto Salvo B",
          games: 3,
          goals: 0
        },
        {
          s: "25",
          team: "Le\xF5es de Porto Salvo",
          games: 31,
          goals: 8
        },
        {
          s: "24",
          team: "AMSAC",
          games: 27,
          goals: 17
        },
        {
          s: "23",
          team: "UP Venda Nova",
          games: 15,
          goals: 9
        },
        {
          s: "22",
          team: "GD Estoril Praia",
          games: 26,
          goals: 21
        }
      ],
      titles: []
    },
    lps02: {
      fpId: 17906,
      games: 78,
      yellow: 7,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Le\xF5es de Porto Salvo",
          games: 1,
          goals: 0
        },
        {
          s: "25",
          team: "ADCR Caxinas",
          games: 16,
          goals: 0
        },
        {
          s: "25",
          team: "SL Benfica",
          games: 2,
          goals: 0
        },
        {
          s: "24",
          team: "SL Benfica",
          games: 30,
          goals: 0
        },
        {
          s: "23",
          team: "SL Benfica",
          games: 27,
          goals: 0
        },
        {
          s: "22",
          team: "SL Benfica",
          games: 2,
          goals: 0
        }
      ],
      titles: [
        "Campeonato Nacional Sub 17 (2021/2022, 2021/2022)",
        "Liga Placard (2024/2025)"
      ]
    },
    lps22: {
      fpId: 26985,
      games: 20,
      yellow: 4,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Le\xF5es de Porto Salvo B",
          games: 3,
          goals: 4
        },
        {
          s: "26",
          team: "Le\xF5es de Porto Salvo",
          games: 2,
          goals: 0
        },
        {
          s: "25",
          team: "Le\xF5es de Porto Salvo B",
          games: 15,
          goals: 6
        }
      ],
      titles: []
    },
    lps09: {
      fpId: 48451,
      games: 3,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Le\xF5es de Porto Salvo B",
          games: 2,
          goals: 1
        },
        {
          s: "26",
          team: "Le\xF5es de Porto Salvo",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    lps11: {
      fpId: 48670,
      games: 3,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Le\xF5es de Porto Salvo B",
          games: 2,
          goals: 1
        },
        {
          s: "26",
          team: "Le\xF5es de Porto Salvo",
          games: 1,
          goals: 0
        }
      ],
      titles: [
        "Ta\xE7a Nacional Sub 19 (2025/2026)"
      ]
    },
    lps17: {
      fpId: 31238,
      games: 146,
      yellow: 23,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Le\xF5es de Porto Salvo",
          games: 6,
          goals: 4
        },
        {
          s: "25",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 29,
          goals: 10
        },
        {
          s: "24",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 28,
          goals: 6
        },
        {
          s: "23",
          team: "ADCR Caxinas",
          games: 29,
          goals: 11
        },
        {
          s: "22",
          team: "Le\xF5es de Porto Salvo",
          games: 31,
          goals: 3
        },
        {
          s: "21",
          team: "Le\xF5es de Porto Salvo B",
          games: 8,
          goals: 5
        },
        {
          s: "21",
          team: "Le\xF5es de Porto Salvo",
          games: 15,
          goals: 1
        }
      ],
      titles: []
    },
    lps01: {
      fpId: 6218,
      games: 65,
      yellow: 11,
      red: 3,
      seasons: [
        {
          s: "26",
          team: "Le\xF5es de Porto Salvo",
          games: 6,
          goals: 1
        },
        {
          s: "25",
          team: "UP Venda Nova",
          games: 22,
          goals: 3
        },
        {
          s: "24",
          team: "CRC Quinta dos Lombos",
          games: 30,
          goals: 1
        },
        {
          s: "23",
          team: "Sporting CP",
          games: 4,
          goals: 0
        },
        {
          s: "22",
          team: "Sporting CP",
          games: 3,
          goals: 0
        }
      ],
      titles: [
        "Liga Placard (2022/2023, 2022/2023, 2023/2024, 2023/2024)",
        "Campeonato Nacional Sub 19 (2022/2023, 2022/2023, 2023/2024, 2023/2024)",
        "Ta\xE7a Nacional Sub 15 (2018/2019, 2018/2019)",
        "Campeonato Europa Sub 19 (2023/2024)"
      ]
    },
    lps05: {
      fpId: 2732,
      games: 142,
      yellow: 26,
      red: 0,
      seasons: [
        {
          s: "25",
          team: "Le\xF5es de Porto Salvo",
          games: 31,
          goals: 2
        },
        {
          s: "24",
          team: "Le\xF5es de Porto Salvo",
          games: 23,
          goals: 1
        },
        {
          s: "23",
          team: "AMSAC",
          games: 27,
          goals: 10
        },
        {
          s: "22",
          team: "AMSAC",
          games: 29,
          goals: 16
        },
        {
          s: "21",
          team: "CCRD Burinhosa",
          games: 32,
          goals: 5
        }
      ],
      titles: [
        "Campeonato Nacional Sub 17 (2016/2017, 2017/2018)"
      ]
    },
    lps21: {
      fpId: 2324,
      games: 99,
      yellow: 29,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Le\xF5es de Porto Salvo",
          games: 6,
          goals: 1
        },
        {
          s: "25",
          team: "Le\xF5es de Porto Salvo B",
          games: 5,
          goals: 5
        },
        {
          s: "25",
          team: "Le\xF5es de Porto Salvo",
          games: 27,
          goals: 13
        },
        {
          s: "24",
          team: "AD Jorge Antunes",
          games: 25,
          goals: 24
        },
        {
          s: "23",
          team: "SC Lusit\xE2nia",
          games: 15,
          goals: 15
        },
        {
          s: "23",
          team: "SCU Torreense",
          games: 8,
          goals: 1
        },
        {
          s: "21",
          team: "ACD Ladoeiro",
          games: 13,
          goals: 5
        }
      ],
      titles: []
    },
    lps12: {
      fpId: 17781,
      games: 17,
      yellow: 6,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Le\xF5es de Porto Salvo",
          games: 1,
          goals: 0
        },
        {
          s: "26",
          team: "Le\xF5es de Porto Salvo B",
          games: 5,
          goals: 6
        },
        {
          s: "25",
          team: "Le\xF5es de Porto Salvo B",
          games: 11,
          goals: 2
        }
      ],
      titles: []
    },
    lps08: {
      fpId: 12522,
      games: 42,
      yellow: 7,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Le\xF5es de Porto Salvo",
          games: 6,
          goals: 2
        },
        {
          s: "25",
          team: "Le\xF5es de Porto Salvo B",
          games: 3,
          goals: 2
        },
        {
          s: "25",
          team: "Le\xF5es de Porto Salvo",
          games: 26,
          goals: 6
        },
        {
          s: "24",
          team: "Sporting CP",
          games: 6,
          goals: 0
        },
        {
          s: "23",
          team: "Sporting CP",
          games: 1,
          goals: 0
        }
      ],
      titles: [
        "Campeonato Nacional Sub 19 (2023/2024, 2023/2024, 2024/2025, 2024/2025)",
        "Liga Placard (2023/2024, 2023/2024)",
        "Ta\xE7a de Portugal (2024/2025, 2024/2025)",
        "Campeonato Europa Sub 19 (2025/2026)"
      ]
    },
    lps07: {
      fpId: 28966,
      games: 14,
      yellow: 7,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Le\xF5es de Porto Salvo",
          games: 5,
          goals: 0
        },
        {
          s: "25",
          team: "ADCR Caxinas",
          games: 9,
          goals: 3
        }
      ],
      titles: []
    },
    lps15: {
      fpId: 23755,
      games: 77,
      yellow: 22,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Le\xF5es de Porto Salvo",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "FC Famalic\xE3o",
          games: 20,
          goals: 8
        },
        {
          s: "24",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 28,
          goals: 12
        },
        {
          s: "23",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 23,
          goals: 4
        }
      ],
      titles: []
    },
    lps14: {
      fpId: 6272,
      games: 96,
      yellow: 21,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Le\xF5es de Porto Salvo",
          games: 3,
          goals: 2
        },
        {
          s: "25",
          team: "AD Fund\xE3o",
          games: 25,
          goals: 5
        },
        {
          s: "24",
          team: "AD Fund\xE3o",
          games: 14,
          goals: 2
        },
        {
          s: "24",
          team: "ADCR Caxinas",
          games: 15,
          goals: 2
        },
        {
          s: "23",
          team: "AD Fund\xE3o",
          games: 23,
          goals: 6
        },
        {
          s: "22",
          team: "SL Benfica",
          games: 4,
          goals: 1
        },
        {
          s: "21",
          team: "SL Benfica",
          games: 12,
          goals: 0
        }
      ],
      titles: [
        "Campeonato Nacional Sub 17 (2021/2022, 2021/2022, 2021/2022)",
        "Ta\xE7a de Portugal (2022/2023, 2022/2023)",
        "Campeonato Europa Sub 19 (2023/2024)"
      ]
    },
    lps20: {
      fpId: 6217,
      games: 84,
      yellow: 17,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Le\xF5es de Porto Salvo",
          games: 6,
          goals: 4
        },
        {
          s: "25",
          team: "El\xE9ctrico FC",
          games: 19,
          goals: 5
        },
        {
          s: "25",
          team: "Sporting CP",
          games: 3,
          goals: 1
        },
        {
          s: "24",
          team: "Le\xF5es de Porto Salvo B",
          games: 5,
          goals: 2
        },
        {
          s: "24",
          team: "Le\xF5es de Porto Salvo",
          games: 34,
          goals: 10
        },
        {
          s: "23",
          team: "Sporting CP",
          games: 11,
          goals: 1
        },
        {
          s: "22",
          team: "Sporting CP",
          games: 2,
          goals: 0
        },
        {
          s: "21",
          team: "Sporting CP",
          games: 4,
          goals: 0
        }
      ],
      titles: [
        "Liga Placard (2021/2022, 2021/2022, 2021/2022, 2022/2023, 2022/2023, 2023/2024, 2023/2024)",
        "Campeonato Nacional Sub 19 (2022/2023, 2022/2023, 2023/2024, 2023/2024)",
        "Ta\xE7a Nacional Sub 15 (2018/2019, 2018/2019)",
        "Campeonato Europa Sub 19 (2023/2024)"
      ]
    },
    lps16: {
      fpId: 167,
      games: 132,
      yellow: 20,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Le\xF5es de Porto Salvo",
          games: 5,
          goals: 3
        },
        {
          s: "25",
          team: "Le\xF5es de Porto Salvo",
          games: 8,
          goals: 5
        },
        {
          s: "24",
          team: "Le\xF5es de Porto Salvo",
          games: 32,
          goals: 18
        },
        {
          s: "23",
          team: "Le\xF5es de Porto Salvo",
          games: 32,
          goals: 11
        },
        {
          s: "22",
          team: "Le\xF5es de Porto Salvo",
          games: 30,
          goals: 9
        },
        {
          s: "21",
          team: "Le\xF5es de Porto Salvo",
          games: 25,
          goals: 7
        }
      ],
      titles: [
        "Liga Placard (2009/2010, 2014/2015)",
        "Ta\xE7a de Portugal (2014/2015, 2016/2017)",
        "Superta\xE7a (2015/2016, 2016/2017)",
        "2\xAA Divis\xE3o (2010/2011)"
      ]
    },
    lps19: {
      fpId: 11915,
      games: 54,
      yellow: 15,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Le\xF5es de Porto Salvo B",
          games: 1,
          goals: 0
        },
        {
          s: "26",
          team: "Le\xF5es de Porto Salvo",
          games: 3,
          goals: 0
        },
        {
          s: "25",
          team: "SC Barbarense",
          games: 24,
          goals: 14
        },
        {
          s: "24",
          team: "SC Barbarense",
          games: 26,
          goals: 3
        }
      ],
      titles: []
    },
    lps03: {
      fpId: 17965,
      games: 75,
      yellow: 5,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Le\xF5es de Porto Salvo B",
          games: 2,
          goals: 0
        },
        {
          s: "26",
          team: "Le\xF5es de Porto Salvo",
          games: 5,
          goals: 0
        },
        {
          s: "25",
          team: "Le\xF5es de Porto Salvo B",
          games: 1,
          goals: 0
        },
        {
          s: "25",
          team: "Le\xF5es de Porto Salvo",
          games: 4,
          goals: 0
        },
        {
          s: "24",
          team: "Le\xF5es de Porto Salvo B",
          games: 19,
          goals: 4
        },
        {
          s: "24",
          team: "Le\xF5es de Porto Salvo",
          games: 28,
          goals: 0
        },
        {
          s: "23",
          team: "Le\xF5es de Porto Salvo",
          games: 3,
          goals: 0
        },
        {
          s: "23",
          team: "Le\xF5es de Porto Salvo B",
          games: 6,
          goals: 0
        },
        {
          s: "22",
          team: "Le\xF5es de Porto Salvo B",
          games: 7,
          goals: 0
        }
      ],
      titles: []
    },
    lps04: {
      fpId: 21502,
      games: 120,
      yellow: 34,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Le\xF5es de Porto Salvo",
          games: 6,
          goals: 1
        },
        {
          s: "25",
          team: "Le\xF5es de Porto Salvo B",
          games: 4,
          goals: 3
        },
        {
          s: "25",
          team: "Le\xF5es de Porto Salvo",
          games: 30,
          goals: 6
        },
        {
          s: "24",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 28,
          goals: 4
        },
        {
          s: "23",
          team: "Le\xF5es de Porto Salvo",
          games: 18,
          goals: 2
        },
        {
          s: "23",
          team: "Le\xF5es de Porto Salvo B",
          games: 21,
          goals: 11
        },
        {
          s: "22",
          team: "Le\xF5es de Porto Salvo",
          games: 9,
          goals: 0
        },
        {
          s: "22",
          team: "Le\xF5es de Porto Salvo B",
          games: 4,
          goals: 2
        }
      ],
      titles: [
        "Campeonato Europa Sub 19 (2023/2024)"
      ]
    },
    lps10: {
      fpId: 17780,
      games: 5,
      yellow: 1,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Le\xF5es de Porto Salvo B",
          games: 2,
          goals: 0
        },
        {
          s: "26",
          team: "Le\xF5es de Porto Salvo",
          games: 1,
          goals: 0
        },
        {
          s: "25",
          team: "AMSAC",
          games: 2,
          goals: 0
        }
      ],
      titles: [
        "Campeonato Nacional Sub 15 (2022/2023)"
      ]
    },
    lps06: {
      fpId: 21764,
      games: 11,
      yellow: 1,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Le\xF5es de Porto Salvo B",
          games: 3,
          goals: 0
        },
        {
          s: "26",
          team: "Le\xF5es de Porto Salvo",
          games: 1,
          goals: 0
        },
        {
          s: "25",
          team: "Le\xF5es de Porto Salvo B",
          games: 7,
          goals: 0
        }
      ],
      titles: [
        "Ta\xE7a Nacional Sub 15 (2021/2022)"
      ]
    },
    lpsf18169: {
      fpId: 18169,
      games: 4,
      yellow: 0,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Le\xF5es de Porto Salvo B",
          games: 3,
          goals: 0
        },
        {
          s: "26",
          team: "Le\xF5es de Porto Salvo",
          games: 1,
          goals: 0
        }
      ],
      titles: [
        "Campeonato Nacional Sub 15 (2022/2023, 2022/2023)",
        "Campeonato Nacional Sub 19 (2025/2026)"
      ]
    },
    fun01: {
      fpId: 7900,
      games: 124,
      yellow: 13,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "AD Fund\xE3o",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "ADR Retaxo",
          games: 9,
          goals: 0
        },
        {
          s: "24",
          team: "ABC Nelas",
          games: 23,
          goals: 0
        },
        {
          s: "23",
          team: "ARB Boa Esperan\xE7a",
          games: 25,
          goals: 0
        },
        {
          s: "22",
          team: "ARB Boa Esperan\xE7a",
          games: 28,
          goals: 2
        },
        {
          s: "21",
          team: "ACD Ladoeiro",
          games: 32,
          goals: 0
        }
      ],
      titles: [
        "2\xAA Divis\xE3o (2020/2021)",
        "3\xAA Divis\xE3o (2022/2023)"
      ]
    },
    fun13: {
      fpId: 30580,
      games: 8,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "AD Fund\xE3o",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "GD Mata/AAUBI",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    fun03: {
      fpId: 27662,
      games: 45,
      yellow: 6,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "AD Fund\xE3o",
          games: 6,
          goals: 1
        },
        {
          s: "25",
          team: "AD Fund\xE3o",
          games: 25,
          goals: 4
        },
        {
          s: "24",
          team: "AD Fund\xE3o",
          games: 14,
          goals: 2
        }
      ],
      titles: []
    },
    fun14: {
      fpId: 26055,
      games: 49,
      yellow: 16,
      red: 3,
      seasons: [
        {
          s: "26",
          team: "AD Fund\xE3o",
          games: 7,
          goals: 1
        },
        {
          s: "25",
          team: "Le\xF5es de Porto Salvo",
          games: 23,
          goals: 3
        },
        {
          s: "24",
          team: "SC Lusit\xE2nia",
          games: 19,
          goals: 15
        }
      ],
      titles: []
    },
    fun10: {
      fpId: 17915,
      games: 53,
      yellow: 12,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "AD Fund\xE3o",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "ADCR Caxinas",
          games: 6,
          goals: 1
        },
        {
          s: "25",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 15,
          goals: 2
        },
        {
          s: "24",
          team: "AMSAC",
          games: 25,
          goals: 15
        }
      ],
      titles: []
    },
    funf17961: {
      fpId: 17961,
      games: 9,
      yellow: 2,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "AD Fund\xE3o",
          games: 7,
          goals: 1
        },
        {
          s: "25",
          team: "Sporting CP",
          games: 2,
          goals: 0
        }
      ],
      titles: [
        "Campeonato Nacional Sub 19 (2024/2025)"
      ]
    },
    fun11: {
      fpId: 166,
      games: 147,
      yellow: 17,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "AD Fund\xE3o",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "AD Fund\xE3o",
          games: 27,
          goals: 8
        },
        {
          s: "24",
          team: "AD Fund\xE3o",
          games: 27,
          goals: 4
        },
        {
          s: "23",
          team: "AD Fund\xE3o",
          games: 25,
          goals: 1
        },
        {
          s: "22",
          team: "AD Fund\xE3o",
          games: 27,
          goals: 10
        },
        {
          s: "21",
          team: "AD Fund\xE3o",
          games: 34,
          goals: 15
        }
      ],
      titles: [
        "Ta\xE7a de Portugal (2010/2011, 2013/2014, 2016/2017)",
        "Liga Placard (2010/2011)",
        "Superta\xE7a (2015/2016)",
        "Final\xEDssima (2022/2023)"
      ]
    },
    fun02: {
      fpId: 27927,
      games: 28,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "AD Fund\xE3o",
          games: 5,
          goals: 0
        },
        {
          s: "25",
          team: "AD Fund\xE3o",
          games: 23,
          goals: 0
        }
      ],
      titles: []
    },
    fun12: {
      fpId: 1545,
      games: 106,
      yellow: 18,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "AD Fund\xE3o",
          games: 7,
          goals: 2
        },
        {
          s: "23",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 37,
          goals: 3
        },
        {
          s: "22",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 32,
          goals: 5
        },
        {
          s: "21",
          team: "AD Fund\xE3o",
          games: 30,
          goals: 16
        }
      ],
      titles: [
        "Copa de Espa\xF1a Feminino (2022/2023)"
      ]
    },
    fun08: {
      fpId: 6561,
      games: 107,
      yellow: 22,
      red: 4,
      seasons: [
        {
          s: "26",
          team: "AD Fund\xE3o",
          games: 7,
          goals: 1
        },
        {
          s: "25",
          team: "SCU Torreense",
          games: 9,
          goals: 4
        },
        {
          s: "24",
          team: "SCU Torreense",
          games: 22,
          goals: 9
        },
        {
          s: "23",
          team: "SCU Torreense",
          games: 27,
          goals: 10
        },
        {
          s: "22",
          team: "Levante UD",
          games: 15,
          goals: 1
        },
        {
          s: "21",
          team: "Portimonense SC",
          games: 27,
          goals: 17
        }
      ],
      titles: []
    },
    fun06: {
      fpId: 4556,
      games: 112,
      yellow: 30,
      red: 4,
      seasons: [
        {
          s: "26",
          team: "AD Fund\xE3o",
          games: 7,
          goals: 8
        },
        {
          s: "25",
          team: "SL Benfica",
          games: 21,
          goals: 7
        },
        {
          s: "24",
          team: "AD Fund\xE3o",
          games: 26,
          goals: 17
        },
        {
          s: "22",
          team: "Levante UD",
          games: 27,
          goals: 5
        },
        {
          s: "21",
          team: "AD Fund\xE3o",
          games: 31,
          goals: 9
        }
      ],
      titles: [
        "Liga Placard (2025/2026)",
        "Ta\xE7a de Portugal (2025/2026)"
      ]
    },
    fun09: {
      fpId: 17956,
      games: 55,
      yellow: 10,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "AD Fund\xE3o",
          games: 7,
          goals: 3
        },
        {
          s: "25",
          team: "El\xE9ctrico FC",
          games: 23,
          goals: 8
        },
        {
          s: "24",
          team: "Sporting CP",
          games: 20,
          goals: 1
        },
        {
          s: "23",
          team: "Sporting CP",
          games: 5,
          goals: 1
        }
      ],
      titles: [
        "Campeonato Nacional Sub 19 (2023/2024, 2023/2024, 2024/2025, 2024/2025)",
        "Liga Placard (2023/2024, 2023/2024)",
        "Ta\xE7a de Portugal (2024/2025, 2024/2025)",
        "Ta\xE7a da Liga (2024/2025, 2024/2025)",
        "Campeonato Europa Sub 19 (2025/2026)"
      ]
    },
    fun15: {
      fpId: 7891,
      games: 154,
      yellow: 45,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "AD Fund\xE3o",
          games: 7,
          goals: 1
        },
        {
          s: "25",
          team: "AD Fund\xE3o",
          games: 25,
          goals: 5
        },
        {
          s: "24",
          team: "SC Lusit\xE2nia",
          games: 9,
          goals: 2
        },
        {
          s: "24",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 11,
          goals: 3
        },
        {
          s: "23",
          team: "Le\xF5es de Porto Salvo B",
          games: 23,
          goals: 26
        },
        {
          s: "23",
          team: "Le\xF5es de Porto Salvo",
          games: 22,
          goals: 3
        },
        {
          s: "22",
          team: "Le\xF5es de Porto Salvo",
          games: 22,
          goals: 0
        },
        {
          s: "22",
          team: "Le\xF5es de Porto Salvo B",
          games: 19,
          goals: 31
        },
        {
          s: "21",
          team: "Le\xF5es de Porto Salvo B",
          games: 16,
          goals: 2
        }
      ],
      titles: []
    },
    fun04: {
      fpId: 541,
      games: 119,
      yellow: 30,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "AD Fund\xE3o",
          games: 6,
          goals: 2
        },
        {
          s: "25",
          team: "AD Fund\xE3o",
          games: 21,
          goals: 5
        },
        {
          s: "24",
          team: "AD Fund\xE3o",
          games: 20,
          goals: 5
        },
        {
          s: "23",
          team: "AD Fund\xE3o",
          games: 22,
          goals: 10
        },
        {
          s: "22",
          team: "AD Fund\xE3o",
          games: 24,
          goals: 8
        },
        {
          s: "21",
          team: "AD M\xF3dicus",
          games: 26,
          goals: 9
        }
      ],
      titles: []
    },
    tor03: {
      fpId: 27137,
      games: 2,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "SCU Torreense",
          games: 2,
          goals: 0
        }
      ],
      titles: []
    },
    tor14: {
      fpId: 12088,
      games: 27,
      yellow: 2,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "SCU Torreense",
          games: 3,
          goals: 0
        },
        {
          s: "25",
          team: "CRC Quinta dos Lombos",
          games: 24,
          goals: 7
        }
      ],
      titles: [
        "Campeonato Nacional Sub 19 (2023/2024, 2024/2025)"
      ]
    },
    tor16: {
      fpId: 1558,
      games: 90,
      yellow: 29,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "SCU Torreense",
          games: 4,
          goals: 0
        },
        {
          s: "24",
          team: "ADCR Caxinas",
          games: 23,
          goals: 6
        },
        {
          s: "23",
          team: "CF Belenenses",
          games: 21,
          goals: 5
        },
        {
          s: "22",
          team: "CF Belenenses",
          games: 23,
          goals: 8
        },
        {
          s: "21",
          team: "Reguilas de Tires",
          games: 19,
          goals: 11
        }
      ],
      titles: []
    },
    tor02: {
      fpId: 24183,
      games: 30,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "SCU Torreense",
          games: 5,
          goals: 0
        },
        {
          s: "25",
          team: "AMSAC",
          games: 23,
          goals: 1
        },
        {
          s: "24",
          team: "Sporting CP",
          games: 2,
          goals: 0
        }
      ],
      titles: [
        "Campeonato Nacional Sub 19 (2024/2025, 2024/2025)",
        "Campeonato Europa Sub 19 (2025/2026)"
      ]
    },
    tor13: {
      fpId: 51926,
      games: 14,
      yellow: 4,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "SCU Torreense",
          games: 4,
          goals: 0
        },
        {
          s: "25",
          team: "Santo Andr\xE9",
          games: 10,
          goals: 0
        }
      ],
      titles: []
    },
    tor10: {
      fpId: 6954,
      games: 101,
      yellow: 22,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "SCU Torreense",
          games: 5,
          goals: 0
        },
        {
          s: "25",
          team: "UP Venda Nova",
          games: 22,
          goals: 2
        },
        {
          s: "24",
          team: "UP Venda Nova",
          games: 28,
          goals: 10
        },
        {
          s: "23",
          team: "Le\xF5es de Porto Salvo",
          games: 12,
          goals: 2
        },
        {
          s: "22",
          team: "SC Lusit\xE2nia",
          games: 34,
          goals: 17
        }
      ],
      titles: [
        "Liga Placard (2014/2015)",
        "Campeonato Nacional Sub 19 (2016/2017)"
      ]
    },
    tor05: {
      fpId: 26051,
      games: 44,
      yellow: 6,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "SCU Torreense",
          games: 5,
          goals: 0
        },
        {
          s: "25",
          team: "UP Venda Nova",
          games: 11,
          goals: 3
        },
        {
          s: "25",
          team: "ADCR Caxinas",
          games: 12,
          goals: 0
        },
        {
          s: "24",
          team: "SC Lusit\xE2nia",
          games: 16,
          goals: 2
        }
      ],
      titles: []
    },
    tor18: {
      fpId: 27899,
      games: 40,
      yellow: 15,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "SCU Torreense",
          games: 5,
          goals: 5
        },
        {
          s: "25",
          team: "Praia Clube",
          games: 9,
          goals: 1
        },
        {
          s: "25",
          team: "SCU Torreense",
          games: 26,
          goals: 14
        }
      ],
      titles: []
    },
    tor17: {
      fpId: 26239,
      games: 18,
      yellow: 2,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "SCU Torreense",
          games: 5,
          goals: 0
        },
        {
          s: "25",
          team: "SCU Torreense",
          games: 11,
          goals: 0
        },
        {
          s: "24",
          team: "ADCR Caxinas",
          games: 2,
          goals: 0
        }
      ],
      titles: []
    },
    tor07: {
      fpId: 5602,
      games: 148,
      yellow: 42,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "SCU Torreense",
          games: 5,
          goals: 0
        },
        {
          s: "25",
          team: "SCU Torreense",
          games: 27,
          goals: 6
        },
        {
          s: "24",
          team: "SCU Torreense",
          games: 24,
          goals: 7
        },
        {
          s: "23",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 28,
          goals: 14
        },
        {
          s: "22",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 27,
          goals: 19
        },
        {
          s: "21",
          team: "CS Mar\xEDtimo",
          games: 37,
          goals: 23
        }
      ],
      titles: []
    },
    tor11: {
      fpId: 6527,
      games: 137,
      yellow: 26,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "SCU Torreense",
          games: 5,
          goals: 1
        },
        {
          s: "25",
          team: "SCU Torreense",
          games: 26,
          goals: 7
        },
        {
          s: "24",
          team: "Portimonense SC",
          games: 25,
          goals: 13
        },
        {
          s: "23",
          team: "Portimonense SC",
          games: 21,
          goals: 21
        },
        {
          s: "22",
          team: "SCU Torreense",
          games: 29,
          goals: 12
        },
        {
          s: "21",
          team: "AMSAC",
          games: 31,
          goals: 14
        }
      ],
      titles: [
        "2\xAA Divis\xE3o (2022/2023)"
      ]
    },
    tor01: {
      fpId: 17145,
      games: 107,
      yellow: 5,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "SCU Torreense",
          games: 5,
          goals: 0
        },
        {
          s: "25",
          team: "SC Barbarense",
          games: 26,
          goals: 0
        },
        {
          s: "24",
          team: "SCU Torreense",
          games: 23,
          goals: 0
        },
        {
          s: "23",
          team: "Vit\xF3ria FC",
          games: 26,
          goals: 1
        },
        {
          s: "22",
          team: "Vit\xF3ria FC",
          games: 27,
          goals: 0
        }
      ],
      titles: []
    },
    tor04: {
      fpId: 10390,
      games: 65,
      yellow: 7,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "SCU Torreense",
          games: 5,
          goals: 1
        },
        {
          s: "25",
          team: "SCU Torreense",
          games: 17,
          goals: 7
        },
        {
          s: "25",
          team: "El\xE9ctrico FC",
          games: 3,
          goals: 0
        },
        {
          s: "24",
          team: "SL Benfica",
          games: 38,
          goals: 4
        },
        {
          s: "23",
          team: "SL Benfica",
          games: 2,
          goals: 0
        }
      ],
      titles: [
        "Campeonato Nacional Sub 17 (2021/2022, 2021/2022)",
        "Liga Placard (2024/2025)"
      ]
    },
    tor08: {
      fpId: 11959,
      games: 16,
      yellow: 1,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "SCU Torreense",
          games: 2,
          goals: 0
        },
        {
          s: "25",
          team: "SCU Torreense",
          games: 9,
          goals: 0
        },
        {
          s: "24",
          team: "Sporting CP",
          games: 5,
          goals: 0
        }
      ],
      titles: [
        "Campeonato Nacional Sub 19 (2023/2024, 2024/2025, 2024/2025)"
      ]
    },
    tor09: {
      fpId: 27577,
      games: 34,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "SCU Torreense",
          games: 5,
          goals: 0
        },
        {
          s: "25",
          team: "SCU Torreense",
          games: 24,
          goals: 0
        },
        {
          s: "24",
          team: "SCU Torreense",
          games: 5,
          goals: 0
        }
      ],
      titles: []
    },
    tor12: {
      fpId: 51925,
      games: 23,
      yellow: 5,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "SCU Torreense",
          games: 5,
          goals: 0
        },
        {
          s: "25",
          team: "Esporte Futuro",
          games: 18,
          goals: 1
        }
      ],
      titles: []
    },
    fzz08: {
      fpId: 17728,
      games: 8,
      yellow: 1,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "SL Benfica",
          games: 2,
          goals: 1
        }
      ],
      titles: [
        "Campeonato Nacional Sub 17 (2021/2022, 2021/2022, 2022/2023, 2023/2024)",
        "Campeonato Nacional Sub 15 (2021/2022, 2021/2022)",
        "Campeonato Nacional Sub 19 (2025/2026, 2025/2026)",
        "Ta\xE7a de Portugal (2025/2026, 2025/2026)",
        "Campeonato Europa Sub 19 (2025/2026)"
      ]
    },
    fzz05: {
      fpId: 15902,
      games: 35,
      yellow: 10,
      red: 3,
      seasons: [
        {
          s: "26",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 4,
          goals: 0
        },
        {
          s: "25",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 24,
          goals: 3
        },
        {
          s: "21",
          team: "Minas",
          games: 7,
          goals: 0
        }
      ],
      titles: []
    },
    fzz12: {
      fpId: 110,
      games: 141,
      yellow: 24,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "CRC Quinta dos Lombos",
          games: 16,
          goals: 2
        },
        {
          s: "24",
          team: "CRC Quinta dos Lombos",
          games: 32,
          goals: 12
        },
        {
          s: "23",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 28,
          goals: 14
        },
        {
          s: "22",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 25,
          goals: 5
        },
        {
          s: "21",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 34,
          goals: 8
        }
      ],
      titles: [
        "Ta\xE7a Nacional Sub 19 (2017/2018, 2017/2018)"
      ]
    },
    fzz04: {
      fpId: 16237,
      games: 112,
      yellow: 33,
      red: 3,
      seasons: [
        {
          s: "26",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 6,
          goals: 2
        },
        {
          s: "25",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 27,
          goals: 10
        },
        {
          s: "24",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 26,
          goals: 11
        },
        {
          s: "22",
          team: "Le\xF5es de Porto Salvo",
          games: 29,
          goals: 6
        },
        {
          s: "21",
          team: "SCU Torreense",
          games: 24,
          goals: 9
        }
      ],
      titles: []
    },
    fzz03: {
      fpId: 23587,
      games: 93,
      yellow: 4,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "CS S\xE3o Jo\xE3o",
          games: 25,
          goals: 2
        },
        {
          s: "24",
          team: "CS S\xE3o Jo\xE3o",
          games: 28,
          goals: 3
        },
        {
          s: "23",
          team: "CS S\xE3o Jo\xE3o",
          games: 26,
          goals: 5
        },
        {
          s: "22",
          team: "CS S\xE3o Jo\xE3o",
          games: 8,
          goals: 1
        }
      ],
      titles: []
    },
    fzzf44261: {
      fpId: 44261,
      games: 1,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "25",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    fzz07: {
      fpId: 44410,
      games: 6,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 6,
          goals: 0
        }
      ],
      titles: []
    },
    fzzf48889: {
      fpId: 48889,
      games: 0,
      yellow: 0,
      red: 0,
      seasons: [],
      titles: []
    },
    fzzf2182: {
      fpId: 2182,
      games: 34,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "CB Goleg\xE3",
          games: 1,
          goals: 0
        },
        {
          s: "24",
          team: "CB Goleg\xE3",
          games: 24,
          goals: 0
        },
        {
          s: "22",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 9,
          goals: 0
        }
      ],
      titles: []
    },
    fzz11: {
      fpId: 10389,
      games: 51,
      yellow: 5,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "UP Venda Nova",
          games: 21,
          goals: 7
        },
        {
          s: "24",
          team: "SC Lusit\xE2nia",
          games: 24,
          goals: 1
        }
      ],
      titles: [
        "Campeonato Nacional Sub 17 (2021/2022, 2021/2022)"
      ]
    },
    fzz06: {
      fpId: 27893,
      games: 31,
      yellow: 11,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 2,
          goals: 0
        },
        {
          s: "25",
          team: "Joa\xE7aba Futsal",
          games: 10,
          goals: 5
        },
        {
          s: "25",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 19,
          goals: 5
        }
      ],
      titles: []
    },
    fzz02: {
      fpId: 1303,
      games: 143,
      yellow: 12,
      red: 3,
      seasons: [
        {
          s: "25",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 29,
          goals: 1
        },
        {
          s: "24",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 16,
          goals: 0
        },
        {
          s: "24",
          team: "SC Lusit\xE2nia",
          games: 11,
          goals: 0
        },
        {
          s: "23",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 29,
          goals: 4
        },
        {
          s: "22",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 27,
          goals: 0
        },
        {
          s: "21",
          team: "ABC Nelas",
          games: 31,
          goals: 3
        }
      ],
      titles: [
        "2\xAA Divis\xE3o (2017/2018)"
      ]
    },
    fzzf48784: {
      fpId: 48784,
      games: 0,
      yellow: 0,
      red: 0,
      seasons: [],
      titles: []
    },
    fzz13: {
      fpId: 14184,
      games: 143,
      yellow: 19,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 6,
          goals: 3
        },
        {
          s: "25",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 30,
          goals: 6
        },
        {
          s: "24",
          team: "CCRD Burinhosa",
          games: 28,
          goals: 33
        },
        {
          s: "23",
          team: "CCRD Burinhosa",
          games: 27,
          goals: 30
        },
        {
          s: "22",
          team: "CCRD Burinhosa",
          games: 18,
          goals: 11
        },
        {
          s: "22",
          team: "FC Monfortense",
          games: 13,
          goals: 0
        },
        {
          s: "21",
          team: "Le\xF5es de Porto Salvo",
          games: 2,
          goals: 0
        },
        {
          s: "21",
          team: "Le\xF5es de Porto Salvo B",
          games: 19,
          goals: 10
        }
      ],
      titles: []
    },
    fzz01: {
      fpId: 4504,
      games: 145,
      yellow: 10,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 30,
          goals: 0
        },
        {
          s: "24",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 29,
          goals: 0
        },
        {
          s: "23",
          team: "Le\xF5es de Porto Salvo",
          games: 19,
          goals: 0
        },
        {
          s: "22",
          team: "Le\xF5es de Porto Salvo",
          games: 31,
          goals: 0
        },
        {
          s: "21",
          team: "Le\xF5es de Porto Salvo B",
          games: 3,
          goals: 0
        },
        {
          s: "21",
          team: "Le\xF5es de Porto Salvo",
          games: 27,
          goals: 0
        }
      ],
      titles: [
        "Campeonato Nacional Sub 19 (2017/2018, 2017/2018, 2017/2018)"
      ]
    },
    fzzf2282: {
      fpId: 2282,
      games: 137,
      yellow: 16,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 6,
          goals: 1
        },
        {
          s: "25",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 30,
          goals: 6
        },
        {
          s: "24",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 28,
          goals: 6
        },
        {
          s: "23",
          team: "SC Barbarense",
          games: 28,
          goals: 14
        },
        {
          s: "22",
          team: "SC Barbarense",
          games: 14,
          goals: 8
        },
        {
          s: "22",
          team: "CRC Quinta dos Lombos",
          games: 5,
          goals: 0
        },
        {
          s: "21",
          team: "CRC Quinta dos Lombos",
          games: 26,
          goals: 2
        }
      ],
      titles: [
        "Ta\xE7a Nacional Sub 17 (2015/2016)"
      ]
    },
    fzzf17968: {
      fpId: 17968,
      games: 42,
      yellow: 9,
      red: 1,
      seasons: [
        {
          s: "25",
          team: "Reguilas de Tires",
          games: 8,
          goals: 4
        },
        {
          s: "24",
          team: "Le\xF5es de Porto Salvo B",
          games: 21,
          goals: 9
        },
        {
          s: "23",
          team: "Le\xF5es de Porto Salvo B",
          games: 4,
          goals: 1
        },
        {
          s: "22",
          team: "Le\xF5es de Porto Salvo",
          games: 1,
          goals: 0
        },
        {
          s: "22",
          team: "Le\xF5es de Porto Salvo B",
          games: 8,
          goals: 2
        }
      ],
      titles: []
    },
    fzz15: {
      fpId: 1580,
      games: 145,
      yellow: 40,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 6,
          goals: 4
        },
        {
          s: "25",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 27,
          goals: 16
        },
        {
          s: "24",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 27,
          goals: 8
        },
        {
          s: "23",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 28,
          goals: 7
        },
        {
          s: "22",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 25,
          goals: 8
        },
        {
          s: "21",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 32,
          goals: 23
        }
      ],
      titles: []
    },
    fzz14: {
      fpId: 2517,
      games: 126,
      yellow: 23,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 6,
          goals: 1
        },
        {
          s: "25",
          team: "UP Venda Nova",
          games: 24,
          goals: 10
        },
        {
          s: "24",
          team: "SC Lusit\xE2nia",
          games: 21,
          goals: 6
        },
        {
          s: "23",
          team: "AMSAC",
          games: 29,
          goals: 25
        },
        {
          s: "22",
          team: "AMSAC",
          games: 27,
          goals: 10
        },
        {
          s: "21",
          team: "Le\xF5es de Porto Salvo B",
          games: 19,
          goals: 16
        }
      ],
      titles: []
    },
    fzz10: {
      fpId: 708,
      games: 91,
      yellow: 33,
      red: 3,
      seasons: [
        {
          s: "26",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 6,
          goals: 2
        },
        {
          s: "23",
          team: "Le\xF5es de Porto Salvo",
          games: 31,
          goals: 6
        },
        {
          s: "22",
          team: "Le\xF5es de Porto Salvo",
          games: 30,
          goals: 15
        },
        {
          s: "21",
          team: "Portimonense SC",
          games: 24,
          goals: 10
        }
      ],
      titles: []
    },
    scbf27054: {
      fpId: 27054,
      games: 19,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "SC Braga",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "SC Braga",
          games: 12,
          goals: 0
        },
        {
          s: "23",
          team: "SC Braga",
          games: 1,
          goals: 0
        }
      ],
      titles: [
        "Ta\xE7a Nacional Sub 17 (2023/2024, 2023/2024, 2023/2024)",
        "Campeonato Nacional Sub 19 - 2\xAA DIVIS\xC3O (2023/2024, 2023/2024, 2023/2024)"
      ]
    },
    scb13: {
      fpId: 4975,
      games: 123,
      yellow: 22,
      red: 3,
      seasons: [
        {
          s: "26",
          team: "SC Braga",
          games: 6,
          goals: 4
        },
        {
          s: "25",
          team: "Riga FC",
          games: 7,
          goals: 4
        },
        {
          s: "25",
          team: "Argentina",
          games: 6,
          goals: 0
        },
        {
          s: "24",
          team: "Riga FC",
          games: 5,
          goals: 2
        },
        {
          s: "24",
          team: "Argentina",
          games: 7,
          goals: 3
        },
        {
          s: "23",
          team: "Ribera Navarra FS",
          games: 24,
          goals: 9
        },
        {
          s: "22",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 32,
          goals: 8
        },
        {
          s: "22",
          team: "Argentina",
          games: 4,
          goals: 0
        },
        {
          s: "21",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 26,
          goals: 10
        },
        {
          s: "21",
          team: "Argentina",
          games: 6,
          goals: 5
        }
      ],
      titles: []
    },
    scb18: {
      fpId: 27639,
      games: 48,
      yellow: 14,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "SC Braga",
          games: 6,
          goals: 1
        },
        {
          s: "25",
          team: "SC Braga",
          games: 12,
          goals: 4
        },
        {
          s: "25",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 15,
          goals: 6
        },
        {
          s: "24",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 15,
          goals: 5
        }
      ],
      titles: []
    },
    scb14: {
      fpId: 10670,
      games: 77,
      yellow: 15,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "SC Braga",
          games: 6,
          goals: 3
        },
        {
          s: "25",
          team: "Riga FC",
          games: 6,
          goals: 3
        },
        {
          s: "24",
          team: "Riga FC",
          games: 5,
          goals: 2
        },
        {
          s: "22",
          team: "El\xE9ctrico FC",
          games: 26,
          goals: 11
        },
        {
          s: "21",
          team: "El\xE9ctrico FC",
          games: 34,
          goals: 15
        }
      ],
      titles: []
    },
    scb06: {
      fpId: 8200,
      games: 142,
      yellow: 40,
      red: 4,
      seasons: [
        {
          s: "26",
          team: "SC Braga",
          games: 5,
          goals: 3
        },
        {
          s: "25",
          team: "Rio Ave FC",
          games: 25,
          goals: 9
        },
        {
          s: "24",
          team: "Le\xF5es de Porto Salvo",
          games: 32,
          goals: 7
        },
        {
          s: "23",
          team: "Le\xF5es de Porto Salvo",
          games: 27,
          goals: 5
        },
        {
          s: "22",
          team: "El\xE9ctrico FC",
          games: 21,
          goals: 3
        },
        {
          s: "21",
          team: "El\xE9ctrico FC",
          games: 32,
          goals: 9
        }
      ],
      titles: []
    },
    scb01: {
      fpId: 51913,
      games: 10,
      yellow: 1,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "SC Braga",
          games: 2,
          goals: 0
        },
        {
          s: "25",
          team: "Royal Sporting Anderlecht Futsal",
          games: 2,
          goals: 0
        },
        {
          s: "24",
          team: "Royal Sporting Anderlecht Futsal",
          games: 6,
          goals: 0
        }
      ],
      titles: []
    },
    scb03: {
      fpId: 25734,
      games: 13,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "SC Braga",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "SC Braga",
          games: 2,
          goals: 0
        },
        {
          s: "24",
          team: "SC Braga",
          games: 1,
          goals: 0
        },
        {
          s: "23",
          team: "SC Braga",
          games: 4,
          goals: 0
        }
      ],
      titles: [
        "Ta\xE7a Nacional Sub 17 (2023/2024, 2023/2024)"
      ]
    },
    scbf1683: {
      fpId: 1683,
      games: 138,
      yellow: 23,
      red: 2,
      seasons: [
        {
          s: "25",
          team: "Kairat Almaty",
          games: 2,
          goals: 1
        },
        {
          s: "25",
          team: "SC Braga",
          games: 8,
          goals: 6
        },
        {
          s: "24",
          team: "SC Braga",
          games: 26,
          goals: 10
        },
        {
          s: "23",
          team: "Sporting CP",
          games: 34,
          goals: 21
        },
        {
          s: "22",
          team: "Sporting CP",
          games: 34,
          goals: 19
        },
        {
          s: "21",
          team: "El\xE9ctrico FC",
          games: 34,
          goals: 15
        }
      ],
      titles: [
        "Liga Placard (2020/2021, 2022/2023, 2023/2024)",
        "Ta\xE7a de Portugal (2019/2020, 2019/2020)",
        "Ta\xE7a da Liga (2020/2021, 2023/2024)",
        "Superta\xE7a (2022/2023, 2024/2025)",
        "Ta\xE7a Nacional Sub 17 (2015/2016)",
        "Campeonato Nacional Sub 17 (2016/2017)",
        "Campeonato Nacional Sub 19 (2018/2019)",
        "Final\xEDssima (2022/2023)"
      ]
    },
    scb02: {
      fpId: 51914,
      games: 4,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "SC Braga",
          games: 4,
          goals: 0
        }
      ],
      titles: []
    },
    scb17: {
      fpId: 6216,
      games: 64,
      yellow: 14,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "SC Braga",
          games: 6,
          goals: 1
        },
        {
          s: "25",
          team: "SC Braga",
          games: 30,
          goals: 10
        },
        {
          s: "24",
          team: "AD Fund\xE3o",
          games: 26,
          goals: 11
        },
        {
          s: "23",
          team: "Sporting CP",
          games: 2,
          goals: 0
        }
      ],
      titles: [
        "Campeonato Nacional Sub 19 (2022/2023, 2023/2024, 2023/2024)",
        "Liga Placard (2023/2024, 2023/2024)",
        "Ta\xE7a Nacional Sub 15 (2018/2019)"
      ]
    },
    scb11: {
      fpId: 17,
      games: 160,
      yellow: 34,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "SC Braga",
          games: 6,
          goals: 2
        },
        {
          s: "25",
          team: "SC Braga",
          games: 30,
          goals: 9
        },
        {
          s: "24",
          team: "Le\xF5es de Porto Salvo",
          games: 34,
          goals: 19
        },
        {
          s: "23",
          team: "Le\xF5es de Porto Salvo",
          games: 33,
          goals: 18
        },
        {
          s: "22",
          team: "Le\xF5es de Porto Salvo",
          games: 30,
          goals: 7
        },
        {
          s: "21",
          team: "Viseu 2001 B",
          games: 1,
          goals: 1
        },
        {
          s: "21",
          team: "Viseu 2001",
          games: 26,
          goals: 20
        }
      ],
      titles: [
        "Liga Placard (2016/2017, 2016/2017, 2020/2021)",
        "Campeonato Nacional Sub 19 (2015/2016)",
        "Ta\xE7a da Liga (2020/2021)",
        "UEFA Futsal Champions League (2020/2021)"
      ]
    },
    scb05: {
      fpId: 6821,
      games: 156,
      yellow: 56,
      red: 3,
      seasons: [
        {
          s: "26",
          team: "SC Braga",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "SC Braga",
          games: 29,
          goals: 3
        },
        {
          s: "24",
          team: "SC Braga",
          games: 29,
          goals: 6
        },
        {
          s: "23",
          team: "SC Braga",
          games: 34,
          goals: 4
        },
        {
          s: "22",
          team: "SC Braga",
          games: 29,
          goals: 5
        },
        {
          s: "21",
          team: "SC Braga",
          games: 29,
          goals: 5
        }
      ],
      titles: [
        "Ta\xE7a Nacional Sub 19 (2018/2019, 2018/2019)",
        "Ta\xE7a Nacional Sub 17 (2016/2017)",
        "Ta\xE7a de Portugal (2023/2024)",
        "Superta\xE7a (2024/2025)"
      ]
    },
    scb07: {
      fpId: 5007,
      games: 114,
      yellow: 22,
      red: 4,
      seasons: [
        {
          s: "25",
          team: "ADCR Caxinas",
          games: 23,
          goals: 6
        },
        {
          s: "24",
          team: "ADCR Caxinas",
          games: 24,
          goals: 3
        },
        {
          s: "23",
          team: "ADCR Caxinas",
          games: 25,
          goals: 1
        },
        {
          s: "22",
          team: "ADCR Caxinas",
          games: 16,
          goals: 0
        },
        {
          s: "21",
          team: "ADCR Caxinas",
          games: 26,
          goals: 4
        }
      ],
      titles: [
        "Campeonato Nacional Sub 19 (2021/2022, 2021/2022)",
        "2\xAA Divis\xE3o (2021/2022, 2021/2022)",
        "Campeonato Europa Sub 19 (2023/2024)"
      ]
    },
    scb12: {
      fpId: 26246,
      games: 65,
      yellow: 8,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "SC Braga",
          games: 5,
          goals: 0
        },
        {
          s: "25",
          team: "SC Braga",
          games: 29,
          goals: 1
        },
        {
          s: "24",
          team: "SC Braga",
          games: 7,
          goals: 0
        },
        {
          s: "23",
          team: "GCR Nun\u2019\xC1lvares",
          games: 24,
          goals: 2
        }
      ],
      titles: []
    },
    scb09: {
      fpId: 311,
      games: 157,
      yellow: 29,
      red: 6,
      seasons: [
        {
          s: "26",
          team: "SC Braga",
          games: 6,
          goals: 5
        },
        {
          s: "25",
          team: "SC Braga",
          games: 24,
          goals: 4
        },
        {
          s: "24",
          team: "SC Braga",
          games: 33,
          goals: 22
        },
        {
          s: "23",
          team: "SC Braga",
          games: 37,
          goals: 21
        },
        {
          s: "22",
          team: "SC Braga",
          games: 26,
          goals: 12
        },
        {
          s: "21",
          team: "SC Braga",
          games: 31,
          goals: 16
        }
      ],
      titles: [
        "Ta\xE7a da Liga (2017/2018, 2018/2019, 2019/2020)",
        "Campeonato da Europa (2017/2018, 2021/2022)",
        "Liga Placard (2018/2019)",
        "Campeonato do Mundo (2021/2022)",
        "Ta\xE7a de Portugal (2023/2024)",
        "Superta\xE7a (2024/2025)"
      ]
    },
    scb04: {
      fpId: 556,
      games: 167,
      yellow: 28,
      red: 4,
      seasons: [
        {
          s: "26",
          team: "SC Braga",
          games: 6,
          goals: 1
        },
        {
          s: "25",
          team: "SC Braga",
          games: 30,
          goals: 7
        },
        {
          s: "24",
          team: "SC Braga",
          games: 34,
          goals: 15
        },
        {
          s: "23",
          team: "SC Braga",
          games: 38,
          goals: 11
        },
        {
          s: "22",
          team: "SC Braga",
          games: 31,
          goals: 6
        },
        {
          s: "21",
          team: "Futsal Cube Azem\xE9is",
          games: 28,
          goals: 10
        }
      ],
      titles: [
        "Ta\xE7a de Portugal (2023/2024, 2023/2024)",
        "Superta\xE7a (2024/2025)"
      ]
    },
    scb10: {
      fpId: 6223,
      games: 100,
      yellow: 13,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "SC Braga",
          games: 2,
          goals: 0
        },
        {
          s: "25",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 14,
          goals: 3
        },
        {
          s: "25",
          team: "ADCR Caxinas",
          games: 14,
          goals: 0
        },
        {
          s: "24",
          team: "ADCR Caxinas",
          games: 25,
          goals: 2
        },
        {
          s: "23",
          team: "CRC Quinta dos Lombos",
          games: 22,
          goals: 6
        },
        {
          s: "22",
          team: "SL Benfica",
          games: 9,
          goals: 0
        },
        {
          s: "22",
          team: "AD Fund\xE3o",
          games: 13,
          goals: 1
        },
        {
          s: "21",
          team: "SL Benfica",
          games: 1,
          goals: 0
        }
      ],
      titles: [
        "Ta\xE7a Nacional Sub 15 (2017/2018)",
        "Campeonato Europa Sub 19 (2023/2024)"
      ]
    },
    scb16: {
      fpId: 829,
      games: 132,
      yellow: 47,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "SC Braga",
          games: 6,
          goals: 1
        },
        {
          s: "25",
          team: "SC Braga",
          games: 19,
          goals: 8
        },
        {
          s: "24",
          team: "CRC Quinta dos Lombos",
          games: 27,
          goals: 26
        },
        {
          s: "23",
          team: "CRC Quinta dos Lombos",
          games: 22,
          goals: 20
        },
        {
          s: "22",
          team: "CRC Quinta dos Lombos",
          games: 26,
          goals: 16
        },
        {
          s: "21",
          team: "CRC Quinta dos Lombos",
          games: 32,
          goals: 22
        }
      ],
      titles: []
    }
  }
};

// src/core/attributes.ts
var ATTR_GROUPS = {
  tecnicos: {
    label: "T\xE9cnicos",
    attrs: {
      passe: "Passe",
      rececao: "Rece\xE7\xE3o (sola)",
      drible: "Drible / finta curta",
      finalizacao: "Finaliza\xE7\xE3o",
      remate: "Remate de meia dist\xE2ncia",
      jogoCostas: "Jogo de costas",
      desarme: "Desarme",
      bolasParadas: "Bolas paradas"
    }
  },
  mentais: {
    label: "Mentais",
    attrs: {
      visao: "Vis\xE3o de jogo",
      decisoes: "Decis\xF5es",
      posicionamento: "Posicionamento",
      antecipacao: "Antecipa\xE7\xE3o",
      concentracao: "Concentra\xE7\xE3o",
      compostura: "Compostura",
      trabalhoEquipa: "Trabalho de equipa",
      agressividade: "Agressividade",
      lideranca: "Lideran\xE7a"
    }
  },
  fisicos: {
    label: "F\xEDsicos",
    attrs: {
      aceleracao: "Acelera\xE7\xE3o",
      agilidade: "Agilidade",
      resistencia: "Resist\xEAncia",
      forca: "For\xE7a",
      equilibrio: "Equil\xEDbrio"
    }
  },
  guardaRedes: {
    label: "Guarda-redes",
    attrs: {
      reflexos: "Reflexos",
      umParaUm: "Um para um",
      saidas: "Sa\xEDdas",
      jogoPes: "Jogo com os p\xE9s"
    }
  }
};
var ALL_ATTRS = Object.values(ATTR_GROUPS).flatMap((g) => Object.keys(g.attrs));
var PHYSICAL = Object.keys(ATTR_GROUPS.fisicos.attrs);
var MENTAL = Object.keys(ATTR_GROUPS.mentais.attrs);
var GK = Object.keys(ATTR_GROUPS.guardaRedes.attrs);
var PROFILES = {
  GR: {
    reflexos: 2,
    umParaUm: 2,
    saidas: 1,
    jogoPes: 0,
    posicionamento: 1,
    concentracao: 1,
    compostura: 0,
    agilidade: 1,
    passe: -1,
    drible: -6,
    finalizacao: -6,
    remate: -4,
    jogoCostas: -7,
    desarme: -4,
    bolasParadas: -5,
    aceleracao: -2
  },
  FIX: {
    desarme: 3,
    posicionamento: 3,
    antecipacao: 2,
    passe: 1,
    concentracao: 2,
    forca: 2,
    lideranca: 1,
    agressividade: 1,
    drible: -2,
    finalizacao: -2,
    jogoCostas: -2,
    agilidade: -1
  },
  "FIX/ALA": { desarme: 2, posicionamento: 1, passe: 1, resistencia: 1, trabalhoEquipa: 1, finalizacao: -1, jogoCostas: -2 },
  UNI: { passe: 1, decisoes: 1, trabalhoEquipa: 2, resistencia: 2, visao: 1, jogoCostas: -1 },
  ALA: {
    drible: 3,
    aceleracao: 2,
    agilidade: 2,
    rececao: 1,
    finalizacao: 1,
    remate: 1,
    resistencia: 1,
    desarme: -1,
    forca: -2,
    jogoCostas: -2
  },
  "ALA/PIV": { finalizacao: 2, drible: 1, jogoCostas: 1, forca: 1, aceleracao: 1, desarme: -2 },
  PIV: {
    jogoCostas: 4,
    finalizacao: 3,
    forca: 3,
    equilibrio: 2,
    rececao: 2,
    compostura: 1,
    desarme: -2,
    aceleracao: -1,
    resistencia: -1,
    posicionamento: -1
  }
};
var KEY = {
  GR: ["reflexos", "umParaUm", "saidas", "jogoPes", "posicionamento", "concentracao", "agilidade"],
  FIX: ["desarme", "posicionamento", "antecipacao", "passe", "concentracao", "forca", "decisoes"],
  "FIX/ALA": ["desarme", "passe", "posicionamento", "drible", "resistencia", "decisoes", "trabalhoEquipa"],
  UNI: ["passe", "decisoes", "trabalhoEquipa", "resistencia", "desarme", "finalizacao", "visao"],
  ALA: ["drible", "aceleracao", "agilidade", "rececao", "finalizacao", "passe", "decisoes"],
  "ALA/PIV": ["finalizacao", "drible", "jogoCostas", "rececao", "aceleracao", "forca", "compostura"],
  PIV: ["jogoCostas", "finalizacao", "forca", "rececao", "equilibrio", "compostura", "antecipacao"]
};
function rng(seed) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = h << 13 | h >>> 19;
  }
  return () => {
    h = Math.imul(h ^ h >>> 16, 2246822507);
    h = Math.imul(h ^ h >>> 13, 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}
function gauss(r) {
  return Math.sqrt(-2 * Math.log(r() || 1e-9)) * Math.cos(2 * Math.PI * r());
}
function ageOffset(age) {
  if (age <= 17) return -3.5;
  if (age < 24) return -3.5 + (age - 17) * 0.5;
  if (age <= 32) return 0;
  return -Math.min(3, (age - 32) * 0.35);
}
var clamp = (v) => Math.max(1, Math.min(20, Math.round(v)));
function generateAttributes(p, level, boost = 0, hints) {
  const r = rng(p.id + p.name);
  const talent = gauss(r) * (hints ? 0.5 : 1.3) + boost;
  const base = 3.5 + level * 0.11 + ageOffset(p.age) * (hints ? 0.35 : 1) + talent;
  const profile = PROFILES[p.position];
  const outfield = p.position !== "GR";
  const attrs = {};
  for (const k of ALL_ATTRS) {
    let v = base + (profile[k] ?? 0) + gauss(r) * 1.4;
    if (outfield && GK.includes(k)) v = 1 + r() * 4;
    if (p.age > 31 && PHYSICAL.includes(k)) v -= (p.age - 31) * 0.3;
    if (p.age > 27 && MENTAL.includes(k)) v += Math.min(2, (p.age - 27) * 0.25);
    if (p.age < 21 && MENTAL.includes(k)) v -= 1;
    if (hints && (k === "finalizacao" || k === "remate")) v += Math.max(-2, Math.min(2, (hints.productivity - 1) * 1.5));
    if (hints && (k === "resistencia" || k === "trabalhoEquipa" || k === "concentracao")) v += (hints.availability - 0.6) * 3;
    attrs[k] = clamp(v);
  }
  const current = overall(attrs, p.position);
  let potential = current;
  if (p.age < 24) potential += (24 - p.age) * (0.3 + r() * 0.6) + Math.max(0, talent) * 0.5;
  else if (p.age < 27) potential += r() * 1;
  return { attrs, potential: Math.min(20, Math.round(potential * 10) / 10) };
}
function overall(a, pos) {
  const k = KEY[pos];
  return Math.round(k.reduce((s2, x) => s2 + a[x], 0) / k.length * 10) / 10;
}

// src/data/por/history.json
var history_default = {
  source: "zerozero.pt (historial de carreira, todas as competi\xE7\xF5es), recolhido a 30/10/2026",
  seasons: "21=2021/22 ... 26=2026/27 (em curso)",
  players: {
    scp01: [
      {
        s: "26",
        team: "Sporting",
        games: 1,
        goals: 0
      },
      {
        s: "25",
        team: "Sporting",
        games: 20,
        goals: 0
      },
      {
        s: "24",
        team: "Sporting",
        games: 10,
        goals: 0
      },
      {
        s: "23",
        team: "Sporting",
        games: 16,
        goals: 0
      },
      {
        s: "22",
        team: "Sporting",
        games: 11,
        goals: 0
      },
      {
        s: "21",
        team: "Sporting",
        games: 14,
        goals: 2
      }
    ],
    scp02: [
      {
        s: "26",
        team: "Sporting",
        games: 9,
        goals: 1
      },
      {
        s: "25",
        team: "Sporting",
        games: 43,
        goals: 5
      },
      {
        s: "24",
        team: "Sporting",
        games: 37,
        goals: 3
      },
      {
        s: "23",
        team: "Sporting",
        games: 20,
        goals: 3
      },
      {
        s: "22",
        team: "Sporting",
        games: 27,
        goals: 1
      },
      {
        s: "21",
        team: "Sporting",
        games: 24,
        goals: 1
      }
    ],
    scp03: [
      {
        s: "26",
        team: "Sporting",
        games: 6,
        goals: 0
      },
      {
        s: "25",
        team: "HIT Kiev",
        games: 7,
        goals: 3
      },
      {
        s: "24",
        team: "HIT Kiev",
        games: 3,
        goals: 0
      },
      {
        s: "23",
        team: "HIT Kiev",
        games: 6,
        goals: 2
      },
      {
        s: "22",
        team: "HIT Kiev",
        games: 0,
        goals: 0
      },
      {
        s: "21",
        team: "HIT Kiev",
        games: 0,
        goals: 0
      }
    ],
    scp04: [
      {
        s: "26",
        team: "Sporting",
        games: 9,
        goals: 7
      },
      {
        s: "25",
        team: "Sporting",
        games: 44,
        goals: 43
      },
      {
        s: "24",
        team: "Sporting",
        games: 31,
        goals: 15
      },
      {
        s: "23",
        team: "Sporting",
        games: 39,
        goals: 23
      },
      {
        s: "22",
        team: "Sporting",
        games: 40,
        goals: 17
      },
      {
        s: "21",
        team: "Sporting",
        games: 41,
        goals: 12
      }
    ],
    scp05: [
      {
        s: "26",
        team: "Sporting",
        games: 9,
        goals: 1
      },
      {
        s: "25",
        team: "Sporting",
        games: 38,
        goals: 7
      },
      {
        s: "24",
        team: "Le\xF5es Porto Salvo",
        games: 32,
        goals: 3
      },
      {
        s: "23",
        team: "Le\xF5es Porto Salvo",
        games: 27,
        goals: 5
      },
      {
        s: "22",
        team: "Sporting",
        games: 32,
        goals: 26
      },
      {
        s: "21",
        team: "Sporting",
        games: 6,
        goals: 0
      }
    ],
    scp06: [
      {
        s: "26",
        team: "Sporting",
        games: 10,
        goals: 6
      },
      {
        s: "25",
        team: "Sporting",
        games: 47,
        goals: 14
      },
      {
        s: "24",
        team: "Sporting",
        games: 50,
        goals: 17
      },
      {
        s: "23",
        team: "Sporting",
        games: 46,
        goals: 8
      },
      {
        s: "22",
        team: "Le\xF5es Porto Salvo",
        games: 30,
        goals: 7
      },
      {
        s: "21",
        team: "Le\xF5es Porto Salvo",
        games: 31,
        goals: 10
      }
    ],
    scp07: [
      {
        s: "26",
        team: "Sporting",
        games: 3,
        goals: 0
      },
      {
        s: "25",
        team: "Barcelona",
        games: 36,
        goals: 6
      },
      {
        s: "24",
        team: "Barcelona",
        games: 37,
        goals: 8
      },
      {
        s: "23",
        team: "Barcelona",
        games: 51,
        goals: 9
      },
      {
        s: "22",
        team: "Sporting",
        games: 42,
        goals: 7
      },
      {
        s: "21",
        team: "Sporting",
        games: 37,
        goals: 13
      }
    ],
    scp08: [
      {
        s: "26",
        team: "Sporting",
        games: 8,
        goals: 2
      },
      {
        s: "25",
        team: "Sporting",
        games: 45,
        goals: 36
      },
      {
        s: "24",
        team: "Sporting",
        games: 47,
        goals: 16
      },
      {
        s: "23",
        team: "Sporting",
        games: 36,
        goals: 15
      },
      {
        s: "22",
        team: "Sporting",
        games: 33,
        goals: 12
      },
      {
        s: "21",
        team: "ETB Calvi\xE1",
        games: 10,
        goals: 5
      }
    ],
    scp09: [
      {
        s: "26",
        team: "Sporting",
        games: 10,
        goals: 5
      },
      {
        s: "25",
        team: "Le\xF5es Porto Salvo",
        games: 30,
        goals: 14
      },
      {
        s: "24",
        team: "Le\xF5es Porto Salvo",
        games: 29,
        goals: 8
      },
      {
        s: "23",
        team: "Le\xF5es Porto Salvo",
        games: 7,
        goals: 1
      },
      {
        s: "22",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 27,
        goals: 6
      },
      {
        s: "21",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 37,
        goals: 20
      }
    ],
    scp10: [
      {
        s: "26",
        team: "Sporting",
        games: 4,
        goals: 0
      },
      {
        s: "25",
        team: "Sporting",
        games: 23,
        goals: 5
      },
      {
        s: "24",
        team: "Benfica",
        games: 31,
        goals: 27
      },
      {
        s: "23",
        team: "Benfica",
        games: 34,
        goals: 10
      },
      {
        s: "22",
        team: "Benfica",
        games: 40,
        goals: 20
      },
      {
        s: "21",
        team: "Benfica",
        games: 44,
        goals: 34
      }
    ],
    scp11: [
      {
        s: "26",
        team: "Sporting",
        games: 4,
        goals: 1
      },
      {
        s: "25",
        team: "Sporting",
        games: 13,
        goals: 4
      },
      {
        s: "24",
        team: "Sporting",
        games: 2,
        goals: 0
      },
      {
        s: "23",
        team: "Sporting",
        games: 20,
        goals: 17
      },
      {
        s: "22",
        team: "Sporting",
        games: 1,
        goals: 1
      },
      {
        s: "21",
        team: "Sporting",
        games: 2,
        goals: 0
      }
    ],
    scp12: [
      {
        s: "26",
        team: "Sporting",
        games: 9,
        goals: 6
      },
      {
        s: "25",
        team: "Sporting",
        games: 43,
        goals: 22
      },
      {
        s: "24",
        team: "ElPozo Murcia Costa C\xE1lida",
        games: 38,
        goals: 22
      },
      {
        s: "23",
        team: "ElPozo Murcia Costa C\xE1lida",
        games: 35,
        goals: 9
      },
      {
        s: "22",
        team: "ElPozo Murcia Costa C\xE1lida",
        games: 11,
        goals: 3
      },
      {
        s: "21",
        team: "ElPozo Murcia Costa C\xE1lida",
        games: 36,
        goals: 13
      }
    ],
    scp13: [
      {
        s: "26",
        team: "Sporting",
        games: 10,
        goals: 1
      },
      {
        s: "25",
        team: "Sporting",
        games: 49,
        goals: 56
      },
      {
        s: "24",
        team: "Al-Ula FC",
        games: 27,
        goals: 31
      },
      {
        s: "23",
        team: "Le\xF5es Porto Salvo",
        games: 31,
        goals: 23
      },
      {
        s: "22",
        team: "Le\xF5es Porto Salvo",
        games: 29,
        goals: 19
      },
      {
        s: "21",
        team: "Le\xF5es Porto Salvo",
        games: 30,
        goals: 22
      }
    ],
    scp14: [
      {
        s: "26",
        team: "Sporting",
        games: 9,
        goals: 3
      },
      {
        s: "25",
        team: "Sporting",
        games: 47,
        goals: 24
      },
      {
        s: "24",
        team: "Sporting",
        games: 47,
        goals: 22
      },
      {
        s: "23",
        team: "Sporting",
        games: 46,
        goals: 25
      },
      {
        s: "22",
        team: "Sporting",
        games: 42,
        goals: 17
      },
      {
        s: "21",
        team: "Sporting",
        games: 48,
        goals: 29
      }
    ],
    scp15: [
      {
        s: "26",
        team: "Sporting",
        games: 4,
        goals: 0
      },
      {
        s: "25",
        team: "Sporting",
        games: 2,
        goals: 0
      },
      {
        s: "24",
        team: "Sporting",
        games: 20,
        goals: 5
      },
      {
        s: "23",
        team: "CS S\xE3o Jo\xE3o",
        games: 2,
        goals: 1
      },
      {
        s: "22",
        team: "CS S\xE3o Jo\xE3o",
        games: 13,
        goals: 9
      },
      {
        s: "21",
        team: "CS S\xE3o Jo\xE3o",
        games: 14,
        goals: 5
      }
    ],
    scp16: [
      {
        s: "26",
        team: "Sporting",
        games: 0,
        goals: 0
      },
      {
        s: "25",
        team: "Sporting",
        games: 22,
        goals: 15
      },
      {
        s: "24",
        team: "Sporting",
        games: 32,
        goals: 27
      },
      {
        s: "23",
        team: "Sporting",
        games: 41,
        goals: 41
      },
      {
        s: "22",
        team: "Sporting",
        games: 37,
        goals: 24
      },
      {
        s: "21",
        team: "Sporting",
        games: 34,
        goals: 11
      }
    ],
    scp17: [
      {
        s: "26",
        team: "Sporting",
        games: 10,
        goals: 4
      }
    ],
    scp18: [
      {
        s: "26",
        team: "Sporting",
        games: 9,
        goals: 6
      },
      {
        s: "25",
        team: "Sporting",
        games: 45,
        goals: 26
      },
      {
        s: "24",
        team: "Sporting",
        games: 22,
        goals: 13
      },
      {
        s: "23",
        team: "Benfica",
        games: 21,
        goals: 18
      },
      {
        s: "22",
        team: "Benfica",
        games: 44,
        goals: 37
      },
      {
        s: "21",
        team: "Benfica",
        games: 23,
        goals: 15
      }
    ],
    slb01: [
      {
        s: "26",
        team: "Benfica",
        games: 6,
        goals: 0
      },
      {
        s: "25",
        team: "Benfica",
        games: 26,
        goals: 1
      },
      {
        s: "24",
        team: "Benfica",
        games: 14,
        goals: 0
      },
      {
        s: "23",
        team: "Le\xF5es Porto Salvo",
        games: 33,
        goals: 2
      },
      {
        s: "22",
        team: "Le\xF5es Porto Salvo",
        games: 30,
        goals: 2
      },
      {
        s: "21",
        team: "El\xE9ctrico FC/ A MatosCar",
        games: 27,
        goals: 2
      }
    ],
    slb02: [
      {
        s: "26",
        team: "Benfica",
        games: 1,
        goals: 0
      },
      {
        s: "25",
        team: "Benfica",
        games: 5,
        goals: 0
      },
      {
        s: "24",
        team: "Benfica",
        games: 27,
        goals: 2
      },
      {
        s: "23",
        team: "URD Arranh\xF3",
        games: 21,
        goals: 0
      },
      {
        s: "22",
        team: "URD Arranh\xF3",
        games: 19,
        goals: 6
      },
      {
        s: "21",
        team: "URD Arranh\xF3",
        games: 0,
        goals: 0
      }
    ],
    slb03: [
      {
        s: "26",
        team: "Benfica",
        games: 8,
        goals: 1
      },
      {
        s: "25",
        team: "Benfica",
        games: 43,
        goals: 5
      },
      {
        s: "24",
        team: "Benfica",
        games: 36,
        goals: 5
      },
      {
        s: "23",
        team: "Benfica",
        games: 39,
        goals: 6
      },
      {
        s: "22",
        team: "Benfica",
        games: 37,
        goals: 3
      },
      {
        s: "21",
        team: "Tyumen",
        games: 26,
        goals: 1
      }
    ],
    slb04: [
      {
        s: "26",
        team: "Benfica",
        games: 8,
        goals: 2
      },
      {
        s: "25",
        team: "Benfica",
        games: 38,
        goals: 12
      },
      {
        s: "24",
        team: "Benfica",
        games: 38,
        goals: 17
      },
      {
        s: "23",
        team: "Benfica",
        games: 39,
        goals: 12
      },
      {
        s: "22",
        team: "Benfica",
        games: 46,
        goals: 12
      },
      {
        s: "21",
        team: "Benfica",
        games: 44,
        goals: 11
      }
    ],
    slb05: [
      {
        s: "26",
        team: "Benfica",
        games: 6,
        goals: 2
      },
      {
        s: "25",
        team: "Benfica",
        games: 34,
        goals: 6
      },
      {
        s: "24",
        team: "Benfica",
        games: 26,
        goals: 5
      },
      {
        s: "23",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 28,
        goals: 11
      },
      {
        s: "22",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 25,
        goals: 13
      },
      {
        s: "21",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 34,
        goals: 7
      }
    ],
    slb06: [
      {
        s: "26",
        team: "Benfica",
        games: 8,
        goals: 3
      },
      {
        s: "25",
        team: "Benfica",
        games: 39,
        goals: 13
      },
      {
        s: "24",
        team: "Benfica",
        games: 37,
        goals: 11
      },
      {
        s: "23",
        team: "Barcelona",
        games: 48,
        goals: 12
      },
      {
        s: "22",
        team: "Barcelona",
        games: 48,
        goals: 8
      },
      {
        s: "21",
        team: "Barcelona",
        games: 46,
        goals: 13
      }
    ],
    slb07: [
      {
        s: "26",
        team: "Benfica",
        games: 6,
        goals: 3
      },
      {
        s: "25",
        team: "Benfica",
        games: 43,
        goals: 14
      },
      {
        s: "24",
        team: "Benfica",
        games: 26,
        goals: 8
      },
      {
        s: "23",
        team: "Benfica",
        games: 22,
        goals: 10
      },
      {
        s: "22",
        team: "Benfica",
        games: 24,
        goals: 6
      },
      {
        s: "21",
        team: "Benfica",
        games: 36,
        goals: 10
      }
    ],
    slb08: [
      {
        s: "26",
        team: "Benfica",
        games: 7,
        goals: 2
      },
      {
        s: "25",
        team: "Benfica",
        games: 41,
        goals: 14
      },
      {
        s: "24",
        team: "Benfica",
        games: 38,
        goals: 11
      },
      {
        s: "23",
        team: "Benfica",
        games: 39,
        goals: 14
      },
      {
        s: "22",
        team: "Benfica",
        games: 37,
        goals: 6
      },
      {
        s: "21",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 35,
        goals: 24
      }
    ],
    slb09: [
      {
        s: "26",
        team: "Benfica",
        games: 7,
        goals: 2
      },
      {
        s: "25",
        team: "Benfica",
        games: 45,
        goals: 32
      },
      {
        s: "24",
        team: "Benfica",
        games: 36,
        goals: 18
      },
      {
        s: "23",
        team: "Benfica",
        games: 38,
        goals: 34
      },
      {
        s: "22",
        team: "Benfica",
        games: 45,
        goals: 23
      },
      {
        s: "21",
        team: "Benfica",
        games: 37,
        goals: 16
      }
    ],
    slb10: [
      {
        s: "26",
        team: "Benfica",
        games: 7,
        goals: 1
      },
      {
        s: "25",
        team: "Benfica",
        games: 44,
        goals: 21
      },
      {
        s: "24",
        team: "Benfica",
        games: 27,
        goals: 10
      },
      {
        s: "23",
        team: "Benfica",
        games: 35,
        goals: 10
      },
      {
        s: "22",
        team: "AD Fund\xE3o",
        games: 25,
        goals: 13
      },
      {
        s: "21",
        team: "AD Fund\xE3o",
        games: 28,
        goals: 5
      }
    ],
    slb11: [
      {
        s: "26",
        team: "Benfica",
        games: 8,
        goals: 1
      },
      {
        s: "25",
        team: "Benfica",
        games: 43,
        goals: 16
      },
      {
        s: "24",
        team: "Benfica",
        games: 32,
        goals: 7
      },
      {
        s: "23",
        team: "Benfica",
        games: 24,
        goals: 8
      },
      {
        s: "22",
        team: "Benfica",
        games: 30,
        goals: 3
      },
      {
        s: "21",
        team: "Benfica",
        games: 18,
        goals: 4
      }
    ],
    slb12: [
      {
        s: "26",
        team: "Benfica",
        games: 7,
        goals: 3
      },
      {
        s: "25",
        team: "Benfica",
        games: 42,
        goals: 15
      },
      {
        s: "24",
        team: "Al-Nassr",
        games: 29,
        goals: 22
      },
      {
        s: "23",
        team: "Sporting",
        games: 46,
        goals: 16
      },
      {
        s: "22",
        team: "Sporting",
        games: 42,
        goals: 17
      },
      {
        s: "21",
        team: "Sporting",
        games: 34,
        goals: 17
      }
    ],
    slb13: [
      {
        s: "26",
        team: "Benfica",
        games: 2,
        goals: 1
      },
      {
        s: "25",
        team: "Le\xF5es Porto Salvo",
        games: 32,
        goals: 11
      },
      {
        s: "24",
        team: "Le\xF5es Porto Salvo",
        games: 33,
        goals: 16
      },
      {
        s: "23",
        team: "Le\xF5es Porto Salvo",
        games: 7,
        goals: 6
      },
      {
        s: "22",
        team: "Le\xF5es Porto Salvo",
        games: 1,
        goals: 0
      }
    ],
    slb14: [
      {
        s: "26",
        team: "Benfica",
        games: 8,
        goals: 3
      },
      {
        s: "25",
        team: "Al-Qadisiyah",
        games: 25,
        goals: 48
      },
      {
        s: "24",
        team: "Al-Qadisiyah",
        games: 29,
        goals: 66
      },
      {
        s: "23",
        team: "Illes Balears Palma",
        games: 42,
        goals: 14
      },
      {
        s: "22",
        team: "Illes Balears Palma",
        games: 22,
        goals: 11
      },
      {
        s: "21",
        team: "Real Betis",
        games: 21,
        goals: 10
      }
    ],
    slb15: [
      {
        s: "26",
        team: "Benfica",
        games: 1,
        goals: 0
      },
      {
        s: "25",
        team: "Benfica",
        games: 8,
        goals: 1
      },
      {
        s: "24",
        team: "Benfica",
        games: 23,
        goals: 9
      },
      {
        s: "23",
        team: "Benfica",
        games: 1,
        goals: 1
      },
      {
        s: "22",
        team: "Benfica",
        games: 26,
        goals: 16
      },
      {
        s: "21",
        team: "Benfica",
        games: 18,
        goals: 8
      }
    ],
    slb16: [
      {
        s: "26",
        team: "Benfica",
        games: 4,
        goals: 0
      },
      {
        s: "25",
        team: "Benfica",
        games: 25,
        goals: 4
      },
      {
        s: "24",
        team: "Benfica",
        games: 26,
        goals: 25
      },
      {
        s: "23",
        team: "Benfica",
        games: 1,
        goals: 0
      },
      {
        s: "22",
        team: "Benfica",
        games: 27,
        goals: 16
      },
      {
        s: "21",
        team: "Patameiras",
        games: 27,
        goals: 37
      }
    ],
    slb17: [
      {
        s: "26",
        team: "Benfica",
        games: 7,
        goals: 1
      },
      {
        s: "25",
        team: "Rio Ave",
        games: 24,
        goals: 23
      },
      {
        s: "24",
        team: "Rio Ave",
        games: 17,
        goals: 25
      },
      {
        s: "23",
        team: "Le\xF5es Porto Salvo",
        games: 23,
        goals: 6
      },
      {
        s: "21",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 6,
        goals: 2
      }
    ],
    scb01: [
      {
        s: "26",
        team: "SC Braga",
        games: 2,
        goals: 0
      },
      {
        s: "25",
        team: "Anderlecht",
        games: 16,
        goals: 1
      },
      {
        s: "24",
        team: "Anderlecht",
        games: 34,
        goals: 1
      }
    ],
    scb02: [
      {
        s: "26",
        team: "SC Braga",
        games: 4,
        goals: 0
      },
      {
        s: "25",
        team: "Atyrau",
        games: 2,
        goals: 1
      },
      {
        s: "24",
        team: "Atyrau",
        games: 0,
        goals: 0
      }
    ],
    scb03: [
      {
        s: "26",
        team: "SC Braga",
        games: 0,
        goals: 0
      },
      {
        s: "25",
        team: "SC Braga",
        games: 0,
        goals: 0
      },
      {
        s: "24",
        team: "SC Braga",
        games: 6,
        goals: 0
      },
      {
        s: "23",
        team: "SC Braga",
        games: 30,
        goals: 1
      },
      {
        s: "22",
        team: "Futsal Celorico",
        games: 16,
        goals: 0
      },
      {
        s: "21",
        team: "Futsal Celorico",
        games: 0,
        goals: 0
      }
    ],
    scb04: [
      {
        s: "26",
        team: "SC Braga",
        games: 6,
        goals: 1
      },
      {
        s: "25",
        team: "SC Braga",
        games: 30,
        goals: 7
      },
      {
        s: "24",
        team: "SC Braga",
        games: 33,
        goals: 14
      },
      {
        s: "23",
        team: "SC Braga",
        games: 36,
        goals: 11
      },
      {
        s: "22",
        team: "SC Braga",
        games: 31,
        goals: 7
      },
      {
        s: "21",
        team: "Futsal Azem\xE9is",
        games: 30,
        goals: 10
      }
    ],
    scb05: [
      {
        s: "26",
        team: "SC Braga",
        games: 6,
        goals: 0
      },
      {
        s: "25",
        team: "SC Braga",
        games: 29,
        goals: 3
      },
      {
        s: "24",
        team: "SC Braga",
        games: 29,
        goals: 6
      },
      {
        s: "23",
        team: "SC Braga",
        games: 31,
        goals: 4
      },
      {
        s: "22",
        team: "SC Braga",
        games: 30,
        goals: 5
      },
      {
        s: "21",
        team: "SC Braga",
        games: 29,
        goals: 5
      }
    ],
    scb06: [
      {
        s: "26",
        team: "SC Braga",
        games: 5,
        goals: 3
      },
      {
        s: "25",
        team: "Rio Ave",
        games: 25,
        goals: 9
      },
      {
        s: "24",
        team: "Le\xF5es Porto Salvo",
        games: 32,
        goals: 7
      },
      {
        s: "23",
        team: "Le\xF5es Porto Salvo",
        games: 27,
        goals: 5
      },
      {
        s: "22",
        team: "El\xE9ctrico FC/ A MatosCar",
        games: 19,
        goals: 3
      },
      {
        s: "21",
        team: "El\xE9ctrico FC/ A MatosCar",
        games: 32,
        goals: 9
      }
    ],
    scb07: [
      {
        s: "26",
        team: "SC Braga",
        games: 0,
        goals: 0
      },
      {
        s: "25",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 23,
        goals: 6
      },
      {
        s: "24",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 24,
        goals: 3
      },
      {
        s: "23",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 24,
        goals: 2
      },
      {
        s: "22",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 12,
        goals: 0
      },
      {
        s: "21",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 26,
        goals: 4
      }
    ],
    scb08: [
      {
        s: "26",
        team: "SC Braga",
        games: 2,
        goals: 0
      },
      {
        s: "25",
        team: "SC Braga",
        games: 1,
        goals: 0
      },
      {
        s: "24",
        team: "SC Braga",
        games: 16,
        goals: 0
      },
      {
        s: "23",
        team: "SC Braga",
        games: 0,
        goals: 0
      },
      {
        s: "22",
        team: "CR Candoso/Natcal",
        games: 9,
        goals: 0
      },
      {
        s: "21",
        team: "CR Candoso/Natcal",
        games: 4,
        goals: 4
      }
    ],
    scb09: [
      {
        s: "26",
        team: "SC Braga",
        games: 6,
        goals: 5
      },
      {
        s: "25",
        team: "SC Braga",
        games: 24,
        goals: 4
      },
      {
        s: "24",
        team: "SC Braga",
        games: 33,
        goals: 22
      },
      {
        s: "23",
        team: "SC Braga",
        games: 34,
        goals: 17
      },
      {
        s: "22",
        team: "SC Braga",
        games: 26,
        goals: 12
      },
      {
        s: "21",
        team: "SC Braga",
        games: 31,
        goals: 16
      }
    ],
    scb10: [
      {
        s: "26",
        team: "SC Braga",
        games: 2,
        goals: 0
      },
      {
        s: "25",
        team: "Ferreira do Z\xEAzere",
        games: 14,
        goals: 3
      },
      {
        s: "24",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 23,
        goals: 2
      },
      {
        s: "23",
        team: "Quinta dos Lombos",
        games: 19,
        goals: 6
      },
      {
        s: "22",
        team: "AD Fund\xE3o",
        games: 13,
        goals: 1
      },
      {
        s: "21",
        team: "Benfica",
        games: 25,
        goals: 14
      }
    ],
    scb11: [
      {
        s: "26",
        team: "SC Braga",
        games: 6,
        goals: 2
      },
      {
        s: "25",
        team: "SC Braga",
        games: 30,
        goals: 8
      },
      {
        s: "24",
        team: "Le\xF5es Porto Salvo",
        games: 34,
        goals: 20
      },
      {
        s: "23",
        team: "Le\xF5es Porto Salvo",
        games: 32,
        goals: 17
      },
      {
        s: "22",
        team: "Le\xF5es Porto Salvo",
        games: 30,
        goals: 7
      },
      {
        s: "21",
        team: "Viseu 2001",
        games: 26,
        goals: 19
      }
    ],
    scb12: [
      {
        s: "26",
        team: "SC Braga",
        games: 5,
        goals: 0
      },
      {
        s: "25",
        team: "SC Braga",
        games: 13,
        goals: 1
      },
      {
        s: "24",
        team: "SC Braga",
        games: 18,
        goals: 9
      },
      {
        s: "23",
        team: "Nun\xB4\xC1lvares",
        games: 18,
        goals: 12
      },
      {
        s: "22",
        team: "Nun\xB4\xC1lvares",
        games: 33,
        goals: 45
      },
      {
        s: "21",
        team: "Nun\xB4\xC1lvares",
        games: 0,
        goals: 0
      }
    ],
    scb13: [
      {
        s: "26",
        team: "SC Braga",
        games: 6,
        goals: 4
      },
      {
        s: "25",
        team: "Riga FC",
        games: 26,
        goals: 31
      },
      {
        s: "24",
        team: "Riga FC",
        games: 25,
        goals: 19
      },
      {
        s: "22",
        team: "Vi\xF1a Albali Valdepe\xF1as",
        games: 33,
        goals: 8
      },
      {
        s: "21",
        team: "Wanapix AD Sala 10",
        games: 26,
        goals: 9
      }
    ],
    scb14: [
      {
        s: "26",
        team: "SC Braga",
        games: 6,
        goals: 3
      },
      {
        s: "25",
        team: "Riga FC",
        games: 22,
        goals: 23
      },
      {
        s: "24",
        team: "Riga FC",
        games: 22,
        goals: 22
      },
      {
        s: "23",
        team: "Riga FC",
        games: 12,
        goals: 18
      },
      {
        s: "22",
        team: "El\xE9ctrico FC/ A MatosCar",
        games: 26,
        goals: 11
      },
      {
        s: "21",
        team: "El\xE9ctrico FC/ A MatosCar",
        games: 34,
        goals: 15
      }
    ],
    scb15: [
      {
        s: "26",
        team: "SC Braga",
        games: 5,
        goals: 4
      },
      {
        s: "25",
        team: "SC Braga",
        games: 1,
        goals: 0
      },
      {
        s: "24",
        team: "SC Braga",
        games: 20,
        goals: 5
      },
      {
        s: "23",
        team: "Nogueir\xF3 e Ten\xF5es",
        games: 14,
        goals: 13
      },
      {
        s: "22",
        team: "Nogueir\xF3 e Ten\xF5es",
        games: 13,
        goals: 2
      },
      {
        s: "21",
        team: "Nogueir\xF3 e Ten\xF5es",
        games: 6,
        goals: 0
      }
    ],
    scb16: [
      {
        s: "26",
        team: "SC Braga",
        games: 5,
        goals: 1
      },
      {
        s: "25",
        team: "SC Braga",
        games: 19,
        goals: 8
      },
      {
        s: "24",
        team: "Quinta dos Lombos",
        games: 24,
        goals: 26
      },
      {
        s: "23",
        team: "Quinta dos Lombos",
        games: 22,
        goals: 19
      },
      {
        s: "22",
        team: "Quinta dos Lombos",
        games: 26,
        goals: 16
      },
      {
        s: "21",
        team: "Quinta dos Lombos",
        games: 32,
        goals: 23
      }
    ],
    scb17: [
      {
        s: "26",
        team: "SC Braga",
        games: 6,
        goals: 2
      },
      {
        s: "25",
        team: "SC Braga",
        games: 28,
        goals: 10
      },
      {
        s: "24",
        team: "AD Fund\xE3o",
        games: 26,
        goals: 11
      },
      {
        s: "23",
        team: "Sporting",
        games: 19,
        goals: 10
      },
      {
        s: "22",
        team: "Sporting",
        games: 29,
        goals: 19
      },
      {
        s: "21",
        team: "Sporting",
        games: 15,
        goals: 6
      }
    ],
    scb18: [
      {
        s: "26",
        team: "SC Braga",
        games: 6,
        goals: 1
      },
      {
        s: "25",
        team: "SC Braga",
        games: 12,
        goals: 5
      },
      {
        s: "24",
        team: "Ferreira do Z\xEAzere",
        games: 14,
        goals: 5
      }
    ],
    scb19: [
      {
        s: "26",
        team: "SC Braga",
        games: 6,
        goals: 8
      },
      {
        s: "25",
        team: "SC Braga",
        games: 2,
        goals: 0
      },
      {
        s: "24",
        team: "SC Braga",
        games: 27,
        goals: 21
      },
      {
        s: "23",
        team: "Nun\xB4\xC1lvares",
        games: 2,
        goals: 0
      },
      {
        s: "22",
        team: "Nun\xB4\xC1lvares",
        games: 25,
        goals: 6
      },
      {
        s: "21",
        team: "Nun\xB4\xC1lvares",
        games: 0,
        goals: 0
      }
    ],
    scb20: [
      {
        s: "26",
        team: "SC Braga",
        games: 5,
        goals: 3
      },
      {
        s: "25",
        team: "SC Braga",
        games: 0,
        goals: 0
      },
      {
        s: "24",
        team: "AM Granja",
        games: 25,
        goals: 44
      },
      {
        s: "23",
        team: "AM Granja",
        games: 7,
        goals: 3
      },
      {
        s: "22",
        team: "AM Granja",
        games: 1,
        goals: 0
      },
      {
        s: "21",
        team: "AM Granja",
        games: 11,
        goals: 4
      }
    ],
    fun01: [
      {
        s: "26",
        team: "AD Fund\xE3o",
        games: 1,
        goals: 0
      },
      {
        s: "25",
        team: "ADR Retaxo",
        games: 9,
        goals: 0
      },
      {
        s: "24",
        team: "ABC Nelas",
        games: 23,
        goals: 0
      },
      {
        s: "23",
        team: "Bairro Boa Esperan\xE7a",
        games: 25,
        goals: 0
      },
      {
        s: "22",
        team: "Bairro Boa Esperan\xE7a",
        games: 28,
        goals: 2
      },
      {
        s: "21",
        team: "ACD Ladoeiro",
        games: 32,
        goals: 0
      }
    ],
    fun02: [
      {
        s: "26",
        team: "AD Fund\xE3o",
        games: 2,
        goals: 0
      },
      {
        s: "25",
        team: "AD Fund\xE3o",
        games: 12,
        goals: 0
      },
      {
        s: "24",
        team: "Cariense",
        games: 25,
        goals: 0
      },
      {
        s: "23",
        team: "Cariense",
        games: 4,
        goals: 0
      },
      {
        s: "22",
        team: "Cariense",
        games: 15,
        goals: 1
      },
      {
        s: "21",
        team: "Cariense",
        games: 6,
        goals: 0
      }
    ],
    fun03: [
      {
        s: "26",
        team: "AD Fund\xE3o",
        games: 6,
        goals: 1
      },
      {
        s: "25",
        team: "AD Fund\xE3o",
        games: 25,
        goals: 5
      },
      {
        s: "24",
        team: "AD Fund\xE3o",
        games: 10,
        goals: 2
      }
    ],
    fun04: [
      {
        s: "26",
        team: "AD Fund\xE3o",
        games: 6,
        goals: 2
      },
      {
        s: "25",
        team: "AD Fund\xE3o",
        games: 21,
        goals: 5
      },
      {
        s: "24",
        team: "AD Fund\xE3o",
        games: 19,
        goals: 5
      },
      {
        s: "23",
        team: "AD Fund\xE3o",
        games: 22,
        goals: 9
      },
      {
        s: "22",
        team: "AD Fund\xE3o",
        games: 24,
        goals: 9
      },
      {
        s: "21",
        team: "Modicus Bruval",
        games: 26,
        goals: 8
      }
    ],
    fun05: [
      {
        s: "26",
        team: "AD Fund\xE3o",
        games: 4,
        goals: 1
      },
      {
        s: "25",
        team: "Sporting",
        games: 1,
        goals: 0
      },
      {
        s: "24",
        team: "Sporting",
        games: 18,
        goals: 7
      },
      {
        s: "23",
        team: "Sporting",
        games: 29,
        goals: 10
      },
      {
        s: "22",
        team: "Sporting",
        games: 31,
        goals: 9
      },
      {
        s: "21",
        team: "AMSAC",
        games: 21,
        goals: 17
      }
    ],
    fun06: [
      {
        s: "26",
        team: "AD Fund\xE3o",
        games: 7,
        goals: 8
      },
      {
        s: "25",
        team: "Benfica",
        games: 17,
        goals: 7
      },
      {
        s: "24",
        team: "AD Fund\xE3o",
        games: 26,
        goals: 18
      },
      {
        s: "23",
        team: "Levante",
        games: 27,
        goals: 16
      },
      {
        s: "22",
        team: "Levante",
        games: 24,
        goals: 5
      },
      {
        s: "21",
        team: "AD Fund\xE3o",
        games: 31,
        goals: 9
      }
    ],
    fun07: [
      {
        s: "26",
        team: "AD Fund\xE3o",
        games: 1,
        goals: 1
      },
      {
        s: "25",
        team: "CB Idanha-a-Nova",
        games: 1,
        goals: 0
      },
      {
        s: "24",
        team: "SLA Dominguiso",
        games: 1,
        goals: 0
      },
      {
        s: "23",
        team: "SLA Dominguiso",
        games: 1,
        goals: 0
      },
      {
        s: "22",
        team: "SLA Dominguiso",
        games: 1,
        goals: 0
      }
    ],
    fun08: [
      {
        s: "26",
        team: "AD Fund\xE3o",
        games: 7,
        goals: 1
      },
      {
        s: "25",
        team: "Al-Tadhamon",
        games: 0,
        goals: 0
      },
      {
        s: "24",
        team: "Torreense",
        games: 22,
        goals: 9
      },
      {
        s: "23",
        team: "Torreense",
        games: 27,
        goals: 10
      },
      {
        s: "22",
        team: "Levante",
        games: 16,
        goals: 2
      },
      {
        s: "21",
        team: "Portimonense",
        games: 28,
        goals: 17
      }
    ],
    fun09: [
      {
        s: "26",
        team: "AD Fund\xE3o",
        games: 7,
        goals: 3
      },
      {
        s: "25",
        team: "El\xE9ctrico",
        games: 23,
        goals: 8
      },
      {
        s: "24",
        team: "Sporting",
        games: 25,
        goals: 21
      },
      {
        s: "23",
        team: "Sporting",
        games: 3,
        goals: 1
      },
      {
        s: "22",
        team: "Sporting",
        games: 29,
        goals: 12
      },
      {
        s: "21",
        team: "AMSAC",
        games: 21,
        goals: 14
      }
    ],
    fun10: [
      {
        s: "26",
        team: "AD Fund\xE3o",
        games: 5,
        goals: 0
      },
      {
        s: "25",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 2,
        goals: 1
      },
      {
        s: "24",
        team: "AMSAC",
        games: 25,
        goals: 15
      },
      {
        s: "23",
        team: "Benfica",
        games: 23,
        goals: 30
      },
      {
        s: "22",
        team: "Benfica",
        games: 20,
        goals: 14
      },
      {
        s: "21",
        team: "Quinta dos Lombos",
        games: 5,
        goals: 0
      }
    ],
    fun11: [
      {
        s: "26",
        team: "AD Fund\xE3o",
        games: 7,
        goals: 0
      },
      {
        s: "25",
        team: "AD Fund\xE3o",
        games: 27,
        goals: 8
      },
      {
        s: "24",
        team: "AD Fund\xE3o",
        games: 27,
        goals: 3
      },
      {
        s: "23",
        team: "AD Fund\xE3o",
        games: 25,
        goals: 1
      },
      {
        s: "22",
        team: "AD Fund\xE3o",
        games: 27,
        goals: 10
      },
      {
        s: "21",
        team: "AD Fund\xE3o",
        games: 34,
        goals: 15
      }
    ],
    fun12: [
      {
        s: "26",
        team: "AD Fund\xE3o",
        games: 7,
        goals: 2
      },
      {
        s: "25",
        team: "Ecocity Genzano",
        games: 13,
        goals: 6
      },
      {
        s: "24",
        team: "Ecocity Genzano",
        games: 33,
        goals: 10
      },
      {
        s: "23",
        team: "Ja\xE9n Para\xEDso Interior",
        games: 35,
        goals: 3
      },
      {
        s: "22",
        team: "Ja\xE9n Para\xEDso Interior",
        games: 14,
        goals: 0
      },
      {
        s: "21",
        team: "AD Fund\xE3o",
        games: 30,
        goals: 15
      }
    ],
    fun13: [
      {
        s: "26",
        team: "AD Fund\xE3o",
        games: 1,
        goals: 0
      },
      {
        s: "25",
        team: "GD Mata",
        games: 27,
        goals: 28
      },
      {
        s: "24",
        team: "GD Mata",
        games: 12,
        goals: 12
      },
      {
        s: "23",
        team: "GD Mata",
        games: 8,
        goals: 4
      }
    ],
    fun14: [
      {
        s: "26",
        team: "AD Fund\xE3o",
        games: 7,
        goals: 1
      },
      {
        s: "25",
        team: "Le\xF5es Porto Salvo",
        games: 22,
        goals: 3
      },
      {
        s: "24",
        team: "SC Lusit\xE2nia",
        games: 19,
        goals: 15
      }
    ],
    fun15: [
      {
        s: "26",
        team: "AD Fund\xE3o",
        games: 7,
        goals: 1
      },
      {
        s: "25",
        team: "AD Fund\xE3o",
        games: 25,
        goals: 6
      },
      {
        s: "24",
        team: "SC Lusit\xE2nia",
        games: 9,
        goals: 2
      },
      {
        s: "23",
        team: "Le\xF5es Porto Salvo",
        games: 15,
        goals: 3
      },
      {
        s: "22",
        team: "Le\xF5es Porto Salvo",
        games: 4,
        goals: 0
      },
      {
        s: "21",
        team: "Le\xF5es Porto Salvo",
        games: 20,
        goals: 26
      }
    ],
    lps01: [
      {
        s: "26",
        team: "Le\xF5es Porto Salvo",
        games: 6,
        goals: 1
      },
      {
        s: "25",
        team: "UPVN",
        games: 22,
        goals: 3
      },
      {
        s: "24",
        team: "Quinta dos Lombos",
        games: 21,
        goals: 1
      },
      {
        s: "23",
        team: "Sporting",
        games: 25,
        goals: 3
      },
      {
        s: "22",
        team: "Sporting",
        games: 34,
        goals: 2
      },
      {
        s: "21",
        team: "Sporting",
        games: 4,
        goals: 0
      }
    ],
    lps02: [
      {
        s: "26",
        team: "Le\xF5es Porto Salvo",
        games: 0,
        goals: 0
      },
      {
        s: "25",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 16,
        goals: 0
      },
      {
        s: "24",
        team: "Benfica",
        games: 14,
        goals: 0
      },
      {
        s: "23",
        team: "Benfica",
        games: 2,
        goals: 0
      },
      {
        s: "22",
        team: "Benfica",
        games: 34,
        goals: 1
      },
      {
        s: "21",
        team: "Benfica",
        games: 2,
        goals: 0
      }
    ],
    lps03: [
      {
        s: "26",
        team: "Le\xF5es Porto Salvo",
        games: 2,
        goals: 0
      },
      {
        s: "25",
        team: "Le\xF5es Porto Salvo",
        games: 3,
        goals: 0
      },
      {
        s: "24",
        team: "Le\xF5es Porto Salvo",
        games: 6,
        goals: 0
      },
      {
        s: "23",
        team: "Le\xF5es Porto Salvo",
        games: 1,
        goals: 0
      },
      {
        s: "22",
        team: "Le\xF5es Porto Salvo",
        games: 7,
        goals: 0
      },
      {
        s: "21",
        team: "Le\xF5es Porto Salvo",
        games: 14,
        goals: 6
      }
    ],
    lps04: [
      {
        s: "26",
        team: "Le\xF5es Porto Salvo",
        games: 6,
        goals: 1
      },
      {
        s: "25",
        team: "Le\xF5es Porto Salvo",
        games: 30,
        goals: 6
      },
      {
        s: "24",
        team: "Ferreira do Z\xEAzere",
        games: 28,
        goals: 4
      },
      {
        s: "23",
        team: "Le\xF5es Porto Salvo",
        games: 8,
        goals: 2
      },
      {
        s: "22",
        team: "Le\xF5es Porto Salvo",
        games: 2,
        goals: 0
      },
      {
        s: "21",
        team: "PCR",
        games: 0,
        goals: 0
      }
    ],
    lps05: [
      {
        s: "26",
        team: "Le\xF5es Porto Salvo",
        games: 0,
        goals: 0
      },
      {
        s: "25",
        team: "Le\xF5es Porto Salvo",
        games: 31,
        goals: 2
      },
      {
        s: "24",
        team: "Le\xF5es Porto Salvo",
        games: 13,
        goals: 1
      },
      {
        s: "23",
        team: "AMSAC",
        games: 27,
        goals: 11
      },
      {
        s: "22",
        team: "AMSAC",
        games: 29,
        goals: 15
      },
      {
        s: "21",
        team: "Burinhosa",
        games: 33,
        goals: 5
      }
    ],
    lps06: [
      {
        s: "26",
        team: "Le\xF5es Porto Salvo",
        games: 0,
        goals: 0
      },
      {
        s: "25",
        team: "Le\xF5es Porto Salvo",
        games: 7,
        goals: 0
      },
      {
        s: "24",
        team: "Le\xF5es Porto Salvo",
        games: 2,
        goals: 1
      },
      {
        s: "23",
        team: "Le\xF5es Porto Salvo",
        games: 1,
        goals: 0
      },
      {
        s: "22",
        team: "Le\xF5es Porto Salvo",
        games: 0,
        goals: 0
      },
      {
        s: "21",
        team: "Le\xF5es Porto Salvo",
        games: 1,
        goals: 1
      }
    ],
    lps07: [
      {
        s: "26",
        team: "Le\xF5es Porto Salvo",
        games: 5,
        goals: 0
      },
      {
        s: "25",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 9,
        goals: 3
      }
    ],
    lps08: [
      {
        s: "26",
        team: "Le\xF5es Porto Salvo",
        games: 6,
        goals: 2
      },
      {
        s: "25",
        team: "Le\xF5es Porto Salvo",
        games: 22,
        goals: 6
      },
      {
        s: "24",
        team: "Sporting",
        games: 28,
        goals: 11
      },
      {
        s: "23",
        team: "Sporting",
        games: 24,
        goals: 13
      },
      {
        s: "22",
        team: "Sporting",
        games: 33,
        goals: 14
      },
      {
        s: "21",
        team: "AMSAC",
        games: 14,
        goals: 7
      }
    ],
    lps09: [
      {
        s: "26",
        team: "Le\xF5es Porto Salvo",
        games: 2,
        goals: 1
      },
      {
        s: "25",
        team: "Le\xF5es Porto Salvo",
        games: 5,
        goals: 0
      },
      {
        s: "24",
        team: "Le\xF5es Porto Salvo",
        games: 26,
        goals: 18
      },
      {
        s: "23",
        team: "Le\xF5es Porto Salvo",
        games: 1,
        goals: 0
      },
      {
        s: "22",
        team: "Reguilas Tires",
        games: 5,
        goals: 6
      },
      {
        s: "21",
        team: "Reguilas Tires",
        games: 0,
        goals: 0
      }
    ],
    lps10: [
      {
        s: "26",
        team: "Le\xF5es Porto Salvo",
        games: 0,
        goals: 0
      },
      {
        s: "25",
        team: "AMSAC",
        games: 2,
        goals: 0
      },
      {
        s: "24",
        team: "AMSAC",
        games: 1,
        goals: 0
      },
      {
        s: "23",
        team: "AMSAC",
        games: 22,
        goals: 2
      },
      {
        s: "22",
        team: "Sporting",
        games: 32,
        goals: 11
      },
      {
        s: "21",
        team: "Sporting",
        games: 3,
        goals: 0
      }
    ],
    lps11: [
      {
        s: "26",
        team: "Le\xF5es Porto Salvo",
        games: 0,
        goals: 0
      },
      {
        s: "25",
        team: "GROB",
        games: 17,
        goals: 12
      },
      {
        s: "24",
        team: "GROB",
        games: 19,
        goals: 4
      },
      {
        s: "23",
        team: "GROB",
        games: 10,
        goals: 2
      },
      {
        s: "22",
        team: "GROB",
        games: 1,
        goals: 0
      },
      {
        s: "21",
        team: "GROB",
        games: 0,
        goals: 0
      }
    ],
    lps12: [
      {
        s: "26",
        team: "Le\xF5es Porto Salvo",
        games: 0,
        goals: 0
      },
      {
        s: "25",
        team: "Le\xF5es Porto Salvo",
        games: 11,
        goals: 2
      },
      {
        s: "24",
        team: "AMSAC",
        games: 22,
        goals: 5
      },
      {
        s: "23",
        team: "AMSAC",
        games: 25,
        goals: 10
      },
      {
        s: "22",
        team: "AMSAC",
        games: 1,
        goals: 0
      },
      {
        s: "21",
        team: "Sporting",
        games: 8,
        goals: 4
      }
    ],
    lps13: [
      {
        s: "26",
        team: "Le\xF5es Porto Salvo",
        games: 6,
        goals: 1
      },
      {
        s: "25",
        team: "Le\xF5es Porto Salvo",
        games: 31,
        goals: 8
      },
      {
        s: "24",
        team: "AMSAC",
        games: 27,
        goals: 17
      },
      {
        s: "23",
        team: "UPVN",
        games: 15,
        goals: 9
      },
      {
        s: "22",
        team: "Estoril Praia",
        games: 26,
        goals: 21
      }
    ],
    lps14: [
      {
        s: "26",
        team: "Le\xF5es Porto Salvo",
        games: 2,
        goals: 2
      },
      {
        s: "25",
        team: "AD Fund\xE3o",
        games: 25,
        goals: 5
      },
      {
        s: "24",
        team: "AD Fund\xE3o",
        games: 14,
        goals: 2
      },
      {
        s: "23",
        team: "AD Fund\xE3o",
        games: 23,
        goals: 6
      },
      {
        s: "22",
        team: "Benfica",
        games: 33,
        goals: 35
      },
      {
        s: "21",
        team: "Benfica",
        games: 5,
        goals: 0
      }
    ],
    lps15: [
      {
        s: "26",
        team: "Le\xF5es Porto Salvo",
        games: 6,
        goals: 0
      },
      {
        s: "25",
        team: "FC Famalic\xE3o",
        games: 20,
        goals: 8
      },
      {
        s: "24",
        team: "Ferreira do Z\xEAzere",
        games: 28,
        goals: 12
      },
      {
        s: "23",
        team: "Ferreira do Z\xEAzere by Z\xEAzerovo",
        games: 21,
        goals: 4
      }
    ],
    lps16: [
      {
        s: "26",
        team: "Le\xF5es Porto Salvo",
        games: 5,
        goals: 3
      },
      {
        s: "25",
        team: "Le\xF5es Porto Salvo",
        games: 8,
        goals: 5
      },
      {
        s: "24",
        team: "Le\xF5es Porto Salvo",
        games: 32,
        goals: 18
      },
      {
        s: "23",
        team: "Le\xF5es Porto Salvo",
        games: 31,
        goals: 11
      },
      {
        s: "22",
        team: "Le\xF5es Porto Salvo",
        games: 30,
        goals: 9
      },
      {
        s: "21",
        team: "Le\xF5es Porto Salvo",
        games: 25,
        goals: 7
      }
    ],
    lps17: [
      {
        s: "26",
        team: "Le\xF5es Porto Salvo",
        games: 6,
        goals: 4
      },
      {
        s: "25",
        team: "Ferreira do Z\xEAzere",
        games: 29,
        goals: 10
      },
      {
        s: "24",
        team: "Ferreira do Z\xEAzere",
        games: 28,
        goals: 5
      },
      {
        s: "23",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 29,
        goals: 10
      },
      {
        s: "22",
        team: "Le\xF5es Porto Salvo",
        games: 21,
        goals: 3
      },
      {
        s: "21",
        team: "Le\xF5es Porto Salvo",
        games: 10,
        goals: 1
      }
    ],
    lps18: [
      {
        s: "26",
        team: "Le\xF5es Porto Salvo",
        games: 2,
        goals: 3
      },
      {
        s: "25",
        team: "Le\xF5es Porto Salvo",
        games: 5,
        goals: 0
      },
      {
        s: "24",
        team: "Le\xF5es Porto Salvo",
        games: 12,
        goals: 2
      },
      {
        s: "23",
        team: "Le\xF5es Porto Salvo",
        games: 5,
        goals: 0
      },
      {
        s: "22",
        team: "Le\xF5es Porto Salvo",
        games: 27,
        goals: 11
      },
      {
        s: "21",
        team: "Le\xF5es Porto Salvo",
        games: 12,
        goals: 29
      }
    ],
    lps19: [
      {
        s: "26",
        team: "Le\xF5es Porto Salvo",
        games: 1,
        goals: 0
      },
      {
        s: "25",
        team: "SC Barbarense",
        games: 23,
        goals: 15
      },
      {
        s: "24",
        team: "SC Barbarense",
        games: 26,
        goals: 3
      },
      {
        s: "23",
        team: "Juventude Gaia",
        games: 20,
        goals: 6
      },
      {
        s: "22",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 15,
        goals: 3
      },
      {
        s: "21",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 2,
        goals: 0
      }
    ],
    lps20: [
      {
        s: "26",
        team: "Le\xF5es Porto Salvo",
        games: 6,
        goals: 4
      },
      {
        s: "25",
        team: "El\xE9ctrico",
        games: 19,
        goals: 5
      },
      {
        s: "24",
        team: "Le\xF5es Porto Salvo",
        games: 34,
        goals: 10
      },
      {
        s: "23",
        team: "Sporting",
        games: 26,
        goals: 31
      },
      {
        s: "22",
        team: "Sporting",
        games: 34,
        goals: 57
      },
      {
        s: "21",
        team: "Sporting",
        games: 1,
        goals: 0
      }
    ],
    lps21: [
      {
        s: "26",
        team: "Le\xF5es Porto Salvo",
        games: 6,
        goals: 1
      },
      {
        s: "25",
        team: "Le\xF5es Porto Salvo",
        games: 25,
        goals: 13
      },
      {
        s: "24",
        team: "AD Jorge Antunes",
        games: 25,
        goals: 24
      },
      {
        s: "23",
        team: "SC Lusit\xE2nia",
        games: 15,
        goals: 15
      },
      {
        s: "22",
        team: "Dalia Management",
        games: 0,
        goals: 0
      },
      {
        s: "21",
        team: "Canosa",
        games: 0,
        goals: 0
      }
    ],
    lps22: [
      {
        s: "26",
        team: "Le\xF5es Porto Salvo",
        games: 3,
        goals: 4
      },
      {
        s: "25",
        team: "Le\xF5es Porto Salvo",
        games: 15,
        goals: 6
      },
      {
        s: "24",
        team: "Tojeira",
        games: 10,
        goals: 1
      },
      {
        s: "23",
        team: "Tojeira",
        games: 21,
        goals: 17
      },
      {
        s: "22",
        team: "Os Vinhais",
        games: 5,
        goals: 9
      },
      {
        s: "21",
        team: "Os Vinhais",
        games: 0,
        goals: 0
      }
    ],
    fzz01: [
      {
        s: "26",
        team: "Ferreira do Z\xEAzere",
        games: 6,
        goals: 0
      },
      {
        s: "25",
        team: "Ferreira do Z\xEAzere",
        games: 24,
        goals: 0
      },
      {
        s: "24",
        team: "Ferreira do Z\xEAzere",
        games: 25,
        goals: 0
      },
      {
        s: "23",
        team: "Le\xF5es Porto Salvo",
        games: 4,
        goals: 0
      },
      {
        s: "22",
        team: "Le\xF5es Porto Salvo",
        games: 8,
        goals: 0
      },
      {
        s: "21",
        team: "Le\xF5es Porto Salvo",
        games: 11,
        goals: 0
      }
    ],
    fzz02: [
      {
        s: "26",
        team: "Ferreira do Z\xEAzere",
        games: 0,
        goals: 0
      },
      {
        s: "25",
        team: "Ferreira do Z\xEAzere",
        games: 19,
        goals: 1
      },
      {
        s: "24",
        team: "Ferreira do Z\xEAzere",
        games: 13,
        goals: 0
      },
      {
        s: "23",
        team: "Ferreira do Z\xEAzere by Z\xEAzerovo",
        games: 24,
        goals: 3
      },
      {
        s: "22",
        team: "Ferreira do Z\xEAzere by Z\xEAzerovo",
        games: 20,
        goals: 0
      },
      {
        s: "21",
        team: "ABC Nelas",
        games: 31,
        goals: 3
      }
    ],
    fzz03: [
      {
        s: "26",
        team: "Ferreira do Z\xEAzere",
        games: 4,
        goals: 0
      },
      {
        s: "25",
        team: "CS S\xE3o Jo\xE3o",
        games: 1,
        goals: 0
      },
      {
        s: "24",
        team: "CS S\xE3o Jo\xE3o",
        games: 1,
        goals: 1
      },
      {
        s: "23",
        team: "CS S\xE3o Jo\xE3o",
        games: 28,
        goals: 4
      },
      {
        s: "22",
        team: "CS S\xE3o Jo\xE3o",
        games: 8,
        goals: 1
      },
      {
        s: "21",
        team: "Academia Condeixa",
        games: 0,
        goals: 0
      }
    ],
    fzz04: [
      {
        s: "26",
        team: "Ferreira do Z\xEAzere",
        games: 6,
        goals: 2
      },
      {
        s: "25",
        team: "Ferreira do Z\xEAzere",
        games: 28,
        goals: 10
      },
      {
        s: "24",
        team: "Ferreira do Z\xEAzere",
        games: 26,
        goals: 11
      },
      {
        s: "23",
        team: "MNK Square",
        games: 0,
        goals: 0
      },
      {
        s: "21",
        team: "Torreense",
        games: 24,
        goals: 9
      }
    ],
    fzz05: [
      {
        s: "26",
        team: "Ferreira do Z\xEAzere",
        games: 4,
        goals: 0
      },
      {
        s: "25",
        team: "Ferreira do Z\xEAzere",
        games: 24,
        goals: 3
      },
      {
        s: "24",
        team: "Black Pearl United",
        games: 0,
        goals: 0
      }
    ],
    fzz06: [
      {
        s: "26",
        team: "Ferreira do Z\xEAzere",
        games: 0,
        goals: 0
      },
      {
        s: "25",
        team: "Ferreira do Z\xEAzere",
        games: 18,
        goals: 5
      }
    ],
    fzz07: [
      {
        s: "26",
        team: "Ferreira do Z\xEAzere",
        games: 0,
        goals: 0
      },
      {
        s: "25",
        team: "Ferreira do Z\xEAzere",
        games: 0,
        goals: 0
      },
      {
        s: "24",
        team: "Ferreira do Z\xEAzere",
        games: 5,
        goals: 4
      },
      {
        s: "23",
        team: "Ferreira do Z\xEAzere",
        games: 22,
        goals: 5
      },
      {
        s: "22",
        team: "GD Ribeira Farrio",
        games: 0,
        goals: 0
      },
      {
        s: "21",
        team: "GD Ribeira Farrio",
        games: 0,
        goals: 0
      }
    ],
    fzz08: [
      {
        s: "26",
        team: "Ferreira do Z\xEAzere",
        games: 6,
        goals: 0
      },
      {
        s: "25",
        team: "Benfica",
        games: 2,
        goals: 1
      },
      {
        s: "24",
        team: "Benfica",
        games: 29,
        goals: 13
      },
      {
        s: "23",
        team: "Benfica",
        games: 1,
        goals: 2
      },
      {
        s: "22",
        team: "Benfica",
        games: 2,
        goals: 2
      },
      {
        s: "21",
        team: "Benfica",
        games: 1,
        goals: 1
      }
    ],
    fzz09: [
      {
        s: "26",
        team: "Ferreira do Z\xEAzere",
        games: 6,
        goals: 0
      },
      {
        s: "25",
        team: "Ferreira do Z\xEAzere",
        games: 30,
        goals: 6
      },
      {
        s: "24",
        team: "Ferreira do Z\xEAzere",
        games: 25,
        goals: 6
      },
      {
        s: "23",
        team: "SC Barbarense",
        games: 28,
        goals: 14
      },
      {
        s: "22",
        team: "SC Barbarense",
        games: 14,
        goals: 8
      },
      {
        s: "21",
        team: "Quinta dos Lombos",
        games: 22,
        goals: 2
      }
    ],
    fzz10: [
      {
        s: "26",
        team: "Ferreira do Z\xEAzere",
        games: 6,
        goals: 3
      },
      {
        s: "25",
        team: "Ferreira do Z\xEAzere",
        games: 0,
        goals: 0
      },
      {
        s: "24",
        team: "Futsal Pula",
        games: 0,
        goals: 0
      },
      {
        s: "23",
        team: "Le\xF5es Porto Salvo",
        games: 30,
        goals: 5
      },
      {
        s: "22",
        team: "Le\xF5es Porto Salvo",
        games: 30,
        goals: 13
      },
      {
        s: "21",
        team: "Portimonense",
        games: 25,
        goals: 12
      }
    ],
    fzz11: [
      {
        s: "26",
        team: "Ferreira do Z\xEAzere",
        games: 5,
        goals: 0
      },
      {
        s: "25",
        team: "UPVN",
        games: 21,
        goals: 7
      },
      {
        s: "24",
        team: "SC Lusit\xE2nia",
        games: 18,
        goals: 1
      },
      {
        s: "23",
        team: "Benfica",
        games: 25,
        goals: 15
      },
      {
        s: "22",
        team: "Benfica",
        games: 32,
        goals: 19
      },
      {
        s: "21",
        team: "Benfica",
        games: 1,
        goals: 0
      }
    ],
    fzz12: [
      {
        s: "26",
        team: "Ferreira do Z\xEAzere",
        games: 6,
        goals: 0
      },
      {
        s: "25",
        team: "Quinta dos Lombos",
        games: 15,
        goals: 2
      },
      {
        s: "24",
        team: "Quinta dos Lombos",
        games: 32,
        goals: 12
      },
      {
        s: "23",
        team: "Ferreira do Z\xEAzere by Z\xEAzerovo",
        games: 27,
        goals: 14
      },
      {
        s: "22",
        team: "Ferreira do Z\xEAzere by Z\xEAzerovo",
        games: 24,
        goals: 5
      },
      {
        s: "21",
        team: "Ferreira do Z\xEAzere by Z\xEAzerovo",
        games: 36,
        goals: 11
      }
    ],
    fzz13: [
      {
        s: "26",
        team: "Ferreira do Z\xEAzere",
        games: 6,
        goals: 3
      },
      {
        s: "25",
        team: "Ferreira do Z\xEAzere",
        games: 30,
        goals: 6
      },
      {
        s: "24",
        team: "Burinhosa",
        games: 32,
        goals: 33
      },
      {
        s: "23",
        team: "Burinhosa",
        games: 31,
        goals: 35
      },
      {
        s: "22",
        team: "Burinhosa",
        games: 18,
        goals: 11
      },
      {
        s: "21",
        team: "Le\xF5es Porto Salvo",
        games: 1,
        goals: 0
      }
    ],
    fzz14: [
      {
        s: "26",
        team: "Ferreira do Z\xEAzere",
        games: 6,
        goals: 1
      },
      {
        s: "25",
        team: "UPVN",
        games: 24,
        goals: 10
      },
      {
        s: "24",
        team: "SC Lusit\xE2nia",
        games: 21,
        goals: 6
      },
      {
        s: "23",
        team: "AMSAC",
        games: 29,
        goals: 24
      },
      {
        s: "22",
        team: "AMSAC",
        games: 27,
        goals: 10
      },
      {
        s: "21",
        team: "Le\xF5es Porto Salvo",
        games: 19,
        goals: 16
      }
    ],
    fzz15: [
      {
        s: "26",
        team: "Ferreira do Z\xEAzere",
        games: 6,
        goals: 4
      },
      {
        s: "25",
        team: "Ferreira do Z\xEAzere",
        games: 27,
        goals: 16
      },
      {
        s: "24",
        team: "Ferreira do Z\xEAzere",
        games: 27,
        goals: 8
      },
      {
        s: "23",
        team: "Ferreira do Z\xEAzere by Z\xEAzerovo",
        games: 28,
        goals: 7
      },
      {
        s: "22",
        team: "Ferreira do Z\xEAzere by Z\xEAzerovo",
        games: 24,
        goals: 8
      },
      {
        s: "21",
        team: "Ferreira do Z\xEAzere by Z\xEAzerovo",
        games: 34,
        goals: 23
      }
    ],
    ele01: [
      {
        s: "26",
        team: "El\xE9ctrico",
        games: 0,
        goals: 0
      },
      {
        s: "25",
        team: "El\xE9ctrico",
        games: 8,
        goals: 0
      },
      {
        s: "24",
        team: "El\xE9ctrico",
        games: 2,
        goals: 0
      },
      {
        s: "23",
        team: "El\xE9ctrico",
        games: 9,
        goals: 1
      },
      {
        s: "22",
        team: "El\xE9ctrico",
        games: 5,
        goals: 0
      },
      {
        s: "21",
        team: "Montargilense",
        games: 0,
        goals: 0
      }
    ],
    ele02: [
      {
        s: "26",
        team: "El\xE9ctrico",
        games: 2,
        goals: 0
      },
      {
        s: "25",
        team: "AD Fund\xE3o",
        games: 14,
        goals: 0
      },
      {
        s: "24",
        team: "Sporting",
        games: 25,
        goals: 0
      },
      {
        s: "23",
        team: "Sporting",
        games: 19,
        goals: 1
      },
      {
        s: "22",
        team: "Sporting",
        games: 28,
        goals: 2
      },
      {
        s: "21",
        team: "Sporting",
        games: 3,
        goals: 0
      }
    ],
    ele03: [
      {
        s: "26",
        team: "El\xE9ctrico",
        games: 6,
        goals: 1
      },
      {
        s: "25",
        team: "El\xE9ctrico",
        games: 27,
        goals: 0
      },
      {
        s: "24",
        team: "El\xE9ctrico FC/ A MatosCar",
        games: 27,
        goals: 0
      },
      {
        s: "23",
        team: "El\xE9ctrico FC/ A MatosCar",
        games: 23,
        goals: 1
      },
      {
        s: "22",
        team: "El\xE9ctrico FC/ A MatosCar",
        games: 26,
        goals: 0
      },
      {
        s: "21",
        team: "El\xE9ctrico FC/ A MatosCar",
        games: 18,
        goals: 0
      }
    ],
    ele04: [
      {
        s: "26",
        team: "El\xE9ctrico",
        games: 6,
        goals: 1
      },
      {
        s: "25",
        team: "Riga FC",
        games: 15,
        goals: 3
      },
      {
        s: "24",
        team: "El\xE9ctrico FC/ A MatosCar",
        games: 25,
        goals: 4
      },
      {
        s: "23",
        team: "El\xE9ctrico FC/ A MatosCar",
        games: 25,
        goals: 4
      },
      {
        s: "22",
        team: "El\xE9ctrico FC/ A MatosCar",
        games: 27,
        goals: 4
      },
      {
        s: "21",
        team: "El\xE9ctrico FC/ A MatosCar",
        games: 33,
        goals: 8
      }
    ],
    ele05: [
      {
        s: "26",
        team: "El\xE9ctrico",
        games: 6,
        goals: 3
      },
      {
        s: "25",
        team: "El\xE9ctrico",
        games: 27,
        goals: 8
      },
      {
        s: "24",
        team: "El\xE9ctrico",
        games: 27,
        goals: 10
      },
      {
        s: "23",
        team: "Quinta dos Lombos",
        games: 22,
        goals: 5
      },
      {
        s: "22",
        team: "Quinta dos Lombos",
        games: 29,
        goals: 8
      },
      {
        s: "21",
        team: "AMSAC",
        games: 33,
        goals: 17
      }
    ],
    ele06: [
      {
        s: "26",
        team: "El\xE9ctrico",
        games: 0,
        goals: 0
      }
    ],
    ele07: [
      {
        s: "26",
        team: "El\xE9ctrico",
        games: 6,
        goals: 2
      },
      {
        s: "25",
        team: "El\xE9ctrico",
        games: 13,
        goals: 2
      },
      {
        s: "24",
        team: "Quinta dos Lombos",
        games: 25,
        goals: 7
      },
      {
        s: "23",
        team: "SC Lusit\xE2nia",
        games: 25,
        goals: 11
      },
      {
        s: "22",
        team: "Benfica",
        games: 30,
        goals: 16
      },
      {
        s: "21",
        team: "Benfica",
        games: 17,
        goals: 3
      }
    ],
    ele08: [
      {
        s: "26",
        team: "El\xE9ctrico",
        games: 5,
        goals: 0
      },
      {
        s: "25",
        team: "Sporting",
        games: 1,
        goals: 0
      },
      {
        s: "24",
        team: "Sporting",
        games: 11,
        goals: 6
      },
      {
        s: "23",
        team: "Sporting",
        games: 11,
        goals: 4
      },
      {
        s: "22",
        team: "Sporting",
        games: 27,
        goals: 2
      },
      {
        s: "21",
        team: "Sporting",
        games: 18,
        goals: 13
      }
    ],
    ele09: [
      {
        s: "26",
        team: "El\xE9ctrico",
        games: 6,
        goals: 3
      },
      {
        s: "25",
        team: "Quinta dos Lombos",
        games: 19,
        goals: 7
      },
      {
        s: "24",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 19,
        goals: 5
      },
      {
        s: "23",
        team: "SC Lusit\xE2nia",
        games: 23,
        goals: 15
      }
    ],
    ele10: [
      {
        s: "26",
        team: "El\xE9ctrico",
        games: 6,
        goals: 3
      },
      {
        s: "25",
        team: "El\xE9ctrico",
        games: 24,
        goals: 3
      },
      {
        s: "24",
        team: "Portimonense",
        games: 24,
        goals: 8
      },
      {
        s: "23",
        team: "Portimonense",
        games: 29,
        goals: 22
      },
      {
        s: "22",
        team: "Benfica",
        games: 27,
        goals: 12
      },
      {
        s: "21",
        team: "Inter-Vivos",
        games: 0,
        goals: 0
      }
    ],
    ele11: [
      {
        s: "26",
        team: "El\xE9ctrico",
        games: 6,
        goals: 3
      },
      {
        s: "25",
        team: "El\xE9ctrico",
        games: 28,
        goals: 11
      },
      {
        s: "24",
        team: "El\xE9ctrico",
        games: 24,
        goals: 10
      },
      {
        s: "23",
        team: "Quinta dos Lombos",
        games: 23,
        goals: 8
      },
      {
        s: "22",
        team: "Quinta dos Lombos",
        games: 26,
        goals: 15
      },
      {
        s: "21",
        team: "Quinta dos Lombos",
        games: 31,
        goals: 15
      }
    ],
    ele12: [
      {
        s: "26",
        team: "El\xE9ctrico",
        games: 1,
        goals: 0
      },
      {
        s: "25",
        team: "Magallanes",
        games: 0,
        goals: 0
      },
      {
        s: "24",
        team: "Magallanes",
        games: 0,
        goals: 0
      }
    ],
    ele13: [
      {
        s: "26",
        team: "El\xE9ctrico",
        games: 3,
        goals: 0
      },
      {
        s: "25",
        team: "Ny\xEDrb\xE1tori",
        games: 8,
        goals: 8
      }
    ],
    ele14: [
      {
        s: "26",
        team: "El\xE9ctrico",
        games: 6,
        goals: 0
      },
      {
        s: "25",
        team: "UPVN",
        games: 25,
        goals: 7
      },
      {
        s: "24",
        team: "Sporting",
        games: 24,
        goals: 13
      },
      {
        s: "23",
        team: "AMSAC",
        games: 1,
        goals: 0
      },
      {
        s: "22",
        team: "Sporting",
        games: 29,
        goals: 22
      },
      {
        s: "21",
        team: "Belenenses",
        games: 21,
        goals: 12
      }
    ],
    ele15: [
      {
        s: "26",
        team: "El\xE9ctrico",
        games: 4,
        goals: 0
      },
      {
        s: "25",
        team: "Sibiryak",
        games: 2,
        goals: 2
      },
      {
        s: "24",
        team: "Tyumen",
        games: 0,
        goals: 0
      }
    ],
    rav01: [
      {
        s: "26",
        team: "Rio Ave",
        games: 1,
        goals: 0
      },
      {
        s: "25",
        team: "Rio Ave",
        games: 5,
        goals: 0
      },
      {
        s: "24",
        team: "Rio Ave",
        games: 1,
        goals: 0
      },
      {
        s: "23",
        team: "Ascen\xE7\xE3o FC",
        games: 20,
        goals: 0
      },
      {
        s: "22",
        team: "Ascen\xE7\xE3o FC",
        games: 7,
        goals: 0
      },
      {
        s: "21",
        team: "Ascen\xE7\xE3o FC",
        games: 0,
        goals: 0
      }
    ],
    rav02: [
      {
        s: "26",
        team: "Rio Ave",
        games: 5,
        goals: 0
      },
      {
        s: "25",
        team: "Rio Ave",
        games: 22,
        goals: 2
      },
      {
        s: "24",
        team: "Mar\xEDtimo",
        games: 22,
        goals: 1
      },
      {
        s: "23",
        team: "Mar\xEDtimo",
        games: 16,
        goals: 1
      },
      {
        s: "22",
        team: "Mar\xEDtimo",
        games: 25,
        goals: 2
      },
      {
        s: "21",
        team: "Mar\xEDtimo",
        games: 33,
        goals: 7
      }
    ],
    rav03: [
      {
        s: "26",
        team: "Rio Ave",
        games: 3,
        goals: 0
      },
      {
        s: "25",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 16,
        goals: 0
      },
      {
        s: "24",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 21,
        goals: 0
      },
      {
        s: "23",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 13,
        goals: 1
      },
      {
        s: "22",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 18,
        goals: 0
      },
      {
        s: "21",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 36,
        goals: 1
      }
    ],
    rav04: [
      {
        s: "26",
        team: "Rio Ave",
        games: 6,
        goals: 0
      },
      {
        s: "25",
        team: "Rio Ave",
        games: 25,
        goals: 8
      },
      {
        s: "24",
        team: "Rio Ave",
        games: 25,
        goals: 5
      },
      {
        s: "23",
        team: "SCC/FC Famalic\xE3o",
        games: 24,
        goals: 5
      },
      {
        s: "22",
        team: "Pa\xE7os de Ferreira Redifogo Futsal",
        games: 29,
        goals: 5
      },
      {
        s: "21",
        team: "Pa\xE7os de Ferreira Redifogo Futsal",
        games: 9,
        goals: 2
      }
    ],
    rav05: [
      {
        s: "26",
        team: "Rio Ave",
        games: 6,
        goals: 2
      },
      {
        s: "25",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 19,
        goals: 3
      },
      {
        s: "24",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 2,
        goals: 0
      },
      {
        s: "23",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 8,
        goals: 0
      },
      {
        s: "22",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 11,
        goals: 5
      },
      {
        s: "21",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 23,
        goals: 16
      }
    ],
    rav06: [
      {
        s: "26",
        team: "Rio Ave",
        games: 6,
        goals: 0
      },
      {
        s: "25",
        team: "Rio Ave",
        games: 25,
        goals: 5
      },
      {
        s: "24",
        team: "Rio Ave",
        games: 24,
        goals: 5
      },
      {
        s: "23",
        team: "Rio Ave",
        games: 30,
        goals: 22
      },
      {
        s: "22",
        team: "Rio Ave",
        games: 23,
        goals: 11
      },
      {
        s: "21",
        team: "CA Sangemil",
        games: 14,
        goals: 8
      }
    ],
    rav07: [
      {
        s: "26",
        team: "Rio Ave",
        games: 6,
        goals: 3
      },
      {
        s: "25",
        team: "MNK Osijek",
        games: 1,
        goals: 1
      },
      {
        s: "24",
        team: "Sporting",
        games: 36,
        goals: 8
      },
      {
        s: "23",
        team: "El\xE9ctrico FC/ A MatosCar",
        games: 23,
        goals: 7
      },
      {
        s: "22",
        team: "El\xE9ctrico FC/ A MatosCar",
        games: 27,
        goals: 12
      },
      {
        s: "21",
        team: "Futsal Azem\xE9is",
        games: 32,
        goals: 9
      }
    ],
    rav08: [
      {
        s: "26",
        team: "Rio Ave",
        games: 6,
        goals: 0
      },
      {
        s: "25",
        team: "Rio Ave",
        games: 25,
        goals: 2
      },
      {
        s: "24",
        team: "D\xEDnamo Sanjoanense",
        games: 12,
        goals: 4
      },
      {
        s: "23",
        team: "El\xE9ctrico FC/ A MatosCar",
        games: 23,
        goals: 2
      },
      {
        s: "22",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 27,
        goals: 4
      },
      {
        s: "21",
        team: "El\xE9ctrico FC/ A MatosCar",
        games: 28,
        goals: 4
      }
    ],
    rav09: [
      {
        s: "26",
        team: "Rio Ave",
        games: 2,
        goals: 0
      },
      {
        s: "25",
        team: "Rio Ave",
        games: 26,
        goals: 3
      },
      {
        s: "24",
        team: "Rio Ave",
        games: 27,
        goals: 13
      },
      {
        s: "23",
        team: "Rio Ave",
        games: 28,
        goals: 17
      },
      {
        s: "22",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 27,
        goals: 7
      },
      {
        s: "21",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 36,
        goals: 7
      }
    ],
    rav10: [
      {
        s: "26",
        team: "Rio Ave",
        games: 4,
        goals: 2
      },
      {
        s: "25",
        team: "SC Braga",
        games: 25,
        goals: 7
      },
      {
        s: "24",
        team: "SC Braga",
        games: 34,
        goals: 13
      },
      {
        s: "23",
        team: "SC Braga",
        games: 29,
        goals: 1
      },
      {
        s: "22",
        team: "AD Fund\xE3o",
        games: 26,
        goals: 10
      },
      {
        s: "21",
        team: "AD Fund\xE3o",
        games: 33,
        goals: 11
      }
    ],
    rav11: [
      {
        s: "26",
        team: "Rio Ave",
        games: 5,
        goals: 3
      },
      {
        s: "25",
        team: "Fortitudo Pomezia",
        games: 26,
        goals: 12
      },
      {
        s: "24",
        team: "Fortitudo Pomezia",
        games: 20,
        goals: 9
      },
      {
        s: "23",
        team: "Fortitudo Pomezia",
        games: 27,
        goals: 13
      },
      {
        s: "22",
        team: "Sporting",
        games: 25,
        goals: 7
      },
      {
        s: "21",
        team: "Sporting",
        games: 39,
        goals: 8
      }
    ],
    rav12: [
      {
        s: "26",
        team: "Rio Ave",
        games: 6,
        goals: 0
      },
      {
        s: "25",
        team: "Rio Ave",
        games: 23,
        goals: 4
      },
      {
        s: "24",
        team: "D\xEDnamo Sanjoanense",
        games: 24,
        goals: 1
      },
      {
        s: "23",
        team: "D\xEDnamo Sanjoanense",
        games: 30,
        goals: 8
      },
      {
        s: "22",
        team: "CR Candoso/Natcal",
        games: 11,
        goals: 1
      },
      {
        s: "21",
        team: "CR Candoso/Natcal",
        games: 29,
        goals: 0
      }
    ],
    rav13: [
      {
        s: "26",
        team: "Rio Ave",
        games: 6,
        goals: 4
      },
      {
        s: "25",
        team: "Rio Ave",
        games: 27,
        goals: 17
      },
      {
        s: "24",
        team: "D\xEDnamo Sanjoanense",
        games: 21,
        goals: 16
      },
      {
        s: "23",
        team: "D\xEDnamo Sanjoanense",
        games: 29,
        goals: 30
      },
      {
        s: "22",
        team: "D\xEDnamo Sanjoanense",
        games: 35,
        goals: 29
      },
      {
        s: "21",
        team: "SC Braga",
        games: 24,
        goals: 7
      }
    ],
    rav14: [
      {
        s: "26",
        team: "Rio Ave",
        games: 5,
        goals: 0
      },
      {
        s: "25",
        team: "Rio Ave",
        games: 13,
        goals: 6
      },
      {
        s: "24",
        team: "Rio Ave",
        games: 5,
        goals: 0
      },
      {
        s: "23",
        team: "Rio Ave",
        games: 9,
        goals: 0
      }
    ],
    rav15: [
      {
        s: "26",
        team: "Rio Ave",
        games: 6,
        goals: 1
      },
      {
        s: "25",
        team: "Rio Ave",
        games: 18,
        goals: 5
      },
      {
        s: "24",
        team: "Boavista FC",
        games: 23,
        goals: 16
      },
      {
        s: "23",
        team: "Boavista FC",
        games: 25,
        goals: 15
      },
      {
        s: "22",
        team: "Boavista FC",
        games: 21,
        goals: 9
      },
      {
        s: "21",
        team: "Boavista FC",
        games: 12,
        goals: 1
      }
    ],
    rav16: [
      {
        s: "26",
        team: "Rio Ave",
        games: 6,
        goals: 3
      },
      {
        s: "25",
        team: "Panta Walon",
        games: 5,
        goals: 4
      },
      {
        s: "24",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 22,
        goals: 11
      }
    ],
    uvn01: [
      {
        s: "26",
        team: "UPVN",
        games: 0,
        goals: 0
      },
      {
        s: "25",
        team: "CF Sassoeiros",
        games: 2,
        goals: 0
      },
      {
        s: "24",
        team: "Juventude Castanheira",
        games: 4,
        goals: 0
      },
      {
        s: "23",
        team: "Belenenses",
        games: 27,
        goals: 0
      },
      {
        s: "22",
        team: "Belenenses",
        games: 1,
        goals: 0
      },
      {
        s: "21",
        team: "Atl\xE9tico CP",
        games: 0,
        goals: 0
      }
    ],
    uvn02: [
      {
        s: "26",
        team: "UPVN",
        games: 1,
        goals: 0
      },
      {
        s: "25",
        team: "UPVN",
        games: 9,
        goals: 0
      },
      {
        s: "24",
        team: "AMSAC",
        games: 23,
        goals: 3
      },
      {
        s: "23",
        team: "UPVN",
        games: 24,
        goals: 1
      },
      {
        s: "22",
        team: "Torreense",
        games: 16,
        goals: 0
      },
      {
        s: "21",
        team: "Sporting",
        games: 1,
        goals: 0
      }
    ],
    uvn03: [
      {
        s: "26",
        team: "UPVN",
        games: 6,
        goals: 0
      }
    ],
    uvn04: [
      {
        s: "26",
        team: "UPVN",
        games: 0,
        goals: 0
      },
      {
        s: "25",
        team: "Carregado",
        games: 19,
        goals: 1
      },
      {
        s: "24",
        team: "Manjoeira",
        games: 14,
        goals: 0
      },
      {
        s: "23",
        team: "Forte da Casa",
        games: 30,
        goals: 4
      },
      {
        s: "22",
        team: "Forte da Casa",
        games: 23,
        goals: 1
      },
      {
        s: "21",
        team: "CAD",
        games: 0,
        goals: 0
      }
    ],
    uvn05: [
      {
        s: "26",
        team: "UPVN",
        games: 5,
        goals: 0
      },
      {
        s: "25",
        team: "UPVN",
        games: 21,
        goals: 4
      },
      {
        s: "24",
        team: "AMSAC",
        games: 26,
        goals: 5
      },
      {
        s: "23",
        team: "Sporting",
        games: 17,
        goals: 7
      },
      {
        s: "22",
        team: "Sporting",
        games: 24,
        goals: 5
      },
      {
        s: "21",
        team: "Sporting",
        games: 3,
        goals: 0
      }
    ],
    uvn06: [
      {
        s: "26",
        team: "UPVN",
        games: 6,
        goals: 2
      },
      {
        s: "25",
        team: "Quinta dos Lombos",
        games: 23,
        goals: 3
      },
      {
        s: "24",
        team: "Quinta dos Lombos",
        games: 13,
        goals: 4
      },
      {
        s: "23",
        team: "AMSAC",
        games: 21,
        goals: 6
      },
      {
        s: "22",
        team: "AMSAC",
        games: 28,
        goals: 5
      },
      {
        s: "21",
        team: "Benfica",
        games: 2,
        goals: 1
      }
    ],
    uvn07: [
      {
        s: "26",
        team: "UPVN",
        games: 2,
        goals: 0
      },
      {
        s: "25",
        team: "UPVN",
        games: 22,
        goals: 16
      },
      {
        s: "24",
        team: "UPVN",
        games: 22,
        goals: 11
      },
      {
        s: "23",
        team: "S\xE3o Br\xE1s",
        games: 23,
        goals: 6
      }
    ],
    uvn08: [
      {
        s: "26",
        team: "UPVN",
        games: 4,
        goals: 0
      },
      {
        s: "25",
        team: "AMSAC",
        games: 22,
        goals: 7
      },
      {
        s: "24",
        team: "AMSAC",
        games: 27,
        goals: 8
      },
      {
        s: "23",
        team: "AMSAC",
        games: 29,
        goals: 5
      },
      {
        s: "22",
        team: "Sporting",
        games: 31,
        goals: 10
      },
      {
        s: "21",
        team: "Sporting",
        games: 22,
        goals: 3
      }
    ],
    uvn09: [
      {
        s: "26",
        team: "UPVN",
        games: 6,
        goals: 1
      },
      {
        s: "25",
        team: "UPVN",
        games: 23,
        goals: 8
      },
      {
        s: "24",
        team: "AMSAC",
        games: 25,
        goals: 12
      },
      {
        s: "23",
        team: "Belenenses",
        games: 21,
        goals: 6
      },
      {
        s: "22",
        team: "AD Fund\xE3o",
        games: 23,
        goals: 2
      },
      {
        s: "21",
        team: "Benfica",
        games: 1,
        goals: 0
      }
    ],
    uvn10: [
      {
        s: "26",
        team: "UPVN",
        games: 4,
        goals: 1
      },
      {
        s: "25",
        team: "AGSL/OSK",
        games: 0,
        goals: 0
      },
      {
        s: "24",
        team: "Ordabasy",
        games: 0,
        goals: 0
      },
      {
        s: "23",
        team: "Omonia",
        games: 0,
        goals: 0
      },
      {
        s: "22",
        team: "New Vision Georgians",
        games: 0,
        goals: 0
      },
      {
        s: "21",
        team: "United Galati",
        games: 3,
        goals: 0
      }
    ],
    uvn11: [
      {
        s: "26",
        team: "UPVN",
        games: 6,
        goals: 0
      },
      {
        s: "25",
        team: "AD Fund\xE3o",
        games: 25,
        goals: 1
      },
      {
        s: "24",
        team: "AD Fund\xE3o",
        games: 26,
        goals: 3
      },
      {
        s: "23",
        team: "SC Lusit\xE2nia",
        games: 23,
        goals: 10
      },
      {
        s: "22",
        team: "ACD Ladoeiro",
        games: 1,
        goals: 0
      },
      {
        s: "21",
        team: "AD Fund\xE3o",
        games: 9,
        goals: 0
      }
    ],
    uvn12: [
      {
        s: "26",
        team: "UPVN",
        games: 5,
        goals: 3
      },
      {
        s: "25",
        team: "UPVN",
        games: 23,
        goals: 13
      },
      {
        s: "24",
        team: "UPVN",
        games: 30,
        goals: 28
      },
      {
        s: "23",
        team: "Torreense",
        games: 9,
        goals: 3
      },
      {
        s: "22",
        team: "Torreense",
        games: 25,
        goals: 8
      },
      {
        s: "21",
        team: "AMSAC",
        games: 34,
        goals: 25
      }
    ],
    uvn13: [
      {
        s: "26",
        team: "UPVN",
        games: 6,
        goals: 2
      },
      {
        s: "25",
        team: "UPVN",
        games: 22,
        goals: 6
      },
      {
        s: "24",
        team: "UPVN",
        games: 29,
        goals: 11
      },
      {
        s: "23",
        team: "UPVN",
        games: 25,
        goals: 18
      },
      {
        s: "22",
        team: "UPVN",
        games: 32,
        goals: 27
      },
      {
        s: "21",
        team: "Le\xF5es Porto Salvo",
        games: 24,
        goals: 9
      }
    ],
    uvn14: [
      {
        s: "26",
        team: "UPVN",
        games: 4,
        goals: 0
      },
      {
        s: "25",
        team: "UPVN",
        games: 12,
        goals: 10
      },
      {
        s: "24",
        team: "Ferreira do Z\xEAzere",
        games: 17,
        goals: 4
      },
      {
        s: "23",
        team: "Quinta dos Lombos",
        games: 18,
        goals: 4
      },
      {
        s: "22",
        team: "Sporting",
        games: 35,
        goals: 34
      },
      {
        s: "21",
        team: "Sporting",
        games: 2,
        goals: 0
      }
    ],
    uvn15: [
      {
        s: "26",
        team: "UPVN",
        games: 4,
        goals: 3
      },
      {
        s: "25",
        team: "Kaspiy Aktau",
        games: 0,
        goals: 0
      }
    ],
    uvn16: [
      {
        s: "26",
        team: "UPVN",
        games: 1,
        goals: 1
      },
      {
        s: "25",
        team: "Sporting",
        games: 1,
        goals: 0
      },
      {
        s: "24",
        team: "Sporting",
        games: 22,
        goals: 16
      },
      {
        s: "23",
        team: "Le\xF5es Porto Salvo",
        games: 4,
        goals: 3
      },
      {
        s: "22",
        team: "Le\xF5es Porto Salvo",
        games: 23,
        goals: 12
      },
      {
        s: "21",
        team: "Le\xF5es Porto Salvo",
        games: 11,
        goals: 18
      }
    ],
    uvn17: [
      {
        s: "26",
        team: "Belenenses",
        games: 5,
        goals: 2
      },
      {
        s: "25",
        team: "UPVN",
        games: 26,
        goals: 12
      },
      {
        s: "24",
        team: "CF Sassoeiros",
        games: 23,
        goals: 11
      },
      {
        s: "23",
        team: "AMSAC",
        games: 30,
        goals: 10
      },
      {
        s: "22",
        team: "Le\xF5es Porto Salvo",
        games: 19,
        goals: 11
      },
      {
        s: "21",
        team: "Benfica",
        games: 19,
        goals: 10
      }
    ],
    uvn18: [
      {
        s: "26",
        team: "Reguilas Tires",
        games: 2,
        goals: 0
      },
      {
        s: "25",
        team: "Belenenses",
        games: 18,
        goals: 9
      },
      {
        s: "24",
        team: "Belenenses",
        games: 25,
        goals: 8
      },
      {
        s: "23",
        team: "Belenenses",
        games: 8,
        goals: 4
      },
      {
        s: "22",
        team: "Belenenses",
        games: 5,
        goals: 1
      },
      {
        s: "21",
        team: "Le\xF5es Porto Salvo",
        games: 19,
        goals: 2
      }
    ],
    uvn19: [
      {
        s: "26",
        team: "UPVN",
        games: 4,
        goals: 0
      },
      {
        s: "25",
        team: "AMSAC",
        games: 25,
        goals: 13
      },
      {
        s: "24",
        team: "UPVN",
        games: 22,
        goals: 4
      },
      {
        s: "23",
        team: "AMSAC",
        games: 12,
        goals: 0
      },
      {
        s: "22",
        team: "Sporting",
        games: 16,
        goals: 1
      },
      {
        s: "21",
        team: "Sporting",
        games: 6,
        goals: 5
      }
    ],
    uvn20: [
      {
        s: "26",
        team: "UPVN",
        games: 6,
        goals: 1
      },
      {
        s: "25",
        team: "UPVN",
        games: 22,
        goals: 11
      },
      {
        s: "24",
        team: "UPVN",
        games: 26,
        goals: 13
      },
      {
        s: "23",
        team: "Quinta dos Lombos",
        games: 17,
        goals: 2
      },
      {
        s: "22",
        team: "UPVN",
        games: 17,
        goals: 14
      },
      {
        s: "21",
        team: "Le\xF5es Porto Salvo",
        games: 0,
        goals: 0
      }
    ],
    por01: [
      {
        s: "26",
        team: "Portimonense",
        games: 0,
        goals: 0
      },
      {
        s: "25",
        team: "GD Lagoa",
        games: 6,
        goals: 0
      },
      {
        s: "24",
        team: "Pedra Mourinha",
        games: 24,
        goals: 0
      },
      {
        s: "23",
        team: "Pedra Mourinha",
        games: 24,
        goals: 0
      },
      {
        s: "22",
        team: "Lagoenses",
        games: 18,
        goals: 0
      }
    ],
    por02: [
      {
        s: "26",
        team: "Portimonense",
        games: 6,
        goals: 0
      },
      {
        s: "25",
        team: "Portimonense",
        games: 29,
        goals: 2
      },
      {
        s: "24",
        team: "Portimonense",
        games: 26,
        goals: 2
      },
      {
        s: "23",
        team: "AD Fund\xE3o",
        games: 15,
        goals: 0
      },
      {
        s: "22",
        team: "AD Fund\xE3o",
        games: 15,
        goals: 0
      },
      {
        s: "21",
        team: "ACD Ladoeiro",
        games: 33,
        goals: 0
      }
    ],
    por03: [
      {
        s: "26",
        team: "Portimonense",
        games: 2,
        goals: 0
      },
      {
        s: "25",
        team: "Rio Ave",
        games: 19,
        goals: 0
      },
      {
        s: "24",
        team: "Rio Ave",
        games: 27,
        goals: 3
      },
      {
        s: "23",
        team: "Rio Ave",
        games: 28,
        goals: 1
      },
      {
        s: "22",
        team: "Rio Ave",
        games: 24,
        goals: 2
      },
      {
        s: "21",
        team: "D\xEDnamo Sanjoanense",
        games: 14,
        goals: 0
      }
    ],
    por04: [
      {
        s: "26",
        team: "Portimonense",
        games: 2,
        goals: 0
      },
      {
        s: "25",
        team: "Portimonense",
        games: 31,
        goals: 1
      },
      {
        s: "24",
        team: "Portimonense",
        games: 23,
        goals: 0
      },
      {
        s: "23",
        team: "Portimonense",
        games: 1,
        goals: 0
      },
      {
        s: "22",
        team: "Portimonense",
        games: 11,
        goals: 0
      },
      {
        s: "21",
        team: "Portimonense",
        games: 0,
        goals: 0
      }
    ],
    por05: [
      {
        s: "26",
        team: "Portimonense",
        games: 4,
        goals: 0
      },
      {
        s: "25",
        team: "AD Fund\xE3o",
        games: 16,
        goals: 4
      },
      {
        s: "24",
        team: "AD Fund\xE3o",
        games: 11,
        goals: 1
      },
      {
        s: "23",
        team: "AD Fund\xE3o",
        games: 22,
        goals: 3
      },
      {
        s: "22",
        team: "AD Fund\xE3o",
        games: 18,
        goals: 3
      },
      {
        s: "21",
        team: "AD Fund\xE3o",
        games: 17,
        goals: 2
      }
    ],
    por06: [
      {
        s: "26",
        team: "Portimonense",
        games: 6,
        goals: 0
      },
      {
        s: "25",
        team: "Portimonense",
        games: 26,
        goals: 9
      },
      {
        s: "24",
        team: "Modicus Bruval",
        games: 24,
        goals: 4
      },
      {
        s: "23",
        team: "Modicus Bruval",
        games: 28,
        goals: 18
      },
      {
        s: "22",
        team: "Modicus Bruval",
        games: 33,
        goals: 12
      },
      {
        s: "21",
        team: "ACD Ladoeiro",
        games: 30,
        goals: 17
      }
    ],
    por07: [
      {
        s: "26",
        team: "Portimonense",
        games: 6,
        goals: 3
      },
      {
        s: "25",
        team: "Portimonense",
        games: 9,
        goals: 4
      },
      {
        s: "24",
        team: "Modicus",
        games: 29,
        goals: 9
      },
      {
        s: "23",
        team: "SC Lusit\xE2nia",
        games: 17,
        goals: 21
      }
    ],
    por08: [
      {
        s: "26",
        team: "Portimonense",
        games: 4,
        goals: 2
      },
      {
        s: "25",
        team: "Portimonense",
        games: 3,
        goals: 2
      },
      {
        s: "24",
        team: "Portimonense",
        games: 26,
        goals: 28
      },
      {
        s: "23",
        team: "Portimonense",
        games: 12,
        goals: 10
      },
      {
        s: "22",
        team: "Ferragudense",
        games: 0,
        goals: 0
      },
      {
        s: "21",
        team: "Ferragudense",
        games: 0,
        goals: 0
      }
    ],
    por09: [
      {
        s: "26",
        team: "Portimonense",
        games: 6,
        goals: 0
      },
      {
        s: "25",
        team: "Portimonense",
        games: 29,
        goals: 12
      },
      {
        s: "24",
        team: "Albufeira Futsal",
        games: 24,
        goals: 15
      },
      {
        s: "23",
        team: "Pedra Mourinha",
        games: 27,
        goals: 40
      },
      {
        s: "22",
        team: "Albufeira Futsal",
        games: 28,
        goals: 9
      },
      {
        s: "21",
        team: "Portimonense",
        games: 17,
        goals: 7
      }
    ],
    por10: [
      {
        s: "26",
        team: "Portimonense",
        games: 6,
        goals: 4
      },
      {
        s: "25",
        team: "Portimonense",
        games: 31,
        goals: 26
      },
      {
        s: "24",
        team: "Portimonense",
        games: 13,
        goals: 5
      },
      {
        s: "23",
        team: "Torreense",
        games: 8,
        goals: 1
      },
      {
        s: "22",
        team: "Portimonense",
        games: 12,
        goals: 8
      },
      {
        s: "21",
        team: "Quinta dos Lombos",
        games: 29,
        goals: 4
      }
    ],
    por11: [
      {
        s: "26",
        team: "Portimonense",
        games: 6,
        goals: 3
      },
      {
        s: "25",
        team: "Viseu 2001",
        games: 17,
        goals: 10
      },
      {
        s: "24",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 7,
        goals: 4
      },
      {
        s: "21",
        team: "Torreense",
        games: 26,
        goals: 11
      }
    ],
    por12: [
      {
        s: "26",
        team: "Portimonense",
        games: 6,
        goals: 2
      },
      {
        s: "25",
        team: "Portimonense",
        games: 28,
        goals: 14
      },
      {
        s: "24",
        team: "Portimonense",
        games: 25,
        goals: 6
      },
      {
        s: "23",
        team: "Portimonense",
        games: 1,
        goals: 0
      }
    ],
    por13: [
      {
        s: "26",
        team: "Portimonense",
        games: 0,
        goals: 0
      },
      {
        s: "25",
        team: "SC Barbarense",
        games: 22,
        goals: 15
      },
      {
        s: "24",
        team: "SC Barbarense",
        games: 23,
        goals: 9
      },
      {
        s: "23",
        team: "Le\xF5es Porto Salvo",
        games: 20,
        goals: 7
      },
      {
        s: "22",
        team: "Reguilas Tires",
        games: 8,
        goals: 0
      },
      {
        s: "21",
        team: "Sporting",
        games: 15,
        goals: 1
      }
    ],
    por14: [
      {
        s: "26",
        team: "Portimonense",
        games: 2,
        goals: 3
      },
      {
        s: "25",
        team: "Portimonense",
        games: 9,
        goals: 16
      },
      {
        s: "24",
        team: "Portimonense",
        games: 8,
        goals: 12
      },
      {
        s: "23",
        team: "Portimonense",
        games: 15,
        goals: 16
      },
      {
        s: "22",
        team: "Portimonense",
        games: 0,
        goals: 0
      },
      {
        s: "21",
        team: "Portimonense",
        games: 12,
        goals: 15
      }
    ],
    por15: [
      {
        s: "26",
        team: "Portimonense",
        games: 6,
        goals: 1
      },
      {
        s: "25",
        team: "Portimonense",
        games: 25,
        goals: 21
      },
      {
        s: "24",
        team: "Albufeira Futsal",
        games: 24,
        goals: 44
      },
      {
        s: "23",
        team: "Pedra Mourinha",
        games: 7,
        goals: 13
      },
      {
        s: "22",
        team: "Albufeira Futsal",
        games: 22,
        goals: 28
      },
      {
        s: "21",
        team: "Portimonense",
        games: 24,
        goals: 8
      }
    ],
    por16: [
      {
        s: "26",
        team: "Portimonense",
        games: 6,
        goals: 1
      },
      {
        s: "25",
        team: "Le\xF5es Porto Salvo",
        games: 28,
        goals: 3
      },
      {
        s: "24",
        team: "Sporting",
        games: 15,
        goals: 1
      },
      {
        s: "23",
        team: "Sporting",
        games: 5,
        goals: 2
      },
      {
        s: "22",
        team: "Burinhosa",
        games: 8,
        goals: 6
      },
      {
        s: "21",
        team: "CCR Telheiro",
        games: 3,
        goals: 3
      }
    ],
    por17: [
      {
        s: "26",
        team: "Portimonense",
        games: 6,
        goals: 2
      },
      {
        s: "25",
        team: "Araz Nax\xE7ivan",
        games: 8,
        goals: 5
      },
      {
        s: "24",
        team: "Anderlecht",
        games: 15,
        goals: 3
      },
      {
        s: "23",
        team: "Halad\xE1s",
        games: 6,
        goals: 1
      },
      {
        s: "22",
        team: "Halad\xE1s",
        games: 3,
        goals: 0
      },
      {
        s: "21",
        team: "Halad\xE1s",
        games: 8,
        goals: 3
      }
    ],
    por18: [
      {
        s: "26",
        team: "Portimonense",
        games: 1,
        goals: 0
      },
      {
        s: "25",
        team: "Portimonense",
        games: 31,
        goals: 11
      },
      {
        s: "24",
        team: "Portimonense",
        games: 15,
        goals: 9
      },
      {
        s: "23",
        team: "Benfica",
        games: 26,
        goals: 29
      },
      {
        s: "22",
        team: "Benfica",
        games: 33,
        goals: 26
      },
      {
        s: "21",
        team: "Benfica",
        games: 19,
        goals: 19
      }
    ],
    fam01: [
      {
        s: "26",
        team: "FC Famalic\xE3o",
        games: 3,
        goals: 0
      },
      {
        s: "25",
        team: "Quinta dos Lombos",
        games: 14,
        goals: 1
      },
      {
        s: "24",
        team: "AD Fund\xE3o",
        games: 21,
        goals: 1
      },
      {
        s: "23",
        team: "SC Braga",
        games: 6,
        goals: 0
      },
      {
        s: "22",
        team: "SC Braga",
        games: 8,
        goals: 1
      },
      {
        s: "21",
        team: "SC Braga",
        games: 3,
        goals: 0
      }
    ],
    fam02: [
      {
        s: "26",
        team: "FC Famalic\xE3o",
        games: 0,
        goals: 0
      },
      {
        s: "25",
        team: "FC Famalic\xE3o",
        games: 8,
        goals: 0
      },
      {
        s: "24",
        team: "SCC/FC Famalic\xE3o",
        games: 19,
        goals: 0
      },
      {
        s: "23",
        team: "SCC/FC Famalic\xE3o",
        games: 26,
        goals: 0
      },
      {
        s: "22",
        team: "SCC/FC Famalic\xE3o",
        games: 26,
        goals: 0
      },
      {
        s: "21",
        team: "SCC/FC Famalic\xE3o",
        games: 22,
        goals: 0
      }
    ],
    fam03: [
      {
        s: "26",
        team: "FC Famalic\xE3o",
        games: 0,
        goals: 0
      },
      {
        s: "25",
        team: "ACR Lordelo",
        games: 10,
        goals: 0
      },
      {
        s: "24",
        team: "FC Famalic\xE3o",
        games: 2,
        goals: 0
      },
      {
        s: "23",
        team: "CD Aves 1930",
        games: 7,
        goals: 0
      },
      {
        s: "22",
        team: "S\xE3o Mateus",
        games: 8,
        goals: 0
      },
      {
        s: "21",
        team: "CR Candoso/Natcal",
        games: 6,
        goals: 0
      }
    ],
    fam04: [
      {
        s: "26",
        team: "FC Famalic\xE3o",
        games: 6,
        goals: 0
      },
      {
        s: "25",
        team: "FC Famalic\xE3o",
        games: 20,
        goals: 1
      },
      {
        s: "24",
        team: "FC Famalic\xE3o",
        games: 14,
        goals: 0
      },
      {
        s: "23",
        team: "Ferreira do Z\xEAzere by Z\xEAzerovo",
        games: 18,
        goals: 0
      },
      {
        s: "22",
        team: "Ferreira do Z\xEAzere by Z\xEAzerovo",
        games: 23,
        goals: 2
      },
      {
        s: "21",
        team: "Ferreira do Z\xEAzere by Z\xEAzerovo",
        games: 17,
        goals: 2
      }
    ],
    fam05: [
      {
        s: "26",
        team: "FC Famalic\xE3o",
        games: 5,
        goals: 1
      },
      {
        s: "25",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 3,
        goals: 0
      },
      {
        s: "24",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 5,
        goals: 0
      },
      {
        s: "23",
        team: "Nogueir\xF3 e Ten\xF5es",
        games: 19,
        goals: 28
      },
      {
        s: "22",
        team: "Nogueir\xF3 e Ten\xF5es",
        games: 8,
        goals: 1
      },
      {
        s: "21",
        team: "Nogueir\xF3 e Ten\xF5es",
        games: 7,
        goals: 4
      }
    ],
    fam06: [
      {
        s: "26",
        team: "FC Famalic\xE3o",
        games: 6,
        goals: 1
      },
      {
        s: "25",
        team: "FC Famalic\xE3o",
        games: 25,
        goals: 5
      },
      {
        s: "24",
        team: "SC Braga",
        games: 22,
        goals: 1
      },
      {
        s: "23",
        team: "SC Braga",
        games: 9,
        goals: 0
      },
      {
        s: "22",
        team: "Ferreira do Z\xEAzere by Z\xEAzerovo",
        games: 25,
        goals: 4
      },
      {
        s: "21",
        team: "Ferreira do Z\xEAzere by Z\xEAzerovo",
        games: 36,
        goals: 11
      }
    ],
    fam07: [
      {
        s: "26",
        team: "FC Famalic\xE3o",
        games: 2,
        goals: 1
      },
      {
        s: "25",
        team: "CS S\xE3o Jo\xE3o",
        games: 12,
        goals: 4
      },
      {
        s: "24",
        team: "CDRC S\xE3o Martinho de Mouros",
        games: 12,
        goals: 1
      },
      {
        s: "23",
        team: "Arsenal Maia",
        games: 20,
        goals: 4
      },
      {
        s: "22",
        team: "Mar\xEDtimo",
        games: 14,
        goals: 1
      },
      {
        s: "21",
        team: "FC Arouca",
        games: 20,
        goals: 11
      }
    ],
    fam08: [
      {
        s: "26",
        team: "FC Famalic\xE3o",
        games: 0,
        goals: 0
      },
      {
        s: "25",
        team: "SC Braga",
        games: 9,
        goals: 0
      },
      {
        s: "24",
        team: "SC Braga",
        games: 1,
        goals: 1
      },
      {
        s: "23",
        team: "SC Braga",
        games: 31,
        goals: 19
      },
      {
        s: "22",
        team: "SC Braga",
        games: 17,
        goals: 14
      },
      {
        s: "21",
        team: "SC Braga",
        games: 0,
        goals: 0
      }
    ],
    fam09: [
      {
        s: "26",
        team: "FC Famalic\xE3o",
        games: 6,
        goals: 2
      },
      {
        s: "25",
        team: "ACD Ladoeiro",
        games: 25,
        goals: 19
      },
      {
        s: "24",
        team: "FC Famalic\xE3o",
        games: 28,
        goals: 16
      },
      {
        s: "23",
        team: "AD Fund\xE3o",
        games: 22,
        goals: 2
      },
      {
        s: "22",
        team: "SC Lusit\xE2nia",
        games: 22,
        goals: 7
      },
      {
        s: "21",
        team: "SC Lusit\xE2nia",
        games: 21,
        goals: 6
      }
    ],
    fam10: [
      {
        s: "26",
        team: "FC Famalic\xE3o",
        games: 6,
        goals: 1
      },
      {
        s: "25",
        team: "Piast Gliwice",
        games: 6,
        goals: 2
      },
      {
        s: "24",
        team: "Benfica",
        games: 1,
        goals: 0
      },
      {
        s: "23",
        team: "Benfica",
        games: 10,
        goals: 11
      },
      {
        s: "22",
        team: "Benfica",
        games: 2,
        goals: 2
      },
      {
        s: "21",
        team: "Le\xF5es Porto Salvo",
        games: 14,
        goals: 0
      }
    ],
    fam11: [
      {
        s: "26",
        team: "FC Famalic\xE3o",
        games: 6,
        goals: 1
      },
      {
        s: "25",
        team: "FC Famalic\xE3o",
        games: 10,
        goals: 2
      },
      {
        s: "24",
        team: "SCC/FC Famalic\xE3o",
        games: 25,
        goals: 8
      },
      {
        s: "23",
        team: "SCC/FC Famalic\xE3o",
        games: 26,
        goals: 9
      },
      {
        s: "22",
        team: "SCC/FC Famalic\xE3o",
        games: 30,
        goals: 13
      },
      {
        s: "21",
        team: "ACR Lordelo",
        games: 22,
        goals: 25
      }
    ],
    fam12: [
      {
        s: "26",
        team: "FC Famalic\xE3o",
        games: 0,
        goals: 0
      },
      {
        s: "25",
        team: "FC Famalic\xE3o",
        games: 0,
        goals: 0
      },
      {
        s: "24",
        team: "CDRC Tebosa",
        games: 19,
        goals: 15
      }
    ],
    fam13: [
      {
        s: "26",
        team: "FC Famalic\xE3o",
        games: 3,
        goals: 1
      },
      {
        s: "25",
        team: "AD Fund\xE3o",
        games: 17,
        goals: 2
      },
      {
        s: "24",
        team: "Le\xF5es Porto Salvo",
        games: 25,
        goals: 2
      },
      {
        s: "23",
        team: "Le\xF5es Porto Salvo",
        games: 21,
        goals: 2
      },
      {
        s: "22",
        team: "Le\xF5es Porto Salvo",
        games: 14,
        goals: 12
      },
      {
        s: "21",
        team: "Le\xF5es Porto Salvo",
        games: 16,
        goals: 12
      }
    ],
    fam14: [
      {
        s: "26",
        team: "FC Famalic\xE3o",
        games: 5,
        goals: 0
      }
    ],
    fam15: [
      {
        s: "26",
        team: "FC Famalic\xE3o",
        games: 5,
        goals: 2
      },
      {
        s: "25",
        team: "FC Famalic\xE3o",
        games: 21,
        goals: 2
      },
      {
        s: "24",
        team: "SCC/FC Famalic\xE3o",
        games: 26,
        goals: 13
      },
      {
        s: "23",
        team: "SCC/FC Famalic\xE3o",
        games: 23,
        goals: 18
      },
      {
        s: "22",
        team: "SCC/FC Famalic\xE3o",
        games: 26,
        goals: 26
      },
      {
        s: "21",
        team: "SCC/FC Famalic\xE3o",
        games: 22,
        goals: 22
      }
    ],
    fam16: [
      {
        s: "26",
        team: "FC Famalic\xE3o",
        games: 5,
        goals: 1
      },
      {
        s: "25",
        team: "Novo Vrijeme",
        games: 9,
        goals: 3
      },
      {
        s: "24",
        team: "KS Constract Lubawa",
        games: 39,
        goals: 36
      },
      {
        s: "23",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 12,
        goals: 2
      },
      {
        s: "22",
        team: "Italservice Pesaro",
        games: 20,
        goals: 8
      },
      {
        s: "21",
        team: "Ribera Navarra",
        games: 35,
        goals: 16
      }
    ],
    fam17: [
      {
        s: "26",
        team: "FC Famalic\xE3o",
        games: 5,
        goals: 0
      }
    ],
    fam18: [
      {
        s: "26",
        team: "FC Famalic\xE3o",
        games: 6,
        goals: 0
      },
      {
        s: "25",
        team: "Ferreira do Z\xEAzere",
        games: 9,
        goals: 0
      },
      {
        s: "24",
        team: "SC Braga",
        games: 20,
        goals: 11
      },
      {
        s: "23",
        team: "SC Braga",
        games: 17,
        goals: 23
      },
      {
        s: "22",
        team: "Futsal Azem\xE9is",
        games: 11,
        goals: 0
      },
      {
        s: "21",
        team: "AD Jorge Antunes",
        games: 2,
        goals: 0
      }
    ],
    tor01: [
      {
        s: "26",
        team: "Torreense",
        games: 2,
        goals: 0
      },
      {
        s: "25",
        team: "SC Barbarense",
        games: 26,
        goals: 0
      },
      {
        s: "24",
        team: "Torreense",
        games: 11,
        goals: 0
      },
      {
        s: "23",
        team: "Vit\xF3ria FC",
        games: 26,
        goals: 1
      },
      {
        s: "22",
        team: "Vit\xF3ria FC",
        games: 27,
        goals: 0
      }
    ],
    tor02: [
      {
        s: "26",
        team: "Torreense",
        games: 4,
        goals: 0
      },
      {
        s: "25",
        team: "AMSAC",
        games: 23,
        goals: 1
      },
      {
        s: "24",
        team: "Sporting",
        games: 0,
        goals: 0
      },
      {
        s: "23",
        team: "Futsal Oeiras",
        games: 3,
        goals: 0
      },
      {
        s: "22",
        team: "Futsal Oeiras",
        games: 3,
        goals: 0
      },
      {
        s: "21",
        team: "18 de Maio",
        games: 0,
        goals: 0
      }
    ],
    tor03: [
      {
        s: "26",
        team: "Torreense",
        games: 0,
        goals: 0
      },
      {
        s: "25",
        team: "Pregan\xE7a",
        games: 16,
        goals: 0
      },
      {
        s: "24",
        team: "Futsal Oeiras",
        games: 2,
        goals: 0
      },
      {
        s: "23",
        team: "Torreense",
        games: 14,
        goals: 0
      },
      {
        s: "22",
        team: "Torreense",
        games: 4,
        goals: 0
      },
      {
        s: "21",
        team: "Torreense",
        games: 0,
        goals: 0
      }
    ],
    tor04: [
      {
        s: "26",
        team: "Torreense",
        games: 5,
        goals: 1
      },
      {
        s: "25",
        team: "Torreense",
        games: 17,
        goals: 7
      },
      {
        s: "24",
        team: "Benfica",
        games: 19,
        goals: 4
      },
      {
        s: "23",
        team: "Benfica",
        games: 26,
        goals: 28
      },
      {
        s: "22",
        team: "Benfica",
        games: 33,
        goals: 16
      },
      {
        s: "21",
        team: "Benfica",
        games: 2,
        goals: 1
      }
    ],
    tor05: [
      {
        s: "26",
        team: "Torreense",
        games: 5,
        goals: 0
      },
      {
        s: "25",
        team: "UPVN",
        games: 11,
        goals: 3
      },
      {
        s: "24",
        team: "SC Lusit\xE2nia",
        games: 16,
        goals: 2
      }
    ],
    tor06: [
      {
        s: "26",
        team: "Torreense",
        games: 0,
        goals: 0
      },
      {
        s: "25",
        team: "Torreense",
        games: 1,
        goals: 0
      },
      {
        s: "24",
        team: "Benfica",
        games: 13,
        goals: 4
      },
      {
        s: "23",
        team: "Benfica",
        games: 6,
        goals: 3
      },
      {
        s: "22",
        team: "Benfica",
        games: 7,
        goals: 1
      },
      {
        s: "21",
        team: "GROB",
        games: 0,
        goals: 0
      }
    ],
    tor07: [
      {
        s: "26",
        team: "Torreense",
        games: 5,
        goals: 0
      },
      {
        s: "25",
        team: "Torreense",
        games: 27,
        goals: 6
      },
      {
        s: "24",
        team: "Torreense",
        games: 24,
        goals: 8
      },
      {
        s: "23",
        team: "Ferreira do Z\xEAzere by Z\xEAzerovo",
        games: 28,
        goals: 14
      },
      {
        s: "22",
        team: "Ferreira do Z\xEAzere by Z\xEAzerovo",
        games: 27,
        goals: 19
      },
      {
        s: "21",
        team: "Mar\xEDtimo",
        games: 37,
        goals: 23
      }
    ],
    tor08: [
      {
        s: "26",
        team: "Torreense",
        games: 0,
        goals: 0
      },
      {
        s: "25",
        team: "Torreense",
        games: 5,
        goals: 0
      },
      {
        s: "24",
        team: "Sporting",
        games: 28,
        goals: 15
      },
      {
        s: "23",
        team: "Sporting",
        games: 23,
        goals: 7
      },
      {
        s: "22",
        team: "Burinhosa",
        games: 28,
        goals: 7
      },
      {
        s: "21",
        team: "Ribafria",
        games: 0,
        goals: 0
      }
    ],
    tor09: [
      {
        s: "26",
        team: "Torreense",
        games: 2,
        goals: 0
      },
      {
        s: "25",
        team: "Torreense",
        games: 12,
        goals: 0
      },
      {
        s: "24",
        team: "Torreense",
        games: 2,
        goals: 0
      },
      {
        s: "23",
        team: "Torreense",
        games: 25,
        goals: 13
      },
      {
        s: "22",
        team: "Torreense",
        games: 3,
        goals: 1
      },
      {
        s: "21",
        team: "Torreense",
        games: 0,
        goals: 0
      }
    ],
    tor10: [
      {
        s: "26",
        team: "Torreense",
        games: 5,
        goals: 0
      },
      {
        s: "25",
        team: "UPVN",
        games: 22,
        goals: 2
      },
      {
        s: "24",
        team: "UPVN",
        games: 28,
        goals: 10
      },
      {
        s: "23",
        team: "Al-Riyadh",
        games: 0,
        goals: 0
      },
      {
        s: "22",
        team: "SC Lusit\xE2nia",
        games: 34,
        goals: 17
      },
      {
        s: "21",
        team: "Svarog FC Teplice",
        games: 0,
        goals: 0
      }
    ],
    tor11: [
      {
        s: "26",
        team: "Torreense",
        games: 5,
        goals: 1
      },
      {
        s: "25",
        team: "Torreense",
        games: 26,
        goals: 7
      },
      {
        s: "24",
        team: "Portimonense",
        games: 25,
        goals: 13
      },
      {
        s: "23",
        team: "Portimonense",
        games: 21,
        goals: 21
      },
      {
        s: "22",
        team: "Torreense",
        games: 29,
        goals: 12
      },
      {
        s: "21",
        team: "AMSAC",
        games: 31,
        goals: 14
      }
    ],
    tor12: [
      {
        s: "26",
        team: "Torreense",
        games: 5,
        goals: 0
      }
    ],
    tor13: [
      {
        s: "26",
        team: "Torreense",
        games: 4,
        goals: 0
      }
    ],
    tor14: [
      {
        s: "26",
        team: "Torreense",
        games: 1,
        goals: 0
      },
      {
        s: "25",
        team: "Quinta dos Lombos",
        games: 23,
        goals: 7
      },
      {
        s: "24",
        team: "Sporting",
        games: 26,
        goals: 28
      },
      {
        s: "23",
        team: "Sporting",
        games: 26,
        goals: 11
      },
      {
        s: "22",
        team: "Le\xF5es Porto Salvo",
        games: 1,
        goals: 1
      },
      {
        s: "21",
        team: "Belenenses",
        games: 7,
        goals: 1
      }
    ],
    tor15: [
      {
        s: "26",
        team: "Torreense",
        games: 0,
        goals: 0
      },
      {
        s: "25",
        team: "Torreense",
        games: 1,
        goals: 0
      },
      {
        s: "24",
        team: "Le\xF5es Porto Salvo",
        games: 13,
        goals: 1
      },
      {
        s: "23",
        team: "AMSAC",
        games: 21,
        goals: 6
      },
      {
        s: "22",
        team: "Benfica",
        games: 1,
        goals: 0
      },
      {
        s: "21",
        team: "Amigos Luz",
        games: 0,
        goals: 0
      }
    ],
    tor16: [
      {
        s: "26",
        team: "Torreense",
        games: 4,
        goals: 0
      },
      {
        s: "25",
        team: "Torreense",
        games: 0,
        goals: 0
      },
      {
        s: "24",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 21,
        goals: 6
      },
      {
        s: "23",
        team: "Belenenses",
        games: 21,
        goals: 5
      },
      {
        s: "22",
        team: "Belenenses",
        games: 22,
        goals: 8
      },
      {
        s: "21",
        team: "Reguilas Tires",
        games: 19,
        goals: 11
      }
    ],
    tor17: [
      {
        s: "26",
        team: "Torreense",
        games: 4,
        goals: 0
      },
      {
        s: "25",
        team: "Torreense",
        games: 4,
        goals: 0
      },
      {
        s: "24",
        team: "ADCR Caxinas Po\xE7a Barca",
        games: 0,
        goals: 0
      },
      {
        s: "23",
        team: "PAC - Peniche Amigos",
        games: 2,
        goals: 0
      },
      {
        s: "22",
        team: "PAC - Peniche Amigos",
        games: 10,
        goals: 8
      },
      {
        s: "21",
        team: "PAC - Peniche Amigos",
        games: 0,
        goals: 0
      }
    ],
    tor18: [
      {
        s: "26",
        team: "Torreense",
        games: 5,
        goals: 5
      },
      {
        s: "25",
        team: "Torreense",
        games: 26,
        goals: 14
      }
    ]
  }
};

// src/core/moneyball.ts
var SEASON_WEIGHT = { "26": 0.5, "25": 1, "24": 0.75, "23": 0.5, "22": 0.35, "21": 0.25 };
var EXPECTED_GPG = { GR: 0.02, FIX: 0.18, "FIX/ALA": 0.25, UNI: 0.32, ALA: 0.38, "ALA/PIV": 0.45, PIV: 0.5 };
var PROD_WEIGHT = { GR: 0, FIX: 0.4, "FIX/ALA": 0.6, UNI: 0.8, ALA: 1, "ALA/PIV": 1, PIV: 1 };
var TEAM_LEVELS = {
  // Portugal: nomes como aparecem no zerozero (clubes atuais e que passaram pela Liga Placard)
  Sporting: 94,
  Benfica: 95,
  "SC Braga": 82,
  "AD Fund\xE3o": 72,
  "Le\xF5es Porto Salvo": 70,
  "Ferreira do Z\xEAzere": 60,
  "Ferreira do Z\xEAzere by Z\xEAzerovo": 60,
  "El\xE9ctrico": 66,
  "El\xE9ctrico FC/ A MatosCar": 66,
  "Rio Ave": 64,
  UPVN: 58,
  Portimonense: 63,
  "FC Famalic\xE3o": 60,
  "SCC/FC Famalic\xE3o": 58,
  Torreense: 62,
  "Quinta dos Lombos": 60,
  "Modicus Bruval": 60,
  Modicus: 60,
  "CR Candoso/Natcal": 58,
  "Nun\xB4\xC1lvares": 58,
  "Viseu 2001": 56,
  "Futsal Azem\xE9is": 57,
  "ADCR Caxinas Po\xE7a Barca": 55,
  "AD Jorge Antunes": 52,
  Burinhosa: 52,
  Belenenses: 50,
  AMSAC: 50,
  "CF Sassoeiros": 50,
  "Pa\xE7os de Ferreira Redifogo Futsal": 52,
  "D\xEDnamo Sanjoanense": 48,
  "CS S\xE3o Jo\xE3o": 48,
  Mar\u00EDtimo: 50,
  // nomes como aparecem no futsalportugal.com (FPF)
  "Sporting CP": 94,
  "SL Benfica": 95,
  "Le\xF5es de Porto Salvo": 70,
  "SC Ferreira do Z\xEAzere/Z\xEAzerovo": 60,
  "El\xE9ctrico FC": 66,
  "Rio Ave FC": 64,
  "UP Venda Nova": 58,
  "Portimonense SC": 63,
  "SCU Torreense": 62,
  // Espanha: nomes como aparecem no futsalportugal.com (Liga Prime Futsal e ex-1.ª divisão; estimativa na escala mundial)
  "FC Barcelona": 97,
  "Islas Baleares Palma Futsal": 95,
  "Jimbee Cartagena FS": 94,
  "ElPozo Murcia": 92,
  "Inter FS": 91,
  "Ja\xE9n Para\xEDso Interior": 84,
  "Vi\xF1a Albali Valdepe\xF1as": 80,
  "Pe\xF1\xEDscola FS": 78,
  "Quesos El Higaldo Manzanares FS": 76,
  "Industrias Santa Coloma": 74,
  "Osasuna Magna Xota FS": 77,
  "Noia Portus Apostoli": 74,
  "C\xF3rdoba Patrimonio": 77,
  "Wanapix AD Sala 10 Zaragoza": 77,
  "Real Betis Futsal": 76,
  "O Parrulo Ferrol": 75,
  "Levante UD": 80,
  "Ribera Navarra FS": 78,
  "Sur Seeds El Ejido Futsal": 74,
  "BeSoccer CD UMA Antequera": 74,
  "Burela FS": 70,
  "Alzira FS": 68,
  // Brasil (LNF), Cazaquistão e outros que aparecem no historial dos jogadores da Liga Prime
  "Kairat Almaty": 82,
  Joinville: 78,
  "Jaragu\xE1 Futsal": 76,
  "Pato Futsal": 76,
  "Magnus Futsal": 80,
  "S\xE3o Jos\xE9 Futsal": 72,
  "Foz Cataratas Futsal": 72,
  "Cascavel Futsal": 76,
  "Carlos Barbosa": 78,
  Corinthians: 76,
  "Joa\xE7aba Futsal": 72,
  "Santo Andr\xE9": 70,
  Blumenau: 70,
  "Atl\xE2ntico": 72,
  "Royal Sporting Anderlecht Futsal": 82,
  "Etoile Lavalloise": 70,
  "Halad\xE1s VSE": 64,
  "FK Chrudim": 68,
  "Uragan Ivano-Frankivsk": 70,
  "MNK Olmissum": 66,
  ACCS: 66,
  // Estrangeiro
  Barcelona: 96,
  "ElPozo Murcia Costa C\xE1lida": 90,
  "Illes Balears Palma": 93,
  "Real Betis": 78,
  Levante: 82,
  "Ribera Navarra": 80,
  "ETB Calvi\xE1": 55,
  "Wanapix AD Sala 10": 70,
  "HIT Kiev": 76,
  Tyumen: 78,
  Sibiryak: 74,
  Atyrau: 72,
  "Kaspiy Aktau": 70,
  Ordabasy: 72,
  Anderlecht: 82,
  "Riga FC": 62,
  "Al-Nassr": 60,
  "Al-Qadisiyah": 60,
  "Al-Tadhamon": 55,
  "Al-Ula FC": 62,
  "Al-Riyadh": 58,
  "Ecocity Genzano": 72,
  "Fortitudo Pomezia": 74,
  "Italservice Pesaro": 76,
  Canosa: 60,
  Magallanes: 50,
  "Ny\xEDrb\xE1tori": 66,
  "Halad\xE1s": 64,
  "MNK Osijek": 58,
  "Futsal Pula": 60,
  "Novo Vrijeme": 64,
  "Panta Walon": 64,
  Omonia: 62,
  "New Vision Georgians": 55,
  "United Galati": 66,
  "Araz Nax\xE7ivan": 72,
  "Piast Gliwice": 72,
  "KS Constract Lubawa": 74,
  "Svarog FC Teplice": 60
};
var LEAGUE_OF = {
  "FC Barcelona": 92,
  "Islas Baleares Palma Futsal": 92,
  "Jimbee Cartagena FS": 92,
  "ElPozo Murcia": 92,
  "Inter FS": 92,
  "Pe\xF1\xEDscola FS": 92,
  "Quesos El Higaldo Manzanares FS": 92,
  "Industrias Santa Coloma": 92,
  "Osasuna Magna Xota FS": 92,
  "Noia Portus Apostoli": 92,
  "C\xF3rdoba Patrimonio": 92,
  "Wanapix AD Sala 10 Zaragoza": 92,
  "Real Betis Futsal": 92,
  "O Parrulo Ferrol": 92,
  "Levante UD": 92,
  "Ribera Navarra FS": 92,
  "Sur Seeds El Ejido Futsal": 92,
  "BeSoccer CD UMA Antequera": 92,
  "Burela FS": 80,
  "Alzira FS": 65,
  "Kairat Almaty": 70,
  Joinville: 75,
  "Jaragu\xE1 Futsal": 75,
  "Pato Futsal": 75,
  "Magnus Futsal": 75,
  "S\xE3o Jos\xE9 Futsal": 75,
  "Foz Cataratas Futsal": 75,
  "Cascavel Futsal": 75,
  "Carlos Barbosa": 75,
  Corinthians: 75,
  "Joa\xE7aba Futsal": 75,
  "Santo Andr\xE9": 75,
  Blumenau: 75,
  "Atl\xE2ntico": 75,
  "Royal Sporting Anderlecht Futsal": 58,
  "Etoile Lavalloise": 55,
  "Halad\xE1s VSE": 55,
  "FK Chrudim": 58,
  "Uragan Ivano-Frankivsk": 62,
  "MNK Olmissum": 55,
  ACCS: 55,
  // Espanha (a mais forte)
  Barcelona: 92,
  "ElPozo Murcia Costa C\xE1lida": 92,
  "Illes Balears Palma": 92,
  "Vi\xF1a Albali Valdepe\xF1as": 92,
  "Ja\xE9n Para\xEDso Interior": 92,
  "Real Betis": 92,
  Levante: 92,
  "Ribera Navarra": 92,
  "Wanapix AD Sala 10": 72,
  "ETB Calvi\xE1": 50,
  // Outras ligas europeias
  "HIT Kiev": 62,
  Tyumen: 76,
  Sibiryak: 76,
  Atyrau: 70,
  "Kaspiy Aktau": 70,
  Ordabasy: 70,
  Anderlecht: 58,
  "Riga FC": 42,
  "Ecocity Genzano": 72,
  "Fortitudo Pomezia": 72,
  "Italservice Pesaro": 72,
  Canosa: 60,
  "Ny\xEDrb\xE1tori": 55,
  "Halad\xE1s": 55,
  "MNK Osijek": 55,
  "Futsal Pula": 55,
  "Novo Vrijeme": 55,
  "Panta Walon": 50,
  Omonia: 45,
  "New Vision Georgians": 42,
  "United Galati": 52,
  "Araz Nax\xE7ivan": 55,
  "Piast Gliwice": 65,
  "KS Constract Lubawa": 65,
  "Svarog FC Teplice": 58,
  // Médio Oriente e América do Sul
  "Al-Nassr": 48,
  "Al-Qadisiyah": 48,
  "Al-Ula FC": 48,
  "Al-Riyadh": 48,
  "Al-Tadhamon": 42,
  Magallanes: 38
};
var PT_FIRST_DIVISION = 72;
function leagueLevel(clean) {
  if (LEAGUE_OF[clean] != null) return LEAGUE_OF[clean];
  if (TEAM_LEVELS[clean] != null) return PT_FIRST_DIVISION;
  return UNKNOWN_LEVEL;
}
var UNKNOWN_LEVEL = 42;
var YOUTH_AGE = 19;
var YOUTH_LEVEL = 42;
function teamLevel(name, ageAtSeason = 99) {
  const clean = name.replace(/\s*\[.*?\]/g, "").replace(/\s*\(E\)/g, "").trim();
  const lvl = TEAM_LEVELS[clean] ?? UNKNOWN_LEVEL;
  const league = leagueLevel(clean);
  if (ageAtSeason <= YOUTH_AGE) return { team: Math.min(lvl, YOUTH_LEVEL), league: YOUTH_LEVEL };
  return { team: lvl, league };
}
var clamp2 = (v, a, b) => Math.max(a, Math.min(b, v));
function computeMoneyball(rows, pos, ageNow) {
  let wSum = 0;
  let lvl = 0;
  let gpgW = 0;
  let expW = 0;
  let availW = 0;
  let prodW = 0;
  for (const r of rows) {
    const base = SEASON_WEIGHT[r.s];
    if (!base || r.games <= 0) continue;
    const { team: tl, league: ll } = teamLevel(r.team, ageNow - (26 - Number(r.s)));
    const w = base * Math.min(1, r.games / 8);
    const expectedGames = tl >= 85 ? 42 : tl >= 70 ? 34 : 28;
    const avail = clamp2(r.games / expectedGames, 0, 1.1);
    const gpg = r.goals / r.games;
    const exp = EXPECTED_GPG[pos] * clamp2(1 + (tl - ll) / 33, 0.6, 1.8);
    const leagueFactor = clamp2(ll / 80, 0.3, 1.1);
    const ratio = gpg / Math.max(0.02, exp);
    const prod = clamp2((ratio - 1) * 8, -3, 10) * PROD_WEIGHT[pos] * leagueFactor;
    const perf = tl + 14 * (avail - 0.6) + prod;
    lvl += perf * w;
    gpgW += gpg * w;
    expW += exp * w;
    availW += avail * w;
    prodW += (1 + Math.max(-0.4, ratio - 1) * leagueFactor) * w;
    wSum += w;
  }
  if (wSum < 0.3) return null;
  return {
    level: clamp2(lvl / wSum, 20, 105),
    seasons: rows.filter((r) => SEASON_WEIGHT[r.s] && r.games > 0).length,
    goalsPerGame: gpgW / wSum,
    expectedGpg: expW / wSum,
    availability: availW / wSum,
    productivity: prodW / wSum
  };
}

// src/data/por/coaches.json
var coaches_default = {
  _info: "Treinadores atuais. tactical/motivation calculados do historial real (futsalportugal.com: % de vit\xF3rias por competi\xE7\xE3o e t\xEDtulos; zerozero nos 5 clubes com historial completo). discipline/youth: estimativa. style vazio = estilo deduzido do plantel.",
  coaches: [
    {
      id: "c_scp",
      name: "Nuno Dias",
      clubId: "scp",
      tactical: 19,
      motivation: 17,
      discipline: 16,
      youth: 15,
      style: {}
    },
    {
      id: "c_slb",
      name: "Cassiano Klein",
      clubId: "slb",
      tactical: 15,
      motivation: 14,
      discipline: 16,
      youth: 14,
      style: {}
    },
    {
      id: "c_scb",
      name: "Joel Rocha",
      clubId: "scb",
      tactical: 16,
      motivation: 14,
      discipline: 14,
      youth: 15,
      style: {}
    },
    {
      id: "c_fun",
      name: "Nuno Couto",
      clubId: "fun",
      tactical: 12,
      motivation: 12,
      discipline: 12,
      youth: 12,
      style: {}
    },
    {
      id: "c_lps",
      name: "Miguel Velez",
      clubId: "lps",
      tactical: 12,
      motivation: 12,
      discipline: 12,
      youth: 12,
      style: {}
    },
    {
      id: "c_fzz",
      name: "Cristiano Coelho",
      clubId: "fzz",
      tactical: 10,
      motivation: 11,
      discipline: 12,
      youth: 12,
      style: {}
    },
    {
      id: "c_ele",
      name: "Jorge Monteiro",
      clubId: "ele",
      tactical: 11,
      motivation: 11,
      discipline: 12,
      youth: 12,
      style: {}
    },
    {
      id: "c_rav",
      name: "Bruno Guimar\xE3es",
      clubId: "rav",
      tactical: 11,
      motivation: 11,
      discipline: 12,
      youth: 12,
      style: {}
    },
    {
      id: "c_uvn",
      name: "Alcides Lopes",
      clubId: "uvn",
      tactical: 12,
      motivation: 11,
      discipline: 12,
      youth: 12,
      style: {}
    },
    {
      id: "c_por",
      name: "Jos\xE9 Manuel Almeida Santos",
      clubId: "por",
      tactical: 11,
      motivation: 12,
      discipline: 12,
      youth: 12,
      style: {}
    },
    {
      id: "c_fam",
      name: "Cl\xE1udio Martins",
      clubId: "fam",
      tactical: 11,
      motivation: 11,
      discipline: 12,
      youth: 12,
      style: {}
    },
    {
      id: "c_tor",
      name: "Nan\xE1",
      clubId: "tor",
      tactical: 12,
      motivation: 11,
      discipline: 12,
      youth: 12,
      style: {}
    }
  ]
};

// src/core/tactics.ts
function suggestTactics(squad, base) {
  const gks = squad.filter((p) => p.position === "GR").sort((a, b) => overall(b.attrs, "GR") - overall(a.attrs, "GR"));
  const out = squad.filter((p) => p.position !== "GR").sort((a, b) => overall(b.attrs, b.position) - overall(a.attrs, a.position));
  const q1 = [];
  const q2 = [];
  const isDef = (p) => ["FIX", "FIX/ALA", "UNI"].includes(p.position);
  const isPiv = (p) => ["PIV", "ALA/PIV"].includes(p.position);
  const take = (q, pred) => {
    const p = out.find((x) => pred(x) && !q1.includes(x) && !q2.includes(x));
    if (p) q.push(p);
  };
  for (const q of [q1, q2]) take(q, isDef);
  for (const q of [q1, q2]) take(q, isPiv);
  while (q1.length < 4 || q2.length < 4) {
    const before = q1.length + q2.length;
    if (q1.length < 4) take(q1, () => true);
    if (q2.length < 4) take(q2, () => true);
    if (q1.length + q2.length === before) break;
  }
  const t = {
    system: "3-1",
    pressure: "media",
    tempo: "equilibrado",
    marking: "zona",
    flyingKeeper: "auto",
    rotation: "normal",
    ...base,
    gk: gks[0]?.id ?? null,
    q1: [],
    q2: [],
    setPieces: suggestSetPieces(squad)
  };
  t.q1 = arrangeForSystem(q1, t.system).map((p) => p?.id ?? "");
  t.q2 = arrangeForSystem(q2, t.system).map((p) => p?.id ?? "");
  return t;
}
function arrangeForSystem(players, system) {
  const slots = SLOTS[system];
  const list = [0, 1, 2, 3].map((i) => players[i]);
  let best = list;
  let bestScore = -1;
  const perm = (arr, k) => {
    if (k === arr.length) {
      const sc = arr.reduce((a, p, i) => a + (p ? roleFit(slots[i].role, p.position) : 0), 0);
      if (sc > bestScore) {
        bestScore = sc;
        best = [...arr];
      }
      return;
    }
    for (let i = k; i < arr.length; i++) {
      [arr[k], arr[i]] = [arr[i], arr[k]];
      perm(arr, k + 1);
      [arr[k], arr[i]] = [arr[i], arr[k]];
    }
  };
  perm(list, 0);
  return best;
}
var SLOTS = {
  "3-1": [
    { label: "Fixo", role: "Fixo", x: 30, y: 50 },
    { label: "Ala E", role: "Ala", x: 40, y: 18 },
    { label: "Ala D", role: "Ala", x: 40, y: 82 },
    { label: "Piv\xF4", role: "Piv\xF4", x: 78, y: 50 }
  ],
  "4-0": [
    { label: "Universal E", role: "Universal", x: 38, y: 36 },
    { label: "Ala E", role: "Ala", x: 48, y: 12 },
    { label: "Ala D", role: "Ala", x: 48, y: 88 },
    { label: "Universal D", role: "Universal", x: 38, y: 64 }
  ],
  "2-2": [
    { label: "Fixo E", role: "Fixo", x: 30, y: 30 },
    { label: "Ala E", role: "Ala", x: 64, y: 28 },
    { label: "Ala D", role: "Ala", x: 64, y: 72 },
    { label: "Fixo D", role: "Fixo", x: 30, y: 70 }
  ],
  "1-2-1": [
    { label: "Fixo", role: "Fixo", x: 24, y: 50 },
    { label: "Ala E", role: "Ala", x: 50, y: 20 },
    { label: "Ala D", role: "Ala", x: 50, y: 80 },
    { label: "Piv\xF4", role: "Piv\xF4", x: 76, y: 50 }
  ]
};
var FIT = {
  Fixo: { FIX: 1, "FIX/ALA": 0.85, UNI: 0.8, ALA: 0.45, "ALA/PIV": 0.3, PIV: 0.25, GR: 0 },
  Ala: { ALA: 1, UNI: 0.9, "FIX/ALA": 0.8, "ALA/PIV": 0.85, FIX: 0.5, PIV: 0.45, GR: 0 },
  Piv\u00F4: { PIV: 1, "ALA/PIV": 0.9, UNI: 0.6, ALA: 0.5, "FIX/ALA": 0.3, FIX: 0.25, GR: 0 },
  Universal: { UNI: 1, "FIX/ALA": 0.9, ALA: 0.85, "ALA/PIV": 0.75, FIX: 0.7, PIV: 0.5, GR: 0 }
};
function roleFit(role, position) {
  return FIT[role][position] ?? 0.3;
}
function suggestSetPieces(squad, base) {
  const out = squad.filter((p) => p.position !== "GR");
  const best = (f) => [...out].sort((a2, b) => f(b) - f(a2))[0]?.id ?? null;
  const a = (p) => p.attrs;
  return {
    penalty: best((p) => a(p).finalizacao + a(p).compostura),
    free10: best((p) => a(p).remate + a(p).finalizacao + a(p).compostura),
    corner: best((p) => a(p).bolasParadas * 2 + a(p).passe),
    freeKick: best((p) => a(p).bolasParadas * 2 + a(p).remate),
    kickIn: best((p) => a(p).passe + a(p).visao + a(p).bolasParadas),
    cornerRoutine: "primeiro_poste",
    freeKickRoutine: "remate_direto",
    ...base
  };
}
function normalizeTactics(t, squad) {
  if (!t.setPieces) t.setPieces = suggestSetPieces(squad);
  return t;
}

// src/data/por/staff.json
var staff_default = {
  _info: "Equipas t\xE9cnicas reais 2026/27: futsalportugal.com (12 clubes: jogos e vit\xF3rias por competi\xE7\xE3o, t\xEDtulos; recolha 1/11/2026) + zerozero (5 clubes, historial com V/E/D; recolha do Ant\xF3nio 2/11). ability e coach s\xE3o estimativas calculadas destes dados.",
  people: [
    {
      id: "por-fp43905-principal",
      club: "por",
      name: "Jos\xE9 Manuel Almeida Santos",
      func: "Treinador principal",
      role: "principal",
      nat: "Portugal",
      birth: "1974-09-17",
      src: "fp",
      fp: {
        games: 56,
        wins: 31,
        notWon: 25,
        titles: []
      },
      history: [
        {
          ep: "2026/2027",
          club: "Portimonense SC",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2025/2026",
          club: "Portimonense SC",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2024/2025",
          club: "Portimonense SC",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2023/2024",
          club: "Portimonense SC",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      coach: {
        tactical: 11,
        motivation: 12,
        record: {
          games: 56,
          wins: 31,
          winRate: 0.55,
          titlesPts: 0
        }
      },
      ability: 8
    },
    {
      id: "slb-fp5616-principal",
      club: "slb",
      name: "Cassiano Klein",
      func: "Treinador principal",
      role: "principal",
      nat: "Brasil",
      birth: "1982-10-12",
      src: "fp",
      fp: {
        games: 115,
        wins: 83,
        notWon: 32,
        titles: [
          "Liga Placard (2024/2025, 2025/2026)",
          "Ta\xE7a da Liga (2025/2026)",
          "Ta\xE7a de Portugal (2025/2026)"
        ]
      },
      history: [
        {
          ep: "2026/27",
          club: "Benfica",
          func: "Treinador principal",
          g: "8",
          w: "4",
          d: "3",
          l: "1",
          titles: "-"
        },
        {
          ep: "2025/26",
          club: "Benfica",
          func: "Treinador principal",
          g: "48",
          w: "40",
          d: "3",
          l: "5",
          titles: "I Divis\xE3o Futsal, Ta\xE7a da Liga Futsal, Ta\xE7a de Portugal Futsal"
        },
        {
          ep: "2024/25",
          club: "Benfica",
          func: "Treinador principal",
          g: "39",
          w: "29",
          d: "5",
          l: "5",
          titles: "I Divis\xE3o Futsal"
        },
        {
          ep: "2024",
          club: "Joinville",
          func: "Treinador principal",
          g: "30",
          w: "21",
          d: "5",
          l: "4",
          titles: "Ta\xE7a Brasil Futsal, Recopa Catarinense de Futsal"
        },
        {
          ep: "2023",
          club: "Joinville",
          func: "Treinador principal",
          g: "55",
          w: "36",
          d: "13",
          l: "6",
          titles: "Supercopa Brasil Futsal, Campeonato Catarinense Futsal, Recopa Catarinense de Futsal"
        },
        {
          ep: "2022",
          club: "Cascavel Futsal",
          func: "Treinador principal",
          g: "35",
          w: "21",
          d: "6",
          l: "8",
          titles: "-"
        },
        {
          ep: "2021",
          club: "Cascavel Futsal",
          func: "Treinador principal",
          g: "22",
          w: "15",
          d: "4",
          l: "3",
          titles: "Liga Nacional Futsal, Campeonato Paranaense Futsal"
        },
        {
          ep: "2020",
          club: "Cascavel Futsal",
          func: "Treinador principal",
          g: "29",
          w: "15",
          d: "9",
          l: "5",
          titles: "Campeonato Paranaense Futsal"
        },
        {
          ep: "2019",
          club: "Cascavel Futsal",
          func: "Treinador principal",
          g: "52",
          w: "28",
          d: "9",
          l: "15",
          titles: "-"
        },
        {
          ep: "2018",
          club: "Joa\xE7aba Futsal",
          func: "Treinador principal",
          g: "19",
          w: "8",
          d: "3",
          l: "8",
          titles: "-"
        },
        {
          ep: "2017",
          club: "Joa\xE7aba Futsal",
          func: "Treinador principal",
          g: "0",
          w: "0",
          d: "0",
          l: "0",
          titles: "-"
        }
      ],
      coach: {
        tactical: 15,
        motivation: 14,
        record: {
          games: 115,
          wins: 83,
          winRate: 0.722,
          titlesPts: 8.5
        }
      },
      ability: 13
    },
    {
      id: "slb-fp43558-adjunto",
      club: "slb",
      name: "Estev\xE3o Mota Cordovil",
      func: "Treinador-adjunto",
      role: "adjunto",
      nat: "Portugal",
      birth: "1983-12-26",
      src: "fp",
      fp: {
        games: 2,
        wins: 2,
        notWon: 0,
        titles: []
      },
      history: [
        {
          ep: "2021/22-2026/27",
          club: "Benfica",
          func: "Treinador-adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "2022/23: I Divis\xE3o Feminina Futsal (principal do feminino)"
        },
        {
          ep: "2019-2021",
          club: "Ar\xE1bia Saudita (sele\xE7\xE3o)",
          func: "Treinador-adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2018/19-2019/20",
          club: "Belenenses",
          func: "Treinador-adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2011/12-2015/16",
          club: "Al Jaish, Al Yarmouk, Al-Kuwait",
          func: "Treinador-adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2010/11",
          club: "Belenenses",
          func: "Treinador-adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 15
    },
    {
      id: "slb-fp51907-gr",
      club: "slb",
      name: "V\xEDtor Hugo",
      func: "Treinador guarda-redes",
      role: "gr",
      nat: "Portugal",
      birth: "1982-11-30",
      src: "fp",
      fp: {
        games: 0,
        wins: 0,
        notWon: 0,
        titles: []
      },
      history: [
        {
          ep: "2025/26-2026/27",
          club: "Benfica",
          func: "Treinador guarda-redes",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2023/24-2024/25",
          club: "D\xEDnamo Sanjoanense",
          func: "Treinador guarda-redes",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2022/23",
          club: "D\xEDnamo Sanjoanense",
          func: "Treinador-adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 9
    },
    {
      id: "slb-fp51908-fisico",
      club: "slb",
      name: "Raphael Roel",
      func: "Preparador f\xEDsico",
      role: "fisico",
      nat: "Brasil",
      birth: "1986-09-14",
      src: "fp",
      fp: {
        games: 0,
        wins: 0,
        notWon: 0,
        titles: []
      },
      history: [
        {
          ep: "2024/25-2026/27",
          club: "Benfica",
          func: "Preparador f\xEDsico",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2024",
          club: "Joinville",
          func: "Preparador f\xEDsico",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 9
    },
    {
      id: "slb-fp51909-analista",
      club: "slb",
      name: "Andr\xE9 Chaveiro",
      func: "Analista",
      role: "analista",
      nat: "Portugal",
      birth: "1990-05-14",
      src: "fp",
      fp: {
        games: 0,
        wins: 0,
        notWon: 0,
        titles: []
      },
      history: [
        {
          ep: "2024/25-2026/27",
          club: "Benfica",
          func: "Analista",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2020/21-2023/24",
          club: "Benfica",
          func: "Observador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 12
    },
    {
      id: "rav-fp11610-principal",
      club: "rav",
      name: "Bruno Guimar\xE3es",
      func: "Treinador principal",
      role: "principal",
      nat: "Portugal",
      birth: "1980-10-02",
      src: "fp",
      fp: {
        games: 142,
        wins: 59,
        notWon: 82,
        titles: [
          "2\xAA Divis\xE3o (2022/2023)"
        ]
      },
      history: [
        {
          ep: "2026/2027",
          club: "Rio Ave FC",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2025/2026",
          club: "Rio Ave FC",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2024/2025",
          club: "GRC D\xEDnamo Sanjoanense",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2023/2024",
          club: "GRC D\xEDnamo Sanjoanense",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2022/2023",
          club: "GRC D\xEDnamo Sanjoanense",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2021/2022",
          club: "SC Braga",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2020/2021",
          club: "Arsenal da Maia",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2020/2021",
          club: "SC Braga",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2019/2020",
          club: "Arsenal da Maia",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2019/2020",
          club: "SC Braga",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      coach: {
        tactical: 11,
        motivation: 11,
        record: {
          games: 142,
          wins: 59,
          winRate: 0.419,
          titlesPts: 0.4
        }
      },
      ability: 11
    },
    {
      id: "ele-fp827-principal",
      club: "ele",
      name: "Jorge Monteiro",
      func: "Treinador principal",
      role: "principal",
      nat: "Portugal",
      birth: "1970-12-23",
      src: "fp",
      fp: {
        games: 246,
        wins: 93,
        notWon: 153,
        titles: [
          "Campeonato Nacional Sub 19 (2010/2011)"
        ]
      },
      history: [
        {
          ep: "2026/2027",
          club: "El\xE9ctrico FC",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2025/2026",
          club: "El\xE9ctrico FC",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2024/2025",
          club: "CRC Quinta dos Lombos",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2023/2024",
          club: "CRC Quinta dos Lombos",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2022/2023",
          club: "CRC Quinta dos Lombos",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2021/2022",
          club: "CRC Quinta dos Lombos",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2020/2021",
          club: "CRC Quinta dos Lombos",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2019/2020",
          club: "CRC Quinta dos Lombos",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2018/2019",
          club: "CRC Quinta dos Lombos",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2017/2018",
          club: "Le\xF5es de Porto Salvo",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      coach: {
        tactical: 11,
        motivation: 11,
        record: {
          games: 246,
          wins: 93,
          winRate: 0.378,
          titlesPts: 0.2
        }
      },
      ability: 12
    },
    {
      id: "ele-fp11526-adjunto",
      club: "ele",
      name: "Tiago Rasquete",
      func: "Treinador-adjunto",
      role: "adjunto",
      nat: "Portugal",
      birth: "1987-04-25",
      src: "fp",
      fp: {
        games: 39,
        wins: 14,
        notWon: 25,
        titles: []
      },
      history: [
        {
          ep: "2026/2027",
          club: "El\xE9ctrico FC",
          func: "Adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2022/2023",
          club: "FC Monfortense",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 8
    },
    {
      id: "fam-fp13162-principal",
      club: "fam",
      name: "Cl\xE1udio Martins",
      func: "Treinador principal",
      role: "principal",
      nat: "Portugal",
      birth: "1987-08-04",
      src: "fp",
      fp: {
        games: 259,
        wins: 124,
        notWon: 134,
        titles: [
          "2\xAA Divis\xE3o (2021/2022)"
        ]
      },
      history: [
        {
          ep: "2026/2027",
          club: "FC Famalic\xE3o",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2025/2026",
          club: "SCU Torreense",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2024/2025",
          club: "FC Famalic\xE3o",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2024/2025",
          club: "SCU Torreense",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2022/2023",
          club: "SC Lusit\xE2nia",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2021/2022",
          club: "SC Lusit\xE2nia",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2020/2021",
          club: "SC Lusit\xE2nia",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2013/2014",
          club: "Oper\xE1rio Lagoa",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      coach: {
        tactical: 11,
        motivation: 11,
        record: {
          games: 259,
          wins: 124,
          winRate: 0.479,
          titlesPts: 0.4
        }
      },
      ability: 10
    },
    {
      id: "fam-fp23570-adjunto",
      club: "fam",
      name: "Pedro Pedroso",
      func: "Treinador-adjunto",
      role: "adjunto",
      nat: "Portugal",
      birth: "1996-10-10",
      src: "fp",
      fp: {
        games: 0,
        wins: 0,
        notWon: 0,
        titles: [
          "Ta\xE7a Nacional Feminino (2023/2024)"
        ]
      },
      history: [],
      ability: 8
    },
    {
      id: "fam-fp51903-gr",
      club: "fam",
      name: "Sim\xE3o Pinto",
      func: "Treinador guarda-redes",
      role: "gr",
      nat: "Portugal",
      birth: "?",
      src: "fp",
      fp: {
        games: 0,
        wins: 0,
        notWon: 0,
        titles: []
      },
      history: [
        {
          ep: "2026/2027",
          club: "FC Famalic\xE3o",
          func: "Treinador Guarda Redes",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 6
    },
    {
      id: "fam-fp51904-fisico",
      club: "fam",
      name: "Petrus Gantois",
      func: "Preparador f\xEDsico",
      role: "fisico",
      nat: "Portugal",
      birth: "?",
      src: "fp",
      fp: {
        games: 0,
        wins: 0,
        notWon: 0,
        titles: []
      },
      history: [
        {
          ep: "2026/2027",
          club: "FC Famalic\xE3o",
          func: "Preparador F\xEDsico",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 6
    },
    {
      id: "fam-fp51905-analista",
      club: "fam",
      name: "Jo\xE3o Fonseca",
      func: "Analista",
      role: "analista",
      nat: "Portugal",
      birth: "?",
      src: "fp",
      fp: {
        games: 0,
        wins: 0,
        notWon: 0,
        titles: []
      },
      history: [
        {
          ep: "2026/2027",
          club: "FC Famalic\xE3o",
          func: "T\xE9cnico",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 6
    },
    {
      id: "uvn-fp71-principal",
      club: "uvn",
      name: "Alcides Lopes",
      func: "Treinador principal",
      role: "principal",
      nat: "Portugal",
      birth: "1990-11-12",
      src: "fp",
      fp: {
        games: 209,
        wins: 96,
        notWon: 112,
        titles: [
          "2\xAA Divis\xE3o (2014/2015)"
        ]
      },
      history: [
        {
          ep: "2026/2027",
          club: "UP Venda Nova",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2025/2026",
          club: "CRC Quinta dos Lombos",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2024/2025",
          club: "CS S\xE3o Jo\xE3o",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2023/2024",
          club: "CS S\xE3o Jo\xE3o",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2022/2023",
          club: "CS S\xE3o Jo\xE3o",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2021/2022",
          club: "CS S\xE3o Jo\xE3o",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2020/2021",
          club: "CS S\xE3o Jo\xE3o",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2019/2020",
          club: "CS S\xE3o Jo\xE3o",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2018/2019",
          club: "CS S\xE3o Jo\xE3o",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2017/2018",
          club: "CS S\xE3o Jo\xE3o",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2016/2017",
          club: "CS S\xE3o Jo\xE3o",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2015/2016",
          club: "CS S\xE3o Jo\xE3o",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2014/2015",
          club: "CS S\xE3o Jo\xE3o",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      coach: {
        tactical: 12,
        motivation: 11,
        record: {
          games: 209,
          wins: 96,
          winRate: 0.464,
          titlesPts: 0.4
        }
      },
      ability: 12
    },
    {
      id: "uvn-fp51933-adjunto",
      club: "uvn",
      name: "Ricardo Gomes",
      func: "Treinador-adjunto",
      role: "adjunto",
      nat: "Portugal",
      birth: "1984-02-02",
      src: "fp",
      fp: {
        games: 0,
        wins: 0,
        notWon: 0,
        titles: []
      },
      history: [
        {
          ep: "2026/2027",
          club: "UP Venda Nova",
          func: "Adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 6
    },
    {
      id: "uvn-fp51934-gr",
      club: "uvn",
      name: "Fabio Santos",
      func: "Treinador guarda-redes",
      role: "gr",
      nat: "Portugal",
      birth: "1990-09-06",
      src: "fp",
      fp: {
        games: 0,
        wins: 0,
        notWon: 0,
        titles: []
      },
      history: [
        {
          ep: "2026/2027",
          club: "PARC-Pindelo",
          func: "Treinador Guarda Redes",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2026/2027",
          club: "UP Venda Nova",
          func: "Treinador Guarda Redes",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 6
    },
    {
      id: "scp-fp1-principal",
      club: "scp",
      name: "Nuno Dias",
      func: "Treinador principal",
      role: "principal",
      nat: "Portugal",
      birth: "1972-12-28",
      src: "fp",
      fp: {
        games: 836,
        wins: 634,
        notWon: 202,
        titles: [
          "Liga Placard (2012/2013, 2013/2014, 2015/2016, 2016/2017, 2017/2018, 2020/2021, 2021/2022, 2022/2023, 2023/2024)",
          "Superta\xE7a (2013/2014, 2014/2015, 2017/2018, 2018/2019, 2019/2020, 2021/2022, 2022/2023, 2025/2026, 2026/2027)",
          "Ta\xE7a de Portugal (2012/2013, 2015/2016, 2017/2018, 2018/2019, 2019/2020, 2021/2022, 2024/2025)",
          "Ta\xE7a da Liga (2015/2016, 2016/2017, 2020/2021, 2021/2022, 2023/2024, 2024/2025)",
          "UEFA Futsal Champions League (2018/2019, 2020/2021, 2025/2026)"
        ]
      },
      history: [
        {
          ep: "2026/27",
          club: "Sporting",
          func: "Treinador principal",
          g: "10",
          w: "8",
          d: "2",
          l: "0",
          titles: "Superta\xE7a Futsal"
        },
        {
          ep: "2025/26",
          club: "Sporting",
          func: "Treinador principal",
          g: "49",
          w: "38",
          d: "4",
          l: "7",
          titles: "Liga dos Campe\xF5es Futsal, Superta\xE7a Futsal"
        },
        {
          ep: "2024/25",
          club: "Sporting",
          func: "Treinador principal",
          g: "51",
          w: "37",
          d: "7",
          l: "7",
          titles: "Ta\xE7a de Portugal Futsal, Ta\xE7a da Liga Futsal"
        },
        {
          ep: "2023/24",
          club: "Sporting",
          func: "Treinador principal",
          g: "47",
          w: "39",
          d: "3",
          l: "5",
          titles: "I Divis\xE3o Futsal, Ta\xE7a da Liga Futsal"
        },
        {
          ep: "2022/23",
          club: "Sporting",
          func: "Treinador principal",
          g: "47",
          w: "37",
          d: "7",
          l: "3",
          titles: "I Divis\xE3o Futsal, Superta\xE7a Futsal"
        },
        {
          ep: "2021/22",
          club: "Sporting",
          func: "Treinador principal",
          g: "50",
          w: "45",
          d: "1",
          l: "4",
          titles: "I Divis\xE3o Futsal, Ta\xE7a de Portugal Futsal, Superta\xE7a Futsal, Ta\xE7a da Liga Futsal"
        },
        {
          ep: "2020/21",
          club: "Sporting",
          func: "Treinador principal",
          g: "46",
          w: "42",
          d: "3",
          l: "1",
          titles: "Liga dos Campe\xF5es Futsal, I Divis\xE3o Futsal, Ta\xE7a da Liga Futsal"
        },
        {
          ep: "2019/20",
          club: "Sporting",
          func: "Treinador principal",
          g: "35",
          w: "31",
          d: "1",
          l: "3",
          titles: "Ta\xE7a de Portugal Futsal, Superta\xE7a Futsal"
        },
        {
          ep: "2018/19",
          club: "Sporting",
          func: "Treinador principal",
          g: "51",
          w: "41",
          d: "4",
          l: "6",
          titles: "Liga dos Campe\xF5es Futsal, Ta\xE7a de Portugal Futsal, Superta\xE7a Futsal"
        },
        {
          ep: "2017/18",
          club: "Sporting",
          func: "Treinador principal",
          g: "54",
          w: "47",
          d: "3",
          l: "4",
          titles: "I Divis\xE3o Futsal, Ta\xE7a de Portugal Futsal, Superta\xE7a Futsal, AF Lisboa Futsal Ta\xE7a de Honra"
        },
        {
          ep: "2016/17",
          club: "Sporting",
          func: "Treinador principal",
          g: "53",
          w: "45",
          d: "5",
          l: "3",
          titles: "I Divis\xE3o Futsal, Ta\xE7a da Liga Futsal, AF Lisboa Futsal Ta\xE7a de Honra"
        },
        {
          ep: "2015/16",
          club: "Sporting",
          func: "Treinador principal",
          g: "46",
          w: "41",
          d: "3",
          l: "2",
          titles: "I Divis\xE3o Futsal, Ta\xE7a de Portugal Futsal, Ta\xE7a da Liga Futsal, AF Lisboa Futsal Ta\xE7a de Honra"
        },
        {
          ep: "2014/15",
          club: "Sporting",
          func: "Treinador principal",
          g: "47",
          w: "35",
          d: "4",
          l: "8",
          titles: "Superta\xE7a Futsal"
        },
        {
          ep: "2013/14",
          club: "Sporting",
          func: "Treinador principal",
          g: "42",
          w: "34",
          d: "5",
          l: "3",
          titles: "I Divis\xE3o Futsal, Superta\xE7a Futsal, AF Lisboa Futsal Ta\xE7a de Honra"
        },
        {
          ep: "2012/13",
          club: "Sporting",
          func: "Treinador principal",
          g: "39",
          w: "37",
          d: "1",
          l: "1",
          titles: "I Divis\xE3o Futsal, Ta\xE7a de Portugal Futsal"
        },
        {
          ep: "2011/12",
          club: "CSKA Moskva",
          func: "Treinador-adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2010/11",
          club: "Instituto D. Jo\xE3o V",
          func: "Treinador principal",
          g: "34",
          w: "20",
          d: "2",
          l: "12",
          titles: "-"
        },
        {
          ep: "2009/10",
          club: "Instituto D. Jo\xE3o V",
          func: "Treinador principal",
          g: "35",
          w: "19",
          d: "3",
          l: "13",
          titles: "-"
        },
        {
          ep: "2008/09",
          club: "Instituto D. Jo\xE3o V",
          func: "Treinador principal",
          g: "31",
          w: "12",
          d: "6",
          l: "13",
          titles: "-"
        },
        {
          ep: "2007/08",
          club: "Instituto D. Jo\xE3o V",
          func: "Treinador principal",
          g: "31",
          w: "10",
          d: "10",
          l: "11",
          titles: "-"
        },
        {
          ep: "2006/07",
          club: "Instituto D. Jo\xE3o V",
          func: "Treinador principal",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "1996/97",
          club: "Acad\xE9mica SF [Jun.B S17]",
          func: "Treinador-adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      coach: {
        tactical: 19,
        motivation: 17,
        record: {
          games: 836,
          wins: 634,
          winRate: 0.758,
          titlesPts: 60.9
        }
      },
      ability: 20
    },
    {
      id: "scp-fp44544-adjunto",
      club: "scp",
      name: "Filipe Rodrigues",
      func: "Treinador-adjunto",
      role: "adjunto",
      nat: "Portugal",
      birth: "1982-02-16",
      src: "fp",
      fp: {
        games: 1,
        wins: 0,
        notWon: 0,
        titles: []
      },
      history: [
        {
          ep: "2019/20-2026/27",
          club: "Sporting",
          func: "Treinador-adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2015/16-2018/19",
          club: "Casal Velho",
          func: "Treinador-adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2013/14-2014/15",
          club: "Olho Marinho",
          func: "Treinador-adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 15
    },
    {
      id: "scp-fp51937-adjunto",
      club: "scp",
      name: "Paulo Lu\xEDs",
      func: "Treinador-adjunto principal",
      role: "adjunto",
      nat: "Portugal",
      birth: "1973-12-28",
      src: "fp",
      fp: {
        games: 2,
        wins: 1,
        notWon: 1,
        titles: []
      },
      history: [
        {
          ep: "2012/13-2026/27",
          club: "Sporting",
          func: "Treinador-adjunto principal",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2011/12",
          club: "Beneditense",
          func: "Treinador principal",
          g: "0",
          w: "0",
          d: "0",
          l: "0",
          titles: "-"
        },
        {
          ep: "2010/11",
          club: "Externato Benedita",
          func: "Treinador principal",
          g: "0",
          w: "0",
          d: "0",
          l: "0",
          titles: "-"
        }
      ],
      ability: 17
    },
    {
      id: "scp-fp51938-gr",
      club: "scp",
      name: "Diogo Carlos",
      func: "Treinador guarda-redes",
      role: "gr",
      nat: "Portugal",
      birth: "2000-03-27",
      src: "fp",
      fp: {
        games: 0,
        wins: 0,
        notWon: 0,
        titles: []
      },
      history: [
        {
          ep: "2025/26-2026/27",
          club: "Sporting",
          func: "Treinador guarda-redes",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2024/25",
          club: "Sporting",
          func: "Treinador estagi\xE1rio",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2023/24",
          club: "GRCP Casal do Rato [Jun.B S17]",
          func: "Treinador principal",
          g: "25",
          w: "8",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2022/23",
          club: "GRCP Casal do Rato [Jun.B S17]",
          func: "Treinador principal",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2021/22",
          club: "Filipa Lencastre Futsal [Jun.C S15]",
          func: "Treinador principal",
          g: "1",
          w: "0",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 9
    },
    {
      id: "scp-fp51939-analista",
      club: "scp",
      name: "Edgar Beldroega",
      func: "Analista",
      role: "analista",
      nat: "Portugal",
      birth: "2000-08-05",
      src: "fp",
      fp: {
        games: 0,
        wins: 0,
        notWon: 0,
        titles: []
      },
      history: [
        {
          ep: "2026/27",
          club: "Sporting",
          func: "Analista",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2024/25-2025/26",
          club: "Sporting",
          func: "Treinador-adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 9
    },
    {
      id: "scp-fp278-coordenador",
      club: "scp",
      name: "Rodrigo Pais de Almeida",
      func: "Diretor",
      role: "coordenador",
      nat: "Portugal",
      birth: "1979-10-15",
      src: "fp",
      fp: {
        games: 96,
        wins: 44,
        notWon: 52,
        titles: []
      },
      history: [
        {
          ep: "2026/2027",
          club: "Sporting CP",
          func: "Diretor",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2025/2026",
          club: "Sporting CP",
          func: "Diretor",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2024/2025",
          club: "Sporting CP",
          func: "Diretor",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2023/2024",
          club: "Sporting CP",
          func: "Diretor",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2022/2023",
          club: "Sporting CP",
          func: "Diretor",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2020/2021",
          club: "Le\xF5es de Porto Salvo",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2019/2020",
          club: "Le\xF5es de Porto Salvo",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2018/2019",
          club: "Le\xF5es de Porto Salvo",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2017/2018",
          club: "Le\xF5es de Porto Salvo",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2016/2017",
          club: "Le\xF5es de Porto Salvo",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2015/2016",
          club: "Le\xF5es de Porto Salvo",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2011/2012",
          club: "GDS Cascais",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2010/2011",
          club: "GDS Cascais",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2009/2010",
          club: "GDS Cascais",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2008/2009",
          club: "Le\xF5es de Porto Salvo",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2007/2008",
          club: "Le\xF5es de Porto Salvo",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2006/2007",
          club: "SL Benfica",
          func: "Treinador \xB7 Under 19",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2005/2006",
          club: "Le\xF5es de Porto Salvo",
          func: "Treinador \xB7 Under 17",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2004/2005",
          club: "Gr Tercena",
          func: "Treinador \xB7 Under 13",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2003/2004",
          club: "Gr Tercena",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2002/2003",
          club: "Gr Tercena",
          func: "Treinador \xB7 Under 11",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2001/2002",
          club: "Gr Tercena",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 15
    },
    {
      id: "lps-fp10352-principal",
      club: "lps",
      name: "Miguel Velez",
      func: "Treinador principal",
      role: "principal",
      nat: "Portugal",
      birth: "1984-05-03",
      src: "fp",
      fp: {
        games: 73,
        wins: 38,
        notWon: 35,
        titles: [
          "Ta\xE7a Nacional Sub 15 (2018/2019)"
        ]
      },
      history: [
        {
          ep: "2026/27",
          club: "Le\xF5es Porto Salvo",
          func: "Treinador principal",
          g: "6",
          w: "3",
          d: "1",
          l: "2",
          titles: "-"
        },
        {
          ep: "2025/26",
          club: "UPVN",
          func: "Treinador principal",
          g: "25",
          w: "16",
          d: "2",
          l: "7",
          titles: "-"
        },
        {
          ep: "2024/25",
          club: "UPVN / Torreense",
          func: "Treinador principal",
          g: "21",
          w: "6",
          d: "4",
          l: "11",
          titles: "-"
        },
        {
          ep: "2023/24",
          club: "AMSAC",
          func: "Treinador principal",
          g: "30",
          w: "20",
          d: "0",
          l: "10",
          titles: "-"
        },
        {
          ep: "2022/23",
          club: "AMSAC",
          func: "Treinador principal",
          g: "30",
          w: "14",
          d: "6",
          l: "10",
          titles: "-"
        },
        {
          ep: "2012/13-2021/22",
          club: "Sporting e AMSAC (forma\xE7\xE3o)",
          func: "Treinador principal",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "Ta\xE7a Nacional Sub-15 Futsal (2018/19) e t\xEDtulos regionais de forma\xE7\xE3o"
        }
      ],
      coach: {
        tactical: 12,
        motivation: 12,
        record: {
          games: 73,
          wins: 38,
          winRate: 0.523,
          titlesPts: 0.2
        }
      },
      ability: 11
    },
    {
      id: "lps-fp51911-adjunto",
      club: "lps",
      name: "Diogo Santos",
      func: "Treinador-adjunto",
      role: "adjunto",
      nat: "Portugal",
      birth: "1988-04-12",
      src: "fp",
      fp: {
        games: 0,
        wins: 0,
        notWon: 0,
        titles: []
      },
      history: [
        {
          ep: "2026/27",
          club: "Le\xF5es Porto Salvo",
          func: "Treinador-adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2024/25",
          club: "UPVN",
          func: "Treinador-adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 7
    },
    {
      id: "lps-fp51910-adjunto",
      club: "lps",
      name: "Gon\xE7alo Farinha",
      func: "Treinador-adjunto",
      role: "adjunto",
      nat: "Portugal",
      birth: "1976-08-03",
      src: "fp",
      fp: {
        games: 0,
        wins: 0,
        notWon: 0,
        titles: []
      },
      history: [
        {
          ep: "2026/27",
          club: "Le\xF5es Porto Salvo",
          func: "Treinador-adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2023/24-2025/26",
          club: "UPVN",
          func: "Treinador-adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2016/17-2022/23",
          club: "Belenenses, Estoril Praia, Benfica [Feminino]",
          func: "Treinador-adjunto / Preparador f\xEDsico",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 9
    },
    {
      id: "lps-fp51912-gr",
      club: "lps",
      name: "Jo\xE3o Coelho",
      func: "Treinador guarda-redes",
      role: "gr",
      nat: "Portugal",
      birth: "2003-01-23",
      src: "fp",
      fp: {
        games: 0,
        wins: 0,
        notWon: 0,
        titles: []
      },
      history: [
        {
          ep: "2026/27",
          club: "Le\xF5es Porto Salvo",
          func: "Treinador guarda-redes",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2023/24-2025/26",
          club: "UPVN, AMSAC",
          func: "Treinador guarda-redes",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 8
    },
    {
      id: "lps-fp27819-analista",
      club: "lps",
      name: "Jos\xE9 Peixeiro",
      func: "Analista",
      role: "analista",
      nat: "Portugal",
      birth: "1992-09-11",
      src: "fp",
      fp: {
        games: 0,
        wins: 0,
        notWon: 0,
        titles: []
      },
      history: [
        {
          ep: "2026/27",
          club: "Le\xF5es Porto Salvo",
          func: "Analista e scout",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2009/10-2024/25",
          club: "Infantado, Sporting, AMSAC (forma\xE7\xE3o)",
          func: "Treinador principal / adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 10
    },
    {
      id: "fun-fp184-principal",
      club: "fun",
      name: "Nuno Couto",
      func: "Treinador principal",
      role: "principal",
      nat: "Portugal",
      birth: "1984-07-27",
      src: "fp",
      fp: {
        games: 429,
        wins: 195,
        notWon: 234,
        titles: []
      },
      history: [
        {
          ep: "2026/27",
          club: "AD Fund\xE3o",
          func: "Treinador principal",
          g: "7",
          w: "4",
          d: "0",
          l: "3",
          titles: "-"
        },
        {
          ep: "2025/26",
          club: "AD Fund\xE3o",
          func: "Treinador principal",
          g: "25",
          w: "7",
          d: "7",
          l: "11",
          titles: "-"
        },
        {
          ep: "2024/25",
          club: "AD Fund\xE3o",
          func: "Treinador principal",
          g: "28",
          w: "11",
          d: "4",
          l: "13",
          titles: "-"
        },
        {
          ep: "2023/24",
          club: "AD Fund\xE3o",
          func: "Treinador principal",
          g: "25",
          w: "6",
          d: "5",
          l: "14",
          titles: "-"
        },
        {
          ep: "2022/23",
          club: "AD Fund\xE3o",
          func: "Treinador principal",
          g: "27",
          w: "12",
          d: "2",
          l: "13",
          titles: "-"
        },
        {
          ep: "2021/22",
          club: "AD Fund\xE3o",
          func: "Treinador principal",
          g: "34",
          w: "17",
          d: "6",
          l: "11",
          titles: "-"
        },
        {
          ep: "2020/21",
          club: "AD Fund\xE3o",
          func: "Treinador principal",
          g: "35",
          w: "20",
          d: "6",
          l: "9",
          titles: "-"
        },
        {
          ep: "2019/20",
          club: "AD Fund\xE3o",
          func: "Treinador principal",
          g: "22",
          w: "9",
          d: "3",
          l: "10",
          titles: "-"
        },
        {
          ep: "2018/19",
          club: "AD Fund\xE3o",
          func: "Treinador principal",
          g: "38",
          w: "20",
          d: "4",
          l: "14",
          titles: "AF Cast. Branco T. Honra Futsal Clubes Nacionais"
        },
        {
          ep: "2017/18",
          club: "AD Fund\xE3o",
          func: "Treinador principal",
          g: "19",
          w: "10",
          d: "1",
          l: "8",
          titles: "-"
        }
      ],
      coach: {
        tactical: 12,
        motivation: 12,
        record: {
          games: 429,
          wins: 195,
          winRate: 0.455,
          titlesPts: 0
        }
      },
      ability: 10
    },
    {
      id: "fun-fp1360-adjunto",
      club: "fun",
      name: "Rui Resende",
      func: "Treinador-adjunto",
      role: "adjunto",
      nat: "Portugal",
      birth: "1997-08-07",
      src: "fp",
      fp: {
        games: 21,
        wins: 4,
        notWon: 16,
        titles: []
      },
      history: [
        {
          ep: "2026/27",
          club: "AD Fund\xE3o",
          func: "Treinador-adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2020/21-2024/25",
          club: "Bairro Boa Esperan\xE7a",
          func: "Treinador principal",
          g: "0",
          w: "0",
          d: "0",
          l: "0",
          titles: "III Divis\xE3o Futsal (2022/23)"
        }
      ],
      ability: 8
    },
    {
      id: "tor-fp825-principal",
      club: "tor",
      name: "Nan\xE1",
      func: "Treinador principal",
      role: "principal",
      nat: "Portugal",
      birth: "1969-09-07",
      src: "fp",
      fp: {
        games: 127,
        wins: 55,
        notWon: 72,
        titles: [
          "2\xAA Divis\xE3o (2008/2009)"
        ]
      },
      history: [
        {
          ep: "2026/2027",
          club: "SCU Torreense",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2024/2025",
          club: "CA S. Marta Pinhal",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2023/2024",
          club: "Vit\xF3ria FC",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2022/2023",
          club: "Vit\xF3ria FC",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2021/2022",
          club: "Vit\xF3ria FC",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2020/2021",
          club: "Vit\xF3ria FC",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2019/2020",
          club: "FC Barreirense",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2017/2018",
          club: "GD Fabril",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2016/2017",
          club: "GD Fabril",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2012/2013",
          club: "GD Fabril",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2009/2010",
          club: "Vit. Olivais",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2008/2009",
          club: "SC Vila Verde",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2007/2008",
          club: "SC Vila Verde",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      coach: {
        tactical: 12,
        motivation: 11,
        record: {
          games: 127,
          wins: 55,
          winRate: 0.434,
          titlesPts: 0.4
        }
      },
      ability: 12
    },
    {
      id: "tor-fp51927-adjunto",
      club: "tor",
      name: "Barth Sorrilha",
      func: "Treinador-adjunto",
      role: "adjunto",
      nat: "Portugal",
      birth: "?",
      src: "fp",
      fp: {
        games: 2,
        wins: 1,
        notWon: 1,
        titles: []
      },
      history: [
        {
          ep: "2026/2027",
          club: "SCU Torreense",
          func: "Adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 6
    },
    {
      id: "tor-fp51928-adjunto",
      club: "tor",
      name: "Francisco Lima",
      func: "Treinador-adjunto",
      role: "adjunto",
      nat: "Portugal",
      birth: "?",
      src: "fp",
      fp: {
        games: 0,
        wins: 0,
        notWon: 0,
        titles: []
      },
      history: [
        {
          ep: "2026/2027",
          club: "SCU Torreense",
          func: "Adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 6
    },
    {
      id: "tor-fp43401-adjunto",
      club: "tor",
      name: "Igor Gomes",
      func: "Treinador-adjunto",
      role: "adjunto",
      nat: "Portugal",
      birth: "1999-12-14",
      src: "fp",
      fp: {
        games: 6,
        wins: 1,
        notWon: 5,
        titles: []
      },
      history: [
        {
          ep: "2026/2027",
          club: "SCU Torreense",
          func: "Adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2024/2025",
          club: "SCU Torreense",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2021/2022",
          club: "SCU Torreense",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 7
    },
    {
      id: "tor-fp51929-fisico",
      club: "tor",
      name: "Andr\xE9 Jacinto",
      func: "Preparador f\xEDsico",
      role: "fisico",
      nat: "Portugal",
      birth: "?",
      src: "fp",
      fp: {
        games: 0,
        wins: 0,
        notWon: 0,
        titles: []
      },
      history: [
        {
          ep: "2026/2027",
          club: "SCU Torreense",
          func: "Preparador F\xEDsico",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 6
    },
    {
      id: "fzz-fp27892-principal",
      club: "fzz",
      name: "Cristiano Coelho",
      func: "Treinador principal",
      role: "principal",
      nat: "Portugal",
      birth: "1992-08-31",
      src: "fp",
      fp: {
        games: 37,
        wins: 15,
        notWon: 22,
        titles: []
      },
      history: [
        {
          ep: "2026/2027",
          club: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2025/2026",
          club: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2023/2024",
          club: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      coach: {
        tactical: 10,
        motivation: 11,
        record: {
          games: 37,
          wins: 15,
          winRate: 0.405,
          titlesPts: 0
        }
      },
      ability: 7
    },
    {
      id: "fzz-fp51924-adjunto",
      club: "fzz",
      name: "Jos\xE9 Marques",
      func: "Treinador-adjunto",
      role: "adjunto",
      nat: "Portugal",
      birth: "?",
      src: "fp",
      fp: {
        games: 0,
        wins: 0,
        notWon: 0,
        titles: []
      },
      history: [
        {
          ep: "2026/2027",
          club: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          func: "Adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 6
    },
    {
      id: "fzz-fp43428-adjunto",
      club: "fzz",
      name: "Marco Oliveira",
      func: "Treinador-adjunto",
      role: "adjunto",
      nat: "Portugal",
      birth: "?",
      src: "fp",
      fp: {
        games: 6,
        wins: 2,
        notWon: 4,
        titles: []
      },
      history: [
        {
          ep: "2026/2027",
          club: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          func: "Adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2022/2023",
          club: "SC Barbarense",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 7
    },
    {
      id: "scb-fp148-principal",
      club: "scb",
      name: "Joel Rocha",
      func: "Treinador principal",
      role: "principal",
      nat: "Portugal",
      birth: "1981-10-18",
      src: "fp",
      fp: {
        games: 590,
        wins: 398,
        notWon: 192,
        titles: [
          "Ta\xE7a de Portugal (2013/2014, 2014/2015, 2016/2017, 2023/2024)",
          "Superta\xE7a (2015/2016, 2016/2017, 2024/2025)",
          "Ta\xE7a da Liga (2017/2018, 2018/2019, 2019/2020)",
          "Liga Placard (2014/2015, 2018/2019)"
        ]
      },
      history: [
        {
          ep: "2026/27",
          club: "SC Braga",
          func: "Treinador principal",
          g: "6",
          w: "3",
          d: "1",
          l: "2",
          titles: "-"
        },
        {
          ep: "2025/26",
          club: "SC Braga",
          func: "Treinador principal",
          g: "31",
          w: "14",
          d: "5",
          l: "12",
          titles: "-"
        },
        {
          ep: "2024/25",
          club: "SC Braga",
          func: "Treinador principal",
          g: "38",
          w: "22",
          d: "5",
          l: "11",
          titles: "Superta\xE7a Futsal"
        },
        {
          ep: "2023/24",
          club: "SC Braga",
          func: "Treinador principal",
          g: "37",
          w: "27",
          d: "3",
          l: "7",
          titles: "Ta\xE7a de Portugal Futsal"
        },
        {
          ep: "2022/23",
          club: "SC Braga",
          func: "Treinador principal",
          g: "33",
          w: "25",
          d: "3",
          l: "5",
          titles: "-"
        },
        {
          ep: "2021/22",
          club: "SC Braga/AAUM",
          func: "Treinador principal",
          g: "24",
          w: "8",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2020/21",
          club: "Benfica",
          func: "Treinador principal",
          g: "44",
          w: "35",
          d: "4",
          l: "5",
          titles: "-"
        },
        {
          ep: "2019/20",
          club: "Benfica",
          func: "Treinador principal",
          g: "33",
          w: "25",
          d: "3",
          l: "5",
          titles: "Ta\xE7a da Liga Futsal"
        },
        {
          ep: "2018/19",
          club: "Benfica",
          func: "Treinador principal",
          g: "50",
          w: "43",
          d: "3",
          l: "4",
          titles: "I Divis\xE3o Futsal, Ta\xE7a da Liga Futsal"
        },
        {
          ep: "2017/18",
          club: "Benfica",
          func: "Treinador principal",
          g: "45",
          w: "36",
          d: "3",
          l: "6",
          titles: "Ta\xE7a da Liga Futsal"
        },
        {
          ep: "2016/17",
          club: "Benfica",
          func: "Treinador principal",
          g: "39",
          w: "28",
          d: "7",
          l: "4",
          titles: "Ta\xE7a de Portugal Futsal, Superta\xE7a Futsal"
        },
        {
          ep: "2015/16",
          club: "Benfica",
          func: "Treinador principal",
          g: "55",
          w: "38",
          d: "6",
          l: "11",
          titles: "Superta\xE7a Futsal"
        },
        {
          ep: "2014/15",
          club: "Benfica",
          func: "Treinador principal",
          g: "42",
          w: "36",
          d: "5",
          l: "1",
          titles: "I Divis\xE3o Futsal, Ta\xE7a de Portugal Futsal, AF Lisboa Futsal Ta\xE7a de Honra"
        },
        {
          ep: "2013/14",
          club: "AD Fund\xE3o",
          func: "Treinador principal",
          g: "40",
          w: "20",
          d: "6",
          l: "14",
          titles: "Ta\xE7a de Portugal Futsal"
        },
        {
          ep: "2012/13",
          club: "AD Fund\xE3o",
          func: "Treinador principal",
          g: "33",
          w: "21",
          d: "3",
          l: "9",
          titles: "-"
        },
        {
          ep: "2011/12",
          club: "AD Fund\xE3o",
          func: "Treinador principal",
          g: "19",
          w: "5",
          d: "3",
          l: "11",
          titles: "-"
        },
        {
          ep: "2010/11",
          club: "AD Fund\xE3o",
          func: "Treinador principal",
          g: "33",
          w: "17",
          d: "2",
          l: "14",
          titles: "-"
        },
        {
          ep: "2003/04-2009/10",
          club: "AD Fund\xE3o, Esta\xE7\xE3o, Carapalha (adjunto, forma\xE7\xE3o e feminino)",
          func: "Treinador-adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      coach: {
        tactical: 16,
        motivation: 14,
        record: {
          games: 590,
          wins: 398,
          winRate: 0.674,
          titlesPts: 16.8
        }
      },
      ability: 19
    },
    {
      id: "scb-fp51916-adjunto",
      club: "scb",
      name: "Jo\xE3o Silva",
      func: "Treinador-adjunto",
      role: "adjunto",
      nat: "Portugal",
      birth: "2000-05-22",
      src: "fp",
      fp: {
        games: 0,
        wins: 0,
        notWon: 0,
        titles: []
      },
      history: [
        {
          ep: "2023/24-2026/27",
          club: "SC Braga",
          func: "Treinador-adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2018/19-2022/23",
          club: "Acad\xE9mica, Anadia (forma\xE7\xE3o)",
          func: "Treinador principal / adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 10
    },
    {
      id: "scb-fp1065-adjunto",
      club: "scb",
      name: "Pedro Holstein",
      func: "Treinador-adjunto",
      role: "adjunto",
      nat: "Portugal",
      birth: "1980-12-08",
      src: "fp",
      fp: {
        games: 9,
        wins: 4,
        notWon: 4,
        titles: []
      },
      history: [
        {
          ep: "2021/22-2026/27",
          club: "SC Braga",
          func: "Treinador-adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2018/19",
          club: "\xC2ncora Praia",
          func: "Treinador principal",
          g: "13",
          w: "6",
          d: "0",
          l: "7",
          titles: "-"
        },
        {
          ep: "2015/16-2017/18",
          club: "\xC2ncora Praia",
          func: "Treinador principal",
          g: "3",
          w: "3",
          d: "0",
          l: "0",
          titles: "-"
        },
        {
          ep: "2012/13-2014/15",
          club: "Lavradas, Ponte da Barca, Santa Luzia",
          func: "Treinador principal",
          g: "5",
          w: "2",
          d: "0",
          l: "3",
          titles: "AF Viana do Castelo Futsal (2013/14)"
        }
      ],
      ability: 14
    },
    {
      id: "scp-diogomendes-scout",
      club: "scp",
      name: "Diogo Mendes",
      func: "Scout",
      role: "scout",
      nat: "Portugal",
      birth: "1995-06-12",
      history: [
        {
          ep: "2025/26-2026/27",
          club: "Sporting",
          func: "Scout",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2024/25-2025/26",
          club: "Sporting [Jun.A S19]",
          func: "Treinador-adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "I Divis\xE3o Juniores A (Sub-19)"
        },
        {
          ep: "2024/25",
          club: "Sporting [Feminino B]",
          func: "Preparador f\xEDsico",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2023/24",
          club: "Academia Condeixa [Jun.B S17]",
          func: "Treinador-adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "AF Coimbra Futsal Juniores A"
        },
        {
          ep: "2020/21-2022/23",
          club: "CS S\xE3o Jo\xE3o [Jun.A S19]",
          func: "Treinador-adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2019/20",
          club: "CB Oleiros",
          func: "Coordenador t\xE9cnico",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2015/16-2018/19",
          club: "CB Oleiros / CS S\xE3o Jo\xE3o [jovens]",
          func: "Treinador principal",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "AF Castelo Branco Futsal Juniores B, AF Coimbra Futsal Juniores D Ta\xE7a"
        }
      ],
      ability: 10
    },
    {
      id: "slb-ruidomingos-fisio",
      club: "slb",
      name: "Rui Domingos",
      func: "M\xE9dico",
      role: "fisio",
      nat: "Portugal",
      birth: "1984-12-05",
      history: [
        {
          ep: "2024/25-2026/27",
          club: "Benfica (futsal, basquetebol, andebol, voleibol)",
          func: "M\xE9dico",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2020/21-2023/24",
          club: "Benfica [Basket]",
          func: "M\xE9dico",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 12
    },
    {
      id: "slb-fabiofrancisco-fisio",
      club: "slb",
      name: "F\xE1bio Francisco",
      func: "Fisioterapeuta",
      role: "fisio",
      nat: "Portugal",
      birth: "1993-01-12",
      history: [
        {
          ep: "2025/26-2026/27",
          club: "Benfica",
          func: "Fisioterapeuta",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 8
    },
    {
      id: "slb-ricardotavares-fisico",
      club: "slb",
      name: "Ricardo Tavares",
      func: "Fisiologista",
      role: "fisico",
      nat: "Portugal",
      birth: "1980-07-30",
      history: [
        {
          ep: "2024/25-2026/27",
          club: "Benfica",
          func: "Fisiologista",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2011/12-2023/24",
          club: "Benfica (h\xF3quei, feminino, Sub-23, juniores)",
          func: "Preparador f\xEDsico",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 17
    },
    {
      id: "slb-pedromartins-nutricionista",
      club: "slb",
      name: "Pedro Martins",
      func: "Nutricionista",
      role: "nutricionista",
      nat: "Portugal",
      birth: "?",
      history: [
        {
          ep: "2023/24-2026/27",
          club: "Benfica",
          func: "Nutricionista",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 9
    },
    {
      id: "slb-joanaaraujo-psicologo",
      club: "slb",
      name: "Joana Ara\xFAjo",
      func: "Psic\xF3loga",
      role: "psicologo",
      nat: "Portugal",
      birth: "?",
      history: [
        {
          ep: "2021/22-2026/27",
          club: "Benfica (futsal, basquetebol, andebol, h\xF3quei)",
          func: "Psic\xF3loga",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2018/19-2020/21",
          club: "UD Oliveirense",
          func: "Psic\xF3loga",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 12
    },
    {
      id: "slb-raulmoreira-coordenador",
      club: "slb",
      name: "Raul Moreira",
      func: "Coordenador geral",
      role: "coordenador",
      nat: "Portugal",
      birth: "1978-04-20",
      history: [
        {
          ep: "2024/25-2026/27",
          club: "Benfica",
          func: "Coordenador geral",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2015/16-2022/23",
          club: "Caxinas (forma\xE7\xE3o e coordena\xE7\xE3o)",
          func: "Treinador principal / Coordenador t\xE9cnico",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "I Divis\xE3o Juniores A (Sub-19) Futsal (2021/22)"
        },
        {
          ep: "2014/15",
          club: "Rio Ave",
          func: "Treinador principal",
          g: "7",
          w: "1",
          d: "0",
          l: "6",
          titles: "-"
        },
        {
          ep: "2013/14",
          club: "Rio Ave",
          func: "Treinador principal",
          g: "16",
          w: "5",
          d: "3",
          l: "8",
          titles: "-"
        },
        {
          ep: "2012/13",
          club: "Rio Ave",
          func: "Treinador principal",
          g: "12",
          w: "6",
          d: "0",
          l: "6",
          titles: "-"
        },
        {
          ep: "2011/12",
          club: "Rio Ave",
          func: "Treinador principal",
          g: "5",
          w: "5",
          d: "0",
          l: "0",
          titles: "-"
        },
        {
          ep: "2007/08",
          club: "JuveNorte",
          func: "Treinador principal",
          g: "28",
          w: "12",
          d: "4",
          l: "12",
          titles: "-"
        },
        {
          ep: "2006/07-2010/11",
          club: "Rio Ave / FJ Antunes",
          func: "Treinador-adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 13
    },
    {
      id: "slb-tiagomartins-outro",
      club: "slb",
      name: "Tiago Martins",
      func: "T\xE9cnico de equipamentos",
      role: "outro",
      nat: "Portugal",
      birth: "?",
      history: [
        {
          ep: "2020/21-2026/27",
          club: "Benfica",
          func: "T\xE9cnico de equipamentos",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 12
    },
    {
      id: "lps-josepeixeiro-scout",
      club: "lps",
      name: "Jos\xE9 Peixeiro",
      func: "Scout",
      role: "scout",
      nat: "Portugal",
      birth: "1992-09-11",
      history: [
        {
          ep: "2026/27",
          club: "Le\xF5es Porto Salvo",
          func: "Analista e scout",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2009/10-2024/25",
          club: "Infantado, Sporting, AMSAC (forma\xE7\xE3o)",
          func: "Treinador principal / adjunto",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 10
    },
    {
      id: "lps-flaviofonseca-fisio",
      club: "lps",
      name: "Fl\xE1vio Fonseca",
      func: "Fisioterapeuta",
      role: "fisio",
      nat: "Portugal",
      birth: "1988-03-17",
      history: [
        {
          ep: "2023/24-2026/27",
          club: "Le\xF5es Porto Salvo",
          func: "Fisioterapeuta",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2016/17-2022/23",
          club: "Al Yarmouk, Sporting [Feminino/S20], Fut. Benfica [Feminino], Le\xF5es Porto Salvo",
          func: "Fisioterapeuta",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      ability: 9
    }
  ]
};

// src/data/esp/staff.json
var staff_default2 = {
  _info: "Liga Prime Futsal 2026/27: planteis da RFEF (futsal.rfef.es) + historial do futsalportugal.com (recolha 2/11/2026, 1 p\xE1gina a cada 7 s). S\xF3 os treinadores principais (o site n\xE3o lista o resto da equipa t\xE9cnica em Espanha); ability \xE9 estimativa.",
  people: [
    {
      id: "stc-fp286505-adjunto",
      club: "stc",
      name: "Jorge Vargas Perez",
      func: "Treinador-adjunto",
      role: "adjunto",
      nat: "Espanha",
      birth: "?",
      src: "fp",
      ability: 6,
      fp: {
        games: 2,
        wins: 0,
        notWon: 2,
        titles: []
      },
      history: [
        {
          ep: "2026/2027",
          club: "Industrias Santa Coloma",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ]
    },
    {
      id: "stc-fp21211-principal",
      club: "stc",
      name: "Xavi Closas",
      func: "Treinador principal",
      role: "principal",
      nat: "Espanha",
      birth: "1978-07-28",
      src: "fp",
      ability: 8,
      fp: {
        games: 123,
        wins: 44,
        notWon: 79,
        titles: []
      },
      history: [
        {
          ep: "2026/2027",
          club: "Industrias Santa Coloma",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2025/2026",
          club: "Industrias Santa Coloma",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2024/2025",
          club: "Industrias Santa Coloma",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2023/2024",
          club: "Industrias Santa Coloma",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2022/2023",
          club: "Industrias Santa Coloma",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      coach: {
        tactical: 12,
        motivation: 12,
        record: {
          games: 123,
          wins: 44,
          winRate: 0.358,
          titlesPts: 0
        }
      }
    },
    {
      id: "par-fp27900-principal",
      club: "par",
      name: "Gerard Casas",
      func: "Treinador principal",
      role: "principal",
      nat: "Espanha",
      birth: "1989-02-07",
      src: "fp",
      ability: 7,
      fp: {
        games: 33,
        wins: 12,
        notWon: 21,
        titles: []
      },
      history: [
        {
          ep: "2026/2027",
          club: "O Parrulo Ferrol",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2025/2026",
          club: "O Parrulo Ferrol",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      coach: {
        tactical: 12,
        motivation: 12,
        record: {
          games: 33,
          wins: 12,
          winRate: 0.364,
          titlesPts: 0
        }
      }
    },
    {
      id: "pal-fp779-principal",
      club: "pal",
      name: "Antonio Vadillo",
      func: "Treinador principal",
      role: "principal",
      nat: "Espanha",
      birth: "1977-03-27",
      src: "fp",
      ability: 15,
      fp: {
        games: 579,
        wins: 289,
        notWon: 289,
        titles: [
          "UEFA Futsal Champions League (2022/2023, 2023/2024, 2024/2025)"
        ]
      },
      history: [
        {
          ep: "2026/2027",
          club: "Islas Baleares Palma Futsal",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2025/2026",
          club: "Islas Baleares Palma Futsal",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2024/2025",
          club: "Islas Baleares Palma Futsal",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2023/2024",
          club: "Islas Baleares Palma Futsal",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2022/2023",
          club: "Islas Baleares Palma Futsal",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2021/2022",
          club: "Islas Baleares Palma Futsal",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2020/2021",
          club: "Islas Baleares Palma Futsal",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2019/2020",
          club: "Islas Baleares Palma Futsal",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2018/2019",
          club: "Islas Baleares Palma Futsal",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2017/2018",
          club: "Islas Baleares Palma Futsal",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2016/2017",
          club: "Islas Baleares Palma Futsal",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      coach: {
        tactical: 19,
        motivation: 16,
        record: {
          games: 579,
          wins: 289,
          winRate: 0.501,
          titlesPts: 12
        }
      }
    },
    {
      id: "osa-fp67601-adjunto",
      club: "osa",
      name: "Gonzalo Iglesias Alonso",
      func: "Treinador-adjunto",
      role: "adjunto",
      nat: "Espanha",
      birth: "?",
      src: "fp",
      ability: 6,
      fp: {
        games: 2,
        wins: 1,
        notWon: 1,
        titles: []
      },
      history: [
        {
          ep: "2026/2027",
          club: "Osasuna Magna Xota FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ]
    },
    {
      id: "osa-fp772-principal",
      club: "osa",
      name: "Imanol Arregui Sarasa",
      func: "Treinador principal",
      role: "principal",
      nat: "Espanha",
      birth: "1971-12-07",
      src: "fp",
      ability: 12,
      fp: {
        games: 397,
        wins: 166,
        notWon: 231,
        titles: []
      },
      history: [
        {
          ep: "2026/2027",
          club: "Osasuna Magna Xota FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2022/2023",
          club: "Osasuna Magna Xota FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2021/2022",
          club: "Osasuna Magna Xota FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2020/2021",
          club: "Osasuna Magna Xota FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2019/2020",
          club: "Osasuna Magna Xota FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2018/2019",
          club: "Osasuna Magna Xota FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2017/2018",
          club: "Osasuna Magna Xota FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2016/2017",
          club: "Osasuna Magna Xota FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2015/2016",
          club: "Osasuna Magna Xota FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2014/2015",
          club: "Osasuna Magna Xota FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2013/2014",
          club: "Osasuna Magna Xota FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2012/2013",
          club: "Osasuna Magna Xota FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2011/2012",
          club: "Osasuna Magna Xota FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2010/2011",
          club: "Osasuna Magna Xota FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      coach: {
        tactical: 13,
        motivation: 12,
        record: {
          games: 397,
          wins: 166,
          winRate: 0.418,
          titlesPts: 0
        }
      }
    },
    {
      id: "int-fp17601-principal",
      club: "int",
      name: "Alberto Riquer",
      func: "Treinador principal",
      role: "principal",
      nat: "Espanha",
      birth: "1974-10-09",
      src: "fp",
      ability: 10,
      fp: {
        games: 150,
        wins: 63,
        notWon: 87,
        titles: []
      },
      history: [
        {
          ep: "2026/2027",
          club: "Inter FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2025/2026",
          club: "Inter FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2024/2025",
          club: "Inter FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2023/2024",
          club: "Inter FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2021/2022",
          club: "Burela FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      coach: {
        tactical: 12,
        motivation: 12,
        record: {
          games: 150,
          wins: 63,
          winRate: 0.42,
          titlesPts: 0
        }
      }
    },
    {
      id: "zar-fp26394-principal",
      club: "zar",
      name: "Jorge Palos",
      func: "Treinador principal",
      role: "principal",
      nat: "Espanha",
      birth: "1996-01-05",
      src: "fp",
      ability: 7,
      fp: {
        games: 37,
        wins: 2,
        notWon: 35,
        titles: []
      },
      history: [
        {
          ep: "2026/2027",
          club: "Wanapix AD Sala 10 Zaragoza",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2024/2025",
          club: "Wanapix AD Sala 10 Zaragoza",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2021/2022",
          club: "Wanapix AD Sala 10 Zaragoza",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      coach: {
        tactical: 9,
        motivation: 9,
        record: {
          games: 37,
          wins: 2,
          winRate: 0.054,
          titlesPts: 0
        }
      }
    },
    {
      id: "jae-fp780-principal",
      club: "jae",
      name: "Dani Rodr\xEDguez",
      func: "Treinador principal",
      role: "principal",
      nat: "Espanha",
      birth: "1978-04-02",
      src: "fp",
      ability: 12,
      fp: {
        games: 397,
        wins: 171,
        notWon: 226,
        titles: [
          "Copa de Espa\xF1a (2025/2026)"
        ]
      },
      history: [
        {
          ep: "2026/2027",
          club: "Ja\xE9n Para\xEDso Interior",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2025/2026",
          club: "Ja\xE9n Para\xEDso Interior",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2024/2025",
          club: "Ja\xE9n Para\xEDso Interior",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2023/2024",
          club: "Ja\xE9n Para\xEDso Interior",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2022/2023",
          club: "Ja\xE9n Para\xEDso Interior",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2021/2022",
          club: "Ja\xE9n Para\xEDso Interior",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2020/2021",
          club: "Ja\xE9n Para\xEDso Interior",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2019/2020",
          club: "Ja\xE9n Para\xEDso Interior",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2018/2019",
          club: "Ja\xE9n Para\xEDso Interior",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2017/2018",
          club: "Ja\xE9n Para\xEDso Interior",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2016/2017",
          club: "Ja\xE9n Para\xEDso Interior",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2015/2016",
          club: "Ja\xE9n Para\xEDso Interior",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2014/2015",
          club: "Ja\xE9n Para\xEDso Interior",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      coach: {
        tactical: 14,
        motivation: 12,
        record: {
          games: 397,
          wins: 171,
          winRate: 0.431,
          titlesPts: 1.5
        }
      }
    },
    {
      id: "pen-fp66413-principal",
      club: "pen",
      name: "Gerard Pus\xF3",
      func: "Treinador principal",
      role: "principal",
      nat: "Espanha",
      birth: "1991-01-22",
      src: "fp",
      ability: 6,
      fp: {
        games: 6,
        wins: 1,
        notWon: 5,
        titles: []
      },
      history: [
        {
          ep: "2026/2027",
          club: "Pe\xF1\xEDscola FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      coach: {
        tactical: 10,
        motivation: 10,
        record: {
          games: 6,
          wins: 1,
          winRate: 0.167,
          titlesPts: 0
        }
      }
    },
    {
      id: "epz-fp13835-principal",
      club: "epz",
      name: "Josan Gonz\xE1lez",
      func: "Treinador principal",
      role: "principal",
      nat: "Espanha",
      birth: "1980-10-23",
      src: "fp",
      ability: 11,
      fp: {
        games: 197,
        wins: 77,
        notWon: 120,
        titles: [
          "Supercopa Espa\xF1a  (2026/2027)"
        ]
      },
      history: [
        {
          ep: "2026/2027",
          club: "ElPozo Murcia",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2025/2026",
          club: "ElPozo Murcia",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2024/2025",
          club: "ElPozo Murcia",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2023/2024",
          club: "C\xF3rdoba Patrimonio",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2022/2023",
          club: "C\xF3rdoba Patrimonio",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2021/2022",
          club: "C\xF3rdoba Patrimonio",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2020/2021",
          club: "C\xF3rdoba Patrimonio",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      coach: {
        tactical: 13,
        motivation: 12,
        record: {
          games: 197,
          wins: 77,
          winRate: 0.391,
          titlesPts: 0.6
        }
      }
    },
    {
      id: "jca-fp832-principal",
      club: "jca",
      name: "Duda",
      func: "Treinador principal",
      role: "principal",
      nat: "Brasil",
      birth: "1969-12-08",
      src: "fp",
      ability: 15,
      fp: {
        games: 577,
        wins: 347,
        notWon: 230,
        titles: [
          "Supercopa Espa\xF1a  (2023/2024, 2024/2025, 2025/2026)",
          "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2023/2024, 2024/2025)"
        ]
      },
      history: [
        {
          ep: "2026/2027",
          club: "Jimbee Cartagena FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2025/2026",
          club: "Jimbee Cartagena FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2024/2025",
          club: "Jimbee Cartagena FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2023/2024",
          club: "Jimbee Cartagena FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2022/2023",
          club: "Jimbee Cartagena FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2021/2022",
          club: "Jimbee Cartagena FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2020/2021",
          club: "Jimbee Cartagena FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2019/2020",
          club: "Jimbee Cartagena FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2017/2018",
          club: "ElPozo Murcia",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2016/2017",
          club: "ElPozo Murcia",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2015/2016",
          club: "ElPozo Murcia",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2014/2015",
          club: "ElPozo Murcia",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2013/2014",
          club: "ElPozo Murcia",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2012/2013",
          club: "ElPozo Murcia",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2011/2012",
          club: "ElPozo Murcia",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2010/2011",
          club: "ElPozo Murcia",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2009/2010",
          club: "ElPozo Murcia",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2007/2008",
          club: "ElPozo Murcia",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2006/2007",
          club: "ElPozo Murcia",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2004/2005",
          club: "ElPozo Murcia",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      coach: {
        tactical: 19,
        motivation: 16,
        record: {
          games: 577,
          wins: 347,
          winRate: 0.602,
          titlesPts: 7.8
        }
      }
    },
    {
      id: "bar-fp5671-principal",
      club: "bar",
      name: "Javi Rodr\xEDguez",
      func: "Treinador principal",
      role: "principal",
      nat: "Espanha",
      birth: "1974-03-25",
      src: "fp",
      ability: 14,
      fp: {
        games: 318,
        wins: 200,
        notWon: 117,
        titles: [
          "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2010/2011, 2011/2012, 2025/2026)",
          "UEFA Futsal Champions League (2001/2002, 2002/2003)"
        ]
      },
      history: [
        {
          ep: "2026/2027",
          club: "FC Barcelona",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2025/2026",
          club: "FC Barcelona",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2023/2024",
          club: "ElPozo Murcia",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2022/2023",
          club: "ElPozo Murcia",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2021/2022",
          club: "Industrias Santa Coloma",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2020/2021",
          club: "Industrias Santa Coloma",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2019/2020",
          club: "Industrias Santa Coloma",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2019/2020",
          club: "MFC Kherson",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2017/2018",
          club: "Gyori ETO",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      coach: {
        tactical: 20,
        motivation: 17,
        record: {
          games: 318,
          wins: 200,
          winRate: 0.631,
          titlesPts: 17
        }
      }
    },
    {
      id: "val-fp21214-principal",
      club: "val",
      name: "Marlon Velasco",
      func: "Treinador principal",
      role: "principal",
      nat: "Espanha",
      birth: "1986-12-28",
      src: "fp",
      ability: 9,
      fp: {
        games: 121,
        wins: 49,
        notWon: 72,
        titles: []
      },
      history: [
        {
          ep: "2026/2027",
          club: "Vi\xF1a Albali Valdepe\xF1as",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2025/2026",
          club: "Vi\xF1a Albali Valdepe\xF1as",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2024/2025",
          club: "Kairat Almaty",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2023/2024",
          club: "Kairat Almaty",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2022/2023",
          club: "Noia Portus Apostoli",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2013/2014",
          club: "Islas Baleares Palma Futsal",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2011/2012",
          club: "Islas Baleares Palma Futsal",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      coach: {
        tactical: 12,
        motivation: 12,
        record: {
          games: 121,
          wins: 49,
          winRate: 0.404,
          titlesPts: 0
        }
      }
    },
    {
      id: "cor-fp66381-principal",
      club: "cor",
      name: "David Fern\xE1ndez",
      func: "Treinador principal",
      role: "principal",
      nat: "Espanha",
      birth: "1998-09-28",
      src: "fp",
      ability: 6,
      fp: {
        games: 6,
        wins: 1,
        notWon: 5,
        titles: []
      },
      history: [
        {
          ep: "2026/2027",
          club: "C\xF3rdoba Patrimonio",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      coach: {
        tactical: 10,
        motivation: 10,
        record: {
          games: 6,
          wins: 1,
          winRate: 0.167,
          titlesPts: 0
        }
      }
    },
    {
      id: "man-fp6863-principal",
      club: "man",
      name: "Juanlu Alonso",
      func: "Treinador principal",
      role: "principal",
      nat: "Espanha",
      birth: "1976-02-13",
      src: "fp",
      ability: 13,
      fp: {
        games: 336,
        wins: 116,
        notWon: 220,
        titles: [
          "UEFA Futsal Champions League (2008/2009)"
        ]
      },
      history: [
        {
          ep: "2026/2027",
          club: "Quesos El Higaldo Manzanares FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2025/2026",
          club: "Quesos El Higaldo Manzanares FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2024/2025",
          club: "Quesos El Higaldo Manzanares FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2023/2024",
          club: "Quesos El Higaldo Manzanares FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2022/2023",
          club: "Quesos El Higaldo Manzanares FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2021/2022",
          club: "Quesos El Higaldo Manzanares FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2019/2020",
          club: "Pe\xF1\xEDscola FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2018/2019",
          club: "Pe\xF1\xEDscola FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2015/2016",
          club: "Burela FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2014/2015",
          club: "Burela FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2013/2014",
          club: "Burela FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2012/2013",
          club: "Burela FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2011/2012",
          club: "Benicarl\xF3 FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2010/2011",
          club: "Benicarl\xF3 FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2008/2009",
          club: "Inter FS",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      coach: {
        tactical: 15,
        motivation: 13,
        record: {
          games: 336,
          wins: 116,
          winRate: 0.346,
          titlesPts: 4
        }
      }
    },
    {
      id: "noi-fp27723-principal",
      club: "noi",
      name: "David Palmas",
      func: "Treinador principal",
      role: "principal",
      nat: "Espanha",
      birth: "1986-03-08",
      src: "fp",
      ability: 7,
      fp: {
        games: 180,
        wins: 74,
        notWon: 106,
        titles: []
      },
      history: [
        {
          ep: "2026/2027",
          club: "Noia Portus Apostoli",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2025/2026",
          club: "Noia Portus Apostoli",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        },
        {
          ep: "2024/2025",
          club: "Noia Portus Apostoli",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      coach: {
        tactical: 12,
        motivation: 12,
        record: {
          games: 180,
          wins: 74,
          winRate: 0.411,
          titlesPts: 0
        }
      }
    },
    {
      id: "eji-fp66416-principal",
      club: "eji",
      name: "Guillermo Mart\xEDnez",
      func: "Treinador principal",
      role: "principal",
      nat: "Espanha",
      birth: "1989-12-23",
      src: "fp",
      ability: 6,
      fp: {
        games: 7,
        wins: 2,
        notWon: 5,
        titles: []
      },
      history: [
        {
          ep: "2026/2027",
          club: "Sur Seeds El Ejido Futsal",
          func: "Treinador",
          g: "?",
          w: "?",
          d: "?",
          l: "?",
          titles: "-"
        }
      ],
      coach: {
        tactical: 11,
        motivation: 11,
        record: {
          games: 7,
          wins: 2,
          winRate: 0.286,
          titlesPts: 0
        }
      }
    }
  ]
};

// src/core/names.ts
var ES_FIRST_YOUNG = ["Hugo", "Pablo", "\xC1lvaro", "Adri\xE1n", "Mario", "Daniel", "Marcos", "Iker", "Javier", "Sergio", "Diego", "Alejandro", "Ra\xFAl", "Unai", "Pol", "Marc", "Aitor", "Nil", "Rub\xE9n", "Izan", "Gonzalo", "Jaime", "Carlos", "Manuel"];
var ES_FIRST = ["Javier", "Jos\xE9", "Antonio", "Manuel", "David", "Juan", "Francisco", "Jes\xFAs", "Carlos", "Miguel", "Rafael", "Pedro", "Sergio", "Alberto", "Fernando", "Luis", "Jordi", "\xD3scar", "Ra\xFAl", "Ignacio"];
var ES_LAST = ["Garc\xEDa", "Fern\xE1ndez", "Gonz\xE1lez", "Rodr\xEDguez", "L\xF3pez", "Mart\xEDnez", "S\xE1nchez", "P\xE9rez", "G\xF3mez", "Mart\xEDn", "Jim\xE9nez", "Ruiz", "Hern\xE1ndez", "D\xEDaz", "Moreno", "\xC1lvarez", "Mu\xF1oz", "Romero", "Navarro", "Torres", "Dom\xEDnguez", "Gil", "V\xE1zquez", "Serrano", "Ramos", "Blanco", "Molina", "Ortega"];
var isSpanish = (club) => club?.league === "esp1";
function spanishYouth(r) {
  return { name: `${ES_FIRST_YOUNG[Math.floor(r() * ES_FIRST_YOUNG.length)]} ${ES_LAST[Math.floor(r() * ES_LAST.length)]}`, nationality: r() < 0.9 ? "Espanha" : r() < 0.5 ? "Argentina" : "Brasil" };
}
var spanishName = (r) => `${ES_FIRST[Math.floor(r() * ES_FIRST.length)]} ${ES_LAST[Math.floor(r() * ES_LAST.length)]}`;

// src/core/staff.ts
var REAL = { people: [...staff_default.people, ...staff_default2.people] };
var ROLES = ["adjunto", "fisico", "gr", "fisio", "formacao"];
var FIRST = ["Jo\xE3o", "Rui", "Paulo", "Nuno", "Pedro", "Ricardo", "Hugo", "Carlos", "Lu\xEDs", "Jorge", "Bruno", "S\xE9rgio", "V\xEDtor", "Fernando", "Marco", "Filipe", "Tiago", "Andr\xE9", "Miguel", "Jos\xE9"];
var LAST = ["Silva", "Santos", "Ferreira", "Pereira", "Oliveira", "Costa", "Rodrigues", "Martins", "Sousa", "Fernandes", "Gon\xE7alves", "Gomes", "Lopes", "Marques", "Alves", "Almeida", "Ribeiro", "Pinto", "Carvalho", "Teixeira", "Moreira", "Correia", "Mendes", "Nunes", "Vieira", "Monteiro"];
var staffWage = (ability, club) => Math.max(400, Math.round(250 * Math.exp(ability * 0.11) * (club ? 0.3 + club.wealth / 100 : 1) / 50) * 50);
var staffBudget = (club) => club.staffBudget ?? Math.round(5 * staffWage(6 + club.wealth * 0.11, club) * 1.2);
function makeStaff(id, role, clubId, ability, r, year, club) {
  const a = Math.max(1, Math.min(20, Math.round(ability)));
  const name = isSpanish(club) ? spanishName(r) : `${FIRST[Math.floor(r() * FIRST.length)]} ${LAST[Math.floor(r() * LAST.length)]}`;
  return { id, name, ...isSpanish(club) ? { nat: "Espanha" } : {}, role, clubId, ability: a, age: 30 + Math.floor(r() * 28), wage: staffWage(a, club), until: year + 1 + Math.floor(r() * 3) };
}
function ensureStaff(s2) {
  if (s2.staff?.some((x) => x.real)) return;
  const r = rng("staff-ini");
  s2.staff = [];
  for (const p of REAL.people) {
    const club = s2.clubs.find((c2) => c2.id === p.club);
    if (!club || p.role === "principal") continue;
    const age = p.birth && p.birth !== "?" ? s2.season.year - Number(p.birth.slice(0, 4)) : 40;
    s2.staff.push({ id: `rs-${p.id}`, name: p.name, role: p.role, clubId: p.club, ability: Math.min(20, Math.round(p.ability + club.wealth * 0.035)), age, wage: staffWage(p.ability, club), until: s2.season.year + 2, func: p.func, nat: p.nat, history: p.history, real: true });
  }
  for (const c2 of s2.clubs) for (const role of ROLES) if (!s2.staff.some((x) => x.clubId === c2.id && x.role === role)) s2.staff.push(makeStaff(`st-${c2.id}-${role}`, role, c2.id, 4 + c2.wealth * 0.09 + (r() - 0.5) * 4, r, s2.season.year, c2));
  for (const c2 of s2.clubs) {
    c2.staffBudget = void 0;
    c2.staffBudget = Math.round(Math.max(staffBudget(c2), staffBill(s2, c2.id) * 1.1));
  }
  for (let i = 0; i < 25; i++) s2.staff.push(makeStaff(`st-free-${i}`, ROLES[i % 5], null, 4 + r() * 11, r, s2.season.year));
  const esp = s2.clubs.find((c2) => c2.league === "esp1");
  if (esp) for (let i = 0; i < 15; i++) s2.staff.push(makeStaff(`st-freeES-${i}`, ROLES[i % 5], null, 4 + r() * 11, r, s2.season.year, { ...esp, wealth: 55 }));
}
var staffOf = (s2, clubId, role) => (s2.staff ?? []).filter((x) => x.clubId === clubId && x.role === role).sort((a, b) => b.ability - a.ability)[0];
var abilityOf = (s2, clubId, role) => staffOf(s2, clubId, role)?.ability ?? 5;
var extra = (s2, clubId, role) => staffOf(s2, clubId, role)?.ability ?? 0;
var analystBonus = (s2, clubId) => extra(s2, clubId, "analista") * 0.075;
var staffBill = (s2, clubId) => (s2.staff ?? []).filter((x) => x.clubId === clubId).reduce((a, x) => a + x.wage, 0);
var juniorsId = (clubId) => `${clubId}@jun`;
var juniorsOf = (s2, clubId) => s2.players.filter((p) => p.clubId === juniorsId(clubId));
function academyLevel(s2, club) {
  const coachYouth = club.id === s2.clubId ? 12 : s2.coaches.find((c2) => c2.clubId === club.id)?.youth ?? 10;
  return Math.round(Math.min(20, club.wealth * 0.07 + abilityOf(s2, club.id, "formacao") * 0.45 + coachYouth * 0.2) * 10) / 10;
}
var PFIRST = ["Jo\xE3o", "Rodrigo", "Martim", "Tom\xE1s", "Afonso", "Diogo", "Gon\xE7alo", "Duarte", "Francisco", "Rafael", "Miguel", "Guilherme", "Gabriel", "Louren\xE7o", "Santiago", "Vicente", "Sim\xE3o", "Henrique", "Salvador", "Pedro", "Tiago", "Andr\xE9", "Bernardo", "Leonardo", "Dinis", "Kevin", "Wilson"];
function academyIntake(s2, club, year) {
  const r = rng(`acad-${club.id}-${year}`);
  const lvl = academyLevel(s2, club);
  const n = 2 + Math.floor(lvl / 7) + (r() < 0.5 ? 1 : 0);
  const out = [];
  for (let i = 0; i < n; i++) {
    const pos = i === 0 && r() < 0.35 ? "GR" : ["FIX", "ALA", "ALA", "PIV", "UNI", "FIX/ALA", "ALA/PIV"][Math.floor(r() * 7)];
    const who = isSpanish(club) ? spanishYouth(r) : { name: `${PFIRST[Math.floor(r() * PFIRST.length)]} ${LAST[Math.floor(r() * LAST.length)]}`, nationality: r() < 0.9 ? "Portugal" : "Cabo Verde" };
    const base = { id: `${club.id}j${year}${i}`, clubId: juniorsId(club.id), name: who.name, position: pos, number: null, age: 16 + Math.floor(r() * 2), nationality: who.nationality, attrs: {}, potential: 0 };
    const g = generateAttributes(base, 38 + lvl * 1.6, 0);
    const gem = r() < 0.04 + lvl * 6e-3 ? 2 + r() * 4 : 0;
    out.push({ ...base, attrs: g.attrs, potential: Math.min(20, Math.round((g.potential + gem + lvl * 0.1) * 10) / 10) });
  }
  return out;
}

// src/core/contracts.ts
var round = (x, step) => Math.max(step, Math.round(x / step) * step);
function marketWage(p, club) {
  const ov = overall(p.attrs, p.position);
  const base = 850 * Math.exp((ov - 8) * 0.25);
  const wealth = club.wageScale ?? 1.3 * Math.exp((club.wealth - 98) * 0.0296);
  const age = p.age <= 19 ? 0.55 : p.age <= 21 ? 0.75 : p.age >= 34 ? 0.8 : 1;
  return Math.max(400, round(base * wealth * age, 50));
}
var salaryBudget = (club) => club.budget ?? Math.round(27e5 * Math.exp((club.wealth - 98) * 0.0498) / 1e3) * 1e3;
function calibrateWages(s2) {
  for (const c2 of s2.clubs) {
    const squad = s2.players.filter((p) => p.clubId === c2.id);
    c2.wageScale = 1;
    const raw = squad.reduce((a, p) => a + marketWage(p, c2), 0) * 12;
    c2.wageScale = raw ? salaryBudget(c2) / raw : 1;
  }
}
function marketValue(p, club) {
  const ov = overall(p.attrs, p.position);
  const ageF = p.age <= 21 ? 1.6 : p.age <= 24 ? 1.3 : p.age <= 28 ? 1 : p.age <= 31 ? 0.6 : 0.25;
  const pot = 1 + Math.max(0, p.potential - ov) * 0.12;
  return round(850 * Math.exp((ov - 8) * 0.34) * 12 * 0.9 * ageF * pot * (0.7 + club.reputation / 200) * (p.valueK ?? 1), 5e3);
}
function clauseFor(value, club, r) {
  const mult = club.wealth >= 90 ? 8 + r() * 6 : club.wealth >= 70 ? 4 + r() * 3 : 2 + r() * 2;
  return round(value * mult, 25e3);
}
var REAL_WAGE = { slb12: 25e3 };
function makeContract(p, club, year, seed = "") {
  const r = rng(`ct-${p.id}-${year}${seed}`);
  const years = p.age >= 33 ? 1 : p.age <= 23 ? 2 + Math.floor(r() * 3) : 1 + Math.floor(r() * 3);
  const wage = REAL_WAGE[p.id] && seed === "-ini" ? REAL_WAGE[p.id] : round(marketWage(p, club) * (0.85 + r() * 0.3), 50);
  return { wage, until: year + years, clause: clauseFor(marketValue(p, club), club, r) };
}
function ensureContracts(s2) {
  if (s2.clubs.some((c2) => c2.wageScale === void 0)) calibrateWages(s2);
  for (const p of s2.players) {
    if (p.contract) continue;
    const c2 = s2.clubs.find((x) => x.id === p.clubId);
    if (c2) p.contract = makeContract(p, c2, s2.season.year, "-ini");
  }
}

// src/core/season/season.ts
var addDays = (d, n) => {
  const x = /* @__PURE__ */ new Date(d + "T12:00:00Z");
  x.setUTCDate(x.getUTCDate() + n);
  return x.toISOString().slice(0, 10);
};
var weekday = (d) => (/* @__PURE__ */ new Date(d + "T12:00:00Z")).getUTCDay();
var nextWeekday = (d, wd) => addDays(d, (wd - weekday(d) + 7) % 7);
function keyDates(y) {
  const n = y + 1;
  return {
    supertaca: nextWeekday(`${y}-09-01`, 6),
    leagueStart: nextWeekday(`${y}-09-10`, 6),
    tacaR1: nextWeekday(`${y}-12-07`, 3),
    tacaLigaQF: addDays(nextWeekday(`${n}-01-25`, 6), -2),
    // quinta
    tacaLigaSF: nextWeekday(`${n}-01-25`, 6),
    // sábado
    tacaLigaF: addDays(nextWeekday(`${n}-01-25`, 6), 1),
    // domingo
    playoffQF: nextWeekday(`${n}-03-12`, 6),
    playoffSF: nextWeekday(`${n}-04-02`, 6),
    tacaQF: nextWeekday(`${n}-04-20`, 3),
    // quarta
    tacaSF: addDays(nextWeekday(`${n}-04-20`, 3), 2),
    // sexta
    tacaF: addDays(nextWeekday(`${n}-04-20`, 3), 4),
    // domingo
    playoffF: nextWeekday(`${n}-05-08`, 6),
    end: `${n}-06-30`
  };
}
function leagueDates(y, rounds) {
  const k = keyDates(y);
  const blocked = (d2) => d2 >= `${y}-12-23` && d2 <= `${y + 1}-01-04` || d2 >= addDays(k.tacaLigaSF, -3) && d2 <= k.tacaLigaF;
  const out = [];
  let d = k.leagueStart;
  while (out.length < rounds) {
    if (!blocked(d)) out.push(d);
    d = addDays(d, 7);
  }
  return out;
}
function roundRobin(ids) {
  const t = [...ids];
  if (t.length % 2) t.push("__folga");
  const n = t.length;
  const rounds = [];
  for (let r = 0; r < n - 1; r++) {
    const games = [];
    for (let i = 0; i < n / 2; i++) {
      const a = t[i];
      const b = t[n - 1 - i];
      if (a === "__folga" || b === "__folga") continue;
      games.push([a, b]);
    }
    rounds.push(games);
    t.splice(1, 0, t.pop());
  }
  const last = {};
  const homes = {};
  for (const games of rounds) {
    for (let g = 0; g < games.length; g++) {
      const [a, b] = games[g];
      const score2 = (x) => (last[x] === "F" ? 2 : last[x] === "C" ? -2 : 0) - (homes[x] ?? 0) * 0.1;
      const [h, w] = score2(a) >= score2(b) ? [a, b] : [b, a];
      games[g] = [h, w];
      last[h] = "C";
      last[w] = "F";
      homes[h] = (homes[h] ?? 0) + 1;
    }
  }
  return rounds;
}
var fid = 0;
var newId = (y) => `f${y}_${++fid}`;
function createSeason(y, ranking, supercup, esp) {
  fid = 0;
  const r = rng("calendario" + y);
  const shuffled = [...ranking].sort(() => r() - 0.5);
  const first = roundRobin(shuffled);
  const rounds = [...first, ...first.map((g) => g.map(([a, b]) => [b, a]))];
  const dates = leagueDates(y, rounds.length);
  const k = keyDates(y);
  const fixtures = [];
  fixtures.push({ id: newId(y), comp: "supertaca", stage: "Final", date: k.supertaca, home: supercup[0], away: supercup[1], neutral: true, knockout: true });
  rounds.forEach(
    (games, i) => games.forEach(([h, a]) => fixtures.push({ id: newId(y), comp: "liga", stage: `Jornada ${i + 1}`, round: i + 1, date: dates[i], home: h, away: a, knockout: false }))
  );
  const low = ranking.slice(4);
  for (let i = 0; i < low.length / 2; i++) {
    const strong = low[i];
    const weak = low[low.length - 1 - i];
    fixtures.push({ id: newId(y), comp: "taca", stage: "1.\xAA eliminat\xF3ria", date: k.tacaR1, home: weak, away: strong, knockout: true });
  }
  const season = { year: y, label: `${y}/${String((y + 1) % 100).padStart(2, "0")}`, fixtures, series: [], winners: {}, finished: false };
  if (esp) addSpain(season, y, esp.ranking, esp.four);
  return season;
}
function spainDates(y) {
  const n = y + 1;
  const sat = (d) => nextWeekday(d, 6);
  return {
    superSF: addDays(sat(`${y}-09-01`), -1),
    superF: sat(`${y}-09-01`),
    aperturaStart: sat(`${y}-09-11`),
    aperturaEnd: `${n}-01-08`,
    clausuraStart: sat(`${n}-01-15`),
    clausuraEnd: `${n}-05-22`,
    qualR1: nextWeekday(`${n}-01-20`, 3),
    qualR2: nextWeekday(`${n}-02-03`, 3),
    qualR3: nextWeekday(`${n}-02-17`, 3),
    copaQF: `${n}-03-11`,
    copaSF: `${n}-03-13`,
    copaF: `${n}-03-14`,
    finalQF: sat(`${n}-05-29`),
    finalSF: sat(`${n}-06-09`),
    finalF: sat(`${n}-06-20`),
    perm: sat(`${n}-05-29`)
  };
}
function addSpain(s2, y, ranking, four) {
  const k = spainDates(y);
  const r = rng("calendario-esp" + y);
  const first = roundRobin([...ranking].sort(() => r() - 0.5));
  const blocked = (d) => d >= `${y}-12-23` && d <= `${y + 1}-01-04` || d >= addDays(k.copaQF, -3) && d <= addDays(k.copaF, 1) || d === k.superF;
  const dates = (from, to) => {
    const out = [];
    for (let d = from; out.length < first.length && d <= to; d = addDays(d, 7)) if (!blocked(d)) out.push(d);
    while (out.length < first.length) out.push(addDays(out[out.length - 1], 3));
    return out;
  };
  const ap = dates(k.aperturaStart, k.aperturaEnd), cl = dates(k.clausuraStart, k.clausuraEnd);
  first.forEach((games, i) => games.forEach(([h, a]) => s2.fixtures.push({ id: newId(y), comp: "esp", stage: `Apertura - Jornada ${i + 1}`, round: i + 1, date: ap[i], home: h, away: a, knockout: false })));
  first.forEach((games, i) => games.forEach(([h, a]) => s2.fixtures.push({ id: newId(y), comp: "esp", stage: `Clausura - Jornada ${i + 1}`, round: first.length + i + 1, date: cl[i], home: a, away: h, knockout: false })));
  if (four.length >= 4) {
    s2.fixtures.push({ id: newId(y), comp: "superEsp", stage: "Meias-finais", date: k.superSF, home: four[0], away: four[3], neutral: true, knockout: true });
    s2.fixtures.push({ id: newId(y), comp: "superEsp", stage: "Meias-finais", date: k.superSF, home: four[1], away: four[2], neutral: true, knockout: true });
  }
  s2.esp = {};
}

// src/core/attendance.ts
var ARENAS = {
  scp: { name: "Pavilh\xE3o Jo\xE3o Rocha", capacity: 3e3, capacityReal: true, style: "moderno", sides: ["N", "S", "E", "W"], seat: "#0a7a46", wall: "#45484d", roof: "laje", windows: false, ceilingDark: true, upperTier: true, cube: true, floor: { court: "#1f63b5", surround: "#d3542c" }, corners: true, rake: 0.5 },
  slb: { name: "Pavilh\xE3o Fidelidade", capacity: 2400, capacityReal: true, style: "moderno", sides: ["N", "S", "E", "W"], seat: "#c8102e", wall: "#d6d8db", roof: "treli\xE7a", windows: false, truss: "#c8102e", structure: "arcos", ceiling: "#b9bec4", skylights: true, cube: true, floor: { court: "#d9c39a", surround: "#c8102e", wood: true }, fronts: { bg: "#f5f5f5", fg: "#c8102e", text: ["E PLURIBUS UNUM", "SPORT LISBOA E BENFICA", "FIDELIDADE"] }, aisles: 14, rake: 0.46 },
  scb: { name: "AMCO Arena", capacity: 1400, capacityReal: true, style: "moderno", sides: ["N", "S"], seat: "#b3122a", wall: "#eef0f2", roof: "treli\xE7a", windows: true, truss: "#8f979f", wallArt: true, cube: false, floor: { court: "#d2a565", surround: "#d2a565", wood: true }, aisles: 20 },
  fun: { name: "Pavilh\xE3o Municipal do Fund\xE3o", capacity: 1056, capacityReal: true, style: "municipal", sides: ["N", "E"], seat: "#e4572e", wall: "#eceae4", roof: "treli\xE7a", windows: true, truss: "#c9ced4", floor: { court: "#2f7d4f", surround: "#3a8a5c" } },
  lps: { name: "Pavilh\xE3o dos Le\xF5es de Porto Salvo", capacity: 660, capacityReal: true, style: "clube", sides: ["N", "S"], seat: "#a8a29e", wall: "#f4f4f2", roof: "treli\xE7a", windows: true, truss: "#b8bec6", benches: true, floor: { court: "#c99a5e", surround: "#c99a5e", wood: true } },
  fzz: { name: "Pavilh\xE3o Municipal de Ferreira do Z\xEAzere", capacity: 700, capacityReal: true, style: "municipal", sides: ["N"], seat: "#9ca3af", wall: "#f2f0ea", roof: "treli\xE7a", windows: true, truss: "#e3b81f", standing: true, floor: { court: "#c99a5e", surround: "#d9a520", wood: true } },
  ele: { name: "Pavilh\xE3o Gimnodesportivo de Ponte de Sor", capacity: 720, capacityReal: true, style: "municipal", sides: ["N", "S"], seat: "#1f4d3a", wall: "#ece4d6", roof: "laje", windows: true, beams: "#c98a4a", pillars: "#b5583a", ceiling: "#f3efe7", floor: { court: "#d49a5c", surround: "#2f6db5", wood: true }, aisles: 12 },
  rav: { name: "Pavilh\xE3o Municipal de Vila do Conde", capacity: 800, capacityReal: true, style: "moderno", sides: ["N", "S", "W"], seat: "#1f2a44", wall: "#eef0f2", roof: "treli\xE7a", windows: true, truss: "#8a9099", structure: "malha", ceiling: "#d5d9dd", cube: false, wallArt: ["#2f6b4f", "#1f4d3a", "#e5e7eb"], floor: { court: "#d9b27a", surround: "#d9b27a", wood: true }, aisles: 12, corners: true },
  uvn: { name: "Pavilh\xE3o da Venda Nova", capacity: 1800, capacityReal: true, style: "municipal", sides: ["N", "S", "E"], seat: "#2b4fa8", seatMix: ["#2b4fa8", "#f5f5f5"], wall: "#f1f1ef", roof: "treli\xE7a", windows: true, truss: "#2a3a55", skylights: true, benches: ["N"], floor: { court: "#8a4b2a", surround: "#7a3f22", wood: true }, aisles: 14 },
  por: { name: "Pavilh\xE3o Gimnodesportivo de Portim\xE3o", capacity: 235, capacityReal: true, style: "municipal", sides: ["N"], seat: "#f2f2f2", wall: "#f3f4f5", roof: "laje", windows: true, beams: "#d5d8db", pillars: "#9aa1a8", ceiling: "#c9cdd1", base: 1.6, floor: { court: "#7a3f22", surround: "#7a3f22", wood: true }, aisles: 10 },
  fam: { name: "Pavilh\xE3o Multiusos de Famalic\xE3o", capacity: 1200, capacityReal: true, style: "municipal", sides: ["N", "S"], seat: "#eab308", seatMix: ["#eab308", "#dc2626", "#16a34a", "#2563eb", "#f97316"], wall: "#4f7f5a", roof: "treli\xE7a", windows: false, truss: "#2b2f36", ceiling: "#2b2f36", banners: true, floor: { court: "#b5763e", surround: "#b5763e", wood: true }, aisles: 12 },
  tor: { name: "Pavilh\xE3o F\xEDsica de Torres Vedras", capacity: 1e3, capacityReal: true, style: "municipal", sides: ["N", "S"], seat: "#c8202e", wall: "#eeeeec", roof: "ab\xF3bada", windows: true, truss: "#f5f5f4", structure: "arcos", ceiling: "#f2f2f0", base: 1.6, fronts: { bg: "#f5f5f5", fg: "#c8202e", text: ["SCU TORREENSE", "F\xCDSICA", "TORRES VEDRAS"] }, floor: { court: "#d6a066", surround: "#c0392b", wood: true }, aisles: 12 }
};
var ES_COURT = { court: "#2f8fd6", surround: "#1d3f8f" };
var ARENAS_ESP = {
  bar: { name: "Palau Blaugrana", capacity: 7585, capacityReal: true, style: "moderno", sides: ["N", "S", "E", "W"], seat: "#1d4fb8", wall: "#1b2633", roof: "treli\xE7a", windows: false, ceilingDark: true, upperTier: true, cube: true, structure: "malha", truss: "#28485e", ceiling: "#1d3a4d", floor: ES_COURT, fronts: { bg: "#a50044", fg: "#ffffff", text: ["FCB", "PALAU BLAUGRANA"] }, corners: true, tierGap: "corredor", tierAds: true, overhang: true, tierSplit: 0.5, rake: 0.48, aisles: 16, seatText: { side: "N", text: "F C B", color: "#f2c21b" } },
  epz: { name: "Palacio de Deportes de Murcia", capacity: 7500, capacityReal: true, style: "moderno", sides: ["N", "S", "E", "W"], seat: "#b9161d", seatMix: ["#b9161d", "#d1d5db"], wall: "#7a4a3a", roof: "treli\xE7a", windows: false, upperTier: true, cube: true, truss: "#c9ced4", ceiling: "#3b3f45", floor: { court: "#2563d6", surround: "#2563d6" }, banners: true, corners: true, rake: 0.5, aisles: 16 },
  pal: { name: "Palau Municipal d'Esports de Son Moix", capacity: 3800, capacityReal: true, style: "moderno", sides: ["N", "S", "E", "W"], seat: "#1e4f8c", seatMix: ["#1e4f8c", "#f5f5f5"], wall: "#3a4048", roof: "laje", windows: false, beams: "#6b4a32", ceiling: "#2a2e33", upperTier: true, skylights: true, cube: true, floor: { court: "#3aa6dd", surround: "#1d3f8f" }, corners: true, aisles: 12, rake: 0.46 },
  jca: { name: "Palacio de los Deportes de Cartagena", capacity: 4817, capacityReal: true, style: "moderno", sides: ["N", "S", "E", "W"], seat: "#d32f2f", seatMix: ["#d32f2f", "#c9a36b"], wall: "#e9e6e1", roof: "ab\xF3bada", windows: true, structure: "arcos", truss: "#7a5a3a", beams: "#7a5a3a", ceiling: "#5c5f63", floor: ES_COURT, wallArt: ["#c62828", "#1e2b3a"], corners: true, aisles: 14 },
  int: { name: "Pabell\xF3n Jorge Garbajosa", capacity: 3200, capacityReal: true, style: "municipal", sides: ["N", "S", "E", "W"], seat: "#9aa1a8", wall: "#b5654a", roof: "treli\xE7a", windows: false, truss: "#c62828", structure: "trelicas", ceiling: "#e5e7eb", benches: true, floor: ES_COURT, aisles: 10, rake: 0.45 },
  jae: { name: "Olivo Arena", capacity: 6589, capacityReal: true, style: "moderno", sides: ["N", "S", "E", "W"], seat: "#8a9096", seatMix: ["#8a9096", "#d4b106", "#2e7d32", "#1f2329"], wall: "#2b2f36", roof: "treli\xE7a", windows: false, ceilingDark: true, truss: "#1f2329", upperTier: true, cube: true, floor: ES_COURT, corners: true, tierGap: "corredor", tierSplit: 0.5, aisles: 14, rake: 0.46 },
  val: { name: "Pabell\xF3n Virgen de la Cabeza", capacity: 2e3, capacityReal: true, style: "municipal", sides: ["N", "S", "E", "W"], seat: "#1e4fb0", wall: "#eef0f2", roof: "treli\xE7a", windows: true, truss: "#d9dde2", structure: "trelicas", ceiling: "#f3f4f6", skylights: true, floor: { court: "#3aa6dd", surround: "#e2513a" }, aisles: 12 },
  man: { name: "Manzanares Arena", capacity: 1800, capacityReal: true, style: "moderno", sides: ["N", "S", "E", "W"], seat: "#e53935", seatMix: ["#e53935", "#fbc02d", "#2e7d32", "#1e4fb0", "#f5f5f5"], wall: "#f2f2f0", roof: "treli\xE7a", windows: true, truss: "#e5e7eb", structure: "trelicas", ceiling: "#f5f5f4", floor: { court: "#9a5a35", surround: "#9a5a35", wood: true }, aisles: 20 },
  zar: { name: "CDM Siglo XXI", capacity: 2900, capacityReal: true, style: "municipal", sides: ["N", "S", "E"], seat: "#9aa1a8", wall: "#d8c6a6", roof: "treli\xE7a", windows: false, truss: "#8f979f", ceiling: "#6b6f75", benches: true, banners: true, floor: { court: "#2245a8", surround: "#d84a2a" }, rake: 0.5, aisles: 14 },
  pen: { name: "Pabell\xF3n Juan Vizcarro", capacity: 1e3, capacityReal: true, style: "municipal", sides: ["N"], seat: "#9ca3af", wall: "#cfd8e6", roof: "treli\xE7a", windows: true, truss: "#e5e7eb", ceiling: "#eceae4", standing: true, benches: true, floor: { court: "#d9a066", surround: "#d9a066", wood: true } },
  par: { name: "Polideportivo de A Malata", capacity: 4200, capacityReal: true, style: "municipal", sides: ["N", "S", "E", "W"], seat: "#2f7fd1", wall: "#e5e2da", roof: "laje", windows: true, ceiling: "#5a6f8f", floor: { court: "#8e9599", surround: "#c62828" }, fronts: { bg: "#2f7fd1", fg: "#ffffff", text: ["FERROL"] }, corners: true, upperTier: true, tierGap: "corredor", lowerBenches: true, tierSplit: 0.35, seatText: { side: "N", text: "FERROL", color: "#ffffff" } },
  osa: { name: "Pabell\xF3n Anaitasuna", capacity: 3e3, capacityReal: true, style: "moderno", sides: ["N", "S", "E", "W"], seat: "#1e88c8", seatMix: ["#1e88c8", "#f59e0b"], wall: "#2b3a4a", roof: "treli\xE7a", windows: false, truss: "#2b3a4a", ceilingDark: true, floor: { court: "#f2f4f7", surround: "#2e7d32" }, corners: true, rake: 0.5, aisles: 12 },
  cor: { name: "Palacio Municipal de Deportes Vista Alegre", capacity: 3500, capacityReal: true, style: "municipal", sides: ["N", "S", "E", "W"], seat: "#9aa1a8", wall: "#e6e3dc", roof: "treli\xE7a", windows: true, truss: "#d9dde2", structure: "trelicas", ceiling: "#f2f2f0", floor: { court: "#2f6fd1", surround: "#d84a2a" }, banners: true, corners: true, aisles: 14 },
  eji: { name: "Pabell\xF3n Municipal de Deportes de El Ejido", capacity: 2e3, capacityReal: true, style: "municipal", sides: ["N", "S"], seat: "#4b5563", wall: "#e8c547", roof: "treli\xE7a", windows: true, beams: "#b5763e", truss: "#b5763e", ceiling: "#e7dcc6", floor: { court: "#d6aa74", surround: "#d6aa74", wood: true } },
  noi: { name: "Pabell\xF3n Municipal Agust\xEDn Mour\xEDs", capacity: 776, capacityReal: true, style: "clube", sides: ["N", "S"], seat: "#e5e7eb", seatMix: ["#e5e7eb", "#1e4fb0"], wall: "#f1f1ef", roof: "treli\xE7a", windows: true, truss: "#9aa1a8", banners: true, floor: { court: "#d9a85e", surround: "#d9a85e", wood: true } },
  stc: { name: "Pabell\xF3n Nuevo de Santa Coloma", capacity: 1500, capacityReal: true, style: "moderno", sides: ["N", "S"], seat: "#d1d5db", seatMix: ["#d1d5db", "#c62828"], wall: "#2b2f36", roof: "treli\xE7a", windows: true, truss: "#e5e7eb", structure: "trelicas", ceiling: "#f5f5f4", floor: { court: "#dcb27c", surround: "#dcb27c", area: "#e53935", wood: true } }
};
Object.assign(ARENAS, ARENAS_ESP);

// src/core/career.ts
var careerOf = (s2) => s2.career ??= { reputation: 35, offers: [], history: [] };
function interimOf(s2, clubId) {
  const c2 = careerOf(s2);
  if (!c2.vacancies?.[clubId]) return null;
  const st = (s2.staff ?? []).find((x) => x.id === c2.interim?.[clubId] && x.clubId === clubId);
  return st ? { name: `${st.name} (interino)`, tactical: Math.round(st.ability * 0.6 + 4) } : { name: "Treinador interino", tactical: 10 };
}

// src/core/market.ts
var FREE = "";
var marketOf = (s2) => s2.market ??= { offers: [], regs: {}, seq: 0 };
var NAMES = {
  Brasil: [["Lucas", "Gabriel", "Matheus", "Rafael", "Thiago", "Guilherme", "Felipe", "Bruno", "Vin\xEDcius", "Leandro", "Diego", "Rodrigo", "Caio", "Igor", "Wellington", "Douglas", "Anderson", "Marcelo"], ["Silva", "Santos", "Oliveira", "Souza", "Lima", "Pereira", "Ferreira", "Costa", "Rocha", "Almeida", "Nascimento", "Carvalho", "Ribeiro", "Gomes", "Barbosa", "Moraes"]],
  Espanha: [["\xC1lvaro", "Sergio", "Pablo", "Adri\xE1n", "Javier", "Daniel", "Ra\xFAl", "Iv\xE1n", "Rub\xE9n", "Marcos", "Carlos", "Alberto"], ["Garc\xEDa", "Mart\xEDnez", "L\xF3pez", "S\xE1nchez", "P\xE9rez", "G\xF3mez", "Ruiz", "Hern\xE1ndez", "D\xEDaz", "Moreno", "Navarro", "Ortega"]],
  Portugal: [["Jo\xE3o", "Tiago", "Rui", "Hugo", "Nuno", "Ricardo", "F\xE1bio", "Diogo", "Andr\xE9", "Lu\xEDs", "Gon\xE7alo", "Miguel"], ["Silva", "Santos", "Ferreira", "Pereira", "Costa", "Martins", "Sousa", "Lopes", "Gomes", "Marques", "Mendes", "Pinto"]],
  Argentina: [["Mat\xEDas", "Nicol\xE1s", "Facundo", "Santiago", "Lautaro", "Agust\xEDn", "Federico"], ["Gonz\xE1lez", "Rodr\xEDguez", "Fern\xE1ndez", "Romero", "Acosta", "Medina", "Sosa"]],
  It\u00E1lia: [["Luca", "Marco", "Andrea", "Davide", "Simone", "Matteo"], ["Rossi", "Russo", "Ferrari", "Esposito", "Bianchi", "Romano"]],
  "Cabo Verde": [["Edson", "Ailton", "Dj\xF4", "Kevin", "Stopira", "Nelson"], ["Tavares", "Fortes", "Monteiro", "Lopes", "Semedo", "Varela"]],
  Ucr\u00E2nia: [["Oleksandr", "Andriy", "Dmytro", "Mykola", "Yevhen"], ["Shevchenko", "Bondarenko", "Kovalenko", "Tkachenko", "Kravchenko"]]
};
var NAT_W = [["Brasil", 45], ["Portugal", 20], ["Espanha", 12], ["Argentina", 7], ["Cabo Verde", 6], ["It\xE1lia", 5], ["Ucr\xE2nia", 5]];
var POS_W = [["GR", 12], ["FIX", 18], ["FIX/ALA", 10], ["ALA", 30], ["ALA/PIV", 10], ["PIV", 15], ["UNI", 5]];
var pick = (r, xs) => {
  let v = r() * xs.reduce((a, x) => a + x[1], 0);
  for (const [x, w] of xs) if ((v -= w) <= 0) return x;
  return xs[0][0];
};
function generateFreeAgents(s2, n, seed, targetOverall) {
  const r = rng(`fa-${seed}`);
  const out = [];
  for (let i = 0; i < n; i++) {
    const nat = pick(r, NAT_W);
    const [F, L] = NAMES[nat];
    const pos = pick(r, POS_W);
    const age = 20 + Math.floor(r() * 13);
    const base = { id: `fa${seed}${i}`, clubId: FREE, name: `${F[Math.floor(r() * F.length)]} ${L[Math.floor(r() * L.length)]}`, position: pos, number: null, age, nationality: nat, attrs: {}, potential: 0 };
    const level = targetOverall ? (targetOverall - 3.5) / 0.11 + (r() - 0.3) * 10 : 52 + r() * 30;
    const g = generateAttributes(base, level, 0);
    out.push({ ...base, attrs: g.attrs, potential: g.potential });
  }
  return out;
}
function ensurePool(s2) {
  const m2 = marketOf(s2);
  if (m2.pool === s2.season.year) return;
  m2.pool = s2.season.year;
  const since = m2.freeSince ??= {};
  for (const p of s2.players) if (p.clubId === FREE) since[p.id] ??= s2.season.year;
  else delete since[p.id];
  s2.players = s2.players.filter((p) => p.clubId !== FREE || p.age < 33 && s2.season.year - since[p.id] < 2);
  s2.players.push(...generateFreeAgents(s2, 10, String(s2.season.year)));
}

// src/core/manager.ts
var DEFAULT = { tatico: 12, motivacao: 10, jovens: 10, treino: 10, disciplina: 10, gestao: 10 };
var managerAttrs = (s2) => ({ ...DEFAULT, ...s2.manager.attrs ?? {} });
var mgrK = (s2, k, per = 0.03) => 1 + (managerAttrs(s2)[k] - 10) * per;

// src/core/coaches.ts
function aiTactics(squad, club, coach) {
  const r = rng("estilo-" + (coach?.id ?? club.id));
  const out = squad.filter((p) => p.position !== "GR").sort((a, b) => overall(b.attrs, b.position) - overall(a.attrs, a.position)).slice(0, 8);
  const bestPivot = Math.max(0, ...out.filter((p) => ["PIV", "ALA/PIV"].includes(p.position)).map((p) => p.attrs.jogoCostas));
  const tech = out.reduce((s2, p) => s2 + (p.attrs.drible + p.attrs.decisoes + p.attrs.passe) / 3, 0) / Math.max(1, out.length);
  const system = bestPivot >= 15 ? "3-1" : tech >= 13.5 ? "4-0" : club.level < 62 ? r() < 0.6 ? "2-2" : "1-2-1" : r() < 0.5 ? "1-2-1" : "3-1";
  const pressure = club.level >= 85 ? "alta" : club.level >= 65 ? r() < 0.3 ? "alta" : "media" : r() < 0.5 ? "baixa" : "media";
  const tempo = club.level >= 85 ? "paciente" : r() < 0.35 ? "rapido" : "equilibrado";
  const marking = r() < 0.6 ? "zona" : r() < 0.5 ? "individual" : "misto";
  const flyingKeeper = r() < 0.3 ? "agressivo" : "auto";
  const gkFeet = Math.max(0, ...squad.filter((p) => p.position === "GR").map((p) => p.attrs.jogoPes));
  const gkStyle = gkFeet >= 15 && r() < 0.45 ? "avancado" : gkFeet >= 12 && r() < 0.5 ? "construtor" : "classico";
  return suggestTactics(squad, { system, pressure, tempo, marking, flyingKeeper, gkStyle, rotation: "normal", ...coach?.style ?? {} });
}

// src/core/training.ts
var SHARE = {
  equilibrado: { tecnicos: 1 / 3, mentais: 1 / 3, fisicos: 1 / 3 },
  tecnico: { tecnicos: 0.6, mentais: 0.2, fisicos: 0.2 },
  tatico: { tecnicos: 0.2, mentais: 0.6, fisicos: 0.2 },
  fisico: { tecnicos: 0.2, mentais: 0.2, fisicos: 0.6 },
  finalizacao: { tecnicos: 0.6, mentais: 0.2, fisicos: 0.2 },
  guardaRedes: { guardaRedes: 0.6, mentais: 0.2, fisicos: 0.2 },
  recuperacao: { tecnicos: 0.1, mentais: 0.1, fisicos: 0.1 }
};

// src/core/injuries.ts
var MATCH_RATE = 25.9 / 1e3;
var TRAIN_RATE = 3 / 1e3;
var TRAIN_H_DAY = 7.5 / 7;
var injuryOf = (s2, id) => {
  const i = s2.injuries?.[id];
  return i && i.until > s2.date ? i : void 0;
};

// src/core/discipline.ts
var dcomp = (c2) => c2 === "playoff" ? "liga" : ["esp", "espPlayoff", "espAp", "espCl", "copaEsp", "superEsp", "copaRey"].includes(c2) ? "esp" : c2;
function banFor(s2, pid, comp) {
  const d = s2.discipline;
  return (d?.bans[pid] ?? []).filter((b) => b.comp === dcomp(comp)).reduce((a, b) => a + b.games, 0);
}

// src/core/development.ts
var PHYSICAL2 = Object.keys(ATTR_GROUPS.fisicos.attrs);
var MENTAL2 = Object.keys(ATTR_GROUPS.mentais.attrs);
var GK2 = Object.keys(ATTR_GROUPS.guardaRedes.attrs);

// src/core/engine/match.ts
var HALF = 1200;
var ET = 300;
var MAX_SQUAD = 12;
var INJ_PER_S = 25.9 / 1e3 / 3600;
var injRisk = (l) => (1 + Math.max(0, l.p.age - 28) * 0.03) * (1.25 - l.p.attrs.resistencia / 40) * (l.p.position === "GR" ? 0.6 : 1);
var REBOUND = 0.25;
var fmt = (t) => {
  const m2 = Math.floor(t / 60);
  const s2 = Math.floor(t % 60);
  return `${String(m2).padStart(2, "0")}:${String(s2).padStart(2, "0")}`;
};
function createMatch(home, away, opts = {}) {
  const r = rng(opts.seed ?? `${home.clubId}-${away.clubId}-${Math.random()}`);
  const pick3 = (arr, w) => {
    const ws = arr.map((x) => Math.max(0.01, w(x)));
    let v = r() * ws.reduce((a, b) => a + b, 0);
    for (let i = 0; i < arr.length; i++) if ((v -= ws[i]) <= 0) return arr[i];
    return arr[arr.length - 1];
  };
  const pace = Math.max(0.7, Math.min(1.3, 1 + gauss(r) * 0.08));
  const form = [Math.max(0.7, Math.min(1.3, 1 + gauss(r) * 0.08)), Math.max(0.7, Math.min(1.3, 1 + gauss(r) * 0.08))];
  const events = [];
  const score2 = [0, 0];
  const pstats = {};
  const names = {};
  const tstats = [newTeamStats(), newTeamStats()];
  const conceded = {};
  let clock = 0;
  let period = 1;
  let periodStart = 0;
  let periodLen = HALF;
  const teams = [home, away].map((setup) => buildTeam(setup));
  function newTeamStats() {
    return { possession: 0, shots: 0, onTarget: 0, corners: 0, fouls: 0, foulsByPeriod: [0, 0, 0, 0, 0], yellow: 0, red: 0, timeouts: [] };
  }
  function buildTeam(setup) {
    const gks = setup.squad.filter((p) => p.position === "GR").sort((a, b) => overall(b.attrs, "GR") - overall(a.attrs, "GR"));
    const out = setup.squad.filter((p) => p.position !== "GR").sort((a, b) => overall(b.attrs, b.position) - overall(a.attrs, a.position));
    const tac = setup.tactics;
    const wanted = new Set([tac.gk, ...tac.q1, ...tac.q2].filter(Boolean));
    const gkList = [...gks.filter((p) => wanted.has(p.id)), ...gks.filter((p) => !wanted.has(p.id))].slice(0, 2);
    const outList = [...out.filter((p) => wanted.has(p.id)), ...out.filter((p) => !wanted.has(p.id))];
    const youth = outList.filter((p) => p.age <= 20 && p.nationality === "Portugal").slice(0, 2);
    const rest = outList.filter((p) => !youth.includes(p));
    const called = youth.length === 2 ? [...gkList, ...youth, ...rest.slice(0, MAX_SQUAD + 2 - gkList.length - 2)] : [...gkList, ...outList.slice(0, MAX_SQUAD - gkList.length)];
    const players = called.map((p) => ({ p, energy: Math.max(40, setup.fitness?.[p.id] ?? 100), onCourt: false, sentOff: false, yellow: 0, mor: 1 + ((setup.morale?.[p.id] ?? 65) - 65) / 100 * 0.12 }));
    for (const l of players) {
      names[l.p.id] = l.p.name;
      pstats[l.p.id] = { minutes: 0, goals: 0, assists: 0, shots: 0, onTarget: 0, saves: 0, fouls: 0, tackles: 0, yellow: 0, red: false, rating: 6 };
      conceded[l.p.id] = 0;
    }
    const t = {
      setup,
      players,
      gk: null,
      court: [],
      flying: false,
      shortUntil: 0,
      shortCount: 0,
      lastRotation: 0,
      qIdx: 0,
      fouls: [0, 0, 0, 0, 0],
      timeoutUsed: [false, false, false],
      conceded: []
    };
    t.gk = players.find((l) => l.p.id === tac.gk) ?? players.find((l) => l.p.position === "GR") ?? null;
    if (t.gk) t.gk.onCourt = true;
    t.court = quintet(t, 0, 4);
    t.court.forEach((l) => l.onCourt = true);
    return t;
  }
  function chooseFour(t, exclude = []) {
    const avail = t.players.filter((l) => !l.sentOff && l.p.position !== "GR" && !exclude.includes(l));
    const share = (l) => clock > 120 ? pstats[l.p.id].minutes / clock : 0;
    const value = (l) => overall(l.p.attrs, l.p.position) * (0.3 + 0.7 * (l.energy / 100)) * (1 - 0.3 * share(l));
    const take = (pred, chosen2) => {
      const c2 = avail.filter((l) => pred(l) && !chosen2.includes(l)).sort((a, b) => value(b) - value(a))[0];
      if (c2) chosen2.push(c2);
    };
    const chosen = [];
    take((l) => ["FIX", "FIX/ALA", "UNI"].includes(l.p.position), chosen);
    take((l) => ["PIV", "ALA/PIV"].includes(l.p.position), chosen);
    while (chosen.length < 4) {
      const before = chosen.length;
      take(() => true, chosen);
      if (chosen.length === before) break;
    }
    return chosen;
  }
  function quintet(t, idx, size) {
    const ids = idx === 0 ? t.setup.tactics.q1 : t.setup.tactics.q2;
    const chosen = ids.map((id) => t.players.find((l) => l.p.id === id)).filter((l) => !!l && !l.sentOff && l.energy > 45 && l !== t.gk);
    if (chosen.length < size) {
      const extra2 = chooseFour(t, chosen).filter((l) => !chosen.includes(l));
      chosen.push(...extra2.slice(0, size - chosen.length));
    }
    return chosen.slice(0, size);
  }
  const REF = opts.referees ?? { names: ["", ""], tolerance: 1, cards: 1, harsh: 1 };
  const ROT = { curta: { min: 60, energy: 80, max: 180 }, normal: { min: 90, energy: 72, max: 300 }, longa: { min: 120, energy: 62, max: 420 } };
  const PRESS_DRAIN = { alta: 1.15, media: 1, baixa: 0.92 };
  const eff = (l, k) => l.p.attrs[k] * (0.72 + 0.28 * (l.energy / 100)) * l.mor;
  const avg = (ls, ks) => ls.length ? ls.reduce((s2, l) => s2 + ks.reduce((a, k) => a + eff(l, k), 0) / ks.length, 0) / ls.length : 5;
  const outfield = (t) => t.court;
  const numbers = (t) => t.court.length + (t.gk ? 1 : 0);
  function log(type, text, side2, playerId, assistId) {
    events.push({ t: clock, period, side: side2, type, playerId, assistId, text: `${fmt(clock)} ${text}`, score: [score2[0], score2[1]] });
  }
  function tick(dt) {
    for (const t of teams) {
      for (const l of t.players) {
        if (l.sentOff) continue;
        if (l.onCourt) {
          pstats[l.p.id].minutes += dt;
          if (opts.injuries !== false && r() < INJ_PER_S * dt * injRisk(l)) injure(t, l);
          const drain = l.p.position === "GR" ? 0.012 : 0.085 * (1.35 - l.p.attrs.resistencia / 25) * PRESS_DRAIN[t.setup.tactics.pressure];
          l.energy = Math.max(20, l.energy - drain * dt);
        } else {
          l.energy = Math.min(100, l.energy + 0.11 * dt);
        }
      }
    }
    clock += dt;
  }
  function injure(t, l) {
    const s2 = teams.indexOf(t);
    l.sentOff = true;
    l.onCourt = false;
    pstats[l.p.id].injured = true;
    const bench = t.players.filter((x) => !x.onCourt && !x.sentOff);
    if (t.gk === l) {
      const gk2 = bench.find((x) => x.p.position === "GR");
      if (gk2) {
        gk2.onCourt = true;
        t.gk = gk2;
      } else {
        const g = [...t.court].sort((a, b) => b.p.attrs.reflexos + b.p.attrs.agilidade - a.p.attrs.reflexos - a.p.attrs.agilidade)[0];
        if (g) {
          t.court = t.court.filter((x) => x !== g);
          t.gk = g;
        }
        const sub = bench.filter((x) => x.p.position !== "GR").sort((a, b) => b.energy - a.energy)[0];
        if (sub) {
          sub.onCourt = true;
          t.court.push(sub);
        }
      }
    } else {
      t.court = t.court.filter((x) => x !== l);
      const sub = bench.filter((x) => x.p.position !== "GR").sort((a, b) => b.energy - a.energy)[0];
      if (sub) {
        sub.onCourt = true;
        t.court.push(sub);
      }
    }
    log("lesao", `${l.p.name} lesiona-se e tem de sair (${sideName(s2)})`, s2, l.p.id);
  }
  function sideName(s2) {
    return teams[s2].setup.shortName;
  }
  function rotate(s2) {
    const t = teams[s2];
    const avgEnergy = t.court.reduce((a, l) => a + l.energy, 0) / Math.max(1, t.court.length);
    const since = clock - t.lastRotation;
    if (t.setup.tactics.rotation === "manual") return;
    const rot = ROT[t.setup.tactics.rotation] ?? ROT.normal;
    if (since < rot.min) return;
    if (avgEnergy > rot.energy && since < rot.max) return;
    const target = 4 - (clock < t.shortUntil ? t.shortCount : 0) + (t.flying ? 1 : 0);
    const out = t.court;
    const hasQuintets = t.setup.tactics.q1.length + t.setup.tactics.q2.length > 0;
    let next;
    if (hasQuintets) {
      t.qIdx = t.qIdx === 0 ? 1 : 0;
      next = quintet(t, t.qIdx, Math.max(0, target));
    } else {
      const fresh = t.players.filter((l) => !l.onCourt && !l.sentOff && l.p.position !== "GR" && l.energy > 70).length;
      next = chooseFour(t, fresh >= 4 ? out : out.filter(() => r() < 0.6)).slice(0, Math.max(0, target));
    }
    while (next.length < target) {
      const extra2 = out.find((l) => !next.includes(l) && !l.sentOff);
      if (!extra2) break;
      next.push(extra2);
    }
    const ins = next.filter((l) => !out.includes(l));
    if (!ins.length) return;
    out.forEach((l) => l.onCourt = false);
    next.forEach((l) => l.onCourt = true);
    t.court = next;
    t.lastRotation = clock;
    log("substituicao", `${sideName(s2)}: troca de quinteto (${ins.map((l) => l.p.name).join(", ")})`, s2);
  }
  function flyingDecision(s2) {
    const t = teams[s2];
    const diff = score2[s2] - score2[1 - s2];
    const remaining = periodStart + periodLen - clock;
    let want = false;
    const fk = flyingOverride[s2] === true ? "sempre" : flyingOverride[s2] === false ? "nunca" : t.setup.tactics.flyingKeeper;
    const lastPeriod = period === 2 || period === 4;
    const needWin = opts.needWin?.[s2] ?? false;
    if (fk === "sempre") want = true;
    else if (fk === "auto") {
      want = lastPeriod && diff < 0 && diff >= -3 && remaining <= (diff === -1 ? 180 : 300);
      if (opts.knockout && period === 4 && diff < 0 && remaining <= 150) want = true;
    } else if (fk === "agressivo") {
      want = lastPeriod && diff < 0 && diff >= -4 && remaining <= (diff === -1 ? 300 : 420);
      if (needWin && lastPeriod && diff === 0 && remaining <= 180) want = true;
    }
    if (want && !t.flying && t.gk) {
      const bench = t.players.filter((l) => !l.onCourt && !l.sentOff && l.p.position !== "GR");
      const chosen = bench.find((l) => l.p.id === t.setup.tactics.flyingPlayer);
      const sub = chosen ?? bench.sort((a, b) => eff(b, "passe") + eff(b, "decisoes") - eff(a, "passe") - eff(a, "decisoes"))[0];
      if (!sub) return;
      t.gk.onCourt = false;
      t.gk = null;
      sub.onCourt = true;
      t.court = [...t.court, sub];
      t.flying = true;
      log("gr_avancado_on", `${sideName(s2)} arrisca com guarda-redes avan\xE7ado (${sub.p.name})`, s2);
    } else if (!want && t.flying) {
      removeFlying(s2);
    }
  }
  function removeFlying(s2) {
    const t = teams[s2];
    if (!t.flying) return;
    const gk = t.players.find((l) => l.p.position === "GR" && !l.sentOff);
    const outP = [...t.court].sort((a, b) => a.energy - b.energy)[0];
    if (outP) {
      outP.onCourt = false;
      t.court = t.court.filter((l) => l !== outP);
    }
    if (gk) {
      gk.onCourt = true;
      t.gk = gk;
    }
    t.flying = false;
    log("gr_avancado_off", `${sideName(s2)} volta a jogar com guarda-redes`, s2);
  }
  function maybeTimeout(s2) {
    const t = teams[s2];
    const idx = period <= 2 ? period : 2;
    if (period > 2 || t.timeoutUsed[idx] || clock - periodStart < 60) return;
    const remaining = periodStart + periodLen - clock;
    const diff = score2[s2] - score2[1 - s2];
    const recentGoals = t.conceded.filter((x) => clock - x < 240).length;
    if (recentGoals >= 2 || diff < 0 && remaining < 150 && period === 2 || remaining < 60 && r() < 0.3 && diff <= 0) {
      t.timeoutUsed[idx] = true;
      tstats[s2].timeouts.push(clock);
      log("time_out", `Desconto de tempo pedido pelo ${sideName(s2)}`, s2);
      for (const l of t.court) l.energy = Math.min(100, l.energy + 6);
    }
  }
  function goal(s2, scorer, assist, how = "") {
    score2[s2]++;
    pstats[scorer.p.id].goals++;
    if (assist) pstats[assist.p.id].assists++;
    const opp = teams[1 - s2];
    if (opp.gk) conceded[opp.gk.p.id]++;
    opp.conceded.push(clock);
    log("golo", `GOLO! ${scorer.p.name}${how}${assist ? `, assist\xEAncia de ${assist.p.name}` : ""}. ${home.shortName} ${score2[0]}-${score2[1]} ${away.shortName}`, s2, scorer.p.id, assist?.p.id);
    if (clock < opp.shortUntil) {
      opp.shortUntil = clock;
      opp.shortCount = 0;
      completeTeam(1 - s2);
    }
  }
  function completeTeam(s2) {
    const t = teams[s2];
    const need = 4 + (t.flying ? 1 : 0) - t.court.length;
    for (let i = 0; i < need; i++) {
      const sub = t.players.filter((l) => !l.onCourt && !l.sentOff && l.p.position !== "GR").sort((a, b) => b.energy - a.energy)[0];
      if (!sub) break;
      sub.onCourt = true;
      t.court.push(sub);
    }
  }
  function card(s2, l, red, why = "dogso") {
    const t = teams[s2];
    if (!red) {
      l.yellow++;
      pstats[l.p.id].yellow++;
      tstats[s2].yellow++;
      if (l.yellow < 2) {
        log("amarelo", `Cart\xE3o amarelo para ${l.p.name} (${sideName(s2)})`, s2, l.p.id);
        return;
      }
    }
    l.sentOff = true;
    l.onCourt = false;
    pstats[l.p.id].red = true;
    pstats[l.p.id].redKind = red ? why : "twoYellows";
    tstats[s2].red++;
    log("vermelho", `Cart\xE3o vermelho${red ? "" : " (segundo amarelo)"} para ${l.p.name}. ${sideName(s2)} fica em inferioridade`, s2, l.p.id);
    if (t.gk === l) {
      t.gk = null;
      const gk2 = t.players.find((x) => x.p.position === "GR" && !x.sentOff);
      const outP = t.court.sort((a, b) => a.energy - b.energy)[0];
      if (gk2 && outP) {
        outP.onCourt = false;
        t.court = t.court.filter((x) => x !== outP);
        gk2.onCourt = true;
        t.gk = gk2;
      }
    } else {
      t.court = t.court.filter((x) => x !== l);
    }
    t.shortUntil = clock + 120;
    t.shortCount = 1;
  }
  const shooterWeight = (l) => {
    const posW = { PIV: 1.3, "ALA/PIV": 1.25, ALA: 1.15, UNI: 1, "FIX/ALA": 0.85, FIX: 0.7, GR: 0.1 };
    return (14 + eff(l, "finalizacao") + eff(l, "remate")) * (posW[l.p.position] ?? 1);
  };
  const best = (ls, f) => [...ls].sort((a, b) => f(b) - f(a))[0];
  let setPiece = null;
  let savedCaught = null;
  let actions = [];
  function shot(s2, kind, shooterIn) {
    const att = teams[s2];
    const def = teams[1 - s2];
    const shooter = shooterIn ?? pick3(outfield(att), shooterWeight);
    const others = outfield(att).filter((l) => l !== shooter);
    const assist = setPiece ? setPiece.assist : kind === "jogada" || kind === "contra" || kind === "canto" ? r() < 0.62 && others.length ? pick3(others, (l) => eff(l, "passe") + eff(l, "visao")) : void 0 : void 0;
    tstats[s2].shots++;
    pstats[shooter.p.id].shots++;
    const finish2 = kind === "jogada" || kind === "canto" ? eff(shooter, "finalizacao") * 0.6 + eff(shooter, "remate") * 0.4 : eff(shooter, "finalizacao");
    const compo = eff(shooter, "compostura");
    const defQ = avg(outfield(def), ["desarme", "posicionamento", "antecipacao"]);
    const gk = def.gk;
    const gkQ = gk ? (eff(gk, "reflexos") + eff(gk, "umParaUm") + eff(gk, "posicionamento") + eff(gk, "agilidade")) / 4 : 0;
    let pBlock = 0.24 + (defQ - finish2) * 0.01;
    let pOn = 0.47 + (finish2 - 10) * 0.016 + (compo - 10) * 6e-3;
    let pGoal = 0.155 + (finish2 - gkQ) * 0.022;
    if (kind === "contra") {
      pBlock *= 0.5;
      pOn += 0.08;
      pGoal += 0.1;
    }
    if (kind === "livre10") {
      pBlock = 0;
      pOn = 0.72 + (finish2 - 10) * 0.015;
      pGoal = 0.42 + (finish2 - gkQ) * 0.025;
    }
    if (kind === "penalti") {
      pBlock = 0;
      pOn = 0.86 + (compo - 10) * 0.01;
      pGoal = 0.78 + (finish2 - gkQ) * 0.02;
    }
    if (kind === "canto") {
      pBlock += 0.05 + (setPiece?.block ?? 0);
      pOn -= 0.05;
      pGoal *= setPiece?.q ?? 1;
    }
    if (!gk || kind === "baliza_aberta") {
      pGoal = kind === "baliza_aberta" ? gk ? 0.6 : 0.85 : 0.75;
    }
    if (kind === "recarga") {
      pBlock = 0.18;
      pOn = 0.62 + (finish2 - 10) * 0.012;
      pGoal = 0.3 + (finish2 - gkQ) * 0.02;
    }
    if (kind === "baliza_aberta") {
      pBlock = 0.08;
      pOn = 0.5 + (eff(shooter, "remate") - 10) * 0.02;
    }
    const cl = (x, a, b) => Math.max(a, Math.min(b, x));
    if (kind === "jogada" || kind === "contra" || kind === "canto") pGoal *= form[s2] * pace * TEMPO[att.setup.tactics.tempo].quality;
    pBlock = cl(pBlock, 0, 0.45);
    pOn = cl(pOn, 0.2, 0.95);
    pGoal = cl(pGoal, 0.06, 0.92);
    const how = {
      jogada: "",
      contra: " em contra-ataque",
      livre10: " no livre direto dos 10 metros",
      penalti: " de pen\xE1lti",
      canto: " na sequ\xEAncia de um canto",
      baliza_aberta: " para a baliza deserta",
      recarga: " na recarga"
    };
    const vk = kind === "livre10" ? "free10" : kind === "penalti" ? "penalty" : kind === "canto" ? "setpiece" : kind === "baliza_aberta" ? "open" : kind === "contra" ? "counter" : kind === "recarga" ? "rebound" : "play";
    if (r() < pBlock) {
      const blocker = pick3(outfield(def), (l) => eff(l, "desarme") + eff(l, "posicionamento"));
      pstats[blocker.p.id].tackles++;
      actions.push({ type: "shot", side: s2, kind: vk, shooter: shooter.p.id, assist: assist?.p.id, result: "blocked", other: blocker.p.id });
      if (r() < 0.25) corner(s2);
      else log("remate_bloqueado", `Remate de ${shooter.p.name} bloqueado por ${blocker.p.name}`, s2, shooter.p.id);
      return;
    }
    if (r() > pOn) {
      const post = r() < 0.07;
      actions.push({ type: "shot", side: s2, kind: vk, shooter: shooter.p.id, assist: assist?.p.id, result: post ? "post" : "wide" });
      if (post) log("poste", `${shooter.p.name} acerta no poste!`, s2, shooter.p.id);
      else if (kind !== "jogada") log("remate_fora", `${shooter.p.name} remata ao lado${how[kind]}`, s2, shooter.p.id);
      return;
    }
    tstats[s2].onTarget++;
    pstats[shooter.p.id].onTarget++;
    if (r() < pGoal) {
      actions.push({ type: "shot", side: s2, kind: vk, shooter: shooter.p.id, assist: assist?.p.id, result: "goal" });
      goal(s2, shooter, assist, how[kind]);
    } else if (gk) {
      const caught = r() < 0.5 + (eff(gk, "posicionamento") - 10) * 0.02;
      actions.push({ type: "shot", side: s2, kind: vk, shooter: shooter.p.id, assist: assist?.p.id, result: "saved", other: gk.p.id, caught });
      if (caught) savedCaught = { side: 1 - s2, gk };
      pstats[gk.p.id].saves++;
      if (kind !== "jogada" || r() < 0.35) log("remate_defendido", `Defesa de ${gk.p.name} a remate de ${shooter.p.name}${kind === "penalti" ? " (pen\xE1lti defendido!)" : kind === "livre10" ? " (livre dos 10 m)" : ""}`, s2, shooter.p.id);
      if (!caught && (kind === "jogada" || kind === "contra") && r() < REBOUND) {
        const rs = r() < 0.3 ? shooter : pick3(outfield(att), (l) => eff(l, "antecipacao") + eff(l, "finalizacao"));
        shot(s2, "recarga", rs);
      } else if (r() < 0.2) corner(s2);
    }
  }
  function taker(t, id, f) {
    return outfield(t).find((l) => l.p.id === id) ?? best(outfield(t), f);
  }
  const CORNER = {
    primeiro_poste: { chance: 0.36, target: (l) => eff(l, "finalizacao") + eff(l, "antecipacao"), q: 1, block: 0, counter: 0.06 },
    remate_fora: { chance: 0.4, target: (l) => eff(l, "remate") * 2, q: 0.92, block: 0.08, counter: 0.1 },
    bloqueio_pivo: { chance: 0.28, target: (l) => eff(l, "jogoCostas") + eff(l, "finalizacao") + (l.p.position === "PIV" ? 6 : 0), q: 1.18, block: -0.04, counter: 0.06 },
    curto: { chance: 0.24, target: (l) => eff(l, "finalizacao") + eff(l, "remate"), q: 1, block: -0.06, counter: 0.01 }
  };
  function corner(s2) {
    const att = teams[s2];
    tstats[s2].corners++;
    const sp = att.setup.tactics.setPieces;
    const rt = sp?.cornerRoutine === "personalizado" ? customRt(sp.customCorner) : CORNER[sp?.cornerRoutine ?? "primeiro_poste"];
    const kicker = taker(att, sp?.corner, (l) => eff(l, "bolasParadas") * 2 + eff(l, "passe"));
    actions.push({ type: "corner", side: s2, shooter: kicker.p.id });
    log("canto", `Canto para o ${sideName(s2)}, marcado por ${kicker.p.name}`, s2);
    if (r() < rt.chance + (eff(kicker, "bolasParadas") - 10) * 0.01) {
      const others = outfield(att).filter((l) => l !== kicker);
      const chosen = others.find((l) => l.p.id === (sp?.cornerRoutine === "personalizado" ? sp.customCorner?.slots.find((x) => x.role === "rematador")?.player : sp?.cornerRoles?.[0]));
      const shooter = chosen ?? (others.length ? pick3(others, rt.target) : kicker);
      setPiece = { q: rt.q, block: rt.block, assist: kicker };
      shot(s2, "canto", shooter);
      setPiece = null;
    } else if (r() < rt.counter) {
      shot(1 - s2, "contra");
    }
  }
  function customRt(cp) {
    const runs = Math.min(3, (cp?.paths ?? []).filter((x) => x.kind === "run").length);
    const block = cp?.slots.some((x) => x.role === "bloqueio");
    const bal = cp?.slots.some((x) => x.role === "equilibrio");
    return { chance: 0.3 + runs * 0.03, target: (l) => eff(l, "finalizacao") + eff(l, "remate"), q: 0.98 + runs * 0.03 + (block ? 0.05 : 0), block: block ? -0.03 : 0, counter: bal ? 0.04 : 0.11 };
  }
  const FREEKICK = {
    remate_direto: { chance: 0.75, q: 0.95 },
    jogada_ensaiada: { chance: 0.5, q: 1.12 },
    cruzamento: { chance: 0.42, q: 1.08 }
  };
  function freeKick(s2) {
    const att = teams[s2];
    const sp = att.setup.tactics.setPieces;
    const kind = sp?.freeKickRoutine ?? "remate_direto";
    const rt = kind === "personalizado" ? { chance: customRt(sp?.customFk).chance + 0.15, q: customRt(sp?.customFk).q } : FREEKICK[kind];
    const kicker = taker(att, sp?.freeKick, (l) => eff(l, "bolasParadas") * 2 + eff(l, "remate"));
    if (r() > rt.chance + (eff(kicker, "bolasParadas") - 10) * 0.012) return;
    let shooter = kicker;
    const others = outfield(att).filter((l) => l !== kicker);
    const chosenFk = others.find((l) => l.p.id === (kind === "personalizado" ? sp?.customFk?.slots.find((x) => x.role === "rematador")?.player : sp?.fkRoles?.[0]));
    if (chosenFk && kind !== "remate_direto") shooter = chosenFk;
    else if (kind === "personalizado" && others.length) shooter = pick3(others, (l) => eff(l, "finalizacao") + eff(l, "remate"));
    else if (kind === "cruzamento" && others.length) shooter = best(others, (l) => eff(l, "finalizacao") + eff(l, "jogoCostas"));
    else if (kind === "jogada_ensaiada" && others.length) shooter = pick3(others, (l) => eff(l, "finalizacao") + eff(l, "remate"));
    setPiece = { q: rt.q, block: 0, assist: shooter === kicker ? void 0 : kicker };
    shot(s2, "canto", shooter);
    setPiece = null;
  }
  function tension() {
    let t = opts.importance ?? 0.15;
    const remaining = periodStart + periodLen - clock;
    const close = Math.abs(score2[0] - score2[1]) <= 1;
    if (close && period >= 2 && remaining < 600) t += 0.2;
    if (score2[0] === score2[1] && period >= 2 && remaining < 300) t += 0.15;
    return Math.min(1.2, t);
  }
  function maybeBrawl(s2, fouler, victim) {
    const ten = tension();
    if (r() > 15e-4 + 0.03 * ten * ten) return;
    const pool = [...outfield(teams[0]), ...outfield(teams[1])].filter((l) => l !== fouler && l !== victim && !l.sentOff);
    const extra2 = Math.min(pool.length, Math.floor(r() * (1 + 4 * ten)));
    const others = [...pool].sort((a, b) => eff(b, "agressividade") - eff(a, "agressividade") + (r() - 0.5) * 8).slice(0, extra2);
    const who = [fouler, victim, ...others];
    const cards = [];
    log("confronto", `Confronto entre jogadores! ${fouler.p.name} e ${victim.p.name}${others.length ? ` (juntam-se ${others.map((l) => l.p.name).join(", ")})` : ""}`, s2);
    for (const l of who) {
      const side2 = teams[0].court.includes(l) || teams[0].gk === l ? 0 : 1;
      const main = l === fouler || l === victim;
      const hot = (eff(l, "agressividade") - 10) * 0.02;
      if (r() < (main ? 0.07 : 0.03) * REF.harsh * (0.6 + ten) + hot * 0.3) {
        const target = l === fouler ? victim : l === victim ? fouler : null;
        const aggr = !!target && r() < 0.3 + hot;
        cards.push({ id: l.p.id, red: true });
        card(side2, l, true, aggr ? "agressao" : "brawl");
        if (aggr && target) {
          pstats[l.p.id].victim = target.p.id;
          if (!target.sentOff && r() < 0.25) injure(teams[1 - side2], target);
        }
      } else if (r() < (main ? 0.55 : 0.28) * REF.cards + hot) {
        cards.push({ id: l.p.id, red: l.yellow >= 1 });
        card(side2, l, false);
      }
    }
    actions.push({ type: "brawl", side: s2, players: who.map((l) => l.p.id), cards });
  }
  function foul(s2) {
    const def = teams[1 - s2];
    const att = teams[s2];
    const fouler = pick3(outfield(def), (l) => eff(l, "agressividade") + eff(l, "desarme") * 0.5);
    const victim = pick3(outfield(att), (l) => eff(l, "drible") + eff(l, "jogoCostas"));
    const fp = period >= 3 ? 2 : period;
    def.fouls[fp]++;
    tstats[1 - s2].fouls++;
    tstats[1 - s2].foulsByPeriod[period]++;
    pstats[fouler.p.id].fouls++;
    const n = def.fouls[fp];
    const dogso = r() < 4e-3;
    const violent = !dogso && r() < 12e-4 + Math.max(0, eff(fouler, "agressividade") - 12) * 4e-4;
    if (dogso) card(1 - s2, fouler, true);
    else if (violent) {
      card(1 - s2, fouler, true, "violento");
      pstats[fouler.p.id].victim = victim.p.id;
      if (r() < 0.5) injure(att, victim);
    } else if (r() < (0.22 + (eff(fouler, "agressividade") - 10) * 8e-3) * REF.cards * (def.setup.cardK ?? 1) * (fouler.yellow ? 0.35 : 1)) card(1 - s2, fouler, false);
    const sp = att.setup.tactics.setPieces;
    actions.push({ type: "foul", side: s2, shooter: victim.p.id, other: fouler.p.id, kind: n >= 6 ? "free10" : "play" });
    maybeBrawl(s2, fouler, victim);
    if (r() < 0.03) {
      actions[actions.length - 1].kind = "penalty";
      log("penalti", `Pen\xE1lti! Falta de ${fouler.p.name} sobre ${victim.p.name}`, s2);
      shot(s2, "penalti", taker(att, sp?.penalty, (l) => eff(l, "finalizacao") + eff(l, "compostura")));
    } else if (n >= 6) {
      log("livre_10m", `${n}.\xAA falta acumulada do ${sideName(1 - s2)} (${fouler.p.name}): livre direto sem barreira`, s2);
      shot(s2, "livre10", taker(att, sp?.free10, (l) => eff(l, "finalizacao") + eff(l, "remate") + eff(l, "compostura")));
    } else {
      if (n === 5) log("falta", `5.\xAA falta acumulada do ${sideName(1 - s2)}: a pr\xF3xima d\xE1 livre de 10 metros`, 1 - s2);
      else log("falta", `Falta de ${fouler.p.name} sobre ${victim.p.name}`, 1 - s2, fouler.p.id);
      if (r() < 0.3) freeKick(s2);
    }
  }
  const TEMPO = {
    rapido: { dur: 0.8, lose: 0, quality: 0.98 },
    equilibrado: { dur: 1, lose: 0, quality: 1 },
    paciente: { dur: 1.2, lose: -0.01, quality: 1.02 }
  };
  const PRESS = {
    alta: { lose: 0.05, foul: 0.03, counter: -0.05 },
    media: { lose: 0, foul: 0, counter: 0 },
    baixa: { lose: -0.04, foul: -0.02, counter: 0.1 }
  };
  function tacticalMods(t) {
    const tac = t.setup.tactics;
    const court = outfield(t);
    let att = 0;
    let def = 0;
    const bestBy = (pos, k) => court.filter((l) => pos.includes(l.p.position)).sort((a, b) => eff(b, k) - eff(a, k))[0];
    if (tac.system === "3-1") {
      const piv = bestBy(["PIV", "ALA/PIV"], "jogoCostas");
      att += piv ? (eff(piv, "jogoCostas") - 11) * 0.18 : -0.6;
    } else if (tac.system === "4-0") {
      att += (avg(court, ["drible", "decisoes", "passe", "aceleracao"]) - 11) * 0.15 + 0.2;
      def -= 0.4;
    } else if (tac.system === "2-2") {
      def += 0.6;
      att -= 0.4;
    } else if (tac.system === "1-2-1") {
      const fix = bestBy(["FIX", "FIX/ALA", "UNI"], "posicionamento");
      def += fix ? (eff(fix, "posicionamento") - 11) * 0.12 + 0.15 : -0.4;
      att += 0.1;
    }
    const slots = SLOTS[tac.system];
    const fit = court.slice(0, 4).reduce((a, l, i) => a + roleFit(slots[i].role, l.p.position), 0) / Math.max(1, Math.min(4, court.length));
    att += (fit - 0.85) * 2.5;
    def += (fit - 0.85) * 2.5;
    if (tac.marking === "individual") def += (avg(court, ["desarme", "agressividade"]) - 11) * 0.12;
    else if (tac.marking === "zona") def += (avg(court, ["posicionamento", "concentracao"]) - 11) * 0.12;
    return { att, def };
  }
  const MARK_VS = {
    individual: { "3-1": 0.35, "4-0": -0.4, "2-2": 0, "1-2-1": 0.1, flying: -0.45 },
    zona: { "3-1": -0.3, "4-0": 0.3, "2-2": 0.1, "1-2-1": 0, flying: 0.3 },
    misto: { "3-1": 0.15, "4-0": -0.05, "2-2": 0.2, "1-2-1": 0.1, flying: 0 }
  };
  function markingVs(def, att) {
    const mk = def.setup.tactics.marking;
    let v = MARK_VS[mk]?.[att.flying ? "flying" : att.setup.tactics.system] ?? 0;
    if (mk === "misto") v += (avg(outfield(def), ["concentracao", "trabalhoEquipa"]) - 11) * 0.06;
    return v;
  }
  function possession(s2, counter2 = false) {
    const att = teams[s2];
    const def = teams[1 - s2];
    const attQ = avg(outfield(att), ["passe", "rececao", "drible", "decisoes", "visao"]);
    const defQ = avg(outfield(def), ["desarme", "posicionamento", "antecipacao", "concentracao"]);
    const press = avg(outfield(def), ["aceleracao", "resistencia", "trabalhoEquipa", "agressividade"]);
    const numDiff = numbers(att) - numbers(def);
    let diff = attQ - defQ * 0.85 - press * 0.15 + numDiff * 2.2;
    if (att.flying) diff += 1.5;
    diff += tacticalMods(att).att - tacticalMods(def).def;
    diff -= markingVs(def, att);
    diff += (att.setup.coachTactical - 10) * 0.07 - (def.setup.coachTactical - 10) * 0.07;
    const tempo = TEMPO[att.setup.tactics.tempo];
    const dPress = def.setup.tactics.pressure;
    diff += s2 === 0 ? 3 : -0.8;
    const gd = score2[s2] - score2[1 - s2];
    diff += Math.min(3, Math.max(0, -gd)) * 0.55 - Math.min(3, Math.max(0, gd)) * 0.2;
    const gs = att.setup.tactics.gkStyle ?? "classico";
    if (att.gk && !att.flying && gs !== "classico") diff += (eff(att.gk, "jogoPes") - 10) * (gs === "avancado" ? 0.08 : 0.06) + (gs === "avancado" ? 0.15 : 0.05);
    const dur = (counter2 ? 5 + r() * 8 : 12 + r() * 26) * (counter2 ? 1 : tempo.dur) / pace;
    const periodEnd = periodStart + periodLen;
    const timeLeft = periodEnd - clock;
    const dt = Math.min(dur, timeLeft);
    tick(dt);
    tstats[s2].possession += dt;
    const ended = clock >= periodEnd - 1e-3;
    if (ended && dur > timeLeft) {
      if (r() < 0.25) shot(s2, "jogada");
      return { next: 1 - s2, counter: false };
    }
    const pFoul = 1 / REF.tolerance * (0.15 + (avg(outfield(def), ["agressividade"]) - 10) * 5e-3 + PRESS[dPress].foul + (def.setup.tactics.marking === "individual" ? 0.02 : 0));
    const pLose = Math.max(0.18, Math.min(0.66, 0.4 - diff * 0.03 - (counter2 ? 0.15 : 0) + PRESS[dPress].lose + tempo.lose));
    const roll = r();
    if (roll < pFoul) {
      foul(s2);
      return { next: 1 - s2, counter: false };
    }
    if (roll < pFoul + pLose) {
      const tackler = pick3(outfield(def), (l) => eff(l, "desarme") + eff(l, "antecipacao"));
      pstats[tackler.p.id].tackles++;
      actions.push({ type: "lost", side: s2, other: tackler.p.id });
      if (r() < 0.02) log("quatro_segundos", `${sideName(s2)} perde a bola por exceder os 4 segundos`, s2);
      if (att.flying && r() < 0.32) {
        shot(1 - s2, "baliza_aberta", tackler);
        return { next: s2, counter: false };
      }
      if (!att.flying && (att.setup.tactics.gkStyle ?? "classico") === "avancado" && r() < 0.05) {
        shot(1 - s2, "baliza_aberta", tackler);
        return { next: s2, counter: false };
      }
      return { next: 1 - s2, counter: r() < 0.22 + PRESS[dPress].counter };
    }
    const beatPress = dPress === "alta" && r() < 0.09;
    const gkStyle = att.setup.tactics.gkStyle ?? "classico";
    const gkShoots = !att.flying && att.gk && !counter2 && r() < (gkStyle === "avancado" ? 0.025 : gkStyle === "construtor" ? 5e-3 : 0);
    savedCaught = null;
    if (gkShoots) {
      shot(s2, "jogada", att.gk);
      const last = actions[actions.length - 1];
      if (last?.type === "shot") last.gkRun = true;
    } else shot(s2, counter2 || beatPress ? "contra" : "jogada");
    const sc = savedCaught;
    if (sc && sc.side === 1 - s2) {
      const style = teams[sc.side].setup.tactics.gkStyle ?? "classico";
      const pc = 0.09 + (eff(sc.gk, "jogoPes") - 10) * 0.01 + (style === "avancado" ? 0.05 : style === "construtor" ? 0.02 : 0);
      return { next: 1 - s2, counter: r() < pc };
    }
    return { next: 1 - s2, counter: false };
  }
  const first = r() < 0.5 ? 0 : 1;
  const plan = [
    { p: 1, len: HALF, start: first },
    { p: 2, len: HALF, start: 1 - first }
  ];
  let stage = -1;
  let side = first;
  let counter = false;
  let extraTime = false;
  let penalties;
  let finished = false;
  let lastPossession = null;
  const timeoutRequest = [false, false];
  const flyingOverride = [null, null];
  function beginPeriod(i) {
    const pl2 = plan[i];
    period = pl2.p;
    periodStart = clock;
    periodLen = pl2.len;
    side = pl2.start;
    counter = false;
    const label = pl2.p === 1 ? "In\xEDcio da 1.\xAA parte" : pl2.p === 2 ? "In\xEDcio da 2.\xAA parte" : `In\xEDcio da ${pl2.p - 2}.\xAA parte do prolongamento`;
    log(pl2.p >= 3 ? "prolongamento" : "inicio", label);
  }
  function endPeriod() {
    log("fim_parte", `Fim do per\xEDodo. ${home.shortName} ${score2[0]}-${score2[1]} ${away.shortName}`);
    for (const s2 of [0, 1]) {
      if (teams[s2].flying) removeFlying(s2);
      for (const l of teams[s2].players) l.energy = Math.min(100, l.energy + (period === 1 ? 25 : 8));
    }
  }
  function manualTimeout(s2) {
    const t = teams[s2];
    const idx = period <= 2 ? period : 2;
    if (period > 2 || t.timeoutUsed[idx]) return false;
    t.timeoutUsed[idx] = true;
    tstats[s2].timeouts.push(clock);
    log("time_out", `Desconto de tempo pedido pelo ${sideName(s2)}`, s2);
    for (const l of t.court) l.energy = Math.min(100, l.energy + 6);
    return true;
  }
  function onePossession() {
    for (const s2 of [0, 1]) {
      const t = teams[s2];
      if (t.shortCount && clock >= t.shortUntil) {
        t.shortCount = 0;
        completeTeam(s2);
      }
      flyingDecision(s2);
      rotate(s2);
      if (timeoutRequest[s2]) {
        timeoutRequest[s2] = false;
        manualTimeout(s2);
      } else if (opts.manual !== s2) maybeTimeout(s2);
    }
    const before = score2[0] + score2[1];
    const evBefore = events.length;
    const start2 = clock;
    const att = side;
    const wasCounter = counter;
    actions = [];
    const holders = [teams[0], teams[1]].map((t) => [t.gk?.p.id ?? null, ...t.court.map((l) => l.p.id)]);
    const res = possession(side, counter);
    side = res.next;
    counter = res.counter;
    if (score2[0] + score2[1] > before) {
      const last = events.filter((e) => e.type === "golo").pop();
      side = 1 - last.side;
      counter = false;
    }
    lastPossession = { side: att, start: start2, end: clock, counter: wasCounter, events: events.slice(evBefore), actions, onCourt: holders, flying: [teams[0].flying, teams[1].flying] };
  }
  function finish() {
    log("fim_jogo", `Fim do jogo: ${home.shortName} ${score2[0]}-${score2[1]} ${away.shortName}${penalties ? ` (${penalties[0]}-${penalties[1]} nos pen\xE1ltis)` : ""}`);
    for (const t of teams) {
      const sd = teams.indexOf(t);
      const won = score2[sd] > score2[1 - sd] ? 0.3 : score2[sd] < score2[1 - sd] ? -0.3 : 0;
      for (const l of t.players) {
        const st = pstats[l.p.id];
        if (st.minutes < 30) {
          st.rating = 0;
          continue;
        }
        let rt = 6.2 + won + st.goals * 0.9 + st.assists * 0.5 + st.tackles * 0.08 - st.fouls * 0.08 - st.yellow * 0.3 - (st.red ? 1.5 : 0);
        if (l.p.position === "GR") rt += st.saves * 0.18 - conceded[l.p.id] * 0.35;
        rt += (r() - 0.5) * 0.6;
        st.rating = Math.round(Math.max(3, Math.min(10, rt)) * 10) / 10;
      }
    }
    finished = true;
  }
  function step() {
    if (finished) return false;
    lastPossession = null;
    if (stage < 0) {
      stage = 0;
      beginPeriod(0);
      return true;
    }
    if (clock < periodStart + periodLen - 1e-3) {
      onePossession();
      return true;
    }
    endPeriod();
    stage++;
    if (stage === 2 && opts.knockout && !opts.noExtraTime && score2[0] === score2[1]) {
      extraTime = true;
      plan.push({ p: 3, len: opts.extraTimeLen ?? ET, start: first }, { p: 4, len: opts.extraTimeLen ?? ET, start: 1 - first });
    }
    if (stage < plan.length) {
      beginPeriod(stage);
      return true;
    }
    if (opts.knockout && score2[0] === score2[1]) penalties = shootout();
    finish();
    return false;
  }
  function shootout() {
    period = 5;
    log("desempate", "Desempate por pontap\xE9s da marca de grande penalidade");
    const pk = [0, 0];
    const takers = teams.map(
      (t) => t.players.filter((l) => !l.sentOff).sort((a, b) => eff(b, "finalizacao") + eff(b, "compostura") - eff(a, "finalizacao") - eff(a, "compostura"))
    );
    const n = Math.min(takers[0].length, takers[1].length);
    const keepers = teams.map((t) => t.players.filter((l) => l.p.position === "GR" && !l.sentOff)[0]);
    let i = 0;
    const kick = (s2) => {
      const l = takers[s2][i % n];
      const gk = keepers[1 - s2];
      const gkQ = gk ? (gk.p.attrs.reflexos + gk.p.attrs.umParaUm) / 2 : 5;
      const p = Math.max(0.5, Math.min(0.92, 0.76 + (l.p.attrs.finalizacao + l.p.attrs.compostura) / 2 * 0.012 - gkQ * 0.01));
      const ok = r() < p;
      if (ok) pk[s2]++;
      events.push({ t: clock, period: 5, side: s2, type: "desempate", playerId: l.p.id, text: `${l.p.name} (${sideName(s2)}) ${ok ? "marca" : "falha"}. ${pk[0]}-${pk[1]}`, score: [score2[0], score2[1]] });
    };
    for (i = 0; i < 5; i++) {
      kick(first);
      if (decided(i, true)) break;
      kick(1 - first);
      if (decided(i, false)) break;
    }
    while (pk[0] === pk[1]) {
      kick(first);
      kick(1 - first);
      i++;
    }
    return pk;
    function decided(round2, afterFirst) {
      const taken = [round2 + 1, afterFirst ? round2 : round2 + 1];
      const takenBy = first === 0 ? [taken[0], taken[1]] : [taken[1], taken[0]];
      const left = [5 - takenBy[0], 5 - takenBy[1]];
      return pk[0] + left[0] < pk[1] || pk[1] + left[1] < pk[0];
    }
  }
  const result = () => ({ score: score2, penalties, extraTime, events, team: tstats, players: pstats, names });
  function snapshot() {
    const fp = period >= 3 ? 2 : period;
    return {
      clock,
      period,
      periodStart,
      periodLen,
      score: [score2[0], score2[1]],
      finished,
      teams: teams.map((t) => ({
        gk: t.gk ? { id: t.gk.p.id, number: t.gk.p.number, name: t.gk.p.name, energy: t.gk.energy, position: t.gk.p.position } : null,
        court: t.court.map((l) => ({ id: l.p.id, number: l.p.number, name: l.p.name, energy: l.energy, position: l.p.position })),
        bench: t.players.filter((l) => !l.onCourt).map((l) => ({ id: l.p.id, number: l.p.number, name: l.p.name, energy: l.energy, position: l.p.position, sentOff: l.sentOff })),
        flying: t.flying,
        fouls: t.fouls[fp] ?? 0,
        timeoutAvailable: period <= 2 && !t.timeoutUsed[period],
        short: clock < t.shortUntil ? t.shortCount : 0
      })),
      possession: lastPossession
    };
  }
  return {
    step,
    result,
    snapshot,
    events,
    stats: tstats,
    players: pstats,
    names,
    /** Substituição manual (volante, ilimitada): sai `outId` (em campo) e entra `inId` (no banco). */
    substitute: (s2, outId, inId) => {
      const t = teams[s2];
      const out = t.players.find((l) => l.p.id === outId);
      const inn = t.players.find((l) => l.p.id === inId);
      if (!out || !inn) return "Jogador n\xE3o encontrado";
      if (!out.onCourt) return `${out.p.name} n\xE3o est\xE1 em campo`;
      if (inn.onCourt) return `${inn.p.name} j\xE1 est\xE1 em campo`;
      if (inn.sentOff) return `${inn.p.name} foi expulso`;
      if (t.gk === out) {
        out.onCourt = false;
        inn.onCourt = true;
        t.gk = inn;
      } else {
        if (inn.p.position === "GR" && !t.flying) return "Um guarda-redes s\xF3 entra para o lugar do guarda-redes";
        out.onCourt = false;
        inn.onCourt = true;
        t.court = t.court.map((l) => l === out ? inn : l);
      }
      t.lastRotation = clock;
      log("substituicao", `${sideName(s2)}: entra ${inn.p.name}, sai ${out.p.name}`, s2, inn.p.id);
      return null;
    },
    requestTimeout: (s2) => {
      const t = teams[s2];
      if (period > 2 || t.timeoutUsed[period]) return false;
      timeoutRequest[s2] = true;
      return true;
    },
    /** Palestra: muda a moral de cada jogador durante o jogo (pontos de moral, como em morale.ts). */
    talk: (s2, deltas) => {
      for (const l of teams[s2].players) if (deltas[l.p.id]) l.mor = Math.max(0.9, Math.min(1.1, l.mor + deltas[l.p.id] / 100 * 0.12));
    },
    /** GR avançado pelo treinador: true = lança já, false = tira, null = volta à instrução tática. */
    setFlying: (s2, on) => {
      flyingOverride[s2] = on;
      if (on === false) removeFlying(s2);
    },
    flyingNow: (s2) => teams[s2].flying
  };
}

// src/core/game.ts
var espIds = (s2) => s2.leagues.find((l) => l.id === "esp1")?.clubIds ?? [];
function setupFor(s2, clubId, comp) {
  const c2 = s2.clubs.find((x) => x.id === clubId);
  const all = s2.players.filter((p) => p.clubId === c2.id && !(comp && banFor(s2, p.id, comp) > 0));
  let squad = all.filter((p) => !injuryOf(s2, p.id));
  if (!squad.some((p) => p.position === "GR") && squad.length) {
    const a = (p) => p.attrs.reflexos + p.attrs.agilidade + p.attrs.umParaUm + p.attrs.posicionamento;
    const best = [...squad].sort((x, y) => a(y) - a(x))[0];
    squad = squad.map((p) => p === best ? { ...p, position: "GR" } : p);
  }
  if (c2.id === s2.clubId) {
    normalizeTactics(s2.tactics, squad);
    const ok = (ids) => ids.filter((id) => squad.some((p) => p.id === id));
    const tactics = comp ? { ...s2.tactics, q1: ok(s2.tactics.q1), q2: ok(s2.tactics.q2) } : s2.tactics;
    return { clubId: c2.id, name: c2.name, shortName: c2.shortName, squad, tactics, coachTactical: managerAttrs(s2).tatico + analystBonus(s2, c2.id), cardK: 2 - mgrK(s2, "disciplina", 0.025), coachName: s2.manager.name, morale: s2.morale, fitness: s2.fitness };
  }
  const coach = s2.coaches.find((x) => x.clubId === c2.id);
  return {
    clubId: c2.id,
    name: c2.name,
    shortName: c2.shortName,
    squad,
    tactics: aiTactics(squad, c2, coach),
    coachTactical: (coach?.tactical ?? interimOf(s2, c2.id)?.tactical ?? 11) + analystBonus(s2, c2.id),
    morale: s2.morale,
    fitness: s2.fitness,
    coachName: coach?.name ?? interimOf(s2, c2.id)?.name ?? "Treinador interino"
  };
}
function startFirstSeason(s2) {
  const ranking = s2.leagues[0].clubIds.map((id) => s2.clubs.find((c2) => c2.id === id)).sort((a, b) => b.level - a.level).map((c2) => c2.id);
  const esp = espIds(s2).map((id) => s2.clubs.find((c2) => c2.id === id)).sort((a, b) => b.level - a.level).map((c2) => c2.id);
  s2.season = createSeason(2026, ranking, ["slb", "scp"], esp.length ? { ranking: esp, four: esp.slice(0, 4) } : void 0);
  s2.date = "2026-07-01";
  s2.pstats = {};
  ensureContracts(s2);
  ensurePool(s2);
  ensureStaff(s2);
  for (const c2 of s2.clubs) if (!juniorsOf(s2, c2.id).length) s2.players.push(...academyIntake(s2, c2, s2.season.year));
}

// src/data/esp/clubs.json
var clubs_default2 = {
  league: {
    id: "esp1",
    name: "Liga Prime Futsal",
    country: "Espanha",
    season: "2026/27",
    teams: 16
  },
  source: "Planteis, dorsais, pavilh\xF5es e lota\xE7\xF5es: RFEF (futsal.rfef.es, 2/11/2026); historial: futsalportugal.com; n\xEDvel/reputa\xE7\xE3o/riqueza: estimativa; or\xE7amentos pelos sal\xE1rios indicados pelo Ant\xF3nio",
  clubs: [
    {
      id: "bar",
      fp: 44,
      name: "FC Barcelona",
      shortName: "BAR",
      city: "Barcelona",
      arena: "Palau Blaugrana",
      capacity: 7585,
      capacityReal: true,
      colors: [
        "#a50044",
        "#004d98"
      ],
      reputation: 98,
      level: 96,
      wealth: 100,
      budget: 32e5,
      league: "esp1"
    },
    {
      id: "epz",
      fp: 42,
      name: "ElPozo Murcia",
      shortName: "EPZ",
      city: "M\xFArcia",
      arena: "Palacio de Deportes de Murcia",
      capacity: 7500,
      capacityReal: true,
      colors: [
        "#d50000",
        "#ffffff"
      ],
      reputation: 94,
      level: 92,
      wealth: 88,
      budget: 23e5,
      league: "esp1"
    },
    {
      id: "pal",
      fp: 33,
      name: "Illes Balears Palma Futsal",
      shortName: "PAL",
      city: "Palma",
      arena: "Palau Municipal d\xB4Esports de Son Moix",
      capacity: 3800,
      capacityReal: true,
      colors: [
        "#ffd200",
        "#000000"
      ],
      reputation: 95,
      level: 95,
      wealth: 86,
      budget: 21e5,
      league: "esp1"
    },
    {
      id: "jca",
      fp: 43,
      name: "Jimbee Cartagena",
      shortName: "JCA",
      city: "Cartagena",
      arena: "Palacio de los Deportes de Cartagena",
      capacity: 4817,
      capacityReal: true,
      colors: [
        "#000000",
        "#ffffff"
      ],
      reputation: 92,
      level: 94,
      wealth: 85,
      budget: 21e5,
      league: "esp1"
    },
    {
      id: "int",
      fp: 36,
      name: "Inter FS",
      shortName: "INT",
      city: "Torrej\xF3n de Ardoz",
      arena: "Jorge Garbajosa",
      capacity: 3200,
      capacityReal: true,
      colors: [
        "#0b3d91",
        "#ffffff"
      ],
      reputation: 93,
      level: 90,
      wealth: 84,
      budget: 19e5,
      league: "esp1"
    },
    {
      id: "jae",
      fp: 39,
      name: "Ja\xE9n Para\xEDso Interior",
      shortName: "JAE",
      city: "Ja\xE9n",
      arena: "Olivo Arena",
      capacity: 6589,
      capacityReal: true,
      colors: [
        "#ffd100",
        "#111111"
      ],
      reputation: 82,
      level: 84,
      wealth: 60,
      budget: 55e4,
      league: "esp1"
    },
    {
      id: "val",
      fp: 439,
      name: "Vi\xF1a Albali Valdepe\xF1as",
      shortName: "VAL",
      city: "Valdepe\xF1as",
      arena: "Virgen de la Cabeza",
      capacity: 2e3,
      capacityReal: true,
      colors: [
        "#7a1f3d",
        "#ffffff"
      ],
      reputation: 78,
      level: 80,
      wealth: 58,
      budget: 55e4,
      league: "esp1"
    },
    {
      id: "man",
      fp: 843,
      name: "Manzanares FS",
      shortName: "MAN",
      city: "Manzanares",
      arena: "Manzanares Arena",
      capacity: 1800,
      capacityReal: true,
      colors: [
        "#e30613",
        "#ffffff"
      ],
      reputation: 72,
      level: 76,
      wealth: 55,
      budget: 55e4,
      league: "esp1"
    },
    {
      id: "zar",
      fp: 38,
      name: "Sala 10 Zaragoza",
      shortName: "ZAR",
      city: "Sarago\xE7a",
      arena: "CDM Siglo XXI",
      capacity: 2900,
      capacityReal: true,
      colors: [
        "#d50000",
        "#ffffff"
      ],
      reputation: 74,
      level: 77,
      wealth: 55,
      budget: 45e4,
      league: "esp1"
    },
    {
      id: "pen",
      fp: 41,
      name: "Pe\xF1\xEDscola FS",
      shortName: "PEN",
      city: "Pe\xF1\xEDscola",
      arena: "Juan Vizcarro",
      capacity: 1e3,
      capacityReal: true,
      colors: [
        "#1565c0",
        "#ffffff"
      ],
      reputation: 74,
      level: 78,
      wealth: 55,
      budget: 45e4,
      league: "esp1"
    },
    {
      id: "par",
      fp: 32,
      name: "O Parrulo Ferrol",
      shortName: "PAR",
      city: "Ferrol",
      arena: "Polideportivo de A Malata",
      capacity: 4200,
      capacityReal: true,
      colors: [
        "#111111",
        "#ffffff"
      ],
      reputation: 70,
      level: 75,
      wealth: 52,
      budget: 45e4,
      league: "esp1"
    },
    {
      id: "osa",
      fp: 35,
      name: "Osasuna Magna Xota",
      shortName: "OSA",
      city: "Pamplona",
      arena: "Anaitasuna",
      capacity: 3e3,
      capacityReal: true,
      colors: [
        "#c8102e",
        "#0a2240"
      ],
      reputation: 72,
      level: 77,
      wealth: 56,
      budget: 45e4,
      league: "esp1"
    },
    {
      id: "cor",
      fp: 656,
      name: "C\xF3rdoba Patrimonio",
      shortName: "COR",
      city: "C\xF3rdoba",
      arena: "Palacio Municipal de Deportes Vista Alegre",
      capacity: 3500,
      capacityReal: true,
      colors: [
        "#00843d",
        "#ffffff"
      ],
      reputation: 72,
      level: 77,
      wealth: 54,
      budget: 45e4,
      league: "esp1"
    },
    {
      id: "eji",
      fp: 3603,
      name: "El Ejido Futsal",
      shortName: "EJI",
      city: "El Ejido",
      arena: "Pabell\xF3n Municipal de Deportes de El Ejido",
      capacity: 2e3,
      capacityReal: true,
      colors: [
        "#00843d",
        "#ffffff"
      ],
      reputation: 66,
      level: 74,
      wealth: 50,
      budget: 45e4,
      league: "esp1"
    },
    {
      id: "noi",
      fp: 1015,
      name: "Noia Portus Apostoli",
      shortName: "NOI",
      city: "Noia",
      arena: "Pabell\xF3n Municipal Agust\xEDn Mour\xEDs",
      capacity: 776,
      capacityReal: true,
      colors: [
        "#1e88e5",
        "#ffffff"
      ],
      reputation: 68,
      level: 74,
      wealth: 50,
      budget: 35e4,
      league: "esp1"
    },
    {
      id: "stc",
      fp: 31,
      name: "Industrias Santa Coloma",
      shortName: "STC",
      city: "Santa Coloma de Gramenet",
      arena: "Pabell\xF3n Nuevo",
      capacity: 1500,
      capacityReal: true,
      colors: [
        "#0d47a1",
        "#ffffff"
      ],
      reputation: 70,
      level: 74,
      wealth: 50,
      budget: 35e4,
      league: "esp1"
    }
  ]
};

// src/data/esp/players.json
var players_default2 = {
  _info: "Liga Prime Futsal 2026/27: planteis da RFEF (futsal.rfef.es) + historial do futsalportugal.com (recolha 2/11/2026, 1 p\xE1gina a cada 7 s). Dorsais oficiais da RFEF; ageEstimated = sem data de nascimento encontrada (25 anos, estimativa).",
  players: [
    {
      id: "bar01",
      clubId: "bar",
      name: "Miquel Feixas",
      fullName: "Miquel Feixas De Jes\xFAs",
      position: "GR",
      number: 26,
      age: 28,
      nationality: "Espanha"
    },
    {
      id: "bar02",
      clubId: "bar",
      name: "D\xEDdac",
      fullName: "D\xEDdac Plana Oltra",
      position: "GR",
      number: 21,
      age: 36,
      nationality: "Espanha"
    },
    {
      id: "bar03",
      clubId: "bar",
      name: "Mouhoudine",
      fullName: "Souheil Mouhoudine",
      position: "FIX",
      number: 22,
      age: 31,
      nationality: "Fran\xE7a"
    },
    {
      id: "bar04",
      clubId: "bar",
      name: "Antonio",
      fullName: "Antonio P\xE9rez Ortega",
      position: "FIX",
      number: 6,
      age: 25,
      nationality: "Espanha"
    },
    {
      id: "bar05",
      clubId: "bar",
      name: "Joao Victor",
      fullName: "Joao Victor Alves Sena",
      position: "FIX",
      number: 17,
      age: 25,
      nationality: "Brasil"
    },
    {
      id: "bar06",
      clubId: "bar",
      name: "Mi\xF1ano",
      fullName: "Joel Mi\xF1ano Correas",
      position: "FIX",
      number: 4,
      age: 20,
      nationality: "Espanha"
    },
    {
      id: "bar07",
      clubId: "bar",
      name: "Matheus",
      fullName: "Matheus Rodrigues C\xE9zar Da Silva",
      position: "ALA",
      number: 3,
      age: 29,
      nationality: "Brasil"
    },
    {
      id: "bar08",
      clubId: "bar",
      name: "Eric Martel",
      fullName: "Eric Martel Garc\xEDa",
      position: "ALA",
      number: 14,
      age: 34,
      nationality: "Espanha"
    },
    {
      id: "bar09",
      clubId: "bar",
      name: "Roger",
      fullName: "Roger Garc\xEDa Bernardo",
      position: "ALA",
      number: 5,
      age: 18,
      nationality: "Espanha"
    },
    {
      id: "bar10",
      clubId: "bar",
      name: "Catela",
      fullName: "Juan Jos\xE9 Camacho P\xE9rez",
      position: "ALA",
      number: 13,
      age: 31,
      nationality: "Espanha"
    },
    {
      id: "bar11",
      clubId: "bar",
      name: "Guti",
      fullName: "Pablo Gutierrez Zamora",
      position: "ALA",
      number: 20,
      age: 19,
      nationality: "Espanha"
    },
    {
      id: "bar12",
      clubId: "bar",
      name: "Tour\xE9",
      fullName: "Mamadou Siragassy Tour\xE9",
      position: "ALA",
      number: 11,
      age: 24,
      nationality: "Fran\xE7a"
    },
    {
      id: "bar13",
      clubId: "bar",
      name: "L. Gauna",
      fullName: "Luciano Silvestre Gauna",
      position: "ALA",
      number: 23,
      age: 25,
      nationality: "Argentina"
    },
    {
      id: "bar14",
      clubId: "bar",
      name: "Adolfo",
      fullName: "Adolfo Fern\xE1ndez D\xEDaz",
      position: "ALA",
      number: 8,
      age: 33,
      nationality: "Espanha"
    },
    {
      id: "bar15",
      clubId: "bar",
      name: "Sergio Gonz\xE1lez",
      fullName: "Sergio Gonz\xE1lez P\xE9rez",
      position: "ALA",
      number: 16,
      age: 29,
      nationality: "Espanha"
    },
    {
      id: "bar16",
      clubId: "bar",
      name: "Pito",
      fullName: "Jean Pierre Guisel Costa",
      position: "PIV",
      number: 10,
      age: 34,
      nationality: "Brasil"
    },
    {
      id: "bar17",
      clubId: "bar",
      name: "Higor",
      fullName: "Higor Ribeiro De Souza",
      position: "PIV",
      number: 7,
      age: 27,
      nationality: "Brasil"
    },
    {
      id: "cor01",
      clubId: "cor",
      name: "Fabio",
      fullName: "Fabio Alvira P\xE9rez",
      position: "GR",
      number: 12,
      age: 35,
      nationality: "Espanha"
    },
    {
      id: "cor02",
      clubId: "cor",
      name: "Aguayo",
      fullName: "\xC1lvaro Aguayo Perez",
      position: "GR",
      number: 25,
      age: 25,
      nationality: "Espanha"
    },
    {
      id: "cor03",
      clubId: "cor",
      name: "V\xEDctor",
      fullName: "V\xEDctor Areales Madue\xF1o",
      position: "GR",
      number: 1,
      age: 27,
      nationality: "Espanha"
    },
    {
      id: "cor04",
      clubId: "cor",
      name: "Hugo",
      fullName: "Hugo Exp\xF3sito Sicilia",
      position: "FIX",
      number: 2,
      age: 22,
      nationality: "Espanha"
    },
    {
      id: "cor05",
      clubId: "cor",
      name: "Murilo",
      fullName: "Murilo Duarte Da Silva",
      position: "FIX",
      number: 23,
      age: 33,
      nationality: "Brasil"
    },
    {
      id: "cor06",
      clubId: "cor",
      name: "Perin",
      fullName: "Lucas Benincasa Perin",
      position: "ALA",
      number: 10,
      age: 28,
      nationality: "Brasil"
    },
    {
      id: "cor07",
      clubId: "cor",
      name: "Ivi",
      fullName: "Iv\xE1n Fern\xE1ndez Spohr",
      position: "ALA",
      number: 11,
      age: 31,
      nationality: "Espanha"
    },
    {
      id: "cor08",
      clubId: "cor",
      name: "Alvarito",
      fullName: "\xC1lvaro Quevedo Cuello De Oro",
      position: "ALA",
      number: 77,
      age: 29,
      nationality: "Espanha"
    },
    {
      id: "cor09",
      clubId: "cor",
      name: "Diego Tosina",
      fullName: "Diego Tosina Luque",
      position: "ALA",
      number: 21,
      age: 21,
      nationality: "Espanha"
    },
    {
      id: "cor10",
      clubId: "cor",
      name: "Titi Del Rey",
      fullName: "Agust\xEDn del Rey",
      position: "ALA",
      number: 22,
      age: 24,
      nationality: "Argentina"
    },
    {
      id: "cor11",
      clubId: "cor",
      name: "Pablo Ord\xF3\xF1ez",
      fullName: "Pablo Ord\xF3\xF1ez Jim\xE9nez",
      position: "ALA",
      number: 6,
      age: 24,
      nationality: "Espanha"
    },
    {
      id: "cor12",
      clubId: "cor",
      name: "Peinado",
      fullName: "Alberto Peinado L\xF3pez",
      position: "ALA",
      number: 18,
      age: 24,
      nationality: "Espanha"
    },
    {
      id: "cor13",
      clubId: "cor",
      name: "Zequi",
      fullName: "Ezequiel Montero Jim\xE9nez",
      position: "ALA",
      number: 7,
      age: 32,
      nationality: "Espanha"
    },
    {
      id: "cor14",
      clubId: "cor",
      name: "Aranda",
      fullName: "Javier Aranda Prendes",
      position: "ALA",
      number: 14,
      age: 20,
      nationality: "Espanha"
    },
    {
      id: "cor15",
      clubId: "cor",
      name: "David Fernandez",
      fullName: "David Fernandez Garcia",
      position: "ALA",
      number: 8,
      age: 19,
      nationality: "Espanha"
    },
    {
      id: "cor16",
      clubId: "cor",
      name: "Faly",
      fullName: "Rafael Teruel Frases",
      position: "ALA",
      number: 5,
      age: 20,
      nationality: "Espanha"
    },
    {
      id: "cor17",
      clubId: "cor",
      name: "Pablo Ibarra",
      fullName: "Pablo Ibarra Fuertes",
      position: "PIV",
      number: 20,
      age: 31,
      nationality: "Uruguai"
    },
    {
      id: "cor18",
      clubId: "cor",
      name: "Palacio",
      fullName: "Miguel Palacio Parada",
      position: "PIV",
      number: 9,
      age: 20,
      nationality: "Espanha"
    },
    {
      id: "epz01",
      clubId: "epz",
      name: "Edu Sousa",
      fullName: "Eduardo Filipe Sousa Veiga",
      position: "GR",
      number: 19,
      age: 29,
      nationality: "Portugal"
    },
    {
      id: "epz02",
      clubId: "epz",
      name: "Antonio Navarro",
      fullName: "Antonio Navarro L\xF3pez",
      position: "GR",
      number: 1,
      age: 25,
      nationality: "Espanha"
    },
    {
      id: "epz03",
      clubId: "epz",
      name: "Juanjo",
      fullName: "Juan Jos\xE9 L\xF3pez P\xE9rez",
      position: "GR",
      number: 38,
      age: 19,
      nationality: "Espanha"
    },
    {
      id: "epz04",
      clubId: "epz",
      name: "Ricardo",
      fullName: "Ricardo Mayor Gonz\xE1lez",
      position: "FIX",
      number: 8,
      age: 26,
      nationality: "Espanha"
    },
    {
      id: "epz05",
      clubId: "epz",
      name: "Ander",
      fullName: "Ander Barranco Sanchez",
      position: "FIX",
      number: 15,
      age: 19,
      nationality: "Espanha"
    },
    {
      id: "epz06",
      clubId: "epz",
      name: "Bebe",
      fullName: "Rafael Garc\xEDa Aguilera",
      position: "FIX",
      number: 51,
      age: 36,
      nationality: "Espanha"
    },
    {
      id: "epz07",
      clubId: "epz",
      name: "Ricardinho",
      fullName: "Ricardo Henrique Lemos Diniz",
      position: "ALA",
      number: 10,
      age: 26,
      nationality: "Brasil"
    },
    {
      id: "epz08",
      clubId: "epz",
      name: "Ligeiro",
      fullName: "Gabriel Ferreira Santos",
      position: "ALA",
      number: 33,
      age: 23,
      nationality: "Brasil"
    },
    {
      id: "epz09",
      clubId: "epz",
      name: "Rivera",
      fullName: "Adri\xE1n Rivera Gonz\xE1lez",
      position: "ALA",
      number: 9,
      age: 24,
      nationality: "Espanha"
    },
    {
      id: "epz10",
      clubId: "epz",
      name: "Gadeia",
      fullName: "Fabricio Bastezini Spinello",
      position: "ALA",
      number: 31,
      age: 38,
      nationality: "Brasil"
    },
    {
      id: "epz11",
      clubId: "epz",
      name: "Mario",
      fullName: "Mario Sanchez Esquiva",
      position: "ALA",
      number: 70,
      age: 17,
      nationality: "Espanha"
    },
    {
      id: "epz12",
      clubId: "epz",
      name: "Guille",
      fullName: "Guillermo Tom\xE1s Cant\xF3",
      position: "ALA",
      number: 4,
      age: 25,
      nationality: "Espanha"
    },
    {
      id: "epz13",
      clubId: "epz",
      name: "Pachu",
      fullName: "Pablo Garc\xEDa Lago",
      position: "ALA",
      number: 14,
      age: 25,
      nationality: "Espanha"
    },
    {
      id: "epz14",
      clubId: "epz",
      name: "David \xC1lvarez",
      fullName: "David \xC1lvarez Munteis",
      position: "ALA",
      number: 16,
      age: 28,
      nationality: "Espanha"
    },
    {
      id: "epz15",
      clubId: "epz",
      name: "A. Meseguer",
      fullName: "Andr\xE9s Meseguer Costa",
      position: "ALA",
      number: 49,
      age: 18,
      nationality: "Espanha"
    },
    {
      id: "epz16",
      clubId: "epz",
      name: "Marcel",
      fullName: "Marcel De Mendoca Marques",
      position: "ALA",
      number: 11,
      age: 29,
      nationality: "Brasil"
    },
    {
      id: "epz17",
      clubId: "epz",
      name: "Dener",
      fullName: "Dener Rodrigo Da Silva",
      position: "PIV",
      number: 7,
      age: 30,
      nationality: "Brasil"
    },
    {
      id: "epz18",
      clubId: "epz",
      name: "Drahovsky",
      fullName: "Tomas Drahovsky",
      position: "PIV",
      number: 18,
      age: 33,
      nationality: "Eslov\xE1quia"
    },
    {
      id: "epz19",
      clubId: "epz",
      name: "Santa Cruz",
      fullName: "Gonzalo Santa Cruz Vasallo",
      position: "PIV",
      number: 17,
      age: 21,
      nationality: "Espanha"
    },
    {
      id: "pal01",
      clubId: "pal",
      name: "Luan Muller",
      fullName: "Luan Muller Barboza",
      position: "GR",
      number: 3,
      age: 33,
      nationality: "Arm\xE9nia"
    },
    {
      id: "pal02",
      clubId: "pal",
      name: "Carlos Barr\xF3n",
      fullName: "Carlos Barr\xF3n Redondo",
      position: "GR",
      number: 1,
      age: 38,
      nationality: "Espanha"
    },
    {
      id: "pal03",
      clubId: "pal",
      name: "Dennis",
      fullName: "Dennis Vasconcelos Cavalcanti",
      position: "GR",
      number: 2,
      age: 28,
      nationality: "Brasil"
    },
    {
      id: "pal04",
      clubId: "pal",
      name: "Machado",
      fullName: "Lucas Leandro Machado",
      position: "FIX",
      number: 44,
      age: 29,
      nationality: "Brasil"
    },
    {
      id: "pal05",
      clubId: "pal",
      name: "Deivao",
      fullName: "David Pasinato Beolrini",
      position: "FIX",
      number: 20,
      age: 25,
      nationality: "Brasil"
    },
    {
      id: "pal06",
      clubId: "pal",
      name: "Piqueras",
      fullName: "Manuel Piqueras D\xF3lera",
      position: "FIX",
      number: 23,
      age: 29,
      nationality: "Espanha"
    },
    {
      id: "pal07",
      clubId: "pal",
      name: "Luc\xE3o",
      fullName: "Lucas Vinicius De Santana Brito",
      position: "ALA",
      number: 12,
      age: 29,
      nationality: "Brasil"
    },
    {
      id: "pal08",
      clubId: "pal",
      name: "Carlos G\xF3mez",
      fullName: "Carlos G\xF3mez Jerez",
      position: "ALA",
      number: 14,
      age: 24,
      nationality: "Espanha"
    },
    {
      id: "pal09",
      clubId: "pal",
      name: "Rodrigo",
      fullName: "Rodrigo Gaspar Monteiro",
      position: "ALA",
      number: 13,
      age: 19,
      nationality: "Portugal"
    },
    {
      id: "pal10",
      clubId: "pal",
      name: "Fabinho",
      fullName: "F\xE1bio Augusto Carneiro Dos Santos",
      position: "ALA",
      number: 10,
      age: 24,
      nationality: "Brasil"
    },
    {
      id: "pal11",
      clubId: "pal",
      name: "J\xFAlio Zanotto",
      fullName: "J\xFAlio C\xE9sar Brollo Zanotto",
      position: "ALA",
      number: 11,
      age: 30,
      nationality: "Arm\xE9nia"
    },
    {
      id: "pal12",
      clubId: "pal",
      name: "Ernesto",
      fullName: "Ernesto Claudino Gris",
      position: "ALA",
      number: 27,
      age: 25,
      nationality: "Brasil"
    },
    {
      id: "pal13",
      clubId: "pal",
      name: "Diego Nunes",
      fullName: "Diego Nunes de Souza Costa",
      position: "ALA",
      number: 17,
      age: 31,
      nationality: "Brasil"
    },
    {
      id: "pal14",
      clubId: "pal",
      name: "D. Pe\xF1a",
      fullName: "David Pe\xF1a Romero",
      position: "ALA",
      number: 7,
      age: 26,
      nationality: "Espanha"
    },
    {
      id: "pal15",
      clubId: "pal",
      name: "Charuto",
      fullName: "Charles Henrique Ferreira",
      position: "PIV",
      number: 9,
      age: 33,
      nationality: "Brasil"
    },
    {
      id: "pal16",
      clubId: "pal",
      name: "Alisson Neves",
      fullName: "Alisson Neves de Lima",
      position: "PIV",
      number: 99,
      age: 27,
      nationality: "Brasil"
    },
    {
      id: "eji01",
      clubId: "eji",
      name: "Jes\xFAs",
      fullName: "Jes\xFAs G\xF3mez Yerpes",
      position: "GR",
      number: 15,
      age: 30,
      nationality: "Espanha"
    },
    {
      id: "eji02",
      clubId: "eji",
      name: "Vandeson",
      fullName: "Manuel Pereira Da Silva",
      position: "GR",
      number: 12,
      age: 24,
      nationality: "Brasil"
    },
    {
      id: "eji03",
      clubId: "eji",
      name: "Josete",
      fullName: "Jos\xE9 Manuel Fern\xE1ndez Valor",
      position: "FIX",
      number: 3,
      age: 32,
      nationality: "Espanha"
    },
    {
      id: "eji04",
      clubId: "eji",
      name: "Dela",
      fullName: "Daniel De la Pe\xF1a S\xE1nchez Pacheco",
      position: "FIX",
      number: 4,
      age: 28,
      nationality: "Espanha"
    },
    {
      id: "eji05",
      clubId: "eji",
      name: "A. Geraghty",
      fullName: "Andr\xE9s Sebasti\xE1n Geraghty",
      position: "ALA",
      number: 2,
      age: 28,
      nationality: "Argentina"
    },
    {
      id: "eji06",
      clubId: "eji",
      name: "Pope",
      fullName: "Diego Ezequiel Mercado",
      position: "ALA",
      number: 17,
      age: 28,
      nationality: "Argentina"
    },
    {
      id: "eji07",
      clubId: "eji",
      name: "Nacho Gil",
      fullName: "Ignacio Gil G\xF3mez",
      position: "ALA",
      number: 11,
      age: 40,
      nationality: "Espanha"
    },
    {
      id: "eji08",
      clubId: "eji",
      name: "Arnaldo B\xE1ez",
      fullName: "Arnaldo Enrique B\xE1ez Torres",
      position: "ALA",
      number: 7,
      age: 30,
      nationality: "Paraguai"
    },
    {
      id: "eji09",
      clubId: "eji",
      name: "Nico Rosa",
      fullName: "Nicol\xE1s Ezequiel Rosa",
      position: "ALA",
      number: 20,
      age: 28,
      nationality: "Argentina"
    },
    {
      id: "eji10",
      clubId: "eji",
      name: "Isma Vacas",
      fullName: "Ismael Vacas Carmona",
      position: "ALA",
      number: 29,
      age: 21,
      nationality: "Espanha"
    },
    {
      id: "eji11",
      clubId: "eji",
      name: "Beto",
      fullName: "Roberto Da Fonseca Alves Da Silva",
      position: "ALA",
      number: 21,
      age: 27,
      nationality: "Brasil"
    },
    {
      id: "eji12",
      clubId: "eji",
      name: "Juanico",
      fullName: "Juan Jos\xE9 Moreno L\xF3pez",
      position: "ALA",
      number: 14,
      age: 22,
      nationality: "Espanha"
    },
    {
      id: "eji13",
      clubId: "eji",
      name: "Rufino",
      fullName: "Santiago Mart\xEDn Rufino",
      position: "PIV",
      number: 10,
      age: 26,
      nationality: "Argentina"
    },
    {
      id: "eji14",
      clubId: "eji",
      name: "Cola",
      fullName: "Antonio Jes\xFAs Molina Ju\xE1rez",
      position: "PIV",
      number: 19,
      age: 23,
      nationality: "Espanha"
    },
    {
      id: "eji15",
      clubId: "eji",
      name: "Povea",
      fullName: "Cristian Povea Ruiz",
      position: "PIV",
      number: 28,
      age: 24,
      nationality: "Espanha"
    },
    {
      id: "eji16",
      clubId: "eji",
      name: "C. Rubio",
      fullName: "Cristian Aparicio G\xF3mez",
      position: "PIV",
      number: 9,
      age: 29,
      nationality: "Espanha"
    },
    {
      id: "stc01",
      clubId: "stc",
      name: "Ferreyra",
      fullName: "Marcos Eli\xE1n Ferreyra",
      position: "GR",
      number: 25,
      age: 25,
      nationality: "Argentina"
    },
    {
      id: "stc02",
      clubId: "stc",
      name: "Pau L\xF3pez",
      fullName: "Pau L\xF3pez Riera",
      position: "GR",
      number: 1,
      age: 22,
      nationality: "Espanha"
    },
    {
      id: "stc03",
      clubId: "stc",
      name: "Marc Tolr\xE0",
      fullName: "Marc Tolr\xE0 Garc\xEDa",
      position: "FIX",
      number: 3,
      age: 35,
      nationality: "Espanha"
    },
    {
      id: "stc04",
      clubId: "stc",
      name: "Niel\xB7lo",
      fullName: "Daniel Bertran Ferrer",
      position: "FIX",
      number: 18,
      age: 22,
      nationality: "Espanha"
    },
    {
      id: "stc05",
      clubId: "stc",
      name: "S. Corso",
      fullName: "Sebasti\xE1n Corso",
      position: "FIX",
      number: 17,
      age: 34,
      nationality: "Argentina"
    },
    {
      id: "stc06",
      clubId: "stc",
      name: "Medina",
      fullName: "Luis Miguel Medina Fuste",
      position: "FIX",
      number: 28,
      age: 20,
      nationality: "Espanha"
    },
    {
      id: "stc07",
      clubId: "stc",
      name: "A. Molist",
      fullName: "Aleix Molist Martinez",
      position: "ALA",
      number: 29,
      age: 25,
      nationality: "Espanha"
    },
    {
      id: "stc08",
      clubId: "stc",
      name: "Pol Pacheco",
      fullName: "Pol Pacheco Gonzalez",
      position: "ALA",
      number: 10,
      age: 31,
      nationality: "Espanha"
    },
    {
      id: "stc09",
      clubId: "stc",
      name: "Aniol",
      fullName: "Aniol Vendrell Aldom\xE1",
      position: "ALA",
      number: 12,
      age: 24,
      nationality: "Espanha"
    },
    {
      id: "stc10",
      clubId: "stc",
      name: "V\xEDctor P\xE9rez",
      fullName: "V\xEDctor P\xE9rez P\xE9rez",
      position: "ALA",
      number: 11,
      age: 21,
      nationality: "Espanha"
    },
    {
      id: "stc11",
      clubId: "stc",
      name: "Dylan Vargas",
      fullName: "Dylan Vargas",
      position: "ALA",
      number: 33,
      age: 29,
      nationality: "Argentina"
    },
    {
      id: "stc12",
      clubId: "stc",
      name: "V. Ramos",
      fullName: "Victor Ramos Mora",
      position: "ALA",
      number: 7,
      age: 22,
      nationality: "Espanha"
    },
    {
      id: "stc13",
      clubId: "stc",
      name: "Uri Santos",
      fullName: "Oriol Santos Mart\xED",
      position: "ALA",
      number: 4,
      age: 29,
      nationality: "Espanha"
    },
    {
      id: "stc14",
      clubId: "stc",
      name: "Eric P\xE9rez",
      fullName: "Eric P\xE9rez Veganzones",
      position: "PIV",
      number: 23,
      age: 29,
      nationality: "Espanha"
    },
    {
      id: "stc15",
      clubId: "stc",
      name: "Granda",
      fullName: "Lucas Ezequiel Granda",
      position: "PIV",
      number: 8,
      age: 19,
      nationality: "Argentina"
    },
    {
      id: "jae01",
      clubId: "jae",
      name: "Hugo Montoro",
      fullName: "Hugo Montoro P\xE9rez",
      position: "GR",
      number: 13,
      age: 2026,
      nationality: "Espanha"
    },
    {
      id: "jae02",
      clubId: "jae",
      name: "Espindola",
      fullName: "Carlos Eduardo Nesello Espindola",
      position: "GR",
      number: 1,
      age: 32,
      nationality: "Brasil"
    },
    {
      id: "jae03",
      clubId: "jae",
      name: "Frezzatto",
      fullName: "Joao Marcelo Magalhaes Frezzato",
      position: "GR",
      number: 12,
      age: 24,
      nationality: "Brasil"
    },
    {
      id: "jae04",
      clubId: "jae",
      name: "Boyis",
      fullName: "Antonio Manuel S\xE1nchez Tienda",
      position: "FIX",
      number: 8,
      age: 36,
      nationality: "Espanha"
    },
    {
      id: "jae05",
      clubId: "jae",
      name: "Power Raggiati",
      fullName: "Agust\xEDn Luciano Raggiati",
      position: "FIX",
      number: 3,
      age: 25,
      nationality: "Argentina"
    },
    {
      id: "jae06",
      clubId: "jae",
      name: "Jo\xE3o Salla",
      fullName: "Jo\xE3o V\xEDtor Salla Vivan",
      position: "FIX",
      number: 5,
      age: 30,
      nationality: "Brasil"
    },
    {
      id: "jae07",
      clubId: "jae",
      name: "C\xE9sar",
      fullName: "C\xE9sar Velasco L\xF3pez",
      position: "ALA",
      number: 29,
      age: 28,
      nationality: "Espanha"
    },
    {
      id: "jae08",
      clubId: "jae",
      name: "Bynho",
      fullName: "Alberto Ferraz Barboza",
      position: "ALA",
      number: 17,
      age: 33,
      nationality: "Brasil"
    },
    {
      id: "jae09",
      clubId: "jae",
      name: "M\xEDchel",
      fullName: "Miguel Jes\xFAs Moya Hoyo",
      position: "ALA",
      number: 21,
      age: 33,
      nationality: "Espanha"
    },
    {
      id: "jae10",
      clubId: "jae",
      name: "Eloy Rojas",
      fullName: "Eloy Ernesto Rojas Gomez",
      position: "ALA",
      number: 10,
      age: 31,
      nationality: "Espanha"
    },
    {
      id: "jae11",
      clubId: "jae",
      name: "Lemine",
      fullName: "Alejandro Lemine Luque",
      position: "ALA",
      number: 15,
      age: 34,
      nationality: "Espanha"
    },
    {
      id: "jae12",
      clubId: "jae",
      name: "Dani Zurdo",
      fullName: "Daniel L\xF3pez L\xF3pez",
      position: "ALA",
      number: 6,
      age: 26,
      nationality: "Espanha"
    },
    {
      id: "jae13",
      clubId: "jae",
      name: "Nando",
      fullName: "Fernando Montardo Trindade",
      position: "ALA",
      number: 7,
      age: 28,
      nationality: "Brasil"
    },
    {
      id: "jae14",
      clubId: "jae",
      name: "Esteban",
      fullName: "Esteban Cejudo Guerrero",
      position: "PIV",
      number: 4,
      age: 31,
      nationality: "Espanha"
    },
    {
      id: "jae15",
      clubId: "jae",
      name: "Mati Rosa",
      fullName: "Mat\xEDas Sebasti\xE1n Rosa",
      position: "PIV",
      number: 41,
      age: 30,
      nationality: "Argentina"
    },
    {
      id: "jae16",
      clubId: "jae",
      name: "Alan Brandi",
      fullName: "Alan Brandi Cuanisc\xFA",
      position: "PIV",
      number: 14,
      age: 38,
      nationality: "Argentina"
    },
    {
      id: "jca01",
      clubId: "jca",
      name: "Chispi",
      fullName: "Jos\xE9 Antonio Guillam\xF3n Alcaraz",
      position: "GR",
      number: 22,
      age: 28,
      nationality: "Espanha"
    },
    {
      id: "jca02",
      clubId: "jca",
      name: "Chemi",
      fullName: "Jos\xE9 Miguel Oliver Solano",
      position: "GR",
      number: 1,
      age: 30,
      nationality: "Espanha"
    },
    {
      id: "jca03",
      clubId: "jca",
      name: "David",
      fullName: "David Allan Rocha Allan Rocha",
      position: "GR",
      number: 21,
      age: 23,
      nationality: "Brasil"
    },
    {
      id: "jca04",
      clubId: "jca",
      name: "Tomaz",
      fullName: "Francisco Tomaz Braga Nunes Cavalcante",
      position: "FIX",
      number: 8,
      age: 35,
      nationality: "Espanha"
    },
    {
      id: "jca05",
      clubId: "jca",
      name: "Agust\xEDn Plaza",
      fullName: "Agust\xEDn Plaza Teij\xF3n",
      position: "FIX",
      number: 5,
      age: 26,
      nationality: "Argentina"
    },
    {
      id: "jca06",
      clubId: "jca",
      name: "Juninho",
      fullName: "Cicero Severino Da Silva Junior",
      position: "FIX",
      number: 3,
      age: 26,
      nationality: "Brasil"
    },
    {
      id: "jca07",
      clubId: "jca",
      name: "Dar\xEDo",
      fullName: "Dar\xEDo Gil Campoy",
      position: "FIX",
      number: 23,
      age: 29,
      nationality: "Espanha"
    },
    {
      id: "jca08",
      clubId: "jca",
      name: "Renato",
      fullName: "Renato Lopes Furtado",
      position: "ALA",
      number: 12,
      age: 28,
      nationality: "Espanha"
    },
    {
      id: "jca09",
      clubId: "jca",
      name: "Gon Castej\xF3n",
      fullName: "Gonzalo Castej\xF3n Fluixa",
      position: "ALA",
      number: 7,
      age: 26,
      nationality: "Espanha"
    },
    {
      id: "jca10",
      clubId: "jca",
      name: "Cort\xE9s",
      fullName: "Francisco Jos\xE9 Cort\xE9s Hern\xE1ndez",
      position: "ALA",
      number: 10,
      age: 30,
      nationality: "Espanha"
    },
    {
      id: "jca11",
      clubId: "jca",
      name: "Adri Rubio",
      fullName: "Adri\xE1n Rubio Varea",
      position: "ALA",
      number: 77,
      age: 25,
      nationality: "Espanha"
    },
    {
      id: "jca12",
      clubId: "jca",
      name: "Mellado",
      fullName: "Miguel \xC1ngel Cano Mellado",
      position: "ALA",
      number: 13,
      age: 26,
      nationality: "Espanha"
    },
    {
      id: "jca13",
      clubId: "jca",
      name: "Carlos",
      fullName: "Carlos Alonso Font",
      position: "ALA",
      number: 6,
      age: 19,
      nationality: "Espanha"
    },
    {
      id: "jca14",
      clubId: "jca",
      name: "Motta",
      fullName: "Gabriel Rodrigues Motta",
      position: "ALA",
      number: 14,
      age: 26,
      nationality: "It\xE1lia"
    },
    {
      id: "jca15",
      clubId: "jca",
      name: "Waltinho",
      fullName: "Walter Fernandes Da Costa Firmino",
      position: "PIV",
      number: 11,
      age: 34,
      nationality: "Brasil"
    },
    {
      id: "jca16",
      clubId: "jca",
      name: "Dani Ruano",
      fullName: "Daniel Martinez Ruano",
      position: "PIV",
      number: 17,
      age: 19,
      nationality: "Espanha"
    },
    {
      id: "jca17",
      clubId: "jca",
      name: "Osamanmusa",
      fullName: "Muhammad Osamanmusa",
      position: "PIV",
      number: 20,
      age: 28,
      nationality: "Tail\xE2ndia"
    },
    {
      id: "jca18",
      clubId: "jca",
      name: "P. Ram\xEDrez",
      fullName: "Pablo Ram\xEDrez Gonz\xE1lez",
      position: "PIV",
      number: 9,
      age: 25,
      nationality: "Espanha"
    },
    {
      id: "osa01",
      clubId: "osa",
      name: "Asier",
      fullName: "Asier Llamas Echeverria",
      position: "GR",
      number: 1,
      age: 33,
      nationality: "Espanha"
    },
    {
      id: "osa02",
      clubId: "osa",
      name: "Planillo",
      fullName: "Miguel Planillo Soler",
      position: "GR",
      number: 20,
      age: 21,
      nationality: "Espanha"
    },
    {
      id: "osa03",
      clubId: "osa",
      name: "Zabarbe",
      fullName: "Onaitz Zabarte Ramirez",
      position: "FIX",
      number: 29,
      age: 19,
      nationality: "Espanha"
    },
    {
      id: "osa04",
      clubId: "osa",
      name: "Vatamaniuc",
      fullName: "David Vatamaniuc",
      position: "FIX",
      number: 3,
      age: 23,
      nationality: "Hungria"
    },
    {
      id: "osa05",
      clubId: "osa",
      name: "I. Cervi\xF1o",
      fullName: "Ion Cervi\xF1o Pueyo",
      position: "ALA",
      number: 7,
      age: 22,
      nationality: "Espanha"
    },
    {
      id: "osa06",
      clubId: "osa",
      name: "M. Camp\xE1s",
      fullName: "Marc Camp\xE1s Rigat",
      position: "ALA",
      number: 22,
      age: 25,
      nationality: "Espanha"
    },
    {
      id: "osa07",
      clubId: "osa",
      name: "Iraurgi",
      fullName: "Aimar Iraurgi Marcos",
      position: "ALA",
      number: 47,
      age: 17,
      nationality: "Espanha"
    },
    {
      id: "osa08",
      clubId: "osa",
      name: "Joaqu\xEDn",
      fullName: "Joaqu\xEDn Exp\xF3sito L\xF3pez",
      position: "ALA",
      number: 19,
      age: 21,
      nationality: "Espanha"
    },
    {
      id: "osa09",
      clubId: "osa",
      name: "A. Rojas",
      fullName: "Alan Ruben Rojas Dominguez",
      position: "ALA",
      number: 2,
      age: 27,
      nationality: "Espanha"
    },
    {
      id: "osa10",
      clubId: "osa",
      name: "Grillo",
      fullName: "Franco Agustin Grillo",
      position: "ALA",
      number: 8,
      age: 25,
      nationality: "Argentina"
    },
    {
      id: "osa11",
      clubId: "osa",
      name: "Shunta",
      fullName: "Shunta Uchida",
      position: "ALA",
      number: 14,
      age: 29,
      nationality: "Jap\xE3o"
    },
    {
      id: "osa12",
      clubId: "osa",
      name: "Larrea",
      fullName: "Javier Larrea Esnaola",
      position: "ALA",
      number: 25,
      age: 18,
      nationality: "Espanha"
    },
    {
      id: "osa13",
      clubId: "osa",
      name: "Josu",
      fullName: "Josu Mendive Zalba",
      position: "ALA",
      number: 10,
      age: 24,
      nationality: "Espanha"
    },
    {
      id: "osa14",
      clubId: "osa",
      name: "Petry",
      fullName: "Bruno Petry",
      position: "PIV",
      number: 30,
      age: 37,
      nationality: "Brasil"
    },
    {
      id: "osa15",
      clubId: "osa",
      name: "Julen",
      fullName: "Julen Fern\xE1ndez Lacunza",
      position: "PIV",
      number: 28,
      age: 17,
      nationality: "Espanha"
    },
    {
      id: "osaj01",
      clubId: "osa@jun",
      name: "Oier Amezgaray",
      position: "ALA",
      number: null,
      age: 17,
      nationality: "Espanha"
    },
    {
      id: "int01",
      clubId: "int",
      name: "Ra\xFAl Jim\xE9nez",
      fullName: "Ra\xFAl Jim\xE9nez L\xF3pez",
      position: "GR",
      number: 15,
      age: 30,
      nationality: "Espanha"
    },
    {
      id: "int02",
      clubId: "int",
      name: "Jes\xFAs Garc\xEDa",
      fullName: "Jes\xFAs Garc\xEDa Rold\xE1n",
      position: "GR",
      number: 27,
      age: 25,
      nationality: "Espanha"
    },
    {
      id: "int03",
      clubId: "int",
      name: "A. Garcia",
      fullName: "Andres Garcia Barrio-pedro",
      position: "GR",
      number: 29,
      age: 25,
      nationality: "Espanha"
    },
    {
      id: "int04",
      clubId: "int",
      name: "Jes\xFAs Herrero",
      fullName: "Jes\xFAs Herrero Parr\xF3n",
      position: "GR",
      number: 1,
      age: 39,
      nationality: "Espanha"
    },
    {
      id: "int05",
      clubId: "int",
      name: "\xD3scar",
      fullName: "Oscar Delgado Trabas",
      position: "GR",
      number: null,
      age: 2026,
      nationality: "Espanha"
    },
    {
      id: "int06",
      clubId: "int",
      name: "Tony",
      fullName: "Antonio Escribano G\xF3mez",
      position: "FIX",
      number: 4,
      age: 27,
      nationality: "Espanha"
    },
    {
      id: "int07",
      clubId: "int",
      name: "Raya",
      fullName: "Jos\xE9 Antonio Fern\xE1ndez Raya",
      position: "FIX",
      number: 8,
      age: 29,
      nationality: "Espanha"
    },
    {
      id: "int08",
      clubId: "int",
      name: "Paniagua",
      fullName: "Francisco Javier Paniagua Soler",
      position: "ALA",
      number: 11,
      age: 27,
      nationality: "Espanha"
    },
    {
      id: "int09",
      clubId: "int",
      name: "Harrison",
      fullName: "Harrison David Santos Herrera",
      position: "ALA",
      number: 7,
      age: 25,
      nationality: "Col\xF4mbia"
    },
    {
      id: "int10",
      clubId: "int",
      name: "Ra\xFAl G\xF3mez",
      fullName: "Ra\xFAl G\xF3mez Del Olmo",
      position: "ALA",
      number: 6,
      age: 30,
      nationality: "Espanha"
    },
    {
      id: "int11",
      clubId: "int",
      name: "J. M\xEDnguez",
      fullName: "Javier M\xEDnguez Rubio",
      position: "ALA",
      number: 10,
      age: 29,
      nationality: "Espanha"
    },
    {
      id: "int12",
      clubId: "int",
      name: "Marvin",
      fullName: "Marvil Raphael Ghislandi",
      position: "ALA",
      number: 99,
      age: 27,
      nationality: "B\xE9lgica"
    },
    {
      id: "int13",
      clubId: "int",
      name: "Rivillos",
      fullName: "Mario Rivillos Plaza",
      position: "ALA",
      number: 14,
      age: 36,
      nationality: "Espanha"
    },
    {
      id: "int14",
      clubId: "int",
      name: "Chaguinha",
      fullName: "Bruno Rocha Braga",
      position: "ALA",
      number: 5,
      age: 37,
      nationality: "Ge\xF3rgia"
    },
    {
      id: "int15",
      clubId: "int",
      name: "Cecilio",
      fullName: "Cecilio Morales Barbado",
      position: "ALA",
      number: 2,
      age: 33,
      nationality: "Espanha"
    },
    {
      id: "int16",
      clubId: "int",
      name: "J\xF3 Mahrez",
      fullName: "Joao Josemar Cambangula",
      position: "ALA",
      number: 12,
      age: 28,
      nationality: "Angola"
    },
    {
      id: "int17",
      clubId: "int",
      name: "Jes\xFAs Gordillo",
      fullName: "Jes\xFAs Garc\xEDa del Pino Gordillo",
      position: "PIV",
      number: 39,
      age: 25,
      nationality: "Espanha"
    },
    {
      id: "int18",
      clubId: "int",
      name: "Pirata",
      fullName: "Adri\xE1n Rodr\xEDguez Mosteir\xEDn",
      position: "PIV",
      number: 17,
      age: 26,
      nationality: "Espanha"
    },
    {
      id: "noi01",
      clubId: "noi",
      name: "I. Lopez",
      fullName: "Iago",
      position: "UNI",
      number: 12,
      age: 25,
      nationality: "Espanha",
      ageEstimated: true
    },
    {
      id: "noi02",
      clubId: "noi",
      name: "Di Fanti",
      fullName: "Adriano Jos\xE9 Fanti",
      position: "GR",
      number: 19,
      age: 37,
      nationality: "Brasil"
    },
    {
      id: "noi03",
      clubId: "noi",
      name: "Cristian",
      fullName: "Cristian Giraldo Rodr\xEDguez",
      position: "GR",
      number: 25,
      age: 2026,
      nationality: "Espanha"
    },
    {
      id: "noi04",
      clubId: "noi",
      name: "Peixe",
      fullName: "Evandro Rafagnin",
      position: "GR",
      number: 21,
      age: 28,
      nationality: "Brasil"
    },
    {
      id: "noi05",
      clubId: "noi",
      name: "Mosquera",
      fullName: "Ra\xFAl Mosquera Cardeso",
      position: "GR",
      number: 26,
      age: 18,
      nationality: "Espanha"
    },
    {
      id: "noi06",
      clubId: "noi",
      name: "Mykytiuk",
      fullName: "Mykola Mykytiuk",
      position: "FIX",
      number: 6,
      age: 29,
      nationality: "Ucr\xE2nia"
    },
    {
      id: "noi07",
      clubId: "noi",
      name: "Juampi Cuello",
      fullName: "Juan Pablo Cuello",
      position: "FIX",
      number: 14,
      age: 29,
      nationality: "Argentina"
    },
    {
      id: "noi08",
      clubId: "noi",
      name: "Montero",
      fullName: "David Montero Dom\xEDnguez",
      position: "FIX",
      number: 5,
      age: 24,
      nationality: "Espanha"
    },
    {
      id: "noi09",
      clubId: "noi",
      name: "O. Chenel",
      fullName: "Oliver Chenel Martinez",
      position: "ALA",
      number: 25,
      age: 25,
      nationality: "Espanha"
    },
    {
      id: "noi10",
      clubId: "noi",
      name: "Thierry",
      fullName: "Thierry Henrique Petra\xE7a",
      position: "ALA",
      number: 23,
      age: 21,
      nationality: "Brasil"
    },
    {
      id: "noi11",
      clubId: "noi",
      name: "Charly",
      fullName: "Carlos Cayado L\xF3pez",
      position: "ALA",
      number: 11,
      age: 24,
      nationality: "Espanha"
    },
    {
      id: "noi12",
      clubId: "noi",
      name: "Rubi",
      fullName: "Rub\xE9n Lemos Mari\xF1o",
      position: "ALA",
      number: 77,
      age: 38,
      nationality: "Espanha"
    },
    {
      id: "noi13",
      clubId: "noi",
      name: "David Pazos",
      fullName: "David Pazos Fuentes",
      position: "ALA",
      number: 20,
      age: 32,
      nationality: "Espanha"
    },
    {
      id: "noi14",
      clubId: "noi",
      name: "Altamirano",
      fullName: "Leandro Eduardo Altamirano",
      position: "ALA",
      number: 7,
      age: 26,
      nationality: "Argentina"
    },
    {
      id: "noi15",
      clubId: "noi",
      name: "Koeman",
      fullName: "Mateo V\xE1zquez Seoane",
      position: "ALA",
      number: 13,
      age: 18,
      nationality: "Espanha"
    },
    {
      id: "noi16",
      clubId: "noi",
      name: "Tiago Macedo",
      fullName: "Tiago Manuel Rodrigues Macedo",
      position: "ALA",
      number: 10,
      age: 21,
      nationality: "Portugal"
    },
    {
      id: "noi17",
      clubId: "noi",
      name: "Biel",
      fullName: "Gabriel Reis Cardoso",
      position: "PIV",
      number: 16,
      age: 30,
      nationality: "Brasil"
    },
    {
      id: "noi18",
      clubId: "noi",
      name: "Leozin",
      fullName: "Leonardo Mateus Periandro Calero Guida",
      position: "PIV",
      number: 9,
      age: 24,
      nationality: "Brasil"
    },
    {
      id: "noi19",
      clubId: "noi",
      name: "Dani Col\xF3n",
      fullName: "Daniel Colon Martin",
      position: "PIV",
      number: 22,
      age: 22,
      nationality: "Espanha"
    },
    {
      id: "noi20",
      clubId: "noi",
      name: "Ismael",
      fullName: "Ismael L\xF3pez Lozano",
      position: "PIV",
      number: 24,
      age: 26,
      nationality: "Espanha"
    },
    {
      id: "par01",
      clubId: "par",
      name: "G. Sanchez",
      fullName: "Gael",
      position: "PIV",
      number: 4,
      age: 25,
      nationality: "Espanha"
    },
    {
      id: "par02",
      clubId: "par",
      name: "A. Palaz\xF3n",
      fullName: "Alejandro Palaz\xF3n Gonz\xE1lez",
      position: "GR",
      number: 97,
      age: 23,
      nationality: "Espanha"
    },
    {
      id: "par03",
      clubId: "par",
      name: "Caio C\xE9sar",
      fullName: "Caio C\xE9sar De Paula Silva",
      position: "GR",
      number: 28,
      age: 26,
      nationality: "Brasil"
    },
    {
      id: "par04",
      clubId: "par",
      name: "Canoli",
      fullName: "David Barcon Lage",
      position: "GR",
      number: 1,
      age: 21,
      nationality: "Espanha"
    },
    {
      id: "par05",
      clubId: "par",
      name: "R. Orz\xE1ez",
      fullName: "Rub\xE9n Orz\xE1ez de la Cruz",
      position: "FIX",
      number: 19,
      age: 33,
      nationality: "Espanha"
    },
    {
      id: "par06",
      clubId: "par",
      name: "Lucas Farias",
      fullName: "Lucas Matheus Santos De Farias",
      position: "FIX",
      number: 5,
      age: 24,
      nationality: "Brasil"
    },
    {
      id: "par07",
      clubId: "par",
      name: "Quelle",
      fullName: "Jorge Quelle G\xF3mez",
      position: "FIX",
      number: 3,
      age: 23,
      nationality: "Espanha"
    },
    {
      id: "par08",
      clubId: "par",
      name: "Novoa",
      fullName: "David Novoa Del Hoyo",
      position: "ALA",
      number: 6,
      age: 24,
      nationality: "Espanha"
    },
    {
      id: "par09",
      clubId: "par",
      name: "Yan Matheus",
      fullName: "Yan Matheus De Deus",
      position: "ALA",
      number: 9,
      age: 30,
      nationality: "Brasil"
    },
    {
      id: "par10",
      clubId: "par",
      name: "Rikelme",
      fullName: "Rikelme Alves Ribeira",
      position: "ALA",
      number: 7,
      age: 24,
      nationality: "Brasil"
    },
    {
      id: "par11",
      clubId: "par",
      name: "Jhoy",
      fullName: "Jonathan Lucas Wartha Balbinot",
      position: "ALA",
      number: 12,
      age: 25,
      nationality: "Brasil"
    },
    {
      id: "par12",
      clubId: "par",
      name: "Diogo",
      fullName: "Diogo Da Rosa Schlemper",
      position: "ALA",
      number: 11,
      age: 31,
      nationality: "Brasil"
    },
    {
      id: "par13",
      clubId: "par",
      name: "Lucas Rodr\xEDguez",
      fullName: "Lucas Rodr\xEDguez Crespo",
      position: "ALA",
      number: 4,
      age: 25,
      nationality: "Espanha"
    },
    {
      id: "par14",
      clubId: "par",
      name: "Brayan",
      fullName: "Brayan Lucas Silva De Oliveira",
      position: "PIV",
      number: 23,
      age: 23,
      nationality: "Brasil"
    },
    {
      id: "par15",
      clubId: "par",
      name: "Malaguti",
      fullName: "Iv\xE1n De U\xF1a Feliz",
      position: "PIV",
      number: 96,
      age: 29,
      nationality: "Espanha"
    },
    {
      id: "par16",
      clubId: "par",
      name: "Turbi",
      fullName: "David Bouz\xF3n Doce",
      position: "PIV",
      number: 14,
      age: 22,
      nationality: "Espanha"
    },
    {
      id: "man01",
      clubId: "man",
      name: "Javi Bule",
      fullName: "Javier Fernandez Pacheco Serrano",
      position: "GR",
      number: 18,
      age: 18,
      nationality: "Espanha"
    },
    {
      id: "man02",
      clubId: "man",
      name: "Mario Cerezo",
      fullName: "Mario Cerezo C\xE1mara",
      position: "GR",
      number: 16,
      age: 18,
      nationality: "Espanha"
    },
    {
      id: "man03",
      clubId: "man",
      name: "Sch\xFCtt",
      fullName: "Vinicius Henrique Sch\xFCtt",
      position: "GR",
      number: 25,
      age: 28,
      nationality: "Brasil"
    },
    {
      id: "man04",
      clubId: "man",
      name: "Unai",
      fullName: "Unai Izquierdo Mondoruza",
      position: "FIX",
      number: 3,
      age: 18,
      nationality: "Espanha"
    },
    {
      id: "man05",
      clubId: "man",
      name: "Pablo Moreno",
      fullName: "Pablo Moreno Mazario",
      position: "FIX",
      number: 21,
      age: 23,
      nationality: "Espanha"
    },
    {
      id: "man06",
      clubId: "man",
      name: "Ribeir\xE2o",
      fullName: "Jhonata Julio De Oliveira Silva",
      position: "FIX",
      number: 5,
      age: 29,
      nationality: "Brasil"
    },
    {
      id: "man07",
      clubId: "man",
      name: "Povill",
      fullName: "Bernat Povill Cerdeira",
      position: "ALA",
      number: 2,
      age: 24,
      nationality: "Espanha"
    },
    {
      id: "man08",
      clubId: "man",
      name: "Aar\xF3n",
      fullName: "Aar\xF3n Canales Avenda\xF1o",
      position: "ALA",
      number: 20,
      age: 18,
      nationality: "Espanha"
    },
    {
      id: "man09",
      clubId: "man",
      name: "Alvaro L\xF3pez",
      fullName: "\xC1lvaro L\xF3pez Del Pino",
      position: "ALA",
      number: 11,
      age: 30,
      nationality: "Espanha"
    },
    {
      id: "man10",
      clubId: "man",
      name: "Humberto",
      fullName: "Humberto Ribeiro Resende",
      position: "ALA",
      number: 23,
      age: 33,
      nationality: "Brasil"
    },
    {
      id: "man11",
      clubId: "man",
      name: "Robles",
      fullName: "Pablo Robles Gastellut",
      position: "ALA",
      number: 8,
      age: 20,
      nationality: "Espanha"
    },
    {
      id: "man12",
      clubId: "man",
      name: "Eloy De Pablos",
      fullName: "Eloy De Pablos De Diego",
      position: "ALA",
      number: 70,
      age: 23,
      nationality: "Espanha"
    },
    {
      id: "man13",
      clubId: "man",
      name: "Anto\xF1ito",
      fullName: "Antonio Sierra Garc\xEDa",
      position: "ALA",
      number: 10,
      age: 35,
      nationality: "Espanha"
    },
    {
      id: "man14",
      clubId: "man",
      name: "Khalid",
      fullName: "Khalid Bouzid Stitou",
      position: "ALA",
      number: 22,
      age: 28,
      nationality: "Marrocos"
    },
    {
      id: "man15",
      clubId: "man",
      name: "Javi Alonso",
      fullName: "Javier Alonso Gim\xE9nez",
      position: "ALA",
      number: 7,
      age: 33,
      nationality: "Espanha"
    },
    {
      id: "man16",
      clubId: "man",
      name: "Yann",
      fullName: "Yann Barbosa Santana",
      position: "PIV",
      number: 13,
      age: 21,
      nationality: "Brasil"
    },
    {
      id: "man17",
      clubId: "man",
      name: "Leandrinho",
      fullName: "Leandro Ferreira Azevedo",
      position: "PIV",
      number: 14,
      age: 25,
      nationality: "Brasil"
    },
    {
      id: "man18",
      clubId: "man",
      name: "Valladares",
      fullName: "Carlos Valladares Gallego",
      position: "PIV",
      number: 77,
      age: 18,
      nationality: "Espanha"
    },
    {
      id: "man19",
      clubId: "man",
      name: "Daniel",
      fullName: "Daniel Gabriel Garc\xEDa",
      position: "PIV",
      number: 9,
      age: 29,
      nationality: "Espanha"
    },
    {
      id: "pen01",
      clubId: "pen",
      name: "Cervera",
      fullName: "Alejandro Cervera Agudelo",
      position: "GR",
      number: 28,
      age: 18,
      nationality: "Espanha"
    },
    {
      id: "pen02",
      clubId: "pen",
      name: "Gio",
      fullName: "Giovanni Miguel Gonz\xE1lez Vasquez",
      position: "GR",
      number: 12,
      age: 31,
      nationality: "Paraguai"
    },
    {
      id: "pen03",
      clubId: "pen",
      name: "Araya",
      fullName: "Bernardo Jes\xFAs Araya Ponce",
      position: "FIX",
      number: 16,
      age: 33,
      nationality: "Chile"
    },
    {
      id: "pen04",
      clubId: "pen",
      name: "Carlos Sanz",
      fullName: "Carlos Jos\xE9 Sanz Salcedo",
      position: "FIX",
      number: 2,
      age: 30,
      nationality: "Venezuela"
    },
    {
      id: "pen05",
      clubId: "pen",
      name: "El\xEDas",
      fullName: "El\xEDas Beltr\xE1n Fern\xE1ndez",
      position: "ALA",
      number: 18,
      age: 33,
      nationality: "Espanha"
    },
    {
      id: "pen06",
      clubId: "pen",
      name: "V. P\xE9rez",
      fullName: "V\xEDctor P\xE9rez Morales",
      position: "ALA",
      number: 14,
      age: 26,
      nationality: "Espanha"
    },
    {
      id: "pen07",
      clubId: "pen",
      name: "C. Saladie",
      fullName: "Carles Saladi\xE9 Borr\xE0s",
      position: "ALA",
      number: 11,
      age: 25,
      nationality: "Espanha"
    },
    {
      id: "pen08",
      clubId: "pen",
      name: "Pablo Mu\xF1oz",
      fullName: "Pablo Mu\xF1oz Moya",
      position: "ALA",
      number: 10,
      age: 22,
      nationality: "Espanha"
    },
    {
      id: "pen09",
      clubId: "pen",
      name: "Puchy",
      fullName: "Marc Puigvert Esteve",
      position: "ALA",
      number: 32,
      age: 23,
      nationality: "Espanha"
    },
    {
      id: "pen10",
      clubId: "pen",
      name: "Quintela",
      fullName: "Diego Quintela Carril",
      position: "ALA",
      number: 23,
      age: 34,
      nationality: "Espanha"
    },
    {
      id: "pen11",
      clubId: "pen",
      name: "B. Barea",
      fullName: "Bruno Barea Llora",
      position: "ALA",
      number: 17,
      age: 17,
      nationality: "Espanha"
    },
    {
      id: "pen12",
      clubId: "pen",
      name: "Pablo",
      fullName: "Pablo Garc\xEDa Escuder",
      position: "PIV",
      number: 7,
      age: 25,
      nationality: "Espanha"
    },
    {
      id: "pen13",
      clubId: "pen",
      name: "Yunii",
      fullName: "Youness Marksi Tabakkouyat",
      position: "PIV",
      number: 9,
      age: 24,
      nationality: "Marrocos"
    },
    {
      id: "pen14",
      clubId: "pen",
      name: "Diego Sancho",
      fullName: "Diego Sancho Bonet",
      position: "PIV",
      number: 20,
      age: 27,
      nationality: "Espanha"
    },
    {
      id: "val01",
      clubId: "val",
      name: "Pato",
      fullName: "Vitor Springer",
      position: "GR",
      number: 25,
      age: 22,
      nationality: "Brasil"
    },
    {
      id: "val02",
      clubId: "val",
      name: "Borja Puerta",
      fullName: "Borja Puerta S\xE1nchez",
      position: "GR",
      number: 1,
      age: 26,
      nationality: "Espanha"
    },
    {
      id: "val03",
      clubId: "val",
      name: "Alberto",
      fullName: "Alberto Garc\xEDa Delgado",
      position: "FIX",
      number: 6,
      age: 28,
      nationality: "Espanha"
    },
    {
      id: "val04",
      clubId: "val",
      name: "Joao Silveira",
      fullName: "Joao Victor C\xE9sar Ferreira da Silva",
      position: "FIX",
      number: 8,
      age: 24,
      nationality: "Brasil"
    },
    {
      id: "val05",
      clubId: "val",
      name: "Tapias",
      fullName: "Adri\xE1n Tapias Villalba",
      position: "FIX",
      number: 17,
      age: 22,
      nationality: "Espanha"
    },
    {
      id: "val06",
      clubId: "val",
      name: "C. Bartolom\xE9",
      fullName: "Carlos Bartolom\xE9 Garc\xEDa",
      position: "ALA",
      number: 20,
      age: 27,
      nationality: "Espanha"
    },
    {
      id: "val07",
      clubId: "val",
      name: "Y\xE1\xF1ez",
      fullName: "Lautaro Dami\xE1n Y\xE1\xF1ez",
      position: "ALA",
      number: 19,
      age: 22,
      nationality: "Argentina"
    },
    {
      id: "val08",
      clubId: "val",
      name: "Alex Fonseca",
      fullName: "Alex Gabryel Valentim Fonseca",
      position: "ALA",
      number: 10,
      age: 22,
      nationality: "Brasil"
    },
    {
      id: "val09",
      clubId: "val",
      name: "Torres",
      fullName: "Mateus Torres Do Reis",
      position: "ALA",
      number: 61,
      age: 28,
      nationality: "Brasil"
    },
    {
      id: "val10",
      clubId: "val",
      name: "Jos\xE9 Mario",
      fullName: "Jose Mario Cuenca Miranda",
      position: "ALA",
      number: 2,
      age: 27,
      nationality: "Espanha"
    },
    {
      id: "val11",
      clubId: "val",
      name: "\xC1lex Naranjo",
      fullName: "Alejandro Naranjo Lerma",
      position: "ALA",
      number: 16,
      age: 24,
      nationality: "Espanha"
    },
    {
      id: "val12",
      clubId: "val",
      name: "Pablo Otero",
      fullName: "Pablo Otero Trechera",
      position: "ALA",
      number: 21,
      age: 24,
      nationality: "Espanha"
    },
    {
      id: "val13",
      clubId: "val",
      name: "\xC1lvarez",
      fullName: "Rodrigo \xC1lvarez",
      position: "ALA",
      number: 11,
      age: 21,
      nationality: "Argentina"
    },
    {
      id: "val14",
      clubId: "val",
      name: "Carrasco",
      fullName: "Jorge Carrasco Garc\xEDa",
      position: "PIV",
      number: 7,
      age: 23,
      nationality: "Espanha"
    },
    {
      id: "val15",
      clubId: "val",
      name: "Juanan",
      fullName: "Juan Antonio Moraleja Ruiz",
      position: "PIV",
      number: 77,
      age: 25,
      nationality: "Espanha"
    },
    {
      id: "val16",
      clubId: "val",
      name: "Nicol\xE1s",
      fullName: "Nicol\xE1s Marr\xF3n Bleda",
      position: "PIV",
      number: 9,
      age: 24,
      nationality: "Espanha"
    },
    {
      id: "zar01",
      clubId: "zar",
      name: "Iv\xE1n Bernad",
      fullName: "Iv\xE1n Bernad Calavia",
      position: "GR",
      number: 25,
      age: 31,
      nationality: "Espanha"
    },
    {
      id: "zar02",
      clubId: "zar",
      name: "Jackson",
      fullName: "Jakcson Sant'Anna",
      position: "GR",
      number: 2,
      age: 23,
      nationality: "Brasil"
    },
    {
      id: "zar03",
      clubId: "zar",
      name: "H. Campo",
      fullName: "Hector Campo Martinez",
      position: "GR",
      number: 25,
      age: 25,
      nationality: "Espanha"
    },
    {
      id: "zar04",
      clubId: "zar",
      name: "B. Aibar",
      fullName: "Benjamin Aibar Soria",
      position: "GR",
      number: 25,
      age: 25,
      nationality: "Espanha"
    },
    {
      id: "zar05",
      clubId: "zar",
      name: "S. Hernando",
      fullName: "Sergio Hernando Lalaguna",
      position: "GR",
      number: 1,
      age: 25,
      nationality: "Espanha"
    },
    {
      id: "zar06",
      clubId: "zar",
      name: "\xD3scar Vllanueva",
      fullName: "\xD3scar Villanueva Guerrero",
      position: "FIX",
      number: 4,
      age: 30,
      nationality: "Espanha"
    },
    {
      id: "zar07",
      clubId: "zar",
      name: "Adri Ortego",
      fullName: "Adri\xE1n Ortego L\xF3pez",
      position: "FIX",
      number: 24,
      age: 32,
      nationality: "Espanha"
    },
    {
      id: "zar08",
      clubId: "zar",
      name: "Xuxu",
      fullName: "Igor Martins Cavalcante",
      position: "FIX",
      number: 7,
      age: 24,
      nationality: "Brasil"
    },
    {
      id: "zar09",
      clubId: "zar",
      name: "Quique Hernando",
      fullName: "Enrique Hernando Polo",
      position: "FIX",
      number: 9,
      age: 27,
      nationality: "Espanha"
    },
    {
      id: "zar10",
      clubId: "zar",
      name: "Ra\xFAl L\xF3pez",
      fullName: "Ra\xFAl L\xF3pez Rivas",
      position: "ALA",
      number: 10,
      age: 24,
      nationality: "Espanha"
    },
    {
      id: "zar11",
      clubId: "zar",
      name: "Alegre",
      fullName: "Iv\xE1n Joel Alegre",
      position: "ALA",
      number: 3,
      age: 24,
      nationality: "Argentina"
    },
    {
      id: "zar12",
      clubId: "zar",
      name: "C\xE9lio Coque",
      fullName: "C\xE9lio Alexandre Veiga Coque",
      position: "ALA",
      number: 28,
      age: 26,
      nationality: "Portugal"
    },
    {
      id: "zar13",
      clubId: "zar",
      name: "Brasesco",
      fullName: "Juan Bautista Saldivia Brasesco",
      position: "ALA",
      number: 5,
      age: 28,
      nationality: "Argentina"
    },
    {
      id: "zar14",
      clubId: "zar",
      name: "Oilhaborda",
      fullName: "Santino Oilhaborda Zachar",
      position: "ALA",
      number: 15,
      age: 22,
      nationality: "Argentina"
    },
    {
      id: "zar15",
      clubId: "zar",
      name: "M. Perez",
      fullName: "Mikel Perez Monfort",
      position: "ALA",
      number: 11,
      age: 25,
      nationality: "Espanha"
    },
    {
      id: "zar16",
      clubId: "zar",
      name: "Kike Liao",
      fullName: "Enrique Liao Qiu",
      position: "ALA",
      number: 16,
      age: 20,
      nationality: "Espanha"
    },
    {
      id: "zar17",
      clubId: "zar",
      name: "Joserru",
      fullName: "Jose Ruben Mendive Iguacel",
      position: "ALA",
      number: 9,
      age: 19,
      nationality: "Espanha"
    },
    {
      id: "zar18",
      clubId: "zar",
      name: "Miguel",
      fullName: "Miguel Lahoz Baquero",
      position: "ALA",
      number: 11,
      age: 20,
      nationality: "Espanha"
    },
    {
      id: "zar19",
      clubId: "zar",
      name: "Augusto",
      fullName: "Augusto Javier Van De Casteele Bail\xF3n",
      position: "PIV",
      number: 18,
      age: 28,
      nationality: "Argentina"
    },
    {
      id: "zar20",
      clubId: "zar",
      name: "Richi Felipe",
      fullName: "Ricardo Felipe P\xE9rez",
      position: "PIV",
      number: 8,
      age: 34,
      nationality: "Espanha"
    },
    {
      id: "zar21",
      clubId: "zar",
      name: "Samu Freire",
      fullName: "Samuel Da Costa Freire",
      position: "PIV",
      number: 33,
      age: 24,
      nationality: "Brasil"
    }
  ]
};

// src/data/esp/fpstats.json
var fpstats_default2 = {
  _info: "Liga Prime Futsal 2026/27: planteis da RFEF (futsal.rfef.es) + historial do futsalportugal.com (recolha 2/11/2026, 1 p\xE1gina a cada 7 s). Jogos, cart\xF5es e golos por \xE9poca desde 2021/22; t\xEDtulos.",
  players: {
    bar01: {
      fpId: 799,
      games: 207,
      yellow: 6,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "FC Barcelona",
          games: 11,
          goals: 0
        },
        {
          s: "25",
          team: "FC Barcelona",
          games: 40,
          goals: 1
        },
        {
          s: "24",
          team: "FC Barcelona",
          games: 26,
          goals: 0
        },
        {
          s: "23",
          team: "FC Barcelona",
          games: 36,
          goals: 1
        },
        {
          s: "22",
          team: "FC Barcelona",
          games: 51,
          goals: 1
        },
        {
          s: "21",
          team: "FC Barcelona",
          games: 43,
          goals: 1
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2020/2021, 2021/2022, 2022/2023, 2025/2026)",
        "UEFA Futsal Champions League (2019/2020, 2021/2022)",
        "Supercopa Espa\xF1a  (2021/2022, 2022/2023)",
        "Copa de Espa\xF1a (2022/2023)"
      ]
    },
    bar02: {
      fpId: 700,
      games: 220,
      yellow: 15,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "FC Barcelona",
          games: 11,
          goals: 0
        },
        {
          s: "25",
          team: "FC Barcelona",
          games: 39,
          goals: 1
        },
        {
          s: "24",
          team: "FC Barcelona",
          games: 36,
          goals: 1
        },
        {
          s: "23",
          team: "FC Barcelona",
          games: 46,
          goals: 0
        },
        {
          s: "22",
          team: "FC Barcelona",
          games: 43,
          goals: 0
        },
        {
          s: "21",
          team: "FC Barcelona",
          games: 45,
          goals: 3
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2018/2019, 2020/2021, 2021/2022, 2022/2023, 2025/2026)",
        "Copa de Espa\xF1a (2018/2019, 2019/2020, 2022/2023)",
        "UEFA Futsal Champions League (2019/2020, 2021/2022)",
        "Supercopa Espa\xF1a  (2021/2022, 2022/2023)",
        "Campeonato da Europa (2025/2026)"
      ]
    },
    bar03: {
      fpId: 4880,
      games: 78,
      yellow: 14,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "FC Barcelona",
          games: 11,
          goals: 2
        },
        {
          s: "25",
          team: "Etoile Lavalloise",
          games: 9,
          goals: 9
        },
        {
          s: "24",
          team: "Jimbee Cartagena FS",
          games: 44,
          goals: 9
        },
        {
          s: "23",
          team: "Etoile Lavalloise",
          games: 6,
          goals: 4
        },
        {
          s: "21",
          team: "ACCS",
          games: 8,
          goals: 4
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2024/2025)"
      ]
    },
    bar04: {
      fpId: 11072,
      games: 213,
      yellow: 38,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "FC Barcelona",
          games: 11,
          goals: 4
        },
        {
          s: "25",
          team: "FC Barcelona",
          games: 36,
          goals: 14
        },
        {
          s: "24",
          team: "FC Barcelona",
          games: 39,
          goals: 24
        },
        {
          s: "23",
          team: "FC Barcelona",
          games: 48,
          goals: 7
        },
        {
          s: "22",
          team: "FC Barcelona",
          games: 45,
          goals: 7
        },
        {
          s: "21",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 34,
          goals: 8
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2022/2023, 2025/2026)",
        "Campeonato Europa Sub 19 (2019/2020)",
        "Montaigu Futsal Cup (2019/2020)",
        "Copa de Espa\xF1a (2022/2023)",
        "Supercopa Espa\xF1a  (2022/2023)",
        "Campeonato da Europa (2025/2026)"
      ]
    },
    bar05: {
      fpId: 5478,
      games: 131,
      yellow: 32,
      red: 5,
      seasons: [
        {
          s: "26",
          team: "FC Barcelona",
          games: 11,
          goals: 3
        },
        {
          s: "25",
          team: "FC Barcelona",
          games: 37,
          goals: 13
        },
        {
          s: "24",
          team: "Islas Baleares Palma Futsal",
          games: 39,
          goals: 14
        },
        {
          s: "23",
          team: "Islas Baleares Palma Futsal",
          games: 17,
          goals: 8
        },
        {
          s: "22",
          team: "Noia Portus Apostoli",
          games: 7,
          goals: 3
        },
        {
          s: "21",
          team: "Islas Baleares Palma Futsal",
          games: 20,
          goals: 3
        }
      ],
      titles: [
        "UEFA Futsal Champions League (2023/2024, 2024/2025)",
        "LNF (2018/2019)",
        "Campeonato do Mundo (2024/2025)",
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2025/2026)"
      ]
    },
    bar06: {
      fpId: 29076,
      games: 12,
      yellow: 2,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "FC Barcelona",
          games: 4,
          goals: 1
        },
        {
          s: "25",
          team: "FC Barcelona",
          games: 8,
          goals: 0
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2025/2026)"
      ]
    },
    bar07: {
      fpId: 5528,
      games: 198,
      yellow: 27,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "FC Barcelona",
          games: 5,
          goals: 2
        },
        {
          s: "25",
          team: "FC Barcelona",
          games: 40,
          goals: 20
        },
        {
          s: "24",
          team: "FC Barcelona",
          games: 40,
          goals: 7
        },
        {
          s: "23",
          team: "FC Barcelona",
          games: 36,
          goals: 10
        },
        {
          s: "22",
          team: "FC Barcelona",
          games: 40,
          goals: 25
        },
        {
          s: "21",
          team: "FC Barcelona",
          games: 37,
          goals: 15
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2020/2021, 2021/2022, 2022/2023, 2025/2026)",
        "UEFA Futsal Champions League (2019/2020, 2021/2022)",
        "Copa de Espa\xF1a (2022/2023)"
      ]
    },
    bar08: {
      fpId: 682,
      games: 194,
      yellow: 38,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "FC Barcelona",
          games: 11,
          goals: 4
        },
        {
          s: "25",
          team: "FC Barcelona",
          games: 40,
          goals: 16
        },
        {
          s: "24",
          team: "FC Barcelona",
          games: 39,
          goals: 12
        },
        {
          s: "23",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 33,
          goals: 10
        },
        {
          s: "22",
          team: "Inter FS",
          games: 40,
          goals: 20
        },
        {
          s: "21",
          team: "Inter FS",
          games: 31,
          goals: 12
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2010/2011, 2011/2012, 2012/2013, 2025/2026)",
        "Copa de Espa\xF1a (2020/2021, 2020/2021, 2020/2021)",
        "UEFA Futsal Champions League (2011/2012)",
        "Supercopa Espa\xF1a  (2020/2021)"
      ]
    },
    bar09: {
      fpId: 58802,
      games: 7,
      yellow: 1,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "FC Barcelona",
          games: 7,
          goals: 4
        }
      ],
      titles: []
    },
    bar10: {
      fpId: 692,
      games: 156,
      yellow: 42,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "FC Barcelona",
          games: 11,
          goals: 4
        },
        {
          s: "25",
          team: "FC Barcelona",
          games: 22,
          goals: 8
        },
        {
          s: "24",
          team: "FC Barcelona",
          games: 21,
          goals: 11
        },
        {
          s: "23",
          team: "FC Barcelona",
          games: 40,
          goals: 24
        },
        {
          s: "22",
          team: "FC Barcelona",
          games: 49,
          goals: 18
        },
        {
          s: "21",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 13,
          goals: 7
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2022/2023, 2025/2026)",
        "Copa de Espa\xF1a (2022/2023)",
        "Supercopa Espa\xF1a  (2022/2023)"
      ]
    },
    bar11: {
      fpId: 27583,
      games: 5,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "FC Barcelona",
          games: 3,
          goals: 0
        },
        {
          s: "24",
          team: "Real Betis Futsal",
          games: 2,
          goals: 0
        }
      ],
      titles: []
    },
    bar12: {
      fpId: 54537,
      games: 135,
      yellow: 12,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "FC Barcelona",
          games: 11,
          goals: 2
        },
        {
          s: "25",
          team: "FC Barcelona",
          games: 39,
          goals: 10
        },
        {
          s: "24",
          team: "FC Barcelona",
          games: 37,
          goals: 6
        },
        {
          s: "23",
          team: "FC Barcelona",
          games: 37,
          goals: 7
        },
        {
          s: "22",
          team: "FC Barcelona",
          games: 4,
          goals: 0
        },
        {
          s: "21",
          team: "ACCS",
          games: 7,
          goals: 4
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2022/2023, 2025/2026)"
      ]
    },
    bar13: {
      fpId: 23663,
      games: 105,
      yellow: 15,
      red: 1,
      seasons: [
        {
          s: "25",
          team: "FC Barcelona",
          games: 38,
          goals: 8
        },
        {
          s: "24",
          team: "Pe\xF1\xEDscola FS",
          games: 36,
          goals: 19
        },
        {
          s: "23",
          team: "Pe\xF1\xEDscola FS",
          games: 30,
          goals: 5
        },
        {
          s: "22",
          team: "Pe\xF1\xEDscola FS",
          games: 1,
          goals: 0
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2025/2026)"
      ]
    },
    bar14: {
      fpId: 469,
      games: 197,
      yellow: 14,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "FC Barcelona",
          games: 11,
          goals: 13
        },
        {
          s: "25",
          team: "FC Barcelona",
          games: 26,
          goals: 16
        },
        {
          s: "24",
          team: "FC Barcelona",
          games: 25,
          goals: 9
        },
        {
          s: "23",
          team: "FC Barcelona",
          games: 40,
          goals: 22
        },
        {
          s: "22",
          team: "FC Barcelona",
          games: 48,
          goals: 26
        },
        {
          s: "21",
          team: "FC Barcelona",
          games: 47,
          goals: 24
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2018/2019, 2020/2021, 2021/2022, 2022/2023, 2025/2026)",
        "Copa de Espa\xF1a (2017/2018, 2018/2019, 2019/2020, 2022/2023)",
        "Supercopa Espa\xF1a  (2019/2020, 2021/2022, 2022/2023)",
        "UEFA Futsal Champions League (2019/2020, 2021/2022)",
        "Campeonato da Europa (2025/2026)"
      ]
    },
    bar15: {
      fpId: 621,
      games: 167,
      yellow: 27,
      red: 3,
      seasons: [
        {
          s: "26",
          team: "FC Barcelona",
          games: 10,
          goals: 7
        },
        {
          s: "25",
          team: "FC Barcelona",
          games: 33,
          goals: 16
        },
        {
          s: "24",
          team: "FC Barcelona",
          games: 23,
          goals: 16
        },
        {
          s: "23",
          team: "FC Barcelona",
          games: 20,
          goals: 10
        },
        {
          s: "22",
          team: "FC Barcelona",
          games: 50,
          goals: 32
        },
        {
          s: "21",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 31,
          goals: 17
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2022/2023, 2025/2026)",
        "Copa de Espa\xF1a (2022/2023)",
        "Supercopa Espa\xF1a  (2022/2023)"
      ]
    },
    bar16: {
      fpId: 754,
      games: 190,
      yellow: 49,
      red: 4,
      seasons: [
        {
          s: "26",
          team: "FC Barcelona",
          games: 8,
          goals: 10
        },
        {
          s: "25",
          team: "FC Barcelona",
          games: 38,
          goals: 34
        },
        {
          s: "24",
          team: "FC Barcelona",
          games: 27,
          goals: 15
        },
        {
          s: "23",
          team: "FC Barcelona",
          games: 36,
          goals: 30
        },
        {
          s: "22",
          team: "FC Barcelona",
          games: 43,
          goals: 26
        },
        {
          s: "21",
          team: "FC Barcelona",
          games: 38,
          goals: 22
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2019/2020, 2021/2022, 2022/2023, 2025/2026)",
        "Copa de Espa\xF1a (2020/2021, 2020/2021, 2020/2021, 2022/2023)",
        "Supercopa Espa\xF1a  (2020/2021, 2021/2022, 2022/2023)",
        "UEFA Futsal Champions League (2021/2022)",
        "Campeonato do Mundo (2024/2025)",
        "Copa Am\xE9rica (2025/2026)"
      ]
    },
    bar17: {
      fpId: 15227,
      games: 167,
      yellow: 29,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "FC Barcelona",
          games: 11,
          goals: 8
        },
        {
          s: "25",
          team: "SL Benfica",
          games: 43,
          goals: 20
        },
        {
          s: "24",
          team: "SL Benfica",
          games: 38,
          goals: 22
        },
        {
          s: "23",
          team: "SL Benfica",
          games: 39,
          goals: 18
        },
        {
          s: "22",
          team: "SL Benfica",
          games: 4,
          goals: 0
        },
        {
          s: "22",
          team: "Islas Baleares Palma Futsal",
          games: 2,
          goals: 0
        },
        {
          s: "21",
          team: "Islas Baleares Palma Futsal",
          games: 30,
          goals: 18
        }
      ],
      titles: [
        "Liga Placard (2024/2025, 2025/2026)",
        "Superta\xE7a (2023/2024)",
        "Ta\xE7a da Liga (2025/2026)",
        "Ta\xE7a de Portugal (2025/2026)"
      ]
    },
    cor01: {
      fpId: 741,
      games: 153,
      yellow: 16,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "C\xF3rdoba Patrimonio",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "C\xF3rdoba Patrimonio",
          games: 30,
          goals: 1
        },
        {
          s: "24",
          team: "C\xF3rdoba Patrimonio",
          games: 22,
          goals: 0
        },
        {
          s: "23",
          team: "C\xF3rdoba Patrimonio",
          games: 29,
          goals: 2
        },
        {
          s: "22",
          team: "C\xF3rdoba Patrimonio",
          games: 29,
          goals: 1
        },
        {
          s: "21",
          team: "Islas Baleares Palma Futsal",
          games: 36,
          goals: 1
        }
      ],
      titles: []
    },
    cor02: {
      fpId: 66382,
      games: 0,
      yellow: 0,
      red: 0,
      seasons: [],
      titles: []
    },
    cor03: {
      fpId: 22941,
      games: 102,
      yellow: 6,
      red: 3,
      seasons: [
        {
          s: "26",
          team: "C\xF3rdoba Patrimonio",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "C\xF3rdoba Patrimonio",
          games: 28,
          goals: 2
        },
        {
          s: "24",
          team: "C\xF3rdoba Patrimonio",
          games: 27,
          goals: 0
        },
        {
          s: "23",
          team: "C\xF3rdoba Patrimonio",
          games: 29,
          goals: 0
        },
        {
          s: "22",
          team: "C\xF3rdoba Patrimonio",
          games: 10,
          goals: 0
        },
        {
          s: "21",
          team: "C\xF3rdoba Patrimonio",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    cor04: {
      fpId: 26400,
      games: 52,
      yellow: 5,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "C\xF3rdoba Patrimonio",
          games: 7,
          goals: 1
        },
        {
          s: "25",
          team: "C\xF3rdoba Patrimonio",
          games: 29,
          goals: 5
        },
        {
          s: "24",
          team: "C\xF3rdoba Patrimonio",
          games: 16,
          goals: 1
        }
      ],
      titles: []
    },
    cor05: {
      fpId: 15872,
      games: 144,
      yellow: 44,
      red: 4,
      seasons: [
        {
          s: "26",
          team: "C\xF3rdoba Patrimonio",
          games: 6,
          goals: 1
        },
        {
          s: "25",
          team: "C\xF3rdoba Patrimonio",
          games: 30,
          goals: 15
        },
        {
          s: "24",
          team: "C\xF3rdoba Patrimonio",
          games: 30,
          goals: 11
        },
        {
          s: "23",
          team: "CRC Quinta dos Lombos",
          games: 15,
          goals: 7
        },
        {
          s: "22",
          team: "CRC Quinta dos Lombos",
          games: 28,
          goals: 9
        },
        {
          s: "21",
          team: "CRC Quinta dos Lombos",
          games: 17,
          goals: 6
        },
        {
          s: "21",
          team: "ACCS",
          games: 6,
          goals: 1
        },
        {
          s: "21",
          team: "Foz Cataratas Futsal",
          games: 12,
          goals: 5
        }
      ],
      titles: []
    },
    cor06: {
      fpId: 14390,
      games: 87,
      yellow: 27,
      red: 5,
      seasons: [
        {
          s: "26",
          team: "C\xF3rdoba Patrimonio",
          games: 6,
          goals: 2
        },
        {
          s: "24",
          team: "Royal Sporting Anderlecht Futsal",
          games: 5,
          goals: 2
        },
        {
          s: "23",
          team: "C\xF3rdoba Patrimonio",
          games: 26,
          goals: 16
        },
        {
          s: "22",
          team: "C\xF3rdoba Patrimonio",
          games: 22,
          goals: 6
        },
        {
          s: "21",
          team: "C\xF3rdoba Patrimonio",
          games: 28,
          goals: 9
        }
      ],
      titles: []
    },
    cor07: {
      fpId: 13849,
      games: 123,
      yellow: 27,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "C\xF3rdoba Patrimonio",
          games: 7,
          goals: 4
        },
        {
          s: "25",
          team: "Alzira FS",
          games: 29,
          goals: 11
        },
        {
          s: "23",
          team: "Real Betis Futsal",
          games: 23,
          goals: 6
        },
        {
          s: "22",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 30,
          goals: 8
        },
        {
          s: "21",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 20,
          goals: 7
        },
        {
          s: "21",
          team: "Real Betis Futsal",
          games: 14,
          goals: 6
        }
      ],
      titles: []
    },
    cor08: {
      fpId: 679,
      games: 38,
      yellow: 12,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "C\xF3rdoba Patrimonio",
          games: 6,
          goals: 0
        },
        {
          s: "22",
          team: "BeSoccer CD UMA Antequera",
          games: 32,
          goals: 3
        }
      ],
      titles: []
    },
    cor09: {
      fpId: 66383,
      games: 4,
      yellow: 2,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "C\xF3rdoba Patrimonio",
          games: 4,
          goals: 1
        }
      ],
      titles: []
    },
    cor10: {
      fpId: 27642,
      games: 53,
      yellow: 6,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "C\xF3rdoba Patrimonio",
          games: 7,
          goals: 1
        },
        {
          s: "25",
          team: "C\xF3rdoba Patrimonio",
          games: 30,
          goals: 4
        },
        {
          s: "24",
          team: "C\xF3rdoba Patrimonio",
          games: 16,
          goals: 6
        }
      ],
      titles: []
    },
    cor11: {
      fpId: 21206,
      games: 97,
      yellow: 16,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "C\xF3rdoba Patrimonio",
          games: 5,
          goals: 0
        },
        {
          s: "25",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 7,
          goals: 0
        },
        {
          s: "24",
          team: "Inter FS",
          games: 31,
          goals: 5
        },
        {
          s: "23",
          team: "Inter FS",
          games: 28,
          goals: 4
        },
        {
          s: "22",
          team: "BeSoccer CD UMA Antequera",
          games: 26,
          goals: 7
        }
      ],
      titles: [
        "Copa de Espa\xF1a (2024/2025, 2024/2025)",
        "Campeonato Europa Sub 19 (2022/2023)"
      ]
    },
    cor12: {
      fpId: 27183,
      games: 5,
      yellow: 1,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "C\xF3rdoba Patrimonio",
          games: 4,
          goals: 0
        },
        {
          s: "24",
          team: "C\xF3rdoba Patrimonio",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    cor13: {
      fpId: 1700,
      games: 147,
      yellow: 66,
      red: 3,
      seasons: [
        {
          s: "26",
          team: "C\xF3rdoba Patrimonio",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "C\xF3rdoba Patrimonio",
          games: 30,
          goals: 7
        },
        {
          s: "24",
          team: "Quesos El Higaldo Manzanares FS",
          games: 28,
          goals: 5
        },
        {
          s: "23",
          team: "C\xF3rdoba Patrimonio",
          games: 26,
          goals: 15
        },
        {
          s: "22",
          team: "C\xF3rdoba Patrimonio",
          games: 28,
          goals: 8
        },
        {
          s: "21",
          team: "C\xF3rdoba Patrimonio",
          games: 29,
          goals: 14
        }
      ],
      titles: []
    },
    cor14: {
      fpId: 27061,
      games: 40,
      yellow: 2,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "C\xF3rdoba Patrimonio",
          games: 4,
          goals: 0
        },
        {
          s: "25",
          team: "C\xF3rdoba Patrimonio",
          games: 21,
          goals: 4
        },
        {
          s: "24",
          team: "C\xF3rdoba Patrimonio",
          games: 15,
          goals: 2
        }
      ],
      titles: []
    },
    cor15: {
      fpId: 27961,
      games: 23,
      yellow: 2,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "C\xF3rdoba Patrimonio",
          games: 4,
          goals: 1
        },
        {
          s: "25",
          team: "C\xF3rdoba Patrimonio",
          games: 19,
          goals: 1
        }
      ],
      titles: []
    },
    cor16: {
      fpId: 25395,
      games: 12,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "C\xF3rdoba Patrimonio",
          games: 4,
          goals: 0
        },
        {
          s: "23",
          team: "Jimbee Cartagena FS",
          games: 8,
          goals: 0
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2023/2024)",
        "Supercopa Espa\xF1a  (2023/2024)"
      ]
    },
    cor17: {
      fpId: 6851,
      games: 20,
      yellow: 2,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "C\xF3rdoba Patrimonio",
          games: 6,
          goals: 1
        },
        {
          s: "25",
          team: "Alzira FS",
          games: 14,
          goals: 1
        }
      ],
      titles: []
    },
    cor18: {
      fpId: 27151,
      games: 17,
      yellow: 2,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "C\xF3rdoba Patrimonio",
          games: 7,
          goals: 4
        },
        {
          s: "24",
          team: "ElPozo Murcia",
          games: 10,
          goals: 0
        }
      ],
      titles: []
    },
    epz01: {
      fpId: 675,
      games: 183,
      yellow: 27,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "ElPozo Murcia",
          games: 4,
          goals: 0
        },
        {
          s: "25",
          team: "ElPozo Murcia",
          games: 40,
          goals: 1
        },
        {
          s: "24",
          team: "ElPozo Murcia",
          games: 34,
          goals: 0
        },
        {
          s: "23",
          team: "ElPozo Murcia",
          games: 40,
          goals: 2
        },
        {
          s: "22",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 30,
          goals: 1
        },
        {
          s: "21",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 35,
          goals: 1
        }
      ],
      titles: [
        "Campeonato da Europa (2021/2022)",
        "Final\xEDssima (2022/2023)"
      ]
    },
    epz02: {
      fpId: 11128,
      games: 143,
      yellow: 28,
      red: 3,
      seasons: [
        {
          s: "26",
          team: "ElPozo Murcia",
          games: 12,
          goals: 1
        },
        {
          s: "25",
          team: "Quesos El Higaldo Manzanares FS",
          games: 33,
          goals: 0
        },
        {
          s: "24",
          team: "Quesos El Higaldo Manzanares FS",
          games: 17,
          goals: 1
        },
        {
          s: "23",
          team: "Quesos El Higaldo Manzanares FS",
          games: 33,
          goals: 2
        },
        {
          s: "22",
          team: "Quesos El Higaldo Manzanares FS",
          games: 28,
          goals: 1
        },
        {
          s: "21",
          team: "Quesos El Higaldo Manzanares FS",
          games: 15,
          goals: 1
        },
        {
          s: "21",
          team: "ElPozo Murcia",
          games: 5,
          goals: 0
        }
      ],
      titles: [
        "Campeonato Europa Sub 19 (2019/2020)",
        "Montaigu Futsal Cup (2019/2020)",
        "Supercopa Espa\xF1a  (2026/2027)"
      ]
    },
    epz03: {
      fpId: 27744,
      games: 13,
      yellow: 1,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "ElPozo Murcia",
          games: 8,
          goals: 0
        },
        {
          s: "24",
          team: "ElPozo Murcia",
          games: 5,
          goals: 0
        }
      ],
      titles: [
        "Supercopa Espa\xF1a  (2026/2027)"
      ]
    },
    epz04: {
      fpId: 13125,
      games: 189,
      yellow: 22,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "ElPozo Murcia",
          games: 12,
          goals: 1
        },
        {
          s: "25",
          team: "ElPozo Murcia",
          games: 38,
          goals: 9
        },
        {
          s: "24",
          team: "ElPozo Murcia",
          games: 36,
          goals: 13
        },
        {
          s: "23",
          team: "ElPozo Murcia",
          games: 42,
          goals: 3
        },
        {
          s: "22",
          team: "ElPozo Murcia",
          games: 34,
          goals: 6
        },
        {
          s: "21",
          team: "C\xF3rdoba Patrimonio",
          games: 27,
          goals: 7
        }
      ],
      titles: [
        "Campeonato do Mundo (2000/2001)",
        "Campeonato Europa Sub 19 (2019/2020)",
        "Montaigu Futsal Cup (2019/2020)",
        "Campeonato da Europa (2025/2026)",
        "Supercopa Espa\xF1a  (2026/2027)"
      ]
    },
    epz05: {
      fpId: 66393,
      games: 1,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "ElPozo Murcia",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    epz06: {
      fpId: 476,
      games: 180,
      yellow: 36,
      red: 5,
      seasons: [
        {
          s: "26",
          team: "ElPozo Murcia",
          games: 8,
          goals: 2
        },
        {
          s: "25",
          team: "ElPozo Murcia",
          games: 35,
          goals: 12
        },
        {
          s: "24",
          team: "Inter FS",
          games: 33,
          goals: 12
        },
        {
          s: "23",
          team: "Jimbee Cartagena FS",
          games: 40,
          goals: 9
        },
        {
          s: "22",
          team: "Jimbee Cartagena FS",
          games: 32,
          goals: 8
        },
        {
          s: "21",
          team: "Jimbee Cartagena FS",
          games: 32,
          goals: 8
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2017/2018, 2019/2020, 2023/2024)",
        "Supercopa Espa\xF1a  (2018/2019, 2023/2024, 2026/2027)",
        "Copa de Espa\xF1a (2024/2025, 2024/2025)",
        "Campeonato da Europa (2015/2016)",
        "UEFA Futsal Champions League (2017/2018)"
      ]
    },
    epz07: {
      fpId: 5165,
      games: 92,
      yellow: 17,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "ElPozo Murcia",
          games: 10,
          goals: 2
        },
        {
          s: "25",
          team: "ElPozo Murcia",
          games: 37,
          goals: 5
        },
        {
          s: "24",
          team: "ElPozo Murcia",
          games: 37,
          goals: 8
        },
        {
          s: "21",
          team: "Magnus Futsal",
          games: 8,
          goals: 2
        }
      ],
      titles: [
        "LNF (2020/2021)",
        "Supercopa Espa\xF1a  (2026/2027)"
      ]
    },
    epz08: {
      fpId: 26390,
      games: 65,
      yellow: 10,
      red: 0,
      seasons: [
        {
          s: "25",
          team: "ElPozo Murcia",
          games: 37,
          goals: 6
        },
        {
          s: "24",
          team: "Osasuna Magna Xota FS",
          games: 28,
          goals: 8
        }
      ],
      titles: []
    },
    epz09: {
      fpId: 26395,
      games: 77,
      yellow: 15,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "ElPozo Murcia",
          games: 12,
          goals: 3
        },
        {
          s: "25",
          team: "ElPozo Murcia",
          games: 36,
          goals: 10
        },
        {
          s: "24",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 29,
          goals: 6
        }
      ],
      titles: [
        "Campeonato Europa Sub 19 (2022/2023)",
        "Campeonato da Europa (2025/2026)",
        "Supercopa Espa\xF1a  (2026/2027)"
      ]
    },
    epz10: {
      fpId: 483,
      games: 195,
      yellow: 61,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "ElPozo Murcia",
          games: 12,
          goals: 4
        },
        {
          s: "25",
          team: "ElPozo Murcia",
          games: 37,
          goals: 17
        },
        {
          s: "24",
          team: "ElPozo Murcia",
          games: 37,
          goals: 12
        },
        {
          s: "23",
          team: "ElPozo Murcia",
          games: 42,
          goals: 19
        },
        {
          s: "22",
          team: "ElPozo Murcia",
          games: 34,
          goals: 12
        },
        {
          s: "21",
          team: "ElPozo Murcia",
          games: 33,
          goals: 14
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2016/2017, 2017/2018, 2019/2020)",
        "UEFA Futsal Champions League (2016/2017, 2017/2018)",
        "Supercopa Espa\xF1a  (2018/2019, 2026/2027)"
      ]
    },
    epz11: {
      fpId: 66396,
      games: 1,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "ElPozo Murcia",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    epz12: {
      fpId: 66395,
      games: 1,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "ElPozo Murcia",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    epz13: {
      fpId: 17300,
      games: 145,
      yellow: 15,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "ElPozo Murcia",
          games: 12,
          goals: 3
        },
        {
          s: "25",
          team: "Osasuna Magna Xota FS",
          games: 30,
          goals: 10
        },
        {
          s: "24",
          team: "Osasuna Magna Xota FS",
          games: 32,
          goals: 17
        },
        {
          s: "23",
          team: "Osasuna Magna Xota FS",
          games: 26,
          goals: 7
        },
        {
          s: "22",
          team: "Levante UD",
          games: 29,
          goals: 7
        },
        {
          s: "21",
          team: "Levante UD",
          games: 16,
          goals: 2
        }
      ],
      titles: [
        "Supercopa Espa\xF1a  (2026/2027)"
      ]
    },
    epz14: {
      fpId: 643,
      games: 174,
      yellow: 20,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "ElPozo Murcia",
          games: 12,
          goals: 3
        },
        {
          s: "25",
          team: "ElPozo Murcia",
          games: 39,
          goals: 5
        },
        {
          s: "24",
          team: "ElPozo Murcia",
          games: 34,
          goals: 11
        },
        {
          s: "23",
          team: "ElPozo Murcia",
          games: 40,
          goals: 8
        },
        {
          s: "22",
          team: "Industrias Santa Coloma",
          games: 21,
          goals: 9
        },
        {
          s: "21",
          team: "Industrias Santa Coloma",
          games: 28,
          goals: 15
        }
      ],
      titles: [
        "Supercopa Espa\xF1a  (2026/2027)"
      ]
    },
    epz15: {
      fpId: 66394,
      games: 12,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "ElPozo Murcia",
          games: 12,
          goals: 3
        }
      ],
      titles: [
        "Supercopa Espa\xF1a  (2026/2027)"
      ]
    },
    epz16: {
      fpId: 5158,
      games: 181,
      yellow: 30,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "ElPozo Murcia",
          games: 11,
          goals: 7
        },
        {
          s: "25",
          team: "ElPozo Murcia",
          games: 40,
          goals: 21
        },
        {
          s: "24",
          team: "ElPozo Murcia",
          games: 26,
          goals: 16
        },
        {
          s: "23",
          team: "ElPozo Murcia",
          games: 41,
          goals: 31
        },
        {
          s: "22",
          team: "ElPozo Murcia",
          games: 34,
          goals: 15
        },
        {
          s: "21",
          team: "ElPozo Murcia",
          games: 29,
          goals: 15
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2019/2020)",
        "Campeonato do Mundo (2024/2025)",
        "Copa Am\xE9rica (2025/2026)",
        "Supercopa Espa\xF1a  (2026/2027)"
      ]
    },
    epz17: {
      fpId: 5653,
      games: 79,
      yellow: 12,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "ElPozo Murcia",
          games: 12,
          goals: 8
        },
        {
          s: "25",
          team: "ElPozo Murcia",
          games: 39,
          goals: 16
        },
        {
          s: "24",
          team: "Kairat Almaty",
          games: 7,
          goals: 2
        },
        {
          s: "23",
          team: "Kairat Almaty",
          games: 9,
          goals: 7
        },
        {
          s: "21",
          team: "Carlos Barbosa",
          games: 12,
          goals: 5
        }
      ],
      titles: [
        "Supercopa Espa\xF1a  (2026/2027)"
      ]
    },
    epz18: {
      fpId: 763,
      games: 148,
      yellow: 33,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "ElPozo Murcia",
          games: 12,
          goals: 4
        },
        {
          s: "25",
          team: "Catania Calcio A 5",
          games: 3,
          goals: 1
        },
        {
          s: "24",
          team: "Inter FS",
          games: 34,
          goals: 26
        },
        {
          s: "23",
          team: "Inter FS",
          games: 31,
          goals: 13
        },
        {
          s: "22",
          team: "Inter FS",
          games: 39,
          goals: 20
        },
        {
          s: "21",
          team: "Industrias Santa Coloma",
          games: 29,
          goals: 22
        }
      ],
      titles: [
        "Copa de Espa\xF1a (2024/2025, 2024/2025)",
        "Supercopa Espa\xF1a  (2026/2027)"
      ]
    },
    epz19: {
      fpId: 25268,
      games: 47,
      yellow: 21,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "ElPozo Murcia",
          games: 12,
          goals: 4
        },
        {
          s: "25",
          team: "O Parrulo Ferrol",
          games: 30,
          goals: 14
        },
        {
          s: "23",
          team: "Real Betis Futsal",
          games: 5,
          goals: 0
        }
      ],
      titles: [
        "Supercopa Espa\xF1a  (2026/2027)"
      ]
    },
    pal01: {
      fpId: 5196,
      games: 173,
      yellow: 20,
      red: 3,
      seasons: [
        {
          s: "25",
          team: "Islas Baleares Palma Futsal",
          games: 25,
          goals: 0
        },
        {
          s: "24",
          team: "Islas Baleares Palma Futsal",
          games: 40,
          goals: 4
        },
        {
          s: "23",
          team: "Islas Baleares Palma Futsal",
          games: 41,
          goals: 2
        },
        {
          s: "22",
          team: "Islas Baleares Palma Futsal",
          games: 43,
          goals: 1
        },
        {
          s: "21",
          team: "AD Fund\xE3o",
          games: 24,
          goals: 0
        }
      ],
      titles: [
        "UEFA Futsal Champions League (2022/2023, 2023/2024, 2024/2025)"
      ]
    },
    pal02: {
      fpId: 653,
      games: 207,
      yellow: 22,
      red: 6,
      seasons: [
        {
          s: "26",
          team: "Islas Baleares Palma Futsal",
          games: 10,
          goals: 0
        },
        {
          s: "25",
          team: "Islas Baleares Palma Futsal",
          games: 48,
          goals: 0
        },
        {
          s: "24",
          team: "Islas Baleares Palma Futsal",
          games: 44,
          goals: 0
        },
        {
          s: "23",
          team: "Islas Baleares Palma Futsal",
          games: 40,
          goals: 0
        },
        {
          s: "22",
          team: "Islas Baleares Palma Futsal",
          games: 35,
          goals: 0
        },
        {
          s: "21",
          team: "Islas Baleares Palma Futsal",
          games: 30,
          goals: 2
        }
      ],
      titles: [
        "UEFA Futsal Champions League (2022/2023, 2023/2024, 2024/2025)"
      ]
    },
    pal03: {
      fpId: 5080,
      games: 92,
      yellow: 9,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Islas Baleares Palma Futsal",
          games: 10,
          goals: 3
        },
        {
          s: "25",
          team: "Islas Baleares Palma Futsal",
          games: 46,
          goals: 3
        },
        {
          s: "24",
          team: "Kairat Almaty",
          games: 8,
          goals: 3
        },
        {
          s: "23",
          team: "Kairat Almaty",
          games: 9,
          goals: 1
        },
        {
          s: "22",
          team: "Kairat Almaty",
          games: 6,
          goals: 0
        },
        {
          s: "21",
          team: "Joinville",
          games: 13,
          goals: 0
        }
      ],
      titles: []
    },
    pal04: {
      fpId: 5084,
      games: 171,
      yellow: 32,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Islas Baleares Palma Futsal",
          games: 10,
          goals: 2
        },
        {
          s: "25",
          team: "Islas Baleares Palma Futsal",
          games: 43,
          goals: 10
        },
        {
          s: "24",
          team: "Islas Baleares Palma Futsal",
          games: 43,
          goals: 9
        },
        {
          s: "23",
          team: "Noia Portus Apostoli",
          games: 23,
          goals: 6
        },
        {
          s: "22",
          team: "Noia Portus Apostoli",
          games: 30,
          goals: 10
        },
        {
          s: "21",
          team: "Inter FS",
          games: 12,
          goals: 1
        },
        {
          s: "21",
          team: "Joinville",
          games: 10,
          goals: 2
        }
      ],
      titles: [
        "UEFA Futsal Champions League (2024/2025)"
      ]
    },
    pal05: {
      fpId: 15865,
      games: 79,
      yellow: 13,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Islas Baleares Palma Futsal",
          games: 10,
          goals: 2
        },
        {
          s: "25",
          team: "Atl\xE2ntico",
          games: 10,
          goals: 6
        },
        {
          s: "25",
          team: "Islas Baleares Palma Futsal",
          games: 46,
          goals: 8
        },
        {
          s: "21",
          team: "Campo Mour\xE3o",
          games: 13,
          goals: 3
        }
      ],
      titles: []
    },
    pal06: {
      fpId: 1920,
      games: 152,
      yellow: 62,
      red: 5,
      seasons: [
        {
          s: "26",
          team: "Islas Baleares Palma Futsal",
          games: 10,
          goals: 2
        },
        {
          s: "25",
          team: "Islas Baleares Palma Futsal",
          games: 24,
          goals: 2
        },
        {
          s: "24",
          team: "Islas Baleares Palma Futsal",
          games: 28,
          goals: 9
        },
        {
          s: "23",
          team: "Real Betis Futsal",
          games: 30,
          goals: 11
        },
        {
          s: "22",
          team: "Real Betis Futsal",
          games: 30,
          goals: 12
        },
        {
          s: "21",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 30,
          goals: 10
        }
      ],
      titles: [
        "UEFA Futsal Champions League (2024/2025)"
      ]
    },
    pal07: {
      fpId: 8870,
      games: 184,
      yellow: 25,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Islas Baleares Palma Futsal",
          games: 10,
          goals: 6
        },
        {
          s: "25",
          team: "Islas Baleares Palma Futsal",
          games: 48,
          goals: 17
        },
        {
          s: "24",
          team: "Inter FS",
          games: 35,
          goals: 2
        },
        {
          s: "23",
          team: "Jimbee Cartagena FS",
          games: 29,
          goals: 12
        },
        {
          s: "22",
          team: "Jimbee Cartagena FS",
          games: 29,
          goals: 20
        },
        {
          s: "21",
          team: "Jimbee Cartagena FS",
          games: 33,
          goals: 13
        }
      ],
      titles: [
        "Copa de Espa\xF1a (2024/2025, 2024/2025)",
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2023/2024)",
        "Supercopa Espa\xF1a  (2023/2024)",
        "Copa Am\xE9rica (2025/2026)"
      ]
    },
    pal08: {
      fpId: 15041,
      games: 146,
      yellow: 8,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Islas Baleares Palma Futsal",
          games: 10,
          goals: 2
        },
        {
          s: "25",
          team: "C\xF3rdoba Patrimonio",
          games: 30,
          goals: 13
        },
        {
          s: "24",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 30,
          goals: 8
        },
        {
          s: "23",
          team: "Alzira FS",
          games: 30,
          goals: 8
        },
        {
          s: "22",
          team: "Islas Baleares Palma Futsal",
          games: 33,
          goals: 2
        },
        {
          s: "21",
          team: "Islas Baleares Palma Futsal",
          games: 13,
          goals: 1
        }
      ],
      titles: [
        "UEFA Futsal Champions League (2022/2023)"
      ]
    },
    pal09: {
      fpId: 24160,
      games: 48,
      yellow: 10,
      red: 0,
      seasons: [
        {
          s: "25",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 26,
          goals: 6
        },
        {
          s: "24",
          team: "CCRD Burinhosa",
          games: 22,
          goals: 12
        }
      ],
      titles: [
        "Campeonato Europa Sub 19 (2025/2026)"
      ]
    },
    pal10: {
      fpId: 15811,
      games: 155,
      yellow: 38,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Islas Baleares Palma Futsal",
          games: 10,
          goals: 6
        },
        {
          s: "25",
          team: "Islas Baleares Palma Futsal",
          games: 45,
          goals: 28
        },
        {
          s: "24",
          team: "Islas Baleares Palma Futsal",
          games: 41,
          goals: 35
        },
        {
          s: "23",
          team: "Islas Baleares Palma Futsal",
          games: 36,
          goals: 14
        },
        {
          s: "22",
          team: "Islas Baleares Palma Futsal",
          games: 15,
          goals: 2
        },
        {
          s: "21",
          team: "Joinville",
          games: 8,
          goals: 0
        }
      ],
      titles: [
        "UEFA Futsal Champions League (2022/2023, 2023/2024, 2024/2025)"
      ]
    },
    pal11: {
      fpId: 5139,
      games: 24,
      yellow: 5,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Islas Baleares Palma Futsal",
          games: 10,
          goals: 2
        },
        {
          s: "25",
          team: "Kairat Almaty",
          games: 6,
          goals: 0
        },
        {
          s: "24",
          team: "Kairat Almaty",
          games: 8,
          goals: 2
        }
      ],
      titles: []
    },
    pal12: {
      fpId: 15752,
      games: 127,
      yellow: 19,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Islas Baleares Palma Futsal",
          games: 10,
          goals: 3
        },
        {
          s: "25",
          team: "Islas Baleares Palma Futsal",
          games: 48,
          goals: 19
        },
        {
          s: "24",
          team: "Islas Baleares Palma Futsal",
          games: 41,
          goals: 8
        },
        {
          s: "23",
          team: "Islas Baleares Palma Futsal",
          games: 19,
          goals: 7
        },
        {
          s: "21",
          team: "Joa\xE7aba Futsal",
          games: 9,
          goals: 3
        }
      ],
      titles: [
        "UEFA Futsal Champions League (2023/2024, 2024/2025)"
      ]
    },
    pal13: {
      fpId: 4628,
      games: 191,
      yellow: 31,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Islas Baleares Palma Futsal",
          games: 8,
          goals: 4
        },
        {
          s: "25",
          team: "SL Benfica",
          games: 38,
          goals: 21
        },
        {
          s: "24",
          team: "SL Benfica",
          games: 33,
          goals: 16
        },
        {
          s: "23",
          team: "SL Benfica",
          games: 42,
          goals: 24
        },
        {
          s: "22",
          team: "SL Benfica",
          games: 40,
          goals: 20
        },
        {
          s: "21",
          team: "Islas Baleares Palma Futsal",
          games: 30,
          goals: 14
        }
      ],
      titles: [
        "Ta\xE7a da Liga (2022/2023, 2025/2026)",
        "Ta\xE7a de Portugal (2022/2023, 2025/2026)",
        "Liga Placard (2024/2025, 2025/2026)",
        "Superta\xE7a (2023/2024)"
      ]
    },
    pal14: {
      fpId: 11135,
      games: 191,
      yellow: 23,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Islas Baleares Palma Futsal",
          games: 10,
          goals: 2
        },
        {
          s: "25",
          team: "Islas Baleares Palma Futsal",
          games: 48,
          goals: 6
        },
        {
          s: "24",
          team: "Islas Baleares Palma Futsal",
          games: 46,
          goals: 8
        },
        {
          s: "23",
          team: "Industrias Santa Coloma",
          games: 28,
          goals: 15
        },
        {
          s: "22",
          team: "Industrias Santa Coloma",
          games: 30,
          goals: 5
        },
        {
          s: "21",
          team: "Industrias Santa Coloma",
          games: 29,
          goals: 7
        }
      ],
      titles: [
        "Campeonato Europa Sub 19 (2019/2020)",
        "Montaigu Futsal Cup (2019/2020)",
        "UEFA Futsal Champions League (2024/2025)"
      ]
    },
    pal15: {
      fpId: 5417,
      games: 91,
      yellow: 20,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Islas Baleares Palma Futsal",
          games: 9,
          goals: 7
        },
        {
          s: "25",
          team: "Islas Baleares Palma Futsal",
          games: 46,
          goals: 25
        },
        {
          s: "24",
          team: "Islas Baleares Palma Futsal",
          games: 25,
          goals: 2
        },
        {
          s: "21",
          team: "Magnus Futsal",
          games: 11,
          goals: 5
        }
      ],
      titles: [
        "LNF (2020/2021)",
        "UEFA Futsal Champions League (2024/2025)"
      ]
    },
    pal16: {
      fpId: 6584,
      games: 122,
      yellow: 10,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Islas Baleares Palma Futsal",
          games: 10,
          goals: 7
        },
        {
          s: "25",
          team: "Islas Baleares Palma Futsal",
          games: 44,
          goals: 19
        },
        {
          s: "24",
          team: "Kairat Almaty",
          games: 8,
          goals: 6
        },
        {
          s: "23",
          team: "Kairat Almaty",
          games: 9,
          goals: 4
        },
        {
          s: "22",
          team: "Noia Portus Apostoli",
          games: 28,
          goals: 5
        },
        {
          s: "21",
          team: "Real Betis Futsal",
          games: 13,
          goals: 1
        },
        {
          s: "21",
          team: "Magnus Futsal",
          games: 10,
          goals: 3
        }
      ],
      titles: [
        "LNF (2020/2021)"
      ]
    },
    eji01: {
      fpId: 66417,
      games: 7,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Sur Seeds El Ejido Futsal",
          games: 7,
          goals: 0
        }
      ],
      titles: []
    },
    eji02: {
      fpId: 14363,
      games: 32,
      yellow: 2,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Sur Seeds El Ejido Futsal",
          games: 7,
          goals: 1
        },
        {
          s: "25",
          team: "Kairat Almaty",
          games: 2,
          goals: 0
        },
        {
          s: "25",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 16,
          goals: 0
        },
        {
          s: "24",
          team: "Riga FC",
          games: 6,
          goals: 3
        },
        {
          s: "21",
          team: "Corinthians",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    eji03: {
      fpId: 66418,
      games: 7,
      yellow: 3,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Sur Seeds El Ejido Futsal",
          games: 7,
          goals: 1
        }
      ],
      titles: []
    },
    eji04: {
      fpId: 66419,
      games: 7,
      yellow: 2,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Sur Seeds El Ejido Futsal",
          games: 7,
          goals: 0
        }
      ],
      titles: []
    },
    eji05: {
      fpId: 17143,
      games: 143,
      yellow: 57,
      red: 3,
      seasons: [
        {
          s: "26",
          team: "Sur Seeds El Ejido Futsal",
          games: 7,
          goals: 2
        },
        {
          s: "25",
          team: "Osasuna Magna Xota FS",
          games: 15,
          goals: 4
        },
        {
          s: "24",
          team: "Osasuna Magna Xota FS",
          games: 31,
          goals: 6
        },
        {
          s: "23",
          team: "Osasuna Magna Xota FS",
          games: 31,
          goals: 11
        },
        {
          s: "22",
          team: "Osasuna Magna Xota FS",
          games: 29,
          goals: 5
        },
        {
          s: "21",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 30,
          goals: 1
        }
      ],
      titles: []
    },
    eji06: {
      fpId: 66420,
      games: 7,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Sur Seeds El Ejido Futsal",
          games: 7,
          goals: 1
        }
      ],
      titles: []
    },
    eji07: {
      fpId: 814,
      games: 4,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Sur Seeds El Ejido Futsal",
          games: 4,
          goals: 0
        }
      ],
      titles: []
    },
    eji08: {
      fpId: 26372,
      games: 54,
      yellow: 10,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Sur Seeds El Ejido Futsal",
          games: 6,
          goals: 2
        },
        {
          s: "25",
          team: "C\xF3rdoba Patrimonio",
          games: 18,
          goals: 4
        },
        {
          s: "24",
          team: "C\xF3rdoba Patrimonio",
          games: 29,
          goals: 11
        },
        {
          s: "23",
          team: "C\xF3rdoba Patrimonio",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    eji09: {
      fpId: 23484,
      games: 50,
      yellow: 9,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Sur Seeds El Ejido Futsal",
          games: 7,
          goals: 3
        },
        {
          s: "23",
          team: "Noia Portus Apostoli",
          games: 30,
          goals: 2
        },
        {
          s: "22",
          team: "Noia Portus Apostoli",
          games: 13,
          goals: 0
        }
      ],
      titles: []
    },
    eji10: {
      fpId: 66421,
      games: 4,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Sur Seeds El Ejido Futsal",
          games: 4,
          goals: 1
        }
      ],
      titles: []
    },
    eji11: {
      fpId: 5135,
      games: 11,
      yellow: 1,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Sur Seeds El Ejido Futsal",
          games: 7,
          goals: 2
        },
        {
          s: "21",
          team: "Marreco Futsal",
          games: 4,
          goals: 1
        }
      ],
      titles: []
    },
    eji12: {
      fpId: 58826,
      games: 9,
      yellow: 2,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Sur Seeds El Ejido Futsal",
          games: 4,
          goals: 1
        },
        {
          s: "21",
          team: "ElPozo Murcia",
          games: 5,
          goals: 0
        }
      ],
      titles: [
        "Campeonato Europa Sub 19 (2022/2023)"
      ]
    },
    eji13: {
      fpId: 17131,
      games: 103,
      yellow: 32,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Sur Seeds El Ejido Futsal",
          games: 5,
          goals: 1
        },
        {
          s: "24",
          team: "Noia Portus Apostoli",
          games: 23,
          goals: 1
        },
        {
          s: "23",
          team: "Noia Portus Apostoli",
          games: 24,
          goals: 4
        },
        {
          s: "22",
          team: "Industrias Santa Coloma",
          games: 27,
          goals: 4
        },
        {
          s: "21",
          team: "Industrias Santa Coloma",
          games: 24,
          goals: 2
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2020/2021)"
      ]
    },
    eji14: {
      fpId: 27908,
      games: 31,
      yellow: 13,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Sur Seeds El Ejido Futsal",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "Alzira FS",
          games: 25,
          goals: 4
        }
      ],
      titles: []
    },
    eji15: {
      fpId: 11137,
      games: 101,
      yellow: 33,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Sur Seeds El Ejido Futsal",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "Alzira FS",
          games: 30,
          goals: 9
        },
        {
          s: "24",
          team: "Real Betis Futsal",
          games: 2,
          goals: 1
        },
        {
          s: "23",
          team: "Real Betis Futsal",
          games: 29,
          goals: 3
        },
        {
          s: "22",
          team: "Real Betis Futsal",
          games: 26,
          goals: 5
        },
        {
          s: "21",
          team: "Real Betis Futsal",
          games: 8,
          goals: 1
        }
      ],
      titles: [
        "Campeonato Europa Sub 19 (2019/2020)",
        "Montaigu Futsal Cup (2019/2020)"
      ]
    },
    eji16: {
      fpId: 651,
      games: 31,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Sur Seeds El Ejido Futsal",
          games: 7,
          goals: 5
        },
        {
          s: "24",
          team: "Ribera Navarra FS",
          games: 12,
          goals: 0
        },
        {
          s: "24",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 12,
          goals: 0
        }
      ],
      titles: []
    },
    stc01: {
      fpId: 27581,
      games: 36,
      yellow: 5,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Industrias Santa Coloma",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "Industrias Santa Coloma",
          games: 27,
          goals: 1
        },
        {
          s: "24",
          team: "Real Betis Futsal",
          games: 2,
          goals: 0
        }
      ],
      titles: []
    },
    stc02: {
      fpId: 23800,
      games: 55,
      yellow: 4,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Industrias Santa Coloma",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "Ribera Navarra FS",
          games: 30,
          goals: 0
        },
        {
          s: "24",
          team: "FC Barcelona",
          games: 14,
          goals: 0
        },
        {
          s: "23",
          team: "FC Barcelona",
          games: 4,
          goals: 0
        }
      ],
      titles: []
    },
    stc03: {
      fpId: 461,
      games: 152,
      yellow: 27,
      red: 5,
      seasons: [
        {
          s: "26",
          team: "Industrias Santa Coloma",
          games: 7,
          goals: 2
        },
        {
          s: "25",
          team: "Industrias Santa Coloma",
          games: 30,
          goals: 15
        },
        {
          s: "24",
          team: "Industrias Santa Coloma",
          games: 24,
          goals: 6
        },
        {
          s: "23",
          team: "Industrias Santa Coloma",
          games: 28,
          goals: 9
        },
        {
          s: "22",
          team: "Levante UD",
          games: 27,
          goals: 6
        },
        {
          s: "21",
          team: "Levante UD",
          games: 36,
          goals: 11
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2011/2012, 2012/2013)",
        "UEFA Futsal Champions League (2011/2012)",
        "Copa de Espa\xF1a (2017/2018)",
        "Liga Placard (2018/2019)",
        "Ta\xE7a da Liga (2018/2019)"
      ]
    },
    stc04: {
      fpId: 22407,
      games: 85,
      yellow: 5,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Industrias Santa Coloma",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "Industrias Santa Coloma",
          games: 28,
          goals: 1
        },
        {
          s: "24",
          team: "Industrias Santa Coloma",
          games: 28,
          goals: 1
        },
        {
          s: "23",
          team: "Industrias Santa Coloma",
          games: 16,
          goals: 1
        },
        {
          s: "22",
          team: "Industrias Santa Coloma",
          games: 7,
          goals: 0
        }
      ],
      titles: []
    },
    stc05: {
      fpId: 644,
      games: 143,
      yellow: 39,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Industrias Santa Coloma",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "Industrias Santa Coloma",
          games: 24,
          goals: 2
        },
        {
          s: "24",
          team: "Industrias Santa Coloma",
          games: 27,
          goals: 0
        },
        {
          s: "23",
          team: "Industrias Santa Coloma",
          games: 27,
          goals: 4
        },
        {
          s: "22",
          team: "Industrias Santa Coloma",
          games: 29,
          goals: 4
        },
        {
          s: "21",
          team: "Industrias Santa Coloma",
          games: 30,
          goals: 5
        }
      ],
      titles: []
    },
    stc06: {
      fpId: 28929,
      games: 23,
      yellow: 2,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Industrias Santa Coloma",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "Industrias Santa Coloma",
          games: 16,
          goals: 2
        }
      ],
      titles: []
    },
    stc07: {
      fpId: 66407,
      games: 1,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Industrias Santa Coloma",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    stc08: {
      fpId: 642,
      games: 163,
      yellow: 31,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Industrias Santa Coloma",
          games: 7,
          goals: 4
        },
        {
          s: "25",
          team: "FC Barcelona",
          games: 22,
          goals: 2
        },
        {
          s: "24",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 30,
          goals: 21
        },
        {
          s: "23",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 33,
          goals: 16
        },
        {
          s: "22",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 11,
          goals: 5
        },
        {
          s: "22",
          team: "Inter FS",
          games: 25,
          goals: 8
        },
        {
          s: "21",
          team: "Inter FS",
          games: 35,
          goals: 19
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2025/2026)"
      ]
    },
    stc09: {
      fpId: 25266,
      games: 48,
      yellow: 9,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Industrias Santa Coloma",
          games: 5,
          goals: 2
        },
        {
          s: "25",
          team: "Industrias Santa Coloma",
          games: 30,
          goals: 5
        },
        {
          s: "24",
          team: "FC Barcelona",
          games: 3,
          goals: 0
        },
        {
          s: "23",
          team: "FC Barcelona",
          games: 10,
          goals: 0
        }
      ],
      titles: []
    },
    stc10: {
      fpId: 22406,
      games: 45,
      yellow: 4,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Industrias Santa Coloma",
          games: 7,
          goals: 3
        },
        {
          s: "25",
          team: "FC Barcelona",
          games: 4,
          goals: 0
        },
        {
          s: "24",
          team: "Industrias Santa Coloma",
          games: 27,
          goals: 2
        },
        {
          s: "23",
          team: "Industrias Santa Coloma",
          games: 4,
          goals: 0
        },
        {
          s: "22",
          team: "Industrias Santa Coloma",
          games: 3,
          goals: 0
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2025/2026)"
      ]
    },
    stc11: {
      fpId: 25529,
      games: 29,
      yellow: 5,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Industrias Santa Coloma",
          games: 7,
          goals: 1
        },
        {
          s: "25",
          team: "Riga FC",
          games: 7,
          goals: 4
        },
        {
          s: "24",
          team: "Riga FC",
          games: 6,
          goals: 3
        },
        {
          s: "23",
          team: "Riga FC",
          games: 9,
          goals: 2
        }
      ],
      titles: []
    },
    stc12: {
      fpId: 23770,
      games: 81,
      yellow: 4,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Industrias Santa Coloma",
          games: 7,
          goals: 2
        },
        {
          s: "25",
          team: "Industrias Santa Coloma",
          games: 23,
          goals: 7
        },
        {
          s: "24",
          team: "Industrias Santa Coloma",
          games: 24,
          goals: 4
        },
        {
          s: "23",
          team: "Industrias Santa Coloma",
          games: 27,
          goals: 4
        }
      ],
      titles: []
    },
    stc13: {
      fpId: 6585,
      games: 101,
      yellow: 19,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Industrias Santa Coloma",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "Industrias Santa Coloma",
          games: 10,
          goals: 0
        },
        {
          s: "24",
          team: "Industrias Santa Coloma",
          games: 16,
          goals: 3
        },
        {
          s: "23",
          team: "Industrias Santa Coloma",
          games: 12,
          goals: 5
        },
        {
          s: "22",
          team: "Industrias Santa Coloma",
          games: 29,
          goals: 6
        },
        {
          s: "21",
          team: "Industrias Santa Coloma",
          games: 27,
          goals: 2
        }
      ],
      titles: []
    },
    stc14: {
      fpId: 13851,
      games: 157,
      yellow: 33,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Industrias Santa Coloma",
          games: 6,
          goals: 1
        },
        {
          s: "25",
          team: "Ribera Navarra FS",
          games: 23,
          goals: 7
        },
        {
          s: "24",
          team: "Ribera Navarra FS",
          games: 30,
          goals: 9
        },
        {
          s: "23",
          team: "ElPozo Murcia",
          games: 40,
          goals: 3
        },
        {
          s: "22",
          team: "Real Betis Futsal",
          games: 29,
          goals: 12
        },
        {
          s: "21",
          team: "Real Betis Futsal",
          games: 29,
          goals: 5
        }
      ],
      titles: []
    },
    stc15: {
      fpId: 28933,
      games: 9,
      yellow: 1,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Industrias Santa Coloma",
          games: 3,
          goals: 0
        },
        {
          s: "25",
          team: "FC Barcelona",
          games: 6,
          goals: 2
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2025/2026)"
      ]
    },
    jae01: {
      fpId: 29079,
      games: 8,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 1,
          goals: 0
        },
        {
          s: "25",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 7,
          goals: 0
        }
      ],
      titles: [
        "Copa de Espa\xF1a (2025/2026, 2025/2026)"
      ]
    },
    jae02: {
      fpId: 1867,
      games: 143,
      yellow: 34,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 6,
          goals: 2
        },
        {
          s: "25",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 35,
          goals: 6
        },
        {
          s: "24",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 30,
          goals: 3
        },
        {
          s: "23",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 33,
          goals: 2
        },
        {
          s: "22",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 36,
          goals: 3
        },
        {
          s: "21",
          team: "Pesaro Calcio 5",
          games: 3,
          goals: 0
        }
      ],
      titles: [
        "Copa de Espa\xF1a (2025/2026, 2025/2026)",
        "Copa de Espa\xF1a Feminino (2022/2023)"
      ]
    },
    jae03: {
      fpId: 27915,
      games: 32,
      yellow: 3,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 8,
          goals: 0
        },
        {
          s: "25",
          team: "Industrias Santa Coloma",
          games: 24,
          goals: 0
        }
      ],
      titles: []
    },
    jae04: {
      fpId: 703,
      games: 150,
      yellow: 37,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 5,
          goals: 0
        },
        {
          s: "25",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 27,
          goals: 8
        },
        {
          s: "24",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 26,
          goals: 2
        },
        {
          s: "23",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 33,
          goals: 5
        },
        {
          s: "22",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 31,
          goals: 4
        },
        {
          s: "21",
          team: "Inter FS",
          games: 28,
          goals: 5
        }
      ],
      titles: [
        "Copa de Espa\xF1a (2018/2019, 2019/2020, 2020/2021, 2020/2021, 2020/2021)",
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2018/2019)",
        "UEFA Futsal Champions League (2019/2020)",
        "Supercopa Espa\xF1a  (2020/2021)"
      ]
    },
    jae05: {
      fpId: 21216,
      games: 126,
      yellow: 45,
      red: 3,
      seasons: [
        {
          s: "26",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 7,
          goals: 1
        },
        {
          s: "25",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 33,
          goals: 5
        },
        {
          s: "24",
          team: "Noia Portus Apostoli",
          games: 29,
          goals: 8
        },
        {
          s: "23",
          team: "Noia Portus Apostoli",
          games: 27,
          goals: 8
        },
        {
          s: "22",
          team: "Noia Portus Apostoli",
          games: 30,
          goals: 7
        }
      ],
      titles: [
        "Copa de Espa\xF1a (2025/2026, 2025/2026)"
      ]
    },
    jae06: {
      fpId: 25861,
      games: 92,
      yellow: 17,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 7,
          goals: 6
        },
        {
          s: "25",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 32,
          goals: 13
        },
        {
          s: "24",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 33,
          goals: 4
        },
        {
          s: "23",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 20,
          goals: 6
        }
      ],
      titles: [
        "Copa de Espa\xF1a (2025/2026, 2025/2026)"
      ]
    },
    jae07: {
      fpId: 11055,
      games: 157,
      yellow: 31,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 6,
          goals: 2
        },
        {
          s: "25",
          team: "ElPozo Murcia",
          games: 21,
          goals: 2
        },
        {
          s: "24",
          team: "ElPozo Murcia",
          games: 33,
          goals: 5
        },
        {
          s: "23",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 29,
          goals: 8
        },
        {
          s: "22",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 38,
          goals: 11
        },
        {
          s: "21",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 30,
          goals: 4
        }
      ],
      titles: [
        "Copa de Espa\xF1a Feminino (2022/2023)"
      ]
    },
    jae08: {
      fpId: 683,
      games: 136,
      yellow: 31,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 8,
          goals: 2
        },
        {
          s: "25",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 32,
          goals: 2
        },
        {
          s: "24",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 30,
          goals: 2
        },
        {
          s: "23",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 27,
          goals: 13
        },
        {
          s: "22",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 27,
          goals: 7
        },
        {
          s: "21",
          team: "Osasuna Magna Xota FS",
          games: 12,
          goals: 3
        }
      ],
      titles: [
        "Copa de Espa\xF1a (2025/2026, 2025/2026)"
      ]
    },
    jae09: {
      fpId: 735,
      games: 181,
      yellow: 71,
      red: 6,
      seasons: [
        {
          s: "26",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 8,
          goals: 2
        },
        {
          s: "25",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 32,
          goals: 14
        },
        {
          s: "24",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 33,
          goals: 7
        },
        {
          s: "23",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 36,
          goals: 4
        },
        {
          s: "22",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 39,
          goals: 10
        },
        {
          s: "21",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 33,
          goals: 12
        }
      ],
      titles: [
        "Copa de Espa\xF1a (2025/2026, 2025/2026)",
        "Copa de Espa\xF1a Feminino (2022/2023)"
      ]
    },
    jae10: {
      fpId: 658,
      games: 177,
      yellow: 27,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 8,
          goals: 2
        },
        {
          s: "25",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 24,
          goals: 11
        },
        {
          s: "25",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 2,
          goals: 3
        },
        {
          s: "24",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 30,
          goals: 5
        },
        {
          s: "23",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 33,
          goals: 19
        },
        {
          s: "22",
          team: "Islas Baleares Palma Futsal",
          games: 43,
          goals: 19
        },
        {
          s: "21",
          team: "Islas Baleares Palma Futsal",
          games: 37,
          goals: 9
        }
      ],
      titles: [
        "Copa de Espa\xF1a (2025/2026, 2025/2026)",
        "UEFA Futsal Champions League (2022/2023)"
      ]
    },
    jae11: {
      fpId: 6581,
      games: 163,
      yellow: 42,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 8,
          goals: 1
        },
        {
          s: "25",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 32,
          goals: 5
        },
        {
          s: "24",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 32,
          goals: 7
        },
        {
          s: "23",
          team: "Real Betis Futsal",
          games: 27,
          goals: 6
        },
        {
          s: "22",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 32,
          goals: 5
        },
        {
          s: "21",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 32,
          goals: 11
        }
      ],
      titles: [
        "Copa de Espa\xF1a (2025/2026, 2025/2026)"
      ]
    },
    jae12: {
      fpId: 13832,
      games: 166,
      yellow: 58,
      red: 4,
      seasons: [
        {
          s: "26",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 8,
          goals: 0
        },
        {
          s: "25",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 34,
          goals: 9
        },
        {
          s: "24",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 33,
          goals: 12
        },
        {
          s: "23",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 37,
          goals: 12
        },
        {
          s: "22",
          team: "Osasuna Magna Xota FS",
          games: 25,
          goals: 5
        },
        {
          s: "21",
          team: "Osasuna Magna Xota FS",
          games: 29,
          goals: 11
        }
      ],
      titles: [
        "Copa de Espa\xF1a (2025/2026, 2025/2026)"
      ]
    },
    jae13: {
      fpId: 5544,
      games: 41,
      yellow: 2,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 7,
          goals: 1
        },
        {
          s: "25",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 17,
          goals: 2
        },
        {
          s: "24",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 5,
          goals: 0
        },
        {
          s: "21",
          team: "Carlos Barbosa",
          games: 12,
          goals: 7
        }
      ],
      titles: [
        "Copa de Espa\xF1a (2025/2026, 2025/2026)"
      ]
    },
    jae14: {
      fpId: 732,
      games: 174,
      yellow: 31,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 8,
          goals: 5
        },
        {
          s: "25",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 34,
          goals: 4
        },
        {
          s: "24",
          team: "ElPozo Murcia",
          games: 35,
          goals: 8
        },
        {
          s: "23",
          team: "ElPozo Murcia",
          games: 42,
          goals: 8
        },
        {
          s: "22",
          team: "Sporting CP",
          games: 38,
          goals: 25
        },
        {
          s: "21",
          team: "Sporting CP",
          games: 17,
          goals: 12
        }
      ],
      titles: [
        "Liga Placard (2021/2022, 2022/2023)",
        "Copa de Espa\xF1a (2025/2026, 2025/2026)",
        "Ta\xE7a de Portugal (2021/2022)",
        "Superta\xE7a (2022/2023)"
      ]
    },
    jae15: {
      fpId: 1820,
      games: 179,
      yellow: 31,
      red: 4,
      seasons: [
        {
          s: "26",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 8,
          goals: 6
        },
        {
          s: "25",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 34,
          goals: 18
        },
        {
          s: "24",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 34,
          goals: 23
        },
        {
          s: "23",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 37,
          goals: 17
        },
        {
          s: "22",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 38,
          goals: 20
        },
        {
          s: "21",
          team: "ElPozo Murcia",
          games: 28,
          goals: 9
        }
      ],
      titles: [
        "Copa de Espa\xF1a (2025/2026, 2025/2026)",
        "Copa de Espa\xF1a Feminino (2022/2023)"
      ]
    },
    jae16: {
      fpId: 378,
      games: 185,
      yellow: 49,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 8,
          goals: 0
        },
        {
          s: "25",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 35,
          goals: 8
        },
        {
          s: "24",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 33,
          goals: 16
        },
        {
          s: "23",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 37,
          goals: 14
        },
        {
          s: "22",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 39,
          goals: 11
        },
        {
          s: "21",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 33,
          goals: 11
        }
      ],
      titles: [
        "Copa de Espa\xF1a (2025/2026, 2025/2026)",
        "Ta\xE7a de Portugal (2014/2015)",
        "Liga Placard (2014/2015)",
        "Superta\xE7a (2015/2016)",
        "Campeonato do Mundo (2016/2017)",
        "Copa de Espa\xF1a Feminino (2022/2023)"
      ]
    },
    jca01: {
      fpId: 11075,
      games: 163,
      yellow: 5,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Jimbee Cartagena FS",
          games: 4,
          goals: 0
        },
        {
          s: "25",
          team: "Jimbee Cartagena FS",
          games: 43,
          goals: 1
        },
        {
          s: "24",
          team: "Jimbee Cartagena FS",
          games: 46,
          goals: 0
        },
        {
          s: "23",
          team: "Jimbee Cartagena FS",
          games: 39,
          goals: 0
        },
        {
          s: "22",
          team: "BeSoccer CD UMA Antequera",
          games: 26,
          goals: 0
        },
        {
          s: "21",
          team: "Jimbee Cartagena FS",
          games: 5,
          goals: 0
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2023/2024, 2024/2025)",
        "Supercopa Espa\xF1a  (2023/2024, 2025/2026)"
      ]
    },
    jca02: {
      fpId: 742,
      games: 188,
      yellow: 35,
      red: 3,
      seasons: [
        {
          s: "26",
          team: "Jimbee Cartagena FS",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "Jimbee Cartagena FS",
          games: 36,
          goals: 1
        },
        {
          s: "24",
          team: "Jimbee Cartagena FS",
          games: 44,
          goals: 1
        },
        {
          s: "23",
          team: "Jimbee Cartagena FS",
          games: 41,
          goals: 2
        },
        {
          s: "22",
          team: "Jimbee Cartagena FS",
          games: 28,
          goals: 2
        },
        {
          s: "21",
          team: "Jimbee Cartagena FS",
          games: 33,
          goals: 0
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2023/2024, 2024/2025)",
        "Supercopa Espa\xF1a  (2023/2024, 2025/2026)",
        "Campeonato da Europa (2025/2026)"
      ]
    },
    jca03: {
      fpId: 66392,
      games: 39,
      yellow: 4,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "S\xE3o Jos\xE9 Futsal",
          games: 11,
          goals: 0
        },
        {
          s: "26",
          team: "Jimbee Cartagena FS",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "S\xE3o Jos\xE9 Futsal",
          games: 21,
          goals: 2
        }
      ],
      titles: []
    },
    jca04: {
      fpId: 656,
      games: 219,
      yellow: 30,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Jimbee Cartagena FS",
          games: 9,
          goals: 2
        },
        {
          s: "25",
          team: "Jimbee Cartagena FS",
          games: 43,
          goals: 9
        },
        {
          s: "24",
          team: "Jimbee Cartagena FS",
          games: 48,
          goals: 7
        },
        {
          s: "23",
          team: "Jimbee Cartagena FS",
          games: 39,
          goals: 13
        },
        {
          s: "22",
          team: "Islas Baleares Palma Futsal",
          games: 42,
          goals: 12
        },
        {
          s: "21",
          team: "Islas Baleares Palma Futsal",
          games: 38,
          goals: 6
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2023/2024, 2024/2025)",
        "Supercopa Espa\xF1a  (2023/2024, 2025/2026)",
        "UEFA Futsal Champions League (2022/2023)"
      ]
    },
    jca05: {
      fpId: 13844,
      games: 95,
      yellow: 36,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Jimbee Cartagena FS",
          games: 9,
          goals: 1
        },
        {
          s: "25",
          team: "Pe\xF1\xEDscola FS",
          games: 26,
          goals: 3
        },
        {
          s: "24",
          team: "Pe\xF1\xEDscola FS",
          games: 33,
          goals: 5
        },
        {
          s: "23",
          team: "Pe\xF1\xEDscola FS",
          games: 26,
          goals: 4
        },
        {
          s: "22",
          team: "Pe\xF1\xEDscola FS",
          games: 1,
          goals: 1
        }
      ],
      titles: []
    },
    jca06: {
      fpId: 6708,
      games: 153,
      yellow: 39,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Jimbee Cartagena FS",
          games: 6,
          goals: 4
        },
        {
          s: "25",
          team: "Jimbee Cartagena FS",
          games: 37,
          goals: 11
        },
        {
          s: "25",
          team: "Osasuna Magna Xota FS",
          games: 1,
          goals: 1
        },
        {
          s: "24",
          team: "Osasuna Magna Xota FS",
          games: 26,
          goals: 7
        },
        {
          s: "23",
          team: "Osasuna Magna Xota FS",
          games: 31,
          goals: 8
        },
        {
          s: "22",
          team: "Osasuna Magna Xota FS",
          games: 27,
          goals: 8
        },
        {
          s: "21",
          team: "Osasuna Magna Xota FS",
          games: 25,
          goals: 6
        }
      ],
      titles: [
        "Supercopa Espa\xF1a  (2025/2026)"
      ]
    },
    jca07: {
      fpId: 743,
      games: 198,
      yellow: 41,
      red: 4,
      seasons: [
        {
          s: "26",
          team: "Jimbee Cartagena FS",
          games: 9,
          goals: 2
        },
        {
          s: "25",
          team: "Jimbee Cartagena FS",
          games: 45,
          goals: 8
        },
        {
          s: "24",
          team: "Jimbee Cartagena FS",
          games: 46,
          goals: 8
        },
        {
          s: "23",
          team: "Jimbee Cartagena FS",
          games: 39,
          goals: 5
        },
        {
          s: "22",
          team: "ElPozo Murcia",
          games: 29,
          goals: 10
        },
        {
          s: "21",
          team: "ElPozo Murcia",
          games: 30,
          goals: 4
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2023/2024, 2024/2025)",
        "Supercopa Espa\xF1a  (2023/2024, 2025/2026)"
      ]
    },
    jca08: {
      fpId: 11058,
      games: 129,
      yellow: 37,
      red: 1,
      seasons: [
        {
          s: "25",
          team: "Jimbee Cartagena FS",
          games: 1,
          goals: 0
        },
        {
          s: "24",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 28,
          goals: 11
        },
        {
          s: "23",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 36,
          goals: 5
        },
        {
          s: "22",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 36,
          goals: 7
        },
        {
          s: "21",
          team: "Burela FS",
          games: 28,
          goals: 6
        }
      ],
      titles: [
        "Copa de Espa\xF1a Feminino (2022/2023)"
      ]
    },
    jca09: {
      fpId: 23760,
      games: 126,
      yellow: 25,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Jimbee Cartagena FS",
          games: 8,
          goals: 3
        },
        {
          s: "25",
          team: "Jimbee Cartagena FS",
          games: 41,
          goals: 15
        },
        {
          s: "24",
          team: "Jimbee Cartagena FS",
          games: 47,
          goals: 9
        },
        {
          s: "23",
          team: "Alzira FS",
          games: 30,
          goals: 8
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2024/2025)",
        "Supercopa Espa\xF1a  (2025/2026)"
      ]
    },
    jca10: {
      fpId: 17137,
      games: 170,
      yellow: 43,
      red: 4,
      seasons: [
        {
          s: "26",
          team: "Jimbee Cartagena FS",
          games: 6,
          goals: 1
        },
        {
          s: "25",
          team: "Jimbee Cartagena FS",
          games: 29,
          goals: 12
        },
        {
          s: "24",
          team: "Jimbee Cartagena FS",
          games: 45,
          goals: 17
        },
        {
          s: "23",
          team: "Quesos El Higaldo Manzanares FS",
          games: 32,
          goals: 17
        },
        {
          s: "22",
          team: "Quesos El Higaldo Manzanares FS",
          games: 30,
          goals: 12
        },
        {
          s: "21",
          team: "Quesos El Higaldo Manzanares FS",
          games: 28,
          goals: 6
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2024/2025)",
        "Supercopa Espa\xF1a  (2025/2026)",
        "Campeonato da Europa (2025/2026)"
      ]
    },
    jca11: {
      fpId: 27964,
      games: 11,
      yellow: 1,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Jimbee Cartagena FS",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "Jimbee Cartagena FS",
          games: 4,
          goals: 0
        }
      ],
      titles: []
    },
    jca12: {
      fpId: 6824,
      games: 191,
      yellow: 43,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Jimbee Cartagena FS",
          games: 4,
          goals: 0
        },
        {
          s: "25",
          team: "Jimbee Cartagena FS",
          games: 42,
          goals: 13
        },
        {
          s: "24",
          team: "Jimbee Cartagena FS",
          games: 44,
          goals: 12
        },
        {
          s: "23",
          team: "Jimbee Cartagena FS",
          games: 40,
          goals: 8
        },
        {
          s: "22",
          team: "Jimbee Cartagena FS",
          games: 31,
          goals: 9
        },
        {
          s: "21",
          team: "Jimbee Cartagena FS",
          games: 30,
          goals: 8
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2023/2024, 2024/2025)",
        "Supercopa Espa\xF1a  (2023/2024, 2025/2026)",
        "Campeonato da Europa (2025/2026)"
      ]
    },
    jca13: {
      fpId: 27965,
      games: 27,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Jimbee Cartagena FS",
          games: 8,
          goals: 0
        },
        {
          s: "25",
          team: "Jimbee Cartagena FS",
          games: 19,
          goals: 2
        }
      ],
      titles: [
        "Supercopa Espa\xF1a  (2025/2026)"
      ]
    },
    jca14: {
      fpId: 17132,
      games: 193,
      yellow: 40,
      red: 3,
      seasons: [
        {
          s: "26",
          team: "Jimbee Cartagena FS",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "Jimbee Cartagena FS",
          games: 40,
          goals: 18
        },
        {
          s: "24",
          team: "Jimbee Cartagena FS",
          games: 44,
          goals: 21
        },
        {
          s: "23",
          team: "Jimbee Cartagena FS",
          games: 36,
          goals: 25
        },
        {
          s: "22",
          team: "Jimbee Cartagena FS",
          games: 34,
          goals: 22
        },
        {
          s: "21",
          team: "Jimbee Cartagena FS",
          games: 32,
          goals: 10
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2023/2024, 2024/2025)",
        "Supercopa Espa\xF1a  (2023/2024, 2025/2026)"
      ]
    },
    jca15: {
      fpId: 192,
      games: 186,
      yellow: 59,
      red: 4,
      seasons: [
        {
          s: "26",
          team: "Jimbee Cartagena FS",
          games: 5,
          goals: 3
        },
        {
          s: "25",
          team: "Jimbee Cartagena FS",
          games: 43,
          goals: 22
        },
        {
          s: "24",
          team: "Jimbee Cartagena FS",
          games: 34,
          goals: 14
        },
        {
          s: "23",
          team: "Jimbee Cartagena FS",
          games: 33,
          goals: 15
        },
        {
          s: "22",
          team: "Jimbee Cartagena FS",
          games: 34,
          goals: 16
        },
        {
          s: "21",
          team: "Sporting CP",
          games: 37,
          goals: 19
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2023/2024, 2024/2025)",
        "Supercopa Espa\xF1a  (2023/2024, 2025/2026)",
        "Liga Placard (2021/2022)",
        "Ta\xE7a da Liga (2021/2022)",
        "Ta\xE7a de Portugal (2021/2022)"
      ]
    },
    jca16: {
      fpId: 58803,
      games: 1,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Jimbee Cartagena FS",
          games: 1,
          goals: 1
        }
      ],
      titles: []
    },
    jca17: {
      fpId: 21209,
      games: 140,
      yellow: 32,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Jimbee Cartagena FS",
          games: 9,
          goals: 4
        },
        {
          s: "25",
          team: "Jimbee Cartagena FS",
          games: 45,
          goals: 21
        },
        {
          s: "24",
          team: "Jimbee Cartagena FS",
          games: 37,
          goals: 9
        },
        {
          s: "23",
          team: "C\xF3rdoba Patrimonio",
          games: 27,
          goals: 14
        },
        {
          s: "22",
          team: "C\xF3rdoba Patrimonio",
          games: 22,
          goals: 4
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2024/2025)",
        "Supercopa Espa\xF1a  (2025/2026)"
      ]
    },
    jca18: {
      fpId: 23491,
      games: 150,
      yellow: 36,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Jimbee Cartagena FS",
          games: 7,
          goals: 2
        },
        {
          s: "25",
          team: "Jimbee Cartagena FS",
          games: 39,
          goals: 18
        },
        {
          s: "24",
          team: "Jimbee Cartagena FS",
          games: 48,
          goals: 30
        },
        {
          s: "23",
          team: "Jimbee Cartagena FS",
          games: 39,
          goals: 12
        },
        {
          s: "22",
          team: "Jimbee Cartagena FS",
          games: 17,
          goals: 4
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2023/2024, 2024/2025)",
        "Supercopa Espa\xF1a  (2023/2024, 2025/2026)",
        "Campeonato da Europa (2025/2026)"
      ]
    },
    osa01: {
      fpId: 674,
      games: 149,
      yellow: 31,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Osasuna Magna Xota FS",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "Osasuna Magna Xota FS",
          games: 30,
          goals: 1
        },
        {
          s: "24",
          team: "Osasuna Magna Xota FS",
          games: 31,
          goals: 2
        },
        {
          s: "23",
          team: "Osasuna Magna Xota FS",
          games: 29,
          goals: 0
        },
        {
          s: "22",
          team: "Osasuna Magna Xota FS",
          games: 23,
          goals: 1
        },
        {
          s: "21",
          team: "Osasuna Magna Xota FS",
          games: 30,
          goals: 1
        }
      ],
      titles: []
    },
    osa02: {
      fpId: 22408,
      games: 16,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Osasuna Magna Xota FS",
          games: 6,
          goals: 0
        },
        {
          s: "22",
          team: "Osasuna Magna Xota FS",
          games: 8,
          goals: 0
        },
        {
          s: "21",
          team: "Osasuna Magna Xota FS",
          games: 2,
          goals: 0
        }
      ],
      titles: []
    },
    osa03: {
      fpId: 66388,
      games: 6,
      yellow: 1,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Osasuna Magna Xota FS",
          games: 6,
          goals: 0
        }
      ],
      titles: []
    },
    osa04: {
      fpId: 17557,
      games: 24,
      yellow: 1,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Osasuna Magna Xota FS",
          games: 6,
          goals: 0
        },
        {
          s: "24",
          team: "Halad\xE1s VSE",
          games: 3,
          goals: 0
        },
        {
          s: "23",
          team: "Halad\xE1s VSE",
          games: 6,
          goals: 0
        },
        {
          s: "22",
          team: "Halad\xE1s VSE",
          games: 3,
          goals: 0
        },
        {
          s: "21",
          team: "Halad\xE1s VSE",
          games: 6,
          goals: 1
        }
      ],
      titles: []
    },
    osa05: {
      fpId: 11465,
      games: 135,
      yellow: 38,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Osasuna Magna Xota FS",
          games: 6,
          goals: 4
        },
        {
          s: "25",
          team: "Osasuna Magna Xota FS",
          games: 26,
          goals: 6
        },
        {
          s: "24",
          team: "Osasuna Magna Xota FS",
          games: 29,
          goals: 11
        },
        {
          s: "23",
          team: "Osasuna Magna Xota FS",
          games: 16,
          goals: 1
        },
        {
          s: "22",
          team: "Osasuna Magna Xota FS",
          games: 28,
          goals: 0
        },
        {
          s: "21",
          team: "Osasuna Magna Xota FS",
          games: 30,
          goals: 1
        }
      ],
      titles: [
        "Campeonato Europa Sub 19 (2022/2023)"
      ]
    },
    osa06: {
      fpId: 21377,
      games: 28,
      yellow: 5,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Osasuna Magna Xota FS",
          games: 3,
          goals: 2
        },
        {
          s: "24",
          team: "Ribera Navarra FS",
          games: 15,
          goals: 1
        },
        {
          s: "23",
          team: "Royal Sporting Anderlecht Futsal",
          games: 9,
          goals: 0
        },
        {
          s: "22",
          team: "FC Barcelona",
          games: 1,
          goals: 0
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2022/2023)"
      ]
    },
    osa07: {
      fpId: 27963,
      games: 21,
      yellow: 1,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Osasuna Magna Xota FS",
          games: 6,
          goals: 1
        },
        {
          s: "25",
          team: "Osasuna Magna Xota FS",
          games: 15,
          goals: 0
        }
      ],
      titles: []
    },
    osa08: {
      fpId: 66422,
      games: 7,
      yellow: 1,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Osasuna Magna Xota FS",
          games: 6,
          goals: 1
        },
        {
          s: "24",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    osa09: {
      fpId: 16990,
      games: 5,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Osasuna Magna Xota FS",
          games: 2,
          goals: 0
        },
        {
          s: "23",
          team: "FC Differdange 03",
          games: 3,
          goals: 1
        }
      ],
      titles: []
    },
    osa10: {
      fpId: 66389,
      games: 5,
      yellow: 1,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Osasuna Magna Xota FS",
          games: 5,
          goals: 0
        }
      ],
      titles: []
    },
    osa11: {
      fpId: 25807,
      games: 19,
      yellow: 2,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Osasuna Magna Xota FS",
          games: 3,
          goals: 0
        },
        {
          s: "23",
          team: "Pe\xF1\xEDscola FS",
          games: 13,
          goals: 0
        },
        {
          s: "21",
          team: "Burela FS",
          games: 3,
          goals: 0
        }
      ],
      titles: []
    },
    osa12: {
      fpId: 28261,
      games: 6,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Osasuna Magna Xota FS",
          games: 4,
          goals: 0
        },
        {
          s: "25",
          team: "Osasuna Magna Xota FS",
          games: 2,
          goals: 0
        }
      ],
      titles: []
    },
    osa13: {
      fpId: 26391,
      games: 63,
      yellow: 2,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Osasuna Magna Xota FS",
          games: 5,
          goals: 2
        },
        {
          s: "25",
          team: "Osasuna Magna Xota FS",
          games: 30,
          goals: 5
        },
        {
          s: "24",
          team: "Osasuna Magna Xota FS",
          games: 28,
          goals: 1
        }
      ],
      titles: []
    },
    osa14: {
      fpId: 5173,
      games: 70,
      yellow: 14,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Osasuna Magna Xota FS",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "S\xE3o Louren\xE7o",
          games: 1,
          goals: 0
        },
        {
          s: "24",
          team: "MNK Olmissum",
          games: 5,
          goals: 3
        },
        {
          s: "22",
          team: "Ribera Navarra FS",
          games: 30,
          goals: 6
        },
        {
          s: "21",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 28,
          goals: 7
        }
      ],
      titles: []
    },
    osa15: {
      fpId: 66391,
      games: 5,
      yellow: 1,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Osasuna Magna Xota FS",
          games: 5,
          goals: 0
        }
      ],
      titles: []
    },
    osaj01: {
      fpId: 23798,
      games: 9,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Osasuna Magna Xota FS",
          games: 1,
          goals: 0
        },
        {
          s: "23",
          team: "Osasuna Magna Xota FS",
          games: 8,
          goals: 0
        }
      ],
      titles: []
    },
    int01: {
      fpId: 6850,
      games: 112,
      yellow: 11,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Inter FS",
          games: 3,
          goals: 0
        },
        {
          s: "25",
          team: "Ribera Navarra FS",
          games: 29,
          goals: 0
        },
        {
          s: "24",
          team: "Ribera Navarra FS",
          games: 30,
          goals: 0
        },
        {
          s: "22",
          team: "Levante UD",
          games: 29,
          goals: 0
        },
        {
          s: "21",
          team: "Levante UD",
          games: 21,
          goals: 0
        }
      ],
      titles: []
    },
    int02: {
      fpId: 14930,
      games: 165,
      yellow: 4,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Inter FS",
          games: 1,
          goals: 0
        },
        {
          s: "25",
          team: "Inter FS",
          games: 34,
          goals: 0
        },
        {
          s: "24",
          team: "Inter FS",
          games: 34,
          goals: 0
        },
        {
          s: "23",
          team: "Inter FS",
          games: 24,
          goals: 0
        },
        {
          s: "22",
          team: "Inter FS",
          games: 38,
          goals: 0
        },
        {
          s: "21",
          team: "Inter FS",
          games: 34,
          goals: 0
        }
      ],
      titles: [
        "Copa de Espa\xF1a (2020/2021, 2020/2021, 2020/2021, 2024/2025, 2024/2025)",
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2017/2018)"
      ]
    },
    int03: {
      fpId: 66408,
      games: 3,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Inter FS",
          games: 3,
          goals: 0
        }
      ],
      titles: []
    },
    int04: {
      fpId: 473,
      games: 164,
      yellow: 25,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Inter FS",
          games: 7,
          goals: 1
        },
        {
          s: "25",
          team: "Inter FS",
          games: 33,
          goals: 0
        },
        {
          s: "24",
          team: "Inter FS",
          games: 34,
          goals: 2
        },
        {
          s: "23",
          team: "Inter FS",
          games: 32,
          goals: 1
        },
        {
          s: "22",
          team: "Inter FS",
          games: 36,
          goals: 0
        },
        {
          s: "21",
          team: "Inter FS",
          games: 22,
          goals: 0
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2013/2014, 2014/2015, 2015/2016, 2016/2017, 2017/2018, 2019/2020)",
        "Copa de Espa\xF1a (2020/2021, 2020/2021, 2020/2021, 2024/2025, 2024/2025)",
        "UEFA Futsal Champions League (2008/2009, 2016/2017, 2017/2018)",
        "Campeonato da Europa (2015/2016)",
        "Supercopa Espa\xF1a  (2018/2019)"
      ]
    },
    int05: {
      fpId: 28259,
      games: 1,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "25",
          team: "Inter FS",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    int06: {
      fpId: 13830,
      games: 143,
      yellow: 30,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Inter FS",
          games: 7,
          goals: 2
        },
        {
          s: "25",
          team: "Quesos El Higaldo Manzanares FS",
          games: 33,
          goals: 9
        },
        {
          s: "24",
          team: "Osasuna Magna Xota FS",
          games: 32,
          goals: 4
        },
        {
          s: "23",
          team: "Osasuna Magna Xota FS",
          games: 28,
          goals: 7
        },
        {
          s: "22",
          team: "Osasuna Magna Xota FS",
          games: 28,
          goals: 3
        },
        {
          s: "21",
          team: "Osasuna Magna Xota FS",
          games: 15,
          goals: 3
        }
      ],
      titles: []
    },
    int07: {
      fpId: 650,
      games: 125,
      yellow: 49,
      red: 3,
      seasons: [
        {
          s: "26",
          team: "Inter FS",
          games: 7,
          goals: 1
        },
        {
          s: "25",
          team: "Inter FS",
          games: 31,
          goals: 11
        },
        {
          s: "24",
          team: "Inter FS",
          games: 20,
          goals: 5
        },
        {
          s: "23",
          team: "Inter FS",
          games: 28,
          goals: 10
        },
        {
          s: "22",
          team: "Inter FS",
          games: 18,
          goals: 6
        },
        {
          s: "21",
          team: "Inter FS",
          games: 21,
          goals: 2
        }
      ],
      titles: [
        "Copa de Espa\xF1a (2020/2021, 2020/2021, 2020/2021, 2024/2025, 2024/2025)",
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2015/2016, 2016/2017, 2019/2020)",
        "UEFA Futsal Champions League (2016/2017)",
        "Supercopa Espa\xF1a  (2020/2021)",
        "Campeonato da Europa (2025/2026)"
      ]
    },
    int08: {
      fpId: 752,
      games: 96,
      yellow: 14,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Inter FS",
          games: 7,
          goals: 3
        },
        {
          s: "25",
          team: "Inter FS",
          games: 32,
          goals: 14
        },
        {
          s: "24",
          team: "Pe\xF1\xEDscola FS",
          games: 26,
          goals: 24
        },
        {
          s: "23",
          team: "Pe\xF1\xEDscola FS",
          games: 30,
          goals: 27
        },
        {
          s: "22",
          team: "Pe\xF1\xEDscola FS",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    int09: {
      fpId: 21376,
      games: 63,
      yellow: 13,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Inter FS",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "Inter FS",
          games: 31,
          goals: 12
        },
        {
          s: "23",
          team: "FC Barcelona",
          games: 16,
          goals: 1
        },
        {
          s: "22",
          team: "FC Barcelona",
          games: 9,
          goals: 0
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2022/2023)"
      ]
    },
    int10: {
      fpId: 6864,
      games: 169,
      yellow: 38,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Inter FS",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "Inter FS",
          games: 33,
          goals: 15
        },
        {
          s: "24",
          team: "Inter FS",
          games: 26,
          goals: 9
        },
        {
          s: "23",
          team: "Inter FS",
          games: 33,
          goals: 21
        },
        {
          s: "22",
          team: "Inter FS",
          games: 36,
          goals: 14
        },
        {
          s: "21",
          team: "Inter FS",
          games: 34,
          goals: 11
        }
      ],
      titles: [
        "Copa de Espa\xF1a (2024/2025, 2024/2025)"
      ]
    },
    int11: {
      fpId: 617,
      games: 137,
      yellow: 35,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Inter FS",
          games: 7,
          goals: 4
        },
        {
          s: "25",
          team: "Inter FS",
          games: 33,
          goals: 27
        },
        {
          s: "24",
          team: "Inter FS",
          games: 27,
          goals: 10
        },
        {
          s: "23",
          team: "Jimbee Cartagena FS",
          games: 28,
          goals: 9
        },
        {
          s: "22",
          team: "Jimbee Cartagena FS",
          games: 28,
          goals: 7
        },
        {
          s: "21",
          team: "Jimbee Cartagena FS",
          games: 14,
          goals: 11
        }
      ],
      titles: [
        "Copa de Espa\xF1a (2024/2025, 2024/2025)",
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2023/2024)"
      ]
    },
    int12: {
      fpId: 20736,
      games: 7,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Inter FS",
          games: 7,
          goals: 0
        }
      ],
      titles: []
    },
    int13: {
      fpId: 465,
      games: 206,
      yellow: 51,
      red: 3,
      seasons: [
        {
          s: "26",
          team: "Inter FS",
          games: 7,
          goals: 2
        },
        {
          s: "25",
          team: "Islas Baleares Palma Futsal",
          games: 36,
          goals: 14
        },
        {
          s: "24",
          team: "Islas Baleares Palma Futsal",
          games: 44,
          goals: 16
        },
        {
          s: "23",
          team: "Islas Baleares Palma Futsal",
          games: 43,
          goals: 13
        },
        {
          s: "22",
          team: "Islas Baleares Palma Futsal",
          games: 41,
          goals: 15
        },
        {
          s: "21",
          team: "Levante UD",
          games: 35,
          goals: 9
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2013/2014, 2014/2015, 2015/2016, 2016/2017, 2018/2019)",
        "UEFA Futsal Champions League (2016/2017, 2019/2020, 2022/2023, 2023/2024, 2024/2025)",
        "Copa de Espa\xF1a (2017/2018, 2018/2019, 2019/2020)",
        "Campeonato da Europa (2015/2016, 2025/2026)",
        "Supercopa Espa\xF1a  (2019/2020)"
      ]
    },
    int14: {
      fpId: 162,
      games: 179,
      yellow: 28,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Inter FS",
          games: 7,
          goals: 1
        },
        {
          s: "25",
          team: "Inter FS",
          games: 31,
          goals: 4
        },
        {
          s: "24",
          team: "Inter FS",
          games: 32,
          goals: 13
        },
        {
          s: "23",
          team: "Islas Baleares Palma Futsal",
          games: 46,
          goals: 8
        },
        {
          s: "22",
          team: "Islas Baleares Palma Futsal",
          games: 41,
          goals: 7
        },
        {
          s: "21",
          team: "Islas Baleares Palma Futsal",
          games: 22,
          goals: 4
        }
      ],
      titles: [
        "Ta\xE7a de Portugal (2014/2015, 2016/2017)",
        "Liga Placard (2014/2015, 2018/2019)",
        "Superta\xE7a (2015/2016, 2016/2017)",
        "Ta\xE7a da Liga (2018/2019, 2019/2020)",
        "UEFA Futsal Champions League (2022/2023, 2023/2024)",
        "Copa de Espa\xF1a (2024/2025, 2024/2025)"
      ]
    },
    int15: {
      fpId: 717,
      games: 179,
      yellow: 47,
      red: 4,
      seasons: [
        {
          s: "26",
          team: "Inter FS",
          games: 7,
          goals: 4
        },
        {
          s: "25",
          team: "Inter FS",
          games: 33,
          goals: 19
        },
        {
          s: "24",
          team: "Inter FS",
          games: 34,
          goals: 25
        },
        {
          s: "23",
          team: "Inter FS",
          games: 31,
          goals: 14
        },
        {
          s: "22",
          team: "Inter FS",
          games: 39,
          goals: 16
        },
        {
          s: "21",
          team: "Inter FS",
          games: 35,
          goals: 20
        }
      ],
      titles: [
        "Copa de Espa\xF1a (2020/2021, 2020/2021, 2020/2021, 2024/2025, 2024/2025)",
        "Supercopa Espa\xF1a  (2020/2021)",
        "Campeonato da Europa (2025/2026)"
      ]
    },
    int16: {
      fpId: 19650,
      games: 134,
      yellow: 24,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Inter FS",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 30,
          goals: 16
        },
        {
          s: "24",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 27,
          goals: 14
        },
        {
          s: "23",
          team: "GCR Nun\u2019\xC1lvares",
          games: 27,
          goals: 22
        },
        {
          s: "22",
          team: "GCR Nun\u2019\xC1lvares",
          games: 35,
          goals: 10
        },
        {
          s: "21",
          team: "GCR Nun\u2019\xC1lvares",
          games: 8,
          goals: 4
        }
      ],
      titles: []
    },
    int17: {
      fpId: 11160,
      games: 103,
      yellow: 21,
      red: 0,
      seasons: [
        {
          s: "24",
          team: "Islas Baleares Palma Futsal",
          games: 39,
          goals: 15
        },
        {
          s: "23",
          team: "Islas Baleares Palma Futsal",
          games: 40,
          goals: 17
        },
        {
          s: "22",
          team: "Islas Baleares Palma Futsal",
          games: 5,
          goals: 4
        },
        {
          s: "21",
          team: "Islas Baleares Palma Futsal",
          games: 19,
          goals: 3
        }
      ],
      titles: [
        "UEFA Futsal Champions League (2023/2024, 2024/2025)",
        "Campeonato Europa Sub 19 (2019/2020)",
        "Montaigu Futsal Cup (2019/2020)",
        "Campeonato da Europa (2025/2026)"
      ]
    },
    int18: {
      fpId: 21217,
      games: 133,
      yellow: 52,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Inter FS",
          games: 7,
          goals: 3
        },
        {
          s: "25",
          team: "Inter FS",
          games: 34,
          goals: 5
        },
        {
          s: "24",
          team: "Noia Portus Apostoli",
          games: 30,
          goals: 21
        },
        {
          s: "23",
          team: "Noia Portus Apostoli",
          games: 30,
          goals: 20
        },
        {
          s: "22",
          team: "Noia Portus Apostoli",
          games: 32,
          goals: 6
        }
      ],
      titles: []
    },
    noi02: {
      fpId: 5713,
      games: 50,
      yellow: 3,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Noia Portus Apostoli",
          games: 5,
          goals: 0
        },
        {
          s: "25",
          team: "Jaragu\xE1 Futsal",
          games: 28,
          goals: 1
        },
        {
          s: "21",
          team: "SC Ferreira do Z\xEAzere/Z\xEAzerovo",
          games: 17,
          goals: 0
        }
      ],
      titles: [
        "LNF (2025/2026)"
      ]
    },
    noi03: {
      fpId: 29071,
      games: 4,
      yellow: 2,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Noia Portus Apostoli",
          games: 3,
          goals: 0
        },
        {
          s: "25",
          team: "Noia Portus Apostoli",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    noi04: {
      fpId: 5702,
      games: 54,
      yellow: 7,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Noia Portus Apostoli",
          games: 2,
          goals: 0
        },
        {
          s: "25",
          team: "Noia Portus Apostoli",
          games: 18,
          goals: 0
        },
        {
          s: "24",
          team: "Noia Portus Apostoli",
          games: 21,
          goals: 0
        },
        {
          s: "21",
          team: "Foz Cataratas Futsal",
          games: 13,
          goals: 0
        }
      ],
      titles: []
    },
    noi05: {
      fpId: 66387,
      games: 0,
      yellow: 0,
      red: 0,
      seasons: [],
      titles: []
    },
    noi06: {
      fpId: 9129,
      games: 83,
      yellow: 12,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Noia Portus Apostoli",
          games: 5,
          goals: 3
        },
        {
          s: "25",
          team: "Ribera Navarra FS",
          games: 29,
          goals: 6
        },
        {
          s: "24",
          team: "C\xF3rdoba Patrimonio",
          games: 27,
          goals: 5
        },
        {
          s: "23",
          team: "C\xF3rdoba Patrimonio",
          games: 17,
          goals: 3
        },
        {
          s: "22",
          team: "Uragan Ivano-Frankivsk",
          games: 5,
          goals: 4
        }
      ],
      titles: []
    },
    noi07: {
      fpId: 26719,
      games: 59,
      yellow: 18,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Noia Portus Apostoli",
          games: 5,
          goals: 1
        },
        {
          s: "25",
          team: "Osasuna Magna Xota FS",
          games: 29,
          goals: 2
        },
        {
          s: "24",
          team: "ADCR Caxinas",
          games: 25,
          goals: 9
        }
      ],
      titles: []
    },
    noi08: {
      fpId: 26414,
      games: 59,
      yellow: 5,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Noia Portus Apostoli",
          games: 1,
          goals: 0
        },
        {
          s: "25",
          team: "Noia Portus Apostoli",
          games: 29,
          goals: 4
        },
        {
          s: "24",
          team: "Noia Portus Apostoli",
          games: 29,
          goals: 1
        }
      ],
      titles: []
    },
    noi09: {
      fpId: 67598,
      games: 1,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Noia Portus Apostoli",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    noi10: {
      fpId: 26422,
      games: 70,
      yellow: 13,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Noia Portus Apostoli",
          games: 5,
          goals: 1
        },
        {
          s: "25",
          team: "Noia Portus Apostoli",
          games: 30,
          goals: 10
        },
        {
          s: "24",
          team: "Noia Portus Apostoli",
          games: 18,
          goals: 2
        },
        {
          s: "24",
          team: "Islas Baleares Palma Futsal",
          games: 17,
          goals: 6
        }
      ],
      titles: [
        "UEFA Futsal Champions League (2024/2025)"
      ]
    },
    noi11: {
      fpId: 26387,
      games: 34,
      yellow: 1,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Noia Portus Apostoli",
          games: 5,
          goals: 1
        },
        {
          s: "24",
          team: "Burela FS",
          games: 29,
          goals: 5
        }
      ],
      titles: []
    },
    noi12: {
      fpId: 616,
      games: 143,
      yellow: 29,
      red: 5,
      seasons: [
        {
          s: "26",
          team: "Noia Portus Apostoli",
          games: 4,
          goals: 0
        },
        {
          s: "25",
          team: "Noia Portus Apostoli",
          games: 20,
          goals: 2
        },
        {
          s: "24",
          team: "Noia Portus Apostoli",
          games: 28,
          goals: 6
        },
        {
          s: "23",
          team: "Inter FS",
          games: 33,
          goals: 9
        },
        {
          s: "22",
          team: "Inter FS",
          games: 16,
          goals: 5
        },
        {
          s: "22",
          team: "Levante UD",
          games: 14,
          goals: 6
        },
        {
          s: "21",
          team: "Levante UD",
          games: 28,
          goals: 8
        }
      ],
      titles: []
    },
    noi13: {
      fpId: 662,
      games: 108,
      yellow: 24,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Noia Portus Apostoli",
          games: 3,
          goals: 2
        },
        {
          s: "25",
          team: "Noia Portus Apostoli",
          games: 19,
          goals: 7
        },
        {
          s: "24",
          team: "Noia Portus Apostoli",
          games: 30,
          goals: 9
        },
        {
          s: "23",
          team: "Noia Portus Apostoli",
          games: 27,
          goals: 12
        },
        {
          s: "21",
          team: "Burela FS",
          games: 29,
          goals: 12
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2014/2015, 2016/2017)",
        "UEFA Futsal Champions League (2016/2017)"
      ]
    },
    noi14: {
      fpId: 15243,
      games: 106,
      yellow: 17,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Noia Portus Apostoli",
          games: 5,
          goals: 1
        },
        {
          s: "25",
          team: "Pe\xF1\xEDscola FS",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "Noia Portus Apostoli",
          games: 23,
          goals: 8
        },
        {
          s: "24",
          team: "Noia Portus Apostoli",
          games: 20,
          goals: 4
        },
        {
          s: "23",
          team: "Noia Portus Apostoli",
          games: 21,
          goals: 8
        },
        {
          s: "22",
          team: "Noia Portus Apostoli",
          games: 30,
          goals: 4
        }
      ],
      titles: []
    },
    noi15: {
      fpId: 29052,
      games: 10,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Noia Portus Apostoli",
          games: 4,
          goals: 0
        },
        {
          s: "25",
          team: "Noia Portus Apostoli",
          games: 6,
          goals: 1
        }
      ],
      titles: []
    },
    noi16: {
      fpId: 6184,
      games: 111,
      yellow: 16,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Noia Portus Apostoli",
          games: 5,
          goals: 0
        },
        {
          s: "25",
          team: "Noia Portus Apostoli",
          games: 16,
          goals: 2
        },
        {
          s: "24",
          team: "C\xF3rdoba Patrimonio",
          games: 27,
          goals: 1
        },
        {
          s: "23",
          team: "Sporting CP",
          games: 43,
          goals: 2
        },
        {
          s: "22",
          team: "Sporting CP",
          games: 7,
          goals: 1
        },
        {
          s: "21",
          team: "Sporting CP",
          games: 13,
          goals: 3
        }
      ],
      titles: [
        "Liga Placard (2021/2022, 2021/2022, 2022/2023, 2022/2023, 2023/2024)",
        "Ta\xE7a Nacional Sub 15 (2018/2019, 2018/2019)",
        "Ta\xE7a de Portugal (2021/2022, 2021/2022)",
        "Campeonato Nacional Sub 19 (2022/2023, 2022/2023)",
        "Ta\xE7a da Liga (2023/2024)",
        "Campeonato Europa Sub 19 (2023/2024)"
      ]
    },
    noi17: {
      fpId: 10645,
      games: 42,
      yellow: 3,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Noia Portus Apostoli",
          games: 5,
          goals: 2
        },
        {
          s: "25",
          team: "Noia Portus Apostoli",
          games: 30,
          goals: 13
        },
        {
          s: "21",
          team: "Foz Cataratas Futsal",
          games: 7,
          goals: 1
        }
      ],
      titles: []
    },
    noi18: {
      fpId: 27911,
      games: 17,
      yellow: 3,
      red: 0,
      seasons: [
        {
          s: "25",
          team: "Noia Portus Apostoli",
          games: 17,
          goals: 2
        }
      ],
      titles: []
    },
    noi19: {
      fpId: 27643,
      games: 29,
      yellow: 3,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Noia Portus Apostoli",
          games: 5,
          goals: 2
        },
        {
          s: "25",
          team: "Inter FS",
          games: 16,
          goals: 0
        },
        {
          s: "24",
          team: "Inter FS",
          games: 8,
          goals: 0
        }
      ],
      titles: []
    },
    noi20: {
      fpId: 14321,
      games: 86,
      yellow: 30,
      red: 4,
      seasons: [
        {
          s: "26",
          team: "Noia Portus Apostoli",
          games: 4,
          goals: 1
        },
        {
          s: "25",
          team: "Noia Portus Apostoli",
          games: 30,
          goals: 21
        },
        {
          s: "24",
          team: "Real Betis Futsal",
          games: 2,
          goals: 0
        },
        {
          s: "22",
          team: "C\xF3rdoba Patrimonio",
          games: 26,
          goals: 2
        },
        {
          s: "21",
          team: "C\xF3rdoba Patrimonio",
          games: 24,
          goals: 3
        }
      ],
      titles: []
    },
    par01: {
      fpId: 66425,
      games: 1,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "O Parrulo Ferrol",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    par02: {
      fpId: 15483,
      games: 94,
      yellow: 5,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "O Parrulo Ferrol",
          games: 4,
          goals: 0
        },
        {
          s: "25",
          team: "Osasuna Magna Xota FS",
          games: 24,
          goals: 0
        },
        {
          s: "24",
          team: "Osasuna Magna Xota FS",
          games: 30,
          goals: 0
        },
        {
          s: "23",
          team: "Osasuna Magna Xota FS",
          games: 29,
          goals: 0
        },
        {
          s: "22",
          team: "ElPozo Murcia",
          games: 7,
          goals: 0
        }
      ],
      titles: [
        "Campeonato Europa Sub 19 (2022/2023)"
      ]
    },
    par03: {
      fpId: 28936,
      games: 36,
      yellow: 1,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "O Parrulo Ferrol",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "Santo Andr\xE9",
          games: 17,
          goals: 1
        },
        {
          s: "25",
          team: "O Parrulo Ferrol",
          games: 12,
          goals: 0
        }
      ],
      titles: []
    },
    par04: {
      fpId: 66409,
      games: 3,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "O Parrulo Ferrol",
          games: 3,
          goals: 0
        }
      ],
      titles: []
    },
    par05: {
      fpId: 737,
      games: 37,
      yellow: 17,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "O Parrulo Ferrol",
          games: 7,
          goals: 4
        },
        {
          s: "25",
          team: "O Parrulo Ferrol",
          games: 30,
          goals: 8
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2013/2014, 2014/2015)"
      ]
    },
    par06: {
      fpId: 15757,
      games: 46,
      yellow: 10,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "O Parrulo Ferrol",
          games: 7,
          goals: 3
        },
        {
          s: "25",
          team: "Joinville",
          games: 19,
          goals: 8
        },
        {
          s: "25",
          team: "Jimbee Cartagena FS",
          games: 20,
          goals: 3
        }
      ],
      titles: []
    },
    par07: {
      fpId: 13870,
      games: 40,
      yellow: 6,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "O Parrulo Ferrol",
          games: 7,
          goals: 0
        },
        {
          s: "24",
          team: "Burela FS",
          games: 29,
          goals: 1
        },
        {
          s: "22",
          team: "Real Betis Futsal",
          games: 3,
          goals: 0
        },
        {
          s: "21",
          team: "Real Betis Futsal",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    par08: {
      fpId: 27902,
      games: 35,
      yellow: 9,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "O Parrulo Ferrol",
          games: 7,
          goals: 7
        },
        {
          s: "25",
          team: "O Parrulo Ferrol",
          games: 28,
          goals: 10
        }
      ],
      titles: [
        "Campeonato da Europa (2025/2026)"
      ]
    },
    par09: {
      fpId: 66410,
      games: 36,
      yellow: 4,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "O Parrulo Ferrol",
          games: 7,
          goals: 3
        },
        {
          s: "25",
          team: "Jaragu\xE1 Futsal",
          games: 29,
          goals: 15
        }
      ],
      titles: [
        "LNF (2025/2026)"
      ]
    },
    par10: {
      fpId: 15822,
      games: 94,
      yellow: 12,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "O Parrulo Ferrol",
          games: 7,
          goals: 1
        },
        {
          s: "25",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 32,
          goals: 4
        },
        {
          s: "24",
          team: "Burela FS",
          games: 29,
          goals: 10
        },
        {
          s: "21",
          team: "Burela FS",
          games: 15,
          goals: 4
        },
        {
          s: "21",
          team: "Juventude AG",
          games: 11,
          goals: 10
        }
      ],
      titles: [
        "Copa de Espa\xF1a (2025/2026, 2025/2026)"
      ]
    },
    par11: {
      fpId: 16182,
      games: 39,
      yellow: 13,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "O Parrulo Ferrol",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "O Parrulo Ferrol",
          games: 30,
          goals: 9
        },
        {
          s: "21",
          team: "Jaragu\xE1 Futsal",
          games: 2,
          goals: 3
        }
      ],
      titles: []
    },
    par12: {
      fpId: 11030,
      games: 53,
      yellow: 13,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "O Parrulo Ferrol",
          games: 7,
          goals: 1
        },
        {
          s: "25",
          team: "O Parrulo Ferrol",
          games: 30,
          goals: 22
        },
        {
          s: "24",
          team: "Halad\xE1s VSE",
          games: 3,
          goals: 0
        },
        {
          s: "21",
          team: "Blumenau",
          games: 13,
          goals: 1
        }
      ],
      titles: []
    },
    par13: {
      fpId: 66411,
      games: 5,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "O Parrulo Ferrol",
          games: 5,
          goals: 0
        }
      ],
      titles: []
    },
    par14: {
      fpId: 66423,
      games: 39,
      yellow: 15,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Pato Futsal",
          games: 14,
          goals: 1
        },
        {
          s: "26",
          team: "O Parrulo Ferrol",
          games: 7,
          goals: 3
        },
        {
          s: "25",
          team: "Pato Futsal",
          games: 18,
          goals: 3
        }
      ],
      titles: []
    },
    par15: {
      fpId: 26386,
      games: 61,
      yellow: 21,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "O Parrulo Ferrol",
          games: 6,
          goals: 2
        },
        {
          s: "25",
          team: "O Parrulo Ferrol",
          games: 12,
          goals: 2
        },
        {
          s: "25",
          team: "Ribera Navarra FS",
          games: 14,
          goals: 1
        },
        {
          s: "24",
          team: "Ribera Navarra FS",
          games: 16,
          goals: 7
        },
        {
          s: "24",
          team: "Burela FS",
          games: 13,
          goals: 3
        }
      ],
      titles: []
    },
    par16: {
      fpId: 27903,
      games: 28,
      yellow: 6,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "O Parrulo Ferrol",
          games: 5,
          goals: 0
        },
        {
          s: "25",
          team: "O Parrulo Ferrol",
          games: 23,
          goals: 6
        }
      ],
      titles: []
    },
    man01: {
      fpId: 23777,
      games: 53,
      yellow: 2,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Quesos El Higaldo Manzanares FS",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "Quesos El Higaldo Manzanares FS",
          games: 18,
          goals: 0
        },
        {
          s: "24",
          team: "Quesos El Higaldo Manzanares FS",
          games: 14,
          goals: 0
        },
        {
          s: "23",
          team: "Quesos El Higaldo Manzanares FS",
          games: 14,
          goals: 0
        }
      ],
      titles: []
    },
    man02: {
      fpId: 66384,
      games: 0,
      yellow: 0,
      red: 0,
      seasons: [],
      titles: []
    },
    man03: {
      fpId: 10663,
      games: 148,
      yellow: 17,
      red: 4,
      seasons: [
        {
          s: "26",
          team: "Quesos El Higaldo Manzanares FS",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "Noia Portus Apostoli",
          games: 29,
          goals: 2
        },
        {
          s: "24",
          team: "Noia Portus Apostoli",
          games: 29,
          goals: 0
        },
        {
          s: "23",
          team: "CRC Quinta dos Lombos",
          games: 23,
          goals: 3
        },
        {
          s: "22",
          team: "CRC Quinta dos Lombos",
          games: 29,
          goals: 0
        },
        {
          s: "21",
          team: "CRC Quinta dos Lombos",
          games: 30,
          goals: 1
        },
        {
          s: "21",
          team: "Cascavel Futsal",
          games: 1,
          goals: 0
        }
      ],
      titles: [
        "LNF (2021/2022)"
      ]
    },
    man04: {
      fpId: 58801,
      games: 7,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Quesos El Higaldo Manzanares FS",
          games: 7,
          goals: 1
        }
      ],
      titles: []
    },
    man05: {
      fpId: 66385,
      games: 2,
      yellow: 2,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Quesos El Higaldo Manzanares FS",
          games: 2,
          goals: 1
        }
      ],
      titles: []
    },
    man06: {
      fpId: 16185,
      games: 13,
      yellow: 2,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Quesos El Higaldo Manzanares FS",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "Riga FC",
          games: 6,
          goals: 1
        },
        {
          s: "21",
          team: "Pato Futsal",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    man07: {
      fpId: 11136,
      games: 158,
      yellow: 37,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Quesos El Higaldo Manzanares FS",
          games: 7,
          goals: 5
        },
        {
          s: "25",
          team: "Industrias Santa Coloma",
          games: 23,
          goals: 16
        },
        {
          s: "24",
          team: "Industrias Santa Coloma",
          games: 30,
          goals: 18
        },
        {
          s: "23",
          team: "Industrias Santa Coloma",
          games: 30,
          goals: 13
        },
        {
          s: "22",
          team: "Industrias Santa Coloma",
          games: 30,
          goals: 11
        },
        {
          s: "21",
          team: "FC Barcelona",
          games: 38,
          goals: 11
        }
      ],
      titles: [
        "UEFA Futsal Champions League (2019/2020, 2021/2022)",
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2020/2021, 2021/2022)",
        "Campeonato Europa Sub 19 (2019/2020)",
        "Montaigu Futsal Cup (2019/2020)",
        "Supercopa Espa\xF1a  (2021/2022)"
      ]
    },
    man08: {
      fpId: 27924,
      games: 9,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Quesos El Higaldo Manzanares FS",
          games: 1,
          goals: 0
        },
        {
          s: "25",
          team: "Quesos El Higaldo Manzanares FS",
          games: 8,
          goals: 0
        }
      ],
      titles: []
    },
    man09: {
      fpId: 629,
      games: 147,
      yellow: 34,
      red: 5,
      seasons: [
        {
          s: "26",
          team: "Quesos El Higaldo Manzanares FS",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "Quesos El Higaldo Manzanares FS",
          games: 24,
          goals: 6
        },
        {
          s: "24",
          team: "Quesos El Higaldo Manzanares FS",
          games: 28,
          goals: 6
        },
        {
          s: "23",
          team: "Quesos El Higaldo Manzanares FS",
          games: 31,
          goals: 5
        },
        {
          s: "22",
          team: "Quesos El Higaldo Manzanares FS",
          games: 29,
          goals: 4
        },
        {
          s: "21",
          team: "Quesos El Higaldo Manzanares FS",
          games: 28,
          goals: 6
        }
      ],
      titles: []
    },
    man10: {
      fpId: 10678,
      games: 158,
      yellow: 25,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Quesos El Higaldo Manzanares FS",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "Quesos El Higaldo Manzanares FS",
          games: 33,
          goals: 19
        },
        {
          s: "24",
          team: "Quesos El Higaldo Manzanares FS",
          games: 22,
          goals: 11
        },
        {
          s: "23",
          team: "Inter FS",
          games: 28,
          goals: 4
        },
        {
          s: "22",
          team: "Quesos El Higaldo Manzanares FS",
          games: 28,
          goals: 10
        },
        {
          s: "21",
          team: "Quesos El Higaldo Manzanares FS",
          games: 27,
          goals: 12
        },
        {
          s: "21",
          team: "Cascavel Futsal",
          games: 13,
          goals: 5
        }
      ],
      titles: [
        "LNF (2021/2022)"
      ]
    },
    man11: {
      fpId: 27703,
      games: 55,
      yellow: 15,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Quesos El Higaldo Manzanares FS",
          games: 7,
          goals: 3
        },
        {
          s: "25",
          team: "Quesos El Higaldo Manzanares FS",
          games: 33,
          goals: 4
        },
        {
          s: "24",
          team: "Quesos El Higaldo Manzanares FS",
          games: 15,
          goals: 1
        }
      ],
      titles: []
    },
    man12: {
      fpId: 16043,
      games: 95,
      yellow: 11,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Quesos El Higaldo Manzanares FS",
          games: 7,
          goals: 3
        },
        {
          s: "25",
          team: "Quesos El Higaldo Manzanares FS",
          games: 28,
          goals: 4
        },
        {
          s: "24",
          team: "Inter FS",
          games: 30,
          goals: 5
        },
        {
          s: "23",
          team: "Osasuna Magna Xota FS",
          games: 30,
          goals: 4
        }
      ],
      titles: [
        "Copa de Espa\xF1a (2024/2025, 2024/2025)"
      ]
    },
    man13: {
      fpId: 723,
      games: 142,
      yellow: 14,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Quesos El Higaldo Manzanares FS",
          games: 1,
          goals: 0
        },
        {
          s: "25",
          team: "Quesos El Higaldo Manzanares FS",
          games: 24,
          goals: 3
        },
        {
          s: "24",
          team: "Quesos El Higaldo Manzanares FS",
          games: 23,
          goals: 3
        },
        {
          s: "23",
          team: "Quesos El Higaldo Manzanares FS",
          games: 34,
          goals: 9
        },
        {
          s: "22",
          team: "Quesos El Higaldo Manzanares FS",
          games: 30,
          goals: 6
        },
        {
          s: "21",
          team: "Quesos El Higaldo Manzanares FS",
          games: 30,
          goals: 5
        }
      ],
      titles: []
    },
    man14: {
      fpId: 11069,
      games: 150,
      yellow: 54,
      red: 4,
      seasons: [
        {
          s: "26",
          team: "Quesos El Higaldo Manzanares FS",
          games: 7,
          goals: 3
        },
        {
          s: "25",
          team: "Quesos El Higaldo Manzanares FS",
          games: 33,
          goals: 2
        },
        {
          s: "24",
          team: "FC Barcelona",
          games: 27,
          goals: 3
        },
        {
          s: "23",
          team: "Industrias Santa Coloma",
          games: 26,
          goals: 18
        },
        {
          s: "22",
          team: "Industrias Santa Coloma",
          games: 29,
          goals: 6
        },
        {
          s: "21",
          team: "Industrias Santa Coloma",
          games: 28,
          goals: 3
        }
      ],
      titles: []
    },
    man15: {
      fpId: 633,
      games: 110,
      yellow: 50,
      red: 4,
      seasons: [
        {
          s: "26",
          team: "Quesos El Higaldo Manzanares FS",
          games: 7,
          goals: 6
        },
        {
          s: "25",
          team: "Quesos El Higaldo Manzanares FS",
          games: 32,
          goals: 14
        },
        {
          s: "24",
          team: "Quesos El Higaldo Manzanares FS",
          games: 30,
          goals: 5
        },
        {
          s: "23",
          team: "Quesos El Higaldo Manzanares FS",
          games: 32,
          goals: 9
        },
        {
          s: "21",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 9,
          goals: 2
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2011/2012)"
      ]
    },
    man16: {
      fpId: 28961,
      games: 26,
      yellow: 6,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Quesos El Higaldo Manzanares FS",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "Corinthians",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "Quesos El Higaldo Manzanares FS",
          games: 13,
          goals: 2
        }
      ],
      titles: []
    },
    man17: {
      fpId: 26418,
      games: 67,
      yellow: 19,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Quesos El Higaldo Manzanares FS",
          games: 6,
          goals: 3
        },
        {
          s: "25",
          team: "Industrias Santa Coloma",
          games: 30,
          goals: 24
        },
        {
          s: "24",
          team: "Industrias Santa Coloma",
          games: 31,
          goals: 7
        }
      ],
      titles: []
    },
    man18: {
      fpId: 66386,
      games: 0,
      yellow: 0,
      red: 0,
      seasons: [],
      titles: []
    },
    man19: {
      fpId: 17141,
      games: 161,
      yellow: 36,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Quesos El Higaldo Manzanares FS",
          games: 7,
          goals: 5
        },
        {
          s: "25",
          team: "Quesos El Higaldo Manzanares FS",
          games: 33,
          goals: 33
        },
        {
          s: "24",
          team: "Quesos El Higaldo Manzanares FS",
          games: 30,
          goals: 17
        },
        {
          s: "23",
          team: "Quesos El Higaldo Manzanares FS",
          games: 33,
          goals: 28
        },
        {
          s: "22",
          team: "Quesos El Higaldo Manzanares FS",
          games: 30,
          goals: 9
        },
        {
          s: "21",
          team: "Quesos El Higaldo Manzanares FS",
          games: 28,
          goals: 9
        }
      ],
      titles: [
        "Campeonato da Europa (2000/2001, 2004/2005, 2007/2008, 2009/2010)",
        "UEFA Futsal Champions League (2003/2004, 2005/2006, 2008/2009)",
        "Campeonato do Mundo (2000/2001)"
      ]
    },
    pen01: {
      fpId: 27701,
      games: 6,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "25",
          team: "Pe\xF1\xEDscola FS",
          games: 2,
          goals: 0
        },
        {
          s: "24",
          team: "Pe\xF1\xEDscola FS",
          games: 4,
          goals: 0
        }
      ],
      titles: []
    },
    pen02: {
      fpId: 27063,
      games: 63,
      yellow: 4,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Pe\xF1\xEDscola FS",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "Pe\xF1\xEDscola FS",
          games: 25,
          goals: 1
        },
        {
          s: "24",
          team: "Pe\xF1\xEDscola FS",
          games: 32,
          goals: 0
        }
      ],
      titles: []
    },
    pen03: {
      fpId: 26384,
      games: 64,
      yellow: 14,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Pe\xF1\xEDscola FS",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "Pe\xF1\xEDscola FS",
          games: 29,
          goals: 6
        },
        {
          s: "24",
          team: "Burela FS",
          games: 28,
          goals: 4
        }
      ],
      titles: []
    },
    pen04: {
      fpId: 16295,
      games: 48,
      yellow: 21,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Pe\xF1\xEDscola FS",
          games: 7,
          goals: 1
        },
        {
          s: "24",
          team: "Ja\xE9n Para\xEDso Interior",
          games: 32,
          goals: 5
        },
        {
          s: "22",
          team: "Real Betis Futsal",
          games: 4,
          goals: 1
        },
        {
          s: "22",
          team: "Kairat Almaty",
          games: 5,
          goals: 0
        }
      ],
      titles: []
    },
    pen05: {
      fpId: 745,
      games: 94,
      yellow: 17,
      red: 3,
      seasons: [
        {
          s: "26",
          team: "Pe\xF1\xEDscola FS",
          games: 7,
          goals: 2
        },
        {
          s: "25",
          team: "Pe\xF1\xEDscola FS",
          games: 29,
          goals: 15
        },
        {
          s: "24",
          team: "Pe\xF1\xEDscola FS",
          games: 28,
          goals: 12
        },
        {
          s: "23",
          team: "Pe\xF1\xEDscola FS",
          games: 29,
          goals: 9
        },
        {
          s: "22",
          team: "Pe\xF1\xEDscola FS",
          games: 1,
          goals: 1
        }
      ],
      titles: []
    },
    pen06: {
      fpId: 26408,
      games: 88,
      yellow: 20,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Pe\xF1\xEDscola FS",
          games: 7,
          goals: 1
        },
        {
          s: "25",
          team: "Pe\xF1\xEDscola FS",
          games: 29,
          goals: 5
        },
        {
          s: "24",
          team: "Pe\xF1\xEDscola FS",
          games: 35,
          goals: 14
        },
        {
          s: "23",
          team: "Pe\xF1\xEDscola FS",
          games: 1,
          goals: 0
        },
        {
          s: "22",
          team: "Pe\xF1\xEDscola FS",
          games: 1,
          goals: 0
        },
        {
          s: "21",
          team: "FC Barcelona",
          games: 15,
          goals: 3
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2021/2022)",
        "Supercopa Espa\xF1a  (2021/2022)"
      ]
    },
    pen07: {
      fpId: 14220,
      games: 64,
      yellow: 6,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Pe\xF1\xEDscola FS",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "Pe\xF1\xEDscola FS",
          games: 23,
          goals: 10
        },
        {
          s: "24",
          team: "Pe\xF1\xEDscola FS",
          games: 3,
          goals: 2
        },
        {
          s: "23",
          team: "Pe\xF1\xEDscola FS",
          games: 30,
          goals: 5
        },
        {
          s: "22",
          team: "Pe\xF1\xEDscola FS",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    pen08: {
      fpId: 23298,
      games: 87,
      yellow: 3,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Pe\xF1\xEDscola FS",
          games: 6,
          goals: 4
        },
        {
          s: "25",
          team: "Pe\xF1\xEDscola FS",
          games: 24,
          goals: 7
        },
        {
          s: "24",
          team: "Pe\xF1\xEDscola FS",
          games: 20,
          goals: 6
        },
        {
          s: "23",
          team: "Real Betis Futsal",
          games: 19,
          goals: 2
        },
        {
          s: "22",
          team: "Real Betis Futsal",
          games: 18,
          goals: 4
        }
      ],
      titles: []
    },
    pen09: {
      fpId: 20896,
      games: 86,
      yellow: 17,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Pe\xF1\xEDscola FS",
          games: 5,
          goals: 0
        },
        {
          s: "25",
          team: "Industrias Santa Coloma",
          games: 29,
          goals: 15
        },
        {
          s: "24",
          team: "Industrias Santa Coloma",
          games: 30,
          goals: 12
        },
        {
          s: "23",
          team: "FC Barcelona",
          games: 10,
          goals: 2
        },
        {
          s: "22",
          team: "FC Barcelona",
          games: 9,
          goals: 0
        },
        {
          s: "21",
          team: "FC Barcelona",
          games: 3,
          goals: 1
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2021/2022, 2022/2023)",
        "Supercopa Espa\xF1a  (2022/2023)"
      ]
    },
    pen10: {
      fpId: 665,
      games: 88,
      yellow: 19,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Pe\xF1\xEDscola FS",
          games: 7,
          goals: 4
        },
        {
          s: "25",
          team: "Pe\xF1\xEDscola FS",
          games: 12,
          goals: 6
        },
        {
          s: "24",
          team: "Pe\xF1\xEDscola FS",
          games: 21,
          goals: 11
        },
        {
          s: "23",
          team: "Pe\xF1\xEDscola FS",
          games: 17,
          goals: 11
        },
        {
          s: "22",
          team: "Pe\xF1\xEDscola FS",
          games: 1,
          goals: 0
        },
        {
          s: "21",
          team: "Burela FS",
          games: 30,
          goals: 10
        }
      ],
      titles: []
    },
    pen11: {
      fpId: 66414,
      games: 1,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Pe\xF1\xEDscola FS",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    pen12: {
      fpId: 29015,
      games: 1,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Pe\xF1\xEDscola FS",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    pen13: {
      fpId: 25863,
      games: 40,
      yellow: 5,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Pe\xF1\xEDscola FS",
          games: 6,
          goals: 2
        },
        {
          s: "25",
          team: "Alzira FS",
          games: 26,
          goals: 12
        },
        {
          s: "23",
          team: "Pe\xF1\xEDscola FS",
          games: 8,
          goals: 1
        }
      ],
      titles: []
    },
    pen14: {
      fpId: 11324,
      games: 100,
      yellow: 31,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Pe\xF1\xEDscola FS",
          games: 7,
          goals: 5
        },
        {
          s: "25",
          team: "Pe\xF1\xEDscola FS",
          games: 27,
          goals: 14
        },
        {
          s: "24",
          team: "Pe\xF1\xEDscola FS",
          games: 36,
          goals: 18
        },
        {
          s: "23",
          team: "Pe\xF1\xEDscola FS",
          games: 29,
          goals: 13
        },
        {
          s: "22",
          team: "Pe\xF1\xEDscola FS",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    val01: {
      fpId: 66424,
      games: 14,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 1,
          goals: 1
        },
        {
          s: "25",
          team: "Joinville",
          games: 6,
          goals: 0
        }
      ],
      titles: []
    },
    val02: {
      fpId: 11068,
      games: 158,
      yellow: 7,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 32,
          goals: 0
        },
        {
          s: "24",
          team: "Industrias Santa Coloma",
          games: 31,
          goals: 0
        },
        {
          s: "23",
          team: "Industrias Santa Coloma",
          games: 30,
          goals: 1
        },
        {
          s: "22",
          team: "Industrias Santa Coloma",
          games: 28,
          goals: 0
        },
        {
          s: "21",
          team: "Industrias Santa Coloma",
          games: 30,
          goals: 0
        }
      ],
      titles: []
    },
    val03: {
      fpId: 744,
      games: 144,
      yellow: 60,
      red: 2,
      seasons: [
        {
          s: "25",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 27,
          goals: 3
        },
        {
          s: "24",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 25,
          goals: 5
        },
        {
          s: "23",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 32,
          goals: 4
        },
        {
          s: "22",
          team: "ElPozo Murcia",
          games: 30,
          goals: 3
        },
        {
          s: "21",
          team: "ElPozo Murcia",
          games: 30,
          goals: 2
        }
      ],
      titles: []
    },
    val04: {
      fpId: 15809,
      games: 41,
      yellow: 13,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 7,
          goals: 2
        },
        {
          s: "25",
          team: "FC Barcelona",
          games: 2,
          goals: 1
        },
        {
          s: "25",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 24,
          goals: 3
        },
        {
          s: "21",
          team: "Joinville",
          games: 8,
          goals: 1
        }
      ],
      titles: [
        "Copa Am\xE9rica (2025/2026)"
      ]
    },
    val05: {
      fpId: 24715,
      games: 44,
      yellow: 2,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "FC Barcelona",
          games: 2,
          goals: 0
        },
        {
          s: "24",
          team: "Ribera Navarra FS",
          games: 21,
          goals: 0
        },
        {
          s: "23",
          team: "FC Barcelona",
          games: 14,
          goals: 0
        }
      ],
      titles: [
        "Campeonato Europa Sub 19 (2022/2023)",
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2025/2026)"
      ]
    },
    val06: {
      fpId: 14217,
      games: 155,
      yellow: 34,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "Inter FS",
          games: 33,
          goals: 6
        },
        {
          s: "24",
          team: "Inter FS",
          games: 35,
          goals: 13
        },
        {
          s: "23",
          team: "Ribera Navarra FS",
          games: 30,
          goals: 16
        },
        {
          s: "22",
          team: "Ribera Navarra FS",
          games: 29,
          goals: 14
        },
        {
          s: "21",
          team: "Ribera Navarra FS",
          games: 21,
          goals: 3
        }
      ],
      titles: [
        "Copa de Espa\xF1a (2024/2025, 2024/2025)"
      ]
    },
    val07: {
      fpId: 28952,
      games: 21,
      yellow: 1,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 6,
          goals: 0
        },
        {
          s: "25",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 15,
          goals: 1
        }
      ],
      titles: []
    },
    val08: {
      fpId: 28002,
      games: 53,
      yellow: 17,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 6,
          goals: 2
        },
        {
          s: "25",
          team: "Joinville",
          games: 21,
          goals: 3
        },
        {
          s: "25",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 26,
          goals: 3
        }
      ],
      titles: []
    },
    val09: {
      fpId: 5218,
      games: 54,
      yellow: 11,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 7,
          goals: 4
        },
        {
          s: "25",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 31,
          goals: 7
        },
        {
          s: "22",
          team: "FK Chrudim",
          games: 6,
          goals: 2
        },
        {
          s: "21",
          team: "Jaragu\xE1 Futsal",
          games: 10,
          goals: 2
        }
      ],
      titles: []
    },
    val10: {
      fpId: 12825,
      games: 95,
      yellow: 31,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 33,
          goals: 9
        },
        {
          s: "24",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 25,
          goals: 3
        },
        {
          s: "23",
          team: "Pe\xF1\xEDscola FS",
          games: 29,
          goals: 6
        },
        {
          s: "22",
          team: "Pe\xF1\xEDscola FS",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    val11: {
      fpId: 9007,
      games: 71,
      yellow: 14,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 7,
          goals: 1
        },
        {
          s: "25",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 33,
          goals: 5
        },
        {
          s: "23",
          team: "Alzira FS",
          games: 30,
          goals: 8
        },
        {
          s: "21",
          team: "Islas Baleares Palma Futsal",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    val12: {
      fpId: 23297,
      games: 78,
      yellow: 8,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "Ribera Navarra FS",
          games: 29,
          goals: 5
        },
        {
          s: "24",
          team: "Real Betis Futsal",
          games: 2,
          goals: 1
        },
        {
          s: "23",
          team: "Real Betis Futsal",
          games: 30,
          goals: 3
        },
        {
          s: "22",
          team: "Real Betis Futsal",
          games: 6,
          goals: 0
        },
        {
          s: "21",
          team: "Real Betis Futsal",
          games: 4,
          goals: 1
        }
      ],
      titles: []
    },
    val13: {
      fpId: 66415,
      games: 6,
      yellow: 1,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 6,
          goals: 0
        }
      ],
      titles: []
    },
    val14: {
      fpId: 19655,
      games: 129,
      yellow: 28,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 7,
          goals: 3
        },
        {
          s: "25",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 32,
          goals: 21
        },
        {
          s: "24",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 29,
          goals: 12
        },
        {
          s: "23",
          team: "Real Betis Futsal",
          games: 28,
          goals: 9
        },
        {
          s: "22",
          team: "Real Betis Futsal",
          games: 23,
          goals: 4
        },
        {
          s: "21",
          team: "FC Barcelona",
          games: 10,
          goals: 0
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2021/2022)",
        "Supercopa Espa\xF1a  (2021/2022)",
        "Campeonato Europa Sub 19 (2022/2023)"
      ]
    },
    val15: {
      fpId: 21213,
      games: 92,
      yellow: 1,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 3,
          goals: 0
        },
        {
          s: "25",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 3,
          goals: 0
        },
        {
          s: "24",
          team: "C\xF3rdoba Patrimonio",
          games: 28,
          goals: 13
        },
        {
          s: "23",
          team: "Jimbee Cartagena FS",
          games: 18,
          goals: 3
        },
        {
          s: "22",
          team: "Jimbee Cartagena FS",
          games: 32,
          goals: 11
        },
        {
          s: "21",
          team: "Real Betis Futsal",
          games: 8,
          goals: 5
        }
      ],
      titles: [
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2023/2024)",
        "Supercopa Espa\xF1a  (2023/2024)"
      ]
    },
    val16: {
      fpId: 27727,
      games: 47,
      yellow: 6,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "Vi\xF1a Albali Valdepe\xF1as",
          games: 16,
          goals: 7
        },
        {
          s: "25",
          team: "C\xF3rdoba Patrimonio",
          games: 17,
          goals: 6
        },
        {
          s: "24",
          team: "FC Barcelona",
          games: 4,
          goals: 0
        },
        {
          s: "21",
          team: "FC Barcelona",
          games: 3,
          goals: 0
        }
      ],
      titles: [
        "Montaigu Futsal Cup (2019/2020)",
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2021/2022)"
      ]
    },
    zar01: {
      fpId: 796,
      games: 54,
      yellow: 7,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 2,
          goals: 0
        },
        {
          s: "24",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 24,
          goals: 0
        },
        {
          s: "21",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 28,
          goals: 0
        }
      ],
      titles: []
    },
    zar02: {
      fpId: 66397,
      games: 21,
      yellow: 3,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 7,
          goals: 0
        },
        {
          s: "25",
          team: "Joa\xE7aba Futsal",
          games: 14,
          goals: 1
        }
      ],
      titles: []
    },
    zar03: {
      fpId: 66398,
      games: 2,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 2,
          goals: 0
        }
      ],
      titles: []
    },
    zar04: {
      fpId: 66399,
      games: 4,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 4,
          goals: 0
        }
      ],
      titles: []
    },
    zar05: {
      fpId: 67599,
      games: 1,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 1,
          goals: 0
        }
      ],
      titles: []
    },
    zar06: {
      fpId: 5036,
      games: 45,
      yellow: 7,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 7,
          goals: 2
        },
        {
          s: "24",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 11,
          goals: 2
        },
        {
          s: "21",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 27,
          goals: 1
        }
      ],
      titles: []
    },
    zar07: {
      fpId: 793,
      games: 65,
      yellow: 15,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 7,
          goals: 4
        },
        {
          s: "24",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 29,
          goals: 8
        },
        {
          s: "21",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 29,
          goals: 6
        }
      ],
      titles: [
        "UEFA Futsal Champions League (2013/2014)",
        "RFEF - Primera Divisi\xF3n de F\xFAtbol Sala (2018/2019)"
      ]
    },
    zar08: {
      fpId: 66400,
      games: 7,
      yellow: 2,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 7,
          goals: 2
        }
      ],
      titles: []
    },
    zar09: {
      fpId: 21203,
      games: 26,
      yellow: 1,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 1,
          goals: 0
        },
        {
          s: "22",
          team: "BeSoccer CD UMA Antequera",
          games: 25,
          goals: 0
        }
      ],
      titles: []
    },
    zar10: {
      fpId: 9241,
      games: 33,
      yellow: 6,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 1,
          goals: 2
        },
        {
          s: "24",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 11,
          goals: 2
        },
        {
          s: "23",
          team: "Real Betis Futsal",
          games: 21,
          goals: 1
        }
      ],
      titles: []
    },
    zar11: {
      fpId: 66403,
      games: 0,
      yellow: 0,
      red: 0,
      seasons: [],
      titles: []
    },
    zar12: {
      fpId: 448,
      games: 119,
      yellow: 21,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 7,
          goals: 3
        },
        {
          s: "25",
          team: "SCU Torreense",
          games: 26,
          goals: 20
        },
        {
          s: "24",
          team: "SCU Torreense",
          games: 25,
          goals: 18
        },
        {
          s: "23",
          team: "El\xE9ctrico FC",
          games: 15,
          goals: 3
        },
        {
          s: "22",
          team: "El\xE9ctrico FC",
          games: 14,
          goals: 10
        },
        {
          s: "21",
          team: "El\xE9ctrico FC",
          games: 32,
          goals: 15
        }
      ],
      titles: [
        "Ta\xE7a de Portugal (2017/2018, 2017/2018)",
        "Campeonato Nacional Sub 19 (2018/2019, 2018/2019)",
        "Ta\xE7a da Liga (2019/2020, 2019/2020)",
        "Ta\xE7a Nacional Sub 17 (2015/2016)",
        "Campeonato Nacional Sub 17 (2016/2017)"
      ]
    },
    zar13: {
      fpId: 27646,
      games: 23,
      yellow: 7,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 7,
          goals: 0
        },
        {
          s: "24",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 16,
          goals: 2
        }
      ],
      titles: []
    },
    zar14: {
      fpId: 66404,
      games: 7,
      yellow: 1,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 7,
          goals: 0
        }
      ],
      titles: []
    },
    zar15: {
      fpId: 66405,
      games: 5,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 5,
          goals: 0
        }
      ],
      titles: []
    },
    zar16: {
      fpId: 66401,
      games: 4,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 4,
          goals: 1
        }
      ],
      titles: []
    },
    zar17: {
      fpId: 66402,
      games: 2,
      yellow: 0,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 2,
          goals: 0
        }
      ],
      titles: []
    },
    zar18: {
      fpId: 26397,
      games: 18,
      yellow: 2,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 6,
          goals: 0
        },
        {
          s: "24",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 12,
          goals: 0
        }
      ],
      titles: []
    },
    zar19: {
      fpId: 66406,
      games: 5,
      yellow: 4,
      red: 0,
      seasons: [
        {
          s: "26",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 5,
          goals: 0
        }
      ],
      titles: []
    },
    zar20: {
      fpId: 787,
      games: 57,
      yellow: 11,
      red: 2,
      seasons: [
        {
          s: "26",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 7,
          goals: 0
        },
        {
          s: "24",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 30,
          goals: 4
        },
        {
          s: "21",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 20,
          goals: 4
        }
      ],
      titles: []
    },
    zar21: {
      fpId: 25773,
      games: 37,
      yellow: 14,
      red: 1,
      seasons: [
        {
          s: "26",
          team: "Wanapix AD Sala 10 Zaragoza",
          games: 5,
          goals: 1
        },
        {
          s: "24",
          team: "AD Fund\xE3o",
          games: 21,
          goals: 8
        },
        {
          s: "23",
          team: "AD Fund\xE3o",
          games: 11,
          goals: 4
        }
      ],
      titles: []
    }
  }
};

// src/data/esp/coaches.json
var coaches_default2 = {
  _info: "Liga Prime Futsal 2026/27: planteis da RFEF (futsal.rfef.es) + historial do futsalportugal.com (recolha 2/11/2026, 1 p\xE1gina a cada 7 s). tactical/motivation calculados do historial (vit\xF3rias por competi\xE7\xE3o, t\xEDtulos); discipline/youth estimativa.",
  coaches: [
    {
      id: "c_stc",
      name: "Xavi Closas",
      clubId: "stc",
      tactical: 12,
      motivation: 12,
      discipline: 14,
      youth: 12,
      style: {}
    },
    {
      id: "c_par",
      name: "Gerard Casas",
      clubId: "par",
      tactical: 12,
      motivation: 12,
      discipline: 14,
      youth: 12,
      style: {}
    },
    {
      id: "c_pal",
      name: "Antonio Vadillo",
      clubId: "pal",
      tactical: 19,
      motivation: 16,
      discipline: 14,
      youth: 12,
      style: {}
    },
    {
      id: "c_osa",
      name: "Imanol Arregui Sarasa",
      clubId: "osa",
      tactical: 13,
      motivation: 12,
      discipline: 14,
      youth: 12,
      style: {}
    },
    {
      id: "c_int",
      name: "Alberto Riquer",
      clubId: "int",
      tactical: 12,
      motivation: 12,
      discipline: 14,
      youth: 12,
      style: {}
    },
    {
      id: "c_zar",
      name: "Jorge Palos",
      clubId: "zar",
      tactical: 9,
      motivation: 9,
      discipline: 14,
      youth: 12,
      style: {}
    },
    {
      id: "c_jae",
      name: "Dani Rodr\xEDguez",
      clubId: "jae",
      tactical: 14,
      motivation: 12,
      discipline: 14,
      youth: 12,
      style: {}
    },
    {
      id: "c_pen",
      name: "Gerard Pus\xF3",
      clubId: "pen",
      tactical: 10,
      motivation: 10,
      discipline: 14,
      youth: 12,
      style: {}
    },
    {
      id: "c_epz",
      name: "Josan Gonz\xE1lez",
      clubId: "epz",
      tactical: 13,
      motivation: 12,
      discipline: 14,
      youth: 12,
      style: {}
    },
    {
      id: "c_jca",
      name: "Duda",
      clubId: "jca",
      tactical: 19,
      motivation: 16,
      discipline: 14,
      youth: 12,
      style: {}
    },
    {
      id: "c_bar",
      name: "Javi Rodr\xEDguez",
      clubId: "bar",
      tactical: 20,
      motivation: 17,
      discipline: 14,
      youth: 12,
      style: {}
    },
    {
      id: "c_val",
      name: "Marlon Velasco",
      clubId: "val",
      tactical: 12,
      motivation: 12,
      discipline: 14,
      youth: 12,
      style: {}
    },
    {
      id: "c_cor",
      name: "David Fern\xE1ndez",
      clubId: "cor",
      tactical: 10,
      motivation: 10,
      discipline: 14,
      youth: 12,
      style: {}
    },
    {
      id: "c_man",
      name: "Juanlu Alonso",
      clubId: "man",
      tactical: 15,
      motivation: 13,
      discipline: 14,
      youth: 12,
      style: {}
    },
    {
      id: "c_noi",
      name: "David Palmas",
      clubId: "noi",
      tactical: 12,
      motivation: 12,
      discipline: 14,
      youth: 12,
      style: {}
    },
    {
      id: "c_eji",
      name: "Guillermo Mart\xEDnez",
      clubId: "eji",
      tactical: 11,
      motivation: 11,
      discipline: 14,
      youth: 12,
      style: {}
    }
  ]
};

// src/core/state.ts
var DB_CLUBS = [
  ...clubs_default.clubs.map(({ check, ...c2 }) => ({ ...c2, colors: c2.colors })),
  ...clubs_default2.clubs.map(({ fp, ...c2 }) => ({ ...c2, colors: c2.colors }))
];
var BOOST = overrides_default.boost;
var HISTORY = history_default.players;
var ATTR_OVERRIDES = overrides_default.attrs;
var FP_STATS = { ...fpstats_default.players, ...fpstats_default2.players };
function buildPlayers() {
  return [...players_default.players, ...players_default2.players].map((p) => {
    const club = DB_CLUBS.find((c2) => c2.id === p.clubId.replace("@jun", ""));
    const key = `${p.clubId}|${p.name}`;
    const mb = computeMoneyball(HISTORY[p.id] ?? FP_STATS[p.id]?.seasons ?? [], p.position, p.age);
    const g = mb ? generateAttributes(p, mb.level, BOOST[key] ?? 0, { productivity: mb.productivity, availability: mb.availability }) : generateAttributes(p, club.level - 10, (BOOST[key] ?? 0) - 0.8);
    const fp = FP_STATS[p.id];
    if (fp && fp.games >= 15) {
      const rate = (fp.yellow + 2 * fp.red) / fp.games;
      g.attrs.agressividade = Math.max(1, Math.min(20, Math.round(g.attrs.agressividade + Math.max(-4, Math.min(4, (rate / 0.21 - 1) * 3)))));
    }
    return { ...p, attrs: { ...g.attrs, ...ATTR_OVERRIDES[key] ?? {} }, potential: g.potential };
  });
}
var DB_PLAYERS = buildPlayers();
var DB_COACHES = [...coaches_default.coaches, ...coaches_default2.coaches];
var DB_LEAGUES = [
  { ...clubs_default.league, clubIds: clubs_default.clubs.map((c2) => c2.id) },
  { ...clubs_default2.league, clubIds: clubs_default2.clubs.map((c2) => c2.id) }
];
function newGame(managerName, nationality, clubId) {
  const s2 = {
    version: SAVE_VERSION,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    manager: { name: managerName, nationality },
    clubId,
    date: "2026-07-01",
    clubs: structuredClone(DB_CLUBS),
    leagues: structuredClone(DB_LEAGUES),
    players: structuredClone(DB_PLAYERS),
    // o treinador real do clube escolhido fica sem clube
    coaches: DB_COACHES.map((c2) => ({ ...structuredClone(c2), clubId: c2.clubId === clubId ? null : c2.clubId })),
    tactics: suggestTactics(DB_PLAYERS.filter((p) => p.clubId === clubId)),
    season: null,
    pstats: {},
    news: [],
    honours: []
  };
  startFirstSeason(s2);
  s2.news.unshift({ date: s2.date, text: `${managerName} \xE9 o novo treinador do ${s2.clubs.find((c2) => c2.id === clubId).name}.` });
  return s2;
}

// src/core/visual/movement.ts
var clamp3 = (v, min, max) => Math.max(min, Math.min(max, v));
var unit = (v) => clamp3((v - 1) / 19, 0, 1);
function score(player, weights) {
  let total = 0;
  let weight = 0;
  for (const [key, w] of Object.entries(weights)) {
    total += unit(player.attrs[key]) * w;
    weight += w;
  }
  return weight ? total / weight : 0.5;
}
function movementProfile(player) {
  const a = player.attrs;
  const decision = score(player, { decisoes: 3, posicionamento: 2, antecipacao: 2, visao: 1 });
  const teamwork = score(player, { trabalhoEquipa: 3, decisoes: 1, posicionamento: 1 });
  return {
    accelerationFactor: 0.82 + unit(a.aceleracao) * 0.34,
    agilityFactor: 0.82 + unit(a.agilidade) * 0.34,
    decisionFactor: 0.55 + decision * 0.45,
    teamworkFactor: 0.55 + teamwork * 0.45,
    enduranceFactor: 0.75 + unit(a.resistencia) * 0.3
  };
}
function bakeMovementTrajectory(at, t0, t1, vmax, amax, accelerationFactor = 1, agilityFactor = 1, dt = 1 / 30) {
  const clampFactor = (value) => clamp3(value, 0.82, 1.16);
  const n = Math.max(2, Math.ceil((t1 - t0) / dt) + 2);
  const points = [];
  let position = at(t0);
  let vx = 0;
  let vy = 0;
  const acceleration = amax * clampFactor(accelerationFactor);
  const responseWindow = 0.28 / clampFactor(agilityFactor);
  for (let i = 0; i < n; i++) {
    const time = t0 + i * dt;
    points.push({ x: position.x, y: position.y });
    const target = at(time + 0.18);
    let dx = (target.x - position.x) / responseWindow;
    let dy = (target.y - position.y) / responseWindow;
    const desiredSpeed = Math.hypot(dx, dy);
    if (desiredSpeed > vmax) {
      dx = dx * vmax / desiredSpeed;
      dy = dy * vmax / desiredSpeed;
    }
    let ax = dx - vx;
    let ay = dy - vy;
    const delta = Math.hypot(ax, ay);
    const maxDelta = acceleration * dt;
    if (delta > maxDelta) {
      ax = ax * maxDelta / delta;
      ay = ay * maxDelta / delta;
    }
    vx += ax;
    vy += ay;
    position = { x: position.x + vx * dt, y: position.y + vy * dt };
  }
  return points;
}

// src/core/visual/choreo.ts
var SHAPES = {
  "3-1": [[19.5, 0], [26.5, -8.4], [26.5, 8.4], [34, 0]],
  // fixo, ala E, ala D, pivô (largura total, como nos jogos reais)
  "1-2-1": [[18.5, 0], [26, -8.2], [26, 8.2], [33.5, 0]],
  "4-0": [[22, -3.6], [28.5, -8.6], [28.5, 8.6], [22, 3.6]],
  // universal E, ala E, ala D, universal D
  "2-2": [[22, -4.5], [31.5, -6], [31.5, 6], [22, 4.5]],
  "5x4": [[24, 0], [27.5, -8.3], [27.5, 8.3], [34.5, -6.5], [34.5, 6.5]]
  // GR avançado no topo, alas, dois nos cantos da área
};
var BLOCK = {
  alta: [[17, 0], [21, -6], [21, 6], [26, 0]],
  media: [[21, 0], [25, -5], [25, 5], [29.5, 0]],
  baixa: [[26, 0], [29, -4.5], [29, 4.5], [32, 0]]
};
var PRESS_LINE = { alta: 7, media: 18.5, baixa: 25 };
var VMAX = 7.4;
var AMAX = 9;
var BAKE_DT = 1 / 30;
var clamp4 = (v, a, b) => Math.max(a, Math.min(b, v));
var lerp = (a, b, k) => a + (b - a) * k;
var ease = (k) => k * k * (3 - 2 * k);
var dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
var angTo = (a, b) => Math.atan2(b.x - a.x, b.y - a.y);
function rnd(seed) {
  let s2 = seed * 2654435761 >>> 0 || 1;
  return () => (s2 = Math.imul(s2 ^ s2 >>> 15, 2246822507) ^ Math.imul(s2 ^ s2 >>> 13, 3266489909), ((s2 ^= s2 >>> 16) >>> 0) / 4294967296);
}
var REFS = ["arbitro1", "arbitro2"];
var attackDir = (side, period) => period % 2 === 1 === (side === 0) ? 1 : -1;
var Track = class {
  constructor() {
    this.keys = [];
    // percurso final, com inércia: velocidade e aceleração máximas (como um jogador real)
    this.baked = null;
  }
  set(t, p, hold = false) {
    this.baked = null;
    const k = { t, x: p.x, y: clamp4(p.y, -10.6, 10.6), hold };
    let i = this.keys.length;
    while (i > 0 && this.keys[i - 1].t > t) i--;
    if (i > 0 && Math.abs(this.keys[i - 1].t - t) < 0.06) {
      this.keys[i - 1] = k;
      return;
    }
    if (i < this.keys.length && Math.abs(this.keys[i].t - t) < 0.06) {
      this.keys[i] = k;
      return;
    }
    this.keys.splice(i, 0, k);
  }
  /** Movimentos de apoio sem bola: onde o jogador ficaria parado muito tempo, faz desmarcações curtas
   * (fintar a marcação, aproximar-se e voltar a abrir), como no futsal real. */
  liven(r, t0, t1, amp, skip) {
    const out = [];
    for (let i = 0; i < this.keys.length; i++) {
      const a = this.keys[i], b = this.keys[i + 1];
      out.push(a);
      if (!b || b.t < t0 || a.t > t1) continue;
      const gap = b.t - a.t;
      const n = Math.floor(gap / 1.3);
      for (let k = 1; k <= n; k++) {
        const t = a.t + gap * k / (n + 1);
        if (skip(t)) continue;
        const kk = k / (n + 1);
        const bx = a.x + (b.x - a.x) * kk, by = a.y + (b.y - a.y) * kk;
        const ang = r() * Math.PI * 2;
        const m2 = amp * (0.5 + r() * 0.5);
        out.push({ t, x: clamp4(bx + Math.cos(ang) * m2, -19.5, 19.5), y: clamp4(by + Math.sin(ang) * m2, -9.8, 9.8), hold: false });
      }
    }
    this.keys = out;
    this.baked = null;
  }
  /** Remove pontos-chave dentro de um intervalo (para dar lugar a movimentos explícitos). */
  clear(t0, t1) {
    this.baked = null;
    this.keys = this.keys.filter((k) => k.t < t0 || k.t > t1);
  }
  /** Nenhum troço mais rápido do que vmax (exceto chegadas obrigatórias a bolas paradas). */
  limit(vmax) {
    for (let i = 1; i < this.keys.length; i++) {
      const a = this.keys[i - 1], b = this.keys[i];
      if (b.hold) continue;
      const max = vmax * (b.t - a.t);
      const d = Math.hypot(b.x - a.x, b.y - a.y);
      if (d > max && d > 0) {
        b.x = a.x + (b.x - a.x) * max / d;
        b.y = a.y + (b.y - a.y) * max / d;
      }
    }
  }
  tangent(i) {
    const ks = this.keys;
    if (i === 0 || i === ks.length - 1 || ks[i].hold) return { x: 0, y: 0 };
    const a = ks[i - 1], b = ks[i], c2 = ks[i + 1];
    const d0 = { x: (b.x - a.x) / (b.t - a.t), y: (b.y - a.y) / (b.t - a.t) };
    const d1 = { x: (c2.x - b.x) / (c2.t - b.t), y: (c2.y - b.y) / (c2.t - b.t) };
    if (d0.x * d1.x + d0.y * d1.y <= 0) return { x: 0, y: 0 };
    const m2 = { x: (c2.x - a.x) / (c2.t - a.t), y: (c2.y - a.y) / (c2.t - a.t) };
    const cap = Math.min(Math.hypot(d0.x, d0.y), Math.hypot(d1.x, d1.y));
    const mm = Math.hypot(m2.x, m2.y);
    return mm > cap && mm > 0 ? { x: m2.x * cap / mm, y: m2.y * cap / mm } : m2;
  }
  bake(t0, t1, vmax, amax, accelerationFactor = 1, agilityFactor = 1) {
    this.baked = null;
    const points = bakeMovementTrajectory(
      (time) => this.at(time),
      t0,
      t1,
      vmax,
      amax,
      accelerationFactor,
      agilityFactor,
      BAKE_DT
    );
    const xs = Float32Array.from(points, (point) => point.x);
    const ys = Float32Array.from(points, (point) => point.y);
    this.baked = { t0, xs, ys };
  }
  at(t) {
    const bk = this.baked;
    if (bk) {
      const f = clamp4((t - bk.t0) / BAKE_DT, 0, bk.xs.length - 1.001);
      const i2 = Math.floor(f), k = f - i2;
      return { x: lerp(bk.xs[i2], bk.xs[i2 + 1], k), y: lerp(bk.ys[i2], bk.ys[i2 + 1], k) };
    }
    const ks = this.keys;
    if (!ks.length) return { x: 0, y: 0 };
    if (t <= ks[0].t) return { x: ks[0].x, y: ks[0].y };
    const n = ks.length - 1;
    if (t >= ks[n].t) return { x: ks[n].x, y: ks[n].y };
    let i = 0;
    while (i < n - 1 && ks[i + 1].t <= t) i++;
    const a = ks[i], b = ks[i + 1];
    const h = b.t - a.t;
    const s2 = (t - a.t) / h;
    const m0 = this.tangent(i), m1 = this.tangent(i + 1);
    const s22 = s2 * s2, s3 = s22 * s2;
    const h00 = 2 * s3 - 3 * s22 + 1, h10 = s3 - 2 * s22 + s2, h01 = -2 * s3 + 3 * s22, h11 = s3 - s22;
    return {
      x: h00 * a.x + h10 * h * m0.x + h01 * b.x + h11 * h * m1.x,
      y: h00 * a.y + h10 * h * m0.y + h01 * b.y + h11 * h * m1.y
    };
  }
};
var Choreo = class {
  constructor(p, tactics, period, start2, names = {}, playersById = {}) {
    this.p = p;
    this.tactics = tactics;
    this.names = names;
    this.tr = /* @__PURE__ */ new Map();
    this.movement = /* @__PURE__ */ new Map();
    this.attrsOf = /* @__PURE__ */ new Map();
    this.sideOf = /* @__PURE__ */ new Map();
    this.balls = [];
    this.acts = [];
    this.labels = [];
    this.phases = [];
    this.fixed = /* @__PURE__ */ new Map();
    // janelas com movimento explícito (a defesa automática não mexe)
    this.later = [];
    this.post = [];
    this.slot = /* @__PURE__ */ new Map();
    this.progFn = () => 1;
    this.lastGoal = false;
    this.isCounter = false;
    // em transição: quem tem a bola e espaço à frente conduz para a baliza (nunca passa para trás)
    this.spillNext = false;
    // a defesa seguinte dá ressalto (recarga a seguir)
    this.outAt = null;
    // bola fora pela linha lateral (pontapé de linha lateral a seguir)
    this.endGk = null;
    this.shotTimes = [];
    for (const [id, player] of Object.entries(playersById)) {
      this.movement.set(id, movementProfile(player));
      this.attrsOf.set(id, player.attrs);
    }
    this.r = rnd(Math.floor(p.start * 100) + 7);
    const r = this.r;
    const att = this.att = p.side;
    const def = 1 - att;
    this.dirA = attackDir(att, period);
    this.D = this.duration = Math.max(0.5, p.end - p.start);
    const D = this.D;
    const ids = p.onCourt;
    const out = (sd) => p.flying[sd] ? ids[sd].filter((x) => !!x) : ids[sd].slice(1).filter((x) => !!x);
    this.attOut = out(att);
    this.defOut = ids[def].slice(1).filter((x) => !!x);
    this.gkA = p.flying[att] ? null : ids[att][0];
    this.gkD = ids[def][0];
    for (const sd of [0, 1]) for (const id of ids[sd]) if (id) {
      this.sideOf.set(id, sd);
      this.tr.set(id, new Track());
    }
    for (const id of REFS) this.tr.set(id, new Track());
    this.sys = p.flying[att] ? "5x4" : tactics[att].system;
    this.attOut.forEach((id, i) => this.slot.set(id, i % SHAPES[this.sys].length));
    const kind0 = start2?.kind ?? (start2 ? "live" : "kickoff");
    const kind = kind0 === "gk" && (!this.gkA || start2?.holder !== this.gkA) ? "live" : kind0;
    this.lead = kind === "kickoff" ? start2 ? 4 : 1.6 : kind === "gk" ? 2.4 : kind === "lateral" ? 3.6 : 0;
    const t0 = -this.lead;
    for (const [id, tr] of this.tr) {
      const prev = start2?.pos?.[id];
      tr.set(t0, prev ?? (start2?.pos ? { x: 0, y: -10.4 } : this.restPos(id, kind === "lateral" ? "live" : kind)), true);
    }
    let holder;
    const sb = start2?.ball ?? { x: 0, y: 0 };
    if (kind === "kickoff") {
      holder = this.attOut.find((id) => id !== ids[att][0]) ?? this.attOut[0];
      for (const id of this.tr.keys()) this.tr.get(id).set(-0.15, this.restPos(id, "kickoff", holder), true);
      const b0 = { x: sb.x, y: sb.y, z: 0.11 };
      this.balls.push({ k: "still", t0, at: b0 });
      if (Math.hypot(sb.x, sb.y) > 0.5) this.balls.push({ k: "fly", t0: t0 + 0.8, t1: t0 + 2.4, from: b0, b: { x: 0, y: 0, z: 0.11 }, lift: 1.2 });
      this.balls.push({ k: "still", t0: t0 + 2.4, at: { x: 0, y: 0, z: 0.11 } });
      this.phase(t0, "Pontap\xE9 de sa\xEDda");
      this.progFn = this.makeProg(0, 0);
    } else if (kind === "gk" && this.gkA) {
      holder = this.gkA;
      for (const id of this.tr.keys()) this.tr.get(id).set(-0.15, this.restPos(id, "gk"), id === holder);
      const b0 = { x: sb.x, y: sb.y, z: 0.11 };
      this.balls.push({ k: "still", t0, at: b0 });
      const gp = this.P(holder, t0);
      if (dist(gp, b0) < 6) {
        const tg = t0 + clamp4(dist(gp, b0) / 5, 0.4, 1.2);
        this.key(holder, tg, { x: clamp4(b0.x, -20.8, 20.8), y: b0.y }, true);
        this.balls.push({ k: "hands", t0: tg, id: holder });
      } else {
        this.balls.push({ k: "fly", t0: t0 + 0.3, t1: t0 + 1.3, from: { x: b0.x, y: Math.sign(b0.y || 1) * 11.5, z: 0.6 }, b: holder, lift: 0.8 });
        this.balls.push({ k: "hands", t0: t0 + 1.3, id: holder });
      }
      this.phase(t0, "Reposi\xE7\xE3o do guarda-redes");
      this.progFn = this.makeProg(0, 0);
    } else if (kind === "lateral") {
      const spot = { x: clamp4(sb.x, -19, 19), y: Math.sign(sb.y || 1) * 10 };
      holder = this.attOut.reduce((x, y) => dist(this.P(y, t0), spot) < dist(this.P(x, t0), spot) ? y : x);
      const mates = this.attOut.filter((x) => x !== holder);
      const variant = r() < 0.45 ? "curto" : r() < 0.6 ? "atras" : "bloqueio";
      const near = mates.length ? mates.reduce((x, y) => dist(this.P(y, t0), spot) < dist(this.P(x, t0), spot) ? y : x) : holder;
      const back = mates.length ? mates.reduce((x, y) => this.U(this.P(y, t0)) < this.U(this.P(x, t0)) ? y : x) : holder;
      const mate = variant === "atras" ? back : near;
      const sgn = Math.sign(spot.y);
      this.balls.push({ k: "still", t0, at: { x: sb.x, y: sb.y, z: 0.11 } });
      this.key(holder, -1.5, { x: sb.x, y: sb.y }, true);
      this.balls.push({ k: "hands", t0: -1.5, id: holder, z: 0.95 });
      this.key(holder, -0.9, { x: spot.x - this.dirA * 0.3, y: spot.y + sgn * 0.2 }, true);
      this.balls.push({ k: "still", t0: -0.85, at: { x: spot.x, y: spot.y, z: 0.11 } });
      const recv = variant === "atras" ? { x: clamp4(spot.x - this.dirA * 6, -17, 17), y: spot.y - sgn * 5.5 } : variant === "bloqueio" ? { x: clamp4(spot.x + this.dirA * 3.5, -17, 17), y: spot.y - sgn * 4.5 } : { x: clamp4(spot.x - this.dirA * 2.5, -17, 17), y: spot.y - sgn * 3.8 };
      if (variant === "bloqueio") {
        const scr = mates.find((x) => x !== mate);
        if (scr) {
          this.key(scr, -0.6, { x: recv.x - this.dirA * 2.2, y: recv.y + sgn * 1.2 }, true);
          this.act(scr, "screen", -0.9, 0.3, { face: mate });
        }
        this.key(mate, -1, { x: recv.x - this.dirA * 3, y: recv.y + sgn * 1.5 }, true);
      }
      this.key(mate, -0.1, recv, true);
      this.act(holder, "pass", -0.35, 0.05, { face: mate });
      this.balls.push({ k: "pass", t0: -0.1, t1: 0.45, from: holder, to: mate, lift: 0.05 });
      this.balls.push({ k: "foot", t0: 0.45, id: mate });
      this.phase(t0, "Pontap\xE9 de linha lateral");
      this.label(-0.6, `Pontap\xE9 de linha lateral: ${this.nm(holder)}`);
      this.progFn = this.makeProg(0, clamp4((this.U(spot) - 12) / 16, 0, 1));
      holder = mate;
    } else {
      const h0 = start2?.holder && this.attOut.concat(this.gkA ? [this.gkA] : []).includes(start2.holder) ? start2.holder : null;
      holder = h0 ?? this.nearestOut(sb, t0);
      if (!start2?.pos) this.tr.get(holder).set(t0, sb, true);
      const hp0 = this.P(holder, t0);
      if (start2 && Math.hypot(hp0.x - sb.x, hp0.y - sb.y) > 1.2) {
        this.balls.push({ k: "still", t0, at: { x: sb.x, y: sb.y, z: 0.11 } });
        this.key(holder, 0.7, sb);
        this.balls.push({ k: "foot", t0: 0.7, id: holder });
        this.label(0.2, `${this.nm(holder)} ganha a bola`);
      } else this.balls.push({ k: "foot", t0, id: holder });
      const u0 = this.U(sb);
      this.progFn = this.makeProg(0, clamp4((u0 - 12) / 16, 0, 1));
      this.phase(t0, p.counter ? "Transi\xE7\xE3o ofensiva" : "Recupera\xE7\xE3o de bola");
    }
    const first = p.actions[0];
    const ending = first?.type === "foul" ? { kind: "foul", foul: first } : first?.type === "lost" ? { kind: "lost", lost: first } : first?.type === "shot" && first.side === att ? { kind: "shot", shot: first } : { kind: "none" };
    const counter = p.counter || ending.shot?.kind === "counter";
    this.isCounter = counter;
    let T = 0;
    const gkStyle = tactics[att].gkStyle ?? "classico";
    if (holder === this.gkA && gkStyle !== "classico" && D > 7 && r() < (gkStyle === "avancado" ? 0.3 : 0.12)) {
      const g0 = this.P(holder, 0);
      const carryTo = this.A(gkStyle === "avancado" ? 15 + r() * 4.5 : 7 + r() * 2, clamp4(g0.y + (r() - 0.5) * 6, -5, 5));
      this.balls.push({ k: "foot", t0: 0.3, id: holder });
      const tc = Math.min(D - 1.2, 0.3 + dist(g0, carryTo) / 4.6);
      this.key(holder, tc, carryTo);
      this.attKeysAt(tc, /* @__PURE__ */ new Set([holder]));
      this.label(0.4, `${this.nm(holder)} sai a jogar com os p\xE9s`);
      const to = this.attOut.reduce((x, y) => this.U(this.P(y, tc)) > this.U(this.P(x, tc)) ? y : x);
      this.act(holder, "pass", tc - 0.05, tc + 0.3, { face: to });
      this.pass(holder, to, tc + 0.1, tc + 0.7);
      this.key(holder, tc + 2.2, this.A(gkStyle === "avancado" ? 9 : 5, 0));
      holder = to;
      T = tc + 0.7;
    } else if (holder === this.gkA) {
      const tl = Math.min(1.1 + r() * 0.8, D * 0.3);
      this.attKeysAt(tl + 0.4, /* @__PURE__ */ new Set([this.gkA]));
      const gp0 = this.P(holder, tl);
      const freeOf = (id) => {
        const q = this.P(id, tl + 0.4);
        const md = Math.min(9, ...this.defOut.map((d) => dist(this.P(d, tl), q)));
        return Math.min(md, 5) - Math.max(0, dist(gp0, q) - 14) * 0.25 + r() * 0.8;
      };
      const to = this.attOut.reduce((x, y) => freeOf(y) > freeOf(x) ? y : x);
      const td = dist(gp0, this.P(to, tl + 0.4));
      const tf = Math.min(clamp4(td < 9 ? td / 9 : 0.25 + td / 15, 0.35, 1.8), Math.max(0.35, D - tl - 0.4));
      this.act(holder, "throw", tl - 0.45, tl + 0.1, { face: to });
      this.pass(holder, to, tl, tl + tf, td < 9 ? 0.03 : 0.12 + td * 0.03);
      this.label(tl, `${this.nm(holder)} rep\xF5e a bola`);
      holder = to;
      T = tl + tf;
    } else if (kind === "kickoff") {
      const back = this.attOut.find((id) => id !== holder && this.slot.get(id) === 0) ?? this.attOut.find((id) => id !== holder);
      this.act(holder, "pass", -0.1, 0.25, { face: back });
      this.pass(holder, back, 0.15, 0.8, 0.05);
      this.attKeysAt(1.4, /* @__PURE__ */ new Set());
      holder = back;
      T = 0.8;
    } else if (kind === "lateral") T = 0.5;
    this.phase(Math.max(0, T), counter && p.counter ? "Contra-ataque" : this.sys === "5x4" ? "Ataque 5x4 (guarda-redes avan\xE7ado)" : `Ataque organizado (${this.sys})`);
    const shotA = ending.shot;
    const gkRun = !!(shotA?.gkRun && this.gkA && shotA.shooter === this.gkA);
    const shooter = shotA && (this.attOut.includes(shotA.shooter) || gkRun) ? shotA.shooter : void 0;
    const assist = shotA?.assist && this.attOut.includes(shotA.assist) && shotA.assist !== shooter ? shotA.assist : void 0;
    const tS = D - 0.25;
    const finishLen = gkRun ? 4.4 : counter ? 4.6 : 2.6;
    const needed = ending.kind === "shot" && shooter ? counter ? assist ?? holder : assist ?? shooter : ending.kind === "foul" && this.attOut.includes(ending.foul.shooter) ? ending.foul.shooter : void 0;
    const tFin = ending.kind === "shot" && shooter ? Math.max(T + 0.3, tS - finishLen) : ending.kind === "foul" ? D - 1.5 : ending.kind === "lost" ? D - 1.1 : D;
    holder = this.beats(T, tFin, holder, gkRun ? void 0 : counter ? assist ? needed : void 0 : needed);
    T = Math.max(T, tFin);
    let afterT = D;
    if (ending.kind === "shot" && shooter) {
      if (gkRun) this.gkCarry(holder, T, tS, shooter);
      else if (counter) this.counterRun(holder, T, tS, shooter, assist, shotA);
      else this.finish(holder, T, tS, shooter, assist, shotA);
      this.spillNext = p.actions[1]?.kind === "rebound" && p.actions[1].side === att;
      afterT = this.shot(tS, shooter, shotA, this.dirA);
    } else if (ending.kind === "lost") {
      this.loseBall(holder, T, D, ending.lost.other);
      if (this.outAt) afterT = D + 0.7;
    } else if (ending.kind === "foul") {
      this.fouled(holder, T, D, ending.foul);
      afterT = D + 0.6;
    } else {
      this.attKeysAt(D, /* @__PURE__ */ new Set([holder]));
    }
    this.sortBalls();
    for (const id of this.attOut) if (id !== this.gkA) this.tr.get(id)?.liven(this.r, 0, D - 0.3, 1.8, (t) => this.isFixed(id, t) || this.holderAt(t) === id);
    for (const id of this.tr.keys()) if (this.sideOf.get(id) === att) {
      const profile = id !== this.gkA ? this.movement.get(id) : void 0;
      this.tr.get(id).limit(VMAX);
      this.tr.get(id).bake(-this.lead, D + 1, VMAX, AMAX, profile?.accelerationFactor, profile?.agilityFactor);
    }
    this.sortBalls();
    for (const f of this.later) f();
    this.later = [];
    this.defend(0.35, Math.min(D, afterT));
    for (const f of this.post) f();
    T = this.restarts(Math.max(D, afterT), ending);
    this.sortBalls();
    for (const f of this.later) f();
    for (const tr of this.tr.values()) tr.limit(VMAX * 1.1);
    const gks = /* @__PURE__ */ new Set([this.p.onCourt[0][0], this.p.onCourt[1][0]]);
    for (const [id, tr] of this.tr) {
      const goalkeeper = gks.has(id);
      const profile = !goalkeeper ? this.movement.get(id) : void 0;
      tr.bake(
        -this.lead,
        T + 0.5,
        goalkeeper ? VMAX * 1.1 : VMAX,
        goalkeeper ? AMAX * 2.2 : this.sideOf.get(id) === att ? AMAX : AMAX * 1.3,
        profile?.accelerationFactor,
        profile?.agilityFactor
      );
    }
    this.finalT = T;
    this.extra = Math.max(0, T - D);
    const pos = {};
    for (const [id, tr] of this.tr) pos[id] = tr.at(T);
    const goal = this.lastGoal;
    const ballEnd = this.ballAt(T);
    const h = this.holderAt(T);
    this.end = goal ? { holder: null, ball: ballEnd, pos, kind: "kickoff" } : this.outAt && ending.kind === "lost" ? { holder: null, ball: this.outAt, pos, kind: "lateral" } : h && this.gkOfAny(h) && this.balls[this.balls.length - 1].k === "hands" ? { holder: h, ball: ballEnd, pos, kind: "gk" } : this.endGk ? { holder: this.endGk, ball: ballEnd, pos, kind: "gk" } : { holder: h, ball: ballEnd, pos, kind: "live" };
  }
  /** atributo 1-20 normalizado a 0-1 (0,5 sem dados: jogo sem plantéis) */
  au(id, k) {
    const a = id ? this.attrsOf.get(id) : void 0;
    return a ? clamp4((a[k] - 1) / 19, 0, 1) : 0.5;
  }
  get attackDirection() {
    return this.dirA;
  }
  get total() {
    return this.lead + this.duration + this.extra;
  }
  /** Tempo de jogo decorrido (o relógio não anda na preparação nem nas bolas paradas). */
  clockAt(ct) {
    return clamp4(ct - this.lead, 0, this.duration);
  }
  /** Momentos que merecem ser vistos devagar: a finalização e as bolas paradas. */
  isKey(ct) {
    const t = ct - this.lead;
    return t > this.D - 4.5 && (this.shotTimes.length > 0 || t > this.D);
  }
  /** Instante (na escala de at) do remate que deu golo, para a repetição. */
  get goalShotCt() {
    return this.lastGoal && this.shotTimes.length ? this.lead + this.shotTimes[this.shotTimes.length - 1] : null;
  }
  // ---------- utilidades ----------
  sortBalls() {
    this.balls = this.balls.map((b, i) => [b, i]).sort((x, y) => x[0].t0 - y[0].t0 || x[1] - y[1]).map((x) => x[0]);
  }
  nm(id) {
    return id ? this.names[id] ?? "" : "";
  }
  label(t, text) {
    this.labels.push({ t, text });
  }
  phase(t, text) {
    this.phases.push({ t, text });
  }
  A(u, v) {
    return { x: this.dirA * (u - 20), y: v };
  }
  U(p) {
    return this.dirA * p.x + 20;
  }
  /** Posição de baliza do GR que defende a baliza em x = gx (±20) contra uma bola em b: na bissetriz do ângulo
   *  dos postes, à profundidade dada (m da linha), mas nunca mais à frente do que a bola (−0,8 m) e sempre entre os
   *  postes (+0,25 m). Com ângulo fechado fica no primeiro poste. */
  gkSpot(gx, b, depth) {
    const sg = Math.sign(gx);
    const u1 = { x: gx - b.x, y: -1.5 - b.y }, u2 = { x: gx - b.x, y: 1.5 - b.y };
    const l1 = Math.hypot(u1.x, u1.y) || 1, l2 = Math.hypot(u2.x, u2.y) || 1;
    const bis = { x: u1.x / l1 + u2.x / l2, y: u1.y / l1 + u2.y / l2 };
    const bdist = Math.abs(gx - b.x);
    const d = Math.max(0.25, Math.min(depth, bdist - 0.8));
    const s0 = Math.abs(bis.x) > 0.05 ? (bdist - d) / Math.abs(bis.x) : 0;
    const q = s0 > 0 ? { x: b.x + bis.x * s0, y: b.y + bis.y * s0 } : { x: gx - sg * d, y: Math.sign(b.y) * 1.3 };
    return { x: q.x, y: clamp4(q.y, -1.75, 1.75) };
  }
  P(id, t) {
    return this.tr.get(id)?.at(t) ?? { x: 0, y: 0 };
  }
  key(id, t, p, hold = false) {
    this.tr.get(id)?.set(t, p, hold);
  }
  fix(id, t0, t1) {
    const l = this.fixed.get(id) ?? [];
    l.push([t0, t1]);
    this.fixed.set(id, l);
  }
  isFixed(id, t) {
    return (this.fixed.get(id) ?? []).some(([a, b]) => t >= a && t <= b);
  }
  act(id, kind, t0, t1, o = {}) {
    this.acts.push({ id, kind, t0, t1, ...o });
  }
  pass(from, to, t0, t1, lift = 0.08) {
    this.balls.push({ k: "pass", t0, t1, from, to, lift });
    this.balls.push({ k: "foot", t0: t1, id: to });
  }
  gkOfAny(id) {
    return id === this.p.onCourt[0][0] || id === this.p.onCourt[1][0];
  }
  nearestOut(b, t) {
    let best = this.attOut[0], bd = 1e9;
    for (const id of this.attOut) {
      const d = dist(this.P(id, t), b);
      if (d < bd) {
        bd = d;
        best = id;
      }
    }
    return best;
  }
  makeProg(t0, p0) {
    const span = Math.max(3, Math.min(8, (this.D - t0) * 0.5));
    return (t) => lerp(p0, 1, ease(clamp4((t - t0) / span, 0, 1)));
  }
  /** Posição na estrutura ofensiva (slot), conforme a progressão e o lado da bola. */
  slotPos(i, t, bv, jitter = 0) {
    const [au, av] = SHAPES[this.sys][i];
    const pr = this.progFn(t);
    const u = lerp(au - 13, au, pr) + (jitter ? (this.r() - 0.5) * jitter : 0);
    const v = av + bv * 0.22 + (jitter ? (this.r() - 0.5) * jitter : 0);
    return this.A(clamp4(u, 2, 38), clamp4(v, -8.6, 8.6));
  }
  /** Posição de partida em reposições (pontapé de saída, GR) */
  restPos(id, kind, kicker) {
    if (REFS.includes(id)) return { x: id === REFS[0] ? -2 : 2, y: id === REFS[0] ? -10.7 : 10.7 };
    const sd = this.sideOf.get(id);
    const isAtt = sd === this.att;
    const gk = id === this.p.onCourt[sd][0] && !this.p.flying[sd];
    if (isAtt) {
      if (gk) return this.A(kind === "gk" ? 1.4 : 2, 0);
      const i = this.slot.get(id) ?? 0;
      if (kind === "kickoff") {
        if (id === kicker) return this.A(19.6, 0.3);
        const [au2, av2] = SHAPES[this.sys][i];
        return this.A(clamp4(au2 - 8, 10, 19), av2 * 0.9);
      }
      const [au, av] = SHAPES[this.sys][i];
      return this.A(clamp4(au - 12, 5, 30), av * (Math.abs(av) > 5 ? 1.08 : 1));
    }
    if (gk || id === this.p.onCourt[sd][0]) return this.A(39, 0);
    const di = Math.max(0, this.defOut.indexOf(id));
    const [bu, bv] = BLOCK[this.tactics[sd].pressure][di % 4];
    return kind === "kickoff" ? this.A(Math.max(23.4, bu + 3), bv) : this.A(bu, bv);
  }
  /** Pontos-chave para os atacantes não envolvidos num lance, na estrutura. */
  attKeysAt(t, skip, bv) {
    const b = bv ?? this.ballAt(Math.min(t, this.lastBallT())).y;
    for (const id of this.attOut) if (!skip.has(id)) this.key(id, t, this.slotPos(this.slot.get(id) ?? 0, t, b, 1.6));
    const gs = this.tactics[this.att].gkStyle ?? "classico";
    const gkU = gs === "avancado" ? lerp(2, 10, this.progFn(t)) : gs === "construtor" ? lerp(1.6, 6.5, this.progFn(t)) : lerp(1.4, 4.2, this.progFn(t));
    if (this.gkA && !skip.has(this.gkA)) this.key(this.gkA, t, this.A(gkU, clamp4(b * (gs === "classico" ? 0.12 : 0.25), -2, 2)));
  }
  lastBallT() {
    const s2 = this.balls[this.balls.length - 1];
    return s2 ? s2.t0 : 0;
  }
  slotHolder(i, except) {
    return this.attOut.find((id) => this.slot.get(id) === i && id !== except);
  }
  // ---------- ataque organizado: passes e movimentos ----------
  beats(T, tEnd, holder, forced) {
    const r = this.r;
    const tA = this.tactics[this.att];
    const interval = tA.tempo === "rapido" ? 1.15 : tA.tempo === "paciente" ? 1.7 : 1.4;
    while (tEnd - T > 0.9) {
      let len = interval * (0.75 + r() * 0.5) * (r() < 0.12 ? 1.6 : 1);
      if (tEnd - T - len < 0.9) len = tEnd - T;
      const last = T + len >= tEnd - 0.01;
      const want = last && forced && forced !== holder ? forced : void 0;
      holder = this.move(T, len, holder, want);
      T += len;
    }
    if (forced && forced !== holder && tEnd - T > 0.4) holder = this.move(T, tEnd - T, holder, forced);
    else if (tEnd > T) this.attKeysAt(tEnd, /* @__PURE__ */ new Set([holder]));
    return holder;
  }
  /** Um lance de ataque: escolhe um padrão real conforme o sistema e executa-o. */
  move(T, len, holder, forced) {
    const r = this.r;
    const sys = this.sys;
    const tA = this.tactics[this.att];
    const hs2 = this.slot.get(holder);
    const others = this.attOut.filter((x) => x !== holder);
    if (this.isCounter && !forced && hs2 !== void 0) {
      const hp0 = this.P(holder, T);
      const go = this.A(Math.min(this.U(hp0) + len * 5.2, 29), hp0.y * 0.75);
      this.key(holder, T + len, go);
      this.attKeysAt(T + len, /* @__PURE__ */ new Set([holder]), go.y);
      return holder;
    }
    if (hs2 === void 0 || !others.length) {
      const to = forced ?? others[0] ?? holder;
      if (to !== holder) {
        this.act(holder, "pass", T + len - 0.75, T + len - 0.4, { face: to });
        this.pass(holder, to, T + len - 0.55, T + len);
      }
      this.attKeysAt(T + len, /* @__PURE__ */ new Set([holder]));
      return to;
    }
    const hp = this.P(holder, T);
    const sideOfBall = hp.y >= 0 ? 1 : -1;
    const fixoLike = (sys === "3-1" || sys === "1-2-1") && hs2 === 0;
    const backLike = (sys === "4-0" || sys === "2-2") && (hs2 === 0 || hs2 === 3);
    const pivo = sys === "3-1" || sys === "1-2-1" ? this.slotHolder(3) : void 0;
    const opts = [["circ", tA.tempo === "paciente" ? 3 : 2]];
    if (len >= 1.2) {
      if (fixoLike) opts.push(["paralela", 2], ["diagonal", 1.6]);
      if ((sys === "3-1" || sys === "1-2-1") && hs2 !== 3 && pivo) opts.push(["pivo", sys === "3-1" ? 2.4 : 1.2]);
      if (backLike) opts.push(["passaCorta", sys === "4-0" ? 3.5 : 1.6]);
      if (sys === "2-2" && hs2 !== void 0) opts.push(["cruzamento", 1.4]);
      if (len >= 1.6) opts.push(["bloqueio", sys === "4-0" ? 0.9 : 0.7], ["drible", tA.tempo === "rapido" ? 0.6 : 0.4]);
      if (sys === "5x4") opts.push(["inversao", 2.5], ["diagonalCurta", 2]);
      if ((sys === "3-1" || sys === "1-2-1") && hs2 !== 3 && pivo && len >= 1.5) opts.push(["falsoPivo", 1.1]);
    }
    const oppPress = this.tactics[1 - this.att].pressure;
    if (len >= 1.6 && others.length >= 2) opts.push(["emU", this.tactics[1 - this.att].marking === "zona" ? 0.9 : 0.35]);
    if (len >= 2 && this.U(hp) < 20 && pivo) opts.push(["cortina", oppPress === "alta" ? 2 : 0.6]);
    if (this.gkA && this.U(hp) < 17 && len >= 1.5) opts.push(["saidaGR", oppPress === "alta" ? 3 : oppPress === "media" ? 0.8 : 0.2]);
    let pick3 = r() * opts.reduce((a, o) => a + o[1], 0);
    let mv = opts[0][0];
    for (const [k, w] of opts) {
      pick3 -= w;
      if (pick3 <= 0) {
        mv = k;
        break;
      }
    }
    if (forced) {
      const fs = this.slot.get(forced);
      if (mv === "pivo" && fs !== 3) mv = "circ";
      if ((mv === "paralela" || mv === "diagonal") && (fs !== 1 && fs !== 2)) mv = "circ";
      if (mv === "bloqueio" || mv === "drible" || mv === "saidaGR") mv = "circ";
      if (mv === "falsoPivo" && fs !== 3) mv = "circ";
      if (mv === "emU" || mv === "diagonalCurta" || mv === "cortina") mv = "circ";
      if (mv === "passaCorta" && fs !== (hs2 === 0 ? 1 : 2)) mv = "circ";
    }
    const flightOf = (a, b) => clamp4(dist(a, b) / 12, 0.3, 0.9);
    const passTo = (to, toSpot, lift = 0.08) => {
      const fl = flightOf(hp, toSpot);
      const tp = T + len - fl;
      this.act(holder, "pass", tp - 0.2, tp + 0.15, { face: to });
      this.pass(holder, to, tp, T + len, lift);
    };
    const carry = (to) => this.key(holder, T + len * 0.55, to);
    const tEnd = T + len;
    if (mv === "paralela" || mv === "diagonal") {
      const s2 = r() < 0.5 ? -1 : 1;
      const alaSlot = s2 < 0 ? 1 : 2;
      const ala = this.slotHolder(alaSlot) ?? others[0];
      const opp = this.slotHolder(s2 < 0 ? 2 : 1);
      const recv2 = forced ?? ala;
      const spot2 = this.slotPos(this.slot.get(recv2) ?? alaSlot, tEnd, s2 * 4);
      carry(this.A(this.U(hp) + 1.2, hp.y * 0.6 + s2 * 1.2));
      passTo(recv2, spot2);
      this.key(recv2, tEnd, spot2);
      if (mv === "paralela") {
        const run = this.A(this.U(spot2) + 5, s2 * 8.6);
        this.key(holder, tEnd + 0.6, run);
        this.act(holder, "run", T + len * 0.6, tEnd + 0.8, { to: run });
        this.slot.set(holder, alaSlot);
        this.slot.set(recv2, 0);
        this.label(T + len * 0.6, `Paralela de ${this.nm(holder)}`);
      } else {
        const run = this.A(this.U(spot2) + 4, -s2 * 4.5);
        this.key(holder, tEnd + 0.6, run);
        this.act(holder, "run", T + len * 0.6, tEnd + 0.9, { to: run });
        this.slot.set(holder, s2 < 0 ? 2 : 1);
        if (opp) {
          this.slot.set(opp, 0);
          this.key(opp, tEnd + 0.4, this.slotPos(0, tEnd, s2 * 4));
        }
        this.slot.set(recv2, alaSlot);
        this.label(T + len * 0.6, `Diagonal de ${this.nm(holder)}`);
      }
      this.attKeysAt(tEnd, /* @__PURE__ */ new Set([holder, recv2, ...opp && mv === "diagonal" ? [opp] : []]), s2 * 4);
      return recv2;
    }
    if (mv === "pivo" && pivo) {
      const s2 = sideOfBall;
      const spot2 = this.A(clamp4(this.U(this.slotPos(3, tEnd, 0)) - 1.5, 26, 34), s2 * 2.2);
      this.key(pivo, T + len * 0.5, this.A(this.U(spot2) + 0.8, s2 * 1));
      this.key(pivo, tEnd, spot2);
      this.act(pivo, "run", T, tEnd, { to: spot2 });
      this.act(pivo, "shield", tEnd, tEnd + 1, { ang: this.dirA > 0 ? -Math.PI / 2 : Math.PI / 2 });
      passTo(pivo, spot2);
      const cut = this.A(clamp4(this.U(hp) + 6, 24, 34), s2 * 3.5);
      this.key(holder, tEnd + 0.7, cut);
      this.act(holder, "run", tEnd - 0.3, tEnd + 0.8, { to: cut });
      this.label(tEnd - 0.4, `Bola no piv\xF4 (${this.nm(pivo)}), corte de ${this.nm(holder)}`);
      this.attKeysAt(tEnd, /* @__PURE__ */ new Set([holder, pivo]), s2 * 2);
      return pivo;
    }
    if (mv === "passaCorta" || mv === "cruzamento" || mv === "inversao") {
      const s2 = hs2 === 0 || hs2 === 1 ? -1 : 1;
      if (mv === "passaCorta") {
        const wideSlot = s2 < 0 ? 1 : 2, oppWide = s2 < 0 ? 2 : 1, oppBack = s2 < 0 ? 3 : 0;
        const recv3 = forced ?? this.slotHolder(wideSlot) ?? others[0];
        const spot3 = this.slotPos(this.slot.get(recv3) ?? wideSlot, tEnd, s2 * 4);
        passTo(recv3, spot3);
        this.key(recv3, tEnd, spot3);
        const mid = this.A(clamp4(this.U(spot3) + 4, 20, 34), s2 * 1.5);
        const fin = this.slotPos(oppWide, tEnd + 1.6, s2 * 4);
        this.key(holder, tEnd + 0.5, mid);
        this.key(holder, tEnd + 1.6, fin);
        this.act(holder, "run", tEnd - 0.2, tEnd + 1.4, { to: mid });
        const pw = this.slotHolder(oppWide), pb = this.slotHolder(oppBack);
        if (pw && pw !== recv3) {
          this.slot.set(pw, oppBack);
          this.key(pw, tEnd + 1.2, this.slotPos(oppBack, tEnd + 1.2, s2 * 4));
        }
        if (pb && pb !== recv3) {
          this.slot.set(pb, hs2);
          this.key(pb, tEnd + 1, this.slotPos(hs2, tEnd + 1, s2 * 4));
        }
        this.slot.set(holder, oppWide);
        this.label(tEnd - 0.3, `Passe e corte de ${this.nm(holder)}`);
        this.attKeysAt(tEnd, /* @__PURE__ */ new Set([holder, recv3, ...pw ? [pw] : [], ...pb ? [pb] : []]), s2 * 4);
        return recv3;
      }
      if (mv === "cruzamento") {
        const f1 = this.slotHolder(1), f2 = this.slotHolder(2);
        const recv3 = forced ?? others.find((x) => x !== f1 && x !== f2) ?? others[0];
        const spot3 = this.slotPos(this.slot.get(recv3) ?? 0, tEnd, 0);
        passTo(recv3, spot3);
        this.key(recv3, tEnd, spot3);
        if (f1 && f2 && f1 !== recv3 && f2 !== recv3) {
          this.slot.set(f1, 2);
          this.slot.set(f2, 1);
          this.act(f1, "run", T, tEnd, { to: this.slotPos(2, tEnd, 0) });
          this.act(f2, "run", T, tEnd, { to: this.slotPos(1, tEnd, 0) });
          this.label(T + 0.4, "Cruzamento dos avan\xE7ados");
        }
        this.attKeysAt(tEnd, /* @__PURE__ */ new Set([holder, recv3]), 0);
        return recv3;
      }
      const recv2 = forced ?? others.reduce((a, b) => Math.abs(this.P(b, T).y - hp.y) > Math.abs(this.P(a, T).y - hp.y) ? b : a);
      const spot2 = this.slotPos(this.slot.get(recv2) ?? 0, tEnd, -hp.y * 0.3);
      passTo(recv2, spot2);
      this.key(recv2, tEnd, spot2);
      this.label(tEnd - 0.5, "Invers\xE3o do centro do jogo");
      this.attKeysAt(tEnd, /* @__PURE__ */ new Set([holder, recv2]), -hp.y * 0.3);
      return recv2;
    }
    if (mv === "saidaGR" && this.gkA) {
      const gk = this.gkA;
      const s2 = sideOfBall;
      const gSpot = this.A(3.2, clamp4(hp.y * 0.3, -2, 2));
      const t1 = T + len * 0.45;
      this.key(gk, t1, gSpot);
      this.act(holder, "pass", t1 - 0.45, t1 - 0.1, { face: gk });
      this.pass(holder, gk, t1 - 0.3, t1, 0.03);
      const recv2 = others.reduce((a, b) => this.P(b, T).y * -s2 > this.P(a, T).y * -s2 ? b : a);
      const rSpot = this.A(clamp4(this.U(this.P(recv2, T)) - 3, 6, 14), -s2 * 7.6);
      this.key(recv2, tEnd, rSpot);
      this.act(recv2, "run", t1 - 0.4, tEnd, { to: rSpot });
      this.act(gk, "pass", tEnd - 0.75, tEnd - 0.4, { face: recv2 });
      this.pass(gk, recv2, tEnd - 0.6, tEnd, 0.12);
      this.key(holder, tEnd, this.A(clamp4(this.U(hp) + 2, 6, 16), s2 * 7));
      this.label(t1 - 0.3, `Sa\xEDda de press\xE3o pelo guarda-redes`);
      this.attKeysAt(tEnd, /* @__PURE__ */ new Set([holder, recv2, gk]), -s2 * 4);
      this.key(gk, tEnd + 1.2, this.A(1.2, 0));
      return recv2;
    }
    if (mv === "diagonalCurta") {
      const s2 = sideOfBall;
      const base = others.filter((x) => this.U(this.P(x, T)) > 31).sort((a, b) => dist(this.P(a, T), hp) - dist(this.P(b, T), hp))[0] ?? others[0];
      const gapSpot = this.A(clamp4(this.U(hp) + 3, 29, 33), clamp4(hp.y * 0.45, -4.5, 4.5));
      this.key(base, tEnd, gapSpot);
      this.act(base, "run", T + len * 0.3, tEnd, { to: gapSpot });
      passTo(base, gapSpot, 0.03);
      this.label(tEnd - 0.4, `Diagonal curta para ${this.nm(base)}, entre as linhas`);
      this.attKeysAt(tEnd, /* @__PURE__ */ new Set([holder, base]), s2 * 2);
      this.key(base, tEnd + 1, this.slotPos(this.slot.get(base) ?? 3, tEnd + 1, s2 * 2));
      return base;
    }
    if (mv === "cortina" && pivo) {
      const s2 = sideOfBall;
      const wing = others.filter((x) => x !== pivo).reduce((a, b) => this.P(b, T).y * -s2 > this.P(a, T).y * -s2 ? b : a);
      const curtain = others.find((x) => x !== pivo && x !== wing);
      const t1 = T + len * 0.45;
      if (curtain) {
        const cs = { x: hp.x + this.dirA * 1.6, y: hp.y - s2 * 1.2 };
        this.key(curtain, t1 - 0.2, cs);
        this.act(curtain, "screen", t1 - 0.5, t1 + 0.3, { face: holder });
      }
      const wSpot = this.A(clamp4(this.U(hp) + 3, 10, 24), -s2 * 7.6);
      this.key(wing, t1 + 0.5, wSpot);
      this.act(holder, "pass", t1 - 0.35, t1, { face: wing });
      this.pass(holder, wing, t1 - 0.2, t1 + 0.5, 0.05);
      const pSpot = this.A(33, -s2 * 1.8);
      this.key(pivo, tEnd, pSpot);
      this.act(wing, "pass", t1 + 0.4, t1 + 0.7, { face: pivo });
      this.pass(wing, pivo, t1 + 0.55, tEnd, 0.05);
      this.act(pivo, "shield", tEnd, tEnd + 0.8, { ang: this.dirA > 0 ? -Math.PI / 2 : Math.PI / 2 });
      const cut = this.A(clamp4(this.U(hp) + 9, 22, 32), -s2 * 3);
      this.key(holder, tEnd + 0.4, cut);
      this.act(holder, "run", t1, tEnd + 0.4, { to: cut });
      this.label(t1 - 0.3, `Cortina, passe de primeira para o piv\xF4 e corte de ${this.nm(holder)}`);
      this.attKeysAt(tEnd, /* @__PURE__ */ new Set([holder, wing, pivo, ...curtain ? [curtain] : []]), -s2 * 3);
      return pivo;
    }
    if (mv === "emU") {
      const s2 = sideOfBall;
      const recv2 = others.reduce((a, b) => this.P(b, T).y * -s2 > this.P(a, T).y * -s2 ? b : a);
      const behind = this.A(clamp4(this.U(hp) - 2.2, 5, 30), hp.y * 0.2);
      const spot2 = this.A(clamp4(this.U(hp) + 2.5, 8, 33), clamp4(hp.y + s2 * 2.5, -8.5, 8.5));
      this.key(recv2, T + len * 0.55, behind);
      this.key(recv2, tEnd, spot2);
      this.act(recv2, "run", T, tEnd, { to: spot2 });
      carry(this.A(this.U(hp) + 0.6, hp.y - s2 * 0.8));
      passTo(recv2, spot2);
      this.label(T + len * 0.5, `Movimento em U de ${this.nm(recv2)} por tr\xE1s de ${this.nm(holder)}`);
      const rs2 = this.slot.get(recv2);
      if (rs2 !== void 0) {
        this.slot.set(recv2, hs2);
        this.slot.set(holder, rs2);
      }
      this.attKeysAt(tEnd, /* @__PURE__ */ new Set([holder, recv2]), spot2.y);
      this.key(holder, tEnd + 0.9, this.slotPos(this.slot.get(holder) ?? hs2, tEnd + 0.9, spot2.y, 1));
      return recv2;
    }
    if (mv === "falsoPivo" && pivo) {
      const s2 = sideOfBall;
      const come = this.A(clamp4(this.U(hp) + 5.5, 18, 28), clamp4(hp.y * 0.5, -4, 4));
      this.key(pivo, tEnd, come);
      this.act(pivo, "run", T, tEnd, { to: come });
      passTo(pivo, come);
      const runner = others.find((x) => x !== pivo && (this.P(x, T).y >= 0 ? 1 : -1) !== s2) ?? others.find((x) => x !== pivo);
      if (runner) {
        const deep = this.A(34.5, -s2 * 1.5);
        this.key(runner, tEnd + 0.9, deep);
        this.act(runner, "run", tEnd - 0.5, tEnd + 0.9, { to: deep });
        this.slot.set(runner, 3);
      }
      this.slot.set(pivo, this.slot.get(runner ?? "") ?? hs2);
      this.label(tEnd - 0.4, `Falso piv\xF4: ${this.nm(pivo)} sai para receber${runner ? `, ${this.nm(runner)} ataca as costas` : ""}`);
      this.later.push(() => {
        const m2 = this.defOut.reduce((a, b) => dist(this.P(b, T), this.P(pivo, T)) < dist(this.P(a, T), this.P(pivo, T)) ? b : a, this.defOut[0]);
        if (!m2) return;
        this.fix(m2, T + 0.2, tEnd + 0.6);
        this.key(m2, tEnd + 0.1, { x: come.x + this.dirA * 1.1, y: come.y });
      });
      this.attKeysAt(tEnd, /* @__PURE__ */ new Set([holder, pivo, ...runner ? [runner] : []]), come.y);
      return pivo;
    }
    if (mv === "bloqueio") {
      const screener = pivo && pivo !== holder ? pivo : others.reduce((a, b) => dist(this.P(b, T), hp) < dist(this.P(a, T), hp) ? b : a);
      const g = this.A(40, 0);
      const gd = dist(hp, g) || 1;
      const toward = { x: (g.x - hp.x) / gd, y: (g.y - hp.y) / gd };
      const lat = hp.y >= 0 ? -1 : 1;
      const scr = { x: hp.x + toward.x * 1.9 + lat * 0, y: hp.y + toward.y * 1.9 + lat * 0.9 };
      const tScr = T + Math.min(1.1, len * 0.45);
      this.key(screener, tScr, scr, false);
      this.key(screener, tScr + 0.6, scr, false);
      this.act(screener, "screen", tScr - 0.1, tScr + 0.7, { face: holder });
      const drive = this.A(clamp4(this.U(hp) + 3.2, 6, 33), clamp4(hp.y + lat * 4, -7.5, 7.5));
      this.key(holder, tScr + 0.2, { x: hp.x + toward.x * 0.3, y: hp.y });
      this.key(holder, tEnd, drive);
      this.act(holder, "feint", tScr - 0.1, tScr + 0.4, { ang: angTo(hp, drive) });
      const roll = this.A(clamp4(this.U(scr) + 4, 18, 35), scr.y * 0.4);
      this.key(screener, tEnd + 0.3, roll);
      this.act(screener, "run", tScr + 0.6, tEnd + 0.4, { to: roll });
      this.label(tScr - 0.2, `Bloqueio de ${this.nm(screener)} para ${this.nm(holder)}`);
      this.later.push(() => {
        const m2 = this.defOut.reduce((a, b) => dist(this.P(b, tScr - 0.4), hp) < dist(this.P(a, tScr - 0.4), hp) ? b : a, this.defOut[0]);
        if (!m2) return;
        const sp = this.P(screener, tScr + 0.2);
        const stuck = { x: sp.x + toward.x * 0.75, y: sp.y + toward.y * 0.75 - lat * 0.4 };
        this.fix(m2, tScr - 0.1, tScr + 0.9);
        this.key(m2, tScr + 0.15, stuck);
        this.key(m2, tScr + 0.8, { x: stuck.x + toward.x * 0.4, y: stuck.y + lat * 0.8 });
      });
      this.attKeysAt(tEnd, /* @__PURE__ */ new Set([holder, screener]), drive.y);
      return holder;
    }
    if (mv === "drible") {
      const lat = hp.y >= 0 ? -1 : 1;
      const drive = this.A(clamp4(this.U(hp) + 3.5, 6, 33), clamp4(hp.y + lat * 3, -7.5, 7.5));
      const tf = T + len * 0.35;
      this.act(holder, "feint", tf - 0.3, tf + 0.3, { ang: angTo(hp, drive) });
      this.key(holder, tf, { x: hp.x - lat * 0 + this.dirA * 0.4, y: hp.y - lat * 0.6 });
      this.key(holder, tEnd, drive);
      this.label(tf - 0.2, `Finta de ${this.nm(holder)}`);
      this.later.push(() => {
        const m2 = this.defOut.reduce((a, b) => dist(this.P(b, tf), hp) < dist(this.P(a, tf), hp) ? b : a, this.defOut[0]);
        if (!m2) return;
        const mp = this.P(m2, tf - 0.3);
        this.fix(m2, tf - 0.2, tf + 0.7);
        this.key(m2, tf + 0.1, { x: mp.x, y: mp.y - lat * 1.1 });
        this.key(m2, tf + 0.6, { x: mp.x + this.dirA * 0.6, y: mp.y - lat * 0.4 });
      });
      this.attKeysAt(tEnd, /* @__PURE__ */ new Set([holder]), drive.y);
      return holder;
    }
    const ADJ = {
      "3-1": [[1, 2, 3], [0, 3], [0, 3], [0, 1, 2]],
      "1-2-1": [[1, 2], [0, 3], [0, 3], [1, 2]],
      "4-0": [[1, 3], [0, 2], [1, 3], [0, 2]],
      "2-2": [[3, 1], [0, 2], [3, 1], [0, 2]],
      "5x4": [[1, 2], [0, 3], [0, 4], [1, 4], [2, 3]]
    };
    const nb = (ADJ[sys][hs2] ?? []).map((i) => this.slotHolder(i)).filter((x) => !!x && x !== holder);
    const recv = forced ?? (nb.length ? nb[Math.floor(r() * nb.length)] : others[Math.floor(r() * others.length)]);
    const rs = this.slot.get(recv) ?? 0;
    const spot = this.slotPos(rs, tEnd, this.P(recv, T).y * 0.5, 1.2);
    this.key(recv, tEnd, spot);
    carry(this.A(this.U(hp) + 0.8, hp.y + (r() - 0.5) * 1.6));
    passTo(recv, spot);
    this.attKeysAt(tEnd, /* @__PURE__ */ new Set([holder, recv]), spot.y);
    this.key(holder, tEnd + 0.4, this.slotPos(hs2, tEnd + 0.4, spot.y, 1));
    return recv;
  }
  // ---------- finalização de ataque organizado ----------
  /** Apaga movimentos planeados para depois de T (um novo lance substitui-os). */
  replan(T) {
    for (const id of this.attOut) this.tr.get(id).clear(T + 0.05, 1e9);
    if (this.gkA) this.tr.get(this.gkA).clear(T + 0.05, 1e9);
  }
  finish(holder, T, tS, shooter, assist, a) {
    const r = this.r;
    this.replan(T);
    const pivoSlot = (this.sys === "3-1" || this.sys === "1-2-1") && this.slot.get(shooter) === 3;
    let kind;
    if (!assist || holder === shooter) kind = a.result === "blocked" || r() < 0.4 ? r() < 0.5 ? "meia" : "individual" : "individual";
    else if (pivoSlot) kind = "pivo";
    else if (a.result === "blocked" || a.result === "wide") kind = r() < 0.7 ? "meia" : "poste2";
    else kind = r() < 0.55 ? "poste2" : r() < 0.5 ? "meia" : "pivo";
    const hp = this.P(holder, T);
    const s2 = hp.y >= 0 ? 1 : -1;
    const skip = /* @__PURE__ */ new Set([holder, shooter]);
    if (kind === "individual" || holder === shooter) {
      const from = this.P(shooter, T);
      const spot2 = this.A(kind === "meia" ? 28 : 31.5, clamp4(from.y * 0.45, -5, 5));
      if (holder !== shooter) {
        this.pass(holder, shooter, T + 0.1, T + 0.6);
        this.act(holder, "pass", T - 0.1, T + 0.25, { face: shooter });
      }
      const tf = lerp(T, tS, 0.45);
      if (kind !== "meia") {
        this.act(shooter, "feint", tf - 0.3, tf + 0.3, { ang: angTo(from, spot2) });
        this.label(tf - 0.3, `${this.nm(shooter)} em 1x1`);
        this.later.push(() => {
          const m2 = this.defOut.reduce((x, y) => dist(this.P(y, tf), this.P(shooter, tf)) < dist(this.P(x, tf), this.P(shooter, tf)) ? y : x, this.defOut[0]);
          if (!m2) return;
          const mp = this.P(m2, tf - 0.2);
          this.fix(m2, tf - 0.1, tf + 0.8);
          this.key(m2, tf + 0.2, { x: mp.x, y: mp.y + s2 * 1.1 });
          this.key(m2, tf + 0.8, { x: mp.x + this.dirA * 0.8, y: mp.y + s2 * 0.4 });
        });
      }
      this.key(shooter, tf, { x: lerp(from.x, spot2.x, 0.4), y: lerp(from.y, spot2.y, 0.4) - s2 * 0.6 });
      this.key(shooter, tS, spot2);
      this.attKeysAt(tS, skip, spot2.y);
      return;
    }
    if (kind === "poste2") {
      const wide = this.A(clamp4(this.U(hp) + 3, 30, 34), s2 * 7);
      const post = this.A(37.6, -s2 * 2.3);
      const tp2 = tS - 0.55;
      this.key(holder, tp2, wide);
      const sp02 = this.P(shooter, T);
      this.key(shooter, tS - 1.6, this.A(clamp4(this.U(sp02) + 2, 26, 34), -s2 * 5.5));
      this.key(shooter, tS, post);
      this.act(shooter, "run", tS - 1.7, tS, { to: post });
      this.act(holder, "pass", tp2 - 0.2, tp2 + 0.15, { face: shooter });
      this.pass(holder, shooter, tp2, tS - 0.02, 0.05);
      this.label(tS - 1.6, `Desmarca\xE7\xE3o de ${this.nm(shooter)} ao segundo poste`);
      this.attKeysAt(tS, skip, s2 * 3);
      return;
    }
    if (kind === "pivo") {
      const spot2 = this.A(32.5, s2 * 1.6);
      const turn = this.A(31.8, s2 * 0.2);
      const tr = tS - 1.25;
      this.key(shooter, tr, spot2);
      this.act(shooter, "shield", tr - 0.1, tr + 0.5, { ang: this.dirA > 0 ? -Math.PI / 2 : Math.PI / 2 });
      this.act(holder, "pass", tr - 0.7, tr - 0.35, { face: shooter });
      this.pass(holder, shooter, tr - 0.5, tr);
      this.act(shooter, "feint", tr + 0.4, tr + 0.85, { ang: angTo(spot2, turn) });
      this.key(shooter, tS, turn);
      this.label(tr, `${this.nm(shooter)} recebe de costas e roda`);
      this.later.push(() => {
        const m2 = this.defOut.reduce((x, y) => dist(this.P(y, tr), spot2) < dist(this.P(x, tr), spot2) ? y : x, this.defOut[0]);
        if (!m2) return;
        this.fix(m2, tr - 0.3, tS + 0.3);
        this.key(m2, tr, this.A(33.6, s2 * 1.6));
        this.key(m2, tS, this.A(33.2, s2 * 1.4));
      });
      this.attKeysAt(tS, skip, s2 * 2);
      return;
    }
    const spot = this.A(28.5 + r() * 1.5, s2 * (0.5 + r() * 2));
    const tp = tS - 0.6;
    this.key(holder, tp, this.A(clamp4(this.U(hp) + 1.5, 28, 33), s2 * 5));
    const sp0 = this.P(shooter, T);
    this.key(shooter, tS - 1, this.A(clamp4(this.U(sp0), 22, 27), spot.y * 0.6));
    this.key(shooter, tS, spot);
    this.act(shooter, "run", tS - 1.1, tS, { to: spot });
    this.act(holder, "pass", tp - 0.2, tp + 0.15, { face: shooter });
    this.pass(holder, shooter, tp, tS - 0.02);
    this.label(tS - 1, `${this.nm(shooter)} aparece para o remate de fora`);
    this.attKeysAt(tS, skip, s2 * 2);
  }
  // ---------- GR atacante: recebe atrás, conduz até ao meio-campo e remata de longe ----------
  gkCarry(holder, T, tS, gk) {
    this.replan(T);
    const hp = this.P(holder, T);
    const g0 = this.P(gk, T);
    this.act(holder, "pass", T + 0.1, T + 0.45, { face: gk });
    this.pass(holder, gk, T + 0.3, T + 1);
    this.key(holder, T + 1.4, this.A(clamp4(this.U(hp) + 4, 14, 30), hp.y));
    this.key(gk, T + 1, g0);
    const v = clamp4(g0.y + (this.r() - 0.5) * 5, -5, 5);
    const spot = this.A(18 + this.r() * 4, v);
    this.key(gk, lerp(T + 1, tS, 0.55), this.A(lerp(this.U(g0), this.U(spot), 0.6), lerp(g0.y, v, 0.6)));
    this.key(gk, tS, spot);
    for (const id of this.attOut) if (id !== holder) this.key(id, tS, this.slotPos(this.slot.get(id) ?? 0, tS, v, 1.2));
    this.label(T + 1.2, `${this.nm(gk)} (GR) sai a jogar com a bola`);
    this.label(tS - 0.3, `${this.nm(gk)} arrisca o remate de longe!`);
  }
  // ---------- contra-ataque: 2x1, 3x2, 2x0 ----------
  counterRun(carrier, T, tS, shooter, assist, a) {
    const r = this.r;
    this.replan(T);
    const cp = this.P(carrier, T);
    const others = this.attOut.filter((x) => x !== carrier);
    const ahead = others.sort((x, y) => this.U(this.P(y, T)) - this.U(this.P(x, T)));
    const s1 = cp.y <= 0 ? 1 : -1;
    const r1 = shooter !== carrier ? shooter : ahead[0];
    const r2 = assist && assist !== carrier && assist !== r1 ? assist : ahead.find((x) => x !== r1);
    const vc = clamp4(cp.y * 0.4, -3, 3);
    const end = this.A(32 + r() * 2, vc * 0.6);
    this.phase(T, "Contra-ataque");
    this.key(carrier, lerp(T, tS, 0.5), this.A(lerp(this.U(cp), this.U(end), 0.6), lerp(cp.y, vc, 0.6)));
    if (r1) {
      const lane = this.A(clamp4(this.U(this.P(r1, T)) + 7, 22, 33), s1 * 6.5);
      this.key(r1, lerp(T, tS, 0.55), lane);
      this.act(r1, "run", T, tS, { to: lane });
    }
    if (r2) {
      const lane = this.A(clamp4(this.U(this.P(r2, T)) + 6, 18, 28), -s1 * 5);
      this.key(r2, lerp(T, tS, 0.6), lane);
      this.act(r2, "run", T, tS - 0.5, { to: lane });
    }
    for (const id of others) if (id !== r1 && id !== r2) this.key(id, tS, this.A(clamp4(this.U(this.P(id, T)) + 6, 10, 20), this.P(id, T).y * 0.6));
    if (this.gkA) this.key(this.gkA, tS, this.A(3.5, 0));
    if (shooter === carrier) {
      this.key(carrier, tS, end);
      if (r() < 0.5) {
        this.act(carrier, "feint", tS - 1, tS - 0.5, { ang: angTo(cp, end) });
        this.label(tS - 1.1, `${this.nm(carrier)} finta o \xFAltimo defensor`);
      }
    } else if (assist && assist !== carrier && r2) {
      const wing = this.A(32, s1 * 6);
      this.key(assist, tS - 1.1, wing);
      this.key(carrier, tS - 1.5, this.A(lerp(this.U(cp), this.U(end), 0.8), vc));
      this.act(carrier, "pass", tS - 1.85, tS - 1.5, { face: assist });
      this.pass(carrier, assist, tS - 1.65, tS - 1.05);
      const post = this.A(37.4, -s1 * 2.2);
      this.key(shooter, tS, post);
      this.act(assist, "pass", tS - 0.75, tS - 0.4, { face: shooter });
      this.pass(assist, shooter, tS - 0.55, tS - 0.02, 0.05);
    } else {
      const uc = lerp(this.U(cp), this.U(end), 0.95);
      const post = this.A(Math.min(36.6, uc + 4.6), s1 * 1.9);
      this.key(carrier, tS - 0.55, this.A(uc, vc));
      this.key(shooter, lerp(T, tS, 0.75), this.A(uc - 1.2, vc + s1 * 3.4));
      this.key(shooter, tS - 0.5, this.A(uc + 0.4, vc + s1 * 3.2));
      this.key(shooter, tS, post);
      this.label(tS - 0.6, `Passe lateral para ${this.nm(shooter)}`);
      this.act(shooter, "run", T, tS, { to: post });
      this.act(carrier, "pass", tS - 0.75, tS - 0.4, { face: shooter });
      this.pass(carrier, shooter, tS - 0.55, tS - 0.02, 0.05);
    }
    const nAttack = shooter === carrier ? 1 : assist && assist !== carrier && r2 ? 3 : 2;
    const keep = nAttack === 3 ? 2 : nAttack === 1 ? r() < 0.4 ? 0 : 1 : 1;
    const defs = [...this.defOut].sort((x, y) => this.U(this.P(y, T)) - this.U(this.P(x, T)));
    defs.slice(keep).forEach((id, i) => {
      const d0 = this.P(id, T);
      this.fix(id, T, tS + 0.6);
      this.key(id, T, d0);
      this.later.push(() => {
        const bu = this.U(this.P(carrier, tS - 0.8));
        this.key(id, tS - 0.3, this.A(Math.min(bu - 2.5 - i * 1.6, this.U(d0) + 0.8 * (tS - T) * 5.6), d0.y * 0.5));
        this.key(id, tS + 0.6, this.A(Math.min(bu - 1 - i * 1.6, 36), d0.y * 0.4));
      });
      this.act(id, "run", T, tS);
    });
    if (keep === 0) this.label(T + 0.6, `${this.nm(carrier)} isolado, sozinho para a baliza!`);
    if (this.gkD && shooter !== carrier) {
      const gk = this.gkD;
      this.later.push(() => {
        const cpp = this.P(carrier, tS - 0.7);
        this.fix(gk, tS - 1.4, tS - 0.05);
        this.key(gk, tS - 0.65, this.A(37.2, clamp4(cpp.y * 0.55, -1.6, 1.6)));
      });
    }
    this.post.push(() => {
      const tm = tS - 1.2;
      const ball = this.ballAt(tm);
      const bu = this.U(ball);
      const nAtt = this.attOut.filter((id) => this.U(this.P(id, tm)) >= bu - 3).length;
      const nDef = this.defOut.filter((id) => this.U(this.P(id, tm)) > bu - 0.5).length;
      const na = Math.max(1, Math.min(4, nAtt)), nd = Math.min(4, nDef);
      this.label(T + 0.2, na > nd ? `Contra-ataque em superioridade: ${na}x${nd}` : "Transi\xE7\xE3o r\xE1pida, a defesa recupera a tempo");
    });
  }
  // ---------- perda de bola ----------
  loseBall(holder, T, D, tackler) {
    const r = this.r;
    this.replan(T);
    const hp = this.P(holder, T);
    const drive = this.A(clamp4(this.U(hp) + 2.5, 4, 34), hp.y * 0.8);
    this.key(holder, D, drive);
    this.attKeysAt(D, /* @__PURE__ */ new Set([holder]));
    if (!tackler || !this.tr.has(tackler)) return;
    const intercept = r() < 0.5;
    if (intercept) {
      const mate = this.attOut.find((x) => x !== holder) ?? holder;
      this.act(holder, "pass", D - 0.75, D - 0.4, { face: mate });
      this.later.push(() => {
        const a = this.P(holder, D - 0.55), b = this.P(mate, D);
        const cut = { x: lerp(a.x, b.x, 0.55), y: lerp(a.y, b.y, 0.55) };
        this.fix(tackler, D - 0.8, D + 0.3);
        this.key(tackler, D - 0.6, { x: cut.x + this.dirA * 1.2, y: cut.y + 0.8 });
        this.key(tackler, D, cut);
      });
      this.pass(holder, tackler, D - 0.55, D);
      this.label(D - 0.3, `${this.nm(tackler)} interceta o passe`);
    } else if (r() < 0.4) {
      const hp2 = this.P(holder, D);
      const out = { x: clamp4(hp2.x + this.dirA * (1 + r() * 2), -19, 19), y: (hp2.y >= 0 ? 1 : -1) * 10.6 };
      this.later.push(() => {
        this.fix(tackler, D - 0.8, D + 0.3);
        this.key(tackler, D - 0.55, { x: hp2.x + this.dirA * 1.6, y: hp2.y + 0.8 });
        this.key(tackler, D, { x: hp2.x + this.dirA * 0.55, y: hp2.y + 0.25 });
      });
      this.act(tackler, "tackle", D - 0.45, D + 0.2, { face: holder });
      this.balls.push({ k: "fly", t0: D - 0.05, t1: D + 0.6, from: holder, b: { x: out.x, y: out.y, z: 0.11 }, lift: 0.3 });
      this.balls.push({ k: "still", t0: D + 0.6, at: { x: out.x, y: out.y, z: 0.11 } });
      this.outAt = out;
      this.label(D - 0.3, `${this.nm(tackler)} desarma e a bola sai pela lateral`);
    } else {
      this.later.push(() => {
        const hp2 = this.P(holder, D);
        this.fix(tackler, D - 0.8, D + 0.3);
        this.key(tackler, D - 0.55, { x: hp2.x + this.dirA * 1.6, y: hp2.y + 0.8 });
        this.key(tackler, D, { x: hp2.x + this.dirA * 0.55, y: hp2.y + 0.25 });
      });
      this.act(tackler, "tackle", D - 0.45, D + 0.2, { face: holder });
      this.balls.push({ k: "foot", t0: D - 0.05, id: tackler });
      if (r() < 0.35) this.act(holder, "fall", D - 0.05, D + 1.3);
      this.label(D - 0.3, `Desarme de ${this.nm(tackler)}`);
    }
  }
  // ---------- falta ----------
  fouled(holder, T, D, f) {
    this.replan(T);
    const hp = this.P(holder, T);
    const drive = f.kind === "penalty" ? this.A(35.2 + this.r() * 1.6, clamp4(hp.y * 0.5, -4, 4)) : this.A(clamp4(this.U(hp) + 3, 6, 33), hp.y * 0.8);
    this.key(holder, D, drive);
    this.attKeysAt(D, /* @__PURE__ */ new Set([holder]));
    this.act(holder, "fall", D, D + 1.4);
    this.key(holder, D + 1.3, drive, true);
    const fouler = f.other;
    if (fouler && this.tr.has(fouler)) {
      this.later.push(() => {
        this.fix(fouler, D - 2.4, D + 0.7);
        for (const [dt, gap] of [[1.8, 2.6], [1.2, 1.6], [0.7, 0.9], [0.3, 0.55], [0, 0.35]]) {
          const hp2 = this.P(holder, D - dt);
          this.key(fouler, D - dt, { x: hp2.x + this.dirA * gap * 0.8, y: hp2.y - Math.sign(hp2.y || 1) * gap * 0.5 });
        }
      });
      this.act(fouler, "tackle", D - 0.4, D + 0.15, { face: holder });
    }
    this.balls.push({ k: "still", t0: D, at: { x: drive.x + this.dirA * 0.4, y: drive.y, z: 0.11 } });
    this.label(D, `Falta de ${this.nm(fouler)} sobre ${this.nm(holder)}`);
  }
  // ---------- defesa: pressão, cobertura e troca de marcações ----------
  defend(t0, t1) {
    const def = 1 - this.att;
    const tD = this.tactics[def];
    const press = PRESS_LINE[tD.pressure];
    const gap = tD.marking === "individual" ? 1 : tD.marking === "misto" ? 1.3 : 1.6;
    const pressGap = tD.pressure === "alta" ? 0.65 : tD.pressure === "media" ? 0.85 : 1.1;
    let fixedPairs = null;
    const dt = 0.25;
    for (let t = t0; t <= t1 + 1e-6; t += dt) {
      const ball = this.ballAt(t);
      const bu = this.U(ball), bv = ball.y;
      const holder = this.holderAt(t);
      const atts = this.attOut.map((id) => ({ id, p: this.P(id, Math.min(t1, t + 0.15)) }));
      const marks = [...atts];
      while (marks.length > this.defOut.length) {
        let wi = 0, wd = -1;
        marks.forEach((m2, i) => {
          const d = dist(m2.p, ball) + (m2.id === holder ? -99 : 0);
          if (d > wd) {
            wd = d;
            wi = i;
          }
        });
        marks.splice(wi, 1);
      }
      const spots = /* @__PURE__ */ new Map();
      for (const m2 of marks) {
        const au = this.U(m2.p), av = m2.p.y;
        const gu = 40 - au, gv = -av;
        const gl = Math.hypot(gu, gv) || 1;
        const isH = m2.id === holder;
        const g0 = isH ? pressGap : gap;
        let u = au + gu / gl * g0, v = av + gv / gl * g0;
        if (!isH) {
          const dB = Math.hypot(au - bu, av - bv);
          const help = clamp4((dB - 7) / 14, 0, tD.marking === "zona" ? 0.45 : tD.marking === "misto" ? 0.3 : 0.12);
          v = lerp(v, bv * 0.35, help);
          u += help * 3;
        }
        u = clamp4(Math.max(u, isH ? press : press + 1.5), 2, 39.2);
        spots.set(m2.id, this.A(u, clamp4(v, -9.4, 9.4)));
      }
      const free = this.defOut.filter((id) => !this.isFixed(id, t));
      const assign = /* @__PURE__ */ new Map();
      if (tD.marking === "individual" && fixedPairs) {
        for (const [d, a] of fixedPairs) if (spots.has(a) && free.includes(d)) assign.set(d, a);
      }
      const taken = new Set(assign.values());
      const pairs = [];
      for (const d of free) if (!assign.has(d)) {
        for (const [a, sp] of spots) if (!taken.has(a)) pairs.push([dist(this.P(d, t - dt), sp), d, a]);
      }
      pairs.sort((x, y) => x[0] - y[0]);
      for (const [, d, a] of pairs) if (!assign.has(d) && !taken.has(a)) {
        assign.set(d, a);
        taken.add(a);
      }
      if (!fixedPairs) fixedPairs = new Map(assign);
      for (const d of free) {
        const a = assign.get(d);
        const target = a ? spots.get(a) : this.A(clamp4(Math.max(bu + 4, press + 4), 20, 36), bv * 0.3);
        const prev = this.P(d, t - dt);
        const maxd = VMAX * 1.05 * dt;
        const dd = dist(prev, target);
        const np = dd > maxd ? { x: prev.x + (target.x - prev.x) * maxd / dd, y: prev.y + (target.y - prev.y) * maxd / dd } : target;
        this.key(d, t, np);
      }
      for (const [k, id] of REFS.entries()) {
        if (this.isFixed(id, t)) continue;
        const target = { x: clamp4(ball.x * 0.85 + (k ? 2.5 : -2.5) * this.dirA, -17, 17), y: k ? 10.7 : -10.7 };
        const prev = this.P(id, t - dt);
        const maxd = 6 * dt, dd = dist(prev, target);
        this.key(id, t, dd > maxd ? { x: prev.x + (target.x - prev.x) * maxd / dd, y: target.y } : target);
      }
      if (this.gkD && !this.isFixed(this.gkD, t)) {
        const gx = this.dirA * 20;
        const bl = this.ballAt(Math.max(t0, t - 0.15));
        const prev = this.P(this.gkD, t - dt);
        let target;
        if (this.U(bl) < 16) target = { x: gx - this.dirA * 3.6, y: clamp4(bl.y * 0.12, -1, 1) };
        else {
          const dl = Math.hypot(gx - bl.x, bl.y);
          const tight = clamp4(1 - Math.abs(bl.y) / Math.max(1, dl) * 0.75, 0.35, 1);
          const depth = clamp4(0.45 + dl * 0.12, 0.6, 2.4) * tight * (0.85 + this.au(this.gkD, "saidas") * 0.3);
          target = this.gkSpot(gx, bl, depth);
        }
        const dd = dist(prev, target);
        const maxLat = 4.5 * dt, maxDep = 3 * dt;
        const np = dd < 0.12 ? prev : { x: prev.x + clamp4(target.x - prev.x, -maxDep, maxDep), y: prev.y + clamp4(target.y - prev.y, -maxLat, maxLat) };
        this.key(this.gkD, t, np);
      }
    }
  }
  // ---------- remate ----------
  /** Remate e reação do guarda-redes / do defensor que bloqueia. Devolve o instante em que a bola fica parada. */
  shot(T, shooter, a, g) {
    const r = this.r;
    const res = a.result ?? "wide";
    const from = this.P(shooter, T);
    const side = r() < 0.5 ? -1 : 1;
    let target, after;
    let caught = false;
    const spill = this.spillNext;
    this.spillNext = false;
    const kSide = 1 - (this.sideOf.get(shooter) ?? this.att);
    const kId = this.p.onCourt[kSide][0];
    const kPos = kId && !this.p.flying[kSide] ? this.P(kId, T) : null;
    const fromDist = Math.hypot(g * 20 - from.x, from.y);
    const tightShot = Math.abs(from.y) > 1.3 && Math.abs(g * 20 - from.x) < Math.abs(from.y) * 1.2;
    const rush = kPos && fromDist < 8.5 && !tightShot && res !== "blocked" ? clamp4((8.5 - fromDist) * 0.45, 0.4, 2.6) : 0;
    const kDepth = tightShot ? 0.35 : rush ? Math.max(0.4, Math.abs(g * 20 - from.x) - clamp4(1 + fromDist * 0.15, 1, 2)) : clamp4(0.45 + fromDist * 0.12, 0.6, 2.2);
    const kBase = kPos ? this.gkSpot(g * 20, from, kDepth) : { x: g * 19.4, y: 0 };
    const gkX = kBase.x;
    if (res === "goal") {
      const v = (r() - 0.5) * 2.5;
      target = { x: g * 20.35, y: v, z: 0.15 + r() * 1.6 };
      after = { x: g * 20.9, y: v * 0.9, z: 0.1 };
    } else if (res === "post") {
      target = { x: g * 19.95, y: side * 1.52, z: 0.3 + r() * 1.4 };
      after = { x: g * 15, y: side * 4.5, z: 0.1 };
    } else if (res === "wide") {
      target = { x: g * 20.2, y: side * (1.9 + r() * 1.6), z: 0.2 + r() * 1.8 };
      after = { x: g * 21.8, y: side * (3 + r() * 2), z: 0.1 };
    } else if (res === "saved") {
      const v = (r() - 0.5) * 2.6;
      target = { x: gkX - g * 0.2, y: v, z: 0.2 + r() * 1.3 };
      caught = spill ? false : a.caught ?? (target.z < 1.7 && (Math.abs(v) < 0.8 || r() < 0.45));
      if (caught && target.z > 1.5) target.z = 1.1;
      const sv = Math.sign(v) || side;
      after = caught ? target : spill ? { x: g * (14.5 + r() * 2), y: clamp4(v * 2.5 + side * 1.5, -5, 5), z: 0.1 } : { x: g * (20.6 + r() * 0.8), y: sv * (2.6 + r() * 2.2), z: 0.1 };
    } else {
      const gl = Math.hypot(g * 20 - from.x, -from.y) || 1;
      target = { x: from.x + (g * 20 - from.x) / gl * 2.2, y: from.y + -from.y / gl * 2.2, z: 0.4 };
      after = { x: g * 20.6, y: (from.y >= 0 ? 1 : -1) * (6 + r() * 3), z: 0.1 };
    }
    const rem = this.au(shooter, "remate");
    const sdist = Math.hypot(target.x - from.x, target.y - from.y);
    const power = r() < (sdist < 6 ? 0.3 : 0.4 + 0.4 * rem);
    const vball = res === "blocked" ? 16 : power ? 22 + 8 * rem + r() * 3 : 14 + 5 * rem + r() * 3;
    const fl = clamp4(sdist / vball, 0.16, 1.1);
    const windup = power ? 0.3 : 0.2;
    this.shotTimes.push(T);
    this.act(shooter, "shoot", T - windup, T + windup * 0.75, { ang: angTo(from, target) });
    this.balls.push({ k: "fly", t0: T, t1: T + fl, from: shooter, b: target, lift: res === "blocked" ? 0.1 : 0.15 });
    this.label(T - 0.1, `Remate de ${this.nm(shooter)}`);
    const keeperSide = 1 - (this.sideOf.get(shooter) ?? this.att);
    const gk = this.p.onCourt[keeperSide][0];
    const gkInGoal = gk && !this.p.flying[keeperSide];
    let gkTech = null;
    const offTarget = res === "wide" && Math.abs(target.y) > 1.65 || target.z > 2.05;
    if (gkInGoal && res !== "blocked" && offTarget) {
      const step = clamp4(target.y * 0.25, -1.2, 1.2);
      this.later.push(() => {
        const g0 = this.P(gk, T);
        this.fix(gk, T, T + fl + 0.8);
        this.key(gk, T, g0);
        this.key(gk, T + fl + 0.3, { x: g0.x, y: clamp4(g0.y + step * 0.5, -1.7, 1.7) });
      });
    } else if (gkInGoal && res !== "blocked") {
      const ty = clamp4(target.y, -1.75, 1.75);
      const close = Math.hypot(g * 20 - from.x, from.y) < 7.5;
      const gPos = kBase;
      const lat = Math.abs(ty - gPos.y);
      let tech = lat < 0.45 && target.z < 1.7 ? "catch" : close && lat < 1.3 ? "spread" : target.z < 0.55 ? "splits" : lat > 0.9 || target.z > 1.2 ? "dive" : "splits";
      if (res === "saved" && !caught && tech === "catch") tech = target.z > 1.1 ? "dive" : close ? "spread" : "splits";
      gkTech = tech;
      const react = rush ? 0 : clamp4(0.2 - this.au(gk, "reflexos") * 0.1, 0.08, 0.2);
      const sy = Math.sign(ty - gPos.y) || 1;
      const reach = tech === "dive" ? 0.9 : tech === "splits" ? 0.75 : 0;
      const ky = res === "saved" || res === "post" ? ty - sy * reach : tech === "spread" ? lerp(gPos.y, ty, 0.3) : lerp(gPos.y, ty - sy * reach, res === "goal" ? 0.55 : 0.7);
      const tgt = { x: gkX, y: clamp4(rush || tightShot ? lerp(kBase.y, ky, 0.35) : ky, -1.8, 1.8) };
      if (rush) this.label(T - 0.2, `${this.nm(gk)} sai ao encontro do atacante`);
      const tR = T + Math.min(react, Math.max(0, fl - 0.12));
      this.later.push(() => {
        const g0 = this.P(gk, T - 0.15);
        this.fix(gk, T - (rush ? 0.9 : 0.2), T + fl + 1.6);
        if (rush) {
          const g1 = this.P(gk, T - 0.9);
          this.key(gk, T - 0.9, g1);
          this.key(gk, T - 0.05, kBase);
        } else {
          const set = { x: lerp(g0.x, kBase.x, 0.7), y: lerp(g0.y, kBase.y, 0.7) };
          this.key(gk, T - 0.2, set);
          this.key(gk, tR, set);
        }
        this.key(gk, T + fl, tgt, true);
        this.key(gk, T + fl + 1.3, tgt);
      });
      const peak = tech === "dive" ? 0.42 : tech === "splits" ? 0.31 : 0.29;
      if (tech === "catch") this.act(gk, "catch", tR, T + fl + 0.8, { face: shooter, h: target.z });
      else this.act(gk, tech, tR, tR + Math.max(0.12, fl - (tR - T) + 0.05) / peak, { to: { x: target.x, y: target.y }, h: target.z, face: shooter });
      if (res === "saved" && tech !== "catch") this.label(T + fl, tech === "dive" ? `Voo de ${this.nm(gk)} ao \xE2ngulo!` : tech === "splits" ? `${this.nm(gk)} defende com a perna, em espargata` : `${this.nm(gk)} fecha o \xE2ngulo em cruz`);
    }
    if (res === "blocked" && a.other && this.tr.has(a.other)) {
      const bl = a.other;
      this.later.push(() => {
        this.fix(bl, T - 0.7, T + 0.8);
        this.key(bl, T - 0.4, { x: target.x + g * 0.8, y: target.y + 0.7 });
        this.key(bl, T + fl, { x: target.x + g * 0.35, y: target.y });
        this.key(bl, T + 0.8, { x: target.x + g * 0.35, y: target.y });
      });
      this.act(bl, "block", T - 0.35, T + 0.6, { face: shooter });
      this.label(T + fl, `Remate bloqueado por ${this.nm(bl)}`);
    }
    let tEnd = T + fl;
    if (caught && gk) {
      const dived = gkTech === "dive" || gkTech === "splits";
      this.balls.push({ k: "hands", t0: tEnd, id: gk, z: dived ? 0.45 : 1 });
      this.label(tEnd, `${this.nm(gk)} agarra a bola`);
      const tUp = tEnd + (dived ? 1.4 : 0.6);
      this.balls.push({ k: "hands", t0: tUp, id: gk, z: 1 });
      const mates = this.p.onCourt[keeperSide].slice(1).filter((x) => !!x && this.tr.has(x));
      if (!mates.length) {
        this.endGk = gk;
        return tUp + 0.6;
      }
      const sgn = r() < 0.5 ? -1 : 1;
      const opts = [{ x: g * 11.5, y: sgn * 7.2 }, { x: g * 13, y: (r() - 0.5) * 3 }, { x: g * 2, y: -sgn * 6.5 }];
      const weights = [0.5, 0.25, 0.25 + 0.2 * this.au(gk, "jogoPes")];
      const opp = [...this.attOut, ...this.defOut].filter((d) => this.sideOf.get(d) !== keeperSide);
      const room = (q) => Math.min(6, ...opp.map((d) => dist(this.P(d, tEnd), q)));
      const si = [0, 1, 2].reduce((x, y) => room(opts[y]) + weights[y] * 3 + r() > room(opts[x]) + weights[x] * 3 + r() ? y : x);
      const spot = opts[si];
      const mate = mates.reduce((x, y) => dist(this.P(y, T), spot) < dist(this.P(x, T), spot) ? y : x);
      const tThrow = tUp + 0.7 + r() * 0.5;
      const thrD = dist({ x: g * 18.6, y: 0 }, spot);
      const thrT = thrD < 9 ? thrD / 9 : 0.25 + thrD / 15;
      this.later.push(() => {
        this.key(mate, tThrow + thrT, spot);
        this.key(gk, tUp + 0.4, { x: g * 18.6, y: clamp4(this.P(gk, tEnd).y, -1.5, 1.5) });
      });
      this.act(gk, "throw", tThrow - 0.6, tThrow + 0.2, { face: mate });
      this.balls.push({ k: "pass", t0: tThrow, t1: tThrow + thrT, from: gk, to: mate, lift: thrD < 9 ? 0.03 : 0.12 + thrD * 0.03 });
      this.balls.push({ k: "foot", t0: tThrow + thrT, id: mate });
      this.label(tThrow - 0.4, `${this.nm(gk)} rep\xF5e a bola com a m\xE3o`);
      return tThrow + thrT + 0.35;
    }
    const fl2 = res === "goal" ? 0.25 : 0.8;
    this.balls.push({ k: "fly", t0: tEnd, t1: tEnd + fl2, from: target, b: after, lift: res === "goal" ? 0 : 0.5 });
    this.balls.push({ k: "still", t0: tEnd + fl2, at: after });
    if (res === "post") this.label(tEnd, "Ao poste!");
    if (res === "goal") {
      this.lastGoal = true;
      this.label(tEnd, `GOLO de ${this.nm(shooter)}!`);
    }
    if (spill && res === "saved") {
      this.label(tEnd, `${this.nm(gk)} defende para a frente... ressalto!`);
      return tEnd + 0.5;
    }
    if ((res === "wide" || res === "saved") && gk && !this.p.flying[keeperSide]) this.endGk = gk;
    tEnd += fl2 + 0.3;
    return tEnd;
  }
  // ---------- bolas paradas e lances seguintes ----------
  restarts(T, ending) {
    const p = this.p;
    const att = this.att;
    const first = p.actions[0];
    const rest = p.actions.slice(first ? 1 : 0);
    if (ending.kind === "shot" && ending.shot?.result === "goal") return this.celebrate(T, ending.shot.shooter, att);
    let foulPending = ending.kind === "foul";
    for (let i = 0; i < rest.length; i++) {
      const a = rest[i];
      if (a.type === "brawl") {
        T = this.brawl(T, a);
        continue;
      }
      if (a.type === "corner") {
        const nx = rest[i + 1];
        const withShot = nx && nx.type === "shot" && nx.side === att && nx.kind === "setpiece" ? nx : void 0;
        T = this.corner(T, a.shooter, withShot);
        if (withShot) {
          i++;
          if (withShot.result === "goal") return this.celebrate(T, withShot.shooter, att);
        } else T = this.clearance(T);
        continue;
      }
      if (a.type !== "shot") continue;
      if (a.kind === "rebound") {
        T = this.rebound(T, a);
        if (a.result === "goal") return this.celebrate(T, a.shooter, att);
        continue;
      }
      if (a.side !== att) {
        T = this.oppShot(T, a);
        if (a.result === "goal") return this.celebrate(T, a.shooter, a.side);
        continue;
      }
      if (a.kind === "free10" || a.kind === "penalty") {
        T = this.spotKick(T, a);
        foulPending = false;
        if (a.result === "goal") return this.celebrate(T, a.shooter, att);
        continue;
      }
      if (a.kind === "setpiece" && foulPending) {
        T = this.freeKick(T, a);
        foulPending = false;
        if (a.result === "goal") return this.celebrate(T, a.shooter, att);
      }
    }
    if (foulPending && ending.foul?.kind !== "free10" && ending.foul?.kind !== "penalty") T = this.freeKick(T, null);
    return T;
  }
  /** Posições de todos num instante, com marcação "hold" (chegada obrigatória). */
  placeAll(t, m2, hold = true) {
    for (const [id, p] of m2) {
      this.key(id, t, p, hold);
      this.fix(id, t - 0.1, t + 0.1);
    }
  }
  corner(T, taker, sh2) {
    const r = this.r;
    const att = this.att;
    const routine = this.tactics[att].setPieces?.cornerRoutine ?? "primeiro_poste";
    const s2 = this.ballAt(T).y >= 0 ? 1 : -1;
    const spot = { x: this.dirA * 19.75, y: s2 * 9.75, z: 0.11 };
    const b0 = this.ballAt(T);
    const tp0 = this.P(taker, T);
    const tPick = T + clamp4(dist(tp0, b0) / 6, 0.5, 2.6);
    const tPlace = tPick + clamp4(dist(b0, spot) / 4.5, 0.4, 2.5);
    const tSet = Math.max(T + 3.4, tPlace + 0.6);
    const tKick = tSet + 0.9;
    this.key(taker, tPick, { x: b0.x, y: b0.y }, true);
    this.key(taker, tPlace, { x: spot.x + this.dirA * 0.5, y: spot.y + Math.sign(spot.y) * 0.5 }, true);
    this.fix(taker, T, tKick);
    this.balls.push({ k: "still", t0: T, at: { x: b0.x, y: b0.y, z: 0.11 } });
    this.balls.push({ k: "hands", t0: tPick, id: taker, z: 0.95 });
    this.balls.push({ k: "still", t0: tPlace, at: spot });
    const NAMES2 = { primeiro_poste: "ao primeiro poste", remate_fora: "remate de fora", bloqueio_pivo: "bloqueio para o piv\xF4", curto: "canto curto", personalizado: "jogada desenhada" };
    this.phase(T, `Canto (${NAMES2[routine]})`);
    this.label(T + 0.4, `Canto para ${this.nm(taker)} marcar`);
    const others = this.attOut.filter((x) => x !== taker);
    const cpC = this.tactics[att].setPieces?.customCorner;
    if (routine === "personalizado" && cpC) return this.customPlay(T, taker, this.A(40.3, s2 * 10.35), s2, tSet, tKick, sh2, cpC);
    const shooter = sh2 && others.includes(sh2.shooter) ? sh2.shooter : others[Math.floor(r() * others.length)];
    const rest = others.filter((x) => x !== shooter);
    const m2 = /* @__PURE__ */ new Map();
    m2.set(taker, this.A(40.3, s2 * 10.35));
    let shotSpot, startShooter;
    const roles = [];
    if (routine === "primeiro_poste") {
      startShooter = this.A(32.5, s2 * 4.5);
      shotSpot = this.A(38.1, s2 * 1.9);
      roles.push(this.A(30, 0), this.A(33.5, -s2 * 3.5));
    } else if (routine === "remate_fora") {
      startShooter = this.A(26.5, s2 * 2);
      shotSpot = this.A(30, s2 * 1.2);
      roles.push(this.A(37.6, s2 * 0.5), this.A(36.9, -s2 * 1.3));
    } else if (routine === "bloqueio_pivo") {
      startShooter = this.A(33.5, 0);
      shotSpot = this.A(36.6, s2 * 2.4);
      roles.push(this.A(34, s2 * 2), this.A(29.5, -s2 * 2));
    } else {
      startShooter = this.A(31.5, s2 * 2.5);
      shotSpot = this.A(33.5, s2 * 3.5);
      roles.push(this.A(37, s2 * 7.6), this.A(30.5, -s2 * 3));
    }
    m2.set(shooter, startShooter);
    rest.forEach((id, i) => m2.set(id, roles[i] ?? this.A(24, (i - 1) * 4)));
    if (this.gkA) m2.set(this.gkA, this.A(4, 0));
    const dSpots = [this.A(36.8, s2 * 3.6), this.A(34.6, s2 * 0.3), this.A(36.2, -s2 * 2.8), this.A(31.2, s2 * 1.2)];
    const dIds = [...this.defOut];
    dIds.forEach((id, i) => m2.set(id, dSpots[i] ?? this.A(28, 0)));
    if (this.gkD) m2.set(this.gkD, this.A(39.5, s2 * 0.9));
    this.placeAll(tSet, m2);
    for (const [id, p2] of m2) this.key(id, tKick - 0.15, p2, true);
    this.label(tSet - 1.6, "Organiza\xE7\xE3o ofensiva e defensiva para o canto");
    this.act(taker, "pass", tKick - 0.25, tKick + 0.15, { face: shooter });
    const tr = tKick + (routine === "curto" ? 0.45 : 0.75);
    if (routine === "primeiro_poste") {
      this.act(shooter, "run", tKick - 0.5, tr, { to: shotSpot });
      this.key(rest[0] ?? shooter, tr, this.A(33, s2 * 1.5));
      if (rest[1]) this.key(rest[1], tr, this.A(37.5, -s2 * 1.6));
      this.label(tKick, `Bola tensa ao primeiro poste para ${this.nm(shooter)}`);
    } else if (routine === "remate_fora") {
      rest.forEach((id) => this.act(id, "screen", tKick - 0.3, tr + 0.5, { face: shooter }));
      this.act(shooter, "run", tKick - 0.5, tr, { to: shotSpot });
      this.label(tKick, `Passe atrasado para o remate de ${this.nm(shooter)}`);
    } else if (routine === "bloqueio_pivo") {
      if (rest[0]) {
        this.key(rest[0], tKick + 0.1, this.A(35.5, s2 * 1));
        this.act(rest[0], "screen", tKick - 0.1, tr + 0.4, { face: taker });
      }
      this.act(shooter, "run", tKick - 0.2, tr, { to: shotSpot });
      this.label(tKick - 0.2, `Bloqueio de ${this.nm(rest[0])} para libertar ${this.nm(shooter)}`);
    } else {
      if (rest[0]) this.key(rest[0], tKick + 0.2, this.A(37, s2 * 6.8));
      this.act(shooter, "run", tKick - 0.3, tr, { to: shotSpot });
      this.label(tKick, "Canto jogado curto");
    }
    this.key(shooter, tr, shotSpot);
    this.key(taker, tr + 0.6, this.A(37.5, s2 * 8));
    this.pass(taker, shooter, tKick, tr, routine === "remate_fora" ? 0.03 : 0.06);
    const near = dIds.reduce((x, y) => dist(m2.get(y), shotSpot) < dist(m2.get(x), shotSpot) ? y : x, dIds[0]);
    if (near) this.key(near, tr + 0.25, { x: lerp(m2.get(near).x, shotSpot.x, 0.7), y: lerp(m2.get(near).y, shotSpot.y, 0.7) });
    for (const id of dIds) if (id !== near) this.key(id, tr + 0.5, { x: m2.get(id).x, y: lerp(m2.get(id).y, shotSpot.y, 0.25) });
    if (!sh2) {
      this.attKeysAt(tr + 1.2, /* @__PURE__ */ new Set([shooter, taker]));
      return tr;
    }
    const tShot = tr + (routine === "curto" ? 0.55 : 0.05);
    if (routine === "curto") {
      this.act(shooter, "feint", tr, tShot, { ang: angTo(shotSpot, this.A(40, 0)) });
      this.key(shooter, tShot, this.A(33.3, s2 * 2.5));
    }
    return this.shot(tShot, shooter, sh2, this.dirA);
  }
  /** Jogada desenhada pelo treinador (cantos e livres): posições, setas (movimentos) e tracejados (passes). */
  customPlay(T, taker, takerAt, s2, tSet, tKick, sh2, cp) {
    const att = this.att;
    const others = this.attOut.filter((x) => x !== taker);
    const free = [...others];
    const ids = cp.slots.map((sl) => {
      const want = sl.player && free.includes(sl.player) ? sl.player : sl.role === "rematador" && sh2?.shooter && free.includes(sh2.shooter) ? sh2.shooter : free[0];
      free.splice(free.indexOf(want), 1);
      return want;
    }).filter(Boolean);
    const P2 = (q) => this.A(q.x, s2 * q.y);
    const m2 = /* @__PURE__ */ new Map();
    m2.set(taker, takerAt);
    cp.slots.forEach((sl, i) => {
      if (ids[i]) m2.set(ids[i], P2(sl));
    });
    free.forEach((id, i) => m2.set(id, this.A(22, (i - 0.5) * 6)));
    if (this.gkA) m2.set(this.gkA, this.A(4, 0));
    const dIds = [...this.defOut];
    dIds.forEach((id, i) => {
      const near = ids[i] ? m2.get(ids[i]) : this.A(34, 0);
      m2.set(id, { x: lerp(near.x, this.A(39, 0).x, 0.35), y: near.y * 0.8 });
    });
    if (this.gkD) m2.set(this.gkD, this.A(39.5, s2 * 0.9));
    this.placeAll(tSet, m2);
    for (const [id, p2] of m2) this.key(id, tKick - 0.15, p2, true);
    this.label(tSet - 1.6, "Jogada ensaiada desenhada pelo treinador");
    const tr = tKick + 0.8;
    for (const path of cp.paths.filter((x) => x.kind === "run" && x.from >= 0)) {
      const id = ids[path.from];
      if (!id) continue;
      this.key(id, tr, P2(path.to));
      this.act(id, cp.slots[path.from].role === "bloqueio" ? "screen" : "run", tKick - 0.4, tr, cp.slots[path.from].role === "bloqueio" ? { face: taker } : { to: P2(path.to) });
    }
    cp.slots.forEach((sl, i) => {
      if (sl.role === "bloqueio" && ids[i] && !cp.paths.some((x) => x.from === i && x.kind === "run")) this.act(ids[i], "screen", tKick - 0.3, tr + 0.4, { face: taker });
    });
    const pass0 = cp.paths.find((x) => x.kind === "pass" && x.from === -1);
    const endOf = (i) => {
      const rp = cp.paths.find((x) => x.kind === "run" && x.from === i);
      return P2(rp ? rp.to : cp.slots[i]);
    };
    const recvIdx = pass0 ? cp.slots.map((_, i) => i).filter((i) => ids[i]).sort((a, b) => dist(endOf(a), P2(pass0.to)) - dist(endOf(b), P2(pass0.to)))[0] : cp.slots.findIndex((x) => x.role === "rematador");
    const receiver = ids[recvIdx] ?? ids[0] ?? others[0];
    this.key(receiver, tr, endOf(recvIdx));
    this.pass(taker, receiver, tKick, tr, 0.05);
    let shooter = receiver, tShot = tr + 0.05;
    const pass2 = cp.paths.find((x) => x.kind === "pass" && x.from === recvIdx);
    if (pass2) {
      const j = cp.slots.map((_, i) => i).filter((i) => ids[i] && i !== recvIdx).sort((a, b) => dist(endOf(a), P2(pass2.to)) - dist(endOf(b), P2(pass2.to)))[0];
      if (j !== void 0 && ids[j]) {
        this.key(ids[j], tr + 0.6, endOf(j));
        this.pass(receiver, ids[j], tr + 0.1, tr + 0.6, 0.05);
        shooter = ids[j];
        tShot = tr + 0.65;
      }
    }
    this.label(tKick, `Jogada desenhada: ${this.nm(taker)} para ${this.nm(receiver)}`);
    if (!sh2) {
      this.attKeysAt(tShot + 1.2, /* @__PURE__ */ new Set([shooter, taker]));
      return tShot;
    }
    const realShooter = sh2.shooter && this.attOut.includes(sh2.shooter) ? sh2.shooter : shooter;
    if (realShooter !== shooter) {
      const sp = this.P(realShooter, tShot);
      this.pass(shooter, realShooter, tShot, tShot + 0.5, 0.05);
      this.key(realShooter, tShot + 0.5, sp);
      tShot += 0.55;
    }
    return this.shot(tShot, realShooter, sh2, this.dirA);
  }
  /** A defesa afasta a bola depois de um canto ou livre sem remate. */
  clearance(T) {
    const def = this.defOut;
    if (!def.length) return T;
    const ball = this.ballAt(T);
    const cl = def.reduce((x, y) => dist(this.P(y, T), ball) < dist(this.P(x, T), ball) ? y : x, def[0]);
    const cp = this.P(cl, T);
    this.key(cl, T + 0.4, { x: lerp(cp.x, ball.x, 0.85), y: lerp(cp.y, ball.y, 0.85) });
    this.balls.push({ k: "foot", t0: T + 0.4, id: cl });
    this.act(cl, "pass", T + 0.45, T + 0.8, { ang: this.dirA > 0 ? -Math.PI / 2 : Math.PI / 2 });
    const to = { x: this.dirA * -2, y: ball.y * 0.4, z: 0.1 };
    this.balls.push({ k: "fly", t0: T + 0.6, t1: T + 1.6, from: cl, b: to, lift: 1.6 });
    this.balls.push({ k: "still", t0: T + 1.6, at: to });
    this.label(T + 0.5, `${this.nm(cl)} afasta o perigo`);
    const rec = def.filter((x) => x !== cl).reduce((x, y) => dist(this.P(y, T), to) < dist(this.P(x, T), to) ? y : x, def.find((x) => x !== cl) ?? cl);
    this.key(rec, T + 1.8, { x: to.x, y: to.y - 0.3 });
    this.balls.push({ k: "foot", t0: T + 1.8, id: rec });
    for (const id of this.attOut) this.key(id, T + 2, this.slotPos(this.slot.get(id) ?? 0, T + 2, 0));
    return T + 2;
  }
  freeKick(T, sh2) {
    const r = this.r;
    const att = this.att;
    const ball = this.ballAt(T);
    const routine = this.tactics[att].setPieces?.freeKickRoutine ?? "remate_direto";
    let at = { x: ball.x, y: ball.y };
    if (this.U(at) > 31.5 - Math.max(0, Math.abs(at.y) - 3) * 0.4) at = this.A(31.5 - Math.max(0, Math.abs(at.y) - 3) * 0.4, clamp4(at.y, -8, 8));
    const bu = this.U(at);
    const kicker = sh2 ? sh2.assist && this.attOut.includes(sh2.assist) ? sh2.assist : sh2.shooter : this.nearestOut(at, T);
    const shooter = sh2?.shooter && this.attOut.includes(sh2.shooter) ? sh2.shooter : kicker;
    const kp0 = this.P(kicker, T);
    const tPick = T + clamp4(dist(kp0, ball) / 5.5, 0.4, 1.8);
    const tPlace = tPick + clamp4(dist(ball, at) / 4.5, 0.3, 1.6);
    const tSet = Math.max(T + (sh2 ? 2.8 : 1.4), tPlace + 0.5);
    const tKick = tSet + (sh2 ? 0.9 : 0.3);
    this.balls.push({ k: "still", t0: T, at: { x: ball.x, y: ball.y, z: 0.11 } });
    this.key(kicker, tPick, { x: ball.x, y: ball.y }, true);
    this.balls.push({ k: "hands", t0: tPick, id: kicker, z: 0.95 });
    this.key(kicker, tPlace, { x: at.x, y: at.y }, true);
    this.balls.push({ k: "still", t0: tPlace, at: { ...at, z: 0.11 } });
    this.fix(kicker, T, tPlace + 0.1);
    const cpF = this.tactics[att].setPieces?.customFk;
    if (routine === "personalizado" && cpF && sh2) {
      this.key(kicker, tSet, at, true);
      this.fix(kicker, T, tKick + 0.3);
      return this.customPlay(T, kicker, at, at.y >= 0 ? 1 : -1, tSet, tKick + 0.4, sh2, cpF);
    }
    const m2 = /* @__PURE__ */ new Map();
    const g = this.A(40, 0);
    const gl = dist(at, g) || 1;
    const toG = { x: (g.x - at.x) / gl, y: (g.y - at.y) / gl };
    const perp = { x: -toG.y, y: toG.x };
    m2.set(kicker, { x: at.x - toG.x * 0.9, y: at.y - toG.y * 0.9 });
    const others = this.attOut.filter((x) => x !== kicker);
    if (!sh2) {
      const mate = others.reduce((x, y) => dist(this.P(y, T), at) < dist(this.P(x, T), at) ? y : x, others[0] ?? kicker);
      this.key(kicker, tSet, m2.get(kicker), true);
      this.fix(kicker, T, tKick + 0.3);
      this.act(kicker, "pass", tKick - 0.2, tKick + 0.15, { face: mate });
      this.pass(kicker, mate, tKick, tKick + 0.7);
      this.label(T + 0.3, `Livre marcado por ${this.nm(kicker)}`);
      return tKick + 0.7;
    }
    this.phase(T, "Livre direto");
    const barrier = bu > 22;
    const dIds = [...this.defOut];
    if (barrier) {
      const b0 = { x: at.x + toG.x * 5, y: at.y + toG.y * 5 };
      if (dIds[0]) m2.set(dIds[0], { x: b0.x + perp.x * 0.32, y: b0.y + perp.y * 0.32 });
      if (dIds[1]) m2.set(dIds[1], { x: b0.x - perp.x * 0.32, y: b0.y - perp.y * 0.32 });
      this.label(tSet - 1.2, "Barreira a 5 metros");
    }
    const s2 = at.y >= 0 ? 1 : -1;
    if (routine === "jogada_ensaiada" && shooter !== kicker) m2.set(shooter, { x: at.x + perp.x * 3 - toG.x * 1.5, y: at.y + perp.y * 3 - toG.y * 1.5 });
    else if (shooter !== kicker) m2.set(shooter, this.A(33.5, -s2 * 4));
    others.filter((x) => x !== shooter).forEach((id, i) => m2.set(id, i === 0 ? this.A(36, -s2 * 3) : this.A(bu - 4, s2 * 6)));
    dIds.slice(barrier ? 2 : 0).forEach((id, i) => {
      const a = [...m2.entries()].filter(([k]) => this.sideOf.get(k) === att && k !== kicker)[i];
      m2.set(id, a ? { x: a[1].x + this.dirA * 1.4, y: a[1].y * 0.9 } : this.A(34, 0));
    });
    if (this.gkD) m2.set(this.gkD, this.A(39.4, clamp4(-s2 * 0.7, -1.3, 1.3)));
    if (this.gkA) m2.set(this.gkA, this.A(4, 0));
    this.placeAll(tSet, m2);
    for (const [id, p2] of m2) this.key(id, tKick - 0.2, p2, true);
    let tShot = tKick;
    if (routine === "remate_direto" || shooter === kicker) {
      this.label(tSet - 0.3, `${this.nm(kicker)} prepara o remate direto`);
      this.key(kicker, tKick, { x: at.x - toG.x * 0.4, y: at.y - toG.y * 0.4 });
      this.balls.push({ k: "foot", t0: tKick - 0.05, id: kicker });
    } else if (routine === "jogada_ensaiada") {
      const sp = { x: at.x + perp.x * 2.2 + toG.x * 0.6, y: at.y + perp.y * 2.2 + toG.y * 0.6 };
      this.act(kicker, "pass", tKick - 0.2, tKick + 0.1, { face: shooter });
      this.pass(kicker, shooter, tKick, tKick + 0.45, 0.02);
      this.key(shooter, tKick + 0.45, sp);
      this.act(shooter, "run", tKick - 0.3, tKick + 0.45, { to: sp });
      tShot = tKick + 0.5;
      this.label(tKick - 0.3, `Jogada ensaiada: ${this.nm(kicker)} toca para ${this.nm(shooter)}`);
    } else {
      const sp = this.A(37.4, -s2 * 2);
      this.act(kicker, "pass", tKick - 0.2, tKick + 0.15, { face: shooter });
      this.pass(kicker, shooter, tKick, tKick + 0.75, 0.6);
      this.key(shooter, tKick + 0.75, sp);
      this.act(shooter, "run", tKick - 0.4, tKick + 0.75, { to: sp });
      tShot = tKick + 0.78;
      this.label(tKick - 0.3, `Cruzamento ao segundo poste para ${this.nm(shooter)}`);
    }
    return this.shot(tShot, shooter, sh2, this.dirA);
  }
  /** Livre direto de 10 m (6.ª falta) ou penálti (6 m): todos atrás da linha da bola, a 5 m. */
  spotKick(T, a) {
    const pen = a.kind === "penalty";
    const d = pen ? 6 : 10;
    const att = this.att;
    const at = this.A(40 - d, 0);
    const kicker = a.shooter;
    const tSet = T + (pen ? 5 : 3);
    const tKick = tSet + 1;
    this.phase(T, pen ? "Pen\xE1lti" : "Livre direto de 10 metros");
    this.label(T + 0.3, pen ? `Pen\xE1lti: ${this.nm(kicker)}` : `Livre de 10 m: ${this.nm(kicker)} na marca`);
    this.balls.push({ k: "fly", t0: T, t1: T + 1.2, from: this.ballAt(T), b: { ...at, z: 0.11 }, lift: 0.3 });
    this.balls.push({ k: "still", t0: T + 1.2, at: { ...at, z: 0.11 } });
    const m2 = /* @__PURE__ */ new Map();
    m2.set(kicker, this.A(40 - d - 2.2, 0.6));
    const line = 40 - d - 1.2;
    const lanes = [-8.6, -6.4, 6.4, 8.6, -4.6, 4.6];
    let li = 0;
    for (const id of [...this.attOut.filter((x) => x !== kicker), ...this.defOut]) {
      const v = lanes[li++ % lanes.length];
      if (pen) m2.set(id, this.A(-0.6 - li % 2 * 0.8, (li % 2 ? -1 : 1) * (1.5 + Math.floor(li / 2) * 2.4)));
      else m2.set(id, this.A(line - (this.sideOf.get(id) === att ? 1.2 : 0) - (li > 4 ? 2 : 0), v + (this.sideOf.get(id) === att ? 0.6 : -0.6)));
    }
    if (this.gkD) m2.set(this.gkD, pen ? this.A(39.75, 0) : this.A(40 - (1.5 + this.r() * 1.5), 0));
    if (this.gkA) m2.set(this.gkA, this.A(3.5, 0));
    this.placeAll(tSet, m2);
    for (const [id, p2] of m2) this.key(id, tKick - 0.45, p2, true);
    this.key(kicker, tKick, this.A(40 - d - 0.4, 0.15));
    this.balls.push({ k: "foot", t0: tKick - 0.05, id: kicker });
    const tE = this.shot(tKick, kicker, a, this.dirA);
    for (const id of [...this.attOut, ...this.defOut]) if (id !== kicker) this.key(id, tKick + (pen ? 1.6 : 1), { x: m2.get(id).x + this.dirA * (pen ? 6 : 1.8), y: m2.get(id).y * 0.7 });
    return tE;
  }
  /** Confronto depois de uma falta: os jogadores juntam-se, empurram-se, os árbitros entram para separar
   *  e mostram os cartões. */
  brawl(T, a) {
    const who = (a.players ?? []).filter((id) => this.tr.has(id));
    if (who.length < 2) return T;
    const c2 = this.ballAt(T);
    const center = { x: clamp4(c2.x, -15, 15), y: clamp4(c2.y, -7, 7) };
    this.phase(T, "Confronto!");
    this.label(T + 0.2, `Confronto: ${this.nm(who[0])} e ${this.nm(who[1])}${who.length > 2 ? ` (+${who.length - 2})` : ""}`);
    who.forEach((id, i) => {
      const ang = i / who.length * Math.PI * 2 + (i % 2 ? 0.4 : 0);
      const rad = i < 2 ? 0.45 : 0.9 + i % 3 * 0.35;
      const spot = { x: center.x + Math.cos(ang) * rad, y: center.y + Math.sin(ang) * rad };
      this.key(id, T + 1.2 + i * 0.12, spot);
      this.key(id, T + 3.6, { x: spot.x + Math.cos(ang) * 0.3, y: spot.y + Math.sin(ang) * 0.3 });
      this.act(id, "shove", T + 1 + i * 0.12, T + 3.4, { face: who[i === 0 ? 1 : 0] });
    });
    REFS.forEach((id, k) => {
      this.key(id, T + 1.6, { x: center.x + (k ? 0.6 : -0.6), y: center.y + (k ? 0.3 : -0.3) });
      this.key(id, T + 4, { x: center.x + (k ? 1.4 : -1.4), y: center.y + (k ? 1.2 : -1.2) });
      this.act(id, "whistle", T + 1.6, T + 4.2, { face: who[0] });
    });
    for (const [i, cd] of (a.cards ?? []).entries()) this.label(T + 4.2 + i * 0.7, `${cd.red ? "Cart\xE3o vermelho" : "Cart\xE3o amarelo"} para ${this.nm(cd.id)}`);
    const back = T + 4.6 + (a.cards?.length ?? 0) * 0.7;
    for (const id of who) this.key(id, back + 1.2, this.restPos(id, "gk"));
    return back + 1.2;
  }
  /** Remate da outra equipa no mesmo lance (contra-ataque após canto, baliza deserta). */
  // recarga: o atacante mais perto ataca a bola solta e remata logo
  rebound(T, a) {
    const ball = this.ballAt(T);
    const cand = this.attOut.filter((x) => this.tr.has(x));
    if (!cand.length) return T;
    const sh2 = a.shooter && cand.includes(a.shooter) ? a.shooter : cand.reduce((x, y) => dist(this.P(y, T), ball) < dist(this.P(x, T), ball) ? y : x);
    const tl = clamp4(dist(this.P(sh2, T - 0.6), ball) / 6.5, 0.45, 1.2);
    this.later.push(() => {
      this.fix(sh2, T - 0.6, T + tl + 0.4);
      this.key(sh2, T + tl, { x: ball.x - this.dirA * 0.4, y: ball.y });
    });
    this.balls.push({ k: "foot", t0: T + tl, id: sh2 });
    this.label(T + 0.1, `${this.nm(sh2)} vai \xE0 recarga`);
    this.spillNext = false;
    return this.shot(T + tl + 0.15, sh2, a, this.dirA);
  }
  oppShot(T, a) {
    const sh2 = a.shooter;
    if (!this.tr.has(sh2)) return T;
    const g = -this.dirA;
    const ball = this.ballAt(T);
    const sp = this.P(sh2, T);
    this.phase(T, a.kind === "open" ? "Baliza deserta!" : "Contra-ataque");
    this.key(sh2, T + 0.5, { x: ball.x, y: ball.y });
    this.balls.push({ k: "foot", t0: T + 0.5, id: sh2 });
    let tS = T + 0.9;
    if (a.kind !== "open") {
      const tgt = { x: g * 9, y: clamp4(sp.y * 0.4, -3, 3) };
      const tl = clamp4(dist(ball, tgt) / 6.2, 1.2, 3.6);
      this.key(sh2, T + 0.5 + tl, tgt);
      tS = T + 0.6 + tl;
      for (const id of this.attOut) this.key(id, tS, { x: lerp(this.P(id, T).x, g * 12, 0.6), y: this.P(id, T).y * 0.6 });
      for (const id of this.defOut) if (id !== sh2) this.key(id, tS, { x: lerp(this.P(id, T).x, g * 10, 0.6), y: this.P(id, T).y * 0.8 });
      this.label(T + 0.6, `${this.nm(sh2)} sai em contra-ataque`);
    } else this.label(T + 0.3, `${this.nm(sh2)} remata para a baliza deserta`);
    return this.shot(tS, sh2, a, g);
  }
  celebrate(T, scorer, side) {
    if (!this.tr.has(scorer)) return T + 2;
    const dir = side === this.att ? this.dirA : -this.dirA;
    const sp = this.P(scorer, T);
    const corner = { x: dir * 16, y: (sp.y >= 0 ? 1 : -1) * 9.6 };
    this.phase(T, "Golo!");
    this.key(scorer, T + 2.2, corner);
    this.act(scorer, "celebrate", T + 0.3, T + 6.2);
    let i = 0;
    for (const [id, s2] of this.sideOf) {
      if (REFS.includes(id)) continue;
      if (id === scorer) continue;
      const p0 = this.P(id, T);
      const gk = id === this.p.onCourt[s2][0] && !this.p.flying[s2];
      if (s2 === side && !gk) {
        const a = i++ / 3 * Math.PI;
        this.key(id, T + 2.6, { x: corner.x - dir * (1 + Math.cos(a)), y: corner.y - Math.sign(corner.y) * (0.8 + Math.sin(a) * 1.2) });
        this.key(id, T + 4.2, { x: corner.x - dir * (0.5 + Math.cos(a) * 0.4), y: corner.y - Math.sign(corner.y) * (0.5 + Math.sin(a) * 0.5) });
        this.act(id, "celebrate", T + 2, T + 6.2);
      } else if (!gk) this.key(id, T + 4.5, { x: lerp(p0.x, 0, 0.35), y: p0.y * 0.7 });
      else this.key(id, T + 4.5, p0, true);
    }
    return T + 6.4;
  }
  // ---------- consulta ----------
  holderAt(t) {
    let seg = null;
    for (const s2 of this.balls) if (s2.t0 <= t) seg = s2;
    return seg && (seg.k === "foot" || seg.k === "hands") ? seg.id : null;
  }
  foot(id, t) {
    const p = this.P(id, t);
    const q = this.P(id, t - 0.12);
    const vx = (p.x - q.x) / 0.12, vy = (p.y - q.y) / 0.12;
    const sp = Math.hypot(vx, vy);
    const sd = this.sideOf.get(id) ?? this.att;
    const d = sd === this.att ? this.dirA : -this.dirA;
    if (sp > 1.5) {
      const rate = 1.4 + sp * 0.22;
      const ph = t * rate % 1;
      const lead = 0.32 + Math.min(1, sp / 7) * 0.75 * Math.sin(ph * Math.PI);
      return { x: p.x + vx / sp * lead, y: p.y + vy / sp * lead, z: 0.11 };
    }
    const side = Math.sin(t * 2.6) * 0.14;
    const fx = sp > 0.6 ? vx / sp : d, fy = sp > 0.6 ? vy / sp : 0;
    return { x: p.x + fx * 0.3 - fy * side, y: p.y + fy * 0.3 + fx * side, z: 0.11 };
  }
  ballAt(t) {
    let seg = null;
    for (const s2 of this.balls) if (s2.t0 <= t) seg = s2;
    seg ??= this.balls[0];
    if (!seg) return { x: 0, y: 0, z: 0.11 };
    if (seg.k === "foot") return this.foot(seg.id, t);
    if (seg.k === "hands") {
      const p = this.P(seg.id, t);
      const q = this.P(seg.id, t - 0.15);
      const vx = p.x - q.x, vy = p.y - q.y, vl = Math.hypot(vx, vy);
      let dx, dy;
      if (vl > 0.12) {
        dx = vx / vl;
        dy = vy / vl;
      } else {
        const cl = Math.hypot(p.x, p.y) || 1;
        dx = -p.x / cl;
        dy = -p.y / cl;
      }
      return { x: p.x + dx * 0.34, y: p.y + dy * 0.34, z: seg.z ?? 1.05 };
    }
    if (seg.k === "still") return seg.at;
    const k = clamp4((t - seg.t0) / Math.max(0.01, seg.t1 - seg.t0), 0, 1);
    if (seg.k === "pass") {
      const a2 = this.foot(seg.from, seg.t0), b2 = this.foot(seg.to, seg.t1);
      const len = dist(a2, b2);
      return { x: lerp(a2.x, b2.x, k), y: lerp(a2.y, b2.y, k), z: 0.11 + Math.sin(k * Math.PI) * (seg.lift + (len > 14 ? 0.4 : 0)) };
    }
    const a = typeof seg.from === "string" ? this.foot(seg.from, seg.t0) : seg.from;
    const b = typeof seg.b === "string" ? { ...this.P(seg.b, seg.t1), z: 1.05 } : seg.b;
    return { x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), z: Math.max(0.11, lerp(a.z, b.z, k) + Math.sin(k * Math.PI) * seg.lift) };
  }
  at(ct) {
    const t = clamp4(ct - this.lead, -this.lead, this.finalT);
    const pos = {};
    for (const [id, tr] of this.tr) pos[id] = tr.at(t);
    const ball = this.ballAt(t);
    let label = "";
    for (const l of this.labels) if (l.t <= t && t - l.t < 2.6) label = l.text;
    let phase = "";
    for (const ph of this.phases) if (ph.t <= t) phase = ph.text;
    const acts = {};
    for (const a of this.acts) {
      if (t < a.t0 || t > a.t1) continue;
      const me = pos[a.id];
      if (!me) continue;
      const ang = a.ang ?? (a.face && pos[a.face] ? angTo(me, pos[a.face]) : a.to ? angTo(me, a.to) : angTo(me, ball));
      acts[a.id] = { kind: a.kind, k: (t - a.t0) / Math.max(0.01, a.t1 - a.t0), ang, to: a.to, h: a.h };
    }
    const holder = this.holderAt(t);
    if (holder && !acts[holder] && t >= 0 && t <= this.D && !this.gkOfAny(holder)) {
      const hp = pos[holder];
      const hq = this.tr.get(holder).at(t - 0.2);
      const slow = dist(hp, hq) < 0.5;
      const opp = this.sideOf.get(holder) === this.att ? this.defOut : this.attOut;
      let near = null, nd = 1.15;
      for (const id of opp) {
        const p = pos[id];
        if (p) {
          const d = dist(p, hp);
          if (d < nd) {
            nd = d;
            near = p;
          }
        }
      }
      if (near && slow) acts[holder] = { kind: "shield", k: 0.5, ang: angTo(near, hp) };
    }
    return { pos, ball, holder, stoppage: t < 0 || t > this.D, label, phase, acts };
  }
};

// ../../../tmp/claude-0/-home-user-Futsal-Manager-2027/9c8d8f2b-882a-51af-b8f4-ef6c73669acb/scratchpad/loco/one.ts
var s = newGame("T", "PT", "slb");
var hs = setupFor(s, "slb");
var as = setupFor(s, "scp");
var pl = Object.fromEntries([...hs.squad, ...as.squad].map((x) => [x.id, x]));
var m = createMatch(hs, as, { seed: "loco" });
var start = null;
var pick2 = null;
var P;
while (m.step()) {
  const sn = m.snapshot();
  if (!sn.possession) {
    start = null;
    continue;
  }
  const c2 = new Choreo(sn.possession, [hs.tactics, as.tactics], sn.period, start, m.names, pl);
  start = c2.end;
  if (c2.acts.some((a) => a.kind === "dive") && c2.acts.some((a) => a.kind === "throw")) {
    pick2 = c2;
    P = sn.possession;
    break;
  }
}
var c = pick2;
console.log("acts", JSON.stringify(P.actions.map((a) => ({ t: a.type, k: a.kind, r: a.result, sh: m.names[a.shooter] }))));
console.log(c.phases.map((p) => p.t.toFixed(1) + " " + p.text).join(" | "));
for (const a of c.acts) if (["shoot", "dive", "splits", "spread", "catch"].includes(a.kind)) console.log(a.kind, m.names[a.id], a.t0.toFixed(2), a.t1.toFixed(2), JSON.stringify(a.to), a.h?.toFixed(2));
var sh = c.acts.filter((a) => a.kind === "shoot");
for (const x of sh) {
  const t = x.t0 + 0.2;
  const f = c.at(c.lead + t);
  const gk = c.p.onCourt[1 - c.sideOf.get(x.id)][0];
  console.log("t", t.toFixed(2), "rematador", JSON.stringify(f.pos[x.id]), "GR", JSON.stringify(f.pos[gk]), "bola", JSON.stringify(f.ball), "fixed?", c.isFixed(gk, t));
}
