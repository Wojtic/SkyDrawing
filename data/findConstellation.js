// David Moews, 2008-VI-14; revised 2008-VIII-2

/*
 * precess() and get_name() are adapted from program.c, from
 * ftp://cdsarc.u-strasbg.fr/pub/cats/VI/42/program.c
 * which is from
 * CDS (Centre de donnees astronomiques de Strasbourg) catalog VI/42; also see
 *
 * Identification of a constellation from a position,
 * Nancy G. Roman,
 * PUBLICATIONS OF THE ASTRONOMICAL SOCIETY OF THE PACIFIC,
 * 99 (July 1987), pp. 695-699.
 *
 * Program.c says:
 * This program is a translation with a few adaptations of the
 * Fortran program.f, made by FO @ CDS  (francois@simbad.u-strasbg.fr)
 * in November 1996.
 */

//
// ra1, dec1: RA, dec coordinates, in radians, for EPOCH1, where the epoch is in years AD.
// Output: [RA, dec], in radians, precessed to EPOCH2, where the epoch is in years AD.
//
// Original comment:
// Herget precession, see p. 9 of Publ. Cincinnati Obs., No. 24.
//
class constellationSearch {
  constructor() {
    /*
     * From ftp://cdsarc.u-strasbg.fr/pub/cats/VI/42/data.dat .
     * This table gives the constellation boundaries.
     * Each constellation is bounded by lines of constant RA or constant declination,
     * in the 1875 equinox coordinate system.
     *
     * Each line of the table consists of
     * (1) lower right ascension boundary (hours)
     * (2) upper right ascension boundary (hours)
     * (3) lower (southern) declination boundary (degrees)
     * (4) constellation abbreviation (3 letters)
     */
    this.table = [
      [0.0, 24.0, 88.0, "UMi"],
      [8.0, 14.5, 86.5, "UMi"],
      [21.0, 23.0, 86.1667, "UMi"],
      [18.0, 21.0, 86.0, "UMi"],
      [0.0, 8.0, 85.0, "Cep"],
      [9.1667, 10.6667, 82.0, "Cam"],
      [0.0, 5.0, 80.0, "Cep"],
      [10.6667, 14.5, 80.0, "Cam"],
      [17.5, 18.0, 80.0, "UMi"],
      [20.1667, 21.0, 80.0, "Dra"],
      [0.0, 3.5083, 77.0, "Cep"],
      [11.5, 13.5833, 77.0, "Cam"],
      [16.5333, 17.5, 75.0, "UMi"],
      [20.1667, 20.6667, 75.0, "Cep"],
      [7.9667, 9.1667, 73.5, "Cam"],
      [9.1667, 11.3333, 73.5, "Dra"],
      [13.0, 16.5333, 70.0, "UMi"],
      [3.1, 3.4167, 68.0, "Cas"],
      [20.4167, 20.6667, 67.0, "Dra"],
      [11.3333, 12.0, 66.5, "Dra"],
      [0.0, 0.3333, 66.0, "Cep"],
      [14.0, 15.6667, 66.0, "UMi"],
      [23.5833, 24.0, 66.0, "Cep"],
      [12.0, 13.5, 64.0, "Dra"],
      [13.5, 14.4167, 63.0, "Dra"],
      [23.1667, 23.5833, 63.0, "Cep"],
      [6.1, 7.0, 62.0, "Cam"],
      [20.0, 20.4167, 61.5, "Dra"],
      [20.5367, 20.6, 60.9167, "Cep"],
      [7.0, 7.9667, 60.0, "Cam"],
      [7.9667, 8.4167, 60.0, "UMa"],
      [19.7667, 20.0, 59.5, "Dra"],
      [20.0, 20.5367, 59.5, "Cep"],
      [22.8667, 23.1667, 59.0833, "Cep"],
      [0.0, 2.4333, 58.5, "Cas"],
      [19.4167, 19.7667, 58.0, "Dra"],
      [1.7, 1.9083, 57.5, "Cas"],
      [2.4333, 3.1, 57.0, "Cas"],
      [3.1, 3.1667, 57.0, "Cam"],
      [22.3167, 22.8667, 56.25, "Cep"],
      [5.0, 6.1, 56.0, "Cam"],
      [14.0333, 14.4167, 55.5, "UMa"],
      [14.4167, 19.4167, 55.5, "Dra"],
      [3.1667, 3.3333, 55.0, "Cam"],
      [22.1333, 22.3167, 55.0, "Cep"],
      [20.6, 21.9667, 54.8333, "Cep"],
      [0.0, 1.7, 54.0, "Cas"],
      [6.1, 6.5, 54.0, "Lyn"],
      [12.0833, 13.5, 53.0, "UMa"],
      [15.25, 15.75, 53.0, "Dra"],
      [21.9667, 22.1333, 52.75, "Cep"],
      [3.3333, 5.0, 52.5, "Cam"],
      [22.8667, 23.3333, 52.5, "Cas"],
      [15.75, 17.0, 51.5, "Dra"],
      [2.0417, 2.5167, 50.5, "Per"],
      [17.0, 18.2333, 50.5, "Dra"],
      [0.0, 1.3667, 50.0, "Cas"],
      [1.3667, 1.6667, 50.0, "Per"],
      [6.5, 6.8, 50.0, "Lyn"],
      [23.3333, 24.0, 50.0, "Cas"],
      [13.5, 14.0333, 48.5, "UMa"],
      [0.0, 1.1167, 48.0, "Cas"],
      [23.5833, 24.0, 48.0, "Cas"],
      [18.175, 18.2333, 47.5, "Her"],
      [18.2333, 19.0833, 47.5, "Dra"],
      [19.0833, 19.1667, 47.5, "Cyg"],
      [1.6667, 2.0417, 47.0, "Per"],
      [8.4167, 9.1667, 47.0, "UMa"],
      [0.1667, 0.8667, 46.0, "Cas"],
      [12.0, 12.0833, 45.0, "UMa"],
      [6.8, 7.3667, 44.5, "Lyn"],
      [21.9083, 21.9667, 44.0, "Cyg"],
      [21.875, 21.9083, 43.75, "Cyg"],
      [19.1667, 19.4, 43.5, "Cyg"],
      [9.1667, 10.1667, 42.0, "UMa"],
      [10.1667, 10.7833, 40.0, "UMa"],
      [15.4333, 15.75, 40.0, "Boo"],
      [15.75, 16.3333, 40.0, "Her"],
      [9.25, 9.5833, 39.75, "Lyn"],
      [0.0, 2.5167, 36.75, "And"],
      [2.5167, 2.5667, 36.75, "Per"],
      [19.3583, 19.4, 36.5, "Lyr"],
      [4.5, 4.6917, 36.0, "Per"],
      [21.7333, 21.875, 36.0, "Cyg"],
      [21.875, 22.0, 36.0, "Lac"],
      [6.5333, 7.3667, 35.5, "Aur"],
      [7.3667, 7.75, 35.5, "Lyn"],
      [0.0, 2.0, 35.0, "And"],
      [22.0, 22.8167, 35.0, "Lac"],
      [22.8167, 22.8667, 34.5, "Lac"],
      [22.8667, 23.5, 34.5, "And"],
      [2.5667, 2.7167, 34.0, "Per"],
      [10.7833, 11.0, 34.0, "UMa"],
      [12.0, 12.3333, 34.0, "CVn"],
      [7.75, 9.25, 33.5, "Lyn"],
      [9.25, 9.8833, 33.5, "LMi"],
      [0.7167, 1.4083, 33.0, "And"],
      [15.1833, 15.4333, 33.0, "Boo"],
      [23.5, 23.75, 32.0833, "And"],
      [12.3333, 13.25, 32.0, "CVn"],
      [23.75, 24.0, 31.3333, "And"],
      [13.9583, 14.0333, 30.75, "CVn"],
      [2.4167, 2.7167, 30.6667, "Tri"],
      [2.7167, 4.5, 30.6667, "Per"],
      [4.5, 4.75, 30.0, "Aur"],
      [18.175, 19.3583, 30.0, "Lyr"],
      [11.0, 12.0, 29.0, "UMa"],
      [19.6667, 20.9167, 29.0, "Cyg"],
      [4.75, 5.8833, 28.5, "Aur"],
      [9.8833, 10.5, 28.5, "LMi"],
      [13.25, 13.9583, 28.5, "CVn"],
      [0.0, 0.0667, 28.0, "And"],
      [1.4083, 1.6667, 28.0, "Tri"],
      [5.8833, 6.5333, 28.0, "Aur"],
      [7.8833, 8.0, 28.0, "Gem"],
      [20.9167, 21.7333, 28.0, "Cyg"],
      [19.2583, 19.6667, 27.5, "Cyg"],
      [1.9167, 2.4167, 27.25, "Tri"],
      [16.1667, 16.3333, 27.0, "CrB"],
      [15.0833, 15.1833, 26.0, "Boo"],
      [15.1833, 16.1667, 26.0, "CrB"],
      [18.3667, 18.8667, 26.0, "Lyr"],
      [10.75, 11.0, 25.5, "LMi"],
      [18.8667, 19.2583, 25.5, "Lyr"],
      [1.6667, 1.9167, 25.0, "Tri"],
      [0.7167, 0.85, 23.75, "Psc"],
      [10.5, 10.75, 23.5, "LMi"],
      [21.25, 21.4167, 23.5, "Vul"],
      [5.7, 5.8833, 22.8333, "Tau"],
      [0.0667, 0.1417, 22.0, "And"],
      [15.9167, 16.0333, 22.0, "Ser"],
      [5.8833, 6.2167, 21.5, "Gem"],
      [19.8333, 20.25, 21.25, "Vul"],
      [18.8667, 19.25, 21.0833, "Vul"],
      [0.1417, 0.85, 21.0, "And"],
      [20.25, 20.5667, 20.5, "Vul"],
      [7.8083, 7.8833, 20.0, "Gem"],
      [20.5667, 21.25, 19.5, "Vul"],
      [19.25, 19.8333, 19.1667, "Vul"],
      [3.2833, 3.3667, 19.0, "Ari"],
      [18.8667, 19.0, 18.5, "Sge"],
      [5.7, 5.7667, 18.0, "Ori"],
      [6.2167, 6.3083, 17.5, "Gem"],
      [19.0, 19.8333, 16.1667, "Sge"],
      [4.9667, 5.3333, 16.0, "Tau"],
      [15.9167, 16.0833, 16.0, "Her"],
      [19.8333, 20.25, 15.75, "Sge"],
      [4.6167, 4.9667, 15.5, "Tau"],
      [5.3333, 5.6, 15.5, "Tau"],
      [12.8333, 13.5, 15.0, "Com"],
      [17.25, 18.25, 14.3333, "Her"],
      [11.8667, 12.8333, 14.0, "Com"],
      [7.5, 7.8083, 13.5, "Gem"],
      [16.75, 17.25, 12.8333, "Her"],
      [0.0, 0.1417, 12.5, "Peg"],
      [5.6, 5.7667, 12.5, "Tau"],
      [7.0, 7.5, 12.5, "Gem"],
      [21.1167, 21.3333, 12.5, "Peg"],
      [6.3083, 6.9333, 12.0, "Gem"],
      [18.25, 18.8667, 12.0, "Her"],
      [20.875, 21.05, 11.8333, "Del"],
      [21.05, 21.1167, 11.8333, "Peg"],
      [11.5167, 11.8667, 11.0, "Leo"],
      [6.2417, 6.3083, 10.0, "Ori"],
      [6.9333, 7.0, 10.0, "Gem"],
      [7.8083, 7.925, 10.0, "Cnc"],
      [23.8333, 24.0, 10.0, "Peg"],
      [1.6667, 3.2833, 9.9167, "Ari"],
      [20.1417, 20.3, 8.5, "Del"],
      [13.5, 15.0833, 8.0, "Boo"],
      [22.75, 23.8333, 7.5, "Peg"],
      [7.925, 9.25, 7.0, "Cnc"],
      [9.25, 10.75, 7.0, "Leo"],
      [18.25, 18.6622, 6.25, "Oph"],
      [18.6622, 18.8667, 6.25, "Aql"],
      [20.8333, 20.875, 6.0, "Del"],
      [7.0, 7.0167, 5.5, "CMi"],
      [18.25, 18.425, 4.5, "Ser"],
      [16.0833, 16.75, 4.0, "Her"],
      [18.25, 18.425, 3.0, "Oph"],
      [21.4667, 21.6667, 2.75, "Peg"],
      [0.0, 2.0, 2.0, "Psc"],
      [18.5833, 18.8667, 2.0, "Ser"],
      [20.3, 20.8333, 2.0, "Del"],
      [20.8333, 21.3333, 2.0, "Equ"],
      [21.3333, 21.4667, 2.0, "Peg"],
      [22.0, 22.75, 2.0, "Peg"],
      [21.6667, 22.0, 1.75, "Peg"],
      [7.0167, 7.2, 1.5, "CMi"],
      [3.5833, 4.6167, 0.0, "Tau"],
      [4.6167, 4.6667, 0.0, "Ori"],
      [7.2, 8.0833, 0.0, "CMi"],
      [14.6667, 15.0833, 0.0, "Vir"],
      [17.8333, 18.25, 0.0, "Oph"],
      [2.65, 3.2833, -1.75, "Cet"],
      [3.2833, 3.5833, -1.75, "Tau"],
      [15.0833, 16.2667, -3.25, "Ser"],
      [4.6667, 5.0833, -4.0, "Ori"],
      [5.8333, 6.2417, -4.0, "Ori"],
      [17.8333, 17.9667, -4.0, "Ser"],
      [18.25, 18.5833, -4.0, "Ser"],
      [18.5833, 18.8667, -4.0, "Aql"],
      [22.75, 23.8333, -4.0, "Psc"],
      [10.75, 11.5167, -6.0, "Leo"],
      [11.5167, 11.8333, -6.0, "Vir"],
      [0.0, 0.3333, -7.0, "Psc"],
      [23.8333, 24.0, -7.0, "Psc"],
      [14.25, 14.6667, -8.0, "Vir"],
      [15.9167, 16.2667, -8.0, "Oph"],
      [20.0, 20.5333, -9.0, "Aql"],
      [21.3333, 21.8667, -9.0, "Aqr"],
      [17.1667, 17.9667, -10.0, "Oph"],
      [5.8333, 8.0833, -11.0, "Mon"],
      [4.9167, 5.0833, -11.0, "Eri"],
      [5.0833, 5.8333, -11.0, "Ori"],
      [8.0833, 8.3667, -11.0, "Hya"],
      [9.5833, 10.75, -11.0, "Sex"],
      [11.8333, 12.8333, -11.0, "Vir"],
      [17.5833, 17.6667, -11.6667, "Oph"],
      [18.8667, 20.0, -12.0333, "Aql"],
      [4.8333, 4.9167, -14.5, "Eri"],
      [20.5333, 21.3333, -15.0, "Aqr"],
      [17.1667, 18.25, -16.0, "Ser"],
      [18.25, 18.8667, -16.0, "Sct"],
      [8.3667, 8.5833, -17.0, "Hya"],
      [16.2667, 16.375, -18.25, "Oph"],
      [8.5833, 9.0833, -19.0, "Hya"],
      [10.75, 10.8333, -19.0, "Crt"],
      [16.2667, 16.375, -19.25, "Sco"],
      [15.6667, 15.9167, -20.0, "Lib"],
      [12.5833, 12.8333, -22.0, "Crv"],
      [12.8333, 14.25, -22.0, "Vir"],
      [9.0833, 9.75, -24.0, "Hya"],
      [1.6667, 2.65, -24.3833, "Cet"],
      [2.65, 3.75, -24.3833, "Eri"],
      [10.8333, 11.8333, -24.5, "Crt"],
      [11.8333, 12.5833, -24.5, "Crv"],
      [14.25, 14.9167, -24.5, "Lib"],
      [16.2667, 16.75, -24.5833, "Oph"],
      [0.0, 1.6667, -25.5, "Cet"],
      [21.3333, 21.8667, -25.5, "Cap"],
      [21.8667, 23.8333, -25.5, "Aqr"],
      [23.8333, 24.0, -25.5, "Cet"],
      [9.75, 10.25, -26.5, "Hya"],
      [4.7, 4.8333, -27.25, "Eri"],
      [4.8333, 6.1167, -27.25, "Lep"],
      [20.0, 21.3333, -28.0, "Cap"],
      [10.25, 10.5833, -29.1667, "Hya"],
      [12.5833, 14.9167, -29.5, "Hya"],
      [14.9167, 15.6667, -29.5, "Lib"],
      [15.6667, 16.0, -29.5, "Sco"],
      [4.5833, 4.7, -30.0, "Eri"],
      [16.75, 17.6, -30.0, "Oph"],
      [17.6, 17.8333, -30.0, "Sgr"],
      [10.5833, 10.8333, -31.1667, "Hya"],
      [6.1167, 7.3667, -33.0, "CMa"],
      [12.25, 12.5833, -33.0, "Hya"],
      [10.8333, 12.25, -35.0, "Hya"],
      [3.5, 3.75, -36.0, "For"],
      [8.3667, 9.3667, -36.75, "Pyx"],
      [4.2667, 4.5833, -37.0, "Eri"],
      [17.8333, 19.1667, -37.0, "Sgr"],
      [21.3333, 23.0, -37.0, "PsA"],
      [23.0, 23.3333, -37.0, "Scl"],
      [3.0, 3.5, -39.5833, "For"],
      [9.3667, 11.0, -39.75, "Ant"],
      [0.0, 1.6667, -40.0, "Scl"],
      [1.6667, 3.0, -40.0, "For"],
      [3.8667, 4.2667, -40.0, "Eri"],
      [23.3333, 24.0, -40.0, "Scl"],
      [14.1667, 14.9167, -42.0, "Cen"],
      [15.6667, 16.0, -42.0, "Lup"],
      [16.0, 16.4208, -42.0, "Sco"],
      [4.8333, 5.0, -43.0, "Cae"],
      [5.0, 6.5833, -43.0, "Col"],
      [8.0, 8.3667, -43.0, "Pup"],
      [3.4167, 3.8667, -44.0, "Eri"],
      [16.4208, 17.8333, -45.5, "Sco"],
      [17.8333, 19.1667, -45.5, "CrA"],
      [19.1667, 20.3333, -45.5, "Sgr"],
      [20.3333, 21.3333, -45.5, "Mic"],
      [3.0, 3.4167, -46.0, "Eri"],
      [4.5, 4.8333, -46.5, "Cae"],
      [15.3333, 15.6667, -48.0, "Lup"],
      [0.0, 2.3333, -48.1667, "Phe"],
      [2.6667, 3.0, -49.0, "Eri"],
      [4.0833, 4.2667, -49.0, "Hor"],
      [4.2667, 4.5, -49.0, "Cae"],
      [21.3333, 22.0, -50.0, "Gru"],
      [6.0, 8.0, -50.75, "Pup"],
      [8.0, 8.1667, -50.75, "Vel"],
      [2.4167, 2.6667, -51.0, "Eri"],
      [3.8333, 4.0833, -51.0, "Hor"],
      [0.0, 1.8333, -51.5, "Phe"],
      [6.0, 6.1667, -52.5, "Car"],
      [8.1667, 8.45, -53.0, "Vel"],
      [3.5, 3.8333, -53.1667, "Hor"],
      [3.8333, 4.0, -53.1667, "Dor"],
      [0.0, 1.5833, -53.5, "Phe"],
      [2.1667, 2.4167, -54.0, "Eri"],
      [4.5, 5.0, -54.0, "Pic"],
      [15.05, 15.3333, -54.0, "Lup"],
      [8.45, 8.8333, -54.5, "Vel"],
      [6.1667, 6.5, -55.0, "Car"],
      [11.8333, 12.8333, -55.0, "Cen"],
      [14.1667, 15.05, -55.0, "Lup"],
      [15.05, 15.3333, -55.0, "Nor"],
      [4.0, 4.3333, -56.5, "Dor"],
      [8.8333, 11.0, -56.5, "Vel"],
      [11.0, 11.25, -56.5, "Cen"],
      [17.5, 18.0, -57.0, "Ara"],
      [18.0, 20.3333, -57.0, "Tel"],
      [22.0, 23.3333, -57.0, "Gru"],
      [3.2, 3.5, -57.5, "Hor"],
      [5.0, 5.5, -57.5, "Pic"],
      [6.5, 6.8333, -58.0, "Car"],
      [0.0, 1.3333, -58.5, "Phe"],
      [1.3333, 2.1667, -58.5, "Eri"],
      [23.3333, 24.0, -58.5, "Phe"],
      [4.3333, 4.5833, -59.0, "Dor"],
      [15.3333, 16.4208, -60.0, "Nor"],
      [20.3333, 21.3333, -60.0, "Ind"],
      [5.5, 6.0, -61.0, "Pic"],
      [15.1667, 15.3333, -61.0, "Cir"],
      [16.4208, 16.5833, -61.0, "Ara"],
      [14.9167, 15.1667, -63.5833, "Cir"],
      [16.5833, 16.75, -63.5833, "Ara"],
      [6.0, 6.8333, -64.0, "Pic"],
      [6.8333, 9.0333, -64.0, "Car"],
      [11.25, 11.8333, -64.0, "Cen"],
      [11.8333, 12.8333, -64.0, "Cru"],
      [12.8333, 14.5333, -64.0, "Cen"],
      [13.5, 13.6667, -65.0, "Cir"],
      [16.75, 16.8333, -65.0, "Ara"],
      [2.1667, 3.2, -67.5, "Hor"],
      [3.2, 4.5833, -67.5, "Ret"],
      [14.75, 14.9167, -67.5, "Cir"],
      [16.8333, 17.5, -67.5, "Ara"],
      [17.5, 18.0, -67.5, "Pav"],
      [22.0, 23.3333, -67.5, "Tuc"],
      [4.5833, 6.5833, -70.0, "Dor"],
      [13.6667, 14.75, -70.0, "Cir"],
      [14.75, 17.0, -70.0, "TrA"],
      [0.0, 1.3333, -75.0, "Tuc"],
      [3.5, 4.5833, -75.0, "Hyi"],
      [6.5833, 9.0333, -75.0, "Vol"],
      [9.0333, 11.25, -75.0, "Car"],
      [11.25, 13.6667, -75.0, "Mus"],
      [18.0, 21.3333, -75.0, "Pav"],
      [21.3333, 23.3333, -75.0, "Ind"],
      [23.3333, 24.0, -75.0, "Tuc"],
      [0.75, 1.3333, -76.0, "Tuc"],
      [0.0, 3.5, -82.5, "Hyi"],
      [7.6667, 13.6667, -82.5, "Cha"],
      [13.6667, 18.0, -82.5, "Aps"],
      [3.5, 7.6667, -85.0, "Men"],
      [0.0, 24.0, -90.0, "Oct"],
    ];

    this.abbrev_table = [
      ["And", "Andromeda", "Andromedae"],
      ["Ant", "Antlia", "Antliae"],
      ["Aps", "Apus", "Apodis"],
      ["Aql", "Aquila", "Aquilae"],
      ["Aqr", "Aquarius", "Aquarii"],
      ["Ara", "Ara", "Arae"],
      ["Ari", "Aries", "Arietis"],
      ["Aur", "Auriga", "Aurigae"],
      ["Boo", "Bo\u00f6tes", "Bo\u00f6tis"],
      ["CMa", "Canis Major", "Canis Majoris"],
      ["CMi", "Canis Minor", "Canis Minoris"],
      ["CVn", "Canes Venatici", "Canum Venaticorum"],
      ["Cae", "Caelum", "Caeli"],
      ["Cam", "Camelopardalis", "Camelopardalis"],
      ["Cap", "Capricornus", "Capricorni"],
      ["Car", "Carina", "Carinae"],
      ["Cas", "Cassiopeia", "Cassiopeiae"],
      ["Cen", "Centaurus", "Centauri"],
      ["Cep", "Cepheus", "Cephei"],
      ["Cet", "Cetus", "Ceti"],
      ["Cha", "Chamaeleon", "Chamaeleontis"],
      ["Cir", "Circinus", "Circini"],
      ["Cnc", "Cancer", "Cancri"],
      ["Col", "Columba", "Columbae"],
      ["Com", "Coma Berenices", "Comae Berenices"],
      ["CrA", "Corona Australis", "Coronae Australis"],
      ["CrB", "Corona Borealis", "Coronae Borealis"],
      ["Crt", "Crater", "Crateris"],
      ["Cru", "Crux", "Crucis"],
      ["Crv", "Corvus", "Corvi"],
      ["Cyg", "Cygnus", "Cygni"],
      ["Del", "Delphinus", "Delphini"],
      ["Dor", "Dorado", "Doradus"],
      ["Dra", "Draco", "Draconis"],
      ["Equ", "Equuleus", "Equulei"],
      ["Eri", "Eridanus", "Eridani"],
      ["For", "Fornax", "Fornacis"],
      ["Gem", "Gemini", "Geminorum"],
      ["Gru", "Grus", "Gruis"],
      ["Her", "Hercules", "Herculis"],
      ["Hor", "Horologium", "Horologii"],
      ["Hya", "Hydra", "Hydrae"],
      ["Hyi", "Hydrus", "Hydri"],
      ["Ind", "Indus", "Indi"],
      ["LMi", "Leo Minor", "Leonis Minoris"],
      ["Lac", "Lacerta", "Lacertae"],
      ["Leo", "Leo", "Leonis"],
      ["Lep", "Lepus", "Leporis"],
      ["Lib", "Libra", "Librae"],
      ["Lup", "Lupus", "Lupi"],
      ["Lyn", "Lynx", "Lyncis"],
      ["Lyr", "Lyra", "Lyrae"],
      ["Men", "Mensa", "Mensae"],
      ["Mic", "Microscopium", "Microscopii"],
      ["Mon", "Monoceros", "Monocerotis"],
      ["Mus", "Musca", "Muscae"],
      ["Nor", "Norma", "Normae"],
      ["Oct", "Octans", "Octantis"],
      ["Oph", "Ophiuchus", "Ophiuchi"],
      ["Ori", "Orion", "Orionis"],
      ["Pav", "Pavo", "Pavonis"],
      ["Peg", "Pegasus", "Pegasi"],
      ["Per", "Perseus", "Persei"],
      ["Phe", "Phoenix", "Phoenicis"],
      ["Pic", "Pictor", "Pictoris"],
      ["PsA", "Piscis Austrinus", "Piscis Austrini"],
      ["Psc", "Pisces", "Piscium"],
      ["Pup", "Puppis", "Puppis"],
      ["Pyx", "Pyxis", "Pyxidis"],
      ["Ret", "Reticulum", "Reticuli"],
      ["Scl", "Sculptor", "Sculptoris"],
      ["Sco", "Scorpius", "Scorpii"],
      ["Sct", "Scutum", "Scuti"],
      ["Ser", "Serpens", "Serpentis"],
      ["Sex", "Sextans", "Sextantis"],
      ["Sge", "Sagitta", "Sagittae"],
      ["Sgr", "Sagittarius", "Sagittarii"],
      ["Tau", "Taurus", "Tauri"],
      ["Tel", "Telescopium", "Telescopii"],
      ["TrA", "Triangulum Australe", "Trianguli Australis"],
      ["Tri", "Triangulum", "Trianguli"],
      ["Tuc", "Tucana", "Tucanae"],
      ["UMa", "Ursa Major", "Ursae Majoris"],
      ["UMi", "Ursa Minor", "Ursae Minoris"],
      ["Vel", "Vela", "Velorum"],
      ["Vir", "Virgo", "Virginis"],
      ["Vol", "Volans", "Volantis"],
      ["Vul", "Vulpecula", "Vulpeculae"],
    ];
  }

