import { useEffect } from "react";
import { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

// Returns an animated style that gently pulses opacity, used for loading skeletons.
// `active` lets a caller fade it out (e.g. once an image has loaded).
export function usePulse(active: boolean = true) {
    const opacity = useSharedValue(1);

    useEffect(() => {
        opacity.value = withRepeat(withTiming(0.35, { duration: 750 }), -1, true);
    }, [opacity]);

    return useAnimatedStyle(() => ({
        opacity: active ? opacity.value : 0,
    }));
}
