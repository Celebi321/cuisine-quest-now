import { useState } from "react";
import { Heart, Trash2, Search, Filter, Grid, List } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { allDishes, tagLabels, type DishTag } from "@/lib/dishesData";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DishDetailModal } from "@/components/DishDetailModal";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toggle } from "@/components/ui/toggle";

const Favorites = () => {
  const { favorites, toggleFavorite, isLoading } = useFavorites();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<DishTag[]>([]);
  const [selectedDish, setSelectedDish] = useState<typeof allDishes[0] | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Get favorite dishes from allDishes
  const favoriteDishes = allDishes.filter((dish) => favorites.includes(dish.id));

  // Filter by search and tags
  const filteredDishes = favoriteDishes.filter((dish) => {
    const matchesSearch = dish.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some((tag) => dish.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag: DishTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearAllFavorites = () => {
    favorites.forEach((id) => toggleFavorite(id));
  };

  // Get unique tags from favorite dishes
  const availableTags = Array.from(
    new Set(favoriteDishes.flatMap((dish) => dish.tags))
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Đang tải...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-primary fill-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Món Ăn Yêu Thích
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Quản lý danh sách các món ăn bạn yêu thích. Dễ dàng tìm kiếm và lọc theo sở thích.
          </p>
          
          {!user && (
            <div className="mt-6 p-4 bg-secondary/50 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">
                💡 <Link to="/auth" className="text-primary hover:underline font-medium">Đăng nhập</Link> để đồng bộ danh sách yêu thích trên nhiều thiết bị.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm món yêu thích..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Lọc
                {selectedTags.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {selectedTags.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {availableTags.map((tag) => (
                <DropdownMenuCheckboxItem
                  key={tag}
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={() => toggleTag(tag)}
                >
                  {tagLabels[tag]}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Mode Toggle */}
          <div className="flex gap-1 border rounded-md p-1">
            <Toggle
              pressed={viewMode === "grid"}
              onPressedChange={() => setViewMode("grid")}
              size="sm"
              aria-label="Grid view"
            >
              <Grid className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={viewMode === "list"}
              onPressedChange={() => setViewMode("list")}
              size="sm"
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Toggle>
          </div>

          {/* Clear All */}
          {favorites.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Xóa tất cả
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xóa tất cả yêu thích?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc muốn xóa tất cả {favorites.length} món ăn khỏi danh sách yêu thích? 
                    Hành động này không thể hoàn tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={clearAllFavorites}>
                    Xóa tất cả
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {/* Stats */}
        {favorites.length > 0 && (
          <div className="flex gap-4 mb-6 text-sm text-muted-foreground">
            <span>{favorites.length} món yêu thích</span>
            {filteredDishes.length !== favorites.length && (
              <span>• Hiển thị {filteredDishes.length} kết quả</span>
            )}
          </div>
        )}

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Chưa có món yêu thích
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Khám phá các món ăn và nhấn vào biểu tượng trái tim để thêm vào danh sách yêu thích.
            </p>
            <Link to="/">
              <Button>Khám phá món ăn</Button>
            </Link>
          </div>
        ) : filteredDishes.length === 0 ? (
          <div className="text-center py-16">
            <Search className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Không tìm thấy kết quả
            </h2>
            <p className="text-muted-foreground mb-6">
              Thử thay đổi từ khóa hoặc bộ lọc.
            </p>
            <Button variant="outline" onClick={() => {
              setSearchQuery("");
              setSelectedTags([]);
            }}>
              Xóa bộ lọc
            </Button>
          </div>
        ) : (
          /* Dishes Grid/List */
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "flex flex-col gap-4"
          }>
            {filteredDishes.map((dish) => (
              <Card 
                key={dish.id} 
                className={`group overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 ${
                  viewMode === "list" ? "flex flex-row" : ""
                }`}
                onClick={() => setSelectedDish(dish)}
              >
                <div className={`relative overflow-hidden ${
                  viewMode === "list" ? "w-32 h-24 flex-shrink-0" : "aspect-video"
                }`}>
                  <img
                    src={dish.image}
                    alt={dish.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(dish.id);
                    }}
                    className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                  >
                    <Heart className="h-4 w-4 text-primary fill-primary" />
                  </button>
                </div>
                <CardContent className={`${viewMode === "list" ? "flex-1 py-3" : "p-4"}`}>
                  <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                    {dish.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {dish.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {dish.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tagLabels[tag]}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Footer />

      {/* Dish Detail Modal */}
      <DishDetailModal
        isOpen={!!selectedDish}
        onClose={() => setSelectedDish(null)}
        dish={selectedDish}
      />
    </div>
  );
};

export default Favorites;
