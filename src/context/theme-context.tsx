import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

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

export function useTheme() {
    return useContext(ThemeContext);
}

export function useColorScheme(): ColorScheme {
    return useContext(ThemeContext).colorScheme;
}
