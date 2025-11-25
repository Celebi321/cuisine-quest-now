import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20" />
      
      <div className="container relative mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground md:text-7xl">
            HÔM NAY ĂN GÌ?
          </h1>
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Khám phá thế giới ẩm thực cùng những gợi ý hoàn hảo cho bữa ăn hôm nay
          </p>

          {/* Search Bar */}
          <div className="relative mx-auto mb-12 flex max-w-2xl items-center overflow-hidden rounded-full border-2 border-primary/20 bg-card shadow-lg transition-all hover:border-primary/40 focus-within:border-primary">
            <Input
              type="text"
              placeholder="Tìm kiếm món ăn, công thức..."
              className="h-14 border-0 bg-transparent px-6 text-base focus-visible:ring-0"
            />
            <Button
              size="lg"
              className="h-14 rounded-l-none rounded-r-full px-8"
            >
              <Search className="mr-2 h-5 w-5" />
              Tìm Kiếm
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/recipes"
              className="group h-auto flex-col gap-2 rounded-2xl p-6 transition-all hover:scale-105 hover:border-primary hover:bg-primary/5 border border-border bg-card flex items-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white transition-all group-hover:scale-110">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.1,13.34L3.91,9.16a1,1,0,0,0-1.41,1.41l4.19,4.19,1.41-1.42ZM23,4H7A1,1,0,0,0,7,6H22V19a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1V10.414l-1-1V19a3,3,0,0,0,3,3H21a3,3,0,0,0,3-3V5A1,1,0,0,0,23,4ZM10.84,13.52l-1.41,1.41L6.57,12.07l1.41-1.41Z"/>
                </svg>
              </div>
              <span className="font-semibold">Công Thức Nấu</span>
            </a>

            <a
              href="/locations"
              className="group h-auto flex-col gap-2 rounded-2xl p-6 transition-all hover:scale-105 hover:border-secondary hover:bg-secondary/5 border border-border bg-card flex items-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-white transition-all group-hover:scale-110">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Zm0-13a5,5,0,0,0-5,5H9a3,3,0,0,1,6,0,3,3,0,0,1-1.5,2.59A2,2,0,0,0,12,16v1h2V16a4,4,0,0,0,2-3.46A5,5,0,0,0,12,7Zm1,12H11v2h2Z"/>
                </svg>
              </div>
              <span className="font-semibold">Địa Điểm Gần Đây</span>
            </a>

            <button
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
              className="group h-auto flex-col gap-2 rounded-2xl p-6 transition-all hover:scale-105 hover:border-accent hover:bg-accent/5 border border-border bg-card flex items-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white transition-all group-hover:scale-110">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm1,15H11V15h2Zm0-4H11V7h2Z"/>
                </svg>
              </div>
              <span className="font-semibold">Gợi Ý Ngẫu Nhiên</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
