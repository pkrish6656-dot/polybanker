import { Link, useLocation } from "wouter";
import { LayoutDashboard, History, Settings, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: LayoutDashboard, label: "Board" },
    { href: "/history", icon: History, label: "History" },
    { href: "/setup", icon: Settings, label: "Setup" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:top-0 md:bottom-auto bg-card/90 backdrop-blur-lg border-t md:border-t-0 md:border-b border-white/10 shadow-2xl py-2 md:py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo / Title (Hidden on mobile to save space) */}
          <div className="hidden md:flex items-center gap-2">
            <div className="bg-primary/20 p-2 rounded-xl text-primary">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold font-display tracking-wider text-white">
              MONOPOLY BANKER
            </span>
          </div>

          {/* Nav Items */}
          <div className="flex items-center justify-around w-full md:w-auto md:gap-8">
            {navItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href} className={cn(
                    "flex flex-col md:flex-row items-center gap-1 md:gap-3 px-4 py-2 rounded-xl transition-all duration-300",
                    isActive 
                      ? "bg-primary/15 text-primary scale-105" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}>
                  <Icon className={cn("w-6 h-6", isActive && "fill-current opacity-20")} />
                  <span className={cn("text-xs md:text-sm font-medium", isActive && "font-bold")}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
