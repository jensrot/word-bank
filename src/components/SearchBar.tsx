import { useState } from "react";

import { useIsFocused } from "@react-navigation/native";

import { useColorScheme } from "@/context/theme-context";

import { useTypewriterPlaceholder } from "@/hooks/use-typewriter-placeholder";

import { Colors } from "@/styles/global";

import { Keyboard, StyleSheet, View } from "react-native";

import ClearableTextInput from "@/components/ClearableTextInput";
import SearchButton from "@/components/SearchButton";

// Extend with AI suggestions later
const RANDOM_TITLES = [
    "The Great Gatsby",
    "To Kill a Mockingbird",
    "1984",
    "Pride and Prejudice",
    "The Catcher in the Rye",
    "Brave New World",
    "The Hobbit",
    "Crime and Punishment",
    "Jane Eyre",
    "Don Quixote",
    "Anna Karenina",
    "Moby Dick",
    "War and Peace",
    "The Odyssey",
    "Hamlet",
];

type SearchBarProps = {
    onSearch: (query: string) => void;
    loading: boolean;
};

export default function SearchBar({ onSearch, loading }: SearchBarProps) {
    const scheme = useColorScheme();
    const styles = scheme === 'dark' ? darkStyles : lightStyles;
    const placeholderColor = scheme === 'dark'
        ? Colors.dark.textPlaceholder
        : Colors.light.textPlaceholder;

    const [query, setQuery] = useState<string>("");

    // Types out one example title while the field is empty and the tab is focused.
    // `word` is the full suggestion, accepted on Enter when the field is empty.
    const isFocused = useIsFocused();
    const { text: typedPlaceholder, word } = useTypewriterPlaceholder(RANDOM_TITLES, isFocused && !query);

    function handleSearch(): void {
        Keyboard.dismiss();
        // if placeholder is shown use that as the search query instead of showing empty results for empty query
        const searchedWord = query.trim() || word;
        if (!searchedWord) {
            return;
        }
        setQuery(searchedWord);
        onSearch(searchedWord);
    }

    return (
        <View style={styles.container}>
            <ClearableTextInput
                placeholder={typedPlaceholder || "Search a book, author..."}
                containerStyle={styles.inputContainer}
                style={styles.input}
                placeholderTextColor={placeholderColor}
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
                autoCorrect={false}
                autoCapitalize="none"
            />
            <SearchButton onPress={handleSearch} loading={loading} style={styles.button} />
        </View>
    );
}

function buildStyles(C: typeof Colors.light) {
    return StyleSheet.create({
        container: {
            paddingVertical: 12,
        },
        inputContainer: {
            marginBottom: 8,
        },
        input: {
            height: 44,
            borderColor: C.borderInput,
            color: C.text,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 0,
            fontSize: 16,
            backgroundColor: C.backgroundInput,
            textAlignVertical: 'center',
            includeFontPadding: false,
        },
        button: {
            marginBottom: 16,
        },
    });
}

const lightStyles = buildStyles(Colors.light);
const darkStyles = buildStyles(Colors.dark);
