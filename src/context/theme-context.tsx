import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { Appearance, useColorScheme as useSystemColorScheme } from "react-native";

import { getTheme, setTheme, type ColorScheme } from "@/storage/theme-storage";

type ThemeContextType = {
    colorScheme: ColorScheme;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
    colorScheme: "light",
    toggleTheme: () => { },
});

export function AppThemeProvider({ children }: { children: ReactNode }) {
    const system: ColorScheme = useSystemColorScheme() === 'dark' ? 'dark' : 'light';
    const [colorScheme, setColorScheme] = useState<ColorScheme>(system);
    useEffect(() => {
        // Restore the saved theme on launch; keep the system default if none saved.
        getTheme().then((saved) => {
            if (saved) {
                setColorScheme(saved);
            }
        });
    }, []);

    // Drive NativeWind's color scheme from the app's (persisted) choice, so className
    // dark styles and the flipped theme tokens follow the manual toggle, not the OS.
    // `Appearance.setColorScheme` is native-only — it's missing on React Native Web,
    // so guard the call to avoid a crash there (web follows prefers-color-scheme).
    useEffect(() => {
        Appearance.setColorScheme?.(colorScheme);
    }, [colorScheme]);

    function toggleTheme(): void {
        const next: ColorScheme = colorScheme === "light" ? "dark" : "light";
        setColorScheme(next);
        setTheme(next); // persist the choice to device storage
    }

    return (
        <ThemeContext.Provider value={{ colorScheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextType {
    return useContext(ThemeContext);
}

export function useColorScheme(): ColorScheme {
    return useContext(ThemeContext).colorScheme;
}
