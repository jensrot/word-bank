import { BookWord } from "@/models/book-word";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function BookDetail() {

    const { key, title, author, year, cover_i } = useLocalSearchParams<{
        key: string;
        title: string;
        author: string;
        year: string;
        cover_i: string;
    }>();

    const coverUri = cover_i
        ? `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`
        : null;
    console.log(coverUri);

    const [words, setWords] = useState<BookWord[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleAddWord() {
        console.log("test");
        const word = input.trim().toLowerCase();
        if (!word) return;
        if (words.some((w) => w.word === word)) {
            setError("Word already added.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const res = await fetch(
                `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
            );
            if (!res.ok) {
                setError("Word not found in dictionary.");
                return;
            }
            const data = await res.json();
            const entry = data[0];
            const meaning = entry.meanings[0];
            const newEntry: BookWord = {
                word: entry.word,
                definition: meaning.definitions[0].definition,
            };
            await persistWords([newEntry, ...words]);
            setInput("");
        } catch {
            setError("Failed to fetch definition.");
        } finally {
            setLoading(false);
        }
    }

    async function persistWords(updated: BookWord[]) {
        // Save to asyncstorage
    }


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <Stack.Screen options={{ title: title ?? "Book Detail", headerShown: true, headerBackVisible: true }} />

            <View style={styles.header}>
                {coverUri ? (
                    <Image source={{ uri: coverUri }} style={styles.cover} />
                ) : (
                    <View style={[styles.cover, styles.coverPlaceholder]} />
                )}
                <View style={styles.headerInfo}>
                    <Text style={styles.bookTitle} numberOfLines={3}>{title}</Text>
                    {author ? <Text style={styles.bookAuthor}>{author}</Text> : null}
                    {year ? <Text style={styles.bookYear}>{year}</Text> : null}
                </View>
            </View>

            <View style={styles.addRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Add a word..."
                    placeholderTextColor={styles.input.color}
                    value={input}
                    onChangeText={(t) => { setInput(t); setError(""); }}
                    onSubmitEditing={handleAddWord}
                    returnKeyType="done"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <Pressable
                    style={[styles.addButton, loading && styles.addButtonDisabled]}
                    onPress={handleAddWord}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <Text style={styles.addButtonText}>Add</Text>
                    )}
                </Pressable>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        gap: 14,
        padding: 16,
        display: "flex",
        alignItems: "center",
    },
    cover: {
        width: 120,
        height: 160,
        borderRadius: 8,
    },
    coverPlaceholder: {
        backgroundColor: "#ddd",
    },
    headerInfo: {
        flex: 1,
        justifyContent: "center",
        gap: 6,
    },
    bookTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#11181C",
    },
    bookAuthor: {
        fontSize: 16,
        color: "#555",
    },
    bookYear: {
        fontSize: 14,
        color: "#888",
    },
    addRow: {
        flexDirection: "row",
        gap: 8,
        padding: 12,
        paddingBottom: 4,
    },
    input: {
        flex: 1,
        height: 44,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        paddingHorizontal: 12,
        fontSize: 16,
        color: "#11181C",
        backgroundColor: "#f9f9f9",
    },
    addButton: {
        backgroundColor: "#0a7ea4",
        borderRadius: 8,
        paddingHorizontal: 16,
        justifyContent: "center",
        minWidth: 56,
        alignItems: "center",
    },
    addButtonDisabled: {
        opacity: 0.6,
    },
    addButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
    error: {
        color: "#e05252",
        fontSize: 13,
        paddingHorizontal: 12,
        paddingBottom: 4,
    },
});