function getStarByStarID(id) {
  for (let I = 0; I < hvezdy.length; I++) {
    const hvezda = hvezdy[I];
    if (hvezda.StarID == id) return hvezda;
  }
}

function getStarByName(name) {
  for (let I = 0; I < hvezdy.length; I++) {
    const hvezda = hvezdy[I];
    if (hvezda.ProperName == name) return hvezda;
  }
}

function getStarByBayer(bayer) {
  for (let I = 0; I < hvezdy.length; I++) {
    const hvezda = hvezdy[I];
    if (hvezda.BayerFlamsteed.trim() == bayer) return hvezda;
  }
}

const UMA_lines = [
  [getStarByName("Dubhe"), getStarByName("Merak")],
  [getStarByName("Merak"), getStarByBayer("64Gam UMa")],
  [getStarByBayer("69Del UMa"), getStarByBayer("64Gam UMa")],
  [getStarByBayer("69Del UMa"), getStarByName("Dubhe")],
  [getStarByBayer("69Del UMa"), getStarByBayer("77Eps UMa")],
  [getStarByBayer("79Zet UMa"), getStarByBayer("77Eps UMa")],
  [getStarByBayer("79Zet UMa"), getStarByName("Alkaid")],
];
const ORI_lines = [
  [getStarByName("Rigel"), getStarByName("Saiph")],
  [getStarByName("Alnitak"), getStarByName("Saiph")],
  [getStarByName("Alnitak"), getStarByName("Betelgeuse")],
  [getStarByName("Alnitak"), getStarByName("Alnilam")],
  [getStarByName("Alnilam"), getStarByBayer("34Del Ori")],
  [getStarByName("Rigel"), getStarByBayer("34Del Ori")],
  [getStarByName("Bellatrix"), getStarByBayer("34Del Ori")],
  [getStarByName("Bellatrix"), getStarByBayer("39Lam Ori")],
  [getStarByName("Betelgeuse"), getStarByBayer("39Lam Ori")],
];
const CRB_lines = [
  [getStarByStarID("56528"), getStarByStarID("56297")],
  [getStarByStarID("56297"), getStarByStarID("55880")],
  [getStarByStarID("55880"), getStarByStarID("55508")],
  [getStarByStarID("55508"), getStarByStarID("55027")],
  [getStarByStarID("55027"), getStarByStarID("54650")],
  [getStarByStarID("54650"), getStarByStarID("54937")],
];

