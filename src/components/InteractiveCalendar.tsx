import { useState } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Plus, X, Utensils, Flame, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MealItem {
  id: string;
  dishId: string;
  dishTitle: string;
  mealType: "breakfast" | "lunch" | "dinner";
  date: Date;
  calories?: number;
  costLevel?: number;
  category?: string;
}

interface DaySlotProps {
  date: Date;
  meals: MealItem[];
  onAddMeal: (date: Date, mealType: "breakfast" | "lunch" | "dinner") => void;
  onRemoveMeal: (mealId: string) => void;
}

const mealTypeLabels = {
  breakfast: { label: "Sáng", icon: "🌅", time: "6:00 - 9:00" },
  lunch: { label: "Trưa", icon: "☀️", time: "11:00 - 14:00" },
  dinner: { label: "Tối", icon: "🌙", time: "17:00 - 21:00" },
};

interface SortableMealProps {
  meal: MealItem;
  onRemove: (id: string) => void;
}

const SortableMeal = ({ meal, onRemove }: SortableMealProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: meal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 p-2 bg-background rounded-lg border group touch-manipulation",
        isDragging && "opacity-50 shadow-lg"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="touch-none cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>
      <span className="text-sm">{mealTypeLabels[meal.mealType].icon}</span>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium truncate block">{meal.dishTitle}</span>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {meal.calories && (
            <span className="flex items-center gap-0.5">
              <Flame className="h-3 w-3" />
              {meal.calories}
            </span>
          )}
          {meal.costLevel && (
            <span className="flex items-center gap-0.5">
              <Coins className="h-3 w-3" />
              {"₫".repeat(meal.costLevel)}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={() => onRemove(meal.id)}
        className="md:opacity-0 md:group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded text-destructive transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

const DaySlot = ({ date, meals, onAddMeal, onRemoveMeal }: DaySlotProps) => {
  const isToday = isSameDay(date, new Date());

  // Calculate daily totals
  const dailyCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const dailyCost = meals.reduce((sum, m) => sum + (m.costLevel || 0), 0);

  return (
    <Card className={cn("transition-all", isToday && "ring-2 ring-primary")}>
      <CardHeader className="pb-2 px-3 md:px-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-sm md:text-base capitalize">
              {format(date, "EEEE", { locale: vi })}
            </CardTitle>
            <p className="text-xs md:text-sm text-muted-foreground">
              {format(date, "dd/MM", { locale: vi })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {dailyCalories > 0 && (
              <Badge variant="outline" className="text-xs">
                <Flame className="h-3 w-3 mr-1" />
                {dailyCalories} kcal
              </Badge>
            )}
            {isToday && (
              <Badge variant="secondary" className="bg-primary text-primary-foreground text-xs">
                Hôm nay
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-3 md:px-6">
        {(["breakfast", "lunch", "dinner"] as const).map((mealType) => {
          const mealItems = meals.filter((m) => m.mealType === mealType);

          return (
            <div key={mealType} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                  <span>{mealTypeLabels[mealType].icon}</span>
                  <span className="font-medium">{mealTypeLabels[mealType].label}</span>
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    {mealTypeLabels[mealType].time}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => onAddMeal(date, mealType)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {mealItems.length > 0 ? (
                <SortableContext
                  items={mealItems.map((m) => m.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {mealItems.map((meal) => (
                      <SortableMeal
                        key={meal.id}
                        meal={meal}
                        onRemove={onRemoveMeal}
                      />
                    ))}
                  </div>
                </SortableContext>
              ) : (
                <div className="h-10 md:h-12 rounded-lg border-2 border-dashed border-muted flex items-center justify-center">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Utensils className="h-3 w-3" />
                    <span className="hidden sm:inline">Kéo món vào đây</span>
                    <span className="sm:hidden">Thêm món</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

interface InteractiveCalendarProps {
  meals: MealItem[];
  onMealsChange: (meals: MealItem[]) => void;
  onAddMeal: (date: Date, mealType: "breakfast" | "lunch" | "dinner") => void;
}

export const InteractiveCalendar = ({
  meals,
  onMealsChange,
  onAddMeal,
}: InteractiveCalendarProps) => {
  const [activeMeal, setActiveMeal] = useState<MealItem | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handleDragStart = (event: DragStartEvent) => {
    const meal = meals.find((m) => m.id === event.active.id);
    setActiveMeal(meal || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveMeal(null);
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeIndex = meals.findIndex((m) => m.id === active.id);
    const overIndex = meals.findIndex((m) => m.id === over.id);

    if (activeIndex !== -1 && overIndex !== -1) {
      const newMeals = [...meals];
      const [removed] = newMeals.splice(activeIndex, 1);
      newMeals.splice(overIndex, 0, removed);
      onMealsChange(newMeals);
    }
  };

  const handleRemoveMeal = (mealId: string) => {
    onMealsChange(meals.filter((m) => m.id !== mealId));
  };

  // Calculate weekly totals
  const weeklyCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-lg md:text-xl font-semibold">
            {format(weekStart, "'Tuần' w, MMMM yyyy", { locale: vi })}
          </h2>
          {weeklyCalories > 0 && (
            <Badge variant="secondary" className="self-start sm:self-auto">
              <Flame className="h-3 w-3 mr-1" />
              Tổng: {weeklyCalories.toLocaleString()} kcal/tuần
            </Badge>
          )}
        </div>

        <div className="space-y-4">
          {weekDays.map((date) => (
            <DaySlot
              key={date.toISOString()}
              date={date}
              meals={meals.filter((m) => isSameDay(m.date, date))}
              onAddMeal={onAddMeal}
              onRemoveMeal={handleRemoveMeal}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeMeal && (
          <div className="flex items-center gap-2 p-2 bg-background rounded-lg border shadow-lg">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{mealTypeLabels[activeMeal.mealType].icon}</span>
            <span className="text-sm font-medium">{activeMeal.dishTitle}</span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default InteractiveCalendar;
