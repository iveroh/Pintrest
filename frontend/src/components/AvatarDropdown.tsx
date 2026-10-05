import { UserIcon, LogOutIcon, UserRoundPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/authContext";
import { useSmartNavigation } from "@/hooks/useSmartNavigation";

const listItems = [
  { icon: UserIcon, property: "Profile" },
  { icon: LogOutIcon, property: "Logout" },
];

const listItemsGuest = [
  { icon: UserIcon, property: "Login" },
  { icon: UserRoundPlus, property: "Sign Up" },
];

export default function AvatarDropdown() {
  const { user, logout } = useAuth();
  const { navigateTo } = useSmartNavigation();

  const handleMenuClick = (property: string) => {
    if (property === "Login") navigateTo("/signin");
    else if (property === "Sign Up") navigateTo("/signup");
    else if (property === "Profile") navigateTo("/profile");
    else if (property === "Logout") {
      logout();
      navigateTo("/");
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="overflow-hidden rounded-full hover:cursor-pointer size-10"
          aria-haspopup="menu"
          aria-label="User menu"
        >
          {user?.avatar_path ? (
            <img
              src={user.avatar_path}
              alt={`${user.display_name || "User"} profile picture`}
            />
          ) : (
            <UserRoundPlus aria-hidden="true" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuGroup>
          {!user &&
            listItemsGuest.map((item) => (
              <DropdownMenuItem key={item.property} asChild>
                <Button
                  effect="none"
                  variant="secondary"
                  className="
                    w-full justify-start gap-2 bg-white text-secondary-foreground
                    transition-colors

                    data-[highlighted]:bg-primary
                    data-[highlighted]:text-primary-foreground
                    data-[highlighted]:cursor-pointer

                    focus-visible:ring-2
                    focus-visible:ring-primary
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-background
                  "
                  onClick={() => handleMenuClick(item.property)}
                >
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                  {item.property}
                </Button>
              </DropdownMenuItem>
            ))}

          {user &&
            listItems.map((item) => (
              <DropdownMenuItem key={item.property} asChild>
                <Button
                  effect="none"
                  variant="secondary"
                  className="
                    w-full justify-start gap-2 bg-white text-secondary-foreground
                    transition-colors

                    data-[highlighted]:bg-primary
                    data-[highlighted]:text-primary-foreground
                    data-[highlighted]:cursor-pointer

                    focus-visible:ring-2
                    focus-visible:ring-primary
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-background
                  "
                  onClick={() => handleMenuClick(item.property)}
                >
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                  {item.property}
                </Button>
              </DropdownMenuItem>
            ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
