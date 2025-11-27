import { Button } from "./ui/button";
import { Shuffle, Sparkles, UtensilsCrossed } from "lucide-react";
import logo from "@/assets/logo.png";
import { SearchBar } from "./SearchBar";

interface HeroProps {
  onRandomize: () => void;
  onRandomMeal: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export const Hero = ({ onRandomize, onRandomMeal, searchValue, onSearchChange }: HeroProps) => {
  return (
    <div className="relative w-full py-8 md:py-12 px-4 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto text-center space-y-6 max-w-2xl relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-4 animate-fade-in">
          <img src={logo} alt="Souzy Logo" className="h-20 w-20 md:h-24 md:w-24 drop-shadow-lg opacity-90 mix-blend-multiply dark:mix-blend-screen dark:opacity-80" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground animate-fade-in">
            Hôm Nay Ăn Gì?
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Bạn không biết hôm nay ăn gì? Chúng mình giúp bạn! 🍜
          </p>
        </div>

        {/* Search Bar */}
        <div className="pt-2 animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <SearchBar 
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Tìm món ăn hoặc bữa ăn..."
          />
        </div>
        
        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:animate-shake animate-pulse-glow"
            onClick={onRandomize}
          >
            <Shuffle className="mr-2 h-5 w-5" />
            Random Món
          </Button>
          <Button 
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:animate-shake"
            onClick={onRandomMeal}
          >
            <UtensilsCrossed className="mr-2 h-5 w-5" />
            Random Bữa Ăn
          </Button>
        </div>
      </div>
    </div>
  );
};
