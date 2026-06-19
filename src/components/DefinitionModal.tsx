import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { KeyboardAvoidingView, KeyboardProvider } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColorScheme } from "@/context/theme-context";
import { useThemedStyles } from "@/hooks/use-themed-styles";

import type { WordDefinition } from "@/models/word-entry";

import { ACCENT, Colors } from "@/styles/global";

type DefinitionModalProps = {
    visible: boolean;
    onClose: () => void;
    word: string;
    definitions: WordDefinition[];
    selectedIndex: number;
    onSelect: (index: number) => void;
};

// A row in the list is either a part-of-speech header or a definition (with its
// original index, so selecting still maps back to the unfiltered `definitions`).
type Row =
    | { type: 'header'; pos: string }
    | { type: 'item'; def: WordDefinition; index: number };

// Distinct colors per part of speech so headers are easy to tell apart at a glance.
// Mid-tone hues chosen to read on both light and dark sheets; unknown POS uses ACCENT.
const POS_COLORS: Record<string, string> = {
    noun: '#3b82f6',       // blue
    verb: '#10b981',       // green
    adjective: '#f59e0b',  // amber
    adj: '#f59e0b',
    adverb: '#8b5cf6',     // purple
    adv: '#8b5cf6',
};

export default function DefinitionModal({ visible, onClose, word, definitions, selectedIndex, onSelect }: DefinitionModalProps) {
    const scheme = useColorScheme();
    const insets = useSafeAreaInsets();

    const styles = useThemedStyles(lightStyles, darkStyles);
    const placeholderColor = Colors[scheme].textPlaceholder;

    const [search, setSearch] = useState<string>('');

    // Clear the search whenever the modal closes so it reopens fresh.
    useEffect(() => {
        if (!visible) {
            setSearch('');
        }
    }, [visible]);

    // Filter by definition text and part of speech, then group under POS headers.
    // useMemo so it only recomputes when the search or the definitions change.
    const rows = useMemo<Row[]>(() => {
        const query = search.trim().toLowerCase();
        const result: Row[] = [];
        let lastPos: string | null = null;
        definitions.forEach((def, index) => {
            const matches = !query
                || def.definition.toLowerCase().includes(query)
                || def.partOfSpeech.toLowerCase().includes(query);
            if (!matches) {
                return;
            }
            if (def.partOfSpeech !== lastPos) {
                lastPos = def.partOfSpeech;
                result.push({ type: 'header', pos: def.partOfSpeech });
            }
            result.push({ type: 'item', def, index });
        });
        return result;
    }, [search, definitions]);

    function handleSelect(index: number): void {
        onSelect(index);
        onClose();
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <KeyboardProvider>
                <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                    <Pressable style={styles.modalOverlay} onPress={onClose}>
                        <Pressable style={[styles.modalSheet, { paddingBottom: insets.bottom + 16 }]}>
                            <FlatList
                                data={rows}
                                keyExtractor={(row, index) => (row.type === 'header' ? `h_${index}` : `d_${row.index}`)}
                                keyboardShouldPersistTaps="handled"
                                renderItem={({ item: row }) => {
                                    if (row.type === 'header') {
                                        return (
                                            <Text style={[styles.posHeader, { color: POS_COLORS[row.pos.toLowerCase()] ?? ACCENT }]}>
                                                {row.pos}
                                            </Text>
                                        );
                                    }
                                    const active = row.index === selectedIndex;
                                    return (
                                        <Pressable
                                            style={[styles.option, active && styles.optionActive]}
                                            onPress={() => handleSelect(row.index)}
                                        >
                                            <View style={styles.optionBody}>
                                                <Text style={[styles.optionText, active && styles.optionTextActive]}>
                                                    {row.def.definition}
                                                </Text>
                                                {row.def.exampleSentence ? (
                                                    <Text style={styles.optionExample}>“{row.def.exampleSentence}”</Text>
                                                ) : null}
                                            </View>
                                            {active && <Text style={styles.check}>✓</Text>}
                                        </Pressable>
                                    );
                                }}
                                ListEmptyComponent={
                                    <Text style={styles.empty}>No definitions match &quot;{search}&quot;</Text>
                                }
                            />
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle} numberOfLines={1}>Definitions for: {word}</Text>
                                <Pressable onPress={onClose} hitSlop={12}>
                                    <Text style={styles.modalClose}>✕</Text>
                                </Pressable>
                            </View>

                            <TextInput
                                style={styles.modalSearch}
                                placeholder="Search definitions..."
                                placeholderTextColor={placeholderColor}
                                value={search}
                                onChangeText={setSearch}
                                autoCorrect={false}
                            />
                        </Pressable>
                    </Pressable>
                </KeyboardAvoidingView>
            </KeyboardProvider>
        </Modal>
    );
}

function buildStyles(C: typeof Colors.light) {
    return StyleSheet.create({
        modalOverlay: {
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.4)',
        },
        modalSheet: {
            backgroundColor: C.background,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: '70%',
        },
        modalHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 8,
            gap: 12,
        },
        modalTitle: {
            flex: 1,
            fontSize: 16,
            fontWeight: '700',
            color: C.text,
        },
        modalClose: {
            fontSize: 16,
            color: C.textMuted,
        },
        modalSearch: {
            marginHorizontal: 16,
            height: 40,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: C.borderInput,
            backgroundColor: C.backgroundInput,
            paddingHorizontal: 12,
            paddingVertical: 0,
            fontSize: 15,
            color: C.text,
            textAlignVertical: 'center',
            includeFontPadding: false,
        },
        posHeader: {
            paddingHorizontal: 16,
            paddingTop: 14,
            paddingBottom: 4,
            fontSize: 12,
            fontWeight: '700',
            color: ACCENT,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        option: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: C.border,
            gap: 8,
        },
        optionActive: {
            backgroundColor: C.backgroundCard,
        },
        optionBody: {
            flex: 1,
            gap: 3,
        },
        optionText: {
            fontSize: 15,
            color: C.text,
            lineHeight: 21,
        },
        optionTextActive: {
            color: ACCENT,
            fontWeight: '600',
        },
        optionExample: {
            fontSize: 13,
            fontStyle: 'italic',
            color: C.textMuted,
            lineHeight: 18,
        },
        check: {
            fontSize: 14,
            color: ACCENT,
            fontWeight: '700',
            marginTop: 2,
        },
        empty: {
            textAlign: 'center',
            padding: 24,
            fontSize: 14,
            color: C.textMuted,
        },
    });
}

const lightStyles = buildStyles(Colors.light);
const darkStyles = buildStyles(Colors.dark);
