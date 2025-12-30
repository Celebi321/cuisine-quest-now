import { useState, useCallback, useMemo } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { InteractiveCalendar, MealItem } from "@/components/InteractiveCalendar";
import { WeeklyMenuShare } from "@/components/WeeklyMenuShare";
import { ShoppingList } from "@/components/ShoppingList";
import { SmartFilters, MealFilters, defaultFilters } from "@/components/SmartFilters";
import { useDishes } from "@/hooks/useDishes";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Sparkles, 
  LogIn, 
  ShoppingCart, 
  Share2, 
  Filter,
  Flame,
  Coins
} from "lucide-react";
import { Link } from "react-router-dom";

const WeeklyPlanner = () => {
  const { user } = useAuth();
  const { dishes } = useDishes();
  const [meals, setMeals] = useState<MealItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<"breakfast" | "lunch" | "dinner" | null>(null);
  const [selectedDishId, setSelectedDishId] = useState<string>("");
  const [filters, setFilters] = useState<MealFilters>(defaultFilters);
  const [activeTab, setActiveTab] = useState("calendar");

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

  // Filter dishes based on smart filters
  const filteredDishes = useMemo(() => {
    if (!dishes) return [];

    return dishes.filter((dish) => {
      if (filters.calorieFilterEnabled && dish.calories > filters.maxCaloriesPerMeal) {
        return false;
      }
      if (filters.costFilterEnabled && dish.cost_level > filters.maxCostLevel) {
        return false;
      }
      return true;
    });
  }, [dishes, filters]);

  const handleAddMeal = (date: Date, mealType: "breakfast" | "lunch" | "dinner") => {
    setSelectedDate(date);
    setSelectedMealType(mealType);
    setSelectedDishId("");
    setIsAddDialogOpen(true);
  };

  const handleConfirmAdd = () => {
    if (!selectedDate || !selectedMealType || !selectedDishId) return;

    const dish = dishes?.find((d) => d.id === selectedDishId);
    if (!dish) return;

    const newMeal: MealItem = {
      id: `${selectedDate.toISOString()}-${selectedMealType}-${Date.now()}`,
      dishId: dish.id,
      dishTitle: dish.title,
      mealType: selectedMealType,
      date: selectedDate,
      calories: dish.calories,
      costLevel: dish.cost_level,
      category: dish.category,
    };

    setMeals((prev) => [...prev, newMeal]);
    setIsAddDialogOpen(false);
  };

  // Convert meals to weekly plan format for sharing
  const getWeeklyPlan = useCallback(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i);
      const dayMeals = meals.filter((m) => isSameDay(m.date, date));

      return {
        day: format(date, "EEEE", { locale: vi }),
        date,
        meals: {
          breakfast: dayMeals.find((m) => m.mealType === "breakfast")?.dishTitle,
          lunch: dayMeals.find((m) => m.mealType === "lunch")?.dishTitle,
          dinner: dayMeals.find((m) => m.mealType === "dinner")?.dishTitle,
        },
      };
    });
  }, [meals, weekStart]);

  // Calculate totals
  const totalCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const avgCaloriesPerDay = meals.length > 0 ? Math.round(totalCalories / 7) : 0;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Lập thực đơn tuần</h1>
            <p className="text-muted-foreground">
              Đăng nhập để lập kế hoạch bữa ăn cho cả tuần và chia sẻ với bạn bè
            </p>
            <Link to="/auth">
              <Button size="lg">
                <LogIn className="mr-2 h-5 w-5" />
                Đăng nhập
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-4 md:py-8">
        <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              <h1 className="text-xl md:text-3xl font-bold text-foreground">
                Thực đơn tuần của bạn
              </h1>
            </div>
            <p className="text-sm md:text-base text-muted-foreground">
              Kéo thả để sắp xếp các món ăn theo lịch của bạn
            </p>
            
            {/* Stats badges */}
            {meals.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <Badge variant="secondary" className="text-xs">
                  {meals.length} món đã lên lịch
                </Badge>
                {totalCalories > 0 && (
                  <Badge variant="outline" className="text-xs">
                    <Flame className="h-3 w-3 mr-1" />
                    ~{avgCaloriesPerDay} kcal/ngày
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Mobile Tabs */}
          <div className="lg:hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="calendar" className="text-xs">
                  <Calendar className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="filters" className="text-xs">
                  <Filter className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="shopping" className="text-xs">
                  <ShoppingCart className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="share" className="text-xs">
                  <Share2 className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>

              <TabsContent value="calendar" className="mt-4">
                <InteractiveCalendar
                  meals={meals}
                  onMealsChange={setMeals}
                  onAddMeal={handleAddMeal}
                />
              </TabsContent>

              <TabsContent value="filters" className="mt-4">
                <SmartFilters filters={filters} onFiltersChange={setFilters} />
              </TabsContent>

              <TabsContent value="shopping" className="mt-4">
                <ShoppingList meals={meals} />
              </TabsContent>

              <TabsContent value="share" className="mt-4">
                <WeeklyMenuShare
                  weeklyPlan={getWeeklyPlan()}
                  userName={user.email?.split("@")[0]}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid gap-6 lg:grid-cols-[1fr,380px]">
            {/* Left: Calendar */}
            <div className="space-y-6">
              <InteractiveCalendar
                meals={meals}
                onMealsChange={setMeals}
                onAddMeal={handleAddMeal}
              />
            </div>

            {/* Right: Sidebar */}
            <div className="space-y-6">
              <SmartFilters filters={filters} onFiltersChange={setFilters} />
              <ShoppingList meals={meals} />
              <WeeklyMenuShare
                weeklyPlan={getWeeklyPlan()}
                userName={user.email?.split("@")[0]}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Add Meal Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Thêm món {selectedMealType === "breakfast" ? "sáng" : selectedMealType === "lunch" ? "trưa" : "tối"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {selectedDate && format(selectedDate, "EEEE, dd/MM/yyyy", { locale: vi })}
            </p>

            {/* Active filters indicator */}
            {(filters.calorieFilterEnabled || filters.costFilterEnabled) && (
              <div className="flex flex-wrap gap-2 p-2 bg-muted/50 rounded-lg">
                <span className="text-xs text-muted-foreground">Đang lọc:</span>
                {filters.calorieFilterEnabled && (
                  <Badge variant="outline" className="text-xs">
                    <Flame className="h-3 w-3 mr-1" />
                    ≤ {filters.maxCaloriesPerMeal} kcal
                  </Badge>
                )}
                {filters.costFilterEnabled && (
                  <Badge variant="outline" className="text-xs">
                    <Coins className="h-3 w-3 mr-1" />
                    ≤ {"₫".repeat(filters.maxCostLevel)}
                  </Badge>
                )}
              </div>
            )}

            <Select value={selectedDishId} onValueChange={setSelectedDishId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn món ăn" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {filteredDishes.length > 0 ? (
                  filteredDishes.map((dish) => (
                    <SelectItem key={dish.id} value={dish.id}>
                      <div className="flex items-center gap-2">
                        <span>{dish.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {dish.calories} kcal • {"₫".repeat(dish.cost_level)}
                        </span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Không có món nào phù hợp với bộ lọc
                  </div>
                )}
              </SelectContent>
            </Select>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleConfirmAdd} disabled={!selectedDishId}>
                Thêm món
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WeeklyPlanner;
