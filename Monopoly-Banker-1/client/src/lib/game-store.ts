import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PROPERTIES, Property } from './monopoly-data';

export interface Player {
  id: string;
  name: string;
  cash: number;
  color: string;
  isBankrupt: boolean;
}

export interface PropertyState {
  ownerId: string | null; // null = Bank
  mortgaged: boolean;
  houses: number; // 5 = Hotel
}

export interface Transaction {
  id: string;
  timestamp: number;
  description: string;
  amount?: number;
  from?: string; // Player ID or 'BANK'
  to?: string; // Player ID or 'BANK' or 'FREE_PARKING'
}

export interface GameSettings {
  freeParkingJackpot: boolean;
  buyEverything: boolean;
  startingCash: number;
  bankCashMode: boolean; // false = unlimited, true = tracked
}

export interface GameState {
  players: Player[];
  properties: Record<string, PropertyState>; // PropertyID -> State
  bank: {
    cash: number;
    houses: number;
    hotels: number;
    freeParkingPot: number;
  };
  settings: GameSettings;
  transactions: Transaction[];
  activePlayerId: string | null;
  turnCount: number;
  
  // Actions
  addPlayer: (name: string, color: string) => void;
  startGame: (settings: GameSettings) => void;
  resetGame: () => void;
  
  // Money
  transferMoney: (from: string, to: string, amount: number, reason: string) => void;
  
  // Property
  buyProperty: (playerId: string, propertyId: string, priceOverride?: number) => void;
  mortgageProperty: (propertyId: string) => void;
  unmortgageProperty: (propertyId: string) => void;
  buildHouse: (propertyId: string) => void;
  sellHouse: (propertyId: string) => void;
  
  // Turn
  nextTurn: () => void;
  
  // Ledger
  addTransaction: (desc: string, amount?: number, from?: string, to?: string) => void;
}

