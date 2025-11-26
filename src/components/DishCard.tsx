import { Star, Clock, ChefHat } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface DishCardProps {
  title: string;
  image: string;
  rating: number;
  difficulty?: string;
  time?: string;
  category?: string;
  onClick?: () => void;
}

export const DishCard = ({
  title,
  image,
  rating,
  difficulty,
  time,
  category,
  onClick,
}: DishCardProps) => {
  return (
    <Card 
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 glass-card border-2"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted/30">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {category && (
          <Badge className="absolute right-3 top-3 bg-primary/90 text-primary-foreground shadow-md backdrop-blur-sm">
            {category}
          </Badge>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardContent className="p-5">
        <h3 className="mb-3 text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 transition-all duration-200 ${
                  i < rating
                    ? "fill-accent text-accent drop-shadow-sm"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          
          {(difficulty || time) && (
            <div className="flex items-center gap-3 text-muted-foreground">
              {difficulty && (
                <div className="flex items-center gap-1 transition-colors group-hover:text-foreground">
                  <ChefHat className="h-4 w-4" />
                  <span className="font-medium">{difficulty}</span>
                </div>
              )}
              {time && (
                <div className="flex items-center gap-1 transition-colors group-hover:text-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">{time}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
