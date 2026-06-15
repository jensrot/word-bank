import { Pressable, StyleSheet, Text, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from "react-native";

import { useColorScheme } from "@/context/theme-context";
import { Colors } from "@/styles/global";

type ClearableTextInputProps = TextInputProps & {
    // Layout styling for the wrapper (e.g. flex, width, margin). The visual input
    // styling (border, background, height) stays on `style`, like a normal TextInput.
    containerStyle?: StyleProp<ViewStyle>;
};

// A TextInput with a clear (✕) button that appears only while there's text.
// Tapping it empties the field via onChangeText(''), and the button disappears.
export default function ClearableTextInput({
    containerStyle,
    style,
    value,
    onChangeText,
    ...props
}: ClearableTextInputProps) {
    const iconColor = Colors[useColorScheme()].textMuted;
    const showClear = !!value && value.length > 0;

    return (
        <View style={[styles.container, containerStyle]}>
            <TextInput
                {...props}
                value={value}
                onChangeText={onChangeText}
                style={[style, showClear && styles.inputWithClear]}
            />
            {showClear ? (
                <Pressable
                    style={styles.clearButton}
                    hitSlop={8}
                    onPress={() => onChangeText?.("")}
                    accessibilityRole="button"
                    accessibilityLabel="Clear text"
                >
                    <Text style={[styles.clearIcon, { color: iconColor }]}>✕</Text>
                </Pressable>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
        justifyContent: "center",
    },
    inputWithClear: {
        paddingRight: 36, // leave room for the clear button so text doesn't run under it
    },
    clearButton: {
        position: "absolute",
        right: 6,
        top: 0,
        bottom: 0,
        justifyContent: "center",
        paddingHorizontal: 6,
    },
    clearIcon: {
        fontSize: 15,
        fontWeight: "600",
    },
});
