import { GameLayout } from "@/components/game/GameLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PROPERTIES, Property } from "@/lib/monopoly-data";
import { useGameStore } from "@/lib/game-store";
import { cn } from "@/lib/utils";
import { Home } from "lucide-react";

export default function PropertiesPage() {
  const { properties, players } = useGameStore();

  const getOwnerName = (ownerId: string | null) => {
    if (!ownerId) return "Bank";
    const player = players.find(p => p.id === ownerId);
    return player ? player.name : "Unknown";
  };

  const getOwnerColor = (ownerId: string | null) => {
    if (!ownerId) return undefined;
    const player = players.find(p => p.id === ownerId);
    return player ? player.color : undefined;
  };

  const groupedProperties = PROPERTIES.reduce((acc, prop) => {
    const group = acc.find(g => g.color === prop.color);
    if (group) {
      group.items.push(prop);
    } else {
      acc.push({ color: prop.color, items: [prop] });
    }
    return acc;
  }, [] as { color: string, items: Property[] }[]);

  return (
    <GameLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-serif font-bold">Properties</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupedProperties.map((group) => (
            <Card key={group.color} className="overflow-hidden border-2">
              <div className={cn("h-4 w-full", getColorClass(group.color))} />
              <CardContent className="p-4 space-y-4">
                {group.items.map((prop) => {
                  const state = properties[prop.id];
                  const ownerColor = getOwnerColor(state?.ownerId);
                  
                  return (
                    <div key={prop.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/20 gap-2" data-testid={`property-${prop.id}`}>
                      <div className="flex flex-col">
                        <span className="font-bold">{prop.name}</span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                          {state?.mortgaged ? (
                            <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">MORTGAGED</Badge>
                          ) : (
                            <span>Rent: ${prop.rent[state?.houses || 0]}</span>
                          )}
                          {state?.houses > 0 && (
                            <div className="flex items-center text-green-600 font-bold">
                              <Home className="w-3 h-3 mr-1" /> {state.houses === 5 ? 'Hotel' : state.houses}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {state?.ownerId ? (
                         <div 
                           className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm shrink-0"
                           style={{ backgroundColor: ownerColor }}
                         >
                           {getOwnerName(state.ownerId)}
                         </div>
                      ) : (
                        <Badge variant="outline" className="bg-background shrink-0">For Sale ${prop.price}</Badge>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </GameLayout>
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
    case 'railroad': return 'bg-slate-900';
    case 'utility': return 'bg-slate-500';
    default: return 'bg-gray-500';
  }
}
