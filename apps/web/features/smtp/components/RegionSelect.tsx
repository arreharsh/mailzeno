import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

const REGIONS = [
  { id: "ap-south-1", label: "Asia Pacific (Mumbai)" },
  { id: "us-east-1", label: "US East (N. Virginia)" },
  { id: "us-west-2", label: "US West (Oregon)" },
  { id: "eu-west-1", label: "Europe (Ireland)" },
];

export function RegionSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const current = REGIONS.find((r) => r.id === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="smtp-input flex items-center justify-between w-full"
      >
        <span className="flex items-center gap-2">
          
          {current?.label}
        </span>

        <ChevronDown size={16} className="opacity-60" />
      </button>

      {open && (
        <div className="absolute mt-2 w-full rounded-lg border bg-card shadow-lg overflow-hidden z-50">
          {REGIONS.map((region) => (
            <button
              key={region.id}
              type="button"
              onClick={() => {
                onChange(region.id);
                setOpen(false);
              }}
              className="flex items-center justify-between w-full px-3 py-2 text-sm hover:bg-accent transition"
            >
              <span className="flex items-center gap-2">
                
                {region.label}
              </span>

              {value === region.id && (
                <Check size={14} className="text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
