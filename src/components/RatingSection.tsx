import { Star } from "lucide-react";
import { useRatings } from "@/hooks/useRatings";

interface RatingSectionProps {
  dishId: string;
}

export const RatingSection = ({ dishId }: RatingSectionProps) => {
  const { averageRating, totalRatings, userRating, submitRating } = useRatings(dishId);

  const handleRating = (rating: number) => {
    submitRating(rating);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRating(star)}
              className="transition-all hover:scale-110 focus:outline-none"
            >
              <Star
                className={`h-6 w-6 ${
                  star <= (userRating || 0)
                    ? "fill-accent text-accent"
                    : "text-muted-foreground hover:text-accent"
                }`}
              />
            </button>
          ))}
        </div>
        {totalRatings > 0 && (
          <div className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{averageRating}</span> / 5
            <span className="ml-1">({totalRatings} đánh giá)</span>
          </div>
        )}
      </div>
      {userRating && (
        <p className="text-xs text-muted-foreground">
          Bạn đã đánh giá {userRating} sao
        </p>
      )}
    </div>
  );
};
