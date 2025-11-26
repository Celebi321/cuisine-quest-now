import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Shuffle } from "lucide-react";
import { Meal } from "@/lib/dishesData";
import { DishCard } from "./DishCard";

interface RandomMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: Meal;
  onShuffle: () => void;
}

export const RandomMealModal = ({
  isOpen,
  onClose,
  meal,
  onShuffle,
}: RandomMealModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Bữa Ăn Hoàn Chỉnh Cho Bạn!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center space-y-2 animate-slide-in">
            <h3 className="text-xl font-bold text-primary">{meal.name}</h3>
            <p className="text-muted-foreground">{meal.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 animate-slide-in" style={{ animationDelay: "0.1s" }}>
            {meal.dishes.map((dish, idx) => (
              <div key={dish.id} style={{ animationDelay: `${0.1 + idx * 0.1}s` }}>
                <DishCard
                  title={dish.title}
                  image={dish.image}
                  rating={dish.rating}
                  difficulty={dish.difficulty}
                  time={dish.time}
                  category={dish.category}
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 hover:scale-105 transition-all"
              onClick={onShuffle}
            >
              <Shuffle className="mr-2 h-4 w-4" />
              Gợi ý bữa khác
            </Button>
            <Button className="flex-1 hover:scale-105 transition-all animate-pulse-glow" onClick={onClose}>
              Quyết định rồi!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
