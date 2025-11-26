import { MealRecord } from "@/hooks/useMealHistory";
import { Card } from "./ui/card";
import { TrendingUp, Clock, Heart } from "lucide-react";

interface StatsSectionProps {
  history: MealRecord[];
  favorites: string[];
}

export const StatsSection = ({ history, favorites }: StatsSectionProps) => {
  // Calculate most eaten dish
  const dishCounts = history.reduce((acc, record) => {
    acc[record.dishId] = (acc[record.dishId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostEatenDish = Object.entries(dishCounts)
    .sort(([, a], [, b]) => b - a)[0];

  const mostEatenTitle = mostEatenDish 
    ? history.find(r => r.dishId === mostEatenDish[0])?.dishTitle 
    : "Chưa có";

  // Calculate days since last meal
  const daysSinceLastMeal = history.length > 0
    ? Math.floor((Date.now() - history[0].timestamp) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold mb-6 text-foreground">📊 Thống kê của bạn</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h4 className="font-semibold text-foreground">Món ăn nhiều nhất</h4>
          </div>
          <p className="text-2xl font-bold text-primary">{mostEatenTitle}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {mostEatenDish ? `${mostEatenDish[1]} lần` : ""}
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-5 w-5 text-secondary" />
            <h4 className="font-semibold text-foreground">Bữa ăn gần nhất</h4>
          </div>
          <p className="text-2xl font-bold text-secondary">
            {daysSinceLastMeal === 0 ? "Hôm nay" : `${daysSinceLastMeal} ngày trước`}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {history.length > 0 ? history[0].dishTitle : "Chưa có"}
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-5 w-5 text-accent" />
            <h4 className="font-semibold text-foreground">Món yêu thích</h4>
          </div>
          <p className="text-2xl font-bold text-accent">{favorites.length}</p>
          <p className="text-sm text-muted-foreground mt-1">món đã lưu</p>
        </Card>
      </div>
    </div>
  );
};
