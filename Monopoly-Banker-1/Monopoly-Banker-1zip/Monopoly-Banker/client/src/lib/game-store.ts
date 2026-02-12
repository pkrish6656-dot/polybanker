import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PROPERTIES } from './monopoly-data';

export interface Player { id: string; name: string; cash: number; color: string; isBankrupt: boolean; }
export interface PropertyState { ownerId: string | null; mortgaged: boolean; houses: number; }
export interface Transaction { id: string; timestamp: number; description: string; amount?: number; from?: string; to?: string; }
export interface GameSettings { freeParkingJackpot: boolean; buyEverything: boolean; startingCash: number; bankCashMode: boolean; }

export interface GameState {
  players: Player[];
  properties: Record<string, PropertyState>;
  bank: { cash: number; houses: number; hotels: number; freeParkingPot: number; };
  settings: GameSettings;
  transactions: Transaction[];
  activePlayerId: string | null;
  turnCount: number;
  addPlayer: (name: string, color: string) => void;
  startGame: (settings: GameSettings) => void;
  resetGame: () => void;
  transferMoney: (from: string, to: string, amount: number, reason: string) => void;
  buyProperty: (playerId: string, propertyId: string, priceOverride?: number, payTo?: string) => void;
  mortgageProperty: (propertyId: string) => void;
  unmortgageProperty: (propertyId: string) => void;
  buildHouse: (propertyId: string, payTo?: string) => void;
  buildHouseFree: (propertyId: string) => void;
  declareBankruptcy: (playerId: string, creditorId: string) => void;
  executeTrade: (trader1Id: string, trader2Id: string, offer1: { cash: number; properties: string[] }, offer2: { cash: number; properties: string[] }) => void;
  nextTurn: () => void;
  addTransaction: (desc: string, amount?: number, from?: string, to?: string) => void;
  undo: () => void;
  history: GameSnapshot[];
}

interface GameSnapshot {
  players: Player[];
  properties: Record<string, PropertyState>;
  bank: { cash: number; houses: number; hotels: number; freeParkingPot: number; };
  transactions: Transaction[];
}

