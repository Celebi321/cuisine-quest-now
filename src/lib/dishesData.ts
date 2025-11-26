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
