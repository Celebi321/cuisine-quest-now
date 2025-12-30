import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { format, startOfWeek, addDays } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface MealPlan {
  day: string;
  date: Date;
  meals: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
}

interface WeeklyMenuShareProps {
  weeklyPlan: MealPlan[];
  userName?: string;
}

export const WeeklyMenuShare = ({ weeklyPlan, userName = "Foodie" }: WeeklyMenuShareProps) => {
  const shareRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = async (): Promise<Blob | null> => {
    if (!shareRef.current) return null;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(shareRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        logging: false,
      });

      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), "image/png", 1.0);
      });
    } catch (error) {
      console.error("Error generating image:", error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    const blob = await generateImage();
    if (!blob) {
      toast.error("Không thể tạo ảnh");
      return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `thuc-don-tuan-${format(new Date(), "dd-MM-yyyy")}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Đã tải ảnh thực đơn!");
  };

  const handleShare = async () => {
    const blob = await generateImage();
    if (!blob) {
      toast.error("Không thể tạo ảnh");
      return;
    }

    const file = new File([blob], "thuc-don-tuan.png", { type: "image/png" });

    if (navigator.share && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: "Thực đơn tuần của tôi",
          text: "Xem thực đơn tuần của mình! 🍜",
          files: [file],
        });
        toast.success("Đã chia sẻ!");
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          toast.error("Không thể chia sẻ");
        }
      }
    } else {
      // Fallback: download image
      handleDownload();
    }
  };

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Chia sẻ thực đơn tuần</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
          </Button>
          <Button
            size="sm"
            onClick={handleShare}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Share2 className="h-4 w-4 mr-2" />
            )}
            Chia sẻ
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Shareable Content - Story Format 9:16 */}
        <div
          ref={shareRef}
          className="w-[360px] mx-auto rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #ff6b35 0%, #f7c59f 50%, #fffbf0 100%)",
          }}
        >
          <div className="p-6 space-y-4">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="text-4xl">🍜</div>
              <h2 className="text-2xl font-bold text-white drop-shadow-md">
                Thực đơn tuần
              </h2>
              <p className="text-white/90 text-sm">
                {format(weekStart, "'Tuần' w, MMMM yyyy", { locale: vi })}
              </p>
            </div>

            {/* Meal Grid */}
            <div className="space-y-2">
              {weeklyPlan.slice(0, 7).map((day, index) => (
                <div
                  key={index}
                  className="bg-white/95 backdrop-blur rounded-xl p-3 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 text-center">
                      <div className="text-xs font-medium text-primary uppercase">
                        {format(addDays(weekStart, index), "EEE", { locale: vi })}
                      </div>
                      <div className="text-lg font-bold text-foreground">
                        {format(addDays(weekStart, index), "d")}
                      </div>
                    </div>
                    <div className="flex-1 text-sm space-y-1">
                      {day.meals.breakfast && (
                        <div className="flex items-center gap-1">
                          <span>🌅</span>
                          <span className="text-foreground/80 truncate">
                            {day.meals.breakfast}
                          </span>
                        </div>
                      )}
                      {day.meals.lunch && (
                        <div className="flex items-center gap-1">
                          <span>☀️</span>
                          <span className="text-foreground/80 truncate">
                            {day.meals.lunch}
                          </span>
                        </div>
                      )}
                      {day.meals.dinner && (
                        <div className="flex items-center gap-1">
                          <span>🌙</span>
                          <span className="text-foreground/80 truncate">
                            {day.meals.dinner}
                          </span>
                        </div>
                      )}
                      {!day.meals.breakfast && !day.meals.lunch && !day.meals.dinner && (
                        <span className="text-muted-foreground italic text-xs">
                          Chưa có món
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="text-center pt-2">
              <p className="text-white/80 text-xs">
                Tạo bởi {userName} • Hôm Nay Ăn Gì?
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyMenuShare;
