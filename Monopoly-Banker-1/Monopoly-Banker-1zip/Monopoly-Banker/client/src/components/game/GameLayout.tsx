import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, Settings, History, LayoutDashboard } from "lucide-react";

interface GameLayoutProps {
  children: React.ReactNode;
}

export function GameLayout({ children }: GameLayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Board" },
    { href: "/properties", icon: Home, label: "Properties" },
    { href: "/ledger", icon: History, label: "Ledger" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col md:flex-row">
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-card z-10 sticky top-0">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-serif font-bold text-xl">$</div>
           <span className="font-serif font-bold text-lg text-primary">PolyBank</span>
        </div>
        <Button variant="ghost" size="icon" asChild>
           <Link href="/"><Settings className="w-5 h-5" /></Link>
        </Button>
      </div>

      <aside className="hidden md:flex flex-col w-64 border-r bg-card h-screen sticky top-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-serif font-bold text-2xl shadow-lg">$</div>
          <span className="font-serif font-bold text-xl text-primary tracking-wide">PolyBank</span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button 
                  variant={isActive ? "secondary" : "ghost"} 
                  className={cn("w-full justify-start gap-3 h-12 text-base", isActive && "font-bold text-primary bg-primary/10")}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
           <Button variant="outline" className="w-full justify-start gap-3" asChild>
             <Link href="/"><Settings className="w-4 h-4" /> New Game</Link>
           </Button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-[calc(100vh-65px)] md:h-screen overflow-hidden">
        <ScrollArea className="flex-1">
          <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </ScrollArea>
        
        <nav className="md:hidden border-t bg-card flex justify-around p-2 pb-safe">
           {navItems.map((item) => {
             const isActive = location === item.href;
             return (
               <Link key={item.href} href={item.href}>
                 <div className={cn(
                   "flex flex-col items-center justify-center p-2 rounded-lg transition-colors",
                   isActive ? "text-primary bg-primary/10" : "text-muted-foreground"
                 )}>
                   <item.icon className="w-6 h-6" />
                   <span className="text-xs mt-1 font-medium">{item.label}</span>
                 </div>
               </Link>
             );
           })}
        </nav>
      </main>
    </div>
  );
}
