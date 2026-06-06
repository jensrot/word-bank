import { useScrollContext } from "@/context/scroll-context";
import { ACCENT } from "@/styles/global";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text } from "react-native";

const SCROLL_THRESHOLD = 20;
const TAB_BAR_HEIGHT = 105;

export default function FloatingActionButton() {
    const { scrollY, scrollToTop } = useScrollContext();
    const showScrollTop = scrollY > SCROLL_THRESHOLD;

    const opacity = useRef(new Animated.Value(1)).current;
    const prevShowScrollTop = useRef(showScrollTop);

    useEffect(() => {
        if (prevShowScrollTop.current === showScrollTop) {
            return;
        }
        prevShowScrollTop.current = showScrollTop;
        Animated.sequence([
            Animated.timing(opacity, { toValue: 0, duration: 100, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();
    }, [showScrollTop]);

    function handlePress(): void {
        if (showScrollTop && scrollToTop) {
            scrollToTop();
        } else {
            router.push('/(tabs)/custom-book' as any);
        }
    }

    return (
        <Animated.View style={[styles.button, { opacity, bottom: TAB_BAR_HEIGHT + 16 }]}>
            <Pressable style={styles.pressable} onPress={handlePress} hitSlop={8}>
                <Text style={styles.icon}>{showScrollTop ? '↑' : '+'}</Text>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    // Material Design: FAB sits 16dp from the screen edges (here, 16dp above the bottom tab bar).
    button: {
        position: 'absolute',
        right: 16,
        zIndex: 100,
    },
    // Material Design standard FAB: 56dp diameter, 6dp resting elevation, 24dp icon.
    pressable: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: ACCENT,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 6,
    },
    icon: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '700',
        lineHeight: 28,
    },
});
