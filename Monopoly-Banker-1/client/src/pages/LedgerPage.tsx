import { GameLayout } from "@/components/game/GameLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGameStore } from "@/lib/game-store";
import { format } from "date-fns";
import { ArrowLeftRight } from "lucide-react";

export default function LedgerPage() {
  const { transactions } = useGameStore();

  return (
    <GameLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-serif font-bold">Transaction Ledger</h1>
        </div>

        <Card>
          <CardContent className="p-0">
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead className="w-[100px]">Time</TableHead>
                   <TableHead>Description</TableHead>
                   <TableHead className="text-right">Amount</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                        No transactions yet. Start playing!
                      </TableCell>
                    </TableRow>
                 ) : (
                   transactions.map((tx) => (
                     <TableRow key={tx.id}>
                       <TableCell className="font-mono text-xs text-muted-foreground">
                         {format(tx.timestamp, 'HH:mm:ss')}
                       </TableCell>
                       <TableCell className="font-medium">
                         <div className="flex items-center gap-2">
                           <ArrowLeftRight className="w-3 h-3 text-muted-foreground" />
                           {tx.description}
                         </div>
                       </TableCell>
                       <TableCell className="text-right font-mono font-bold">
                         {tx.amount ? `$${tx.amount.toLocaleString()}` : '-'}
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
