const app = new PIXI.Application({ width: 1000, height: 1000 });
let [lastX, lastY] = [null, null];

let obs = new Observer();

app.view.onwheel = (e) => {
  e.preventDefault();
  if (e.deltaY > 0) {
    if (obs.fov >= degToRad(140) / 1.1) {
      obs.ChangeSettings({ fov: degToRad(140) });
    } else {
      obs.ChangeSettings({ fov: obs.fov * 1.1 });
    }
  } else {
    obs.ChangeSettings({ fov: obs.fov / 1.2 });
  }
  drawStars();
};

function getXYFromEvent(canvas, event) {
  const rect = canvas.getBoundingClientRect();

  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  x -= app.view.width / 2;
  x /= app.view.width;
  y -= app.view.height / 2;
  y /= -app.view.height;
  return [x, y];
}

app.view.onmousedown = (e) => {
  [lastX, lastY] = getXYFromEvent(app.view, e);
};

app.view.onmousemove = (e) => {
  if (lastX === null || lastY === null) return;
  [newX, newY] = getXYFromEvent(app.view, e);
  obs.UpdateAltAZ(
    (lastY - newY) * obs.fov,
    (lastX - newX) * obs.fov * (1 + Math.abs(Math.sin(obs.alt)))
  );
  //writeDebug();
  drawStars();
  [lastX, lastY] = [newX, newY];
};

app.view.onmouseup = app.view.onmouseleave = (e) => {
  [lastX, lastY] = [null, null];
};

function drawStars() {
  app.stage.removeChildren();
  const stars = new PIXI.Graphics();
  hvezdy.forEach((hvezda) => {
    if (hvezda.Mag > (1 - obs.fov / 180) * 7) {
    } else {
      //const [x, y] = obs.AltAzToXYDeg(hvezda.Dec, (hvezda.RA / 24) * 360);
      const [alt, az] = obs.RaDecToAltAz(hvezda.RA, hvezda.Dec);
      let color;
      if (alt > 0) {
        color = "#FFFFFF";
      } else {
        color = "#555555";
      }
      const [x, y] = obs.AltAzToXY(alt, az);
      if (x != null && y != null) {
        if (x > -0.5 && x < 0.5 && y > -0.5 && y < 0.5) {
          stars.lineStyle({ width: 0 });
          stars.beginFill(color);
          stars.drawCircle(
            app.view.width / 2 + x * app.view.width,
            app.view.height / 2 - y * app.view.height,
            (1 - obs.fov / 180) * 7 - hvezda.Mag,
            0,
            2 * Math.PI
          );
        }
      }
    }
  });
  app.stage.addChild(stars);
}

drawStars();

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);
