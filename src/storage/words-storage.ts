import AsyncStorage from "@react-native-async-storage/async-storage";
import type { WordEntry } from "@/models/word-entry";

export type { WordEntry, EditDraft } from "@/models/word-entry";

function wordKey(bookKey: string): string {
    return `words_${bookKey}`;
}

export async function getWords(bookKey: string): Promise<WordEntry[]> {
    try {
        const raw = await AsyncStorage.getItem(wordKey(bookKey));
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export async function setWords(bookKey: string, words: WordEntry[]): Promise<void> {
    await AsyncStorage.setItem(wordKey(bookKey), JSON.stringify(words));
}

export async function removeWords(bookKey: string): Promise<void> {
    await AsyncStorage.removeItem(wordKey(bookKey));
}
