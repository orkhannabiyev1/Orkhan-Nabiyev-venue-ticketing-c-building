const MAP_CENTER = { x: 650, y: 40 };

function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

function getSeatPosition(radius, angleDeg) {
  const angle = toRadians(angleDeg);
  return {
    x: MAP_CENTER.x + radius * Math.sin(angle),
    y: MAP_CENTER.y + radius * Math.cos(angle)
  };
}

function buildSeats() {
  const seats = [];

  VENUE.zones.forEach(function (zone) {
    const category = VENUE.categories[zone.category];

    zone.rows.forEach(function (row) {
      let angle = zone.startAngle;
      let seatNumber = 1;

      zone.blockSeats.forEach(function (count) {
        for (let i = 0; i < count; i++) {
          const id = row.label + "-" + seatNumber;
          const position = getSeatPosition(row.radius, angle);

          seats.push({
            id: id,
            row: row.label,
            number: seatNumber,
            zoneId: zone.id,
            zoneLabel: category.label,
            price: category.price,
            color: category.color,
            x: position.x,
            y: position.y,
            status: VENUE.unavailable.includes(id) ? "unavailable" : "available"
          });

          angle += zone.angleStep;
          seatNumber++;
        }
        angle += zone.aisleGap;
      });
    });
  });

  return seats;
}

const SEATS = buildSeats();


const mapContent = document.getElementById("map-content");

function renderSeats() {
  SEATS.forEach(function (seat) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "seat " + seat.status;
    button.dataset.seatId = seat.id;
    button.style.left = seat.x + "px";
    button.style.top = seat.y + "px";
    button.style.setProperty("--seat-color", seat.color);
    button.setAttribute(
      "aria-label",
      "Row " + seat.row + ", seat " + seat.number + ", " +
      seat.zoneLabel + ", " + seat.price + " " + VENUE.currency + ", " + seat.status
    );
    mapContent.appendChild(button);
  });
}

renderSeats();