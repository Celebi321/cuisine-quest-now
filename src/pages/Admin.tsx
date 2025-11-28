import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, LogOut, Plus, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";

interface ExcelRow {
  title: string;
  image: string;
  description: string;
  tags: string;
  time: string;
  difficulty: string;
  rating: number;
  category: string;
  calories: number;
  cost_level: number;
}

const dishSchema = z.object({
  title: z.string().trim().min(1, "Tên món không được để trống").max(200),
  description: z.string().trim().min(1, "Mô tả không được để trống").max(1000),
  image: z.string().url("URL ảnh không hợp lệ"),
  tags: z.string().trim().min(1, "Tags không được để trống"),
  time: z.string().trim().min(1, "Thời gian không được để trống").max(50),
  difficulty: z.string().trim().min(1, "Độ khó không được để trống").max(50),
  category: z.string().trim().min(1, "Danh mục không được để trống").max(100),
  rating: z.number().min(0).max(5),
  calories: z.number().min(0).max(10000),
  cost_level: z.number().int().min(1).max(3),
});

export default function Admin() {
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    tags: "",
    time: "",
    difficulty: "",
    category: "",
    rating: 4,
    calories: 0,
    cost_level: 2,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Bạn cần đăng nhập để truy cập trang này");
      navigate("/auth");
    } else if (!authLoading && user && !isAdmin) {
      toast.error("Bạn không có quyền truy cập trang này");
      navigate("/");
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleLogout = async () => {
    await signOut();
    toast.success("Đã đăng xuất");
    navigate("/");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json<ExcelRow>(worksheet);

      if (jsonData.length === 0) {
        toast.error("File Excel trống");
        return;
      }

      const dishes = jsonData.map((row) => ({
        title: row.title,
        image: row.image,
        description: row.description,
        tags: row.tags.split(",").map((tag) => tag.trim()),
        time: row.time,
        difficulty: row.difficulty,
        rating: Number(row.rating) || 0,
        category: row.category,
        calories: Number(row.calories) || 0,
        cost_level: Number(row.cost_level) || 1,
      }));

      const { error } = await supabase.from("dishes").insert(dishes);

      if (error) throw error;

      toast.success(`Đã thêm ${dishes.length} món ăn thành công!`);
      e.target.value = "";
    } catch (error: any) {
      toast.error("Lỗi khi upload: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate input
      const validatedData = dishSchema.parse({
        ...formData,
        rating: Number(formData.rating),
        calories: Number(formData.calories),
        cost_level: Number(formData.cost_level),
      });

      const dish = {
        title: validatedData.title,
        image: validatedData.image,
        description: validatedData.description,
        tags: validatedData.tags.split(",").map((tag) => tag.trim()),
        time: validatedData.time,
        difficulty: validatedData.difficulty,
        rating: validatedData.rating,
        category: validatedData.category,
        calories: validatedData.calories,
        cost_level: validatedData.cost_level,
      };

      const { error } = await supabase.from("dishes").insert([dish]);

      if (error) throw error;

      toast.success("Đã thêm món ăn thành công!");
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        image: "",
        tags: "",
        time: "",
        difficulty: "",
        category: "",
        rating: 4,
        calories: 0,
        cost_level: 2,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Lỗi khi thêm món: " + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        title: "Phở Bò",
        image: "/src/assets/pho.jpg",
        description: "Món phở truyền thống Việt Nam với nước dùng đậm đà",
        tags: "vietnamese,noodles,beef,healthy",
        time: "30 phút",
        difficulty: "Trung bình",
        rating: 4.5,
        category: "Món nước",
        calories: 450,
        cost_level: 2,
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dishes");
    XLSX.writeFile(wb, "dish-template.xlsx");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Quản lý món ăn</h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </Button>
          </div>

          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Thêm thủ công</TabsTrigger>
              <TabsTrigger value="excel">Upload Excel</TabsTrigger>
            </TabsList>

            <TabsContent value="manual">
              <Card>
                <CardHeader>
                  <CardTitle>Thêm món ăn mới</CardTitle>
                  <CardDescription>
                    Điền thông tin món ăn vào form bên dưới
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleManualSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Tên món *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          placeholder="Phở Bò"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Danh mục *</Label>
                        <Input
                          id="category"
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({ ...formData, category: e.target.value })
                          }
                          placeholder="Món nước"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Mô tả *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        placeholder="Mô tả món ăn..."
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image">URL ảnh *</Label>
                      <Input
                        id="image"
                        type="url"
                        value={formData.image}
                        onChange={(e) =>
                          setFormData({ ...formData, image: e.target.value })
                        }
                        placeholder="https://example.com/image.jpg"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags * (phân cách bằng dấu phẩy)</Label>
                      <Input
                        id="tags"
                        value={formData.tags}
                        onChange={(e) =>
                          setFormData({ ...formData, tags: e.target.value })
                        }
                        placeholder="vietnamese,noodles,beef"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="time">Thời gian *</Label>
                        <Input
                          id="time"
                          value={formData.time}
                          onChange={(e) =>
                            setFormData({ ...formData, time: e.target.value })
                          }
                          placeholder="30 phút"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="difficulty">Độ khó *</Label>
                        <Input
                          id="difficulty"
                          value={formData.difficulty}
                          onChange={(e) =>
                            setFormData({ ...formData, difficulty: e.target.value })
                          }
                          placeholder="Trung bình"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="rating">Đánh giá (0-5) *</Label>
                        <Input
                          id="rating"
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={formData.rating}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              rating: parseFloat(e.target.value),
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="calories">Calories *</Label>
                        <Input
                          id="calories"
                          type="number"
                          min="0"
                          value={formData.calories}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              calories: parseInt(e.target.value),
                            })
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cost_level">Mức giá (1-3) *</Label>
                        <Input
                          id="cost_level"
                          type="number"
                          min="1"
                          max="3"
                          value={formData.cost_level}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              cost_level: parseInt(e.target.value),
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang thêm...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Thêm món ăn
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="excel">
              <Card>
                <CardHeader>
                  <CardTitle>Upload file Excel</CardTitle>
                  <CardDescription>
                    Tải lên file Excel chứa danh sách món ăn. File phải có các cột:
                    title, image, description, tags, time, difficulty, rating, category,
                    calories, cost_level
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="excel">Chọn file Excel (.xlsx, .xls)</Label>
                    <Input
                      id="excel"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                  </div>

                  <Button
                    variant="outline"
                    onClick={downloadTemplate}
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Tải file mẫu
                  </Button>

                  {isUploading && (
                    <p className="text-sm text-muted-foreground text-center">
                      Đang upload...
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Hướng dẫn</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>1. Tải file mẫu về để xem cấu trúc dữ liệu</p>
                  <p>2. Điền thông tin món ăn vào file Excel</p>
                  <p>
                    3. Tags phải được phân cách bằng dấu phẩy (ví dụ:
                    "vietnamese,noodles,beef")
                  </p>
                  <p>4. Upload file và dữ liệu sẽ được thêm vào database</p>
                  <p>5. Món ăn sẽ hiển thị ngay trên trang chủ</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
