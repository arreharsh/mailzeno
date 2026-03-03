import { Search, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function TemplatesSearch({ value, onChange }: Props) {
  return (
    <div className="relative w-full sm:max-w-sm group">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition"
      />
      <input
        type="text"
        placeholder="Search templates..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg pl-9 pr-9 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-muted transition"
        >
          <X size={14} className="text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
