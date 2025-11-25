import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { DishCard } from "@/components/DishCard";
import { DishDetailModal } from "@/components/DishDetailModal";
import { RandomDishModal } from "@/components/RandomDishModal";
import phoImage from "@/assets/pho.jpg";
import comTamImage from "@/assets/com-tam.jpg";
import goiCuonImage from "@/assets/goi-cuon.jpg";
import banhMiImage from "@/assets/banh-mi.jpg";
import chaGioImage from "@/assets/cha-gio.jpg";
import bunBoImage from "@/assets/bun-bo.jpg";

const Index = () => {
  const [selectedDish, setSelectedDish] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRandomOpen, setIsRandomOpen] = useState(false);
  const [randomDish, setRandomDish] = useState<any>(null);

  const allDishes = [
    {
      title: "Phở Bò Truyền Thống",
      image: phoImage,
      rating: 5,
      difficulty: "Dễ làm",
      time: "45 phút",
      category: "Món Chính",
      description: "Món phở bò truyền thống với nước dùng được ninh từ xương trong nhiều giờ, thơm ngon đậm đà.",
      servings: 4,
      calories: 450,
      ingredients: [
        "500g xương bò",
        "300g thịt bò",
        "200g bánh phở",
        "Hành tây, gừng",
        "Hành lá, ngò gai, rau thơm",
        "Gia vị: hồi, quế, thảo quả, muối, đường, nước mắm",
      ],
      steps: [
        "Rửa sạch xương bò, blanch qua nước sôi để loại bỏ tạp chất",
        "Nướng hành tây và gừng cho thơm",
        "Ninh xương cùng gia vị trong 3-4 tiếng",
        "Luộc thịt bò, thái lát mỏng",
        "Trụng bánh phở, cho vào tô cùng thịt bò",
        "Chan nước dùng nóng, thêm rau thơm và gia vị",
      ],
    },
    {
      title: "Cơm Tấm Sườn Nướng",
      image: comTamImage,
      rating: 5,
      difficulty: "Trung bình",
      time: "30 phút",
      category: "Món Chính",
      description: "Cơm tấm với sườn nướng thơm lừng, trứng ốp la và đồ chua ngon miệng.",
      servings: 2,
      calories: 650,
      ingredients: [
        "300g sườn non",
        "2 chén cơm tấm",
        "2 quả trứng",
        "Đồ chua: cà rốt, củ cải",
        "Gia vị ướp: tỏi, sả, mật ong, nước mắm, dầu hào",
      ],
      steps: [
        "Ướp sườn với tỏi băm, sả băm, mật ong, nước mắm, dầu hào trong 30 phút",
        "Nướng sườn trên than hồng hoặc lò nướng cho chín vàng đều",
        "Chiên trứng ốp la",
        "Nấu cơm tấm",
        "Bày đĩa với cơm, sườn, trứng và đồ chua",
      ],
    },
    {
      title: "Gỏi Cuốn Tôm Thịt",
      image: goiCuonImage,
      rating: 4,
      difficulty: "Dễ làm",
      time: "20 phút",
      category: "Món Khai Vị",
      description: "Gỏi cuốn tươi mát với tôm, thịt và rau thơm, chấm nước mắm chua ngọt.",
      servings: 4,
      calories: 180,
      ingredients: [
        "200g tôm",
        "100g thịt ba chỉ",
        "Bánh tráng",
        "Bún, xà lách, húng quế, rau thơm",
        "Nước chấm: nước mắm, đường, tỏi, ớt, chanh",
      ],
      steps: [
        "Luộc tôm và thịt, để nguội",
        "Rửa sạch rau, để ráo",
        "Nhúng bánh tráng qua nước ấm",
        "Đặt rau, bún, tôm, thịt lên bánh tráng rồi cuốn lại",
        "Pha nước chấm chua ngọt",
      ],
    },
    {
      title: "Bánh Mì Thịt Nướng",
      image: banhMiImage,
      rating: 5,
      difficulty: "Dễ làm",
      time: "15 phút",
      category: "Ăn Sáng",
      description: "Bánh mì giòn rụm với thịt nướng thơm, pate, đồ chua và rau thơm.",
      servings: 2,
      calories: 420,
      ingredients: [
        "2 ổ bánh mì",
        "150g thịt nướng",
        "Pate",
        "Đồ chua, rau thơm",
        "Tương ớt, tương đen",
      ],
      steps: [
        "Nướng bánh mì cho giòn",
        "Phết pate lên bánh",
        "Xếp thịt nướng, đồ chua, rau thơm",
        "Thêm tương ớt và tương đen theo khẩu vị",
      ],
    },
    {
      title: "Mì Xào Hải Sản",
      image: phoImage,
      rating: 5,
      difficulty: "Trung bình",
      time: "25 phút",
      category: "Bữa Tối",
      description: "Mì xào giòn với hải sản tươi ngon và rau củ đầy màu sắc.",
      servings: 3,
      calories: 520,
      ingredients: [
        "300g mì sợi lớn",
        "200g hải sản (tôm, mực, sò)",
        "Rau củ: cà rốt, cải thảo, hành tây",
        "Gia vị: dầu hào, nước tương, tỏi",
      ],
      steps: [
        "Luộc mì, để ráo",
        "Sơ chế hải sản",
        "Phi thơm tỏi, xào hải sản",
        "Thêm rau củ xào chung",
        "Cho mì vào xào đều, nêm nếm",
      ],
    },
    {
      title: "Chả Giò Rế",
      image: chaGioImage,
      rating: 4,
      difficulty: "Khó",
      time: "60 phút",
      category: "Món Khai Vị",
      description: "Chả giò giòn tan với nhân thịt rau củ thơm ngon đặc trưng.",
      servings: 6,
      calories: 280,
      ingredients: [
        "300g thịt lợn xay",
        "100g tôm khô",
        "Miến, nấm mèo, cà rốt",
        "Bánh đa nem",
        "Rau sống để ăn kèm",
      ],
      steps: [
        "Trộn thịt với tôm khô, miến, rau củ",
        "Nêm gia vị",
        "Gói chả giò",
        "Chiên vàng giòn",
        "Dùng kèm với rau sống và nước mắm",
      ],
    },
    {
      title: "Bún Bò Nam Bộ",
      image: bunBoImage,
      rating: 5,
      difficulty: "Dễ làm",
      time: "30 phút",
      category: "Bữa Trưa",
      description: "Bún bò với thịt bò xào thơm lừng, rau thơm và đậu phộng rang.",
      servings: 3,
      calories: 480,
      ingredients: [
        "300g thịt bò",
        "200g bún tươi",
        "Rau sống: xà lách, húng quế, rau răm",
        "Đậu phộng rang, hành phi",
        "Nước mắm pha",
      ],
      steps: [
        "Ướp thịt bò với gia vị",
        "Xào thịt bò cho chín",
        "Trụng bún",
        "Bày bún, rau, thịt bò vào bát",
        "Rắc đậu phộng, hành phi, chan nước mắm",
      ],
    },
    {
      title: "Gỏi Cuốn Chay",
      image: goiCuonImage,
      rating: 4,
      difficulty: "Dễ làm",
      time: "20 phút",
      category: "Ăn Chay",
      description: "Gỏi cuốn chay với đậu phụ và rau củ tươi mát, lành mạnh.",
      servings: 4,
      calories: 150,
      ingredients: [
        "200g đậu phụ",
        "Bánh tráng",
        "Bún, rau sống",
        "Nước chấm chay",
      ],
      steps: [
        "Chiên đậu phụ vàng giòn",
        "Chuẩn bị rau và bún",
        "Cuốn gỏi cuốn với bánh tráng",
        "Chấm nước tương hoặc nước mắm chay",
      ],
    },
  ];

  const favoriteDishes = allDishes.slice(0, 4);
  const recipeDiscovery = allDishes.slice(4, 8);

  const handleDishClick = (dish: any) => {
    setSelectedDish(dish);
    setIsDetailOpen(true);
  };

  const handleRandomDish = () => {
    const random = allDishes[Math.floor(Math.random() * allDishes.length)];
    setRandomDish(random);
    setIsRandomOpen(true);
  };

  const handleShuffleRandom = () => {
    const random = allDishes[Math.floor(Math.random() * allDishes.length)];
    setRandomDish(random);
  };

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
            <DishCard 
              key={index} 
              {...dish}
              onClick={() => handleDishClick(dish)}
            />
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
              <DishCard 
                key={index} 
                {...dish}
                onClick={() => handleDishClick(dish)}
              />
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
          <button
            onClick={handleRandomDish}
            className="rounded-2xl border border-border bg-card p-6 text-center transition-all hover:scale-105 hover:shadow-lg"
          >
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <span className="text-3xl">☀️</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">Bữa Sáng</h3>
            <p className="mb-4 text-muted-foreground">
              Phở, bánh mì, xôi... để bắt đầu ngày mới
            </p>
          </button>
          <button
            onClick={handleRandomDish}
            className="rounded-2xl border border-border bg-card p-6 text-center transition-all hover:scale-105 hover:shadow-lg"
          >
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <span className="text-3xl">🌤️</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">Bữa Trưa</h3>
            <p className="mb-4 text-muted-foreground">
              Cơm tấm, bún, mì... no lâu và ngon miệng
            </p>
          </button>
          <button
            onClick={handleRandomDish}
            className="rounded-2xl border border-border bg-card p-6 text-center transition-all hover:scale-105 hover:shadow-lg"
          >
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
              <span className="text-3xl">🌙</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">Bữa Tối</h3>
            <p className="mb-4 text-muted-foreground">
              Lẩu, nướng, xào... sum họp bên gia đình
            </p>
          </button>
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

      {/* Modals */}
      {selectedDish && (
        <DishDetailModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          dish={selectedDish}
        />
      )}

      {randomDish && (
        <RandomDishModal
          isOpen={isRandomOpen}
          onClose={() => setIsRandomOpen(false)}
          dish={randomDish}
          onShuffle={handleShuffleRandom}
        />
      )}
    </div>
  );
};

export default Index;
