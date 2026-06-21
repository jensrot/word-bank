import { Colors } from "@/styles/global";
import { Pressable } from "react-native";
import { useTheme } from "../context/theme-context";

import IconSymbol from "./ui/IconSymbol";

export default function ThemeToggle() {
    const { colorScheme, toggleTheme } = useTheme();
    return (
        <Pressable onPress={toggleTheme} className="mr-4 p-0.5" hitSlop={10}>
            <IconSymbol
                name={colorScheme === "dark" ? "sun.max.fill" : "moon.fill"}
                size={22}
                color={Colors[colorScheme].icon}
            />
        </Pressable>
    );
}
