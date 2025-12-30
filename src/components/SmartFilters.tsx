import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Coins, Filter, RotateCcw } from "lucide-react";

export interface MealFilters {
  maxCaloriesPerMeal: number;
  maxCostLevel: number;
  calorieFilterEnabled: boolean;
  costFilterEnabled: boolean;
}

interface SmartFiltersProps {
  filters: MealFilters;
  onFiltersChange: (filters: MealFilters) => void;
}

const defaultFilters: MealFilters = {
  maxCaloriesPerMeal: 800,
  maxCostLevel: 3,
  calorieFilterEnabled: false,
  costFilterEnabled: false,
};

export const SmartFilters = ({ filters, onFiltersChange }: SmartFiltersProps) => {
  const handleCalorieChange = (value: number[]) => {
    onFiltersChange({ ...filters, maxCaloriesPerMeal: value[0] });
  };

  const handleCostChange = (value: number[]) => {
    onFiltersChange({ ...filters, maxCostLevel: value[0] });
  };

  const handleReset = () => {
    onFiltersChange(defaultFilters);
  };

  const hasActiveFilters = filters.calorieFilterEnabled || filters.costFilterEnabled;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Filter className="h-5 w-5 text-primary" />
            Bộ lọc thông minh
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Calorie Filter */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <Label htmlFor="calorie-filter" className="text-sm font-medium">
                Giới hạn Calo/bữa
              </Label>
            </div>
            <Switch
              id="calorie-filter"
              checked={filters.calorieFilterEnabled}
              onCheckedChange={(checked) =>
                onFiltersChange({ ...filters, calorieFilterEnabled: checked })
              }
            />
          </div>

          <div className={filters.calorieFilterEnabled ? "" : "opacity-50 pointer-events-none"}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">200 kcal</span>
              <Badge variant="secondary" className="text-xs">
                {filters.maxCaloriesPerMeal} kcal
              </Badge>
              <span className="text-xs text-muted-foreground">1500 kcal</span>
            </div>
            <Slider
              value={[filters.maxCaloriesPerMeal]}
              onValueChange={handleCalorieChange}
              min={200}
              max={1500}
              step={50}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Chỉ hiển thị món có ≤ {filters.maxCaloriesPerMeal} kcal
            </p>
          </div>
        </div>

        {/* Cost Filter */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-green-500" />
              <Label htmlFor="cost-filter" className="text-sm font-medium">
                Ngân sách tối đa
              </Label>
            </div>
            <Switch
              id="cost-filter"
              checked={filters.costFilterEnabled}
              onCheckedChange={(checked) =>
                onFiltersChange({ ...filters, costFilterEnabled: checked })
              }
            />
          </div>

          <div className={filters.costFilterEnabled ? "" : "opacity-50 pointer-events-none"}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">₫</span>
              <Badge variant="secondary" className="text-xs">
                {"₫".repeat(filters.maxCostLevel)}
              </Badge>
              <span className="text-xs text-muted-foreground">₫₫₫₫₫</span>
            </div>
            <Slider
              value={[filters.maxCostLevel]}
              onValueChange={handleCostChange}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Rẻ</span>
              <span>Vừa</span>
              <span>Đắt</span>
            </div>
          </div>
        </div>

        {/* Active filters summary */}
        {hasActiveFilters && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-2">Đang lọc:</p>
            <div className="flex flex-wrap gap-2">
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { defaultFilters };
export default SmartFilters;
