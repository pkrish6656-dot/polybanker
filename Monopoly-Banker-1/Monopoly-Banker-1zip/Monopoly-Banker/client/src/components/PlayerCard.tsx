import { Player } from "@shared/schema";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowUpRight, Ban, CreditCard, DollarSign, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlayerCardProps {
  player: Player;
  onPassGo: (playerId: number) => void;
  onTransfer: (playerId: number) => void;
  onToggleBankrupt: (playerId: number, currentState: boolean) => void;
}

export function PlayerCard({ player, onPassGo, onTransfer, onToggleBankrupt }: PlayerCardProps) {
  const isBankrupt = player.isBankrupt;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/5 shadow-xl transition-colors duration-300",
        isBankrupt ? "bg-red-900/20 grayscale-[0.8]" : "bg-card/60 backdrop-blur-sm"
      )}
    >
      {/* Color Strip Header */}
      <div 
        className="h-3 w-full opacity-80" 
        style={{ backgroundColor: player.color }} 
      />

      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg text-lg font-bold text-white/90"
              style={{ backgroundColor: player.color }}
            >
              {player.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-bold font-display leading-none">{player.name}</h3>
              <span className={cn(
                "text-xs font-medium uppercase tracking-wider",
                isBankrupt ? "text-red-400" : "text-emerald-400"
              )}>
                {isBankrupt ? "Bankrupt" : "Active Player"}
              </span>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onToggleBankrupt(player.id, player.isBankrupt)}
            className="rounded-full hover:bg-destructive/20 hover:text-destructive transition-colors"
            title={isBankrupt ? "Revive Player" : "Declare Bankruptcy"}
          >
            <Ban className="w-5 h-5" />
          </Button>
        </div>

        {/* Balance Display */}
        <div className="mb-8 text-center bg-black/20 rounded-2xl py-4 border border-white/5">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest mb-1">
            Current Balance
          </p>
          <div className="flex items-center justify-center text-primary">
            <DollarSign className="w-6 h-6 md:w-8 md:h-8" strokeWidth={3} />
            <span className="text-4xl md:text-5xl font-black font-display tracking-tight text-balance-tabular text-shadow-sm">
              {player.balance.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={() => onPassGo(player.id)}
            disabled={isBankrupt}
            className="w-full h-12 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/50 shadow-lg shadow-emerald-500/5"
          >
            <ArrowUpRight className="mr-2 w-4 h-4" />
            Pass Go
          </Button>
          
          <Button 
            onClick={() => onTransfer(player.id)}
            disabled={isBankrupt}
            variant="secondary"
            className="w-full h-12 rounded-xl"
          >
            <Wallet className="mr-2 w-4 h-4" />
            Transfer
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