const initProps = () => PROPERTIES.reduce((acc, p) => ({ ...acc, [p.id]: { ownerId: null, mortgaged: false, houses: 0 } }), {} as Record<string, PropertyState>);
const uuid = () => crypto.randomUUID();
const now = () => Date.now();
const saveSnapshot = (s: any) => ({ players: [...s.players], properties: { ...s.properties }, bank: { ...s.bank }, transactions: [...s.transactions] });

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      players: [],
      properties: initProps(),
      bank: { cash: 20580, houses: 32, hotels: 12, freeParkingPot: 0 },
      settings: { freeParkingJackpot: false, buyEverything: false, startingCash: 1500, bankCashMode: false },
      transactions: [],
      activePlayerId: null,
      turnCount: 0,
      history: [],

      addPlayer: (name, color) => set(s => ({
        players: [...s.players, { id: uuid(), name, cash: s.settings.startingCash, color, isBankrupt: false }]
      })),

      startGame: (settings) => set(s => {
        const totalStartingCash = s.players.length * settings.startingCash;
        return {
          settings,
          players: s.players.map(p => ({ ...p, cash: settings.startingCash })),
          properties: initProps(),
          activePlayerId: s.players[0]?.id || null,
          turnCount: 1,
          transactions: [{ id: uuid(), timestamp: now(), description: 'Game Started' }],
          bank: { 
            cash: settings.bankCashMode ? Math.max(0, 20580 - totalStartingCash) : 20580, 
            houses: 32, 
            hotels: 12, 
            freeParkingPot: 0 
          }
        };
      }),

      resetGame: () => set({ players: [], properties: initProps(), transactions: [], activePlayerId: null, turnCount: 0 }),

      addTransaction: (description, amount, from, to) => set(s => ({
        transactions: [{ id: uuid(), timestamp: now(), description, amount, from, to }, ...s.transactions]
      })),

      transferMoney: (fromId, toId, amount, reason) => set(s => {
        let players = [...s.players], bank = { ...s.bank };
        const getName = (id: string) => id === 'BANK' ? 'The Bank' : id === 'FREE_PARKING' ? 'Free Parking' : s.players.find(p => p.id === id)?.name || 'Unknown';
        
        if (fromId === 'BANK') { if (s.settings.bankCashMode) bank.cash -= amount; }
        else if (fromId === 'FREE_PARKING') bank.freeParkingPot = 0;
        else players = players.map(p => p.id === fromId ? { ...p, cash: p.cash - amount } : p);

        if (toId === 'BANK') { if (s.settings.bankCashMode) bank.cash += amount; }
        else if (toId === 'FREE_PARKING') bank.freeParkingPot += amount;
        else players = players.map(p => p.id === toId ? { ...p, cash: p.cash + amount } : p);

        return {
          players, bank,
          history: [saveSnapshot(s), ...s.history.slice(0, 19)],
          transactions: [{ id: uuid(), timestamp: now(), description: `${reason}: ${getName(fromId)} paid $${amount} to ${getName(toId)}`, amount, from: fromId, to: toId }, ...s.transactions]
        };
      }),

      buyProperty: (playerId, propertyId, priceOverride, payTo = 'BANK') => set(s => {
        const prop = PROPERTIES.find(p => p.id === propertyId);
        const player = s.players.find(p => p.id === playerId);
        if (!prop || !player) return s;
        const price = priceOverride ?? prop.price;
        let players = s.players.map(p => p.id === playerId ? { ...p, cash: p.cash - price } : p);
        let bank = { ...s.bank };
        const getPayeeName = () => {
          if (payTo === 'BANK') return 'The Bank';
          if (payTo === 'FREE_PARKING') return 'Free Parking';
          return s.players.find(p => p.id === payTo)?.name || 'Unknown';
        };
        if (payTo === 'FREE_PARKING') bank.freeParkingPot += price;
        else if (payTo !== 'BANK') players = players.map(p => p.id === payTo ? { ...p, cash: p.cash + price } : p);
        return {
          players, bank,
          history: [saveSnapshot(s), ...s.history.slice(0, 19)],
          properties: { ...s.properties, [propertyId]: { ...s.properties[propertyId], ownerId: playerId } },
          transactions: [{ id: uuid(), timestamp: now(), description: `${player.name} bought ${prop.name} for $${price} (paid to ${getPayeeName()})`, amount: price, from: playerId, to: payTo }, ...s.transactions]
        };
      }),

      mortgageProperty: (propertyId) => set(s => {
        const prop = PROPERTIES.find(p => p.id === propertyId);
        const ps = s.properties[propertyId];
        const owner = s.players.find(p => p.id === ps.ownerId);
        if (!prop || !owner) return s;
        return {
          players: s.players.map(p => p.id === owner.id ? { ...p, cash: p.cash + prop.mortgageValue } : p),
          properties: { ...s.properties, [propertyId]: { ...ps, mortgaged: true } },
          transactions: [{ id: uuid(), timestamp: now(), description: `${owner.name} mortgaged ${prop.name} for $${prop.mortgageValue}`, amount: prop.mortgageValue, from: 'BANK', to: owner.id }, ...s.transactions]
        };
      }),

      unmortgageProperty: (propertyId) => set(s => {
        const prop = PROPERTIES.find(p => p.id === propertyId);
        const ps = s.properties[propertyId];
        const owner = s.players.find(p => p.id === ps.ownerId);
        if (!prop || !owner) return s;
        const cost = Math.ceil(prop.mortgageValue * 1.1);
        return {
          players: s.players.map(p => p.id === owner.id ? { ...p, cash: p.cash - cost } : p),
          properties: { ...s.properties, [propertyId]: { ...ps, mortgaged: false } },
          transactions: [{ id: uuid(), timestamp: now(), description: `${owner.name} unmortgaged ${prop.name} for $${cost}`, amount: cost, from: owner.id, to: 'BANK' }, ...s.transactions]
        };
      }),

      buildHouse: (propertyId, payTo = 'BANK') => set(s => {
        const prop = PROPERTIES.find(p => p.id === propertyId);
        const ps = s.properties[propertyId];
        const owner = s.players.find(p => p.id === ps.ownerId);
        if (!prop || !owner || ps.houses >= 5) return s;
        const isHotel = ps.houses === 4;
        let bank = { ...s.bank, houses: isHotel ? s.bank.houses + 4 : s.bank.houses - 1, hotels: isHotel ? s.bank.hotels - 1 : s.bank.hotels };
        let players = s.players.map(p => p.id === owner.id ? { ...p, cash: p.cash - prop.houseCost } : p);
        const getPayeeName = () => {
          if (payTo === 'BANK') return 'The Bank';
          if (payTo === 'FREE_PARKING') return 'Free Parking';
          return s.players.find(p => p.id === payTo)?.name || 'Unknown';
        };
        if (payTo === 'FREE_PARKING') bank.freeParkingPot += prop.houseCost;
        else if (payTo !== 'BANK') players = players.map(p => p.id === payTo ? { ...p, cash: p.cash + prop.houseCost } : p);
        return {
          players, bank,
          history: [saveSnapshot(s), ...s.history.slice(0, 19)],
          properties: { ...s.properties, [propertyId]: { ...ps, houses: ps.houses + 1 } },
          transactions: [{ id: uuid(), timestamp: now(), description: `${owner.name} built a ${isHotel ? 'Hotel' : 'House'} on ${prop.name} (paid to ${getPayeeName()})`, amount: prop.houseCost, from: owner.id, to: payTo }, ...s.transactions]
        };
      }),

      buildHouseFree: (propertyId) => set(s => {
        const prop = PROPERTIES.find(p => p.id === propertyId);
        const ps = s.properties[propertyId];
        const owner = s.players.find(p => p.id === ps.ownerId);
        if (!prop || !owner || ps.houses >= 5) return s;
        const isHotel = ps.houses === 4;
        return {
          history: [saveSnapshot(s), ...s.history.slice(0, 19)],
          properties: { ...s.properties, [propertyId]: { ...ps, houses: ps.houses + 1 } },
          bank: { ...s.bank, houses: isHotel ? s.bank.houses + 4 : s.bank.houses - 1, hotels: isHotel ? s.bank.hotels - 1 : s.bank.hotels },
          transactions: [{ id: uuid(), timestamp: now(), description: `${owner.name} built a ${isHotel ? 'Hotel' : 'House'} on ${prop.name} (FREE)` }, ...s.transactions]
        };
      }),

      declareBankruptcy: (playerId, creditorId) => set(s => {
        const player = s.players.find(p => p.id === playerId);
        if (!player) return s;
        const playerProps = Object.entries(s.properties).filter(([, ps]) => ps.ownerId === playerId).map(([id]) => id);
        let props = { ...s.properties }, players = [...s.players];

        if (creditorId === 'BANK') {
          playerProps.forEach(id => { props[id] = { ownerId: null, mortgaged: false, houses: 0 }; });
        } else {
          playerProps.forEach(id => { props[id] = { ...props[id], ownerId: creditorId }; });
          players = players.map(p => p.id === creditorId ? { ...p, cash: p.cash + player.cash } : p);
        }
        players = players.map(p => p.id === playerId ? { ...p, isBankrupt: true, cash: 0 } : p);
        const creditorName = creditorId === 'BANK' ? 'The Bank' : s.players.find(p => p.id === creditorId)?.name || 'Unknown';
        return {
          players, properties: props,
          history: [saveSnapshot(s), ...s.history.slice(0, 19)],
          transactions: [{ id: uuid(), timestamp: now(), description: `${player.name} declared bankruptcy! Assets to ${creditorName}.` }, ...s.transactions]
        };
      }),

      executeTrade: (t1Id, t2Id, offer1, offer2) => set(s => {
        let players = [...s.players], props = { ...s.properties };
        const p1 = s.players.find(p => p.id === t1Id);
        const p2 = s.players.find(p => p.id === t2Id);
        if (!p1 || !p2) return s;

        // Cash transfers
        players = players.map(p => {
          if (p.id === t1Id) return { ...p, cash: p.cash - offer1.cash + offer2.cash };
          if (p.id === t2Id) return { ...p, cash: p.cash - offer2.cash + offer1.cash };
          return p;
        });

        // Property transfers
        offer1.properties.forEach(pid => { props[pid] = { ...props[pid], ownerId: t2Id }; });
        offer2.properties.forEach(pid => { props[pid] = { ...props[pid], ownerId: t1Id }; });

        const desc = `Trade: ${p1.name} and ${p2.name} swapped assets.`;
        return {
          players, properties: props,
          history: [saveSnapshot(s), ...s.history.slice(0, 19)],
          transactions: [{ id: uuid(), timestamp: now(), description: desc }, ...s.transactions]
        };
      }),

      nextTurn: () => set(s => {
        const idx = s.players.findIndex(p => p.id === s.activePlayerId);
        const next = s.players[(idx + 1) % s.players.length];
        return {
          activePlayerId: next.id,
          turnCount: s.turnCount + 1,
          transactions: [{ id: uuid(), timestamp: now(), description: `Start of ${next.name}'s turn` }, ...s.transactions]
        };
      }),

      undo: () => set(s => {
        if (s.history.length === 0) return s;
        const [prev, ...rest] = s.history;
        return {
          players: prev.players,
          properties: prev.properties,
          bank: prev.bank,
          transactions: prev.transactions,
          history: rest
        };
      })
    }),
    { name: 'monopoly-storage' }
  )
);
