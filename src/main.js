<<<<<<< Updated upstream
const size = 3000; // Math.min(document.body.clientHeight, document.body.clientWidth);
const dr = new Drawer(
  document,
  document.getElementsByClassName("cnvs")[0],
  size,
  size
=======
const size = Math.min(document.body.clientHeight, document.body.clientWidth);

const settings = {
  width: size,
  height: size,
  latitude: 50,
  longitude: 14,
};

const laserSettings = {
  width: 3000,
  height: 3000,
  fov: 280,
  altitude: 90,
  azimuth: 170,
  latitude: 90,
  longitude: 0,
  horizon: false,
  starColors: false,
  boundaries: true,
  maximumMag: 12,
  date: new Date("2000-12-17T03:24:00"),
  projection: "lambert",
  colors: {
    sky: "#FFFFFF",
    altAzLines: "#2BF0E6",
    EQLines: "#F06F2B",
    constellationLines: "#E0F02B",
    constellationBoundaries: "#000000",
    stars: "#000000",
  },
};

const dr = new Drawer(
  document,
  document.getElementsByClassName("cnvs")[0],
  laserSettings
>>>>>>> Stashed changes
);
dr.constellationSelection(document.getElementsByClassName("cnstShow")[0]);
dr.projectionSelection(document.getElementsByClassName("projSlct")[0]);
dr.options(document.getElementsByClassName("optns")[0]);
