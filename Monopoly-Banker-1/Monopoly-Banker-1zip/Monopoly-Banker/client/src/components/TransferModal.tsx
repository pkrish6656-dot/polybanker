import { useState, useEffect } from "react";
import { Player } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Landmark, User, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  onSubmit: (data: { fromPlayerId: number | null; toPlayerId: number | null; amount: number; description: string }) => void;
  isPending: boolean;
  initialPlayerId?: number | null; // If opened from a specific player card
}

const QUICK_AMOUNTS = [10, 50, 100, 200, 500];

export function TransferModal({ isOpen, onClose, players, onSubmit, isPending, initialPlayerId }: TransferModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [fromId, setFromId] = useState<string>("bank");
  const [toId, setToId] = useState<string>("bank");
  const [description, setDescription] = useState("");

  // When modal opens with an initial player, set them as the sender or receiver intelligently
  useEffect(() => {
    if (isOpen) {
      if (initialPlayerId) {
        setFromId(initialPlayerId.toString());
        setToId("bank"); // Default to paying bank
      } else {
        setFromId("bank");
        setToId(players[0]?.id.toString() || "bank");
      }
      setAmount("");
      setDescription("");
    }
  }, [isOpen, initialPlayerId, players]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    onSubmit({
      fromPlayerId: fromId === "bank" ? null : parseInt(fromId),
      toPlayerId: toId === "bank" ? null : parseInt(toId),
      amount: parseInt(amount),
      description: description || "Transfer",
    });
    onClose();
  };

  const activePlayers = players.filter(p => !p.isBankrupt);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-white/10 shadow-2xl rounded-3xl p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-6 pb-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display">Transfer Money</DialogTitle>
            <DialogDescription className="text-white/60">Move funds between players or the bank.</DialogDescription>
          </DialogHeader>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 -mt-4 bg-card rounded-t-3xl relative">
          <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center mb-6">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">From</Label>
              <Select value={fromId} onValueChange={setFromId}>
                <SelectTrigger className="bg-secondary/50 border-0 h-12 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">
                    <div className="flex items-center gap-2"><Landmark className="w-4 h-4 text-amber-400" /> The Bank</div>
                  </SelectItem>
                  {activePlayers.map(p => (
                    <SelectItem key={p.id} value={p.id.toString()}>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                        {p.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-6 flex justify-center text-muted-foreground">
              <ArrowRight className="w-5 h-5" />
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">To</Label>
              <Select value={toId} onValueChange={setToId}>
                <SelectTrigger className="bg-secondary/50 border-0 h-12 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">
                    <div className="flex items-center gap-2"><Landmark className="w-4 h-4 text-amber-400" /> The Bank</div>
                  </SelectItem>
                  {activePlayers.map(p => (
                    <SelectItem key={p.id} value={p.id.toString()}>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                        {p.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <Input
                  type="number"
                  min="1"
                  placeholder="0"
                  className="pl-12 h-14 text-2xl font-bold bg-secondary/30 border-primary/20 focus-visible:ring-primary/50 rounded-xl"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex flex-wrap gap-2 justify-center">
              {QUICK_AMOUNTS.map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt.toString())}
                  className="px-3 py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary text-sm font-medium transition-colors border border-white/5"
                >
                  ${amt}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Description (Optional)</Label>
              <Input
                placeholder="e.g. Rent for Boardwalk"
                className="bg-secondary/30 border-0 rounded-xl"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-8">
            <Button 
              type="submit" 
              disabled={isPending || !amount || (fromId === toId)} 
              className="w-full h-12 text-lg font-bold rounded-xl bg-gradient-to-r from-primary to-emerald-400 hover:to-emerald-300 text-black shadow-lg shadow-emerald-500/20"
            >
              {isPending ? "Processing..." : "Complete Transfer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
