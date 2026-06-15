import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from "react-native";

import { ACCENT } from "@/styles/global";

type SearchButtonProps = {
    onPress: () => void;
    loading?: boolean;
    label?: string;
    style?: StyleProp<ViewStyle>;
};

// The accent "Search" button shared by the search screens. `style` lets callers
// add layout (e.g. spacing); the button look stays in one place.
export default function SearchButton({ onPress, loading = false, label = "Search", style }: SearchButtonProps) {
    return (
        <Pressable
            style={[styles.button, loading && styles.buttonDisabled, style]}
            onPress={onPress}
            disabled={loading}
        >
            <Text style={styles.buttonText}>{loading ? "Searching..." : label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: ACCENT,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
