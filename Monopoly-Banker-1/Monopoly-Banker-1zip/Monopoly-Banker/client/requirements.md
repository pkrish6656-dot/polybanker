## Packages
framer-motion | Essential for playful, game-like animations and transitions
date-fns | Formatting transaction timestamps nicely

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  display: ["'Fredoka'", "cursive"],
  body: ["'Outfit'", "sans-serif"],
}

API Integration:
- Players and Transactions are the main resources
- Transactions can have null from/to IDs representing "The Bank"
- Reset Game endpoint at /api/game/reset
