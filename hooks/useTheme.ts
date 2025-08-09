import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // Apply theme to document and update state
  const applyTheme = (newTheme: "light" | "dark") => {
    console.log("Applying theme:", newTheme);
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
  };

  // Initialize theme on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedTheme = localStorage.getItem("theme");
    const validTheme =
      savedTheme === "light" || savedTheme === "dark" ? savedTheme : null;
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initialTheme = validTheme || (systemPrefersDark ? "dark" : "light");

    console.log(
      "Initial theme:",
      initialTheme,
      "Saved:",
      savedTheme,
      "System prefers dark:",
      systemPrefersDark
    );
    applyTheme(initialTheme);
    setMounted(true);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const savedTheme = localStorage.getItem("theme");
      if (!savedTheme) {
        const newTheme = e.matches ? "dark" : "light";
        console.log("System theme change, applying:", newTheme);
        applyTheme(newTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Toggle theme manually
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    console.log("Toggling to:", newTheme);
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return { theme, toggleTheme, mounted };
}
