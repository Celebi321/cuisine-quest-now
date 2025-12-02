import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useMealLogs } from "@/hooks/useMealLogs";
import { useDishes } from "@/hooks/useDishes";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit2, Plus, Calendar, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function Today() {
  const { user } = useAuth();
  const { todayMeals, addMeal, updateMeal, deleteMeal, isLoading } = useMealLogs();
  const { data: dishes = [] } = useDishes();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDishId, setSelectedDishId] = useState("");
  const [notes, setNotes] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");

  const handleAddMeal = () => {
    const selectedDish = dishes.find((d) => d.id === selectedDishId);
    if (!selectedDish) return;

    addMeal({
      dish_id: selectedDish.id,
      dish_title: selectedDish.title,
      dish_category: selectedDish.category,
      notes,
    });

    setIsAddDialogOpen(false);
    setSelectedDishId("");
    setNotes("");
  };

  const handleUpdateMeal = (id: string) => {
    updateMeal({ id, notes: editNotes });
    setEditingId(null);
    setEditNotes("");
  };

  const startEdit = (id: string, currentNotes: string | null) => {
    setEditingId(id);
    setEditNotes(currentNotes || "");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="p-8 text-center max-w-md">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">Vui lòng đăng nhập</h2>
            <p className="text-muted-foreground mb-4">
              Bạn cần đăng nhập để sử dụng tính năng này
            </p>
            <Button onClick={() => window.location.href = "/auth"}>
              Đăng nhập ngay
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Calendar className="h-10 w-10 text-primary" />
                Hôm Nay Ăn Gì
              </h1>
              <p className="text-muted-foreground">
                {format(new Date(), "EEEE, dd MMMM yyyy", { locale: vi })}
              </p>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                  <Plus className="h-5 w-5" />
                  Thêm món
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm món vào hôm nay</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Chọn món</label>
                    <Select value={selectedDishId} onValueChange={setSelectedDishId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn món ăn..." />
                      </SelectTrigger>
                      <SelectContent>
                        {dishes.map((dish) => (
                          <SelectItem key={dish.id} value={dish.id}>
                            {dish.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ghi chú (tùy chọn)</label>
                    <Textarea
                      placeholder="Ví dụ: Ăn ở quán A, giá 50k..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleAddMeal}
                    disabled={!selectedDishId}
                    className="w-full"
                  >
                    Thêm vào hôm nay
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Meal List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Sparkles className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : todayMeals.length === 0 ? (
            <Card className="p-12 text-center">
              <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-semibold mb-2">Chưa có món nào hôm nay</h3>
              <p className="text-muted-foreground mb-6">
                Hãy thêm món đầu tiên cho bữa ăn của bạn!
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Thêm món đầu tiên
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {todayMeals.map((meal) => (
                <Card key={meal.id} className="p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{meal.dish_title}</h3>
                        {meal.dish_category && (
                          <Badge variant="secondary">{meal.dish_category}</Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {format(new Date(meal.eaten_at), "HH:mm", { locale: vi })}
                      </p>

                      {editingId === meal.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            placeholder="Ghi chú..."
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleUpdateMeal(meal.id)}
                            >
                              Lưu
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingId(null)}
                            >
                              Hủy
                            </Button>
                          </div>
                        </div>
                      ) : (
                        meal.notes && (
                          <p className="text-sm bg-muted/50 rounded-lg p-3 italic">
                            {meal.notes}
                          </p>
                        )
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => startEdit(meal.id, meal.notes)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteMeal(meal.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
