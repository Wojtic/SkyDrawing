class Observer {
  constructor(
    alt = 0,
    az = 0,
    fov = 120,
    lat = 90,
    long = 0,
    date = new Date(),
    projection = "stereographic"
  ) {
    this.ChangeSettings({
      alt: degToRad(alt),
      az: degToRad(az),
      fov: degToRad(fov),
      lat: degToRad(lat),
      long: degToRad(long),
      date: date,
      projection: projection,
    });
    this.lastChanged = new Date();
  }

  ChangeSettings({
    alt = this.alt,
    az = this.az,
    fov = this.fov,
    lat = this.lat,
    long = this.long,
    date = this.date,
    projection = this.projection,
  }) {
    this.alt = alt; //-pi/2 to pi/2
    this.az = az; //0 to 2pi
    this.fov = fov;

    if (this.date != date || this.lat != lat || this.long != long)
      this.lastChanged = new Date(); // Need to recalculate coords

    this.lat = lat;
    this.long = long; // east is positive
    this.date = date;

    this.projection = projection;

    this.dist = 0.5 / Math.tan(this.fov / 2);
    this.Odir = new Vector(
      Math.cos(this.alt) * Math.cos(this.az),
      Math.cos(this.alt) * Math.sin(this.az),
      Math.sin(this.alt)
    );
    this.O = this.Odir.multiply(this.dist);
    this.Ox = new Vector(-Math.sin(this.az), Math.cos(this.az), 0);
    this.Oy = new Vector(
      -Math.sin(this.alt) * Math.cos(this.az),
      -Math.sin(this.alt) * Math.sin(this.az),
      Math.cos(this.alt)
    );

    [this.RA, this.DEC] = this.AltAzToRaDec(this.alt, this.az);
  }

  UpdateAltAZ(deltaAlt, deltaAz) {
    let newAlt = this.alt + deltaAlt;
    if (newAlt > Math.PI / 2) newAlt = Math.PI / 2;
    if (newAlt < -Math.PI / 2) newAlt = -Math.PI / 2;
    let newAz = this.az + deltaAz;
    newAz %= 2 * Math.PI;
    if (newAz < 0) newAz += 2 * Math.PI;
    this.ChangeSettings({ alt: newAlt, az: newAz });
  }

  GetDebug() {
    return {
      altitude: RadToDeg(this.alt),
      azimuth: RadToDeg(this.az),
      FOV: RadToDeg(this.fov),
      latitude: RadToDeg(this.lat),
      longitude: RadToDeg(this.long),
      date: this.date,
      distance: this.dist,
      O: this.O,
      Ox: this.Ox,
      Oy: this.Oy,
      GMSTrad: this.CalculateGMST(),
      GMSTtime: RadToDeg(this.CalculateGMST()) / 15,
    };
  }

  CalculateDistanceRaDec(RA1, DEC1, RA2 = this.RA, DEC2 = this.DEC) {
    return Math.acos(
      Math.sin(DEC1) * Math.sin(DEC2) +
        Math.cos(DEC1) * Math.cos(DEC2) * Math.cos(RA1 - RA2)
    );
  }

  CalculateERA(date = this.date) {
    // Earth Rotation Angle
    let JD = date.getTime() / 86400000 + 2440587.5; // Julian date
    let tu = JD - 2451545.0;

    let ERA = 2 * Math.PI * (0.779057273264 + 1.00273781191135448 * tu);
    ERA %= 2 * Math.PI;
    if (ERA < 0) ERA += 2 * Math.PI;
    return ERA;
  }

  CalculateGMST(date = this.date) {
    const ERA = this.CalculateERA(date);

    const t = (date.getTime() / 86400000 + 2440587.5 - 2451545.0) / 36525.0;
    let GMST =
      ERA +
      (((0.014506 +
        4612.156534 * t +
        1.3915817 * t ** 2 -
        0.00000044 * t ** 3 -
        0.000029956 * t ** 4 -
        0.0000000368 * t ** 5) /
        60.0 /
        60.0) *
        Math.PI) /
        180.0;
    GMST %= 2 * Math.PI;
    if (GMST < 0) GMST += 2 * Math.PI;

    return GMST;
  }

  CalculateLMST(date = this.date, longitude = this.long) {
    return (this.CalculateGMST(date) + longitude) % (2 * Math.PI);
  }

  RaDecToAltAz(RA, DEC) {
    // Practical astronomy with your Calculator or Spreadsheet page 47
    RA = degToRad(RA * 15);
    DEC = degToRad(DEC);

    const LMST = this.CalculateLMST();

    let HA = LMST - RA;
    if (HA < 0) {
      HA += 2 * Math.PI;
    }
    if (HA > Math.PI) {
      HA = HA - 2 * Math.PI;
    }

    let az = Math.atan2(
      Math.sin(HA),
      Math.cos(HA) * Math.sin(this.lat) - Math.tan(DEC) * Math.cos(this.lat)
    );
    let sinAlt =
      Math.sin(this.lat) * Math.sin(DEC) +
      Math.cos(this.lat) * Math.cos(DEC) * Math.cos(HA);
    if (sinAlt < -1) sinAlt = -1;
    if (sinAlt > 1) sinAlt = 1;
    const alt = Math.asin(sinAlt);
    az -= Math.PI;

    if (az < 0) az += 2 * Math.PI;
    return [alt, az];
  }

  RaDecToXY(RA, DEC) {
    return this.AltAzToXY(...this.RaDecToAltAz(RA, DEC));
  }

  RaDecToXYWide(RA, DEC) {
    return this.AltAzToXYWide(...this.RaDecToAltAz(RA, DEC));
  }

  AltAzToRaDec(alt, az) {
    // Practical astronomy with your Calculator or Spreadsheet page 48
    // Is bugy at latitude 90deg (division by zero, I was unable to eliminate it)
    let LMST = this.CalculateLMST();

    let sinDec =
      Math.sin(alt) * Math.sin(this.lat) +
      Math.cos(alt) * Math.cos(this.lat) * Math.cos(az);
    if (sinDec < -1) sinDec = -1; // JS rounding precision
    if (sinDec > 1) sinDec = 1;
    const DEC = Math.asin(sinDec);

    let cosHA =
      (Math.sin(alt) - Math.sin(this.lat) * Math.sin(DEC)) /
      (Math.cos(this.lat) * Math.cos(DEC));
    if (cosHA < -1) cosHA = -1; // JS rounding precision
    if (cosHA > 1) cosHA = 1;

    let HA = Math.acos(cosHA);
    if (Math.sin(az) > 0) {
      HA = 2 * Math.PI - HA;
    }
    let RA = LMST - HA;
    if (RA < 0) RA += 2 * Math.PI;
    return [RA, DEC];
  }

  AltAzToXYWide(alt, az) {
    return this.AltAzToXY(alt, az, true);
  }

  AltAzToVector(alt, az) {
    return new Vector(
      Math.cos(alt) * Math.cos(az),
      Math.cos(alt) * Math.sin(az),
      Math.sin(alt)
    );
  }

  AltAzToXY(alt, az, ignoreFov = false) {
    const S = this.AltAzToVector(alt, az);
    if (
      this.fov < Math.PI && // For some reason creates hole in the middle if FOV is bigger
      !ignoreFov &&
      S.angleTo(this.O) > this.fov * 0.5 * Math.SQRT2
    )
      return [null, null]; // The star lies outside of the FOV

    switch (this.projection) {
      case "perspective":
        return this.PerspectiveAltAzToXY(alt, az);
      case "stereographic":
        return this.StereographicAltAzToXY(alt, az);
      case "lambert":
        return this.LambertAltAzToXY(alt, az);
      default:
        return this.StereographicAltAzToXY(alt, az);
    }
  }

  XYToAltAz(x, y) {
    switch (this.projection) {
      case "perspective":
        return this.PerspectiveXYToAltAz(x, y);
      case "stereographic":
        return this.StereographicXYToAltAz(x, y);
      case "lambert":
        return this.LambertXYToAltAz(x, y);
      default:
        return this.StereographicXYToAltAz(x, y);
    }
  }

  AltAzToXYDeg(alt, az) {
    return this.AltAzToXY(degToRad(alt), degToRad(az));
  }

  CheckVisibility(RA, DEC) {
    const dist = this.CalculateDistanceRaDec(degToRad(RA * 15), degToRad(DEC));
    return dist <= this.fov * 0.5 * Math.SQRT2;
  }

  GetUnitCenterCircumcircle(A, B, C) {
    // https://en.wikipedia.org/wiki/Circumcircle
    const a = A.subtract(C);
    const b = B.subtract(C);
    const x1 = b.multiply(a.length() ** 2);
    const x2 = a.multiply(b.length() ** 2);
    const numerator = x1.subtract(x2).cross(a.cross(b));
    const denominator = 2 * a.cross(b).length() ** 2;
    return numerator.divide(denominator).add(C).unit();
  }

  VectorToAltAz(v) {
    const alt = Math.asin(v.z);
    const az1 = Math.acos(v.x / Math.cos(alt));
    const az2 = Math.asin(v.y / Math.cos(alt));
    const az = az2 > 0 ? az1 : 2 * Math.PI - az1;
    return [alt, az];
  }

  InterpolateOnCircleCenter(
    startAlt,
    startAz,
    endAlt,
    endAz,
    centerAlt,
    centerAz
  ) {
    const start = this.AltAzToVector(startAlt, startAz);
    const end = this.AltAzToVector(endAlt, endAz);
    const center = this.AltAzToVector(centerAlt, centerAz);
    const angle = start
      .orthogonalComponent(center)
      .angleTo(end.orthogonalComponent(center));
    const steps = angle * 60;
    const angleIncr = angle / steps;
    let stepsAltAz = [[startAlt, startAz]];
    const sign =
      start.rotateAround(center, angle).subtract(end).length() <
      start.rotateAround(center, -angle).subtract(end).length()
        ? 1
        : -1; // I don't like this, really inefficent
    for (let i = 1; i < steps; i++) {
      stepsAltAz.push(
        this.VectorToAltAz(start.rotateAround(center, angleIncr * i * sign))
      );
    }
    stepsAltAz.push([endAlt, endAz]);
    return stepsAltAz;
  }

  InterpolateOnCircle3Points(
    startAlt,
    startAz,
    endAlt,
    endAz,
    thirdAlt,
    thirdAz,
    steps
  ) {
    const center = this.GetUnitCenterCircumcircle(
      this.AltAzToVector(startAlt, startAz),
      this.AltAzToVector(endAlt, endAz),
      this.AltAzToVector(thirdAlt, thirdAz)
    );
    return this.InterpolateOnCircleCenter(
      startAlt,
      startAz,
      endAlt,
      endAz,
      ...this.VectorToAltAz(center),
      steps
    );
  }

  GetConstellationPole() {
    const A = this.AltAzToVector(
      ...this.RaDecToAltAz(13 + 4 / 60 + 23.3937 / 3600, 69.329361)
    ); //13 04 23.3937| 69.3293610|UMI
    const B = this.AltAzToVector(
      ...this.RaDecToAltAz(14 + 2 / 60 + 36.1947 / 3600, 69.3991165)
    ); //14 02 36.1947| 69.3991165|UMI
    const C = this.AltAzToVector(
      ...this.RaDecToAltAz(15 + 40 / 60 + 12.1512 / 3600, 69.6009445)
    ); //15 40 12.1512| 69.6009445|UMI

    const p = this.GetUnitCenterCircumcircle(A, B, C);

    let [RA, DEC] = this.AltAzToRaDec(...this.VectorToAltAz(p));
    return [RadToDeg(RA) / 15, RadToDeg(DEC)]; //[ 12.053442491471836, 89.30386569273892 ]
  }

  GetConstellationCenter(boundary) {
    let sum = new Vector(0, 0, 0);
    boundary.forEach((point) => {
      sum = sum.add(this.AltAzToVector(...this.RaDecToAltAz(...point)));
    });
    const [RA, DEC] = this.AltAzToRaDec(...this.VectorToAltAz(sum.unit()));
    return [RadToDeg(RA) / 15, RadToDeg(DEC)];
  }

  GetMaximumDistanceFromCenter(center, boundary) {
    let maximum = 0;
    boundary.forEach((point) => {
      const dist = this.CalculateDistanceRaDec(
        degToRad(center[0] * 15),
        degToRad(center[1]),
        degToRad(point[0] * 15),
        degToRad(point[1])
      );
      if (dist > maximum) maximum = dist;
    });
    return maximum;
  }

  /*UpdateConstellations() {
    for (let i = 0; i < constellations.length; i++) {
      const found = constData.find(
        (el) => el[0].toUpperCase() == constellations[i].abbr.toUpperCase()
      );
      constellations[i].abbr = found[0];
      constellations[i].czech = found[1];
      constellations[i].latin = found[2];
    }
    let all = "";
    constellations.forEach((cons) => {
      all +=
        `const  ${cons.abbr.toUpperCase()} = {latin: "${cons.latin}", czech: "${
          cons.czech
        }", abbr: "` +
        cons.abbr +
        `", center: [${cons.center[0]}, ${cons.center[1]}], ` +
        "maxAngDist: " +
        cons.maxAngDist +
        ", boundary: " +
        cons.abbr.toUpperCase() +
        "_boundary }\n";
    });
    return all;
  }*/
  // For intellisense
  StereographicAltAzToXY(alt, az) {}
  PerspectiveAltAzToXY(alt, az) {}
  LambertAltAzToXY(alt, az) {}
  PerspectiveXYToAltAz(x, y) {}
  StereographicXYToAltAz(x, y) {}
  LambertXYToAltAz(x, y) {}
}
