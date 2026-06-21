import { useEffect } from "react";
import { Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

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
            <Text className="text-base font-semibold text-white">.</Text>
        </Animated.View>
    );
}

// The accent "Search" button shared by the search screens. `style` lets callers
// add layout (e.g. spacing); the button look stays in one place.
export default function SearchButton({ onPress, loading = false, label = "Search", style }: SearchButtonProps) {
    return (
        <Pressable
            className={`items-center rounded-lg bg-accent py-2.5 ${loading ? "opacity-60" : ""}`}
            style={style}
            onPress={onPress}
            disabled={loading}
        >
            {loading ? (
                <View className="flex-row items-center">
                    <Text className="text-base font-semibold text-white">Searching</Text>
                    <LoadingDot delay={0} />
                    <LoadingDot delay={150} />
                    <LoadingDot delay={300} />
                </View>
            ) : (
                <Text className="text-base font-semibold text-white">{label}</Text>
            )}
        </Pressable>
    );
}
