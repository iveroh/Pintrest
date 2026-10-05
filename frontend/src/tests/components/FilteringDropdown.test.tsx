import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilteringDropdown from "@/components/FilteringDropdown";

describe("FilteringDropdown", () => {
  it("renders with default sorting options", () => {
    render(
      <FilteringDropdown
        sortFieldValue="created_at"
        sortOrderValue="desc"
        onSortFieldChange={vi.fn()}
        onSortOrderChange={vi.fn()}
        homepage={true}
      />
    );

    expect(screen.getByLabelText("Sort posts")).toBeInTheDocument();
    expect(screen.getByText("Newest first")).toBeInTheDocument();
  });

  it("calls onSortFieldChange and onSortOrderChange when a new option is selected", async () => {
    const mockFieldChange = vi.fn();
    const mockOrderChange = vi.fn();

    render(
      <FilteringDropdown
        sortFieldValue="created_at"
        sortOrderValue="desc"
        onSortFieldChange={mockFieldChange}
        onSortOrderChange={mockOrderChange}
        homepage={true}
      />
    );

    // Open the dropdown menu
    const user = userEvent.setup();

    await user.click(screen.getByLabelText("Sort posts"));

    // Click on the "Oldest first" option
    const option = await screen.findByRole("menuitem", { name: "Oldest first" });
    await user.click(option);

    expect(mockFieldChange).not.toHaveBeenCalled();
    expect(mockOrderChange).toHaveBeenCalledWith("asc");
  });
});
