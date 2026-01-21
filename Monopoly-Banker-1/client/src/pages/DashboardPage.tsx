import { useGameStore } from "@/lib/game-store";
import { GameLayout } from "@/components/game/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Home, Train, Zap, TrendingUp, TrendingDown, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { ActionDrawer } from "@/components/game/ActionDrawer";

export default function DashboardPage() {
  const { players, bank, activePlayerId } = useGameStore();

  const activePlayer = players.find(p => p.id === activePlayerId);

  return (
    <GameLayout>
      <div className="space-y-6">
        
        {/* Top Status Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <Card className="bg-primary text-primary-foreground border-none shadow-lg">
             <CardContent className="p-4 flex items-center justify-between">
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
             <CardContent className="p-4 flex items-center justify-between">
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
             <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Houses Left</p>
                  <p className="text-2xl font-serif font-black text-green-600">{bank.houses}</p>
                </div>
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <Home className="w-5 h-5" />
                </div>
             </CardContent>
           </Card>

           <Card className="bg-card shadow-sm hidden md:block">
             <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Hotels Left</p>
                  <p className="text-2xl font-serif font-black text-destructive">{bank.hotels}</p>
                </div>
                <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center text-destructive">
                  <Home className="w-5 h-5" />
                </div>
             </CardContent>
           </Card>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {players.map((player) => (
            <PlayerCard key={player.id} player={player} isActive={player.id === activePlayerId} />
          ))}
        </div>

        {/* Action Bar (Floating on Mobile) */}
        <div className="fixed bottom-0 left-0 right-0 md:static md:bottom-auto p-4 bg-background/80 backdrop-blur border-t md:border-none md:bg-transparent z-50">
           <div className="max-w-md mx-auto md:max-w-none">
              <ActionDrawer activePlayer={activePlayer} />
           </div>
        </div>

      </div>
    </GameLayout>
  );
}

function PlayerCard({ player, isActive }: { player: any, isActive: boolean }) {
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300", 
      isActive ? "ring-4 ring-primary ring-offset-2 scale-[1.02] shadow-xl" : "shadow-md hover:shadow-lg opacity-90 hover:opacity-100"
    )}>
      {isActive && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary animate-pulse" />
      )}
      
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <div className="w-3 h-12 rounded-full" style={{ backgroundColor: player.color }} />
          <div>
            <CardTitle className="text-lg font-bold">{player.name}</CardTitle>
            {isActive && <span className="text-xs font-bold text-primary uppercase tracking-wider">Current Turn</span>}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="flex items-baseline justify-between mb-4">
           <span className="text-sm text-muted-foreground font-medium">Cash</span>
           <span className="text-3xl font-serif font-black text-foreground">${player.cash.toLocaleString()}</span>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
           <div className="bg-secondary/50 p-2 rounded">
             <Home className="w-4 h-4 mx-auto mb-1 opacity-50" />
             <span className="font-bold text-foreground">0</span> Props
           </div>
           <div className="bg-secondary/50 p-2 rounded">
             <Train className="w-4 h-4 mx-auto mb-1 opacity-50" />
             <span className="font-bold text-foreground">0</span> RRs
           </div>
           <div className="bg-secondary/50 p-2 rounded">
             <Zap className="w-4 h-4 mx-auto mb-1 opacity-50" />
             <span className="font-bold text-foreground">0</span> Utils
           </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
       <path d="M19 13V19H17V17H7V19H5V13L6 10H18L19 13Z" stroke="currentColor" strokeWidth="2" fill="none"/>
       <path d="M5 13H19" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}
