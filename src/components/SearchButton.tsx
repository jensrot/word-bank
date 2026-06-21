import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

import { ACCENT } from "@/styles/global";

type SearchButtonProps = {
    onPress: () => void;
    loading?: boolean;
    label?: string;
    style?: StyleProp<ViewStyle>;
};

// One dot that fades in and out forever. Staggering the `delay` across three of
// them makes the "..." ripple while results load.
function LoadingDot({ delay }: { delay: number }) {
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        opacity.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(1, { duration: 350 }),
                    withTiming(0.3, { duration: 350 }),
                ),
                -1,
                false,
            ),
        );
    }, [delay, opacity]);

    const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

    return (
        <Animated.View style={animStyle}>
            <Text style={styles.buttonText}>.</Text>
        </Animated.View>
    );
}

// The accent "Search" button shared by the search screens. `style` lets callers
// add layout (e.g. spacing); the button look stays in one place.
export default function SearchButton({ onPress, loading = false, label = "Search", style }: SearchButtonProps) {
    return (
        <Pressable
            style={[styles.button, loading && styles.buttonDisabled, style]}
            onPress={onPress}
            disabled={loading}
        >
            {loading ? (
                <View style={styles.loadingRow}>
                    <Text style={styles.buttonText}>Searching</Text>
                    <LoadingDot delay={0} />
                    <LoadingDot delay={150} />
                    <LoadingDot delay={300} />
                </View>
            ) : (
                <Text style={styles.buttonText}>{label}</Text>
            )}
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
    loadingRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
