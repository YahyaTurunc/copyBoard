export interface ClipboardItem {
    id: string;
    text: string;
    timestamp: number; // Unix timestamp
    source?: string;
}

export type ClipboardHistory = ClipboardItem[];
