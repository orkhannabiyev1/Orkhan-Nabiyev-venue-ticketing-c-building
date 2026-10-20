const MAP_CENTER = { x: 650, y: -560 };

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

const legend = document.getElementById("legend");

function renderStage() {
  const stage = document.createElement("div");
  stage.className = "stage";
  stage.textContent = "Stage";
  mapContent.appendChild(stage);
}

function addLegendItem(text, color, extraClass) {
  const item = document.createElement("li");
  const swatch = document.createElement("span");
  swatch.className = "legend-swatch" + (extraClass ? " " + extraClass : "");
  if (color) {
    swatch.style.backgroundColor = color;
  }
  item.appendChild(swatch);
  item.appendChild(document.createTextNode(text));
  legend.appendChild(item);
}

function renderLegend() {
  Object.values(VENUE.categories).forEach(function (category) {
    addLegendItem(
      category.label + " (" + category.price + " " + VENUE.currency + ")",
      category.color
    );
  });
  addLegendItem("Unavailable", null, "unavailable");
}

renderStage();
renderLegend();



function addRowLabel(text, seat, offsetX) {
  const label = document.createElement("span");
  label.className = "row-label";
  label.textContent = text;
  label.style.left = (seat.x + offsetX) + "px";
  label.style.top = seat.y + "px";
  mapContent.appendChild(label);
}

function renderRowLabels() {
  const rows = {};

  SEATS.forEach(function (seat) {
    if (!rows[seat.row]) {
      rows[seat.row] = [];
    }
    rows[seat.row].push(seat);
  });

  Object.keys(rows).forEach(function (rowLabel) {
    const seats = rows[rowLabel];
    addRowLabel(rowLabel, seats[0], -26);
    addRowLabel(rowLabel, seats[seats.length - 1], 26);
  });
}

renderRowLabels();



const seatInfo = document.getElementById("seat-info");
const seatInfoEmpty = document.getElementById("seat-details-empty");

let inspectedSeatId = null;

function findSeat(seatId) {
  return SEATS.find(function (seat) {
    return seat.id === seatId;
  });
}

function getSeatButton(seatId) {
  return mapContent.querySelector('[data-seat-id="' + seatId + '"]');
}

function showSeatDetails(seat) {
  document.getElementById("info-seat").textContent = seat.id;
  document.getElementById("info-zone").textContent = seat.zoneLabel;
  document.getElementById("info-row").textContent = seat.row;
  document.getElementById("info-number").textContent = seat.number;
  document.getElementById("info-price").textContent = seat.price + " " + VENUE.currency;
  document.getElementById("info-status").textContent =
    seat.status === "unavailable" ? "Unavailable" : "Available";

  seatInfoEmpty.hidden = true;
  seatInfo.hidden = false;
}

function inspectSeat(seatId) {
  if (inspectedSeatId) {
    getSeatButton(inspectedSeatId).classList.remove("inspected");
  }

  inspectedSeatId = seatId;
  getSeatButton(seatId).classList.add("inspected");
  showSeatDetails(findSeat(seatId));
}

mapContent.addEventListener("click", function (event) {
  const button = event.target.closest(".seat");
  if (!button) {
    return;
  }
  inspectSeat(button.dataset.seatId);
});