class Drawer {
  constructor(document, div, width, height) {
    this.dots = [];

    this.constellationPole = [12.053442491471836, 89.30386569273892]; // this.obs.getConstellationPole();
    this.constellationSelectionDiv = null;

    this.projectionSelectionDiv = null;

    this.document = document;
    this.canvas = document.createElement("canvas");
    this.canvas.id = "mainCan";
    this.canvas.width = width * window.devicePixelRatio;
    this.canvas.height = height * window.devicePixelRatio;
    this.canvas.style.height = height + "px";
    this.canvas.style.width = width + "px";
    this.colors = {
      sky: "#070E17",
      altAzLines: "#2BF0E6",
      EQLines: "#F06F2B",
      constellationLines: "#E0F02B",
      constellationBoundaries: "#579E9B",
    };

    div.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");

    this.width = width * window.devicePixelRatio;
    this.height = height * window.devicePixelRatio;

    this.obs = new Observer(0, 0, 120, 50.07, 14.12);
    this.MAXFOV = 230; // 120 for perspective

    this.ConstellationsToDraw = [];

    this.Czech = true;
    this.Horizon = true;
    this.AltAzLines = false;
    this.EqLines = false;
    this.Constellations = false;
    this.ConstellationsLines = false;
    this.StarColors = true;
    this.Debug = false;

    this.pinching = false;
    this.lastPinchDist = null;
    this.updateMaximumMag();

    [this.lastX, this.lastY] = [null, null];
    this.bindInput();
    this.draw();
  }

  constellationSelection(div = this.constellationSelectionDiv) {
    this.constellationSelectionDiv = div;
    const select = this.document.createElement("select");
    const btn = this.document.createElement("button");
    btn.innerHTML = "Show";
    constellations.forEach((constellation) => {
      let opt = this.document.createElement("option");
      opt.value = this.Czech ? constellation.czech : constellation.latin; // Change to name
      opt.innerHTML = this.Czech ? constellation.czech : constellation.latin; // Change to name
      select.appendChild(opt);
    });
    div.appendChild(select);
    div.appendChild(btn);

    btn.onclick = (e) => {
      this.showConstellation(constellations[select.selectedIndex]);
    };
  }

  projectionSelection(div = this.projectionSelectionDiv) {
    this.projectionSelectionDiv = div;
    const select = this.document.createElement("select");
    const btn = this.document.createElement("button");
    btn.innerHTML = "Change";

    const options = ["stereographic", "perspective"];

    options.forEach((option) => {
      let opt = this.document.createElement("option");
      opt.value = option;
      opt.innerHTML = option;
      select.appendChild(opt);
    });
    div.appendChild(select);
    div.appendChild(btn);

    btn.onclick = (e) => {
      this.obs.projection = options[select.selectedIndex];
      this.MAXFOV = this.obs.projection == "stereographic" ? 230 : 120;
      if (this.obs.fov > degToRad(this.MAXFOV))
        this.obs.ChangeSettings({ fov: degToRad(this.MAXFOV) });
      this.draw();
    };
  }

