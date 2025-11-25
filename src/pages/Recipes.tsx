import { Navbar } from "@/components/Navbar";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Recipes = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="border-b border-border bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            Công Thức Nấu Ăn
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Học nấu các món ăn ngon với hướng dẫn chi tiết từng bước
          </p>

          <div className="relative mx-auto flex max-w-2xl items-center overflow-hidden rounded-full border-2 border-primary/20 bg-card shadow-lg">
            <Input
              type="text"
              placeholder="Tìm công thức nấu ăn..."
              className="h-12 border-0 bg-transparent px-6 focus-visible:ring-0"
            />
            <Button size="lg" className="h-12 rounded-l-none rounded-r-full px-6">
              <Search className="mr-2 h-5 w-5" />
              Tìm
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
            <span className="text-5xl">👨‍🍳</span>
          </div>
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            Đang Phát Triển
          </h2>
          <p className="text-muted-foreground">
            Trang công thức nấu ăn đang được phát triển. Quay lại sau nhé!
          </p>
        </div>
      </section>

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

export default Recipes;