  precess(ra1, dec1, epoch1, epoch2) {
    var cdr, csr;
    var x1, x2, r;
    var t, st, a, b, c, sina, sinb, sinc, cosa, cosb, cosc, ra2, dec2;

    cdr = Math.PI / 180.0;
    csr = cdr / 3600.0;
    a = Math.cos(dec1);
    x1 = [a * Math.cos(ra1), a * Math.sin(ra1), Math.sin(dec1)];
    t = 0.001 * (epoch2 - epoch1);
    st = 0.001 * (epoch1 - 1900.0);
    a =
      csr *
      t *
      (23042.53 +
        st * (139.75 + 0.06 * st) +
        t * (30.23 - 0.27 * st + 18.0 * t));
    b = csr * t * t * (79.27 + 0.66 * st + 0.32 * t) + a;
    c =
      csr *
      t *
      (20046.85 -
        st * (85.33 + 0.37 * st) +
        t * (-42.67 - 0.37 * st - 41.8 * t));
    sina = Math.sin(a);
    sinb = Math.sin(b);
    sinc = Math.sin(c);
    cosa = Math.cos(a);
    cosb = Math.cos(b);
    cosc = Math.cos(c);
    r = [
      [0.0, 0.0, 0.0],
      [0.0, 0.0, 0.0],
      [0.0, 0.0, 0.0],
    ];
    r[0][0] = cosa * cosb * cosc - sina * sinb;
    r[0][1] = -cosa * sinb - sina * cosb * cosc;
    r[0][2] = -cosb * sinc;
    r[1][0] = sina * cosb + cosa * sinb * cosc;
    r[1][1] = cosa * cosb - sina * sinb * cosc;
    r[1][2] = -sinb * sinc;
    r[2][0] = cosa * sinc;
    r[2][1] = -sina * sinc;
    r[2][2] = cosc;
    x2 = [0.0, 0.0, 0.0];
    for (var i = 0; i < 3; i++)
      x2[i] = r[i][0] * x1[0] + r[i][1] * x1[1] + r[i][2] * x1[2];
    ra2 = Math.atan2(x2[1], x2[0]);
    if (ra2 < 0.0) ra2 += 2.0 * Math.PI;
    dec2 = Math.asin(x2[2]);
    return [ra2, dec2];
  }

