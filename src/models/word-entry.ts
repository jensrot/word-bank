export type WordEntry = {
    word: string;
    phonetic?: string;
    partOfSpeech: string;
    definition: string;
    sentence?: string;
    notes?: string;
};

export type EditDraft = {
    sentence: string;
    notes: string;
};
