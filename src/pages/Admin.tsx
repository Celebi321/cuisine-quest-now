import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, LogOut } from "lucide-react";
import * as XLSX from "xlsx";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

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

export default function Admin() {
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
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

      // Transform data to match database schema
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

      // Insert dishes into database
      const { error } = await supabase.from("dishes").insert(dishes);

      if (error) throw error;

      toast.success(`Đã thêm ${dishes.length} món ăn thành công!`);
      e.target.value = ""; // Reset input
    } catch (error: any) {
      console.error("Error uploading dishes:", error);
      toast.error("Lỗi khi upload: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    // Create sample Excel template
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Quản lý món ăn</h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upload file Excel</CardTitle>
              <CardDescription>
                Tải lên file Excel chứa danh sách món ăn. File phải có các cột:
                title, image, description, tags, time, difficulty, rating, category, calories, cost_level
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

          <Card>
            <CardHeader>
              <CardTitle>Hướng dẫn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>1. Tải file mẫu về để xem cấu trúc dữ liệu</p>
              <p>2. Điền thông tin món ăn vào file Excel</p>
              <p>
                3. Tags phải được phân cách bằng dấu phẩy (ví dụ: "vietnamese,noodles,beef")
              </p>
              <p>4. Upload file và dữ liệu sẽ được thêm vào database</p>
              <p>5. Món ăn sẽ hiển thị ngay trên trang chủ</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
