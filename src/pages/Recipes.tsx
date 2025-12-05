import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Search, Clock, Users, ChefHat, Star, BookOpen, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecipeDetailModal } from "@/components/RecipeDetailModal";
import { useFavorites } from "@/hooks/useFavorites";
import { Button } from "@/components/ui/button";

import phoImg from "@/assets/pho.jpg";
import bunBoImg from "@/assets/bun-bo.jpg";
import comTamImg from "@/assets/com-tam.jpg";
import goiCuonImg from "@/assets/goi-cuon.jpg";
import chaGioImg from "@/assets/cha-gio.jpg";
import banhMiImg from "@/assets/banh-mi.jpg";

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

const recipes: Recipe[] = [
  {
    id: "1",
    title: "Phở Bò Hà Nội",
    description: "Công thức nấu phở bò truyền thống với nước dùng ninh xương đậm đà",
    image: phoImg,
    time: "3 giờ",
    servings: 4,
    difficulty: "Trung bình",
    category: "Món nước",
    rating: 4.9,
  },
  {
    id: "2",
    title: "Bún Bò Huế",
    description: "Hướng dẫn chi tiết nấu bún bò Huế chuẩn vị miền Trung",
    image: bunBoImg,
    time: "2.5 giờ",
    servings: 6,
    difficulty: "Trung bình",
    category: "Món nước",
    rating: 4.8,
  },
  {
    id: "3",
    title: "Cơm Tấm Sườn Bì Chả",
    description: "Bí quyết làm cơm tấm Sài Gòn với sườn nướng thơm lừng",
    image: comTamImg,
    time: "1 giờ",
    servings: 2,
    difficulty: "Dễ",
    category: "Cơm",
    rating: 4.7,
  },
  {
    id: "4",
    title: "Gỏi Cuốn Tôm Thịt",
    description: "Cách cuốn gỏi cuốn đẹp mắt kèm nước chấm đậu phộng",
    image: goiCuonImg,
    time: "30 phút",
    servings: 4,
    difficulty: "Dễ",
    category: "Khai vị",
    rating: 4.6,
  },
  {
    id: "5",
    title: "Chả Giò Giòn Rụm",
    description: "Công thức chả giò vàng ruộm, giòn tan không bị ngấm dầu",
    image: chaGioImg,
    time: "45 phút",
    servings: 6,
    difficulty: "Trung bình",
    category: "Khai vị",
    rating: 4.8,
  },
  {
    id: "6",
    title: "Bánh Mì Việt Nam",
    description: "Làm bánh mì tại nhà với vỏ giòn và nhân đầy đặn",
    image: banhMiImg,
    time: "2 giờ",
    servings: 4,
    difficulty: "Khó",
    category: "Bánh",
    rating: 4.9,
  },
];

const categories = ["Tất cả", "Món nước", "Cơm", "Khai vị", "Bánh"];

const Recipes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Tất cả" || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-primary/5 to-background py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                Công Thức Nấu Ăn
              </h1>
              <p className="text-muted-foreground">
                Hướng dẫn chi tiết từng bước
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm công thức..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 rounded-full border-primary/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="h-auto p-1 bg-transparent flex-wrap justify-start gap-1">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Recipes Grid */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {filteredRecipes.length} công thức
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map((recipe) => (
            <Card
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className="group overflow-hidden border-primary/10 hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <Badge className="absolute top-3 left-3 bg-background/90 text-foreground">
                  {recipe.category}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 bg-background/80 hover:bg-background"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(`recipe-${recipe.id}`);
                  }}
                >
                  <Heart 
                    className={`h-4 w-4 ${
                      isFavorite(`recipe-${recipe.id}`) 
                        ? "fill-red-500 text-red-500" 
                        : "text-muted-foreground"
                    }`} 
                  />
                </Button>
                <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{recipe.rating}</span>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors mb-2">
                  {recipe.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {recipe.description}
                </p>
              </CardContent>

              <CardFooter className="px-4 pb-4 pt-0 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {recipe.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {recipe.servings} người
                  </span>
                </div>
                <Badge variant="outline" className={getDifficultyColor(recipe.difficulty)}>
                  <ChefHat className="h-3 w-3 mr-1" />
                  {recipe.difficulty}
                </Badge>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Không tìm thấy công thức
            </h3>
            <p className="text-muted-foreground">
              Thử tìm kiếm với từ khóa khác
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 Hôm Nay Ăn Gì. Khám phá thế giới ẩm thực Việt Nam.
          </p>
        </div>
      </footer>

      {/* Recipe Detail Modal */}
      <RecipeDetailModal
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        recipe={selectedRecipe}
      />
    </div>
  );
};

export default Recipes;
