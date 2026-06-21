import { Pressable, Text, TextInput, View, type TextInputProps } from "react-native";

type ClearableTextInputProps = TextInputProps & {
    // Layout classes for the wrapper (e.g. flex/width/margin). The input's own
    // look is passed via `className`, like a normal TextInput.
    containerClassName?: string;
};

// A TextInput with a clear (✕) button that appears only while there's text.
// Tapping it empties the field via onChangeText(''), and the button disappears.
export default function ClearableTextInput({
    containerClassName,
    className,
    value,
    onChangeText,
    ...props
}: ClearableTextInputProps) {
    const showClear = !!value && value.length > 0;

    return (
        <View className={`relative justify-center ${containerClassName ?? ""}`}>
            <TextInput
                {...props}
                value={value}
                onChangeText={onChangeText}
                // pr-9 leaves room for the clear button so text doesn't run under it
                className={`${className ?? ""} ${showClear ? "pr-9" : ""}`}
            />
            {showClear ? (
                <Pressable
                    className="absolute bottom-0 right-1.5 top-0 justify-center px-1.5"
                    hitSlop={8}
                    onPress={() => onChangeText?.("")}
                    accessibilityRole="button"
                    accessibilityLabel="Clear text"
                >
                    <Text className="text-[15px] font-semibold text-muted">✕</Text>
                </Pressable>
            ) : null}
        </View>
    );
}
