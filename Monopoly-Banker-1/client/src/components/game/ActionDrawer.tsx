import { useState } from "react";
import { useGameStore } from "@/lib/game-store";
import { PROPERTIES, Property } from "@/lib/monopoly-data";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { ArrowRightLeft, Building2, Coins, DollarSign, HandCoins, Home, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

// Action Types
type ActionType = 'pass_go' | 'pay' | 'receive' | 'buy' | 'rent' | 'build' | 'trade' | null;

export function ActionDrawer({ activePlayer }: { activePlayer: any }) {
  const [open, setOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<ActionType>(null);
  const nextTurn = useGameStore(state => state.nextTurn);

  if (!activePlayer) return null;

  const handleActionSelect = (action: ActionType) => {
    setCurrentAction(action);
  };

  const closeDrawer = () => {
    setOpen(false);
    setCurrentAction(null);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="lg" className="w-full shadow-xl text-lg h-14 font-bold bg-primary text-primary-foreground hover:bg-primary/90">
          <DollarSign className="w-5 h-5 mr-2" /> Take Action
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh]">
        <div className="mx-auto w-full max-w-sm h-full flex flex-col">
          <DrawerHeader>
            <DrawerTitle className="text-2xl font-serif text-center">
              {currentAction ? getActionTitle(currentAction) : `${activePlayer.name}'s Turn`}
            </DrawerTitle>
            <DrawerDescription className="text-center">
              {currentAction ? "Fill in the details below" : "Choose an action to perform"}
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 px-4 overflow-y-auto">
            {!currentAction ? (
              <ActionGrid onSelect={handleActionSelect} />
            ) : (
              <ActionForm 
                type={currentAction} 
                player={activePlayer} 
                onBack={() => setCurrentAction(null)} 
                onComplete={closeDrawer} 
              />
            )}
          </div>

          <DrawerFooter>
            {!currentAction && (
               <Button variant="destructive" className="w-full h-12 text-lg" onClick={() => { nextTurn(); closeDrawer(); }}>
                 End Turn
               </Button>
            )}
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function getActionTitle(type: ActionType) {
  switch (type) {
    case 'pass_go': return "Pass GO";
    case 'pay': return "Pay Money";
    case 'receive': return "Receive Money";
    case 'buy': return "Buy Property";
    case 'rent': return "Pay Rent";
    case 'build': return "Build House/Hotel";
    case 'trade': return "Trade";
    default: return "Action";
  }
}

function ActionGrid({ onSelect }: { onSelect: (t: ActionType) => void }) {
  const actions = [
    { id: 'pass_go', label: 'Pass GO', icon: RefreshCcw, color: 'bg-green-100 text-green-700' },
    { id: 'pay', label: 'Pay', icon: ArrowRightLeft, color: 'bg-red-100 text-red-700' },
    { id: 'receive', label: 'Receive', icon: HandCoins, color: 'bg-blue-100 text-blue-700' },
    { id: 'buy', label: 'Buy Prop', icon: Home, color: 'bg-orange-100 text-orange-700' },
    { id: 'rent', label: 'Pay Rent', icon: Coins, color: 'bg-purple-100 text-purple-700' },
    { id: 'build', label: 'Build', icon: Building2, color: 'bg-emerald-100 text-emerald-700' },
    // { id: 'trade', label: 'Trade', icon: RefreshCw, color: 'bg-yellow-100 text-yellow-700' },
  ] as const;

  return (
    <div className="grid grid-cols-2 gap-4 pt-4">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => onSelect(action.id as ActionType)}
          className={cn(
            "flex flex-col items-center justify-center p-6 rounded-xl transition-all active:scale-95",
            "border-2 border-transparent hover:border-border hover:bg-secondary/50",
            action.color
          )}
        >
          <action.icon className="w-8 h-8 mb-3" />
          <span className="font-bold text-lg">{action.label}</span>
        </button>
      ))}
    </div>
  );
}

