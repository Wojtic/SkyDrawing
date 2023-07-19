class Drawer {
  constructor(document, div, width, height) {
    this.constellationPole = [12.053442491471836, 89.30386569273892]; // this.obs.getConstellationPole();

    this.canvas = document.createElement("canvas");
    this.canvas.id = "mainCan";
    this.canvas.width = width * window.devicePixelRatio;
    this.canvas.height = height * window.devicePixelRatio;
    this.canvas.style.height = height + "px";
    this.canvas.style.width = width + "px";

    div.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");

    this.width = width * window.devicePixelRatio;
    this.height = height * window.devicePixelRatio;

    this.obs = new Observer(0, 0, 120, 50.07, 14.12);

    this.Horizon = true;
    this.AltAzLines = false;
    this.EqLines = false;
    this.Constellations = true;

    this.pinching = false;
    this.lastPinchDist = null;

    [this.lastX, this.lastY] = [null, null];
    this.bindInput();
    this.draw();
  }

  round5(num) {
    return Math.round((num + Number.EPSILON) * 100000) / 100000;
  }

  bindInput() {
    const getXYFromTouch = (event, canvas = this.canvas) => {
      const rect = canvas.getBoundingClientRect();
      /*event =
          typeof event.originalEvent === "undefined"
            ? event
            : event.originalEvent;*/
      let touch = event.touches[0] || event.changedTouches[0];

      let x = touch.pageX - rect.left;
      let y = touch.pageY - rect.top;
      x -= canvas.width / 2;
      x /= canvas.width;
      y -= canvas.height / 2;
      y /= -canvas.height;
      return [x * window.devicePixelRatio, y * window.devicePixelRatio];
    };

    const getXYFromEvent = (event, canvas = this.canvas) => {
      const rect = canvas.getBoundingClientRect();
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;
      x -= canvas.width / 2;
      x /= canvas.width;
      y -= canvas.height / 2;
      y /= -canvas.height;
      return [x, y];
    };

    /*this.canvas.onclick = (e) => {
      let [x, y] = getXYFromEvent(e);
      let [alt, az] = this.obs.XYToAltAz(x, y);
      let [RA, DEC] = this.obs.AltAzToRaDec(alt, az);
      console.log(alt, az);
      console.log(RadToDeg(RA) / 15, RadToDeg(DEC));
      console.log(RadToDeg(this.obs.CalculateDistanceRaDec(RA, DEC)));
    };*/
    const zoom = (delta) => {
      if (delta > 0) {
        if (this.obs.fov >= degToRad(140) / 1.1) {
          this.obs.ChangeSettings({ fov: degToRad(140) });
        } else {
          this.obs.ChangeSettings({ fov: this.obs.fov * 1.1 });
        }
      } else {
        this.obs.ChangeSettings({ fov: this.obs.fov / 1.2 });
      }
    };

    const getPinchDistSqare = (e) => {
      return (
        (e.touches[0].pageX - e.touches[1].pageX) ** 2 +
        (e.touches[0].pageY - e.touches[1].pageY) ** 2
      );
    };

    this.canvas.onwheel = (e) => {
      e.preventDefault();
      zoom(e.deltaY);
      this.draw();
    };

    this.canvas.ontouchstart = (e) => {
      e.preventDefault();
      if (e.touches.length === 2) {
        this.pinching = true;
        this.lastPinchDist = getPinchDistSqare(e);
      }
      [this.lastX, this.lastY] = getXYFromTouch(e);
    };

    this.canvas.onmousedown = (e) => {
      e.preventDefault();
      [this.lastX, this.lastY] = getXYFromEvent(e);
    };

    this.canvas.ontouchmove = (e) => {
      e.preventDefault();
      if (this.lastX === null || this.lastY === null) return;
      if (this.pinching) {
        let newDist = getPinchDistSqare(e);
        if (Math.abs(newDist - this.lastPinchDist) > 0.3) {
          if (newDist > this.lastPinchDist) {
            zoom(-1);
          } else {
            zoom(1);
          }
        }
        this.lastPinchDist = newDist;
        this.draw();
        return;
      }
      let [newX, newY] = getXYFromTouch(e);
      this.obs.UpdateAltAZ(
        (this.lastY - newY) * this.obs.fov,
        (this.lastX - newX) *
          this.obs.fov *
          (1 + Math.abs(Math.sin(this.obs.alt)))
      );
      this.draw();
      [this.lastX, this.lastY] = [newX, newY];
    };

    this.canvas.onmousemove = (e) => {
      e.preventDefault();
      if (this.lastX === null || this.lastY === null) return;
      let [newX, newY] = getXYFromEvent(e);
      this.obs.UpdateAltAZ(
        (this.lastY - newY) * this.obs.fov,
        (this.lastX - newX) *
          this.obs.fov *
          (1 + Math.abs(Math.sin(this.obs.alt)))
      );
      this.draw();
      [this.lastX, this.lastY] = [newX, newY];
    };

    this.canvas.onmouseup =
      this.canvas.onmouseleave =
      this.canvas.ontouchend =
      this.canvas.ontouchcancel =
        (e) => {
          e.preventDefault();
          [this.lastX, this.lastY] = [null, null];
          this.pinching = false;
          this.lastPinchDist = null;
        };
  }

  getMaximumMag() {
    //const maximumMag = 2.5 / this.obs.fov + 6; // fov 140 - 7; 90 - 7.5
    return (
      -0.8 * this.obs.fov +
      8.4 -
      2 +
      Math.min(this.width, this.height) / (window.devicePixelRatio * 500)
    );
  }

  drawLine(x1, y1, x2, y2) {
    if (x1 == null || y1 == null || x2 == null || y2 == null) return;
    const canX1 = this.width / 2 + x1 * this.width;
    const canY1 = this.height / 2 - y1 * this.height;
    const canX2 = this.width / 2 + x2 * this.width;
    const canY2 = this.height / 2 - y2 * this.height;
    this.ctx.moveTo(canX1, canY1);
    this.ctx.lineTo(canX2, canY2);
  }

  drawConstellation(constellation) {
    let prev = constellation[0];
    for (let i = 1; i < constellation.length; i++) {
      let newLine = constellation[i];
      const diffRA =
        Math.min(
          Math.abs(prev[0] - newLine[0]),
          Math.abs(prev[0] + 24 - newLine[0])
        ) / 24;
      const diffDEC = Math.abs(prev[1] - newLine[1]) / 180;
      if (diffRA < diffDEC) this.drawConstellationMeridian(...prev, ...newLine);
      else this.drawConstellationParallel(...prev, ...newLine);
      prev = newLine;
    }
    const diffRA =
      Math.min(
        Math.abs(prev[0] - constellation[0][0]),
        Math.abs(prev[0] + 24 - constellation[0][0])
      ) / 24;
    const diffDEC = Math.abs(prev[1] - constellation[0][1]) / 180;
    if (diffRA < diffDEC)
      this.drawConstellationMeridian(...constellation[0], ...prev);
    else this.drawConstellationParallel(...constellation[0], ...prev);
  }

  drawConstellationMeridian(ra1, dec1, ra2, dec2) {
    const STEPS = 3;
    const [alt1, az1] = this.obs.RaDecToAltAz(ra1, dec1);
    const [alt2, az2] = this.obs.RaDecToAltAz(ra2, dec2);
    const stepsAltAz = this.obs.InterpolateOnCircle3Points(
      alt1,
      az1,
      alt2,
      az2,
      ...this.obs.RaDecToAltAz(...this.constellationPole),
      STEPS
    );
    this.drawSetOfPointsAltAz(stepsAltAz);
  }

  drawConstellationParallel(ra1, dec1, ra2, dec2) {
    const [alt1, az1] = this.obs.RaDecToAltAz(ra1, dec1);
    const [alt2, az2] = this.obs.RaDecToAltAz(ra2, dec2);
    const stepsAltAz = this.obs.InterpolateOnCircleCenter(
      alt1,
      az1,
      alt2,
      az2,
      ...this.obs.RaDecToAltAz(...this.constellationPole)
    );
    this.drawSetOfPointsAltAz(stepsAltAz);
  }

  drawSetOfPointsAltAz(set) {
    this.ctx.strokeStyle = "#808080";
    let [prevX, prevY] = this.obs.AltAzToXY(...set[0]);
    this.ctx.beginPath();
    for (let i = 1; i < set.length; i++) {
      let [newX, newY] = this.obs.AltAzToXY(...set[i]);
      this.drawLine(prevX, prevY, newX, newY);
      [prevX, prevY] = [newX, newY];
    }
    this.ctx.stroke();
  }

  drawStar(star) {
    const maximumMag = this.getMaximumMag();
    if (star.Mag > maximumMag) return;
    const [alt, az] = this.obs.RaDecToAltAz(star.RA, star.Dec);
    const [x, y] = this.obs.AltAzToXY(alt, az);
    if (x == null || y == null) return;
    if (!(x > -0.5 && x < 0.5 && y > -0.5 && y < 0.5)) return;

    //let mediumMag = maximumMag - 3.366; // Such that star of maximumMag has brightness 10
    let mediumMag = maximumMag - 2;
    let brightness;
    let r;
    if (star.Mag < mediumMag) {
      r = Math.cbrt(2.5 ** (mediumMag - star.Mag)); // Should be sqrt, but stars are too large
      brightness = 255;
    } else {
      r = 1;
      brightness = 255 / 2.5 ** (star.Mag - mediumMag);
    }

    if (this.Horizon && alt < 0) {
      brightness *= 0.2;
    }
    const canX = this.width / 2 + x * this.width;
    const canY = this.height / 2 - y * this.height;
    this.ctx.fillStyle = "#" + Math.round(brightness).toString(16).repeat(3);
    this.ctx.beginPath();
    this.ctx.arc(canX, canY, r, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  drawEqLines() {
    // Bugy
    const RAinterval = (2 * Math.PI) / 24;
    const DECrez = 20;

    const DECinterval = 10;
    const RArez = 0.4 - (0.4 - this.obs.fov / 10);

    this.ctx.strokeStyle = "#808080";

    for (let ra = 0; ra < 2 * Math.PI; ra += RAinterval) {
      let [prevX, prevY] = this.obs.RaDecToXY(RadToDeg(ra) / 15, -90);
      this.ctx.beginPath();
      for (let dec = -90 + DECrez; dec <= 90; dec += DECrez) {
        let [newX, newY] = this.obs.RaDecToXY(RadToDeg(ra) / 15, dec);
        this.drawLine(prevX, prevY, newX, newY);
        [prevX, prevY] = [newX, newY];
      }
      this.ctx.stroke();
    }

    for (let dec = -90; dec < 90; dec += DECinterval) {
      let [prevX, prevY] = this.obs.RaDecToXY(0, dec);
      this.ctx.beginPath();
      for (let ra = RArez; ra <= 24 + RArez; ra += RArez) {
        let [newX, newY] = this.obs.RaDecToXY(ra, dec);
        this.drawLine(prevX, prevY, newX, newY);
        [prevX, prevY] = [newX, newY];
      }
      this.ctx.stroke();
    }
  }

  drawAltAzLines() {
    // Really bugy
    const Azinterval = (2 * Math.PI) / 24;
    const Altrez = 0.1;

    const Altinterval = Math.PI / 18;
    const Azrez = 0.1;

    this.ctx.strokeStyle = "#808080";

    for (let az = 0; az < 2 * Math.PI; az += Azinterval) {
      let [prevX, prevY] = this.obs.AltAzToXYWide(-Math.PI / 2, az);
      this.ctx.beginPath();
      for (let alt = -Math.PI / 2 + Altrez; alt <= Math.PI / 2; alt += Altrez) {
        let [newX, newY] = this.obs.AltAzToXYWide(alt, az);
        this.drawLine(prevX, prevY, newX, newY);
        [prevX, prevY] = [newX, newY];
      }
      this.ctx.stroke();
    }

    for (let alt = -Math.PI / 2; alt < Math.PI / 2; alt += Altinterval) {
      let [prevX, prevY] = this.obs.AltAzToXY(alt, 0);
      this.ctx.beginPath();
      this.ctx.lineWidth = 1;
      if (this.round5(alt) == 0) this.ctx.lineWidth = 2;
      for (let az = Azrez; az <= 2 * Math.PI + Azrez; az += Azrez) {
        let [newX, newY] = this.obs.AltAzToXY(alt, az);
        this.drawLine(prevX, prevY, newX, newY);
        [prevX, prevY] = [newX, newY];
      }
      this.ctx.stroke();
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = "#0a0026";
    this.ctx.fillRect(0, 0, this.width, this.height);

    hvezdy.forEach((hvezda) => {
      if (
        hvezda.Mag < this.getMaximumMag() &&
        this.obs.CheckVisibility(hvezda.RA, hvezda.Dec)
      ) {
        this.drawStar(hvezda);
      }
    });
    if (this.AltAzLines) this.drawAltAzLines();
    if (this.EqLines) this.drawEqLines();
    if (this.Constellations)
      constellations.forEach((constellation) => {
        this.drawConstellation(constellation);
      });
  }
}
