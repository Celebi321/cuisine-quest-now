import { DishTag, tagLabels } from "@/lib/dishesData";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { Clock, Flame, DollarSign, MapPin, Utensils, X } from "lucide-react";
import { Button } from "./ui/button";

export interface FilterState {
  selectedTags: DishTag[];
  cookingTime: string;
  calorieRange: [number, number];
  costLevel: string;
  region: string;
}

interface AdvancedFilterSectionProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const quickTags: { tag: DishTag; label: string; icon?: string }[] = [
  { tag: "quick", label: "⚡ Nhanh" },
  { tag: "healthy", label: "🥗 Healthy" },
  { tag: "cheap", label: "💰 Rẻ" },
  { tag: "vietnamese", label: "🇻🇳 Món Việt" },
  { tag: "international", label: "🌍 Quốc Tế" },
  { tag: "vegetarian", label: "🥬 Chay" },
  { tag: "soup", label: "🍜 Nước" },
  { tag: "rice", label: "🍚 Cơm" },
  { tag: "noodles", label: "🍝 Bún/Phở/Mì" },
  { tag: "street-food", label: "🛒 Đường Phố" },
];

const cookingTimeOptions = [
  { value: "all", label: "Tất cả" },
  { value: "5", label: "≤ 5 phút" },
  { value: "10", label: "≤ 10 phút" },
  { value: "15", label: "≤ 15 phút" },
  { value: "20", label: "≤ 20 phút" },
  { value: "30", label: "≤ 30 phút" },
];

const costOptions = [
  { value: "all", label: "Tất cả" },
  { value: "low", label: "💵 Rẻ" },
  { value: "mid", label: "💵💵 Vừa" },
  { value: "high", label: "💵💵💵 Cao" },
];

const regionOptions = [
  { value: "all", label: "Tất cả vùng miền" },
  { value: "north", label: "🏔️ Miền Bắc" },
  { value: "central", label: "⛱️ Miền Trung" },
  { value: "south", label: "🌴 Miền Nam" },
];

export const AdvancedFilterSection = ({ filters, onFiltersChange }: AdvancedFilterSectionProps) => {
  const handleTagToggle = (tag: DishTag) => {
    const newTags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter(t => t !== tag)
      : [...filters.selectedTags, tag];
    onFiltersChange({ ...filters, selectedTags: newTags });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      selectedTags: [],
      cookingTime: "all",
      calorieRange: [0, 1000],
      costLevel: "all",
      region: "all",
    });
  };

  const hasActiveFilters = 
    filters.selectedTags.length > 0 || 
    filters.cookingTime !== "all" || 
    filters.costLevel !== "all" || 
    filters.region !== "all" ||
    filters.calorieRange[0] > 0 || 
    filters.calorieRange[1] < 1000;

  return (
    <div className="w-full glass-card border-2 rounded-2xl p-6 shadow-lg space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Utensils className="h-5 w-5 text-primary" />
          Bộ lọc nâng cao
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {/* Quick Tags */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-muted-foreground">Loại món</Label>
        <div className="flex flex-wrap gap-2">
          {quickTags.map(({ tag, label }) => (
            <Badge
              key={tag}
              variant={filters.selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md px-3 py-1.5 text-sm font-medium"
              onClick={() => handleTagToggle(tag)}
            >
              {label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Grid filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cooking Time */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Thời gian nấu
          </Label>
          <Select
            value={filters.cookingTime}
            onValueChange={(value) => onFiltersChange({ ...filters, cookingTime: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn thời gian" />
            </SelectTrigger>
            <SelectContent>
              {cookingTimeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cost Level */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Mức giá
          </Label>
          <Select
            value={filters.costLevel}
            onValueChange={(value) => onFiltersChange({ ...filters, costLevel: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn mức giá" />
            </SelectTrigger>
            <SelectContent>
              {costOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Region */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Vùng miền
          </Label>
          <Select
            value={filters.region}
            onValueChange={(value) => onFiltersChange({ ...filters, region: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn vùng miền" />
            </SelectTrigger>
            <SelectContent>
              {regionOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Calories */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Flame className="h-4 w-4" />
            Calories: {filters.calorieRange[0]} - {filters.calorieRange[1]} kcal
          </Label>
          <Slider
            value={filters.calorieRange}
            onValueChange={(value) => onFiltersChange({ ...filters, calorieRange: value as [number, number] })}
            min={0}
            max={1000}
            step={50}
            className="w-full"
          />
        </div>
      </div>

      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
          <span className="text-sm text-muted-foreground">Đang lọc:</span>
          {filters.selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tagLabels[tag]}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => handleTagToggle(tag)}
              />
            </Badge>
          ))}
          {filters.cookingTime !== "all" && (
            <Badge variant="secondary" className="text-xs">
              ≤ {filters.cookingTime} phút
            </Badge>
          )}
          {filters.costLevel !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Giá: {costOptions.find(o => o.value === filters.costLevel)?.label}
            </Badge>
          )}
          {filters.region !== "all" && (
            <Badge variant="secondary" className="text-xs">
              {regionOptions.find(o => o.value === filters.region)?.label}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
