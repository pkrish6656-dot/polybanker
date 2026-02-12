import { useState } from "react";
import { usePlayers } from "@/hooks/use-players";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trash2, Plus, RefreshCw, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PLAYER_COLORS = [
  "#ef4444", // Red
  "#f97316", // Orange
  "#eab308", // Yellow
  "#22c55e", // Green
  "#3b82f6", // Blue
  "#a855f7", // Purple
  "#ec4899", // Pink
  "#64748b", // Slate
];

export default function Setup() {
  const { players, createPlayer, deletePlayer, resetGame } = usePlayers();
  const [newName, setNewName] = useState("");
  const [selectedColor, setSelectedColor] = useState(PLAYER_COLORS[0]);

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    
    createPlayer.mutate({
      name: newName,
      color: selectedColor,
      balance: 1500,
    });
    setNewName("");
    // Rotate to next color
    const currentIndex = PLAYER_COLORS.indexOf(selectedColor);
    setSelectedColor(PLAYER_COLORS[(currentIndex + 1) % PLAYER_COLORS.length]);
  };

  const handleResetGame = () => {
    if (confirm("Are you sure? This will reset all balances to $1500 and clear history.")) {
      resetGame.mutate(1500);
    }
  };

  return (
    <div className="pb-24 pt-6 px-4 max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white mb-2">Game Setup</h1>
        <p className="text-white/50">Configure players and game settings.</p>
      </header>

      <div className="grid gap-8">
        {/* Add Player Card */}
        <Card className="bg-card border-white/10 shadow-lg">
          <CardHeader>
            <CardTitle className="font-display">Add New Player</CardTitle>
            <CardDescription>Enter player name and choose a token color.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddPlayer} className="space-y-6">
              <div className="space-y-2">
                <Label>Player Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Enter name..." 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)}
                    className="pl-10 h-12 bg-secondary/30 border-white/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Token Color</Label>
                <div className="flex flex-wrap gap-3">
                  {PLAYER_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full transition-all duration-200 border-2 ${
                        selectedColor === color 
                          ? "border-white scale-110 shadow-lg" 
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={!newName.trim() || createPlayer.isPending}
                className="w-full h-12 rounded-xl text-lg font-bold"
              >
                {createPlayer.isPending ? "Adding..." : "Add Player"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Players List */}
        <Card className="bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="font-display">Current Players</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <AnimatePresence>
                {players.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No players added yet.</p>
                ) : (
                  players.map((player) => (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      key={player.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-full shadow-sm flex items-center justify-center text-xs font-bold text-white/90"
                          style={{ backgroundColor: player.color }}
                        >
                          {player.name.charAt(0)}
                        </div>
                        <span className="font-medium">{player.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="text-primary font-bold">${player.balance}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if(confirm("Remove this player?")) deletePlayer.mutate(player.id)
                          }}
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Game Reset Zone */}
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6">
          <h3 className="text-destructive font-bold font-display text-lg mb-2">Danger Zone</h3>
          <p className="text-destructive/70 text-sm mb-4">Resetting the game will set all balances to $1500 and cannot be undone.</p>
          <Button 
            variant="destructive" 
            onClick={handleResetGame}
            disabled={resetGame.isPending}
            className="w-full sm:w-auto"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${resetGame.isPending ? "animate-spin" : ""}`} />
            Reset Game
          </Button>
        </div>
      </div>
    </div>
  );
}
