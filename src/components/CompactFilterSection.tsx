import { DishTag, tagLabels } from "@/lib/dishesData";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { Clock, Flame, DollarSign, MapPin, X, Star, ArrowUpDown, SlidersHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export type SortOption = "default" | "rating" | "calories" | "time";

export interface FilterState {
  selectedTags: DishTag[];
  cookingTime: string;
  calorieRange: [number, number];
  costLevel: string;
  region: string;
  sortBy: SortOption;
}

interface CompactFilterSectionProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const quickTags: { tag: DishTag; label: string }[] = [
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
  { value: "all", label: "Tất cả" },
  { value: "north", label: "🏔️ Bắc" },
  { value: "central", label: "⛱️ Trung" },
  { value: "south", label: "🌴 Nam" },
];

const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
  { value: "default", label: "Mặc định", icon: null },
  { value: "rating", label: "Rating", icon: <Star className="h-3 w-3" /> },
  { value: "calories", label: "Calo thấp", icon: <Flame className="h-3 w-3" /> },
  { value: "time", label: "Nhanh", icon: <Clock className="h-3 w-3" /> },
];

export const CompactFilterSection = ({ filters, onFiltersChange }: CompactFilterSectionProps) => {
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
      sortBy: "default",
    });
  };

  const activeFilterCount = 
    filters.selectedTags.length + 
    (filters.cookingTime !== "all" ? 1 : 0) + 
    (filters.costLevel !== "all" ? 1 : 0) + 
    (filters.region !== "all" ? 1 : 0) +
    ((filters.calorieRange[0] > 0 || filters.calorieRange[1] < 1000) ? 1 : 0) +
    (filters.sortBy !== "default" ? 1 : 0);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {/* Sort Dropdown */}
      <Select
        value={filters.sortBy}
        onValueChange={(value) => onFiltersChange({ ...filters, sortBy: value as SortOption })}
      >
        <SelectTrigger className="w-auto gap-2 rounded-full border-primary/20 bg-card">
          <ArrowUpDown className="h-4 w-4 text-primary" />
          <SelectValue placeholder="Sắp xếp" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map(({ value, label, icon }) => (
            <SelectItem key={value} value={value}>
              <span className="flex items-center gap-2">
                {icon}
                {label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Filter Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="rounded-full gap-2 border-primary/20 bg-card">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            Bộ lọc
            {activeFilterCount > 0 && (
              <Badge variant="default" className="ml-1 h-5 min-w-5 p-0 flex items-center justify-center text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="center">
          <Tabs defaultValue="tags" className="w-full">
            <TabsList className="w-full grid grid-cols-3 rounded-none border-b">
              <TabsTrigger value="tags" className="text-xs">Loại món</TabsTrigger>
              <TabsTrigger value="details" className="text-xs">Chi tiết</TabsTrigger>
              <TabsTrigger value="calories" className="text-xs">Calories</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tags" className="p-4 space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {quickTags.map(({ tag, label }) => (
                  <Badge
                    key={tag}
                    variant={filters.selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer text-xs px-2 py-1 hover:scale-105 transition-transform"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="details" className="p-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-1.5">
                  <Clock className="h-3 w-3" /> Thời gian nấu
                </Label>
                <Select
                  value={filters.cookingTime}
                  onValueChange={(value) => onFiltersChange({ ...filters, cookingTime: value })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cookingTimeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-1.5">
                  <DollarSign className="h-3 w-3" /> Mức giá
                </Label>
                <Select
                  value={filters.costLevel}
                  onValueChange={(value) => onFiltersChange({ ...filters, costLevel: value })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {costOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-1.5">
                  <MapPin className="h-3 w-3" /> Vùng miền
                </Label>
                <Select
                  value={filters.region}
                  onValueChange={(value) => onFiltersChange({ ...filters, region: value })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {regionOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="calories" className="p-4 space-y-3">
              <Label className="text-xs flex items-center gap-1.5">
                <Flame className="h-3 w-3" /> 
                {filters.calorieRange[0]} - {filters.calorieRange[1]} kcal
              </Label>
              <Slider
                value={filters.calorieRange}
                onValueChange={(value) => onFiltersChange({ ...filters, calorieRange: value as [number, number] })}
                min={0}
                max={1000}
                step={50}
                className="w-full"
              />
            </TabsContent>
          </Tabs>

          {activeFilterCount > 0 && (
            <div className="border-t p-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="w-full text-xs text-muted-foreground"
              >
                <X className="h-3 w-3 mr-1" />
                Xóa tất cả bộ lọc ({activeFilterCount})
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Active filter badges */}
      {filters.selectedTags.slice(0, 2).map((tag) => (
        <Badge 
          key={tag} 
          variant="secondary" 
          className="text-xs cursor-pointer"
          onClick={() => handleTagToggle(tag)}
        >
          {tagLabels[tag]}
          <X className="h-3 w-3 ml-1" />
        </Badge>
      ))}
      {filters.selectedTags.length > 2 && (
        <Badge variant="secondary" className="text-xs">
          +{filters.selectedTags.length - 2}
        </Badge>
      )}
    </div>
  );
};