const AND = {
  latin: "Andromeda",
  czech: "Andromeda",
  abbr: "And",
  center: [0.7013273011156227, 40.24965840898939],
  maxAngDist: 0.40105290870551474,
  boundary: AND_boundary,
};
const ANT = {
  latin: "Antlia",
  czech: "Vývěva",
  abbr: "Ant",
  center: [10.312491095844539, -32.3228027751201],
  maxAngDist: 0.23829369782890217,
  boundary: ANT_boundary,
};
const APS = {
  latin: "Apus",
  czech: "Rajka",
  abbr: "Aps",
  center: [16.535000425217152, -74.69347977907599],
  maxAngDist: 0.2175357597552837,
  boundary: APS_boundary,
};
const AQR = {
  latin: "Aquarius",
  czech: "Vodnář",
  abbr: "Aqr",
  center: [21.993452973612417, -5.103798721245111],
  maxAngDist: 0.597928597399558,
  boundary: AQR_boundary,
};
const AQL = {
  latin: "Aquila",
  czech: "Orel",
  abbr: "Aql",
  center: [19.536819886086242, 5.037161370321006],
  maxAngDist: 0.3743487349766226,
  boundary: AQL_boundary,
};
const ARA = {
  latin: "Ara",
  czech: "Oltář",
  abbr: "Ara",
  center: [17.26041551717644, -59.95920062028559],
  maxAngDist: 0.2883808704612391,
  boundary: ARA_boundary,
};
const ARI = {
  latin: "Aries",
  czech: "Beran",
  abbr: "Ari",
  center: [2.618337834445481, 22.877679742040623],
  maxAngDist: 0.30101360939548155,
  boundary: ARI_boundary,
};
const AUR = {
  latin: "Auriga",
  czech: "Vozka",
  abbr: "Aur",
  center: [5.864247013679669, 41.98051023393573],
  maxAngDist: 0.35396219053143513,
  boundary: AUR_boundary,
};
const BOO = {
  latin: "Bootes",
  czech: "Pastýř",
  abbr: "Boo",
  center: [14.736176934199095, 36.125173895227334],
  maxAngDist: 0.5703952597813003,
  boundary: BOO_boundary,
};
const CAE = {
  latin: "Caelum",
  czech: "Rydlo",
  abbr: "Cae",
  center: [4.714800502268473, -37.87650661366098],
  maxAngDist: 0.20522549580065075,
  boundary: CAE_boundary,
};
const CAM = {
  latin: "Camelopardalis",
  czech: "Žirafa",
  abbr: "Cam",
  center: [5.891574308632554, 75.67790738807787],
  maxAngDist: 0.4652862302157409,
  boundary: CAM_boundary,
};
const CNC = {
  latin: "Cancer",
  czech: "Rak",
  abbr: "Cnc",
  center: [8.246022611015515, 17.87695453176073],
  maxAngDist: 0.3742010194144725,
  boundary: CNC_boundary,
};
const CVN = {
  latin: "Canes Venatici",
  czech: "Honicí psi",
  abbr: "CVn",
  center: [13.173430774967736, 38.04116269131296],
  maxAngDist: 0.3070347210632746,
  boundary: CVN_boundary,
};
const CMA = {
  latin: "Canis Major",
  czech: "Velký pes",
  abbr: "CMa",
  center: [6.69784658045627, -25.09460217836966],
  maxAngDist: 0.30744881292716536,
  boundary: CMA_boundary,
};
const CMI = {
  latin: "Canis Minor",
  czech: "Malý pes",
  abbr: "CMi",
  center: [7.582595996090251, 7.107517479897521],
  maxAngDist: 0.20539460198038728,
  boundary: CMI_boundary,
};
const CAP = {
  latin: "Capricornus",
  czech: "Kozoroh",
  abbr: "Cap",
  center: [20.987871946038286, -17.534934847336512],
  maxAngDist: 0.2981766665527618,
  boundary: CAP_boundary,
};
const CAR = {
  latin: "Carina",
  czech: "Lodní kýl",
  abbr: "Car",
  center: [8.064514593742802, -60.50735072405974],
  maxAngDist: 0.43731517675911363,
  boundary: CAR_boundary,
};
const CAS = {
  latin: "Cassiopeia",
  czech: "Kasiopeja",
  abbr: "Cas",
  center: [0.8141534661104664, 59.204712324465355],
  maxAngDist: 0.4031862290857654,
  boundary: CAS_boundary,
};
const UMA = {
  latin: "Ursa Major",
  czech: "Velká medvědice",
  abbr: "UMa",
  center: [11.478615991104894, 53.031792049957616],
  maxAngDist: 0.4973589808163574,
  boundary: UMA_boundary,
  lines: UMA_lines,
};
const UMI = {
  latin: "Ursa Minor",
  czech: "Malý medvěd",
  abbr: "UMi",
  center: [15.202625473574434, 80.09390765408217],
  maxAngDist: 0.2688256592378382,
  boundary: UMI_boundary,
};
const CEN = {
  latin: "Centaurus",
  czech: "Kentaur",
  abbr: "Cen",
  center: [12.884797529259599, -51.097306357934265],
  maxAngDist: 0.5576917949075669,
  boundary: CEN_boundary,
};
const CEP = {
  latin: "Cepheus",
  czech: "Cefeus",
  abbr: "Cep",
  center: [22.1218620870551, 72.65597536898811],
  maxAngDist: 0.3920332127348908,
  boundary: CEP_boundary,
};
const CET = {
  latin: "Cetus",
  czech: "Velryba",
  abbr: "Cet",
  center: [1.7671068666726517, -6.36993956891216],
  maxAngDist: 0.5595213194219959,
  boundary: CET_boundary,
};
const CHA = {
  latin: "Chamaeleon",
  czech: "Chameleon",
  abbr: "Cha",
  center: [10.416522648110597, -80.51145525887014],
  maxAngDist: 0.19579259281531955,
  boundary: CHA_boundary,
};
const CIR = {
  latin: "Circinus",
  czech: "Kružítko",
  abbr: "Cir",
  center: [14.849717219849634, -63.80180687853695],
  maxAngDist: 0.168566859636612,
  boundary: CIR_boundary,
};
const COL = {
  latin: "Columba",
  czech: "Holubice",
  abbr: "Col",
  center: [5.985493157512335, -35.986509553651494],
  maxAngDist: 0.253870956428,
  boundary: COL_boundary,
};
const COM = {
  latin: "Coma Berenices",
  czech: "Vlasy Bereniky",
  abbr: "Com",
  center: [12.740908275408309, 25.034329499788182],
  maxAngDist: 0.28203205617335786,
  boundary: COM_boundary,
};
const CRA = {
  latin: "Corona Australis",
  czech: "Jižní koruna",
  abbr: "CrA",
  center: [18.553084870307746, -42.40575787854612],
  maxAngDist: 0.18071137010102617,
  boundary: CRA_boundary,
};
const CRB = {
  latin: "Corona Borealis",
  czech: "Severní koruna",
  abbr: "CrB",
  center: [15.888750944108862, 31.594847093721295],
  maxAngDist: 0.17906070446583286,
  boundary: CRB_boundary,
  lines: CRB_lines,
};
const CRV = {
  latin: "Corvus",
  czech: "Havran",
  abbr: "Crv",
  center: [12.525557464789498, -19.97507768334019],
  maxAngDist: 0.20639002555246377,
  boundary: CRV_boundary,
};
const CRT = {
  latin: "Crater",
  czech: "Pohár",
  abbr: "Crt",
  center: [11.321098342832443, -14.902933202446532],
  maxAngDist: 0.23516614171904368,
  boundary: CRT_boundary,
};
const CRU = {
  latin: "Crux",
  czech: "Jižní kříž",
  abbr: "Cru",
  center: [12.448290012458557, -60.407293508440915],
  maxAngDist: 0.10829791491480975,
  boundary: CRU_boundary,
};
const CYG = {
  latin: "Cygnus",
  czech: "Labuť",
  abbr: "Cyg",
  center: [20.462585961139787, 45.5332583950494],
  maxAngDist: 0.4083907768763691,
  boundary: CYG_boundary,
};
const DEL = {
  latin: "Delphinus",
  czech: "Delfín",
  abbr: "Del",
  center: [20.671092063301998, 11.823600460762115],
  maxAngDist: 0.1860302716872176,
  boundary: DEL_boundary,
};
const DOR = {
  latin: "Dorado",
  czech: "Mečoun",
  abbr: "Dor",
  center: [4.738519046154822, -57.90598022707328],
  maxAngDist: 0.2937238170687706,
  boundary: DOR_boundary,
};
const DRA = {
  latin: "Draco",
  czech: "Drak",
  abbr: "Dra",
  center: [16.623216001709594, 72.8230586029606],
  maxAngDist: 0.5281367300175701,
  boundary: DRA_boundary,
};
const EQU = {
  latin: "Equuleus",
  czech: "Koníček",
  abbr: "Equ",
  center: [21.141935480903236, 9.016114152059135],
  maxAngDist: 0.13694704079393896,
  boundary: EQU_boundary,
};
const ERI = {
  latin: "Eridanus",
  czech: "Eridanus",
  abbr: "Eri",
  center: [3.6467374177336684, -34.010401372880054],
  maxAngDist: 0.6585328632586315,
  boundary: ERI_boundary,
};
const FOR = {
  latin: "Fornax",
  czech: "Pec",
  abbr: "For",
  center: [2.8464394219288778, -33.70104793419073],
  maxAngDist: 0.3023926944110035,
  boundary: FOR_boundary,
};
const GEM = {
  latin: "Gemini",
  czech: "Blíženci",
  abbr: "Gem",
  center: [7.1524116531176505, 21.924350723099053],
  maxAngDist: 0.2996245976668941,
  boundary: GEM_boundary,
};
const GRU = {
  latin: "Grus",
  czech: "Jeřáb",
  abbr: "Gru",
  center: [22.47623284874134, -45.71922540702981],
  maxAngDist: 0.256497014534105,
  boundary: GRU_boundary,
};
const HER = {
  latin: "Hercules",
  czech: "Herkules",
  abbr: "Her",
  center: [17.35588962982098, 26.287131612477673],
  maxAngDist: 0.531615574309402,
  boundary: HER_boundary,
};
const HOR = {
  latin: "Horologium",
  czech: "Hodiny",
  abbr: "Hor",
  center: [3.3762598442457796, -51.40965103247618],
  maxAngDist: 0.30991268300080616,
  boundary: HOR_boundary,
};
const HYA = {
  latin: "Hydra",
  czech: "Hydra",
  abbr: "Hya",
  center: [10.722901189999142, -23.665137945528034],
  maxAngDist: 1.019335215022007,
  boundary: HYA_boundary,
};
const HYI = {
  latin: "Hydrus",
  czech: "Malý vodní had",
  abbr: "Hyi",
  center: [2.434080548252697, -72.65376276183048],
  maxAngDist: 0.27957595581765915,
  boundary: HYI_boundary,
};
const IND = {
  latin: "Indu",
  czech: "Indián",
  abbr: "Ind",
  center: [21.579954745549575, -59.30626824841921],
  maxAngDist: 0.3194670528043905,
  boundary: IND_boundary,
};
const LAC = {
  latin: "Lacerta",
  czech: "Ještěrka",
  abbr: "Lac",
  center: [22.356778434733986, 45.90372932119348],
  maxAngDist: 0.22264610028256276,
  boundary: LAC_boundary,
};
const LEO = {
  latin: "Leo",
  czech: "Lev",
  abbr: "Leo",
  center: [10.86590827536298, 15.970595324158442],
  maxAngDist: 0.4606588880339286,
  boundary: LEO_boundary,
};
const LMI = {
  latin: "Leo Minor",
  czech: "Malý lev",
  abbr: "LMi",
  center: [10.426891323349514, 32.77148783831693],
  maxAngDist: 0.247907239578342,
  boundary: LMI_boundary,
};
const LEP = {
  latin: "Lepus",
  czech: "Zajíc",
  abbr: "Lep",
  center: [5.386385133596974, -17.21627099380805],
  maxAngDist: 0.2636138635827346,
  boundary: LEP_boundary,
};
const LIB = {
  latin: "Libra",
  czech: "Váhy",
  abbr: "Lib",
  center: [15.199842216816183, -14.971158647280214],
  maxAngDist: 0.29728399809529416,
  boundary: LIB_boundary,
};
const LUP = {
  latin: "Lupus",
  czech: "Vlk",
  abbr: "Lup",
  center: [15.358330775211085, -45.49001632876653],
  maxAngDist: 0.3157792148060361,
  boundary: LUP_boundary,
};
const LYN = {
  latin: "Lynx",
  czech: "Rys",
  abbr: "Lyn",
  center: [7.997943321700731, 48.1788129249676],
  maxAngDist: 0.3792634182046699,
  boundary: LYN_boundary,
};
const LYR = {
  latin: "Lyra",
  czech: "Lyra",
  abbr: "Lyr",
  center: [19.005121746395993, 35.676319669794744],
  maxAngDist: 0.2559233525218772,
  boundary: LYR_boundary,
};
const MEN = {
  latin: "Mensa",
  czech: "Tabulová hora",
  abbr: "Men",
  center: [5.4643716808253675, -78.42337182454733],
  maxAngDist: 0.16346887824350984,
  boundary: MEN_boundary,
};
const MIC = {
  latin: "Microscopium",
  czech: "Mikroskop",
  abbr: "Mic",
  center: [21.06582327140421, -36.53495748024628],
  maxAngDist: 0.20579021739206987,
  boundary: MIC_boundary,
};
const MON = {
  latin: "Monoceros",
  czech: "Jednorožec",
  abbr: "Mon",
  center: [6.894609942007067, 1.2436381864314234],
  maxAngDist: 0.40092341620147776,
  boundary: MON_boundary,
};
const MUS = {
  latin: "Musca",
  czech: "Moucha",
  abbr: "Mus",
  center: [12.94003049211805, -68.66568059128845],
  maxAngDist: 0.17845082121228045,
  boundary: MUS_boundary,
};
const NOR = {
  latin: "Norma",
  czech: "Pravítko",
  abbr: "Nor",
  center: [15.849624175716274, -51.08077108601315],
  maxAngDist: 0.20016628050471688,
  boundary: NOR_boundary,
};
const OCT = {
  latin: "Octans",
  czech: "Oktant",
  abbr: "Oct",
  center: [22.96182691499595, -85.95545498240338],
  maxAngDist: 0.24724841228333008,
  boundary: OCT_boundary,
};
const OPH = {
  latin: "Ophiuchus",
  czech: "Hadonoš",
  abbr: "Oph",
  center: [17.433863736414562, -5.245911762821868],
  maxAngDist: 0.45932262266269425,
  boundary: OPH_boundary,
};
const ORI = {
  latin: "Orion",
  czech: "Orion",
  abbr: "Ori",
  center: [5.718848523480329, 9.943518139218748],
  maxAngDist: 0.38885097929070506,
  boundary: ORI_boundary,
  lines: ORI_lines,
};
const PAV = {
  latin: "Pavo",
  czech: "Páv",
  abbr: "Pav",
  center: [19.342439815479956, -65.57625446875822],
  maxAngDist: 0.2767011954133014,
  boundary: PAV_boundary,
};
const PEG = {
  latin: "Pegasus",
  czech: "Pegas",
  abbr: "Peg",
  center: [22.63326609941549, 20.934755597392844],
  maxAngDist: 0.4425608731557278,
  boundary: PEG_boundary,
};
const PER = {
  latin: "Perseus",
  czech: "Perseus",
  abbr: "Per",
  center: [2.905475916687704, 48.87225913389585],
  maxAngDist: 0.46319810796295524,
  boundary: PER_boundary,
};
const PHE = {
  latin: "Phoenix",
  czech: "Fénix",
  abbr: "Phe",
  center: [1.301542613284443, -50.526187645170175],
  maxAngDist: 0.39233797451781455,
  boundary: PHE_boundary,
};
const PIC = {
  latin: "Pictor",
  czech: "Malíř",
  abbr: "Pic",
  center: [5.643266182712556, -54.559329201864436],
  maxAngDist: 0.24165122279811457,
  boundary: PIC_boundary,
};
const PSC = {
  latin: "Pisces",
  czech: "Ryby",
  abbr: "Psc",
  center: [0.488808103157008, 12.607255656760428],
  maxAngDist: 0.5073468277415126,
  boundary: PSC_boundary,
};
const PSA = {
  latin: "Piscis Austrinus",
  czech: "Jižní ryba",
  abbr: "PsA",
  center: [22.089937118595437, -29.611070079507826],
  maxAngDist: 0.2534111564361951,
  boundary: PSA_boundary,
};
const PUP = {
  latin: "Puppis",
  czech: "Lodní záď",
  abbr: "Pup",
  center: [7.633824230408392, -33.80283525274354],
  maxAngDist: 0.43859188618533784,
  boundary: PUP_boundary,
};
const PYX = {
  latin: "Pyxis",
  czech: "Kompas",
  abbr: "Pyx",
  center: [8.936172963126706, -24.75897899418606],
  maxAngDist: 0.24717297982659706,
  boundary: PYX_boundary,
};
const RET = {
  latin: "Reticulum",
  czech: "Síť",
  abbr: "Ret",
  center: [3.951665130556609, -58.05550646239753],
  maxAngDist: 0.1790721180982312,
  boundary: RET_boundary,
};
const SGE = {
  latin: "Sagitta",
  czech: "Šíp",
  abbr: "Sge",
  center: [19.697560478824624, 19.03170742575707],
  maxAngDist: 0.18629319157164986,
  boundary: SGE_boundary,
};
const SGR = {
  latin: "Sagittarius",
  czech: "Střelec",
  abbr: "Sgr",
  center: [19.018335089546166, -27.761743869966825],
  maxAngDist: 0.42858549874112056,
  boundary: SGR_boundary,
};
const SCO = {
  latin: "Scorpius",
  czech: "Štír",
  abbr: "Sco",
  center: [16.618508603331925, -27.66897305328508],
  maxAngDist: 0.4215485916271658,
  boundary: SCO_boundary,
};
const SCL = {
  latin: "Sculptor",
  czech: "Sochař",
  abbr: "Scl",
  center: [0.07503926860957894, -33.33618224142984],
  maxAngDist: 0.4122543274591847,
  boundary: SCL_boundary,
};
const SCT = {
  latin: "Scutum",
  czech: "Štít",
  abbr: "Sct",
  center: [18.72804069645158, -9.23987961069794],
  maxAngDist: 0.14848638861458957,
  boundary: SCT_boundary,
};
const SEX = {
  latin: "Sextans",
  czech: "Sextant",
  abbr: "Sex",
  center: [10.3567826761101, -2.6512790415521192],
  maxAngDist: 0.23498656022039127,
  boundary: SEX_boundary,
};
const TAU = {
  latin: "Taurus",
  czech: "Býk",
  abbr: "Tau",
  center: [4.822084832240374, 17.484675195841383],
  maxAngDist: 0.4940882575397014,
  boundary: TAU_boundary,
};
const TEL = {
  latin: "Telescopium",
  czech: "Dalekohled",
  abbr: "Tel",
  center: [19.327712830821902, -50.90668833966169],
  maxAngDist: 0.22489191486751625,
  boundary: TEL_boundary,
};
const TRI = {
  latin: "Triangulum",
  czech: "Trojúhelník",
  abbr: "Tri",
  center: [2.1976612640367796, 32.22213904821513],
  maxAngDist: 0.16419586639500006,
  boundary: TRI_boundary,
};
const TRA = {
  latin: "Triangulum Australe",
  czech: "Jižní trojúhelník",
  abbr: "TrA",
  center: [16.165881304539905, -65.22421067124473],
  maxAngDist: 0.15075706431167743,
  boundary: TRA_boundary,
};
const TUC = {
  latin: "Tucana",
  czech: "Tukan",
  abbr: "Tuc",
  center: [23.730359017937328, -67.76635130771488],
  maxAngDist: 0.27478812750946574,
  boundary: TUC_boundary,
};
const VEL = {
  latin: "Vela",
  czech: "Plachty",
  abbr: "Vel",
  center: [8.949470301831491, -49.13483645071206],
  maxAngDist: 0.42316897993939045,
  boundary: VEL_boundary,
};
const VIR = {
  latin: "Virgo",
  czech: "Panna",
  abbr: "Vir",
  center: [13.16875672317503, -0.526045274716437],
  maxAngDist: 0.5449455152950712,
  boundary: VIR_boundary,
};
const VOL = {
  latin: "Volans",
  czech: "Létající ryba",
  abbr: "Vol",
  center: [7.421034180531676, -70.53601905467346],
  maxAngDist: 0.1939735977317943,
  boundary: VOL_boundary,
};
const VUL = {
  latin: "Vulpecula",
  czech: "Lištička",
  abbr: "Vul",
  center: [20.260379402463112, 24.210473245180243],
  maxAngDist: 0.31891574578814047,
  boundary: VUL_boundary,
};

