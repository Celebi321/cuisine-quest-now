import { Clock, Users, ChefHat, Star, X, Share2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { RatingSection } from "./RatingSection";
import { CommentSection } from "./CommentSection";

interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  time: string;
  servings: number;
  difficulty: "Dễ" | "Trung bình" | "Khó";
  category: string;
  rating: number;
}

interface RecipeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe | null;
}

export const RecipeDetailModal = ({ isOpen, onClose, recipe }: RecipeDetailModalProps) => {
  if (!recipe) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Dễ":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "Trung bình":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "Khó":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "";
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe.title,
        text: recipe.description,
        url: window.location.href,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header Image */}
        <div className="relative aspect-video">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <Badge className="absolute top-4 left-4 bg-background/90 text-foreground">
            {recipe.category}
          </Badge>
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl font-bold text-white mb-2">{recipe.title}</h2>
            <div className="flex items-center gap-1 text-white/90">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{recipe.rating}</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Info */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{recipe.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{recipe.servings} người</span>
            </div>
            <Badge variant="outline" className={getDifficultyColor(recipe.difficulty)}>
              <ChefHat className="h-3 w-3 mr-1" />
              {recipe.difficulty}
            </Badge>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-foreground mb-2">Mô tả</h3>
            <p className="text-muted-foreground">{recipe.description}</p>
          </div>

          <Separator />

          {/* Rating Section */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Đánh giá của bạn</h3>
            <RatingSection dishId={`recipe-${recipe.id}`} />
          </div>

          <Separator />

          {/* Comment Section */}
          <CommentSection dishId={`recipe-${recipe.id}`} />

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleShare} variant="outline" className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Chia sẻ
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
