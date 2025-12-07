import { ClipboardItem, ClipboardHistory } from './types';

export const deduplicateEntries = (
    newText: string,
    currentHistory: ClipboardHistory
): boolean => {
    if (currentHistory.length === 0) return false;
    // Check if the most recent entry is identical
    return currentHistory[0].text === newText;
};

export const createEntry = (text: string, source?: string): ClipboardItem => {
    return {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        text,
        timestamp: Date.now(),
        source,
    };
};
