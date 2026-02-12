import { useState, useEffect } from "react";
import { useGameStore } from "@/lib/game-store";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, PlayCircle, Coins } from "lucide-react";
import { motion } from "framer-motion";

const PLAYER_COLORS = [
  "#EF4444",
  "#3B82F6",
  "#22C55E",
  "#EAB308",
  "#A855F7",
  "#EC4899",
  "#F97316",
  "#64748B",
];

export default function SetupPage() {
  const [, setLocation] = useLocation();
  const startGame = useGameStore((state) => state.startGame);
  
  const [players, setPlayers] = useState<{name: string, color: string}[]>([
    { name: "Player 1", color: PLAYER_COLORS[0] },
    { name: "Player 2", color: PLAYER_COLORS[1] },
  ]);
  
  const [startingCash, setStartingCash] = useState(() => {
    const saved = localStorage.getItem('monopoly-storage');
    if (saved) {
      try {
        const state = JSON.parse(saved).state;
        return state.settings?.startingCash ?? 1500;
      } catch (e) {}
    }
    return 1500;
  });
  const [freeParking, setFreeParking] = useState(() => {
    const saved = localStorage.getItem('monopoly-storage');
    if (saved) {
      try {
        const state = JSON.parse(saved).state;
        return state.settings?.freeParkingJackpot ?? false;
      } catch (e) {}
    }
    return false;
  });
  const [buyEverything, setBuyEverything] = useState(() => {
    const saved = localStorage.getItem('monopoly-storage');
    if (saved) {
      try {
        const state = JSON.parse(saved).state;
        return state.settings?.buyEverything ?? false;
      } catch (e) {}
    }
    return false;
  });
  const [bankMode, setBankMode] = useState(() => {
    const saved = localStorage.getItem('monopoly-storage');
    if (saved) {
      try {
        const state = JSON.parse(saved).state;
        return state.settings?.bankCashMode ?? false;
      } catch (e) {}
    }
    return false;
  });

  // Keep state in sync with local state
  useEffect(() => {
    const saved = localStorage.getItem('monopoly-storage');
    if (saved) {
      try {
        const state = JSON.parse(saved).state;
        if (state.settings) {
          if (state.settings.startingCash !== startingCash) setStartingCash(state.settings.startingCash);
          if (state.settings.freeParkingJackpot !== freeParking) setFreeParking(state.settings.freeParkingJackpot);
          if (state.settings.buyEverything !== buyEverything) setBuyEverything(state.settings.buyEverything);
          if (state.settings.bankCashMode !== bankMode) setBankMode(state.settings.bankCashMode);
        }
      } catch (e) {}
    }
  }, []);

  const addPlayer = () => {
    if (players.length >= 8) return;
    setPlayers([...players, { name: `Player ${players.length + 1}`, color: PLAYER_COLORS[players.length % PLAYER_COLORS.length] }]);
  };

  const removePlayer = (index: number) => {
    if (players.length <= 2) return;
    setPlayers(players.filter((_, i) => i !== index));
  };

  const updatePlayer = (index: number, field: keyof typeof players[0], value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], [field]: value };
    setPlayers(newPlayers);
  };

  const handleStart = () => {
    useGameStore.getState().resetGame();
    
    players.forEach(p => useGameStore.getState().addPlayer(p.name, p.color));
    
    startGame({
      startingCash,
      freeParkingJackpot: freeParking,
      buyEverything,
      bankCashMode: bankMode,
    });
    
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
           <h1 className="text-4xl md:text-5xl font-serif font-black text-primary mb-2">PolyBank</h1>
           <p className="text-muted-foreground text-lg">The Modern Banker's Companion</p>
        </div>

        <Card className="border-2 shadow-xl">
          <CardHeader className="bg-primary/5 border-b">
            <CardTitle className="font-serif text-2xl">New Game Setup</CardTitle>
            <CardDescription>Configure players and house rules</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Coins className="w-5 h-5 text-primary" /> Players
                </h3>
                <span className="text-sm text-muted-foreground" data-testid="text-player-count">{players.length}/8</span>
              </div>
              
              <div className="grid gap-3">
                {players.map((player, idx) => (
                  <div key={idx} className="flex gap-3 items-center animate-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                    <div 
                      className="w-10 h-10 rounded-full border-2 shrink-0 cursor-pointer transition-transform hover:scale-110"
                      style={{ backgroundColor: player.color }}
                      onClick={() => updatePlayer(idx, 'color', PLAYER_COLORS[(PLAYER_COLORS.indexOf(player.color) + 1) % PLAYER_COLORS.length])}
                      data-testid={`button-player-color-${idx}`}
                    />
                    <Input 
                      value={player.name} 
                      onChange={(e) => updatePlayer(idx, 'name', e.target.value)}
                      className="flex-1 font-medium text-lg"
                      placeholder="Player Name"
                      data-testid={`input-player-name-${idx}`}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removePlayer(idx)}
                      disabled={players.length <= 2}
                      className="text-muted-foreground hover:text-destructive"
                      data-testid={`button-remove-player-${idx}`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <Button onClick={addPlayer} variant="outline" className="w-full border-dashed border-2" data-testid="button-add-player">
                <Plus className="w-4 h-4 mr-2" /> Add Player
              </Button>
            </div>

            <Separator />

            <div className="space-y-6">
               <h3 className="text-lg font-bold">House Rules</h3>
               
               <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Starting Cash</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-serif font-bold text-muted-foreground">$</span>
                      <Input 
                        type="number" 
                        value={startingCash} 
                        onChange={(e) => setStartingCash(Number(e.target.value))}
                        className="pl-8 font-mono text-lg"
                        data-testid="input-starting-cash"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg bg-secondary/20">
                    <div className="space-y-0.5">
                      <Label className="text-base">Free Parking Jackpot</Label>
                      <p className="text-xs text-muted-foreground">Fines go to a pot for the lucky lander</p>
                    </div>
                    <Switch checked={freeParking} onCheckedChange={setFreeParking} data-testid="switch-free-parking" />
                  </div>

                  <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg bg-secondary/20">
                    <div className="space-y-0.5">
                      <Label className="text-base">Buy Everything Mode</Label>
                      <p className="text-xs text-muted-foreground">Buy unowned properties anytime</p>
                    </div>
                    <Switch checked={buyEverything} onCheckedChange={setBuyEverything} data-testid="switch-buy-everything" />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg bg-secondary/20">
                    <div className="space-y-0.5">
                      <Label className="text-base">Finite Bank</Label>
                      <p className="text-xs text-muted-foreground">Track bank's cash limit</p>
                    </div>
                    <Switch checked={bankMode} onCheckedChange={setBankMode} data-testid="switch-finite-bank" />
                  </div>
               </div>
            </div>

            <Button onClick={handleStart} size="lg" className="w-full text-lg font-bold h-14 shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]" data-testid="button-start-game">
              <PlayCircle className="w-6 h-6 mr-2" /> Start Game
            </Button>

          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
