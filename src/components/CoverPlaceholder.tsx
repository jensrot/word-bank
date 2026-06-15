import { Ionicons } from "@expo/vector-icons";

import { useColorScheme } from "@/context/theme-context";
import { Colors } from "@/styles/global";

// The icon shown inside a CoverImage when no cover has been picked.
// Pass to CoverImage's `placeholder` prop; `size` should suit the cover dimensions.
export default function CoverPlaceholder({ size = 40 }: { size?: number }) {
    return <Ionicons name="book-outline" size={size} color={Colors[useColorScheme()].textMuted} />;
}
