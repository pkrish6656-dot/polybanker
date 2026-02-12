export type PropertyColor = 'brown' | 'lightBlue' | 'pink' | 'orange' | 'red' | 'yellow' | 'green' | 'blue' | 'railroad' | 'purple' | 'utility';

export interface Property {
  id: string;
  name: string;
  color: PropertyColor;
  price: number;
  rent: number[];
  houseCost: number;
  mortgageValue: number;
  groupSize: number;
  buyEverythingOnly?: boolean;
}

export const PROPERTIES: Property[] = [
  { id: 'mediterranean', name: 'Mediterranean Ave', color: 'brown', price: 60, rent: [2, 10, 30, 90, 160, 250], houseCost: 50, mortgageValue: 30, groupSize: 2 },
  { id: 'baltic', name: 'Baltic Ave', color: 'brown', price: 60, rent: [4, 20, 60, 180, 320, 450], houseCost: 50, mortgageValue: 30, groupSize: 2 },
  
  { id: 'reading_rr', name: 'Reading Railroad', color: 'railroad', price: 200, rent: [25, 50, 100, 200], houseCost: 0, mortgageValue: 100, groupSize: 4 },
  
  { id: 'oriental', name: 'Rhode Island Ave', color: 'lightBlue', price: 100, rent: [6, 30, 90, 270, 400, 550], houseCost: 50, mortgageValue: 50, groupSize: 3 },
  { id: 'vermont', name: 'Vermont Ave', color: 'lightBlue', price: 100, rent: [6, 30, 90, 270, 400, 550], houseCost: 50, mortgageValue: 50, groupSize: 3 },
  { id: 'connecticut', name: 'Connecticut Ave', color: 'lightBlue', price: 120, rent: [8, 40, 100, 300, 450, 600], houseCost: 50, mortgageValue: 60, groupSize: 3 },
  
  { id: 'st_charles', name: 'St. Charles Place', color: 'pink', price: 140, rent: [10, 50, 150, 450, 625, 750], houseCost: 100, mortgageValue: 70, groupSize: 3 },
  { id: 'electric_co', name: 'Electric Company', color: 'utility', price: 150, rent: [], houseCost: 0, mortgageValue: 75, groupSize: 2 },
  { id: 'states', name: 'States Ave', color: 'pink', price: 140, rent: [10, 50, 150, 450, 625, 750], houseCost: 100, mortgageValue: 70, groupSize: 3 },
  { id: 'virginia', name: 'Virginia Ave', color: 'pink', price: 160, rent: [12, 60, 180, 500, 700, 900], houseCost: 100, mortgageValue: 80, groupSize: 3 },
  
  { id: 'pennsylvania_rr', name: 'Pennsylvania Railroad', color: 'railroad', price: 200, rent: [25, 50, 100, 200], houseCost: 0, mortgageValue: 100, groupSize: 4 },

  { id: 'st_james', name: 'St. James Place', color: 'orange', price: 180, rent: [14, 70, 200, 550, 750, 950], houseCost: 100, mortgageValue: 90, groupSize: 3 },
  { id: 'tennessee', name: 'Tennessee Ave', color: 'orange', price: 180, rent: [14, 70, 200, 550, 750, 950], houseCost: 100, mortgageValue: 90, groupSize: 3 },
  { id: 'new_york', name: 'New York Ave', color: 'orange', price: 200, rent: [16, 80, 220, 600, 800, 1000], houseCost: 100, mortgageValue: 100, groupSize: 3 },
  
  { id: 'kentucky', name: 'Kentucky Ave', color: 'red', price: 220, rent: [18, 90, 250, 700, 875, 1050], houseCost: 150, mortgageValue: 110, groupSize: 3 },
  { id: 'indiana', name: 'Indiana Ave', color: 'red', price: 220, rent: [18, 90, 250, 700, 875, 1050], houseCost: 150, mortgageValue: 110, groupSize: 3 },
  { id: 'illinois', name: 'Illinois Ave', color: 'red', price: 240, rent: [20, 100, 300, 750, 925, 1100], houseCost: 150, mortgageValue: 120, groupSize: 3 },
  
  { id: 'b_o_rr', name: 'B. & O. Railroad', color: 'railroad', price: 200, rent: [25, 50, 100, 200], houseCost: 0, mortgageValue: 100, groupSize: 4 },

  { id: 'atlantic', name: 'Atlantic Ave', color: 'yellow', price: 260, rent: [22, 110, 330, 800, 975, 1150], houseCost: 150, mortgageValue: 130, groupSize: 3 },
  { id: 'ventnor', name: 'Ventnor Ave', color: 'yellow', price: 260, rent: [22, 110, 330, 800, 975, 1150], houseCost: 150, mortgageValue: 130, groupSize: 3 },
  { id: 'water_works', name: 'Water Works', color: 'utility', price: 150, rent: [], houseCost: 0, mortgageValue: 75, groupSize: 2 },
  { id: 'marvin', name: 'Marvin Gardens', color: 'yellow', price: 280, rent: [24, 120, 360, 850, 1025, 1200], houseCost: 150, mortgageValue: 140, groupSize: 3 },
  
  { id: 'pacific', name: 'Pacific Ave', color: 'green', price: 300, rent: [26, 130, 390, 900, 1100, 1275], houseCost: 200, mortgageValue: 150, groupSize: 3 },
  { id: 'north_carolina', name: 'North Carolina Ave', color: 'green', price: 300, rent: [26, 130, 390, 900, 1100, 1275], houseCost: 200, mortgageValue: 150, groupSize: 3 },
  { id: 'pennsylvania', name: 'Pennsylvania Ave', color: 'green', price: 320, rent: [28, 150, 450, 1000, 1200, 1400], houseCost: 200, mortgageValue: 160, groupSize: 3 },
  
  { id: 'short_line', name: 'Short Line', color: 'railroad', price: 200, rent: [25, 50, 100, 200], houseCost: 0, mortgageValue: 100, groupSize: 4 },

  { id: 'park_place', name: 'Park Place', color: 'blue', price: 350, rent: [35, 175, 500, 1100, 1300, 1500], houseCost: 200, mortgageValue: 175, groupSize: 2 },
  { id: 'boardwalk', name: 'Boardwalk', color: 'blue', price: 400, rent: [50, 200, 600, 1400, 1700, 2000], houseCost: 200, mortgageValue: 200, groupSize: 2 },
  
  { id: 'jail', name: 'Jail', color: 'purple', price: 125, rent: [50], houseCost: 0, mortgageValue: 250, groupSize: 1, buyEverythingOnly: true },
  { id: 'just visiting', name: 'Just Visiting', color: 'purple', price: 125, rent: [40], houseCost: 0, mortgageValue: 250, groupSize: 1, buyEverythingOnly: true },
  { id: 'free_parking_spot', name: 'Free Parking Square', color: 'purple', price: 125, rent: [50], houseCost: 0, mortgageValue: 250, groupSize: 1, buyEverythingOnly: true },
  { id: 'go_square', name: 'GO Square', color: 'purple', price: 125, rent: [200], houseCost: 0, mortgageValue: 500, groupSize: 1, buyEverythingOnly: true },
  { id: 'income_tax', name: 'Income Tax Square', color: 'purple', price: 200, rent: [25], houseCost: 0, mortgageValue: 100, groupSize: 1, buyEverythingOnly: true },
  { id: 'luxury_tax', name: 'Luxury Tax Square', color: 'purple', price: 200, rent: [100], houseCost: 0, mortgageValue: 100, groupSize: 1, buyEverythingOnly: true },
];

export const STANDARD_PROPERTIES = PROPERTIES.filter(p => !p.buyEverythingOnly);
