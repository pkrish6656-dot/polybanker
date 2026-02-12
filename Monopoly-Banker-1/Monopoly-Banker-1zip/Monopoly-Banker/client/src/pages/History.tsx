import { useTransactions } from "@/hooks/use-transactions";
import { usePlayers } from "@/hooks/use-players";
import { formatDistanceToNow } from "date-fns";
import { Landmark, ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function History() {
  const { transactions, isLoading: loadingTx } = useTransactions();
  const { players, isLoading: loadingPlayers } = usePlayers();

  if (loadingTx || loadingPlayers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Create a map for quick player lookup
  const playerMap = new Map(players.map(p => [p.id, p]));

  const getEntityDisplay = (id: number | null) => {
    if (id === null) {
      return (
        <div className="flex items-center gap-2 text-amber-400 font-bold">
          <div className="w-8 h-8 rounded-full bg-amber-400/10 flex items-center justify-center">
            <Landmark className="w-4 h-4" />
          </div>
          The Bank
        </div>
      );
    }
    const player = playerMap.get(id);
    if (!player) return <span className="text-muted-foreground">Unknown</span>;
    return (
      <div className="flex items-center gap-2 font-bold text-white">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs text-white/90 shadow-sm"
          style={{ backgroundColor: player.color }}
        >
          {player.name.charAt(0)}
        </div>
        {player.name}
      </div>
    );
  };

  return (
    <div className="pb-24 pt-6 px-4 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white mb-2">Transaction History</h1>
        <p className="text-white/50">Track every deal and payment.</p>
      </header>

      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="text-center py-12 bg-card/50 rounded-3xl border border-white/5">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No transactions recorded yet.</p>
          </div>
        ) : (
          transactions.map((tx, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={tx.id}
              className="bg-card/80 backdrop-blur-sm border border-white/5 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-1 md:flex-none md:w-48">
                    {getEntityDisplay(tx.fromPlayerId)}
                  </div>
                  
                  <ArrowRight className="text-muted-foreground w-5 h-5 flex-shrink-0" />
                  
                  <div className="flex-1 md:flex-none md:w-48">
                    {getEntityDisplay(tx.toPlayerId)}
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 flex-1 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary font-display text-balance-tabular">
                      ${tx.amount.toLocaleString()}
                    </div>
                    {tx.description && (
                      <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                        {tx.description}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-white/30 font-medium whitespace-nowrap min-w-[80px] text-right">
                    {tx.createdAt && formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true })}
                  </div>
                </div>

              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
