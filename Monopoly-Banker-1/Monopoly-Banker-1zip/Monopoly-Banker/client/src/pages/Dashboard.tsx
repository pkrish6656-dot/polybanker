import { useState } from "react";
import { usePlayers } from "@/hooks/use-players";
import { useTransactions } from "@/hooks/use-transactions";
import { PlayerCard } from "@/components/PlayerCard";
import { TransferModal } from "@/components/TransferModal";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Dashboard() {
  const { players, isLoading, updatePlayer } = usePlayers();
  const { createTransaction } = useTransactions();
  
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);

  const handlePassGo = (playerId: number) => {
    createTransaction.mutate({
      fromPlayerId: null, // Bank
      toPlayerId: playerId,
      amount: 200,
      description: "Pass Go",
    });
  };

  const handleTransferClick = (playerId: number) => {
    setSelectedPlayerId(playerId);
    setIsTransferOpen(true);
  };

  const handleGlobalTransfer = () => {
    setSelectedPlayerId(null);
    setIsTransferOpen(true);
  };

  const handleToggleBankrupt = (playerId: number, currentState: boolean) => {
    if (confirm(currentState ? "Revive player?" : "Declare bankruptcy for this player?")) {
      updatePlayer.mutate({ id: playerId, isBankrupt: !currentState });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-primary/10 p-6 rounded-full mb-6">
          <Users className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-3xl font-bold font-display mb-4">No Players Yet!</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          The board is empty. Add some players to start the game and become the ultimate tycoon.
        </p>
        <Link href="/setup">
          <Button size="lg" className="rounded-xl text-lg h-14 px-8 shadow-lg shadow-primary/25">
            <Plus className="mr-2 h-5 w-5" />
            Setup Game
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-6 px-4 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8 md:mb-12">
        <div>
          <h1 className="text-2xl md:text-4xl font-display font-bold text-white mb-2">
            Dashboard
          </h1>
          <p className="text-white/50 text-sm md:text-base">
            Manage the bank and player fortunes.
          </p>
        </div>
        <Button 
          onClick={handleGlobalTransfer}
          size="lg"
          className="hidden md:flex rounded-xl bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/20"
        >
          <Plus className="mr-2 h-5 w-5" />
          New Transfer
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            onPassGo={handlePassGo}
            onTransfer={handleTransferClick}
            onToggleBankrupt={handleToggleBankrupt}
          />
        ))}
      </div>

      {/* Floating Action Button for Mobile */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleGlobalTransfer}
        className="md:hidden fixed bottom-24 right-6 w-14 h-14 rounded-full bg-accent text-white shadow-xl shadow-accent/30 flex items-center justify-center z-40 border border-white/20"
      >
        <Plus className="w-8 h-8" />
      </motion.button>

      <TransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        players={players}
        onSubmit={(data) => createTransaction.mutate(data)}
        isPending={createTransaction.isPending}
        initialPlayerId={selectedPlayerId}
      />
    </div>
  );
}
