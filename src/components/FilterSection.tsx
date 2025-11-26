import { DishTag, tagLabels } from "@/lib/dishesData";
import { Badge } from "./ui/badge";

interface FilterSectionProps {
  selectedTags: DishTag[];
  onTagToggle: (tag: DishTag) => void;
}

const filterTags: DishTag[] = [
  "vietnamese",
  "rice",
  "noodles",
  "healthy",
  "quick",
  "cheap",
  "vegetarian",
  "soup",
  "street-food",
];

export const FilterSection = ({ selectedTags, onTagToggle }: FilterSectionProps) => {
  return (
    <div className="w-full glass-card border-2 rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-bold mb-4 text-foreground">Lọc theo loại món</h3>
      <div className="flex flex-wrap gap-2">
        {filterTags.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            className="cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-md px-4 py-2 text-sm font-medium"
            onClick={() => onTagToggle(tag)}
          >
            {tagLabels[tag]}
          </Badge>
        ))}
      </div>
    </div>
  );
};
