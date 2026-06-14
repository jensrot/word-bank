import { useThemedStyles } from "@/hooks/use-themed-styles";

import type { ReadListBook } from "@/models/read-list-book";
import { READ_STATUS_LABELS } from "@/models/read-list-book";

import { ACCENT, Colors } from "@/styles/global";
import { coverUri } from "@/utils/cover-uri";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type ReadListItemProps = {
    item: ReadListBook;
    wordCount: number;
    onPress: () => void;
    onRemove: () => void;
    onChangeStatus: () => void;
};

export default function ReadListItem({ item, wordCount, onPress, onRemove, onChangeStatus }: ReadListItemProps) {
    const styles = useThemedStyles(lightStyles, darkStyles);

    const cover = coverUri(item.cover_i, 'S');

    return (
        <View style={styles.row}>
            <Pressable style={styles.rowContent} onPress={onPress}>
                {cover ? (
                    <Image source={{ uri: cover }} style={styles.cover} />
                ) : (
                    <View style={[styles.cover, styles.coverPlaceholder]} />
                )}
                <View style={styles.info}>
                    <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                    {item.author ? (
                        <Text style={styles.author} numberOfLines={1}>{item.author}</Text>
                    ) : null}
                    {item.year ? (
                        <Text style={styles.year}>{item.year}</Text>
                    ) : null}
                    <Pressable
                        onPress={onChangeStatus}
                        hitSlop={6}
                        style={[styles.statusBadge, styles[`status_${item.status}`]]}
                        accessibilityRole="button"
                        accessibilityLabel={`Status: ${READ_STATUS_LABELS[item.status]}. Tap to change.`}
                    >
                        <Text style={[styles.statusText, styles[`statusText_${item.status}`]]}>
                            {READ_STATUS_LABELS[item.status]}
                        </Text>
                    </Pressable>
                </View>
                <View style={styles.badge}>
                    <Text style={styles.badgeCount}>{wordCount}</Text>
                    <Text style={styles.badgeLabel}>
                        {wordCount === 1 ? 'word' : 'words'}
                    </Text>
                </View>
            </Pressable>
            <Pressable onPress={onRemove} style={styles.removeButton} hitSlop={8}>
                <Text style={styles.removeText}>✕</Text>
            </Pressable>
        </View>
    );
}

function buildStyles(C: typeof Colors.light) {
    return StyleSheet.create({
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: C.border,
        },
        rowContent: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingVertical: 12,
        },
        cover: {
            width: 48,
            height: 64,
            borderRadius: 4,
        },
        coverPlaceholder: {
            backgroundColor: C.coverPlaceholder,
        },
        info: {
            flex: 1,
            gap: 3,
        },
        title: {
            fontSize: 15,
            fontWeight: '600',
            color: C.text,
        },
        author: {
            fontSize: 13,
            color: C.textSecondary,
        },
        year: {
            fontSize: 12,
            color: C.textMuted,
        },
        statusBadge: {
            alignSelf: 'flex-start',
            borderWidth: 1,
            borderRadius: 4,
            paddingHorizontal: 7,
            paddingVertical: 2,
            marginTop: 4,
        },
        statusText: {
            fontSize: 11,
            fontWeight: '600',
        },
        // "Want to read" — neutral/muted
        status_want: {
            borderColor: C.border,
        },
        statusText_want: {
            color: C.textMuted,
        },
        // "Reading" — accent
        status_reading: {
            borderColor: ACCENT,
        },
        statusText_reading: {
            color: ACCENT,
        },
        // "Read" — filled accent
        status_read: {
            borderColor: ACCENT,
            backgroundColor: ACCENT,
        },
        statusText_read: {
            color: '#fff',
        },
        badge: {
            alignItems: 'center',
            minWidth: 44,
        },
        badgeCount: {
            fontSize: 20,
            fontWeight: '700',
            color: ACCENT,
        },
        badgeLabel: {
            fontSize: 11,
            color: C.textMuted,
        },
        removeButton: {
            paddingHorizontal: 12,
            paddingVertical: 12,
        },
        removeText: {
            fontSize: 16,
            color: C.removeIcon,
        },
    });
}

const lightStyles = buildStyles(Colors.light);
const darkStyles = buildStyles(Colors.dark);
