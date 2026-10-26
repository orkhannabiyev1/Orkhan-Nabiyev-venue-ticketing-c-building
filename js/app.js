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
  addLegendItem("Inspected", null, "inspected");
  
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
    const previous = getSeatButton(inspectedSeatId);
    previous.classList.remove("inspected");
    previous.removeAttribute("aria-current");
  }

  inspectedSeatId = seatId;
  const current = getSeatButton(seatId);
  current.classList.add("inspected");
  current.setAttribute("aria-current", "true");
  showSeatDetails(findSeat(seatId));
}

mapContent.addEventListener("click", function (event) {
  const button = event.target.closest(".seat");
  if (!button) {
    return;
  }
  inspectSeat(button.dataset.seatId);
});

const MAP_WIDTH = 1300;
const MAP_HEIGHT = 600;
const MOVE_STEP = 60;
const KEEP_VISIBLE = 150;
const DEFAULT_VIEW = { scale: 0.7, x: 0, y: 0 };
const view = { ...DEFAULT_VIEW };

const mapViewport = document.getElementById("map-viewport");

function clampView() {
  const viewportWidth = mapViewport.clientWidth;
  const viewportHeight = mapViewport.clientHeight;
  const scaledWidth = MAP_WIDTH * view.scale;
  const scaledHeight = MAP_HEIGHT * view.scale;

  const minX = KEEP_VISIBLE - scaledWidth;
  const maxX = viewportWidth - KEEP_VISIBLE;
  const minY = KEEP_VISIBLE - scaledHeight;
  const maxY = viewportHeight - KEEP_VISIBLE;

  view.x = Math.min(maxX, Math.max(minX, view.x));
  view.y = Math.min(maxY, Math.max(minY, view.y));
}

function applyView() {
  clampView();
  mapContent.style.transform =
    "translate(" + view.x + "px, " + view.y + "px) scale(" + view.scale + ")";
}


const MIN_SCALE = 0.4;
const MAX_SCALE = 2;
const ZOOM_STEP = 0.1;

function setScale(newScale) {
  if (newScale < MIN_SCALE) {
    newScale = MIN_SCALE;
  }
  if (newScale > MAX_SCALE) {
    newScale = MAX_SCALE;
  }
  view.scale = Math.round(newScale * 100) / 100;
  applyView();
}

document.getElementById("zoom-in").addEventListener("click", function () {
  setScale(view.scale + ZOOM_STEP);
});

document.getElementById("zoom-out").addEventListener("click", function () {
  setScale(view.scale - ZOOM_STEP);
});

function resetView() {
  view.scale = DEFAULT_VIEW.scale;
  view.x = DEFAULT_VIEW.x;
  view.y = DEFAULT_VIEW.y;
  applyView();
}

document.getElementById("reset-view").addEventListener("click", resetView);





function moveView(dx, dy) {
  view.x += dx;
  view.y += dy;
  applyView();
}

document.getElementById("move-up").addEventListener("click", function () {
  moveView(0, -MOVE_STEP);
});
document.getElementById("move-down").addEventListener("click", function () {
  moveView(0, MOVE_STEP);
});
document.getElementById("move-left").addEventListener("click", function () {
  moveView(-MOVE_STEP, 0);
});
document.getElementById("move-right").addEventListener("click", function () {
  moveView(MOVE_STEP, 0);
});


const cart = [];

const addToCartButton = document.getElementById("add-to-cart");
const cartEmpty = document.getElementById("cart-empty");
const cartList = document.getElementById("cart-list");
const cartTotal = document.getElementById("cart-total");

function updateAddButton() {
  const seat = findSeat(inspectedSeatId);
  if (!seat) {
    addToCartButton.disabled = true;
    addToCartButton.textContent = "Add to cart";
  } else if (seat.status === "unavailable") {
    addToCartButton.disabled = true;
    addToCartButton.textContent = "Unavailable";
  } else if (cart.includes(seat.id)) {
    addToCartButton.disabled = true;
    addToCartButton.textContent = "Already in cart";
  } else {
    addToCartButton.disabled = false;
    addToCartButton.textContent = "Add to cart";
  }
}

function renderCart() {
  cartList.innerHTML = "";
  let total = 0;

  cart.forEach(function (seatId) {
    const seat = findSeat(seatId);
    const item = document.createElement("li");
    item.textContent =
      "Row " + seat.row + ", seat " + seat.number + " - " +
      seat.price + " " + VENUE.currency;
    cartList.appendChild(item);
    total += seat.price;
  });

  cartTotal.textContent = total + " " + VENUE.currency;
  cartEmpty.hidden = cart.length > 0;
}

function addToCart(seatId) {
  const seat = findSeat(seatId);
  if (!seat) return;
  if (seat.status === "unavailable") return;
  if (cart.includes(seatId)) return;

  cart.push(seatId);
  renderCart();
  updateAddButton();
}

addToCartButton.addEventListener("click", function () {
  addToCart(inspectedSeatId);
});

mapContent.addEventListener("click", updateAddButton);

renderCart();