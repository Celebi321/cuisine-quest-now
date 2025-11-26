import { Clock, DollarSign, Flame } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Meal } from "@/lib/dishesData";

interface MealCardProps {
  meal: Meal;
  onClick?: () => void;
}

export const MealCard = ({ meal, onClick }: MealCardProps) => {
  const costLevelMap = {
    low: "$",
    mid: "$$",
    high: "$$$",
  };

  return (
    <Card 
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 glass-card border-2"
      onClick={onClick}
    >
      <div className="relative grid grid-cols-2 gap-2 p-3 bg-muted/20">
        {meal.dishes.slice(0, 4).map((dish, idx) => (
          <div key={idx} className="relative aspect-square overflow-hidden rounded-lg">
            <img
              src={dish.image}
              alt={dish.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
        ))}
        <Badge className="absolute right-3 top-3 bg-primary/90 text-primary-foreground shadow-md backdrop-blur-sm">
          Bữa {meal.mealType === "breakfast" ? "Sáng" : meal.mealType === "lunch" ? "Trưa" : "Tối"}
        </Badge>
      </div>
      
      <CardContent className="p-5">
        <h3 className="mb-2 text-xl font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {meal.name}
        </h3>
        <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
          {meal.description}
        </p>
        
        <div className="flex items-center justify-between text-sm mb-3">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{meal.totalTime}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Flame className="h-4 w-4" />
            <span className="font-medium">{meal.totalCalories} kcal</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span className="font-medium">{costLevelMap[meal.totalCost]}</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Gồm: {meal.dishes.map(d => d.title).join(", ")}
        </div>
      </CardContent>
    </Card>
  );
};
