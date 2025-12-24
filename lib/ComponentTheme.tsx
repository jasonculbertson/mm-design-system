import React, { createContext, useContext, ReactNode } from "react";
import { colors as darkColors, lightColors } from "./tokens";

type ThemeColors = typeof darkColors;

interface ComponentThemeContextType {
  colors: ThemeColors;
  isDark: boolean;
}

const ComponentThemeContext = createContext<ComponentThemeContextType>({
  colors: darkColors,
  isDark: true,
});

/**
 * Provides theme colors to components rendered in previews
 * Wrap your component preview with this provider
 */
export function ComponentThemeProvider({ 
  children, 
  darkMode = true 
}: { 
  children: ReactNode; 
  darkMode?: boolean;
}) {
  const colors = darkMode ? darkColors : lightColors as ThemeColors;
  
  return (
    <ComponentThemeContext.Provider value={{ colors, isDark: darkMode }}>
      {children}
    </ComponentThemeContext.Provider>
  );
}

/**
 * Hook to get theme-aware colors for design system components
 */
export function useComponentColors() {
  const context = useContext(ComponentThemeContext);
  return context.colors;
}

/**
 * Hook to check if component is in dark mode
 */
export function useIsDarkMode() {
  const context = useContext(ComponentThemeContext);
  return context.isDark;
}





