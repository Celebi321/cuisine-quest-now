import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { DishCard } from "@/components/DishCard";
import phoImage from "@/assets/pho.jpg";
import comTamImage from "@/assets/com-tam.jpg";
import goiCuonImage from "@/assets/goi-cuon.jpg";
import banhMiImage from "@/assets/banh-mi.jpg";
import chaGioImage from "@/assets/cha-gio.jpg";
import bunBoImage from "@/assets/bun-bo.jpg";

const Index = () => {
  const favoriteDishes = [
    {
      title: "Phở Bò Truyền Thống",
      image: phoImage,
      rating: 5,
      difficulty: "Dễ làm",
      time: "45 phút",
      category: "Món Chính",
    },
    {
      title: "Cơm Tấm Sườn Nướng",
      image: comTamImage,
      rating: 5,
      difficulty: "Trung bình",
      time: "30 phút",
      category: "Món Chính",
    },
    {
      title: "Gỏi Cuốn Tôm Thịt",
      image: goiCuonImage,
      rating: 4,
      difficulty: "Dễ làm",
      time: "20 phút",
      category: "Món Khai Vị",
    },
    {
      title: "Bánh Mì Thịt Nướng",
      image: banhMiImage,
      rating: 5,
      difficulty: "Dễ làm",
      time: "15 phút",
      category: "Ăn Sáng",
    },
  ];

  const recipeDiscovery = [
    {
      title: "Mì Xào Hải Sản",
      image: phoImage,
      rating: 5,
      difficulty: "Trung bình",
      time: "25 phút",
      category: "Bữa Tối",
    },
    {
      title: "Chả Giò Rế",
      image: chaGioImage,
      rating: 4,
      difficulty: "Khó",
      time: "60 phút",
      category: "Món Khai Vị",
    },
    {
      title: "Bún Bò Nam Bộ",
      image: bunBoImage,
      rating: 5,
      difficulty: "Dễ làm",
      time: "30 phút",
      category: "Bữa Trưa",
    },
    {
      title: "Gỏi Cuốn Chay",
      image: goiCuonImage,
      rating: 4,
      difficulty: "Dễ làm",
      time: "20 phút",
      category: "Ăn Chay",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />

      {/* Favorite Dishes Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold text-foreground">
            Món Ăn Được Yêu Thích
          </h2>
          <p className="text-muted-foreground">
            Những món ăn được nhiều người yêu thích nhất
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {favoriteDishes.map((dish, index) => (
            <DishCard key={index} {...dish} />
          ))}
        </div>
      </section>

      {/* Recipe Discovery Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-bold text-foreground">
              Khám Phá Công Thức
            </h2>
            <p className="text-muted-foreground">
              Học nấu những món ăn ngon tại nhà
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recipeDiscovery.map((dish, index) => (
              <DishCard key={index} {...dish} />
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-bold text-foreground">
            Gợi Ý Theo Thời Gian
          </h2>
          <p className="text-muted-foreground">
            Chọn món ăn phù hợp với từng bữa trong ngày
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6 text-center transition-all hover:shadow-lg">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <span className="text-3xl">☀️</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">Bữa Sáng</h3>
            <p className="mb-4 text-muted-foreground">
              Phở, bánh mì, xôi... để bắt đầu ngày mới
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 text-center transition-all hover:shadow-lg">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <span className="text-3xl">🌤️</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">Bữa Trưa</h3>
            <p className="mb-4 text-muted-foreground">
              Cơm tấm, bún, mì... no lâu và ngon miệng
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 text-center transition-all hover:shadow-lg">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
              <span className="text-3xl">🌙</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">Bữa Tối</h3>
            <p className="mb-4 text-muted-foreground">
              Lẩu, nướng, xào... sum họp bên gia đình
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 Hôm Nay Ăn Gì. Khám phá thế giới ẩm thực Việt Nam.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
