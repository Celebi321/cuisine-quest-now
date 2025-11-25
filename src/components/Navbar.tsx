import { useState } from "react";
import { NavLink } from "./NavLink";
import { Button } from "./ui/button";
import { Menu, X, Home, ChefHat, MapPin, BookOpen, User } from "lucide-react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <NavLink to="/" className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">HÔM NAY ĂN GÌ?</span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <NavLink
              to="/"
              className="text-foreground/80 transition-colors hover:text-primary"
              activeClassName="text-primary font-semibold"
            >
              Món Ăn Ngon
            </NavLink>
            <NavLink
              to="/recipes"
              className="text-foreground/80 transition-colors hover:text-primary"
              activeClassName="text-primary font-semibold"
            >
              Công Thức Nấu
            </NavLink>
            <NavLink
              to="/locations"
              className="text-foreground/80 transition-colors hover:text-primary"
              activeClassName="text-primary font-semibold"
            >
              Địa Điểm Quanh Ta
            </NavLink>
            <NavLink
              to="/blog"
              className="text-foreground/80 transition-colors hover:text-primary"
              activeClassName="text-primary font-semibold"
            >
              Blog
            </NavLink>
            <Button variant="default" size="sm">
              <User className="mr-2 h-4 w-4" />
              Đăng Nhập
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="border-t border-border py-4 md:hidden">
            <div className="flex flex-col space-y-4">
              <NavLink
                to="/"
                className="text-foreground/80 transition-colors hover:text-primary"
                activeClassName="text-primary font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Món Ăn Ngon
              </NavLink>
              <NavLink
                to="/recipes"
                className="text-foreground/80 transition-colors hover:text-primary"
                activeClassName="text-primary font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Công Thức Nấu
              </NavLink>
              <NavLink
                to="/locations"
                className="text-foreground/80 transition-colors hover:text-primary"
                activeClassName="text-primary font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Địa Điểm Quanh Ta
              </NavLink>
              <NavLink
                to="/blog"
                className="text-foreground/80 transition-colors hover:text-primary"
                activeClassName="text-primary font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Blog
              </NavLink>
              <Button variant="default" size="sm" className="w-full">
                <User className="mr-2 h-4 w-4" />
                Đăng Nhập
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
