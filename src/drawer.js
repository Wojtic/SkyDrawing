let dataset = {};
dataset.M = M;
dataset.NGC = NGC;
dataset.IC = IC;
dataset.stars = stars;
dataset.constellations = constellations;

class Drawer {
  constructor(
    document,
    div,
    {
      width = 100,
      height = 100,
      latitude = 0,
      longitude = 0,
      altitude = 0,
      azimuth = 0,
      fov = 120,
      horizon = true,
      starColors = true,
      boundaries = false,
      projection = "stereographic",
      date = new Date(),
      maximumMag,
      data = dataset,
      colors = {
        sky: "#070E17",
        altAzLines: "#2BF0E6",
        EQLines: "#F06F2B",
        constellationLines: "#E0F02B",
        constellationBoundaries: "#579E9B",
        messier: "#fa05f2",
        NGC: "#eaff00",
        IC: "#00ff40",
      },
    }
  ) {
    this.dots = [];

    this.constellationPole = [12.053442491471836, 89.30386569273892]; // this.obs.getConstellationPole();
    this.constellationSelectionDiv = null;

    this.projectionSelectionDiv = null;

    this.document = document;

    this.width = width; // * window.devicePixelRatio;
    this.height = height; // * window.devicePixelRatio;

    this.size = Math.max(this.width, this.height);

    this.scale = this.size / 1000;

    this.svg = this.getNode("svg", { width: this.width, height: this.height });
    div.appendChild(this.svg);

    this.colors = colors;
    this.data = data;

    this.svg.style.backgroundColor = this.colors.sky;

    this.obs = new Observer(
      altitude,
      azimuth,
      fov,
      latitude,
      longitude,
      date,
      projection
    );
    this.MAXFOV = 280; // 120 for perspective

    this.ConstellationsToDraw = [];

    this.Czech = true;
    this.Horizon = horizon;
    this.AltAzLines = false;
    this.EqLines = false;
    this.Constellations = boundaries;
    this.ConstellationsLines = false;
    this.StarColors = starColors;
    this.Debug = false;

    this.calculateMaximumMag = maximumMag == undefined;
    if (!this.calculateMaximumMag) this.maximumMag = maximumMag;

    this.pinching = false;
    this.lastPinchDist = null;
    this.updateMaximumMag();

    [this.lastX, this.lastY] = [null, null];
    this.bindInput();

    this.lastSetColor = "#FFFFFF";
    this.draw();

    this.selectedStars = [];
  }

  getNode(n, v) {
    n = this.document.createElementNS("http://www.w3.org/2000/svg", n);
    for (var p in v)
      n.setAttributeNS(
        null,
        p.replace(/[A-Z]/g, function (m, p, o, s) {
          return "-" + m.toLowerCase();
        }),
        v[p]
      );
    return n;
  }

  addNode(n, v) {
    let node = this.getNode(n, v);
    this.svg.appendChild(node);
  }

  drawPolyline(points, color = "#808080") {
    let set = [];
    for (let i = 0; i < points.length; i++) {
      if (points[i][0] != null && points[i][1] != null) {
        set.push(this.XYtoCanvas(...points[i]));
      } else {
        if (set.length > 0) {
          this.addNode("polyline", {
            points: set,
            stroke: color,
            fill: "none",
          });
        }
        set = [];
      }
    }
    if (set.length > 0) {
      this.addNode("polyline", {
        points: set,
        stroke: color,
        fill: "none",
      });
    }
  }

  XYtoCanvas(x, y) {
    if (this.width == this.height)
      return [this.size / 2 + x * this.size, this.size / 2 - y * this.size];
    if (this.width > this.height)
      return [
        this.size / 2 + x * this.size,
        (this.size - this.height) / 2 - y * this.size,
      ];
    return [
      (this.size - this.width) / 2 + x * this.size,
      this.size / 2 - y * this.size,
    ];
  }

  constellationSelection(div = this.constellationSelectionDiv) {
    this.constellationSelectionDiv = div;
    const select = this.document.createElement("select");
    const btn = this.document.createElement("button");
    btn.innerHTML = "Show";
    this.data.constellations.forEach((constellation) => {
      let opt = this.document.createElement("option");
      opt.value = this.Czech ? constellation.czech : constellation.latin; // Change to name
      opt.innerHTML = this.Czech ? constellation.czech : constellation.latin; // Change to name
      select.appendChild(opt);
    });
    div.appendChild(select);
    div.appendChild(btn);

    btn.onclick = (e) => {
      this.showConstellation(this.data.constellations[select.selectedIndex]);
    };
  }

