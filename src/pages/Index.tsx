import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { DishCard } from "@/components/DishCard";
import { RandomDishModal } from "@/components/RandomDishModal";
import { DishDetailModal } from "@/components/DishDetailModal";
import { FilterSection } from "@/components/FilterSection";
import { MoodSelector } from "@/components/MoodSelector";
import { StatsSection } from "@/components/StatsSection";
import { Footer } from "@/components/Footer";
import { allDishes, Dish, DishTag } from "@/lib/dishesData";
import { useFavorites } from "@/hooks/useFavorites";
import { useMealHistory } from "@/hooks/useMealHistory";
import { Button } from "@/components/ui/button";
import { Heart, History, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isRandomModalOpen, setIsRandomModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [selectedTags, setSelectedTags] = useState<DishTag[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { history, addToHistory, clearHistory } = useMealHistory();
  const { toast } = useToast();

  const getRandomDish = (tags?: DishTag[]) => {
    const filteredDishes = tags && tags.length > 0
      ? allDishes.filter(dish => tags.some(tag => dish.tags.includes(tag)))
      : allDishes;
    
    if (filteredDishes.length === 0) {
      toast({
        title: "Không tìm thấy món ăn",
        description: "Thử bỏ bớt filter nhé!",
        variant: "destructive",
      });
      return null;
    }
    
    return filteredDishes[Math.floor(Math.random() * filteredDishes.length)];
  };

  const handleRandomize = () => {
    const dish = getRandomDish(selectedTags.length > 0 ? selectedTags : undefined);
    if (dish) {
      setSelectedDish(dish);
      setIsRandomModalOpen(true);
      addToHistory(dish.id, dish.title);
    }
  };

  const handleMoodSelect = (mood: string) => {
    let moodTags: DishTag[] = [];
    switch (mood) {
      case "quick":
        moodTags = ["quick"];
        break;
      case "healthy":
        moodTags = ["healthy"];
        break;
      case "comfort":
        moodTags = ["soup", "rice"];
        break;
      case "light":
        moodTags = ["healthy", "vegetarian"];
        break;
      case "special":
        moodTags = ["vietnamese"];
        break;
    }
    
    const dish = getRandomDish(moodTags);
    if (dish) {
      setSelectedDish(dish);
      setIsRandomModalOpen(true);
      addToHistory(dish.id, dish.title);
      toast({
        title: "Gợi ý theo mood của bạn! 🎭",
        description: `Món ${dish.title} phù hợp với tâm trạng của bạn`,
      });
    }
  };

  const handleTagToggle = (tag: DishTag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleDishClick = (dish: Dish) => {
    setSelectedDish(dish);
    setIsDetailModalOpen(true);
  };

  const filteredDishes = allDishes.filter(dish => {
    if (showFavoritesOnly && !isFavorite(dish.id)) return false;
    if (selectedTags.length === 0) return true;
    return selectedTags.some(tag => dish.tags.includes(tag));
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <Hero onRandomize={handleRandomize} />

      <main className="flex-1 container mx-auto px-4 py-12 space-y-12">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            onClick={() => {
              setShowFavoritesOnly(!showFavoritesOnly);
              setShowHistory(false);
            }}
            className="rounded-full"
          >
            <Heart className={`mr-2 h-4 w-4 ${showFavoritesOnly ? "fill-current" : ""}`} />
            Món Yêu Thích ({favorites.length})
          </Button>
          
          <Button
            variant={showHistory ? "default" : "outline"}
            onClick={() => {
              setShowHistory(!showHistory);
              setShowFavoritesOnly(false);
            }}
            className="rounded-full"
          >
            <History className="mr-2 h-4 w-4" />
            Lịch Sử ({history.length})
          </Button>

          {history.length > 0 && (
            <Button
              variant="ghost"
              onClick={() => {
                clearHistory();
                toast({ title: "Đã xóa lịch sử!" });
              }}
              className="rounded-full"
            >
              Xóa Lịch Sử
            </Button>
          )}
        </div>

        {/* History View */}
        {showHistory && (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-foreground">📅 Lịch sử món đã ăn</h2>
            {history.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Chưa có lịch sử. Hãy thử random món nhé!
              </p>
            ) : (
              <div className="space-y-2">
                {history.slice(0, 20).map((record, index) => {
                  const date = new Date(record.timestamp);
                  return (
                    <div
                      key={`${record.dishId}-${index}`}
                      className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{record.dishTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          {date.toLocaleDateString("vi-VN")} - {date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        {!showHistory && (
          <>
            {/* Mood Section */}
            <div id="mood-section">
              <MoodSelector onMoodSelect={handleMoodSelect} />
            </div>

            {/* Filter Section */}
            <FilterSection selectedTags={selectedTags} onTagToggle={handleTagToggle} />

            {/* Stats */}
            {history.length > 0 && (
              <StatsSection history={history} favorites={favorites} />
            )}

            {/* Dishes Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-foreground">
                  {showFavoritesOnly ? "❤️ Món Yêu Thích" : "🍜 Tất cả món ăn"}
                </h2>
                <p className="text-muted-foreground">
                  {filteredDishes.length} món
                </p>
              </div>

              {filteredDishes.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <Sparkles className="h-16 w-16 mx-auto text-muted-foreground" />
                  <p className="text-lg text-muted-foreground">
                    {showFavoritesOnly
                      ? "Chưa có món yêu thích. Hãy thêm vào nhé!"
                      : "Không tìm thấy món ăn phù hợp."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDishes.map((dish) => (
                    <div key={dish.id} className="relative group">
                      <DishCard
                        {...dish}
                        onClick={() => handleDishClick(dish)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-background z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(dish.id);
                          toast({
                            title: isFavorite(dish.id) ? "Đã bỏ yêu thích" : "Đã thêm vào yêu thích!",
                            description: dish.title,
                          });
                        }}
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            isFavorite(dish.id)
                              ? "fill-primary text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />

      {/* Modals */}
      {selectedDish && (
        <>
          <RandomDishModal
            isOpen={isRandomModalOpen}
            onClose={() => setIsRandomModalOpen(false)}
            dish={selectedDish}
            onShuffle={() => {
              const newDish = getRandomDish(selectedTags.length > 0 ? selectedTags : undefined);
              if (newDish) {
                setSelectedDish(newDish);
                addToHistory(newDish.id, newDish.title);
              }
            }}
          />
          
          <DishDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            dish={{
              ...selectedDish,
              servings: 2,
              calories: selectedDish.calories || 400,
              ingredients: [
                "Nguyên liệu 1",
                "Nguyên liệu 2",
                "Nguyên liệu 3",
              ],
              steps: [
                "Bước 1: Chuẩn bị nguyên liệu",
                "Bước 2: Chế biến",
                "Bước 3: Hoàn thành",
              ],
            }}
          />
        </>
      )}
    </div>
  );
};

export default Index;
