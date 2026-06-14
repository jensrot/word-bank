import React from "react";

import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColorScheme } from "@/context/theme-context";

import type { WordEntry } from "@/models/word-entry";

import { ACCENT, Colors } from "@/styles/global";

// A word plus the book it was added to, so the list can label and navigate to its source.
export type WordWithBook = WordEntry & {
    bookKey: string;
    bookTitle: string;
    bookAuthor: string;
    bookYear: string;
    bookCover: string;
};

type WordListItemProps = {
    item: WordWithBook;
    onPress: () => void;
};

// Mirrors the word card from book.tsx (dictionary fields only) and adds the source book label.
function WordListItem({ item, onPress }: WordListItemProps) {
    const styles = useColorScheme() === 'dark' ? darkStyles : lightStyles;

    return (
        <Pressable style={styles.card} onPress={onPress}>
            <View style={styles.cardHeader}>
                <Text style={styles.word}>{item.word}</Text>
                {item.phonetic ? (
                    <Text style={styles.phonetic}>{item.phonetic}</Text>
                ) : null}
            </View>

            <Text style={styles.partOfSpeech}>{item.partOfSpeech}</Text>
            <Text style={styles.definition}>{item.definition}</Text>

            <Text style={styles.bookLabel} numberOfLines={1}>
                From “{item.bookTitle}”
            </Text>
        </Pressable>
    );
}

// Memoized so rows don't re-render on every keystroke in the words-list search box —
// each card only re-renders when its own props change.
export default React.memo(WordListItem);

function buildStyles(C: typeof Colors.light) {
    return StyleSheet.create({
        card: {
            backgroundColor: C.backgroundCard,
            borderRadius: 10,
            padding: 14,
            gap: 4,
        },
        cardHeader: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
        },
        word: {
            fontSize: 17,
            fontWeight: "700",
            color: C.text,
        },
        phonetic: {
            fontSize: 13,
            color: C.textMuted,
            flex: 1,
        },
        partOfSpeech: {
            fontSize: 12,
            fontStyle: "italic",
            color: ACCENT,
            textTransform: "capitalize",
        },
        definition: {
            fontSize: 14,
            color: C.textBody,
            lineHeight: 20,
        },
        bookLabel: {
            marginTop: 6,
            fontSize: 12,
            color: C.textMuted,
        },
    });
}

const lightStyles = buildStyles(Colors.light);
const darkStyles = buildStyles(Colors.dark);