// Initial Property States
const getInitialPropertyStates = () => PROPERTIES.reduce((acc, prop) => {
  acc[prop.id] = { ownerId: null, mortgaged: false, houses: 0 };
  return acc;
}, {} as Record<string, PropertyState>);

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      players: [],
      properties: getInitialPropertyStates(),
      bank: {
        cash: 20580, // Classic monopoly bank amount
        houses: 32,
        hotels: 12,
        freeParkingPot: 0,
      },
      settings: {
        freeParkingJackpot: false,
        buyEverything: false,
        startingCash: 1500,
        bankCashMode: false,
      },
      transactions: [],
      activePlayerId: null,
      turnCount: 0,

      addPlayer: (name, color) => set((state) => ({
        players: [...state.players, {
          id: crypto.randomUUID(),
          name,
          cash: state.settings.startingCash, // This might need to be set at start
          color,
          isBankrupt: false
        }]
      })),

      startGame: (settings) => set((state) => {
        // Reset properties
        const resetProps = getInitialPropertyStates();
        
        // Give starting cash
        const initializedPlayers = state.players.map(p => ({
          ...p,
          cash: settings.startingCash
        }));

        return {
          settings,
          players: initializedPlayers,
          properties: resetProps,
          activePlayerId: initializedPlayers[0]?.id || null,
          turnCount: 1,
          transactions: [{
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            description: 'Game Started',
          }],
          bank: {
            cash: 20580,
            houses: 32,
            hotels: 12,
            freeParkingPot: 0,
          }
        };
      }),

      resetGame: () => set({
        players: [],
        properties: getInitialPropertyStates(),
        transactions: [],
        activePlayerId: null,
        turnCount: 0,
      }),

      addTransaction: (description, amount, from, to) => set((state) => ({
        transactions: [{
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          description,
          amount,
          from,
          to
        }, ...state.transactions]
      })),

      transferMoney: (fromId, toId, amount, reason) => set((state) => {
        const { players, bank, settings } = state;
        let newPlayers = [...players];
        let newBank = { ...bank };

        // Handle From
        if (fromId === 'BANK') {
          if (settings.bankCashMode) {
             newBank.cash -= amount;
          }
        } else if (fromId === 'FREE_PARKING') {
             newBank.freeParkingPot = 0; // Empty the pot
        } else {
          newPlayers = newPlayers.map(p => 
            p.id === fromId ? { ...p, cash: p.cash - amount } : p
          );
        }

        // Handle To
        if (toId === 'BANK') {
           if (settings.bankCashMode) newBank.cash += amount;
        } else if (toId === 'FREE_PARKING') {
           newBank.freeParkingPot += amount;
        } else {
           newPlayers = newPlayers.map(p => 
            p.id === toId ? { ...p, cash: p.cash + amount } : p
          );
        }
        
        // Log it
        const fromName = fromId === 'BANK' ? 'The Bank' : fromId === 'FREE_PARKING' ? 'Free Parking' : players.find(p => p.id === fromId)?.name || 'Unknown';
        const toName = toId === 'BANK' ? 'The Bank' : toId === 'FREE_PARKING' ? 'Free Parking' : players.find(p => p.id === toId)?.name || 'Unknown';

        const transaction: Transaction = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            description: `${reason}: ${fromName} paid $${amount} to ${toName}`,
            amount,
            from: fromId,
            to: toId
        };

        return {
          players: newPlayers,
          bank: newBank,
          transactions: [transaction, ...state.transactions]
        };
      }),

      buyProperty: (playerId, propertyId, priceOverride) => set((state) => {
        const property = PROPERTIES.find(p => p.id === propertyId);
        if (!property) return state;

        const price = priceOverride ?? property.price;
        const player = state.players.find(p => p.id === playerId);
        if (!player) return state;

        // Deduct Cash
        const newPlayers = state.players.map(p => 
          p.id === playerId ? { ...p, cash: p.cash - price } : p
        );

        // Assign Ownership
        const newProperties = {
          ...state.properties,
          [propertyId]: { ...state.properties[propertyId], ownerId: playerId }
        };

        const transaction: Transaction = {
             id: crypto.randomUUID(),
             timestamp: Date.now(),
             description: `${player.name} bought ${property.name} for $${price}`,
             amount: price,
             from: playerId,
             to: 'BANK'
        };

        return {
          players: newPlayers,
          properties: newProperties,
          transactions: [transaction, ...state.transactions]
        };
      }),

      mortgageProperty: (propertyId) => set((state) => {
        const propData = PROPERTIES.find(p => p.id === propertyId);
        const propState = state.properties[propertyId];
        const owner = state.players.find(p => p.id === propState.ownerId);

        if (!propData || !owner) return state;

        // Give Cash
        const newPlayers = state.players.map(p => 
          p.id === owner.id ? { ...p, cash: p.cash + propData.mortgageValue } : p
        );

        // Mark Mortgaged
        const newProperties = {
          ...state.properties,
          [propertyId]: { ...propState, mortgaged: true }
        };

        return {
           players: newPlayers,
           properties: newProperties,
           transactions: [{
              id: crypto.randomUUID(),
              timestamp: Date.now(),
              description: `${owner.name} mortgaged ${propData.name} for $${propData.mortgageValue}`,
              amount: propData.mortgageValue,
              from: 'BANK',
              to: owner.id
           }, ...state.transactions]
        };
      }),

      unmortgageProperty: (propertyId) => set((state) => {
         const propData = PROPERTIES.find(p => p.id === propertyId);
         const propState = state.properties[propertyId];
         const owner = state.players.find(p => p.id === propState.ownerId);
 
         if (!propData || !owner) return state;

         const cost = Math.ceil(propData.mortgageValue * 1.1); // 10% Interest

         // Take Cash
         const newPlayers = state.players.map(p => 
           p.id === owner.id ? { ...p, cash: p.cash - cost } : p
         );
 
         // Unmark Mortgaged
         const newProperties = {
           ...state.properties,
           [propertyId]: { ...propState, mortgaged: false }
         };
 
         return {
            players: newPlayers,
            properties: newProperties,
            transactions: [{
               id: crypto.randomUUID(),
               timestamp: Date.now(),
               description: `${owner.name} unmortgaged ${propData.name} for $${cost}`,
               amount: cost,
               from: owner.id,
               to: 'BANK'
            }, ...state.transactions]
         };
      }),

      buildHouse: (propertyId) => set((state) => {
         const propData = PROPERTIES.find(p => p.id === propertyId);
         const propState = state.properties[propertyId];
         const owner = state.players.find(p => p.id === propState.ownerId);
         
         if (!propData || !owner) return state;
         
         // Validation (Simple version, UI should enforce rules mostly)
         if (propState.houses >= 5) return state;

         const isHotel = propState.houses === 4;
         const cost = propData.houseCost;

         // Deduct Cash
         const newPlayers = state.players.map(p => 
           p.id === owner.id ? { ...p, cash: p.cash - cost } : p
         );

         // Add House
         const newProperties = {
            ...state.properties,
            [propertyId]: { ...propState, houses: propState.houses + 1 }
         };

         // Update Bank Inventory
         const newBank = { ...state.bank };
         if (isHotel) {
             newBank.houses += 4; // Return 4 houses
             newBank.hotels -= 1; // Take 1 hotel
         } else {
             newBank.houses -= 1;
         }

         return {
            players: newPlayers,
            properties: newProperties,
            bank: newBank,
            transactions: [{
               id: crypto.randomUUID(),
               timestamp: Date.now(),
               description: `${owner.name} built a ${isHotel ? 'Hotel' : 'House'} on ${propData.name}`,
               amount: cost,
               from: owner.id,
               to: 'BANK'
            }, ...state.transactions]
         };
      }),
      
      sellHouse: (propertyId) => set((state) => {
        // Logic similar to build but reverse
        return state; // TODO: Implement if needed for full MVP
      }),

      nextTurn: () => set((state) => {
         const currentIndex = state.players.findIndex(p => p.id === state.activePlayerId);
         const nextIndex = (currentIndex + 1) % state.players.length;
         const nextPlayer = state.players[nextIndex];

         return {
             activePlayerId: nextPlayer.id,
             turnCount: state.turnCount + 1,
             transactions: [{
                id: crypto.randomUUID(),
                timestamp: Date.now(),
                description: `Start of ${nextPlayer.name}'s turn`,
             }, ...state.transactions]
         };
      })

    }),
    {
      name: 'monopoly-storage', // unique name
    }
  )
);
