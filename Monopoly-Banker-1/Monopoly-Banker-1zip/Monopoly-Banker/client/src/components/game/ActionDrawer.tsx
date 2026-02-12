import { useState, useEffect } from "react";
import { useGameStore } from "@/lib/game-store";
import { PROPERTIES, STANDARD_PROPERTIES, Property } from "@/lib/monopoly-data";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { ArrowRightLeft, Building2, Coins, HandCoins, Home, RefreshCcw, Skull, Gift, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

type ActionType = 'pass_go' | 'pay' | 'receive' | 'buy' | 'rent' | 'build' | 'bankruptcy' | 'jackpot' | 'sale_card' | 'spin' | 'trade' | null;

const ACTIONS = [
  { id: 'pass_go', label: 'Pass GO', icon: RefreshCcw, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  { id: 'jackpot', label: 'Jackpot', icon: Gift, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  { id: 'pay', label: 'Pay', icon: ArrowRightLeft, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  { id: 'receive', label: 'Receive', icon: HandCoins, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { id: 'buy', label: 'Buy Prop', icon: Home, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  { id: 'rent', label: 'Pay Rent', icon: Coins, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  { id: 'build', label: 'Build', icon: Building2, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { id: 'trade', label: 'Trade', icon: Shuffle, color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400' },
  { id: 'sale_card', label: 'Sale Card', icon: Coins, color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
  { id: 'spin', label: 'Spin!', icon: RefreshCcw, color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
  { id: 'bankruptcy', label: 'Bankrupt', icon: Skull, color: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400' },
] as const;

const ACTION_TITLES: Record<string, string> = {
  pass_go: "Pass GO", pay: "Pay Money", receive: "Receive Money", buy: "Buy Property",
  rent: "Pay Rent", build: "Build House/Hotel", bankruptcy: "Declare Bankruptcy", jackpot: "Collect Jackpot",
  sale_card: "Buy Sale Card", spin: "Free Parking Spin", trade: "Property Trade"
};

const COLOR_MAP: Record<string, string> = {
  brown: 'bg-amber-900', lightBlue: 'bg-sky-400', pink: 'bg-pink-500', orange: 'bg-orange-500',
  red: 'bg-red-600', yellow: 'bg-yellow-400', green: 'bg-green-600', blue: 'bg-blue-800'
};

interface ActionDrawerProps {
  player: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ActionDrawer({ player, open, onOpenChange }: ActionDrawerProps) {
  const [action, setAction] = useState<ActionType>(null);
  const bank = useGameStore(s => s.bank);
  const settings = useGameStore(s => s.settings);

  if (!player) return null;
  const close = () => { onOpenChange(false); setAction(null); };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} dismissible={true} preventScrollRestoration={true}>
      <DrawerContent className="h-[85vh] fixed bottom-0 left-0 right-0 outline-none">
        <div className="mx-auto w-full max-w-sm h-full flex flex-col overflow-hidden">
          <div className="mt-4 mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted" />
          <DrawerHeader className="px-4 py-6 flex-shrink-0">
            <DrawerTitle className="text-2xl font-serif text-center">
              {action ? ACTION_TITLES[action] : `${player.name}'s Actions`}
            </DrawerTitle>
            <DrawerDescription className="text-center">
              {action ? "Fill in the details below" : "Choose an action"}
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 px-4 overflow-y-auto overscroll-contain pb-8">
            {!action ? (
              <div className="grid grid-cols-2 gap-4 pt-2">
                {ACTIONS.filter(a => {
                  if (a.id === 'jackpot' && !settings.freeParkingJackpot) return false;
                  if (a.id === 'sale_card' && !settings.buyEverything) return false;
                  if (a.id === 'spin' && !settings.freeParkingJackpot) return false;
                  return true;
                }).map(a => (
                  <button key={a.id} onClick={() => setAction(a.id as ActionType)}
                    className={cn(
                      "flex flex-col items-center justify-center p-6 rounded-xl transition-all active:scale-95 border-2 border-transparent hover:border-border hover:bg-secondary/50", 
                      a.color,
                      a.id === 'jackpot' && bank.freeParkingPot === 0 && "opacity-50"
                    )}>
                    <a.icon className="w-8 h-8 mb-3" />
                    <span className="font-bold text-lg">{a.label}</span>
                    {a.id === 'jackpot' && <span className="text-xs mt-1">${bank.freeParkingPot}</span>}
                  </button>
                ))}
              </div>
            ) : (
              <ActionForm type={action} player={player} onBack={() => setAction(null)} onComplete={close} />
            )}
          </div>
          <DrawerFooter className="px-4 pb-8 flex-shrink-0 bg-background/80 backdrop-blur-sm border-t">
            <DrawerClose asChild><Button variant="outline" className="w-full h-12">Close</Button></DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function ActionForm({ type, player, onBack, onComplete }: { type: ActionType, player: any, onBack: () => void, onComplete: () => void }) {
  const { transferMoney, buyProperty, players, properties, buildHouse, buildHouseFree, settings, declareBankruptcy, bank, executeTrade } = useGameStore();
  const [amount, setAmount] = useState("");
  const [targetId, setTargetId] = useState("");
  const [sourceId, setSourceId] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [payTo, setPayTo] = useState("BANK");
  const [isFree, setIsFree] = useState(false);
  const [creditorId, setCreditorId] = useState("");
  
  // Trade state
  const [tradePartnerId, setTradePartnerId] = useState("");
  const [myTradeCash, setMyTradeCash] = useState("");
  const [theirTradeCash, setTheirTradeCash] = useState("");
  const [mySelectedProps, setMySelectedProps] = useState<string[]>([]);
  const [theirSelectedProps, setTheirSelectedProps] = useState<string[]>([]);

  const availableProps = settings.buyEverything ? PROPERTIES : STANDARD_PROPERTIES;
  const otherPlayers = players.filter((p: any) => p.id !== player.id && !p.isBankrupt);

  useEffect(() => {
    if (type === 'rent' && propertyId) {
      const prop = PROPERTIES.find(p => p.id === propertyId);
      const ownerId = properties[propertyId]?.ownerId;
      if (prop && ownerId) {
        setTargetId(ownerId);
      }
    }
  }, [propertyId, type, properties]);

  const handleSubmit = () => {
    const val = parseInt(amount);
    if (type === 'pass_go') transferMoney('BANK', player.id, 200, "Passed GO");
    else if (type === 'jackpot') {
      if (bank.freeParkingPot > 0) transferMoney('FREE_PARKING', player.id, bank.freeParkingPot, "Jackpot");
      else return;
    }
    else if (type === 'pay' && val && targetId) transferMoney(player.id, targetId, val, "Payment");
    else if (type === 'receive' && val && sourceId) transferMoney(sourceId, player.id, val, "Received");
    else if (type === 'buy' && propertyId) {
      const prop = PROPERTIES.find(p => p.id === propertyId);
      const price = isFree ? 0 : (prop?.price || 0);
      buyProperty(player.id, propertyId, price, payTo);
    }
    else if (type === 'rent' && val && targetId) {
      transferMoney(player.id, targetId, val, "Rent");
    }
    else if (type === 'build' && propertyId) isFree ? buildHouseFree(propertyId) : buildHouse(propertyId, payTo);
    else if (type === 'sale_card' && val) transferMoney(player.id, 'BANK', val, "Bought Sale Card");
    else if (type === 'spin') {
      if (val && targetId) transferMoney(player.id, targetId, val, "Spin Penalty");
      else if (val && sourceId) transferMoney(sourceId, player.id, val, "Spin Reward");
    }
    else if (type === 'trade' && tradePartnerId) {
      executeTrade(player.id, tradePartnerId, 
        { cash: parseInt(myTradeCash || "0"), properties: mySelectedProps },
        { cash: parseInt(theirTradeCash || "0"), properties: theirSelectedProps }
      );
    }
    else if (type === 'bankruptcy' && creditorId) declareBankruptcy(player.id, creditorId);
    else return;
    onComplete();
  };

  const AmountInput = ({ value, onChange, label = "Amount", autoFocus = false }: { value: string, onChange: (v: string) => void, label?: string, autoFocus?: boolean }) => (
    <div className="space-y-3">
      <Label className="text-lg">{label}</Label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground">$</span>
        <Input type="number" className="pl-8 h-14 text-2xl font-mono" placeholder="0" value={value} onChange={e => onChange(e.target.value)} autoFocus={autoFocus} />
      </div>
      <div className="grid grid-cols-5 gap-2">
        {[1, 10, 50, 100, 500].map(val => (
          <Button key={val} variant="outline" size="sm" onClick={() => onChange((parseInt(value || "0") + val).toString())}>
            +{val}
          </Button>
        ))}
        <Button variant="ghost" size="sm" className="col-span-5 text-muted-foreground" onClick={() => onChange("")}>Clear</Button>
      </div>
    </div>
  );

  const PlayerSelect = ({ label, value, onChange, includeBank = false }: { label: string, value: string, onChange: (v: string) => void, includeBank?: boolean }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-12"><SelectValue placeholder="Select..." /></SelectTrigger>
        <SelectContent>
          {includeBank && <><SelectItem value="BANK">The Bank</SelectItem><SelectItem value="FREE_PARKING">Free Parking</SelectItem></>}
          {otherPlayers.map((p: any) => (
            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const PropertySelect = ({ filter }: { filter: (p: Property) => boolean }) => (
    <div className="space-y-2">
      <Label>Which Property?</Label>
      <Select value={propertyId} onValueChange={(val) => {
        setPropertyId(val);
        const prop = PROPERTIES.find(p => p.id === val);
        if (prop) {
          if (type === 'rent') {
            setAmount(prop.rent[properties[val]?.houses || 0].toString());
          } else if (type === 'buy') {
            setAmount(prop.price.toString());
          } else if (type === 'build') {
            setAmount(prop.houseCost.toString());
          }
        }
      }}>
        <SelectTrigger className="h-12"><SelectValue placeholder="Select..." /></SelectTrigger>
        <SelectContent>
          <ScrollArea className="h-[200px]">
            {availableProps.filter(filter).map((p: Property) => (
              <SelectItem key={p.id} value={p.id}>
                <span className={cn("inline-block w-3 h-3 rounded-full mr-2", COLOR_MAP[p.color] || 'bg-gray-500')} />
                {p.name} {type === 'buy' ? `($${p.price})` : `($${p.houseCost})`}
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="space-y-6 pt-4">
      {type === 'trade' && (
        <div className="space-y-6">
          <PlayerSelect label="Trade With" value={tradePartnerId} onChange={setTradePartnerId} />
          
          {tradePartnerId && (
            <>
              <div className="space-y-4 p-4 border rounded-lg bg-secondary/5">
                <h4 className="font-bold border-b pb-2">Your Offer ({player.name})</h4>
                <AmountInput label="Cash" value={myTradeCash} onChange={setMyTradeCash} />
                <Label>Properties</Label>
                <ScrollArea className="h-32 border rounded-md p-2">
                  <div className="space-y-2">
                    {availableProps.filter(p => properties[p.id]?.ownerId === player.id).map(p => (
                      <div key={p.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`my-${p.id}`} 
                          checked={mySelectedProps.includes(p.id)}
                          onCheckedChange={(checked) => {
                            setMySelectedProps(prev => checked ? [...prev, p.id] : prev.filter(id => id !== p.id));
                          }}
                        />
                        <label htmlFor={`my-${p.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {p.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="space-y-4 p-4 border rounded-lg bg-secondary/5">
                <h4 className="font-bold border-b pb-2">Their Offer ({players.find((p: any) => p.id === tradePartnerId)?.name})</h4>
                <AmountInput label="Cash" value={theirTradeCash} onChange={setTheirTradeCash} />
                <Label>Properties</Label>
                <ScrollArea className="h-32 border rounded-md p-2">
                  <div className="space-y-2">
                    {availableProps.filter(p => properties[p.id]?.ownerId === tradePartnerId).map(p => (
                      <div key={p.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`their-${p.id}`} 
                          checked={theirSelectedProps.includes(p.id)}
                          onCheckedChange={(checked) => {
                            setTheirSelectedProps(prev => checked ? [...prev, p.id] : prev.filter(id => id !== p.id));
                          }}
                        />
                        <label htmlFor={`their-${p.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {p.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </>
          )}
        </div>
      )}
      {type === 'jackpot' && (
        <div className="p-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg border border-yellow-300 dark:border-yellow-700 text-center">
          <Gift className="w-12 h-12 mx-auto mb-3 text-yellow-600" />
          <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">${bank.freeParkingPot}</p>
          <p className="text-sm text-yellow-600 dark:text-yellow-500 mt-2">Free Parking Jackpot goes to {player.name}</p>
        </div>
      )}
      {(type === 'buy' || type === 'build') && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10 border border-accent/20">
          <div className="space-y-0.5">
            <Label className="text-base text-accent font-bold">{type === 'buy' ? 'Free Acquisition' : 'Build for Free'}</Label>
            <p className="text-xs text-muted-foreground italic">{type === 'buy' ? 'Acquire for $0 (House Rules)' : 'Build without paying'}</p>
          </div>
          <Switch checked={isFree} onCheckedChange={setIsFree} />
        </div>
      )}
      {['pay', 'rent'].includes(type!) && (
        <>
          {type === 'rent' && <PropertySelect filter={p => !!properties[p.id]?.ownerId} />}
          <AmountInput value={amount} onChange={setAmount} autoFocus />
          <PlayerSelect 
            label="To Whom?" 
            value={targetId} 
            onChange={setTargetId} 
            includeBank 
          />
        </>
      )}
      {type === 'receive' && <><AmountInput value={amount} onChange={setAmount} autoFocus /><PlayerSelect label="From Whom?" value={sourceId} onChange={setSourceId} includeBank /></>}
      {type === 'buy' && (
        <>
          <PropertySelect filter={p => !properties[p.id]?.ownerId} />
          {!isFree && (
            <div className="space-y-2">
              <Label>Pay To</Label>
              <Select value={payTo} onValueChange={setPayTo}>
                <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="BANK">The Bank</SelectItem>
                  <SelectItem value="FREE_PARKING">Free Parking</SelectItem>
                  {otherPlayers.map((p: any) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </>
      )}
      {type === 'build' && (
        <>
          <PropertySelect filter={p => properties[p.id]?.ownerId === player.id && p.houseCost > 0} />
          {!isFree && (
            <div className="space-y-2">
              <Label>Pay To</Label>
              <Select value={payTo} onValueChange={setPayTo}>
                <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="BANK">The Bank</SelectItem>
                  <SelectItem value="FREE_PARKING">Free Parking</SelectItem>
                  {otherPlayers.map((p: any) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </>
      )}
      {type === 'bankruptcy' && (
        <>
          <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
            <p className="text-destructive font-bold text-center">{player.name} is declaring bankruptcy!</p>
            <p className="text-sm text-muted-foreground text-center mt-2">All properties and cash will be transferred.</p>
          </div>
          <PlayerSelect label="Owed To (Creditor)" value={creditorId} onChange={setCreditorId} includeBank />
        </>
      )}
      {type === 'sale_card' && (
        <>
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 text-sm italic">
            "You may have up to three Sale cards at a time. Pay the price on the card to the Bank."
          </div>
          <AmountInput value={amount} onChange={setAmount} autoFocus />
        </>
      )}
      {type === 'spin' && (
        <div className="space-y-4">
          <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 text-sm italic">
            "Spin the spinner! Red? Pay to Jackpot. Green? Collect from Jackpot or follow instructions."
          </div>
          <AmountInput value={amount} onChange={setAmount} autoFocus />
          <div className="grid grid-cols-2 gap-3">
             <Button variant={targetId === 'FREE_PARKING' ? 'default' : 'outline'} onClick={() => { setTargetId('FREE_PARKING'); setSourceId(''); }}>Pay to Jackpot</Button>
             <Button variant={sourceId === 'FREE_PARKING' ? 'default' : 'outline'} onClick={() => { setSourceId('FREE_PARKING'); setTargetId(''); }}>Collect from Jackpot</Button>
          </div>
          <PlayerSelect label="Other (e.g. Bank/Player)" value={targetId || sourceId} onChange={(v) => { if (targetId) setTargetId(v); else setSourceId(v); }} includeBank />
        </div>
      )}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" className="flex-1 h-12" onClick={onBack}>Back</Button>
        <Button className="flex-1 h-12 text-lg font-bold" onClick={handleSubmit}>Confirm</Button>
      </div>
    </div>
  );
}
