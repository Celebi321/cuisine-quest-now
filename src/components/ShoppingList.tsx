import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Download, Share2, Check, Printer } from "lucide-react";
import { MealItem } from "./InteractiveCalendar";
import { toast } from "sonner";

// Mapping dish categories to shopping ingredients (simulated)
const categoryIngredients: Record<string, string[]> = {
  "Món chính": ["Thịt/Cá", "Rau củ", "Gia vị", "Dầu ăn"],
  "Món nước": ["Xương hầm", "Bún/Phở", "Rau sống", "Gia vị"],
  "Món ăn sáng": ["Trứng", "Bánh mì", "Rau sống", "Nước chấm"],
  "Món khai vị": ["Rau củ", "Bánh tráng", "Nước chấm", "Gia vị"],
  "Món tráng miệng": ["Trái cây", "Đường", "Sữa", "Bột"],
  "default": ["Nguyên liệu chính", "Rau củ", "Gia vị"],
};

interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  checked: boolean;
  dishes: string[];
}

interface ShoppingListProps {
  meals: MealItem[];
}

export const ShoppingList = ({ meals }: ShoppingListProps) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  // Generate shopping list from meals
  const shoppingItems = useMemo(() => {
    const itemMap = new Map<string, ShoppingItem>();

    meals.forEach((meal) => {
      const category = meal.category || "default";
      const ingredients = categoryIngredients[category] || categoryIngredients["default"];

      ingredients.forEach((ingredient) => {
        const key = ingredient.toLowerCase();
        if (itemMap.has(key)) {
          const item = itemMap.get(key)!;
          item.quantity += 1;
          if (!item.dishes.includes(meal.dishTitle)) {
            item.dishes.push(meal.dishTitle);
          }
        } else {
          itemMap.set(key, {
            id: key,
            name: ingredient,
            category: getCategoryForIngredient(ingredient),
            quantity: 1,
            checked: checkedItems.has(key),
            dishes: [meal.dishTitle],
          });
        }
      });
    });

    return Array.from(itemMap.values()).sort((a, b) => 
      a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
    );
  }, [meals, checkedItems]);

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, ShoppingItem[]> = {};
    shoppingItems.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [shoppingItems]);

  const toggleItem = (itemId: string) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const checkedCount = checkedItems.size;
  const totalCount = shoppingItems.length;
  const progress = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  const handleExport = () => {
    const text = Object.entries(groupedItems)
      .map(([category, items]) => {
        const itemLines = items
          .map((item) => `${checkedItems.has(item.id) ? "✓" : "☐"} ${item.name} (x${item.quantity})`)
          .join("\n");
        return `📦 ${category}\n${itemLines}`;
      })
      .join("\n\n");

    const blob = new Blob([`🛒 DANH SÁCH ĐI CHỢ\n\n${text}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "danh-sach-di-cho.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Đã tải danh sách đi chợ!");
  };

  const handleShare = async () => {
    const text = Object.entries(groupedItems)
      .map(([category, items]) => {
        const itemLines = items
          .map((item) => `• ${item.name} (x${item.quantity})`)
          .join("\n");
        return `📦 ${category}\n${itemLines}`;
      })
      .join("\n\n");

    const shareText = `🛒 DANH SÁCH ĐI CHỢ\n\n${text}\n\n— Tạo bởi Hôm Nay Ăn Gì?`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Danh sách đi chợ",
          text: shareText,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success("Đã sao chép danh sách!");
    }
  };

  const clearCompleted = () => {
    setCheckedItems(new Set());
    toast.success("Đã xóa các mục đã hoàn thành!");
  };

  if (meals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Danh sách đi chợ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Thêm món vào thực đơn để tạo danh sách đi chợ tự động</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Danh sách đi chợ
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {checkedCount}/{totalCount} ({progress}%)
            </Badge>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Tải xuống</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Chia sẻ</span>
          </Button>
          {checkedCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearCompleted}>
              <Check className="h-4 w-4 mr-1" />
              Xóa đã hoàn thành
            </Button>
          )}
        </div>

        {/* Shopping items by category */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                {getCategoryEmoji(category)} {category}
              </h4>
              <div className="space-y-2">
                {items.map((item) => {
                  const isChecked = checkedItems.has(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`flex items-start gap-3 p-2 rounded-lg transition-colors ${
                        isChecked ? "bg-muted/50" : "hover:bg-muted/30"
                      }`}
                    >
                      <Checkbox
                        id={item.id}
                        checked={isChecked}
                        onCheckedChange={() => toggleItem(item.id)}
                        className="mt-0.5"
                      />
                      <label
                        htmlFor={item.id}
                        className={`flex-1 cursor-pointer ${
                          isChecked ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        <span className="text-sm font-medium">{item.name}</span>
                        {item.quantity > 1 && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            x{item.quantity}
                          </Badge>
                        )}
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {item.dishes.slice(0, 2).join(", ")}
                          {item.dishes.length > 2 && ` +${item.dishes.length - 2} món`}
                        </p>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

function getCategoryForIngredient(ingredient: string): string {
  const mapping: Record<string, string> = {
    "Thịt/Cá": "Thịt & Hải sản",
    "Xương hầm": "Thịt & Hải sản",
    "Trứng": "Thịt & Hải sản",
    "Rau củ": "Rau củ quả",
    "Rau sống": "Rau củ quả",
    "Trái cây": "Rau củ quả",
    "Bún/Phở": "Tinh bột",
    "Bánh mì": "Tinh bột",
    "Bánh tráng": "Tinh bột",
    "Bột": "Tinh bột",
    "Gia vị": "Gia vị & Nước chấm",
    "Nước chấm": "Gia vị & Nước chấm",
    "Dầu ăn": "Gia vị & Nước chấm",
    "Đường": "Gia vị & Nước chấm",
    "Sữa": "Đồ uống & Khác",
    "Nguyên liệu chính": "Khác",
  };
  return mapping[ingredient] || "Khác";
}

function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    "Thịt & Hải sản": "🥩",
    "Rau củ quả": "🥬",
    "Tinh bột": "🍜",
    "Gia vị & Nước chấm": "🧂",
    "Đồ uống & Khác": "🥛",
    "Khác": "📦",
  };
  return emojis[category] || "📦";
}

export default ShoppingList;