const constellations = [
  AND,
  ANT,
  APS,
  AQR,
  AQL,
  ARA,
  ARI,
  AUR,
  BOO,
  CAE,
  CAM,
  CNC,
  CVN,
  CMA,
  CMI,
  CAP,
  CAR,
  CAS,
  UMA,
  UMI,
  CEN,
  CEP,
  CET,
  CHA,
  CIR,
  COL,
  COM,
  CRA,
  CRB,
  CRV,
  CRT,
  CRU,
  CYG,
  DEL,
  DOR,
  DRA,
  EQU,
  ERI,
  FOR,
  GEM,
  GRU,
  HER,
  HOR,
  HYA,
  HYI,
  IND,
  LAC,
  LEO,
  LMI,
  LEP,
  LIB,
  LUP,
  LYN,
  LYR,
  MEN,
  MIC,
  MON,
  MUS,
  NOR,
  OCT,
  OPH,
  ORI,
  PAV,
  PEG,
  PER,
  PHE,
  PIC,
  PSC,
  PSA,
  PUP,
  PYX,
  RET,
  SGE,
  SGR,
  SCO,
  SCL,
  SCT,
  SEX,
  TAU,
  TEL,
  TRI,
  TRA,
  TUC,
  VEL,
  VIR,
  VOL,
  VUL,
];
