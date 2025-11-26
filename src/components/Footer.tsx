import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="w-full glass-card border-t-2 border-border mt-16 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-3 text-foreground">Hôm Nay Ăn Gì?</h3>
            <p className="text-muted-foreground text-sm">
              Gợi ý món ăn ngon mỗi ngày, giúp bạn không còn phải băn khoăn "hôm nay ăn gì?"
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-3 text-foreground">Liên kết</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/" className="hover:text-primary transition-all hover:translate-x-1 inline-block">Trang chủ</a></li>
              <li><a href="/recipes" className="hover:text-primary transition-all hover:translate-x-1 inline-block">Công thức</a></li>
              <li><a href="/locations" className="hover:text-primary transition-all hover:translate-x-1 inline-block">Món ngon quanh ta</a></li>
              <li><a href="/blog" className="hover:text-primary transition-all hover:translate-x-1 inline-block">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-3 text-foreground">Về chúng tôi</h3>
            <p className="text-muted-foreground text-sm">
              Made with <Heart className="inline h-4 w-4 text-primary fill-primary animate-pulse" /> by Souzy Team
            </p>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>© 2024 Hôm Nay Ăn Gì. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