  //
  // Input: coordinates (RA in hours, declination in degrees, epoch in years AD)
  // Output: constellation abbreviation (3 letters), or '' on error
  //
  get_name(ra, dec, epoch) {
    var convh, convd, newcoords;

    convh = Math.PI / 12.0;
    convd = Math.PI / 180.0;
    ra *= convh;
    dec *= convd;
    newcoords = this.precess(ra, dec, epoch, 1875.0);
    ra = newcoords[0];
    dec = newcoords[1];
    ra /= convh;
    dec /= convd;
    for (var i = 0; i < this.table.length; i++) {
      if (
        dec < this.table[i][2] ||
        ra < this.table[i][0] ||
        ra >= this.table[i][1]
      )
        continue;
      return this.table[i][3];
    }
    return ""; // Error!
  }

  //
  // Input: coordinate string of the form "RA Dec",
  // where RA is HH, HH MM, or HH MM SS;
  //       Dec is +-DD, +-DD MM, or +-DD MM SS
  // Output: [RA, Dec] in hours and degrees, or [] on error
  //
  parse_coordinates(str) {
    var exploded;
    var nra, ndec;
    var rah = 0.0;
    var ram = 0.0;
    var ras = 0.0;
    var decd = 0.0;
    var decm = 0.0;
    var decs = 0.0;

    // Trim leading and trailing whitespace
    str = str.replace(/^\s+/, "");
    str = str.replace(/\s+$/, "");

    // Change Unicode minus sign to hyphen
    str = str.replace(/\u2212/, "-");

    // Split into words separated by whitespace
    exploded = str.split(/\s+/);
    for (nra = 0; nra < exploded.length; nra++)
      if (
        exploded[nra].length > 0 &&
        (exploded[nra].charAt(0) == "+" || exploded[nra].charAt(0) == "-")
      )
        break;

    ndec = exploded.length - nra;

    if (nra < 1 || nra > 3 || ndec < 1 || ndec > 3) return [];

    rah = parseFloat(exploded[0]);
    if (nra >= 2) ram = parseFloat(exploded[1]);
    if (nra >= 3) ras = parseFloat(exploded[2]);

    decd = parseFloat(exploded[nra]);
    if (ndec >= 2) decm = parseFloat(exploded[nra + 1]);
    if (ndec >= 3) decs = parseFloat(exploded[nra + 2]);

    if (
      isNaN(rah) ||
      isNaN(ram) ||
      isNaN(ras) ||
      isNaN(decd) ||
      isNaN(decm) ||
      isNaN(decs)
    )
      return [];

    if (
      rah < 0.0 ||
      rah >= 24.0 ||
      ram < 0.0 ||
      ram >= 60.0 ||
      ras < 0.0 ||
      ras >= 60.0
    )
      return [];

    if (
      decd < -90.0 ||
      decd > 90.0 ||
      decm < 0.0 ||
      decm >= 60.0 ||
      decs < 0.0 ||
      decs >= 60.0
    )
      return [];

    if (
      decd < 0.0 ||
      (decd == 0.0 &&
        exploded[nra].length > 0 &&
        exploded[nra].charAt(0) == "-")
    ) {
      decm = -decm;
      decs = -decs;
    }

    return [
      rah + ram / 60.0 + ras / 3600.0,
      decd + decm / 60.0 + decs / 3600.0,
    ];
  }

  // The 88 constellation abbreviations and their full names and genitives

  //
  // Input: coordinate string as above, assumed to be a position in equinox 2000.0 coordinates
  // Output: Informative message about its location
  //
  main(str) {
    var coordlist, ra, dec, i, n;

    coordlist = this.parse_coordinates(str);

    if (coordlist.length == 0) return "Error in coordinates.";
    ra = coordlist[0];
    dec = coordlist[1];
    n = this.get_name(ra, dec, 2000.0);
    for (var i = 0; i < this.abbrev_table.length; i++)
      if (n == this.abbrev_table[i][0]) break;
    if (i == this.abbrev_table.length) return "Error; no constellation found.";
    return (
      "Constellation: " +
      this.abbrev_table[i][1] +
      " (genitive: " +
      this.abbrev_table[i][2] +
      "; abbreviation: " +
      n +
      ")"
    );
  }
}
