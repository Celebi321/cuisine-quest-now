import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "./NavLink";
import { Button } from "./ui/button";
import { Menu, X, Home, User, LogOut, BarChart3 } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/useAuth";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <NavLink to="/" className="flex items-center space-x-3 group">
            <img src={logo} alt="Logo" className="h-10 w-10 transition-transform group-hover:scale-110" />
            <span className="text-xl font-bold text-foreground hidden sm:inline">HÔM NAY ĂN GÌ?</span>
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
              to="/today"
              className="text-foreground/80 transition-colors hover:text-primary"
              activeClassName="text-primary font-semibold"
            >
              Hôm Nay
            </NavLink>
            <NavLink
              to="/statistics"
              className="text-foreground/80 transition-colors hover:text-primary"
              activeClassName="text-primary font-semibold"
            >
              Thống Kê
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
              Món Ngon Quanh Ta
            </NavLink>
            <NavLink
              to="/blog"
              className="text-foreground/80 transition-colors hover:text-primary"
              activeClassName="text-primary font-semibold"
            >
              Blog
            </NavLink>
            {isAdmin && (
              <NavLink
                to="/admin"
                className="text-foreground/80 transition-colors hover:text-primary"
                activeClassName="text-primary font-semibold"
              >
                Admin
              </NavLink>
            )}
            {user ? (
              <Button
                variant="default"
                size="sm"
                onClick={async () => {
                  await signOut();
                  navigate("/");
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Đăng Xuất
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate("/auth")}
              >
                <User className="mr-2 h-4 w-4" />
                Đăng Nhập
              </Button>
            )}
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
                to="/today"
                className="text-foreground/80 transition-colors hover:text-primary"
                activeClassName="text-primary font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Hôm Nay
              </NavLink>
              <NavLink
                to="/statistics"
                className="text-foreground/80 transition-colors hover:text-primary"
                activeClassName="text-primary font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Thống Kê
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
                Món Ngon Quanh Ta
              </NavLink>
              <NavLink
                to="/blog"
                className="text-foreground/80 transition-colors hover:text-primary"
                activeClassName="text-primary font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Blog
              </NavLink>
              {isAdmin && (
                <NavLink
                  to="/admin"
                  className="text-foreground/80 transition-colors hover:text-primary"
                  activeClassName="text-primary font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  Admin
                </NavLink>
              )}
              {user ? (
                <Button
                  variant="default"
                  size="sm"
                  className="w-full"
                  onClick={async () => {
                    await signOut();
                    navigate("/");
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng Xuất
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    navigate("/auth");
                    setIsOpen(false);
                  }}
                >
                  <User className="mr-2 h-4 w-4" />
                  Đăng Nhập
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
