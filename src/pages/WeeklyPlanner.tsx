import { useState, useCallback } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { InteractiveCalendar, MealItem } from "@/components/InteractiveCalendar";
import { WeeklyMenuShare } from "@/components/WeeklyMenuShare";
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
import { Calendar, Sparkles, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

const WeeklyPlanner = () => {
  const { user } = useAuth();
  const { dishes } = useDishes();
  const [meals, setMeals] = useState<MealItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<"breakfast" | "lunch" | "dinner" | null>(null);
  const [selectedDishId, setSelectedDishId] = useState<string>("");

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

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

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">
                Thực đơn tuần của bạn
              </h1>
            </div>
            <p className="text-muted-foreground">
              Kéo thả để sắp xếp các món ăn theo lịch của bạn
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr,380px]">
            {/* Calendar */}
            <InteractiveCalendar
              meals={meals}
              onMealsChange={setMeals}
              onAddMeal={handleAddMeal}
            />

            {/* Share Card - Sticky on desktop */}
            <div className="lg:sticky lg:top-24 h-fit">
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Thêm món {selectedMealType === "breakfast" ? "sáng" : selectedMealType === "lunch" ? "trưa" : "tối"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {selectedDate && format(selectedDate, "EEEE, dd/MM/yyyy", { locale: vi })}
            </p>
            <Select value={selectedDishId} onValueChange={setSelectedDishId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn món ăn" />
              </SelectTrigger>
              <SelectContent>
                {dishes?.map((dish) => (
                  <SelectItem key={dish.id} value={dish.id}>
                    {dish.title}
                  </SelectItem>
                ))}
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