function ActionForm({ type, player, onBack, onComplete }: { type: ActionType, player: any, onBack: () => void, onComplete: () => void }) {
  const { transferMoney, buyProperty, players, properties, buildHouse, settings } = useGameStore();
  const [amount, setAmount] = useState<string>("");
  const [targetId, setTargetId] = useState<string>("");
  const [propertyId, setPropertyId] = useState<string>("");
  const [isFree, setIsFree] = useState(false);

  // Simplified form logic for prototype
  const handleSubmit = () => {
    const val = parseInt(amount);

    if (type === 'pass_go') {
      transferMoney('BANK', player.id, 200, "Passed GO");
    } 
    else if (type === 'pay') {
      if (!val || !targetId) return;
      transferMoney(player.id, targetId, val, "Payment");
    }
    else if (type === 'receive') {
      if (!val) return; // Assume from Bank for generic receive, or could add target
      transferMoney('BANK', player.id, val, "Received");
    }
    else if (type === 'buy') {
      if (!propertyId) return;
      const propPrice = PROPERTIES.find(p => p.id === propertyId)?.price || 0;
      buyProperty(player.id, propertyId, isFree ? 0 : propPrice);
    }
    else if (type === 'rent') {
      // Rent logic needs to calculate amount based on property
      // For now, manual entry
       if (!val || !targetId) return;
       transferMoney(player.id, targetId, val, "Rent");
    }
    else if (type === 'build') {
       if (!propertyId) return;
       buildHouse(propertyId);
    }

    onComplete();
  };

  // Helper to render specific inputs based on type
  return (
    <div className="space-y-6 pt-4">
       {/* Free Option for Buy Everything / Free Parking context */}
       {type === 'buy' && (settings.buyEverything || settings.freeParkingJackpot) && (
         <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10 border border-accent/20">
           <div className="space-y-0.5">
             <Label className="text-base text-accent font-bold">Free Acquisition</Label>
             <p className="text-xs text-muted-foreground italic">Acquire for $0 (House Rules)</p>
           </div>
           <Switch checked={isFree} onCheckedChange={setIsFree} />
         </div>
       )}
       {/* Amount Input (if needed) */}
       {['pay', 'receive', 'rent'].includes(type!) && (
         <div className="space-y-2">
           <Label className="text-lg">Amount</Label>
           <div className="relative">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground">$</span>
             <Input 
               type="number" 
               className="pl-8 h-14 text-2xl font-mono" 
               placeholder="0"
               value={amount}
               onChange={(e) => setAmount(e.target.value)}
               autoFocus
             />
           </div>
         </div>
       )}

       {/* Target Selector (Who to pay?) */}
       {['pay', 'rent'].includes(type!) && (
         <div className="space-y-2">
            <Label>To Whom?</Label>
            <Select onValueChange={setTargetId}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select Recipient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BANK">The Bank</SelectItem>
                <SelectItem value="FREE_PARKING">Free Parking</SelectItem>
                {players.filter((p:any) => p.id !== player.id).map((p:any) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
         </div>
       )}

       {/* Property Selector */}
       {['buy', 'build'].includes(type!) && (
          <div className="space-y-2">
            <Label>Which Property?</Label>
            <Select onValueChange={setPropertyId}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Search Properties..." />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-[200px]">
                  {PROPERTIES.filter(p => {
                    if (type === 'buy') {
                      // Only show unowned properties
                      return !properties[p.id]?.ownerId; 
                    }
                    if (type === 'build') {
                      // Only show owned by player
                      return properties[p.id]?.ownerId === player.id;
                    }
                    return true;
                  }).map((p: Property) => (
                    <SelectItem key={p.id} value={p.id}>
                      <span className={cn(
                        "inline-block w-3 h-3 rounded-full mr-2",
                        getColorClass(p.color)
                      )} />
                      {p.name} (${p.price})
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
       )}

       <div className="flex gap-3 pt-4">
         <Button variant="outline" className="flex-1 h-12" onClick={onBack}>Back</Button>
         <Button className="flex-1 h-12 text-lg font-bold" onClick={handleSubmit}>Confirm</Button>
       </div>
    </div>
  );
}

function getColorClass(color: string) {
  switch (color) {
    case 'brown': return 'bg-amber-900';
    case 'lightBlue': return 'bg-sky-400';
    case 'pink': return 'bg-pink-500';
    case 'orange': return 'bg-orange-500';
    case 'red': return 'bg-red-600';
    case 'yellow': return 'bg-yellow-400';
    case 'green': return 'bg-green-600';
    case 'blue': return 'bg-blue-800';
    default: return 'bg-gray-500';
  }
}
