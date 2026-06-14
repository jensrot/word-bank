import { useColorScheme } from "@/context/theme-context";
import { usePulse } from "@/hooks/use-pulse";
import { ACCENT, Colors } from "@/styles/global";
import { useState } from "react";
import { ActivityIndicator, Image, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

type Props = {
    uri: string | null | undefined;
    style: StyleProp<ViewStyle>;
};

export default function CoverImage({ uri, style }: Props) {
    const scheme = useColorScheme();
    const placeholderColor = Colors[scheme].coverPlaceholder;
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    // Pulsing skeleton placeholder; fades out once the image has loaded.
    const skeletonStyle = usePulse(!loaded);

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
                style={[StyleSheet.absoluteFill, { backgroundColor: placeholderColor, borderRadius: (style as any)?.borderRadius ?? 4 }, skeletonStyle]}
                pointerEvents="none"
            />
            {isLoading ? (
                <View style={[StyleSheet.absoluteFill, styles.spinner]} pointerEvents="none">
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
    spinner: {
        alignItems: "center",
        justifyContent: "center",
    },
});
