import { useColorScheme } from "@/context/theme-context";

// Picks the light or dark stylesheet based on the current theme.
// Replaces the repeated `useColorScheme() === 'dark' ? darkStyles : lightStyles`.
export function useThemedStyles<T>(light: T, dark: T): T {
    return useColorScheme() === 'dark' ? dark : light;
}
