import type { ReadStatus } from "@/models/read-list-book";

// A reading status chosen on the book screen that the Read List should switch its
// filter to next time it's focused — covers back-button returns, not just the
// "Update read list" button. Module-level so it survives navigation between screens.
let pending: ReadStatus | null = null;

export function setPendingReadFilter(status: ReadStatus): void {
    pending = status;
}

// Returns the pending status once, then clears it.
export function consumePendingReadFilter(): ReadStatus | null {
    const value = pending;
    pending = null;
    return value;
}
