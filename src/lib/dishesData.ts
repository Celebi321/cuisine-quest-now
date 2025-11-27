import phoBo from "@/assets/pho.jpg";
import banhMi from "@/assets/banh-mi.jpg";
import bunBo from "@/assets/bun-bo.jpg";
import comTam from "@/assets/com-tam.jpg";
import goiCuon from "@/assets/goi-cuon.jpg";
import chaGio from "@/assets/cha-gio.jpg";

export type DishTag = 
  | "vietnamese" 
  | "rice" 
  | "noodles" 
  | "healthy" 
  | "quick" 
  | "cheap" 
  | "vegetarian" 
  | "international"
  | "soup"
  | "street-food";

export interface Dish {
  id: string;
  title: string;
  image: string;
  description: string;
  tags: DishTag[];
  time: string;
  difficulty: string;
  rating: number;
  category: string;
  calories?: number;
  costLevel: "low" | "mid" | "high";
  lastEaten?: Date;
  favorite?: boolean;
}

export const allDishes: Dish[] = [
  {
    id: "pho-bo",
    title: "Phở Bò",
    image: phoBo,
    description: "Món phở truyền thống với nước dùng ngọt thanh, thịt bò mềm",
    tags: ["vietnamese", "noodles", "soup", "healthy"],
    time: "15 phút",
    difficulty: "Dễ",
    rating: 4.8,
    category: "Món Việt",
    calories: 450,
    costLevel: "mid",
  },
  {
    id: "banh-mi",
    title: "Bánh Mì Thịt",
    image: banhMi,
    description: "Bánh mì giòn tan với nhân thịt đầy đặn, rau củ tươi",
    tags: ["vietnamese", "quick", "cheap", "street-food"],
    time: "5 phút",
    difficulty: "Dễ",
    rating: 4.9,
    category: "Món Việt",
    calories: 350,
    costLevel: "low",
  },
  {
    id: "bun-bo-hue",
    title: "Bún Bò Huế",
    image: bunBo,
    description: "Bún bò cay nồng với nước dùng đậm đà hương vị miền Trung",
    tags: ["vietnamese", "noodles", "soup"],
    time: "20 phút",
    difficulty: "Trung bình",
    rating: 4.7,
    category: "Món Việt",
    calories: 500,
    costLevel: "mid",
  },
  {
    id: "com-tam",
    title: "Cơm Tấm Sườn",
    image: comTam,
    description: "Cơm tấm sườn nướng thơm lừng, ăn kèm mỡ hành",
    tags: ["vietnamese", "rice"],
    time: "15 phút",
    difficulty: "Dễ",
    rating: 4.6,
    category: "Món Việt",
    calories: 600,
    costLevel: "mid",
  },
  {
    id: "goi-cuon",
    title: "Gỏi Cuốn",
    image: goiCuon,
    description: "Gỏi cuốn tươi mát với tôm thịt, rau sống và nước chấm đặc biệt",
    tags: ["vietnamese", "healthy", "quick", "cheap"],
    time: "10 phút",
    difficulty: "Dễ",
    rating: 4.5,
    category: "Món Việt",
    calories: 200,
    costLevel: "low",
  },
  {
    id: "cha-gio",
    title: "Chả Giò",
    image: chaGio,
    description: "Chả giò giòn rụm với nhân thịt hấp dẫn",
    tags: ["vietnamese", "quick", "street-food"],
    time: "10 phút",
    difficulty: "Dễ",
    rating: 4.7,
    category: "Món Việt",
    calories: 400,
    costLevel: "mid",
  },
  // More dishes
  {
    id: "bun-cha",
    title: "Bún Chả",
    image: phoBo, // reuse image
    description: "Bún chả Hà Nội với thịt nướng thơm phức",
    tags: ["vietnamese", "noodles", "healthy"],
    time: "15 phút",
    difficulty: "Dễ",
    rating: 4.8,
    category: "Món Việt",
    calories: 450,
    costLevel: "mid",
  },
  {
    id: "mi-quang",
    title: "Mì Quảng",
    image: bunBo,
    description: "Mì Quảng đặc trưng miền Trung với nước dùng đậm đà",
    tags: ["vietnamese", "noodles"],
    time: "20 phút",
    difficulty: "Trung bình",
    rating: 4.6,
    category: "Món Việt",
    calories: 480,
    costLevel: "mid",
  },
  {
    id: "xoi-man",
    title: "Xôi Mặn",
    image: comTam,
    description: "Xôi mặn với đủ loại topping hấp dẫn",
    tags: ["vietnamese", "rice", "quick", "cheap"],
    time: "10 phút",
    difficulty: "Dễ",
    rating: 4.5,
    category: "Món Việt",
    calories: 400,
    costLevel: "low",
  },
  {
    id: "banh-xeo",
    title: "Bánh Xèo",
    image: chaGio,
    description: "Bánh xèo giòn tan với nhân tôm thịt đầy đặn",
    tags: ["vietnamese", "street-food"],
    time: "15 phút",
    difficulty: "Trung bình",
    rating: 4.7,
    category: "Món Việt",
    calories: 500,
    costLevel: "mid",
  },
  {
    id: "hu-tieu",
    title: "Hủ Tiếu Nam Vang",
    image: phoBo,
    description: "Hủ tiếu nước ngọt thanh, đặc sản miền Nam",
    tags: ["vietnamese", "noodles", "soup"],
    time: "15 phút",
    difficulty: "Dễ",
    rating: 4.6,
    category: "Món Việt",
    calories: 420,
    costLevel: "mid",
  },
  {
    id: "cao-lau",
    title: "Cao Lầu Hội An",
    image: bunBo,
    description: "Cao lầu với sợi mì đặc biệt chỉ có ở Hội An",
    tags: ["vietnamese", "noodles"],
    time: "15 phút",
    difficulty: "Dễ",
    rating: 4.7,
    category: "Món Việt",
    calories: 450,
    costLevel: "mid",
  },
];

