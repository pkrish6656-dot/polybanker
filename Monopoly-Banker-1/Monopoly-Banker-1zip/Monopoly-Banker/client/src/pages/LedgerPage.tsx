import { GameLayout } from "@/components/game/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGameStore } from "@/lib/game-store";
import { format } from "date-fns";
import { ArrowLeftRight, User, Home, Gift, RefreshCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function LedgerPage() {
  const { transactions, players } = useGameStore();

  const getTransactionIcon = (desc: string) => {
    if (desc.includes("Pass GO")) return <RefreshCcw className="w-4 h-4 text-green-500" />;
    if (desc.includes("bought")) return <Home className="w-4 h-4 text-orange-500" />;
    if (desc.includes("Jackpot") || desc.includes("Spin")) return <Gift className="w-4 h-4 text-yellow-500" />;
    if (desc.includes("Rent")) return <ArrowLeftRight className="w-4 h-4 text-purple-500" />;
    return <ArrowLeftRight className="w-4 h-4 text-blue-500" />;
  };

  const getPlayerBadge = (id: string | undefined) => {
    if (!id) return null;
    if (id === 'BANK') return <Badge variant="outline" className="bg-slate-100 font-bold">Bank</Badge>;
    if (id === 'FREE_PARKING') return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 font-bold">Free Parking</Badge>;
    
    const player = players.find(p => p.id === id);
    if (!player) return null;
    
    return (
      <Badge 
        variant="outline" 
        style={{ backgroundColor: `${player.color}20`, borderColor: player.color, color: player.color }}
        className="font-bold"
      >
        {player.name}
      </Badge>
    );
  };

  return (
    <GameLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-serif font-bold tracking-tight">Transaction History</h1>
          <Badge variant="secondary" className="px-3 py-1">{transactions.length} Records</Badge>
        </div>

        <Card className="border-2 shadow-sm">
          <CardContent className="p-0">
             <Table>
               <TableHeader className="bg-muted/50">
                 <TableRow>
                   <TableHead className="w-[100px]">Time</TableHead>
                   <TableHead>Activity</TableHead>
                   <TableHead className="hidden md:table-cell">From / To</TableHead>
                   <TableHead className="text-right">Amount</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-32 text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <ArrowLeftRight className="w-8 h-8 opacity-20" />
                          <p>The vault is empty. Start playing!</p>
                        </div>
                      </TableCell>
                    </TableRow>
                 ) : (
                   transactions.map((tx) => (
                     <TableRow key={tx.id} className="hover:bg-muted/30 transition-colors">
                       <TableCell className="font-mono text-xs text-muted-foreground">
                         {format(tx.timestamp, 'HH:mm:ss')}
                       </TableCell>
                       <TableCell>
                         <div className="flex items-center gap-3">
                           <div className="p-2 bg-muted rounded-full shrink-0">
                             {getTransactionIcon(tx.description)}
                           </div>
                           <div className="flex flex-col">
                             <span className="font-semibold text-sm leading-none mb-1">{tx.description}</span>
                             <div className="flex items-center gap-1 md:hidden mt-1">
                               {getPlayerBadge(tx.from)}
                               {tx.from && tx.to && <span className="text-[10px] text-muted-foreground">→</span>}
                               {getPlayerBadge(tx.to)}
                             </div>
                           </div>
                         </div>
                       </TableCell>
                       <TableCell className="hidden md:table-cell">
                         <div className="flex items-center gap-2">
                           {getPlayerBadge(tx.from)}
                           {tx.from && tx.to && <ArrowLeftRight className="w-3 h-3 text-muted-foreground" />}
                           {getPlayerBadge(tx.to)}
                         </div>
                       </TableCell>
                       <TableCell className="text-right">
                         {tx.amount ? (
                           <span className={cn(
                             "font-mono font-bold text-lg",
                             tx.to === 'BANK' || tx.to === 'FREE_PARKING' ? "text-red-600" : "text-green-600"
                           )}>
                             ${tx.amount.toLocaleString()}
                           </span>
                         ) : (
                           <span className="text-muted-foreground">—</span>
                         )}
                       </TableCell>
                     </TableRow>
                   ))
                 )}
               </TableBody>
             </Table>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
