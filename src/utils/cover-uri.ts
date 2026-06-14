// Builds a usable image URL for a book cover.
// - A local image (e.g. a picked file, "file://...") is returned as-is.
// - An OpenLibrary cover id is turned into its hosted URL at the requested size.
// Returns null when there's no cover, so callers can show a placeholder.
export function coverUri(coverI: string | number | null | undefined, size: 'S' | 'M' = 'S'): string | null {
    if (!coverI) {
        return null;
    }
    const value = String(coverI);
    return value.includes('://')
        ? value
        : `https://covers.openlibrary.org/b/id/${value}-${size}.jpg`;
}
