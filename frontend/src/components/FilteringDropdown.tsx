import { ChevronDown } from "lucide-react";
import type { PintPostSortOrder, SortOrder } from "@/graphql/generated";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type SortField = keyof PintPostSortOrder;

type SortChoice = {
  label: string;
  field: SortField;
  order: SortOrder;
};

export default function FilteringDropdown({
  sortFieldValue,
  sortOrderValue,
  onSortFieldChange,
  onSortOrderChange,
  onSortChange, 
  homepage,
}: {
  sortFieldValue: SortField;
  sortOrderValue: SortOrder;
  onSortFieldChange: (sortFieldValue: SortField) => void;
  onSortOrderChange: (sortOrderValue: SortOrder) => void;
  onSortChange?: () => void;
  homepage: boolean;
}) {
  const fieldKey = homepage ? "homeSortField" : "exploreSortField";
  const orderKey = homepage ? "homeSortOrder" : "exploreSortOrder";

  const choices: SortChoice[] = [
    {
      label: "Newest first",    // created_at desc
      field: "created_at",
      order: "desc",
    },
    {
      label: "Oldest first",    // created_at asc
      field: "created_at",
      order: "asc",
    },
    {
      label: "Most liked",      // likes desc
      field: "likes",
      order: "desc",
    },
    {
      label: "Least liked",     // likes asc
      field: "likes",
      order: "asc",
    },
  ];

  const handleChoose = (choice: SortChoice) => {
    // Only update field if changing
    if (choice.field !== sortFieldValue) {
      onSortFieldChange(choice.field);
      sessionStorage.setItem(fieldKey, choice.field);
    }

    // Only update order if changing
    if (choice.order !== sortOrderValue) {
      onSortOrderChange(choice.order);
      sessionStorage.setItem(orderKey, choice.order);
    }
    onSortChange?.();
  };

  // What to show on the button
  const activeChoice =
    choices.find(
      (c) => c.field === sortFieldValue && c.order === sortOrderValue,
    ) ?? choices[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          effect="ripple"
          className="flex items-center gap-1 px-3"
          aria-label="Sort posts"
        >
          {activeChoice.label}
          <ChevronDown strokeWidth={1} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-44">
        {choices.map((choice) => {
          const isActive =
            choice.field === sortFieldValue && choice.order === sortOrderValue;

          return (
            <DropdownMenuItem
              key={choice.label}
              onClick={() => handleChoose(choice)}
              className={
                isActive
                  ? "bg-primary text-primary-foreground font-semibold cursor-pointer"
                  : "cursor-pointer"
              }
            >
              {choice.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}