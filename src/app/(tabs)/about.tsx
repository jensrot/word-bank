import { useThemedStyles } from "@/hooks/use-themed-styles";
import { useScrollViewScroll } from "@/hooks/use-scroll-registration";
import { Colors, Fonts } from "@/styles/global";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { version } from "../../../package.json";

export default function AboutScreen() {
    const styles = useThemedStyles(lightStyles, darkStyles);

    const { ref: scrollRef, onScroll, scrollEventThrottle } = useScrollViewScroll();

    return (
        <ScrollView
            ref={scrollRef}
            style={styles.container}
            contentContainerStyle={styles.content}
            scrollEventThrottle={scrollEventThrottle}
            onScroll={onScroll}
        >
            <View style={styles.header}>
                <Text style={styles.appName}>Word Bank</Text>
                <Text style={styles.version}>Version {version}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.paragraph}>
                    Word Bank is a personal vocabulary manager designed to help you build your word collection while reading books. It allows you to save words, their definitions, and example sentences, all organized in one place.
                </Text>
                <Text style={styles.paragraph}>
                    The app is built using React Native and Expo Router, with a focus on simplicity and ease of use. It features a clean interface that lets you quickly add new words and review your existing collection.
                </Text>
                <Text style={styles.paragraph}>
                    Word Bank is an open-source project, and contributions are welcome! If you&apos;re interested in improving the app or adding new features, please check out the GitHub repository linked in the More tab.
                </Text>
            </View>
        </ScrollView>
    );
}

function buildStyles(C: typeof Colors.light) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: C.background,
        },
        content: {
            padding: 16,
            paddingBottom: 32,
            gap: 24,
        },
        header: {
            alignItems: 'center',
            gap: 4,
            paddingTop: 8,
        },
        appName: {
            fontSize: 24,
            fontWeight: '700',
            color: C.text,
            fontFamily: Fonts.serif,
        },
        version: {
            fontSize: 13,
            color: C.textMuted,
        },
        card: {
            backgroundColor: C.backgroundCard,
            borderRadius: 10,
            padding: 16,
            gap: 12,
        },
        paragraph: {
            fontSize: 15,
            color: C.textBody,
            lineHeight: 22,
        },
    });
}

const lightStyles = buildStyles(Colors.light);
const darkStyles = buildStyles(Colors.dark);