  projectionSelection(div = this.projectionSelectionDiv) {
    this.projectionSelectionDiv = div;
    const select = this.document.createElement("select");
    const btn = this.document.createElement("button");
    btn.innerHTML = "Change";

    const options = ["stereographic", "perspective", "lambert"];

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
      this.MAXFOV =
        this.obs.projection == "stereographic" ||
        this.obs.projection == "lambert"
          ? 280
          : 120;
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
      [this.Messier, "Messier objects"],
      [this.NGC, "NGC objects"],
      [this.IC, "IC objects"],
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
      this.Messier = this.document.getElementsByName(btnsNames[6])[0].checked;
      this.NGC = this.document.getElementsByName(btnsNames[7])[0].checked;
      this.IC = this.document.getElementsByName(btnsNames[8])[0].checked;
      let newCzech = this.document.getElementsByName(btnsNames[9])[0].checked;
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
      this.Debug = this.document.getElementsByName(btnsNames[10])[0].checked;
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
    const getXYFromTouch = (event, canvas = this.svg) => {
      const rect = canvas.getBoundingClientRect();
      /*event =
          typeof event.originalEvent === "undefined"
            ? event
            : event.originalEvent;*/
      let touch = event.touches[0] || event.changedTouches[0];

      let x = touch.pageX - rect.left;
      let y = touch.pageY - rect.top;
      return canXYtoXY(x, y);
    };

    const getXYFromEvent = (event, canvas = this.svg) => {
      const rect = canvas.getBoundingClientRect();
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;
      return canXYtoXY(x, y);
    };

    const canXYtoXY = (x, y) => {
      if (this.width == this.height)
        return [
          (x - this.size / 2) / this.size,
          (this.size / 2 - y) / this.size,
        ];
      if (this.width > this.height)
        return [
          (x - this.width / 2) / this.width,
          ((this.size - this.height) / 2 - y) / this.size,
        ];
      return [
        (x - (this.size - this.width) / 2) / this.size,
        (this.size / 2 - y) / this.size,
      ];
    };

    this.svg.onclick = (e) => {
      let [x, y] = getXYFromEvent(e);
      let [alt, az] = this.obs.XYToAltAz(x, y);
      let [RA, DEC] = this.obs.AltAzToRaDec(alt, az);
      const foundStars = this.findVisibleStars(RA, DEC);
      if (foundStars.length > 0) this.selectedStars.push(foundStars[0].StarID);
      console.log(this.selectedStars);
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

    this.svg.onwheel = (e) => {
      e.preventDefault();
      zoom(e.deltaY);
      this.draw();
    };

    this.svg.ontouchstart = (e) => {
      e.preventDefault();
      if (e.touches.length === 2) {
        this.pinching = true;
        this.lastPinchDist = getPinchDistSqare(e);
      }
      [this.lastX, this.lastY] = getXYFromTouch(e);
    };

    this.svg.onmousedown = (e) => {
      e.preventDefault();
      [this.lastX, this.lastY] = getXYFromEvent(e);
    };

    this.svg.ontouchmove = (e) => {
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

    this.svg.onmousemove = (e) => {
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

    this.svg.onmouseup =
      this.svg.onmouseleave =
      this.svg.ontouchend =
      this.svg.ontouchcancel =
        (e) => {
          e.preventDefault();
          [this.lastX, this.lastY] = [null, null];
          this.pinching = false;
          this.lastPinchDist = null;
        };
  }

  FOVtoMaximumMag(FOV = this.obs.fov) {
    this.maximumMag =
      -6.7128 / (1 + Math.exp(-0.0641831 * RadToDeg(FOV) + 1.39443)) + 13.698;
    return this.maximumMag;
  }

  updateMaximumMag() {
    let sliders = this.document.getElementsByClassName("maxMAG");

    /*if (sliders.length > 0) this.maximumMag = sliders[0].value;
    else {
      //const maximumMag = 2.5 / this.obs.fov + 6; // fov 140 - 7; 90 - 7.5
      /*this.maximumMag =
        -0.8 * this.obs.fov +
        8.4 -
        2 +
        Math.min(this.width, this.height) / (window.devicePixelRatio * 500);*/
    //}

    if (this.calculateMaximumMag) {
      this.FOVtoMaximumMag();
    }

    return this.maximumMag;
  }

  drawLine(x1, y1, x2, y2) {
    if (x1 == null || y1 == null || x2 == null || y2 == null) return;
    const [canX1, canY1] = this.XYtoCanvas(x1, y1);
    const [canX2, canY2] = this.XYtoCanvas(x2, y2);
    this.svg.appendChild(
      this.getNode("line", {
        x1: canX1,
        y1: canY1,
        x2: canX2,
        y2: canY2,
        stroke: this.lastSetColor,
      })
    );
  }

  drawLineRaDec(x1, y1, x2, y2) {
    this.drawLine(
      ...this.obs.RaDecToXYWide(x1, y1),
      ...this.obs.RaDecToXYWide(x2, y2)
    );
  }

  drawLines(lines, color = "#808080") {
    this.lastSetColor = color;
    for (let i = 0; i < lines.length; i++) {
      this.drawLineRaDec(...lines[i]);
    }
  }

  drawConstellation(constellation) {
    const points = [];

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
        this.colors.constellationBoundaries,
        points
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
        this.colors.constellationBoundaries,
        points
      );
    };

    let boundary = constellation.boundary;
    let prev = boundary[boundary.length - 1];
    for (let i = 0; i < boundary.length; i++) {
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

    this.drawPolyline(points, this.colors.constellationBoundaries);
  }

  drawContinuousLineAltAz(set, color = "#808080", returnPoints = null) {
    this.lastSetColor = color;
    let points = "";
    for (let i = 0; i < set.length; i++) {
      var [newX, newY] = this.obs.AltAzToXY(...set[i]);
      if (returnPoints !== null) {
        returnPoints.push([newX, newY]);
      } else {
        const [canX, canY] = this.XYtoCanvas(newX, newY);
        if (newX !== null && newY !== null) points += canX + "," + canY + " ";
      }
    }
    if (returnPoints == null)
      this.addNode("polyline", { points: points, stroke: color, fill: "none" });
  }

  drawStar(star) {
    if (star.Mag > this.maximumMag) return;
    if (star.changed == undefined || star.changed < this.obs.lastChanged) {
      star.changed = new Date();
      [star.alt, star.az] = this.obs.RaDecToAltAz(star.RA, star.Dec);
    }
    const [x, y] = this.obs.AltAzToXY(star.alt, star.az);
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

    if (this.Horizon && star.alt < 0) {
      if (r > 1) {
        brightness *= 0.5;
      } else {
        brightness = Math.min(brightness, 5);
      }
    }
    const [canX, canY] = this.XYtoCanvas(x, y);
    if (canX < 0 || canY < 0) return;
    this.addNode("circle", {
      r: r * this.scale,
      cx: canX,
      cy: canY,
      fill: this.starColor(brightness, star.ColorIndex),
    });
  }

  starColor(brightness, colorIndex) {
    colorIndex = parseFloat(colorIndex);
    if (isNaN(colorIndex) || !this.StarColors) {
      if (this.colors.stars) return this.colors.stars;
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
    if (bv < -0.4) bv = -0.4;
    if (bv > 2.0) bv = 2.0;
    if (bv >= 2) return [1, 198 / 255, 109 / 255];
    let [r, g, b] = [0.0, 0.0, 0.0];

    if (-0.4 <= bv && bv < 0.0) {
      let t = (bv + 0.4) / (0.0 + 0.4);
      r = 0.61 + 0.11 * t + 0.1 * t * t;
    } else if (0.0 <= bv && bv < 0.4) {
      let t = (bv - 0.0) / (0.4 - 0.0);
      r = 0.83 + 0.17 * t;
    } else if (0.4 <= bv && bv < 2.1) {
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
    this.lastSetColor = this.colors.constellationLines;
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
    this.obs.CheckVisibility();
  }

  drawConstellationsLines() {
    this.data.constellations.forEach((constellation) => {
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

    this.lastSetColor = this.colors.altAzLines;

    for (let az = 0; az < 2 * Math.PI; az += Azinterval) {
      let points = [];
      // Dirty fix for rounding issue, refactor
      for (let alt = -Math.PI / 2; alt <= Math.PI / 2 + 0.01; alt += Altrez) {
        points.push(this.obs.AltAzToXYWide(alt, az));
      }
      this.drawPolyline(points, this.colors.altAzLines);
    }

    for (let alt = -Math.PI / 2; alt < Math.PI / 2; alt += Altinterval) {
      let points = [];
      //this.ctx.lineWidth = 1;
      //if (this.round5(alt) == 0) this.ctx.lineWidth = 2;
      for (let az = 0; az <= 2 * Math.PI + Azrez; az += Azrez) {
        points.push(this.obs.AltAzToXYWide(alt, az));
      }
      this.drawPolyline(points, this.colors.altAzLines);
    }
  }

  drawDSOs(set, color) {
    set.forEach((object) => {
      const [x, y] = this.obs.RaDecToXY(object.RA, object.Dec);
      if (x == null || y == null) return;
      if (!(x > -0.5 && x < 0.5 && y > -0.5 && y < 0.5)) return;

      const [canX, canY] = this.XYtoCanvas(x, y);
      if (canX < 0 || canY < 0) return;
      this.addNode("circle", {
        r: 7 * this.scale,
        cx: canX,
        cy: canY,
        strokeWidth: "2",
        strokeDasharray: 4 * this.scale,
        stroke: color,
        fill: "none",
      });
    });
  }

  drawMessier() {
    this.drawDSOs(this.data.M, this.colors.messier);
  }

  drawNGC() {
    this.drawDSOs(this.data.NGC, this.colors.NGC);
  }

  drawIC() {
    this.drawDSOs(this.data.IC, this.colors.IC);
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

  findVisibleStars(ra, dec, r = this.obs.fov / 100) {
    let foundStars = [];
    for (let i = 0; i < this.data.stars.length; i++) {
      if (this.data.stars[i].Mag > this.maximumMag) break;
      if (
        this.obs.CalculateDistanceRaDec(
          ra,
          dec,
          degToRad(this.data.stars[i].RA * 15),
          degToRad(this.data.stars[i].Dec)
        ) < r
      )
        foundStars.push(this.data.stars[i]);
    }
    return foundStars;
  }

  writeDebug() {
    this.document.querySelector(".dbg").innerHTML =
      JSON.stringify(this.obs.GetDebug()).replaceAll(",", ",\n") +
      this.selectedStars;

    for (let i = 0; i < this.dots.length; i++) {
      const [alt, az] = this.obs.RaDecToAltAz(...this.dots[i]);
      const [x, y] = this.obs.AltAzToXY(alt, az);
      if (x == null || y == null) continue;
      if (!(x > -0.5 && x < 0.5 && y > -0.5 && y < 0.5)) continue;

      const [canX, canY] = this.XYtoCanvas(x, y);
      //this.findVisibleStars(...this.dots[i]);
      this.addNode("circle", {
        r: 5,
        cx: canX,
        cy: canY,
        fill: "#FF0000",
      });
    }
  }

  draw() {
    this.updateMaximumMag();
    this.svg.textContent = ""; // vs innerHTML test performance

    for (let i = this.data.stars.length - 1; i >= 0; i--) {
      if (
        this.data.stars[i].Mag < this.maximumMag &&
        this.obs.CheckVisibility(this.data.stars[i].RA, this.data.stars[i].Dec) // Fix!!
      ) {
        this.drawStar(this.data.stars[i]);
      }
    }
    if (this.AltAzLines) this.drawAltAzLines();
    if (this.EqLines) this.drawLines(JSONEQLines.lines, this.colors.EQLines);
    if (this.ConstellationsLines) this.drawConstellationsLines();
    if (this.Constellations)
      this.data.constellations.forEach((constellation) => {
        this.drawConstellation(constellation);
      });
    else
      this.ConstellationsToDraw.forEach((constellation) => {
        this.drawConstellation(constellation);
      });
    if (this.Messier) this.drawMessier();
    if (this.NGC) this.drawNGC();
    if (this.IC) this.drawIC();
    if (this.Debug) this.writeDebug();
    else this.document.querySelector(".dbg").innerHTML = "";
  }
}
