import { useColorScheme } from "@/context/theme-context";
import { Colors } from "@/styles/global";
import { useEffect, useState } from "react";
import { Image, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

type Props = {
    uri: string | null | undefined;
    style: StyleProp<ViewStyle>;
};

export default function CoverImage({ uri, style }: Props) {
    const scheme = useColorScheme();
    const placeholderColor = Colors[scheme].coverPlaceholder;
    const [loaded, setLoaded] = useState(false);

    const opacity = useSharedValue(1);

    useEffect(() => {
        opacity.value = withRepeat(withTiming(0.35, { duration: 750 }), -1, true);
    }, []);

    const skeletonStyle = useAnimatedStyle(() => ({
        opacity: loaded ? 0 : opacity.value,
    }));

    return (
        <View style={[style, styles.container]}>
            {uri ? (
                <Image
                    source={{ uri }}
                    style={StyleSheet.absoluteFill}
                    onLoad={() => setLoaded(true)}
                />
            ) : null}
            <Animated.View
                style={[StyleSheet.absoluteFill, { backgroundColor: placeholderColor, borderRadius: (style as any)?.borderRadius ?? 4 }, skeletonStyle]}
                pointerEvents="none"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: "hidden",
    },
});