export const tagLabels: Record<DishTag, string> = {
  vietnamese: "Món Việt",
  rice: "Cơm",
  noodles: "Bún/Phở/Mì",
  healthy: "Healthy",
  quick: "Nhanh",
  cheap: "Rẻ",
  vegetarian: "Chay",
  international: "Quốc Tế",
  soup: "Nước",
  "street-food": "Đường Phố",
};

// Meal interface - bữa ăn hoàn chỉnh
export interface Meal {
  id: string;
  name: string;
  description: string;
  dishes: Dish[];
  totalCalories: number;
  totalCost: "low" | "mid" | "high";
  totalTime: string;
  tags: DishTag[];
  mealType: "breakfast" | "lunch" | "dinner";
}

export const predefinedMeals: Meal[] = [
  {
    id: "meal-1",
    name: "Bữa Sáng Việt Nam",
    description: "Bữa sáng truyền thống với phở và bánh mì",
    dishes: [
      allDishes.find(d => d.id === "pho-bo")!,
      allDishes.find(d => d.id === "goi-cuon")!,
    ],
    totalCalories: 650,
    totalCost: "mid",
    totalTime: "20 phút",
    tags: ["vietnamese", "healthy", "soup"],
    mealType: "breakfast",
  },
  {
    id: "meal-2",
    name: "Bữa Trưa Nhanh",
    description: "Bữa trưa đầy đủ với cơm và món phụ",
    dishes: [
      allDishes.find(d => d.id === "com-tam")!,
      allDishes.find(d => d.id === "cha-gio")!,
    ],
    totalCalories: 1000,
    totalCost: "mid",
    totalTime: "25 phút",
    tags: ["vietnamese", "rice", "quick"],
    mealType: "lunch",
  },
  {
    id: "meal-3",
    name: "Bữa Tối Nhẹ Nhàng",
    description: "Bữa tối healthy với bún và gỏi cuốn",
    dishes: [
      allDishes.find(d => d.id === "bun-cha")!,
      allDishes.find(d => d.id === "goi-cuon")!,
    ],
    totalCalories: 650,
    totalCost: "mid",
    totalTime: "25 phút",
    tags: ["vietnamese", "healthy", "noodles"],
    mealType: "dinner",
  },
  {
    id: "meal-4",
    name: "Combo Đường Phố",
    description: "Trải nghiệm ẩm thực đường phố Việt Nam",
    dishes: [
      allDishes.find(d => d.id === "banh-mi")!,
      allDishes.find(d => d.id === "cha-gio")!,
    ],
    totalCalories: 750,
    totalCost: "low",
    totalTime: "15 phút",
    tags: ["vietnamese", "street-food", "cheap", "quick"],
    mealType: "lunch",
  },
  {
    id: "meal-5",
    name: "Bữa Sáng Nhanh",
    description: "Bữa sáng nhanh gọn với xôi và bánh mì",
    dishes: [
      allDishes.find(d => d.id === "xoi-man")!,
      allDishes.find(d => d.id === "banh-mi")!,
    ],
    totalCalories: 750,
    totalCost: "low",
    totalTime: "15 phút",
    tags: ["vietnamese", "quick", "cheap"],
    mealType: "breakfast",
  },
  {
    id: "meal-6",
    name: "Bữa Trưa Đầy Đủ",
    description: "Bữa trưa thịnh soạn với món nước và món chiên",
    dishes: [
      allDishes.find(d => d.id === "bun-bo-hue")!,
      allDishes.find(d => d.id === "banh-xeo")!,
    ],
    totalCalories: 1000,
    totalCost: "mid",
    totalTime: "35 phút",
    tags: ["vietnamese", "noodles", "soup"],
    mealType: "lunch",
  },
  {
    id: "meal-7",
    name: "Bữa Tối Truyền Thống",
    description: "Bữa tối đậm đà hương vị Việt Nam",
    dishes: [
      allDishes.find(d => d.id === "hu-tieu")!,
      allDishes.find(d => d.id === "cha-gio")!,
    ],
    totalCalories: 820,
    totalCost: "mid",
    totalTime: "25 phút",
    tags: ["vietnamese", "noodles", "soup"],
    mealType: "dinner",
  },
  {
    id: "meal-8",
    name: "Combo Miền Trung",
    description: "Trải nghiệm ẩm thực đặc sắc miền Trung",
    dishes: [
      allDishes.find(d => d.id === "mi-quang")!,
      allDishes.find(d => d.id === "banh-xeo")!,
    ],
    totalCalories: 980,
    totalCost: "mid",
    totalTime: "35 phút",
    tags: ["vietnamese", "noodles"],
    mealType: "lunch",
  },
  {
    id: "meal-9",
    name: "Bữa Sáng Healthy",
    description: "Bữa sáng nhẹ nhàng, đủ chất",
    dishes: [
      allDishes.find(d => d.id === "goi-cuon")!,
      allDishes.find(d => d.id === "pho-bo")!,
    ],
    totalCalories: 650,
    totalCost: "mid",
    totalTime: "25 phút",
    tags: ["vietnamese", "healthy", "soup"],
    mealType: "breakfast",
  },
  {
    id: "meal-10",
    name: "Bữa Tối Đặc Biệt",
    description: "Bữa tối sang trọng với các món đặc sản",
    dishes: [
      allDishes.find(d => d.id === "cao-lau")!,
      allDishes.find(d => d.id === "banh-xeo")!,
    ],
    totalCalories: 950,
    totalCost: "mid",
    totalTime: "30 phút",
    tags: ["vietnamese", "noodles"],
    mealType: "dinner",
  },
];
