import type { ReadStatus } from "@/models/read-list-book";
import { READ_STATUS_LABELS, READ_STATUS_ORDER } from "@/models/read-list-book";

import { Pressable, Text, View } from "react-native";

type ReadStatusSelectorProps = {
    value: ReadStatus;
    onChange: (status: ReadStatus) => void;
};

export default function ReadStatusSelector({ value, onChange }: ReadStatusSelectorProps) {
    return (
        <View className="flex-row gap-2">
            {READ_STATUS_ORDER.map((status) => {
                const selected = status === value;
                return (
                    <Pressable
                        key={status}
                        onPress={() => onChange(status)}
                        className={`flex-1 items-center justify-center rounded-lg border py-2 ${selected ? "border-accent bg-accent" : "border-border-input bg-input"}`}
                        accessibilityRole="button"
                        accessibilityState={{ selected }}
                        accessibilityLabel={READ_STATUS_LABELS[status]}
                    >
                        <Text
                            className={`text-[13px] font-semibold ${selected ? "text-white" : "text-muted"}`}
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
