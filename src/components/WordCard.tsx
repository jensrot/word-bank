import { useColorScheme } from "@/context/theme-context";
import type { EditDraft, WordEntry } from '@/models/word-entry';
import { ACCENT, Colors } from '@/styles/global';
import { useRef } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const SENTENCE_MAX = 300;

type WordCardProps = {
    item: WordEntry;
    isEditing: boolean;
    draft: EditDraft;
    onEdit: () => void;
    onCancelEdit: () => void;
    onSave: () => void;
    onRemove: () => void;
    onDraftChange: (draft: EditDraft) => void;
};

export default function WordCard({
    item,
    isEditing,
    draft,
    onEdit,
    onCancelEdit,
    onSave,
    onRemove,
    onDraftChange,
}: WordCardProps) {
    const scheme = useColorScheme();
    const styles = scheme === 'dark' ? darkStyles : lightStyles;
    const placeholderColor = scheme === 'dark'
        ? Colors.dark.textPlaceholder
        : Colors.light.textPlaceholder;

    const notesRef = useRef<TextInput>(null);

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.word}>{item.word}</Text>
                {item.phonetic ? (
                    <Text style={styles.phonetic}>{item.phonetic}</Text>
                ) : null}
                <View style={styles.actions}>
                    <Pressable onPress={isEditing ? onCancelEdit : onEdit} hitSlop={8}>
                        <Text style={styles.editText}>{isEditing ? 'Cancel' : 'Edit'}</Text>
                    </Pressable>
                    <Pressable onPress={onRemove} hitSlop={8}>
                        <Text style={styles.removeText}>✕</Text>
                    </Pressable>
                </View>
            </View>

            <Text style={styles.partOfSpeech}>{item.partOfSpeech}</Text>
            <Text style={styles.definition}>{item.definition}</Text>

            {!isEditing && item.sentence ? (
                <View style={styles.metaBlock}>
                    <Text style={styles.metaLabel}>Sentence</Text>
                    <Text style={styles.metaValue}>{item.sentence}</Text>
                </View>
            ) : null}

            {!isEditing && item.notes ? (
                <View style={styles.metaBlock}>
                    <Text style={styles.metaLabel}>Notes</Text>
                    <Text style={styles.metaValue}>{item.notes}</Text>
                </View>
            ) : null}

            {isEditing ? (
                <View style={styles.editForm}>
                    <View style={styles.labelRow}>
                        <Text style={styles.metaLabel}>Sentence</Text>
                        <Text style={styles.charCount}>
                            {draft.sentence.length} / {SENTENCE_MAX}
                        </Text>
                    </View>
                    <TextInput
                        style={styles.editInput}
                        placeholder={`e.g. 'I encountered "${item.word}" while reading...'`}
                        placeholderTextColor={placeholderColor}
                        value={draft.sentence}
                        onChangeText={(t) => onDraftChange({ ...draft, sentence: t })}
                        multiline
                        autoCorrect
                        autoFocus
                        maxLength={SENTENCE_MAX}
                        returnKeyType="next"
                        submitBehavior="submit"
                        onSubmitEditing={() => notesRef.current?.focus()}
                    />
                    <Text style={styles.metaLabel}>Notes</Text>
                    <TextInput
                        ref={notesRef}
                        style={styles.editInput}
                        placeholder="e.g. Similar to 'optimistic', used in formal writing"
                        placeholderTextColor={placeholderColor}
                        value={draft.notes}
                        onChangeText={(t) => onDraftChange({ ...draft, notes: t })}
                        multiline
                        autoCorrect
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                    />
                    <Pressable
                        style={styles.saveButton}
                        onPress={() => { Keyboard.dismiss(); onSave(); }}
                    >
                        <Text style={styles.saveButtonText}>Save</Text>
                    </Pressable>
                </View>
            ) : null}
        </View>
    );
}

function buildStyles(C: typeof Colors.light) {
    return StyleSheet.create({
        card: {
            backgroundColor: C.backgroundCard,
            borderRadius: 10,
            padding: 14,
            gap: 4,
        },
        cardHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        word: {
            fontSize: 17,
            fontWeight: '700',
            color: C.text,
        },
        phonetic: {
            fontSize: 13,
            color: C.textMuted,
            flex: 1,
        },
        actions: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            marginLeft: 'auto',
        },
        editText: {
            fontSize: 13,
            color: ACCENT,
            fontWeight: '500',
        },
        removeText: {
            fontSize: 14,
            color: C.removeIcon,
        },
        partOfSpeech: {
            fontSize: 12,
            fontStyle: 'italic',
            color: ACCENT,
            textTransform: 'capitalize',
        },
        definition: {
            fontSize: 14,
            color: C.textBody,
            lineHeight: 20,
        },
        metaBlock: {
            marginTop: 6,
            gap: 2,
        },
        metaLabel: {
            fontSize: 11,
            fontWeight: '600',
            color: C.textMuted,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        metaValue: {
            fontSize: 14,
            color: C.textMeta,
            lineHeight: 20,
        },
        editForm: {
            marginTop: 10,
            gap: 6,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: C.borderEdit,
            paddingTop: 10,
        },
        labelRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        charCount: {
            fontSize: 11,
            color: C.textFaded,
        },
        editInput: {
            borderWidth: 1,
            borderColor: C.borderInput,
            borderRadius: 8,
            padding: 10,
            fontSize: 14,
            color: C.text,
            backgroundColor: C.backgroundInput,
            minHeight: 64,
            textAlignVertical: 'top',
        },
        saveButton: {
            backgroundColor: ACCENT,
            borderRadius: 8,
            paddingVertical: 10,
            alignItems: 'center',
            marginTop: 4,
        },
        saveButtonText: {
            color: '#fff',
            fontWeight: '600',
            fontSize: 15,
        },
    });
}

const lightStyles = buildStyles(Colors.light);
const darkStyles = buildStyles(Colors.dark);
