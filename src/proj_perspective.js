Observer.prototype.PerspectiveAltAzToXY = function (alt, az) {
  const S = this.AltAzToVector(alt, az);
  // calculate intersection of the observer plane and line through S
  // Plane (this.): dist = x Odir.x + y Odir.y + z Odir.z
  // Line: x/S.x = y/S.y = z/S.z
  const P = new Vector(
    this.dist / (this.Odir.x + (this.Odir.y * S.y + this.Odir.z * S.z) / S.x),
    (this.dist * S.y) /
      (this.Odir.x * S.x + this.Odir.y * S.y + this.Odir.z * S.z),
    (this.dist * S.z) /
      (this.Odir.x * S.x + this.Odir.y * S.y + this.Odir.z * S.z)
  );
  if (P.angleTo(S) == Math.PI) return [null, null]; // The line passes first through origin
  // Now we want to project P onto Ox and Oy
  // The lengths of the projected vectors are the x and y values
  // So we only care about the scalar projection
  const x = P.length() * Math.cos(P.angleTo(this.Ox));
  const y = P.length() * Math.cos(P.angleTo(this.Oy));
  return [x, y];
};

Observer.prototype.PerspectiveXYToAltAz = function (x, y) {
  // O + x * Ox + y * Oy
  const P = this.O.add(this.Ox.multiply(x)).add(this.Oy.multiply(y));
  // Now we need to nomralize it, so that we get a point on a unit sphere
  const solution = P.unit();
  const alt = Math.asin(solution.z);
  const az1 = Math.acos(solution.x / Math.cos(alt));
  const az2 = Math.asin(solution.y / Math.cos(alt));
  return [alt, az2 > 0 ? az1 : 2 * Math.PI - az1];
};

Observer.prototype.StereographicAltAzToXY = function (alt, az) {
  // Inefficient (everything is)
  const S = this.AltAzToVector(alt, az)
    .multiply(-1)
    .rotateAround(this.Odir, -this.az + Math.PI / 2)
    .rotateAround(
      new Vector(0, 0, -1).cross(this.Odir),
      Math.PI / 2 - this.alt
    );
  const x = S.x / (1 - S.z);
  const y = S.y / (1 - S.z);

  const factor = 1.15 * (degToRad(100) / this.fov); // Very hacky, figure out the math!!
  return [x * factor, y * factor];
};

Observer.prototype.StereographicXYToAltAz = function (x, y) {
  const factor = 1.15 * (degToRad(100) / this.fov);
  x = x / factor;
  y = y / factor;

  const S = new Vector(
    (2 * x) / (1 + x * x + y * y),
    (2 * y) / (1 + x * x + y * y),
    (-1 + x * x + y * y) / (1 + x * x + y * y)
  )
    .rotateAround(
      new Vector(0, 0, -1).cross(this.Odir),
      -(Math.PI / 2 - this.alt)
    )
    .rotateAround(this.Odir, -(-this.az + Math.PI / 2))
    .multiply(-1);
  return this.VectorToAltAz(S);
};

Observer.prototype.LambertAltAzToXY = function (alt, az) {
  // Inefficient (everything is)
  const S = this.AltAzToVector(alt, az)
    .multiply(-1)
    .rotateAround(this.Odir, -this.az + Math.PI / 2)
    .rotateAround(
      new Vector(0, 0, -1).cross(this.Odir),
      Math.PI / 2 - this.alt
    );
  const x = S.x * Math.sqrt(2 / (1 - S.z));
  const y = S.y * Math.sqrt(2 / (1 - S.z));

  const factor = 1 * (degToRad(100) / this.fov); // Very hacky, figure out the math!!
  return [x * factor, y * factor];
};

Observer.prototype.LambertXYToAltAz = function (x, y) {
  const factor = 1 * (degToRad(100) / this.fov);
  x = x / factor;
  y = y / factor;

  const S = new Vector(
    x * Math.sqrt(1 - (x * x + y * y) / 4),
    y * Math.sqrt(1 - (x * x + y * y) / 4),
    -1 + (x * x + y * y) / 4
  )
    .rotateAround(
      new Vector(0, 0, -1).cross(this.Odir),
      -(Math.PI / 2 - this.alt)
    )
    .rotateAround(this.Odir, -(-this.az + Math.PI / 2))
    .multiply(-1);
  return this.VectorToAltAz(S);
};
