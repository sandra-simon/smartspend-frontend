import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { categoryIconMap } from "../../utils/categoryIcons";

interface CategoryIconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

function CategoryIconPicker({
  value,
  onChange,
}: CategoryIconPickerProps) {
  const [search, setSearch] = useState("");

  const icons = useMemo(() => {
    const query = search.trim().toLowerCase();

    return Object.entries(categoryIconMap).filter(([name]) =>
      name.toLowerCase().includes(query),
    );
  }, [search]);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-text-primary">
        Category icon
      </label>

      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
        />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search icons..."
          aria-label="Search category icons"
          className="w-full rounded-control border border-border bg-input py-2.5 pl-9 pr-3 text-sm text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
        />
      </div>

      <div
        className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-7"
        role="group"
        aria-label="Available category icons"
      >
        {icons.map(([name, Icon]) => {
          const selected = value === name;

          return (
            <button
              key={name}
              type="button"
              onClick={() => onChange(name)}
              aria-label={name}
              aria-pressed={selected}
              title={name}
              className={`flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-control border p-2 transition-colors ${
                selected
                  ? "border-brand bg-brand-soft text-brand"
                  : "border-border bg-surface text-text-secondary hover:border-brand-muted hover:bg-surface-muted"
              }`}
            >
              <Icon size={20} />
              <span className="max-w-full truncate text-xs capitalize">
                {name}
              </span>
            </button>
          );
        })}

        {icons.length === 0 && (
          <p className="col-span-full py-5 text-center text-sm text-text-secondary">
            No matching icons found.
          </p>
        )}
      </div>

      <p className="text-xs text-text-secondary">
        Selected: <span className="font-medium capitalize">{value || "None"}</span>
      </p>
    </div>
  );
}

export default CategoryIconPicker;