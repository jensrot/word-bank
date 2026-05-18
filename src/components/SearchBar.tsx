import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function SearchBar() {
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        // Implement your search logic here
        console.log("Searching for:", query);
    };

    return (
        <View>
            <TextInput
                placeholder="Search books..."
                style={styles.input}
                placeholderTextColor={"#666"}
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
            />
            <Pressable style={styles.button} onPress={handleSearch}>
                <Text style={styles.buttonText}>Search</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: "#007AFF",
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});