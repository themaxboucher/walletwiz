import { useState } from "react";
import { Separator } from "../ui/separator";
import { Check } from "lucide-react";

const themes = [
  {
    key: "light",
    label: "Light Mode",
    illustration: (
      <div className="relative w-full aspect-[3/2] flex flex-col rounded-lg overflow-hidden bg-white border border-border">
        {/* Browser bar */}
        <div className="flex items-center h-4 bg-gray-100 border-b border-gray-200 px-2">
          <span className="w-2 h-2 rounded-full bg-red-400 mr-1" />
          <span className="w-2 h-2 rounded-full bg-yellow-400 mr-1" />
          <span className="w-2 h-2 rounded-full bg-green-400" />
        </div>
        {/* Content */}
        <div className="flex-1 flex flex-col gap-2 p-2">
          <div className="bg-gray-100 rounded w-3/4 h-3" />
          <div className="bg-gray-100 rounded w-full h-3" />
          <div className="bg-gray-100 rounded w-1/2 h-3" />
          <div className="flex gap-2 mt-2">
            <div className="bg-gray-200 rounded w-1/3 h-6" />
            <div className="bg-gray-200 rounded w-1/3 h-6" />
            <div className="bg-gray-200 rounded w-1/3 h-6" />
          </div>
        </div>
      </div>
    ),
  },
  {
    key: "dark",
    label: "Dark Mode",
    illustration: (
      <div className="relative w-full aspect-[3/2] flex flex-col rounded-lg overflow-hidden bg-[#18181b] border border-border">
        {/* Browser bar */}
        <div className="flex items-center h-4 bg-[#232329] border-b border-[#232329] px-2">
          <span className="w-2 h-2 rounded-full bg-red-400 mr-1" />
          <span className="w-2 h-2 rounded-full bg-yellow-400 mr-1" />
          <span className="w-2 h-2 rounded-full bg-green-400" />
        </div>
        {/* Content */}
        <div className="flex-1 flex flex-col gap-2 p-2">
          <div className="bg-[#232329] rounded w-3/4 h-3" />
          <div className="bg-[#232329] rounded w-full h-3" />
          <div className="bg-[#232329] rounded w-1/2 h-3" />
          <div className="flex gap-2 mt-2">
            <div className="bg-[#27272a] rounded w-1/3 h-6" />
            <div className="bg-[#27272a] rounded w-1/3 h-6" />
            <div className="bg-[#27272a] rounded w-1/3 h-6" />
          </div>
        </div>
      </div>
    ),
  },
  {
    key: "system",
    label: "System Preferences",
    illustration: (
      <div className="relative w-full aspect-[3/2] flex flex-col rounded-lg overflow-hidden border border-border bg-gradient-to-r from-white to-[#18181b]">
        {/* Browser bar */}
        <div className="flex items-center h-4 bg-gradient-to-r from-gray-100 to-[#232329] border-b border-gray-200 px-2">
          <span className="w-2 h-2 rounded-full bg-red-400 mr-1" />
          <span className="w-2 h-2 rounded-full bg-yellow-400 mr-1" />
          <span className="w-2 h-2 rounded-full bg-green-400" />
        </div>
        {/* Content */}
        <div className="flex-1 flex flex-col gap-2 p-2">
          <div className="bg-gradient-to-r from-gray-100 to-[#232329] rounded w-3/4 h-3" />
          <div className="bg-gradient-to-r from-gray-100 to-[#232329] rounded w-full h-3" />
          <div className="bg-gradient-to-r from-gray-100 to-[#232329] rounded w-1/2 h-3" />
          <div className="flex gap-2 mt-2">
            <div className="bg-gradient-to-r from-gray-200 to-[#27272a] rounded w-1/3 h-6" />
            <div className="bg-gradient-to-r from-gray-200 to-[#27272a] rounded w-1/3 h-6" />
            <div className="bg-gradient-to-r from-gray-200 to-[#27272a] rounded w-1/3 h-6" />
          </div>
        </div>
      </div>
    ),
  },
];

export default function PreferencesSettings() {
  const [selected, setSelected] = useState("light");

  return (
    <div className="h-full">
      <div className="space-y-0.5 mb-6">
        <h2 className="text-xl font-semibold">Preferences</h2>
        <p className="text-sm text-muted-foreground">
          Configure your account settings, preferences, and privacy options.
        </p>
      </div>
      <Separator className="my-4" />
      <h3 className="font-semibold mb-2">Theme</h3>
      <div className="grid grid-cols-3 gap-4 w-full">
        {themes.map((theme) => (
          <button
            key={theme.key}
            type="button"
            className={`relative group bg-background border rounded-xl w-full aspect-[3/2] flex flex-col items-stretch overflow-hidden transition-all
              ${
                selected === theme.key
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border hover:border-primary/40"
              }
            `}
            onClick={() => setSelected(theme.key)}
            aria-pressed={selected === theme.key}
          >
            {theme.illustration}
            <div
              className={`absolute left-0 right-0 bottom-0 flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-black/60 transition-all
              ${selected === theme.key ? "backdrop-blur-sm" : ""}
            `}
            >
              <span className="flex items-center">
                <span className="mr-2">
                  <input
                    type="radio"
                    name="theme"
                    value={theme.key}
                    checked={selected === theme.key}
                    onChange={() => setSelected(theme.key)}
                    className="accent-primary"
                  />
                </span>
                <span className="font-medium text-sm">{theme.label}</span>
              </span>
              {selected === theme.key && (
                <Check className="ml-auto text-primary w-4 h-4" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
