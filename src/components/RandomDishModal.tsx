import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Shuffle } from "lucide-react";
import { DishCard } from "./DishCard";

interface RandomDishModalProps {
  isOpen: boolean;
  onClose: () => void;
  dish: {
    title: string;
    image: string;
    rating: number;
    difficulty?: string;
    time?: string;
    category?: string;
  };
  onShuffle: () => void;
}

export const RandomDishModal = ({
  isOpen,
  onClose,
  dish,
  onShuffle,
}: RandomDishModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Hôm Nay Nên Ăn...
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="animate-in fade-in-50 duration-500">
            <DishCard {...dish} />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onShuffle}
            >
              <Shuffle className="mr-2 h-4 w-4" />
              Gợi ý khác
            </Button>
            <Button className="flex-1" onClick={onClose}>
              Quyết định rồi!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
