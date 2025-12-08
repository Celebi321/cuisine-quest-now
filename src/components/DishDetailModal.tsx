import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Clock, ChefHat, Star, Users, Flame, Plus } from "lucide-react";
import { Separator } from "./ui/separator";
import { RatingSection } from "./RatingSection";
import { CommentSection } from "./CommentSection";
import { ShareButton } from "./ShareButton";
import { useMealLogs } from "@/hooks/useMealLogs";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
interface DishDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  dish: {
    id?: string;
    title: string;
    image: string;
    rating: number;
    difficulty?: string;
    time?: string;
    category?: string;
    description?: string;
    servings?: number;
    calories?: number;
    ingredients?: string[];
    steps?: string[];
  };
}

export const DishDetailModal = ({ isOpen, onClose, dish }: DishDetailModalProps) => {
  const { addMeal, isAddingMeal } = useMealLogs();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToToday = () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    addMeal({
      dish_id: dish.id || dish.title,
      dish_title: dish.title,
      dish_category: dish.category,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{dish.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <img
              src={dish.image}
              alt={dish.title}
              className="h-full w-full object-cover"
            />
            {dish.category && (
              <Badge className="absolute right-3 top-3 bg-primary text-primary-foreground">
                {dish.category}
              </Badge>
            )}
          </div>

          {/* Quick Info */}
          <div className="flex flex-wrap gap-4">
            {dish.time && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-medium">Thời gian:</span>
                <span className="text-muted-foreground">{dish.time}</span>
              </div>
            )}
            {dish.difficulty && (
              <div className="flex items-center gap-2 text-sm">
                <ChefHat className="h-5 w-5 text-primary" />
                <span className="font-medium">Độ khó:</span>
                <span className="text-muted-foreground">{dish.difficulty}</span>
              </div>
            )}
            {dish.servings && (
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-medium">Khẩu phần:</span>
                <span className="text-muted-foreground">{dish.servings} người</span>
              </div>
            )}
            {dish.calories && (
              <div className="flex items-center gap-2 text-sm">
                <Flame className="h-5 w-5 text-primary" />
                <span className="font-medium">Calories:</span>
                <span className="text-muted-foreground">{dish.calories} kcal</span>
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < dish.rating
                    ? "fill-accent text-accent"
                    : "text-muted-foreground"
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              ({dish.rating}/5)
            </span>
          </div>

          {/* Description */}
          {dish.description && (
            <div>
              <h3 className="mb-2 text-lg font-semibold">Mô tả</h3>
              <p className="text-muted-foreground">{dish.description}</p>
            </div>
          )}

          <Separator />

          {/* Ingredients */}
          {dish.ingredients && dish.ingredients.length > 0 && (
            <div>
              <h3 className="mb-3 text-lg font-semibold">Nguyên liệu</h3>
              <ul className="space-y-2">
                {dish.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Separator />

          {/* Steps */}
          {dish.steps && dish.steps.length > 0 && (
            <div>
              <h3 className="mb-3 text-lg font-semibold">Các bước thực hiện</h3>
              <ol className="space-y-4">
                {dish.steps.map((step, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {index + 1}
                    </div>
                    <p className="flex-1 pt-1 text-muted-foreground">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <Separator />

          {/* User Ratings & Comments */}
          {dish.id && (
            <>
              <RatingSection dishId={dish.id} />
              
              <Separator />
              
              <CommentSection dishId={dish.id} />
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              className="flex-1 gap-2" 
              onClick={handleAddToToday}
              disabled={isAddingMeal}
            >
              <Plus className="h-4 w-4" />
              Thêm vào hôm nay
            </Button>
            <ShareButton 
              title={dish.title}
              description={dish.description}
              image={dish.image}
              className="flex-1"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
