import AsyncStorage from "@react-native-async-storage/async-storage";

import type { SavedBook } from "@/models/saved-book";

export type { SavedBook } from "@/models/saved-book";

const SAVED_BOOKS_KEY = "saved_books";

export async function getSavedBooks(): Promise<SavedBook[]> {
    try {
        const raw = await AsyncStorage.getItem(SAVED_BOOKS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export async function setSavedBooks(books: SavedBook[]): Promise<void> {
    await AsyncStorage.setItem(SAVED_BOOKS_KEY, JSON.stringify(books));
}

export async function upsertBook(book: SavedBook): Promise<void> {
    const books = await getSavedBooks();
    const idx = books.findIndex((b) => b.key === book.key);

    // If the book already exists, update it
    if (idx >= 0) {
        books[idx] = book;
        return;
    }
    // If the book doesn't exist, add it to the beginning of the list
    else {
        books.unshift(book);
    }

    // Save the updated list always
    await setSavedBooks(books);
}

export async function removeBook(bookKey: string): Promise<SavedBook[]> {
    const books = await getSavedBooks();
    const updated = books.filter((b) => b.key !== bookKey);
    await setSavedBooks(updated);
    return updated;
}
