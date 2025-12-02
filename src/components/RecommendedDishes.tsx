import { useMealLogs } from "@/hooks/useMealLogs";
import { useDishes } from "@/hooks/useDishes";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, TrendingUp, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface DishRecommendation {
  id: string;
  title: string;
  image: string;
  category?: string;
  lastEaten?: Date;
  frequency?: number;
}

export const RecommendedDishes = () => {
  const { allMeals } = useMealLogs();
  const { data: dishes = [] } = useDishes();

  // Calculate dish frequencies and last eaten dates
  const dishStats = allMeals.reduce((acc, meal) => {
    if (!acc[meal.dish_id]) {
      acc[meal.dish_id] = {
        count: 0,
        lastEaten: new Date(meal.eaten_at),
        title: meal.dish_title,
        category: meal.dish_category || undefined,
      };
    }
    acc[meal.dish_id].count += 1;
    const eatenDate = new Date(meal.eaten_at);
    if (eatenDate > acc[meal.dish_id].lastEaten) {
      acc[meal.dish_id].lastEaten = eatenDate;
    }
    return acc;
  }, {} as Record<string, { count: number; lastEaten: Date; title: string; category?: string }>);

  // Get top 3 frequently eaten dishes
  const frequentDishes = Object.entries(dishStats)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 3)
    .map(([dishId, stats]) => {
      const dish = dishes.find(d => d.id === dishId);
      return {
        id: dishId,
        title: stats.title,
        image: dish?.image || "/placeholder.svg",
        category: stats.category,
        lastEaten: stats.lastEaten,
        frequency: stats.count,
      };
    });

  // Get dishes not eaten in a long time
  const now = new Date();
  const longestUneatendishes = Object.entries(dishStats)
    .sort(([, a], [, b]) => a.lastEaten.getTime() - b.lastEaten.getTime())
    .slice(0, 1)
    .map(([dishId, stats]) => {
      const dish = dishes.find(d => d.id === dishId);
      return {
        id: dishId,
        title: stats.title,
        image: dish?.image || "/placeholder.svg",
        category: stats.category,
        lastEaten: stats.lastEaten,
        frequency: stats.count,
      };
    });

  if (allMeals.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-8">
      {/* Frequently Eaten Dishes */}
      {frequentDishes.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Món Hay Ăn Gần Đây
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {frequentDishes.map((dish) => (
              <Card
                key={dish.id}
                className="p-4 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="relative aspect-video overflow-hidden rounded-lg mb-3">
                  <img
                    src={dish.image}
                    alt={dish.title}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {dish.category && (
                    <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                      {dish.category}
                    </Badge>
                  )}
                </div>
                <h4 className="font-semibold text-lg mb-2">{dish.title}</h4>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>{dish.frequency} lần</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {formatDistanceToNow(dish.lastEaten!, {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Long Time No Eat */}
      {longestUneatendishes.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-accent" />
            Món Lâu Chưa Ăn
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {longestUneatendishes.map((dish) => (
              <Card
                key={dish.id}
                className="p-6 hover:shadow-lg transition-all cursor-pointer group bg-gradient-to-r from-accent/5 to-accent/10"
              >
                <div className="flex items-center gap-6">
                  <div className="relative w-32 h-32 overflow-hidden rounded-lg flex-shrink-0">
                    <img
                      src={dish.image}
                      alt={dish.title}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-xl mb-2">{dish.title}</h4>
                    {dish.category && (
                      <Badge variant="secondary" className="mb-3">
                        {dish.category}
                      </Badge>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">
                        Lần cuối ăn:{" "}
                        <strong className="text-accent">
                          {formatDistanceToNow(dish.lastEaten!, {
                            addSuffix: true,
                            locale: vi,
                          })}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
