import { router } from "expo-router";

// The info the book detail screen needs to open. All strings, since they go
// through navigation params.
export type BookNavParams = {
    key: string;
    title: string;
    author: string;
    year: string;
    cover_i: string;
};

// Navigates to a book's detail screen. Keeps the navigation (and the typed-route
// cast) in one place so every "open a book" tap behaves the same.
export function openBook(book: BookNavParams): void {
    router.push({
        pathname: '/book' as any,
        params: book,
    });
}
