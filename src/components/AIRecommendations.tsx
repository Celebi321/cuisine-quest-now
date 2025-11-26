import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Cloud, Sun, CloudRain, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthDialog } from "./AuthDialog";

interface Recommendation {
  title: string;
  reason: string;
  features: string;
  category: string;
}

export const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [weather, setWeather] = useState("Nắng đẹp");
  const [timeOfDay, setTimeOfDay] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Check auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Determine time of day
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) setTimeOfDay("Sáng");
    else if (hour >= 11 && hour < 13) setTimeOfDay("Trưa");
    else if (hour >= 13 && hour < 18) setTimeOfDay("Chiều");
    else setTimeOfDay("Tối");

    return () => subscription.unsubscribe();
  }, []);

  const getRecommendations = async () => {
    if (!user) {
      setShowAuth(true);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-recommendations', {
        body: {
          timeOfDay,
          weather
        }
      });

      if (error) throw error;

      if (data?.recommendations) {
        setRecommendations(data.recommendations);
        toast({
          title: "Đã có gợi ý món ăn!",
          description: "AI đã phân tích và đưa ra gợi ý phù hợp cho bạn.",
        });
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể lấy gợi ý món ăn",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = () => {
    if (weather.includes("Mưa")) return <CloudRain className="h-5 w-5" />;
    if (weather.includes("Mây")) return <Cloud className="h-5 w-5" />;
    return <Sun className="h-5 w-5" />;
  };

  return (
    <>
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">
              Gợi Ý Thông Minh AI
            </h2>
          </div>
          <p className="text-muted-foreground mb-6">
            AI phân tích thời tiết, thời gian và sở thích của bạn để đề xuất món ăn phù hợp nhất
          </p>

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>{timeOfDay}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {getWeatherIcon()}
              <select
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                className="border rounded px-2 py-1 bg-background"
              >
                <option value="Nắng đẹp">Nắng đẹp</option>
                <option value="Mây">Mây</option>
                <option value="Mưa">Mưa</option>
                <option value="Lạnh">Lạnh</option>
                <option value="Nóng">Nóng</option>
              </select>
            </div>
          </div>

          <Button
            onClick={getRecommendations}
            disabled={loading}
            size="lg"
            className="gap-2"
          >
            <Sparkles className="h-5 w-5" />
            {loading ? "Đang phân tích..." : "Nhận Gợi Ý AI"}
          </Button>
        </div>

        {recommendations.length > 0 && (
          <div className="grid gap-6 md:grid-cols-3">
            {recommendations.map((rec, index) => (
              <Card key={index} className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    {rec.title}
                  </CardTitle>
                  <CardDescription>{rec.category}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold mb-1">Lý do gợi ý:</p>
                    <p className="text-sm text-muted-foreground">{rec.reason}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1">Đặc điểm:</p>
                    <p className="text-sm text-muted-foreground">{rec.features}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <AuthDialog
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => getRecommendations()}
      />
    </>
  );
};
