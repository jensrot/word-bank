import AsyncStorage from "@react-native-async-storage/async-storage";

import type { ReadListBook, ReadStatus } from "@/models/read-list-book";

export type { ReadListBook, ReadStatus } from "@/models/read-list-book";

const READ_LIST_KEY = "read_list";

export async function getReadList(): Promise<ReadListBook[]> {
    try {
        const raw = await AsyncStorage.getItem(READ_LIST_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export async function setReadList(books: ReadListBook[]): Promise<void> {
    await AsyncStorage.setItem(READ_LIST_KEY, JSON.stringify(books));
}

// Adds a book, or updates it if it's already saved.
// Omit<ReadListBook, 'addedAt'> = a ReadListBook without the addedAt field, so callers
// can't pass it — this function sets addedAt itself. See https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys
export async function upsertReadListBook(book: Omit<ReadListBook, 'addedAt'>): Promise<ReadListBook[]> {
    const books = await getReadList();
    const idx = books.findIndex((b) => b.key === book.key);

    if (idx >= 0) {
        // Already saved: update it but keep the original "added" date.
        books[idx] = { ...books[idx], ...book };
    } else {
        // New book: add it to the top and stamp the "added" date now.
        books.unshift({ ...book, addedAt: Date.now() });
    }

    await setReadList(books);
    return books;
}

export async function removeReadListBook(bookKey: string): Promise<ReadListBook[]> {
    const books = await getReadList();
    const updated = books.filter((b) => b.key !== bookKey);
    await setReadList(updated);
    return updated;
}

export async function setReadBookStatus(bookKey: string, status: ReadStatus): Promise<ReadListBook[]> {
    const books = await getReadList();
    const updatedReadBookStatus = books.map((book) => (book.key === bookKey ? { ...book, status } : book));
    await setReadList(updatedReadBookStatus);
    return updatedReadBookStatus;
}
