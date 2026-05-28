import { useColorScheme } from "@/context/theme-context";

import type { SavedBook } from '@/models/saved-book';

import { ACCENT, Colors } from '@/styles/global';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type SavedBookItemProps = {
    item: SavedBook;
    onPress: () => void;
    onRemove: () => void;
};

export default function SavedBookItem({ item, onPress, onRemove }: SavedBookItemProps) {
    const styles = useColorScheme() === 'dark' ? darkStyles : lightStyles;

    const coverUri = item.cover_index
        ? `https://covers.openlibrary.org/b/id/${item.cover_index}-S.jpg`
        : null;

    return (
        <View style={styles.row}>
            <Pressable style={styles.rowContent} onPress={onPress}>
                {coverUri ? (
                    <Image source={{ uri: coverUri }} style={styles.cover} />
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
                </View>
                <View style={styles.badge}>
                    <Text style={styles.badgeCount}>{item.wordCount}</Text>
                    <Text style={styles.badgeLabel}>
                        {item.wordCount === 1 ? 'word' : 'words'}
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
