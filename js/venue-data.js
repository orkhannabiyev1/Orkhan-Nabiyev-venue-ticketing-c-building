const VENUE = {
  name: "C Building Auditorium",
  currency: "₼",
  seatSize: 22,

  categories: {
    premium:  { label: "Premium",  price: 25, color: "#7F77DD" },
    standard: { label: "Standard", price: 15, color: "#1D9E75" },
    balcony:  { label: "Balcony",  price: 10, color: "#BA7517" }
  },

  zones: [
    {
      id: "premium",
      category: "premium",
      startAngle: -68,
      angleStep: 4.4,
      aisleGap: 11,
      blockSeats: [6, 12, 8],
      rows: [
        { label: "A", radius: 340 },
        { label: "B", radius: 376 },
        { label: "C", radius: 412 }
      ]
    },
    {
      id: "standard",
      category: "standard",
      startAngle: -68,
      angleStep: 4.4,
      aisleGap: 11,
      blockSeats: [6, 12, 8],
      rows: [
        { label: "D", radius: 470 },
        { label: "E", radius: 506 },
        { label: "F", radius: 542 },
        { label: "G", radius: 578 },
        { label: "H", radius: 614 }
      ]
    },
    {
      id: "balcony",
      category: "balcony",
      startAngle: -31.2,
      angleStep: 2.6,
      aisleGap: 0,
      blockSeats: [24],
      rows: [
        { label: "I", radius: 700 },
        { label: "J", radius: 736 }
      ]
    }
  ],

  unavailable: [
    "A-8", "A-9", "B-2", "B-15", "C-4", "C-22",
    "D-9", "E-18", "E-19", "E-23", "F-3", "F-14",
    "G-1", "G-20", "H-5", "H-24",
    "I-4", "I-5", "I-13", "J-16", "J-21"
  ]
};