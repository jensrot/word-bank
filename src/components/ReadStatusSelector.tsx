import { useColorScheme } from "@/context/theme-context";

import type { ReadStatus } from "@/models/read-list-book";
import { READ_STATUS_LABELS, READ_STATUS_ORDER } from "@/models/read-list-book";

import { ACCENT, Colors } from "@/styles/global";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ReadStatusSelectorProps = {
    value: ReadStatus;
    onChange: (status: ReadStatus) => void;
};

export default function ReadStatusSelector({ value, onChange }: ReadStatusSelectorProps) {
    const styles = useColorScheme() === 'dark' ? darkStyles : lightStyles;

    return (
        <View style={styles.row}>
            {READ_STATUS_ORDER.map((status) => {
                const selected = status === value;
                return (
                    <Pressable
                        key={status}
                        onPress={() => onChange(status)}
                        style={[styles.pill, selected && styles.pillSelected]}
                        accessibilityRole="button"
                        accessibilityState={{ selected }}
                        accessibilityLabel={READ_STATUS_LABELS[status]}
                    >
                        <Text
                            style={[styles.pillText, selected && styles.pillTextSelected]}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            minimumFontScale={0.7}
                        >
                            {READ_STATUS_LABELS[status]}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

function buildStyles(C: typeof Colors.light) {
    return StyleSheet.create({
        row: {
            flexDirection: 'row',
            gap: 8,
        },
        pill: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 8,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: C.borderInput,
            backgroundColor: C.backgroundInput,
        },
        pillSelected: {
            borderColor: ACCENT,
            backgroundColor: ACCENT,
        },
        pillText: {
            fontSize: 13,
            fontWeight: '600',
            color: C.textMuted,
        },
        pillTextSelected: {
            color: '#fff',
        },
    });
}

const lightStyles = buildStyles(Colors.light);
const darkStyles = buildStyles(Colors.dark);
