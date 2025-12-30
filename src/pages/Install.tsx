import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Download, Smartphone, Wifi, WifiOff, Check, Share, Plus } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const checkStandalone = window.matchMedia("(display-mode: standalone)").matches;
    setIsStandalone(checkStandalone);

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    // Listen for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const features = [
    {
      icon: WifiOff,
      title: "Hoạt động offline",
      description: "Xem công thức và thực đơn ngay cả khi không có mạng"
    },
    {
      icon: Smartphone,
      title: "Như ứng dụng thật",
      description: "Mở từ màn hình chính, không cần trình duyệt"
    },
    {
      icon: Download,
      title: "Tải nhanh hơn",
      description: "Dữ liệu được cache để tải trang nhanh chóng"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/pwa-icons/icon-192x192.png"
                alt="Hôm Nay Ăn Gì?"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Cài đặt ứng dụng
            </h1>
            <p className="text-muted-foreground text-lg">
              Thêm "Hôm Nay Ăn Gì?" vào màn hình chính để truy cập nhanh hơn
            </p>
          </div>

          {/* Online Status */}
          <div className={`flex items-center justify-center gap-2 p-3 rounded-lg ${
            isOnline 
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}>
            {isOnline ? (
              <>
                <Wifi className="h-5 w-5" />
                <span>Bạn đang online</span>
              </>
            ) : (
              <>
                <WifiOff className="h-5 w-5" />
                <span>Bạn đang offline - App vẫn hoạt động!</span>
              </>
            )}
          </div>

          {/* Install Status */}
          {isStandalone || isInstalled ? (
            <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-green-700 dark:text-green-400">
                  <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                    <Check className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Đã cài đặt!</h3>
                    <p className="text-sm text-green-600 dark:text-green-500">
                      Ứng dụng đã được thêm vào thiết bị của bạn
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt ngay</CardTitle>
                <CardDescription>
                  {isIOS
                    ? "Làm theo hướng dẫn để thêm vào màn hình chính"
                    : "Nhấn nút bên dưới để cài đặt ứng dụng"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isIOS ? (
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Nhấn nút Share</p>
                        <p className="text-muted-foreground flex items-center gap-1">
                          Tìm biểu tượng <Share className="h-4 w-4" /> ở thanh công cụ Safari
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                        2
                      </div>
                      <div>
                        <p className="font-medium">Chọn "Thêm vào Màn hình chính"</p>
                        <p className="text-muted-foreground flex items-center gap-1">
                          Tìm biểu tượng <Plus className="h-4 w-4" /> trong menu
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                        3
                      </div>
                      <div>
                        <p className="font-medium">Nhấn "Thêm"</p>
                        <p className="text-muted-foreground">
                          Xác nhận để hoàn tất cài đặt
                        </p>
                      </div>
                    </div>
                  </div>
                ) : deferredPrompt ? (
                  <Button onClick={handleInstall} size="lg" className="w-full">
                    <Download className="mr-2 h-5 w-5" />
                    Cài đặt ứng dụng
                  </Button>
                ) : (
                  <div className="text-center text-muted-foreground py-4">
                    <p>Trình duyệt của bạn không hỗ trợ cài đặt PWA.</p>
                    <p className="text-sm mt-1">Thử dùng Chrome, Edge hoặc Samsung Internet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Features */}
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6 space-y-3">
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Install;
