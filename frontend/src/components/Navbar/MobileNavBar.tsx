import { useLocation } from "react-router-dom";
import AvatarDropdown from "@/components/AvatarDropdown";
import { Beer, House, Compass } from "lucide-react";
import logo from "@/assets/Pintrest_guy.png";
import { useSmartNavigation } from "@/hooks/useSmartNavigation";

export default function MobileNavBar({ onPostClick }: { onPostClick: () => void }) {
  const { navigateTo } = useSmartNavigation();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
      <header
        id="mobile-top-navbar"
        className="fixed top-0 left-0 w-full px-3 flex flex-row justify-between items-center h-15 bg-primary z-10"
        aria-label="App header"
      >
        <div className="flex justify-between px-3">
          <img
            src={logo}
            alt="Pintrest logo"
            className="h-14 w-14 transition-all duration-300 active:brightness-130 active:scale-95"
          />
        </div>

        <div className="lex justify-between px-3">
          <AvatarDropdown />
        </div>
      </header>

      <nav
        id="mobile-bottom-nav"
        className="flex flex-row h-15 bg-primary fixed bottom-0 w-full z-10"
        aria-label="Main navigation"
      >
        <button
          onClick={() => navigateTo("/")}
          className={`flex flex-1 items-center justify-center h-full transition-colors
            hover:bg-secondary active:bg-secondary/70
            ${currentPath === "/" ? "bg-secondary" : ""}
          `}
          aria-label="Home"
          aria-current={currentPath === "/" ? "page" : undefined}
        >
          <House className="size-6 translate-y-[1px]" aria-hidden="true" />
        </button>

        <button
          onClick={onPostClick}
          className="flex flex-1 items-center justify-center h-full hover:bg-secondary active:bg-secondary/70 transition-colors"
          aria-label="Create new post"
        >
          <Beer className="size-6 translate-y-[1px]" aria-hidden="true" />
        </button>

        <button
          onClick={() => navigateTo("/Explore")}
          className={`flex flex-1 items-center justify-center h-full transition-colors
            hover:bg-secondary active:bg-secondary/70
            ${currentPath === "/Explore" ? "bg-secondary" : ""}
          `}
          aria-label="Explore"
          aria-current={currentPath === "/Explore" ? "page" : undefined}
        >
          <Compass className="size-6 translate-y-[1px]" aria-hidden="true" />
        </button>
      </nav>
    </>
  );
}
