import ClearableTextInput from '@/components/ClearableTextInput';
import CoverImage from '@/components/CoverImage';
import ReadStatusSelector from '@/components/ReadStatusSelector';
import { useColorScheme } from '@/context/theme-context';
import type { ReadStatus } from '@/models/read-list-book';
import { upsertReadListBook } from '@/storage/read-list-storage';
import { ACCENT, Colors, ERROR } from '@/styles/global';
import { openBook } from '@/utils/open-book';
import { pickCoverImage } from '@/utils/pick-cover-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView, KeyboardToolbar } from 'react-native-keyboard-controller';

export default function CustomBookScreen() {
    const scheme = useColorScheme();
    const styles = scheme === 'dark' ? darkStyles : lightStyles;
    const placeholderColor = scheme === 'dark'
        ? Colors.dark.textPlaceholder
        : Colors.light.textPlaceholder;

    const [title, setTitle] = useState<string>('');
    const [author, setAuthor] = useState<string>('');
    const [year, setYear] = useState<string>('');
    const [coverUri, setCoverUri] = useState<string | null>(null);
    const [titleError, setTitleError] = useState<string>('');
    const [readStatus, setReadStatus] = useState<ReadStatus>('want');

    async function handlePickImage(): Promise<void> {
        const uri = await pickCoverImage(coverUri !== null);
        if (uri) {
            setCoverUri(uri);
        }
    }

    async function handleCreate(): Promise<void> {
        const trimmed = title.trim();
        if (!trimmed) {
            setTitleError('Please enter a book title.');
            return;
        }
        const key = `custom_${Date.now()}`;
        const trimmedAuthor = author.trim();
        const trimmedYear = year.trim();
        await upsertReadListBook({
            key,
            title: trimmed,
            author: trimmedAuthor,
            year: trimmedYear,
            cover_i: coverUri ?? '',
            status: readStatus,
        });
        router.navigate('/(tabs)/read-list');
        openBook({ key, title: trimmed, author: trimmedAuthor, year: trimmedYear, cover_i: coverUri ?? '' });
        setTitle('');
        setAuthor('');
        setYear('');
        setCoverUri(null);
        setTitleError('');
        setReadStatus('want');
    }

    return (
        <React.Fragment>
            <KeyboardAwareScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                bottomOffset={80}
            >
                <View style={styles.coverRow}>
                    <CoverImage uri={coverUri} style={styles.cover} />
                    <Pressable style={styles.pickButton} onPress={handlePickImage}>
                        <Text style={styles.pickButtonText}>
                            {coverUri ? 'Change image' : 'Pick cover image'}
                        </Text>
                    </Pressable>
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Title</Text>
                    <ClearableTextInput
                        style={[styles.input, titleError ? styles.inputError : null]}
                        placeholder="e.g. My reading notes"
                        placeholderTextColor={placeholderColor}
                        value={title}
                        onChangeText={(t) => { setTitle(t); setTitleError(''); }}
                        returnKeyType="next"
                    />
                    {titleError ? <Text style={styles.error}>{titleError}</Text> : null}
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Author <Text style={styles.optional}>(optional)</Text></Text>
                    <ClearableTextInput
                        style={styles.input}
                        placeholder="e.g. Jane Austen"
                        placeholderTextColor={placeholderColor}
                        value={author}
                        onChangeText={setAuthor}
                        returnKeyType="next"
                    />
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Year <Text style={styles.optional}>(optional)</Text></Text>
                    <ClearableTextInput
                        style={styles.input}
                        placeholder="e.g. 1813"
                        placeholderTextColor={placeholderColor}
                        value={year}
                        onChangeText={setYear}
                        keyboardType="number-pad"
                        maxLength={4}
                        returnKeyType="done"
                        onSubmitEditing={handleCreate}
                    />
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Reading status</Text>
                    <ReadStatusSelector value={readStatus} onChange={setReadStatus} />
                </View>

                <Pressable style={styles.createButton} onPress={handleCreate}>
                    <Text style={styles.createButtonText}>Create Book</Text>
                </Pressable>
            </KeyboardAwareScrollView>
            <KeyboardToolbar />
        </React.Fragment>
    );
}

function buildStyles(C: typeof Colors.light) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: C.background,
        },
        scrollContent: {
            padding: 20,
            gap: 24,
            paddingBottom: 400,
        },
        coverRow: {
            alignItems: 'center',
            gap: 14,
        },
        cover: {
            width: 120,
            height: 160,
            borderRadius: 8,
        },
        pickButton: {
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: ACCENT,
        },
        pickButtonText: {
            color: ACCENT,
            fontSize: 14,
            fontWeight: '500',
        },
        field: {
            gap: 6,
        },
        optional: {
            fontSize: 12,
            fontWeight: '400',
            color: C.textMuted,
            textTransform: 'none',
        },
        label: {
            fontSize: 13,
            fontWeight: '600',
            color: C.textMuted,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        input: {
            height: 48,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: C.borderInput,
            paddingHorizontal: 14,
            fontSize: 16,
            color: C.text,
            backgroundColor: C.backgroundInput,
        },
        inputError: {
            borderColor: ERROR,
        },
        error: {
            fontSize: 13,
            color: ERROR,
        },
        createButton: {
            backgroundColor: ACCENT,
            borderRadius: 10,
            paddingVertical: 14,
            alignItems: 'center',
        },
        createButtonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: '700',
        },
    });
}

const lightStyles = buildStyles(Colors.light);
const darkStyles = buildStyles(Colors.dark);
