# Interactive Venue Ticketing System: C Building Auditorium

A front-end web application for seat selection, designed for the large auditorium in Building C at ADA University. Visitors can view an interactive seating map, inspect the details and price of individual seats, and (soon) add tickets to a cart. The project is built with plain HTML, CSS and JavaScript, with no frameworks, back end or build tools.

## Status

In progress. The seat map, dynamic seat generation and the seat details panel are done. Map navigation, the shopping cart and data persistence are still being built.

## Venue

The venue is modelled on the large auditorium in Building C at ADA University.

![Zones and prices of the C Building Auditorium](assets/venue-map.png)

| Zone | Rows | Price |
|------|------|-------|
| Premium | A–C | 25 ₼ |
| Standard | D–H | 15 ₼ |
| Balcony | I–J | 10 ₼ |

Total: 256 seats, of which 21 are unavailable (already sold).

## Implemented features

- The venue map is generated from JavaScript data. Seats are not hard-coded in the HTML.
- Curved rows arranged in blocks, with aisles that line up in straight lines.
- A stage and row labels at both ends of each row.
- A colour legend based on price categories.
- Every seat is a real `<button>`, so the map works with both mouse and keyboard.
- Clicking a seat only inspects it: the panel shows its ID, zone, row, number, price and status.
- Seat states: available, inspected and unavailable (in cart is coming with the cart).
- Accessibility: each seat has a descriptive `aria-label`, and the inspected seat has `aria-current`.

## Under development

- Zoom in/out, four-direction movement and Reset / Center view.
- Cart: add to cart, remove, no duplicate seats, total price.
- Saving the cart in `localStorage` and restoring seat states after a reload.
- Fully responsive layout.
- Bonus: mouse wheel zoom and click-and-drag panning.

## Getting started

No installation is needed. Clone the repository and open `index.html` in a modern browser, or serve the folder with a local server such as the VS Code "Live Server" extension.

```bash
git clone https://github.com/orkhannabiyev1/Orkhan-Nabiyev-venue-ticketing-c-building.git
```

## Project structure

| File | Purpose |
|------|---------|
| `index.html` | Page structure: map area, seat details, cart |
| `css/style.css` | Layout, seat states, legend, stage |
| `js/venue-data.js` | Venue model: zones, rows, prices, unavailable seats |
| `js/app.js` | Seat generation, rendering and interaction |

## How it works

**Data model.** The `VENUE` object lives in `js/venue-data.js`. Price categories (label, price, colour) are defined once and zones refer to them by name, so a price change updates the map, the legend and the seat details. Each zone defines its rows by radius, seats per block (for example `[6, 12, 8]`), angle step and aisle gap. Unavailable seats are stored as a list of seat IDs such as `"A-8"`.

**Seat generation.** Rows are arcs around a common centre point. `getSeatPosition` uses `Math.sin` and `Math.cos` to turn a radius and an angle into `x` and `y` coordinates. `buildSeats` loops over zones, rows, blocks and seats and creates one object per seat with its ID, price, colour, position and status. `renderSeats` then creates a `<button>` for each seat. Seats in the same column of different rows share the same angle, which keeps the aisles straight.

**Interaction.** One click listener on the map container uses event delegation to find the clicked seat, mark it as inspected and show it in the seat details panel.