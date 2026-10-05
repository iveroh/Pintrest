import { useLocation } from "react-router-dom";
import AvatarDropdown from "@/components/AvatarDropdown";
import { Beer, House, Compass } from "lucide-react";
import logo from "@/assets/Pintrest_guy.png";
import { useSmartNavigation } from "@/hooks/useSmartNavigation";
import { Button } from "@/components/ui/button";

export default function DesktopNavBar({ onPostClick }: { onPostClick: () => void }) {
  const { navigateTo } = useSmartNavigation();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogoKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigateTo("/");
    }
  };

  return (
    <nav
      id="desktop-top-navbar"
      className="fixed top-0 w-full flex flex-row justify-between items-center h-15 bg-primary z-10 px-4 transition-all"
      aria-label="Primary navigation"
    >
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigateTo("/")}
        role="button"
        tabIndex={0}
        aria-label="Go to home page"
        onKeyDown={handleLogoKeyDown}
      >
        <img
          src={logo}
          alt="Pintrest logo"
          className="h-14 w-14 transition-all duration-300 hover:brightness-130 active:scale-85"
        />
      </div>

      <div className="w-full lg:flex flex-row items-center justify-center h-full ml-4">
        <Button
          variant="ghost"
          size="lg"
          effect="ripple"
          onClick={() => navigateTo("/")}
          aria-current={currentPath === "/" ? "page" : undefined}
          className={`flex items-center gap-2 h-full px-6 text-base font-semibold transition-all rounded-none tracking-wide
                ${currentPath === "/" 
                ? "bg-secondary/90 shadow-inner" 
                : "hover:bg-secondary/50"}`}
        >
          
          <House className="size-5" aria-hidden="true" />
          Home
        </Button>

        <Button
          variant="ghost"
          size="lg"
          effect="ripple"
          onClick={onPostClick}
          className="flex items-center gap-2 h-full px-6 text-base font-semibold transition-all rounded-none hover:bg-secondary/50 tracking-wide"
        >
          <Beer className="size-5" aria-hidden="true" />
          Post a Pint

        </Button>

        <Button
          variant="ghost"
          size="lg"
          effect="ripple"
          onClick={() => navigateTo("/Explore")}
          aria-current={currentPath === "/Explore" ? "page" : undefined}
                      className={`flex items-center gap-2 h-full px-6 text-base font-semibold transition-all rounded-none tracking-wide
                ${currentPath === "/Explore" 
                ? "bg-secondary/90 shadow-inner" 
                : "hover:bg-secondary/50"}`}
        >
          
          <Compass className="size-5" aria-hidden="true" />
          Explore
        </Button>
      </div>

      <div className="flex items-center ml-auto px-4 hover:scale-105 active:scale-95">
        <AvatarDropdown />
      </div>
    </nav>
  );
}
