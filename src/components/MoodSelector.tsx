import { Button } from "./ui/button";
import { Zap, Heart, Cloud, Coffee, Star } from "lucide-react";

interface MoodSelectorProps {
  onMoodSelect: (mood: string) => void;
}

const moods = [
  { mood: "quick", label: "Nhanh", icon: Zap, color: "text-yellow-500" },
  { mood: "healthy", label: "Healthy", icon: Heart, color: "text-green-500" },
  { mood: "comfort", label: "Ấm áp", icon: Coffee, color: "text-orange-500" },
  { mood: "light", label: "Nhẹ nhàng", icon: Cloud, color: "text-blue-500" },
  { mood: "special", label: "Đặc biệt", icon: Star, color: "text-purple-500" },
];

export const MoodSelector = ({ onMoodSelect }: MoodSelectorProps) => {
  return (
    <div id="mood-section" className="w-full glass-card bg-gradient-to-br from-accent/10 to-secondary/10 border-2 rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-bold mb-4 text-foreground">Hôm nay bạn cảm thấy thế nào?</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {moods.map(({ mood, label, icon: Icon, color }) => (
          <Button
            key={mood}
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4 hover:scale-110 hover:shadow-lg transition-all duration-200 glass-card"
            onClick={() => onMoodSelect(mood)}
          >
            <Icon className={`h-6 w-6 ${color}`} />
            <span className="text-sm font-semibold">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
