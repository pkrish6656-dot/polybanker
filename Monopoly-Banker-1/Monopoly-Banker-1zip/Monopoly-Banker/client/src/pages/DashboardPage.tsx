import { useState } from "react";
import { useGameStore } from "@/lib/game-store";
import { GameLayout } from "@/components/game/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Home, Train, Zap, MoreHorizontal, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ActionDrawer } from "@/components/game/ActionDrawer";
import { PROPERTIES } from "@/lib/monopoly-data";

export default function DashboardPage() {
  const { players, bank, properties, history, undo } = useGameStore();
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handlePlayerClick = (player: any) => {
    if (!player.isBankrupt) {
      setSelectedPlayer(player);
      setDrawerOpen(true);
    }
  };

  const getPlayerPropertyCounts = (playerId: string) => {
    let regularProps = 0, railroads = 0, utilities = 0;
    Object.entries(properties).forEach(([propId, state]) => {
      if (state.ownerId === playerId) {
        const propData = PROPERTIES.find(p => p.id === propId);
        if (propData) {
          if (propData.color === 'railroad') railroads++;
          else if (propData.color === 'utility') utilities++;
          else regularProps++;
        }
      }
    });
    return { regularProps, railroads, utilities };
  };

  return (
    <GameLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-primary text-primary-foreground border-none shadow-lg">
            <CardContent className="p-4 flex items-center justify-between gap-2">
              <div>
                <p className="text-primary-foreground/80 text-xs font-bold uppercase tracking-wider">Bank Cash</p>
                <p className="text-2xl font-serif font-black">${bank.cash.toLocaleString()}</p>
              </div>
              <div className="h-10 w-10 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card shadow-sm">
            <CardContent className="p-4 flex items-center justify-between gap-2">
              <div>
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Free Parking</p>
                <p className="text-2xl font-serif font-black text-accent">${bank.freeParkingPot.toLocaleString()}</p>
              </div>
              <div className="h-10 w-10 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                <CarIcon className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card shadow-sm hidden md:block">
            <CardContent className="p-4 flex items-center justify-between gap-2">
              <div>
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Houses Left</p>
                <p className="text-2xl font-serif font-black text-green-600">{bank.houses}</p>
              </div>
              <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600">
                <Home className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card shadow-sm hidden md:block">
            <CardContent className="p-4 flex items-center justify-between gap-2">
              <div>
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Hotels Left</p>
                <p className="text-2xl font-serif font-black text-destructive">{bank.hotels}</p>
              </div>
              <div className="h-10 w-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-destructive">
                <Home className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {history.length > 0 && (
          <Button 
            onClick={undo}
            variant="outline" 
            className="w-full h-12 text-lg border-dashed"
          >
            <Undo2 className="w-5 h-5 mr-2" />
            Undo Last Action ({history.length} available)
          </Button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {players.map((player) => {
            const counts = getPlayerPropertyCounts(player.id);
            return (
              <PlayerCard 
                key={player.id} 
                player={player} 
                propertyCounts={counts}
                onClick={() => handlePlayerClick(player)}
              />
            );
          })}
        </div>

        <ActionDrawer 
          player={selectedPlayer} 
          open={drawerOpen} 
          onOpenChange={setDrawerOpen}
        />
      </div>
    </GameLayout>
  );
}

interface PropertyCounts { regularProps: number; railroads: number; utilities: number; }

function PlayerCard({ player, propertyCounts, onClick }: { player: any, propertyCounts: PropertyCounts, onClick: () => void }) {
  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-[1.02]",
        player.isBankrupt ? "opacity-50 grayscale cursor-not-allowed" : "shadow-md"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 gap-2">
        <div className="flex items-center gap-3">
          <div className="w-3 h-12 rounded-full" style={{ backgroundColor: player.color }} />
          <div>
            <CardTitle className="text-lg font-bold">{player.name}</CardTitle>
            <span className={cn("text-xs font-bold uppercase tracking-wider", player.isBankrupt ? "text-red-500" : "text-muted-foreground")}>
              {player.isBankrupt ? "Bankrupt" : "Tap for actions"}
            </span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={e => e.stopPropagation()}>
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-baseline justify-between mb-4 gap-2">
          <span className="text-sm text-muted-foreground font-medium">Cash</span>
          <span className="text-3xl font-serif font-black text-foreground">${player.cash.toLocaleString()}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
          <div className="bg-secondary/50 p-2 rounded">
            <Home className="w-4 h-4 mx-auto mb-1 opacity-50" />
            <span className="font-bold text-foreground">{propertyCounts.regularProps}</span> Props
          </div>
          <div className="bg-secondary/50 p-2 rounded">
            <Train className="w-4 h-4 mx-auto mb-1 opacity-50" />
            <span className="font-bold text-foreground">{propertyCounts.railroads}</span> RRs
          </div>
          <div className="bg-secondary/50 p-2 rounded">
            <Zap className="w-4 h-4 mx-auto mb-1 opacity-50" />
            <span className="font-bold text-foreground">{propertyCounts.utilities}</span> Utils
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 13V19H17V17H7V19H5V13L6 10H18L19 13Z" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M5 13H19" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}
