function degToRad(deg) {
  return deg * (Math.PI / 180.0);
}

function RadToDeg(deg) {
  return deg * (180.0 / Math.PI);
}

function generateEQLines() {
  // Refactor RA
  lines = [];

  const RAinterval = (2 * Math.PI) / 24;
  const DECrez = 180 / 18;

  const DECinterval = 10;
  //const RArez = 0.4 - (0.4 - this.obs.fov / 10);
  const RArez = 0.4;

  for (let ra = 0; ra < 2 * Math.PI; ra += RAinterval) {
    let [prevX, prevY] = [RadToDeg(ra) / 15, -90];
    for (let dec = -90 + DECrez; dec <= 90; dec += DECrez) {
      let [newX, newY] = [RadToDeg(ra) / 15, dec];
      lines.push([prevX, prevY, newX, newY]);
      [prevX, prevY] = [newX, newY];
    }
  }

  for (let dec = -90; dec < 90; dec += DECinterval) {
    let [prevX, prevY] = [0, dec];
    for (let ra = RArez; ra <= 24 + RArez; ra += RArez) {
      let [newX, newY] = [ra, dec];
      lines.push([prevX, prevY, newX, newY]);
      [prevX, prevY] = [newX, newY];
    }
  }
  return JSON.stringify({ name: "EQ Lines", lines: lines });
}
