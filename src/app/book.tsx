import { useLocalSearchParams } from "expo-router";
import { Image, KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";

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


    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
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
});