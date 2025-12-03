import { useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMealLogs } from "@/hooks/useMealLogs";
import { useDishes } from "@/hooks/useDishes";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { format, subDays, startOfDay, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { TrendingUp, Clock, DollarSign, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Statistics = () => {
  const { user } = useAuth();
  const { allMeals, isLoading } = useMealLogs();
  const { data: dishes = [] } = useDishes();
  const navigate = useNavigate();

  // Calculate top eaten dishes
  const topDishes = useMemo(() => {
    const countMap: Record<string, { title: string; count: number }> = {};
    allMeals.forEach((meal) => {
      if (!countMap[meal.dish_id]) {
        countMap[meal.dish_id] = { title: meal.dish_title, count: 0 };
      }
      countMap[meal.dish_id].count++;
    });
    return Object.values(countMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [allMeals]);

  // Calculate dishes not eaten for a long time
  const longTimeNotEaten = useMemo(() => {
    const lastEatenMap: Record<string, { title: string; lastEaten: Date }> = {};
    allMeals.forEach((meal) => {
      const eatenDate = new Date(meal.eaten_at);
      if (!lastEatenMap[meal.dish_id] || eatenDate > lastEatenMap[meal.dish_id].lastEaten) {
        lastEatenMap[meal.dish_id] = { title: meal.dish_title, lastEaten: eatenDate };
      }
    });
    return Object.entries(lastEatenMap)
      .map(([id, data]) => ({
        id,
        title: data.title,
        lastEaten: data.lastEaten,
        daysAgo: Math.floor((Date.now() - data.lastEaten.getTime()) / (1000 * 60 * 60 * 24)),
      }))
      .sort((a, b) => b.daysAgo - a.daysAgo)
      .slice(0, 5);
  }, [allMeals]);

  // Calculate average cost per meal
  const averageCost = useMemo(() => {
    if (allMeals.length === 0) return 0;
    let totalCost = 0;
    let mealsWithCost = 0;
    allMeals.forEach((meal) => {
      const dish = dishes.find((d) => d.id === meal.dish_id);
      if (dish) {
        const costValue = dish.costLevel === "low" ? 30000 : dish.costLevel === "mid" ? 50000 : 80000;
        totalCost += costValue;
        mealsWithCost++;
      }
    });
    return mealsWithCost > 0 ? Math.round(totalCost / mealsWithCost) : 0;
  }, [allMeals, dishes]);

  // Calculate eating frequency over last 14 days
  const frequencyData = useMemo(() => {
    const last14Days = Array.from({ length: 14 }, (_, i) => {
      const date = startOfDay(subDays(new Date(), 13 - i));
      return {
        date,
        dateStr: format(date, "dd/MM", { locale: vi }),
        count: 0,
      };
    });

    allMeals.forEach((meal) => {
      const mealDate = startOfDay(parseISO(meal.eaten_at));
      const dayData = last14Days.find(
        (d) => d.date.getTime() === mealDate.getTime()
      );
      if (dayData) {
        dayData.count++;
      }
    });

    return last14Days.map((d) => ({ name: d.dateStr, "Số bữa": d.count }));
  }, [allMeals]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <BarChart3 className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Đăng nhập để xem thống kê</h2>
            <p className="text-muted-foreground mb-4">Bạn cần đăng nhập để xem thống kê ăn uống của mình</p>
            <Button onClick={() => navigate("/auth")}>Đăng Nhập</Button>
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
        <h1 className="text-3xl font-bold mb-8 text-foreground">Thống Kê</h1>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : allMeals.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Chưa có dữ liệu</h2>
            <p className="text-muted-foreground mb-4">Hãy thêm món ăn vào "Hôm Nay" để xem thống kê</p>
            <Button onClick={() => navigate("/today")}>Thêm Món Ăn</Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Tổng số bữa ăn</CardTitle>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{allMeals.length}</div>
                  <p className="text-xs text-muted-foreground">bữa đã ghi nhận</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Chi phí trung bình</CardTitle>
                  <DollarSign className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    {averageCost.toLocaleString("vi-VN")}đ
                  </div>
                  <p className="text-xs text-muted-foreground">mỗi bữa ăn</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Số món khác nhau</CardTitle>
                  <BarChart3 className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    {new Set(allMeals.map((m) => m.dish_id)).size}
                  </div>
                  <p className="text-xs text-muted-foreground">món đã ăn</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart - Top Dishes */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Top Món Ăn Nhiều Nhất
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {topDishes.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={topDishes} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                        <YAxis
                          dataKey="title"
                          type="category"
                          width={100}
                          tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                          stroke="hsl(var(--muted-foreground))"
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            color: "hsl(var(--foreground))",
                          }}
                        />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Số lần ăn" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">Chưa có dữ liệu</p>
                  )}
                </CardContent>
              </Card>

              {/* Line Chart - Frequency Over Time */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Clock className="h-5 w-5 text-primary" />
                    Tần Suất Ăn (14 ngày gần đây)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={frequencyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }}
                        stroke="hsl(var(--muted-foreground))"
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fill: "hsl(var(--foreground))" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--foreground))",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Số bữa"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Long Time Not Eaten List */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Clock className="h-5 w-5 text-primary" />
                  Món Lâu Chưa Ăn
                </CardTitle>
              </CardHeader>
              <CardContent>
                {longTimeNotEaten.length > 0 ? (
                  <div className="space-y-3">
                    {longTimeNotEaten.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-primary">{index + 1}</span>
                          <span className="font-medium text-foreground">{item.title}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-muted-foreground">
                            {item.daysAgo} ngày trước
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {format(item.lastEaten, "dd/MM/yyyy", { locale: vi })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">Chưa có dữ liệu</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Statistics;
