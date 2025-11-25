import { Navbar } from "@/components/Navbar";
import { BookOpen } from "lucide-react";

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="border-b border-border bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            Blog Ẩm Thực
          </h1>
          <p className="text-lg text-muted-foreground">
            Chia sẻ kiến thức, mẹo vặt và câu chuyện về ẩm thực Việt Nam
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-accent/10">
            <BookOpen className="h-12 w-12 text-accent" />
          </div>
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            Đang Phát Triển
          </h2>
          <p className="text-muted-foreground">
            Blog đang được phát triển với nhiều nội dung hấp dẫn. Quay lại sau nhé!
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

export default Blog;
