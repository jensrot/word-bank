import { useColorScheme } from "@/context/theme-context";
import { usePulse } from "@/hooks/use-pulse";
import { ACCENT, Colors } from "@/styles/global";
import { useState, type ReactNode } from "react";
import { ActivityIndicator, Image, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

type Props = {
    uri: string | null | undefined;
    style: StyleProp<ViewStyle>;
    // Static node (e.g. an icon) shown when there's no uri, instead of the pulsing skeleton.
    placeholder?: ReactNode;
};

export default function CoverImage({ uri, style, placeholder }: Props) {
    const scheme = useColorScheme();
    const placeholderColor = Colors[scheme].coverPlaceholder;
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    const showPlaceholder = !uri && !!placeholder;
    const radius = (style as any)?.borderRadius ?? 4;

    // Pulse while an image is loading; for the empty state only pulse when there's no static placeholder.
    const skeletonStyle = usePulse(uri ? !loaded : !placeholder);

    // Spin only while an actual image is still in flight (not for missing/failed covers).
    const isLoading = !!uri && !loaded && !error;

    return (
        <View style={[style, styles.container]}>
            {uri ? (
                <Image
                    source={{ uri }}
                    style={StyleSheet.absoluteFill}
                    onLoad={() => setLoaded(true)}
                    onError={() => setError(true)}
                />
            ) : null}
            <Animated.View
                style={[StyleSheet.absoluteFill, { backgroundColor: placeholderColor, borderRadius: radius }, skeletonStyle]}
                pointerEvents="none"
            />
            {showPlaceholder ? (
                <View
                    style={[StyleSheet.absoluteFill, styles.center, { backgroundColor: placeholderColor, borderRadius: radius }]}
                    pointerEvents="none"
                >
                    {placeholder}
                </View>
            ) : null}
            {isLoading ? (
                <View style={[StyleSheet.absoluteFill, styles.center]} pointerEvents="none">
                    <ActivityIndicator size="small" color={ACCENT} />
                </View>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: "hidden",
    },
    center: {
        alignItems: "center",
        justifyContent: "center",
    },
});
