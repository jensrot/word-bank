import { Book } from "@/models/book";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BOOKS_STORAGE_KEY = "saved_books";

export async function saveBook(book: Book): Promise<void> {
    try {
        const data = JSON.stringify(book);
        await AsyncStorage.setItem(BOOKS_STORAGE_KEY, data);
    } catch (e) {
        console.error("Error saving book:", e);
    }
}

export async function loadBook(): Promise<Book | null> {
    try {
        const jsonValue = await AsyncStorage.getItem(BOOKS_STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error("Error loading book:", e);
        return null;
    }
}