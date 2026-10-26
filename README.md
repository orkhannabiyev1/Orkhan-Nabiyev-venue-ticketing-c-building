Orkhan-Nabiyev-venue-ticketing-c-building

A front-end web application for seat selection, designed for the large auditorium in the university's Building C. Visitors can view an interactive seating map, check the details and pricing for individual seats, and select their tickets. The project is built using only pure HTML, CSS, and JavaScript—without any frameworks, back-end systems, or specialized build processes.

Status
In progress. The construction of the seating map, dynamic generation, and the display of seat details are complete; work is ongoing regarding map navigation, the shopping cart functionality, and data persistence.

Venue

The venue is designed based on the large auditorium in Building C at ADA University.

![alt text](image.png)

Total: 256 seats, of which 21 are unavailable (already sold).


Implemented Features

- The venue map is generated dynamically, entirely based on JavaScript data; seats are not hard-coded in HTML (they are auto-generated).
- Curved rows arranged in three blocks, with aisles running in straight lines. - The stage and row labels at both ends of each row are present
- A color legend based on price categories
- Each seat is an actual `<button>` element, allowing the map to be navigated using both a mouse and a keyboard
- Seat information: clicking a seat displays its ID, zone, row, number, price, and status
- Seat statuses: empty (available), selected (being viewed), and occupied (unavailable)
- Accessibility: each seat includes a descriptive `aria-label`, while selected seats feature an `aria-current` attribute


Under Development

- Zooming, panning (four-way movement), and "Reset" / "Center" functions
- "Shopping Cart" functionality: adding items, removing items, preventing duplicate seat selection, and calculating the total price
- Storing the cart in `localStorage` and restoring seat statuses after a page refresh
- Fully responsive design
- Zooming via mouse wheel and panning via drag-and-drop (additional feature)

Getting Started

No installation is required. Clone the repository and open the `index.html` file in a modern browser. Alternatively, you can run the folder via a local server, such as the "Live Server" extension for VS Code.


git clone https://github.com/orkhannabiyev1/Orkhan-Nabiyev-venue-ticketing-c-building.git



Project Structure

index.html page structure: map area, seat details, cart
css/style.css design, seat statuses, color legend, stage
js/venue-data.js venue model: zones, rows, prices, occupied seats
js/app.js seat generation, visualization, and interaction


How it works

Data model.
 The `VENUE` object is defined in the `js/venue-data.js` file. Price categories (name, price, color) are defined once; zones refer to these categories by their names. As a result, any changes to the price are automatically reflected in the map, color key, and seat details. Each zone contains its own rows; these rows are defined by parameters such as radius, number of seats per block (e.g., `[6, 12, 8]`), angle between seats, and transition spaces. Non-existent seats are stored as a list of seat identifiers (IDs), such as "A-8".

Seat Creation.
 Rows are arcs around a common center point. The `getSeatPosition` function uses the `Math.sin` and `Math.cos` methods to convert radius and angle values ​​to `x` and `y` coordinates. The `buildSeats` function iterates over zones, rows, blocks, and seats, creating a separate object for each; these objects contain the seat ID, price, color, position, and status. The `renderSeats` function then creates a `<button>` element for each seat. Seats in the same column in different rows have the same angle value, which ensures that the transitions between zones are aligned in a straight line.

Interactivity.
 A single click event listener added to the map container uses event delegation to detect the seat that was clicked, mark it as "selected", and display it in the ``Seat Details'' panel.