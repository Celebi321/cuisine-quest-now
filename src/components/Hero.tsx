import { Button } from "./ui/button";
import { Shuffle, Sparkles } from "lucide-react";
import logo from "@/assets/logo.png";

interface HeroProps {
  onRandomize: () => void;
}

export const Hero = ({ onRandomize }: HeroProps) => {
  return (
    <div className="relative w-full py-16 md:py-24 px-4 bg-gradient-to-br from-background via-muted/20 to-accent/10 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      
      <div className="container mx-auto text-center space-y-8 max-w-4xl relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-6 animate-fade-in">
          <img src={logo} alt="Logo" className="h-24 w-24 md:h-32 md:w-32 drop-shadow-lg" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground animate-fade-in">
            Hôm Nay Ăn Gì?
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Không biết ăn gì? Để chúng tôi gợi ý món ngon cho bạn! 🍜✨
          </p>
        </div>
        
        <div className="pt-6 animate-fade-in flex flex-col sm:flex-row gap-4 justify-center items-center" style={{ animationDelay: "0.2s" }}>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
            onClick={onRandomize}
          >
            <Shuffle className="mr-2 h-5 w-5" />
            Random Món Ngay!
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            className="text-lg px-8 py-6 rounded-full border-2 hover:scale-105 transition-all"
            onClick={() => {
              const moodSection = document.getElementById("mood-section");
              moodSection?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Gợi ý theo Mood
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground animate-fade-in pt-4" style={{ animationDelay: "0.3s" }}>
          💡 Mẹo: Lưu món yêu thích và xem lịch sử món đã ăn!
        </p>
      </div>
    </div>
  );
};
