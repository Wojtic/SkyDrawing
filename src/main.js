const size = Math.min(document.body.clientHeight, document.body.clientWidth);
const dr = new Drawer(
  document,
  document.getElementsByClassName("cnvs")[0],
  size,
  size
);
dr.constellationSelection(document.getElementsByClassName("cnstShow")[0]);
dr.options(document.getElementsByClassName("optns")[0]);
