import { useTheme } from "@/components/theme-provider";
import { Moon, Sun } from "lucide-react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="
        relative
        flex
        h-8
        w-16
        items-center
        rounded-full
        bg-muted
        p-1
        transition-colors
        duration-300
        dark:bg-slate-800
      "
      aria-label="Changer le thème"
    >
      {/* Soleil */}
      <Sun
        className="
          absolute
          left-2
          h-4
          w-4
          transition-opacity
          duration-300
          dark:opacity-40
        "
      />

      {/* Lune */}
      <Moon
        className="
          absolute
          right-2
          h-4
          w-4
          transition-opacity
          duration-300
          opacity-40
          dark:opacity-100
        "
      />

      {/* Bouton mobile */}
      <span
        className={`
          relative
          z-10
          h-6
          w-6
          rounded-full
          bg-background
          shadow-md
          transition-transform
          duration-300
          ease-in-out
          ${isDark ? "translate-x-8" : "translate-x-0"}
        `}
      />
    </button>
  );
}