  options(div) {
    const btns = [
      [this.Horizon, "Horzion"],
      [this.AltAzLines, "Alt Az Lines"],
      [this.EqLines, "Eq Lines"],
      [this.Constellations, "Boundaries"],
      [this.ConstellationsLines, "Constellation Lines"],
      [this.StarColors, "Star colors"],
      [this.Czech, "Czech Names"],
      [this.Debug, "Show Debug"],
    ];

    const btnsNames = btns.map((elem) => elem[1].replace(/\s/g, ""));

    const change = () => {
      this.Horizon = this.document.getElementsByName(btnsNames[0])[0].checked;
      this.AltAzLines = this.document.getElementsByName(
        btnsNames[1]
      )[0].checked;
      this.EqLines = this.document.getElementsByName(btnsNames[2])[0].checked;
      this.Constellations = this.document.getElementsByName(
        btnsNames[3]
      )[0].checked;
      this.ConstellationsLines = this.document.getElementsByName(
        btnsNames[4]
      )[0].checked;
      this.StarColors = this.document.getElementsByName(
        btnsNames[5]
      )[0].checked;
      let newCzech = this.document.getElementsByName(btnsNames[6])[0].checked;
      if (newCzech != this.Czech) {
        this.Czech = newCzech;
        if (this.constellationSelectionDiv) {
          this.constellationSelectionDiv.innerHTML = "";
          this.constellationSelection();
        }
        if (this.projectionSelectionDiv) {
          this.projectionSelectionDiv.innerHTML = "";
          this.projectionSelection();
        }
      }
      this.Debug = this.document.getElementsByName(btnsNames[7])[0].checked;
      this.draw();
    };

    for (let i = 0; i < btns.length; i++) {
      const Chb = this.document.createElement("input");
      Chb.type = "checkbox";
      Chb.name = btnsNames[i];
      Chb.value = btnsNames[i];
      Chb.checked = btns[i][0];
      Chb.onclick = change;
      const Lbl = this.document.createElement("label");
      Lbl.for = btnsNames[i];
      Lbl.innerHTML = btns[i][1] + ":";
      div.appendChild(Lbl);
      div.appendChild(Chb);
    }
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

    this.canvas.onclick = (e) => {
      let [x, y] = getXYFromEvent(e);
      let [alt, az] = this.obs.XYToAltAz(x, y);
      let [RA, DEC] = this.obs.AltAzToRaDec(alt, az);
      /*console.log(alt, az);
      console.log("RA: ", RadToDeg(RA) / 15, "Dec: ", RadToDeg(DEC));
      console.log(RadToDeg(this.obs.CalculateDistanceRaDec(RA, DEC)));*/
      this.dots.push([RadToDeg(RA) / 15, RadToDeg(DEC)]);
      this.draw();
    };
    const zoom = (delta) => {
      if (delta > 0) {
        if (this.obs.fov >= degToRad(this.MAXFOV) / 1.1) {
          this.obs.ChangeSettings({ fov: degToRad(this.MAXFOV) });
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

  updateMaximumMag() {
    let sliders = this.document.getElementsByClassName("maxMAG");
    
    if (sliders.length > 0) this.maximumMag = sliders[0].value;
    else {   
      //const maximumMag = 2.5 / this.obs.fov + 6; // fov 140 - 7; 90 - 7.5
      this.maximumMag = (
        -0.8 * this.obs.fov +
        8.4 -
        2 +
        Math.min(this.width, this.height) / (window.devicePixelRatio * 500)
      );
    } 

    return this.maximumMag;
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

  drawLineRaDec(x1, y1, x2, y2) {
    this.drawLine(
      ...this.obs.RaDecToXYWide(x1, y1),
      ...this.obs.RaDecToXYWide(x2, y2)
    );
  }

  drawLines(lines, color = "#808080") {
    this.ctx.strokeStyle = color;
    this.ctx.beginPath();
    for (let i = 0; i < lines.length; i++) {
      this.drawLineRaDec(...lines[i]);
    }
    this.ctx.stroke();
  }

  drawConstellation(constellation) {
    const drawConstellationMeridian = (ra1, dec1, ra2, dec2) => {
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
      this.drawContinuousLineAltAz(
        stepsAltAz,
        this.colors.constellationBoundaries
      );
    };

    const drawConstellationParallel = (ra1, dec1, ra2, dec2) => {
      const [alt1, az1] = this.obs.RaDecToAltAz(ra1, dec1);
      const [alt2, az2] = this.obs.RaDecToAltAz(ra2, dec2);
      const stepsAltAz = this.obs.InterpolateOnCircleCenter(
        alt1,
        az1,
        alt2,
        az2,
        ...this.obs.RaDecToAltAz(...this.constellationPole)
      );
      this.drawContinuousLineAltAz(
        stepsAltAz,
        this.colors.constellationBoundaries
      );
    };

    let boundary = constellation.boundary;
    let prev = boundary[0];
    for (let i = 1; i < boundary.length; i++) {
      let newLine = boundary[i];
      const diffRA =
        Math.min(
          Math.abs(prev[0] - newLine[0]),
          Math.abs(prev[0] + 24 - newLine[0])
        ) / 24;
      const diffDEC = Math.abs(prev[1] - newLine[1]) / 180;
      if (diffRA < diffDEC) drawConstellationMeridian(...prev, ...newLine);
      else drawConstellationParallel(...prev, ...newLine);
      prev = newLine;
    }
    const diffRA =
      Math.min(
        Math.abs(prev[0] - boundary[0][0]),
        Math.abs(prev[0] + 24 - boundary[0][0])
      ) / 24;
    const diffDEC = Math.abs(prev[1] - boundary[0][1]) / 180;
    if (diffRA < diffDEC) drawConstellationMeridian(...boundary[0], ...prev);
    else drawConstellationParallel(...boundary[0], ...prev);
  }

  drawContinuousLineAltAz(set, color = "#808080") {
    this.ctx.strokeStyle = color;
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
    if (star.Mag > this.maximumMag) return;
    const [alt, az] = this.obs.RaDecToAltAz(star.RA, star.Dec);
    const [x, y] = this.obs.AltAzToXY(alt, az);
    if (x == null || y == null) return;
    if (!(x > -0.5 && x < 0.5 && y > -0.5 && y < 0.5)) return;

    //let mediumMag = maximumMag - 3.366; // Such that star of maximumMag has brightness 10
    let mediumMag = this.maximumMag - 2;
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
      if (r > 1) {
        brightness *= 0.5;
      } else {
        brightness = Math.min(brightness, 5);
      }
    }
    const canX = this.width / 2 + x * this.width;
    const canY = this.height / 2 - y * this.height;
    this.ctx.fillStyle = this.starColor(brightness, star.ColorIndex);
    this.ctx.beginPath();
    this.ctx.arc(canX, canY, r, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  starColor(brightness, colorIndex) {
    colorIndex = parseFloat(colorIndex);
    if (isNaN(colorIndex) || !this.StarColors) {
      return "#" + Math.round(brightness).toString(16).repeat(3);
    }
    const [r, g, b] = this.bv2rgb(parseFloat(colorIndex));
    return this.rgbToHex(r * brightness, g * brightness, b * brightness);
  }

  rgbToHex(r, g, b) {
    const componentToHex = (c) => {
      c = Math.round(c);
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    };
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  bv2rgb(bv) {
    if (bv < -0.4) {
      bv = -0.4;
    }
    if (bv > 2.0) {
      bv = 2.0;
    }

    if (bv >= 2) {
      return [1, 198 / 255, 109 / 255];
    }

    let r = 0.0;
    let g = 0.0;
    let b = 0.0;

    if (-0.4 <= bv && bv < 0.0) {
      let t = (bv + 0.4) / (0.0 + 0.4);
      r = 0.61 + 0.11 * t + 0.1 * t * t;
    } else if (0.0 <= bv && bv < 0.4) {
      let t = (bv - 0.0) / (0.4 - 0.0);
      r = 0.83 + 0.17 * t;
    } else if (0.4 <= bv && bv < 2.1) {
      let t = (bv - 0.4) / (2.1 - 0.4);
      r = 1.0;
    }

    if (-0.4 <= bv && bv < 0.0) {
      let t = (bv + 0.4) / (0.0 + 0.4);
      g = 0.7 + 0.07 * t + 0.1 * t * t;
    } else if (0.0 <= bv && bv < 0.4) {
      let t = (bv - 0.0) / (0.4 - 0.0);
      g = 0.87 + 0.11 * t;
    } else if (0.4 <= bv && bv < 1.6) {
      let t = (bv - 0.4) / (1.6 - 0.4);
      g = 0.98 - 0.16 * t;
    } else if (1.6 <= bv && bv < 2.0) {
      let t = (bv - 1.6) / (2.0 - 1.6);
      g = 0.82 - 0.5 * t * t;
    }

    if (-0.4 <= bv && bv < 0.4) {
      let t = (bv + 0.4) / (0.4 + 0.4);
      b = 1.0;
    } else if (0.4 <= bv && bv < 1.5) {
      let t = (bv - 0.4) / (1.5 - 0.4);
      b = 1.0 - 0.47 * t + 0.1 * t * t;
    } else if (1.5 <= bv && bv < 1.94) {
      let t = (bv - 1.5) / (1.94 - 1.5);
      b = 0.63 - 0.6 * t * t;
    }

    return [r, g, b];
  }

  drawConstellationLines(constellationLines) {
    this.ctx.strokeStyle = this.colors.constellationLines;
    this.ctx.beginPath();
    for (let i = 0; i < constellationLines.length; i++) {
      if (
        this.obs.CheckVisibility(
          constellationLines[i][0].RA,
          constellationLines[i][0].Dec
        ) &&
        this.obs.CheckVisibility(
          constellationLines[i][1].RA,
          constellationLines[i][1].Dec
        )
      ) {
        let [startX, startY] = this.obs.RaDecToXYWide(
          constellationLines[i][0].RA,
          constellationLines[i][0].Dec
        );
        let [endX, endY] = this.obs.RaDecToXYWide(
          constellationLines[i][1].RA,
          constellationLines[i][1].Dec
        );
        this.drawLine(startX, startY, endX, endY);
      }
    }
    this.ctx.stroke();
    this.obs.CheckVisibility();
  }

  drawConstellationsLines() {
    constellations.forEach((constellation) => {
      if (constellation.lines != undefined) {
        this.drawConstellationLines(constellation.lines);
      }
    });
  }

  drawAltAzLines() {
    // Really bugy
    const Azinterval = (2 * Math.PI) / 24;
    const Altrez = Math.PI / 18;

    const Altinterval = Math.PI / 18;
    const Azrez = (2 * Math.PI) / 48;

    this.ctx.strokeStyle = this.colors.altAzLines;

    for (let az = 0; az < 2 * Math.PI; az += Azinterval) {
      let [prevX, prevY] = this.obs.AltAzToXYWide(-Math.PI / 2, az);
      this.ctx.beginPath();
      for (
        let alt = -Math.PI / 2 + Altrez;
        alt <= Math.PI / 2 + 0.01; // Dirty fix for rounding issue, refactor
        alt += Altrez
      ) {
        let [newX, newY] = this.obs.AltAzToXYWide(alt, az);
        this.drawLine(prevX, prevY, newX, newY);
        [prevX, prevY] = [newX, newY];
      }
      this.ctx.stroke();
    }

    for (let alt = -Math.PI / 2; alt < Math.PI / 2; alt += Altinterval) {
      let [prevX, prevY] = this.obs.AltAzToXYWide(alt, 0);
      this.ctx.beginPath();
      this.ctx.lineWidth = 1;
      if (this.round5(alt) == 0) this.ctx.lineWidth = 2;
      for (let az = Azrez; az <= 2 * Math.PI + Azrez; az += Azrez) {
        let [newX, newY] = this.obs.AltAzToXYWide(alt, az);
        this.drawLine(prevX, prevY, newX, newY);
        [prevX, prevY] = [newX, newY];
      }
      this.ctx.stroke();
    }
  }

  showConstellation(constellation) {
    this.obs.ChangeSettings({ lat: Math.PI / 2 - 0.005, long: 0 }); // Change to Math.PI/2 when 0 divison bug is fixed
    const [alt, az] = this.obs.RaDecToAltAz(...constellation.center);
    this.obs.ChangeSettings({
      alt: alt,
      az: az,
      fov: constellation.maxAngDist * 2,
    });
    if (!this.Constellations) this.ConstellationsToDraw = [constellation];
    this.draw();
  }

  writeDebug() {
    this.document.querySelector(".dbg").innerHTML = JSON.stringify(
      this.obs.GetDebug()
    ).replaceAll(",", ",\n");

    /*for (let i = 0; i < this.dots.length; i++) {
      const [alt, az] = this.obs.RaDecToAltAz(...this.dots[i]);
      const [x, y] = this.obs.AltAzToXY(alt, az);
      if (x == null || y == null) continue;
      if (!(x > -0.5 && x < 0.5 && y > -0.5 && y < 0.5)) continue;

      const canX = this.width / 2 + x * this.width;
      const canY = this.height / 2 - y * this.height;
      this.ctx.fillStyle = "#FF0000";
      this.ctx.beginPath();
      this.ctx.arc(canX, canY, 5, 0, 2 * Math.PI);
      this.ctx.fill();
    }*/
  }

  draw() {
    this.updateMaximumMag();
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = this.colors.sky; //"#0a0026";
    this.ctx.fillRect(0, 0, this.width, this.height);
    hvezdy.forEach((hvezda) => {
      if (
        hvezda.Mag < this.maximumMag &&
        this.obs.CheckVisibility(hvezda.RA, hvezda.Dec) // Fix!!
      ) {
        this.drawStar(hvezda);
      }
    });
    if (this.AltAzLines) this.drawAltAzLines();
    if (this.EqLines) this.drawLines(JSONEQLines.lines, this.colors.EQLines);
    if (this.ConstellationsLines) this.drawConstellationsLines();
    if (this.Constellations)
      constellations.forEach((constellation) => {
        this.drawConstellation(constellation);
      });
    else
      this.ConstellationsToDraw.forEach((constellation) => {
        this.drawConstellation(constellation);
      });
    if (this.Debug) this.writeDebug();
    else this.document.querySelector(".dbg").innerHTML = "";
  }
}
