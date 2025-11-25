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
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {category && (
          <Badge className="absolute right-3 top-3 bg-primary text-primary-foreground">
            {category}
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="mb-3 text-lg font-semibold text-foreground line-clamp-2">
          {title}
        </h3>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < rating
                    ? "fill-accent text-accent"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          
          {(difficulty || time) && (
            <div className="flex items-center gap-3 text-muted-foreground">
              {difficulty && (
                <div className="flex items-center gap-1">
                  <ChefHat className="h-4 w-4" />
                  <span>{difficulty}</span>
                </div>
              )}
              {time && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{time}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
