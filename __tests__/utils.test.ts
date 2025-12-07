import { deduplicateEntries, createEntry } from '../src/utils/clipboard';
import { saveHistory, getHistory, clearHistory } from '../src/utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClipboardHistory } from '../src/utils/types';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('Clipboard Utils', () => {
    it('deduplicateEntries returns true if text is same as latest entry', () => {
        const history: ClipboardHistory = [
            { id: '1', text: 'hello', timestamp: 123 },
        ];
        expect(deduplicateEntries('hello', history)).toBe(true);
    });

    it('deduplicateEntries returns false if text is different', () => {
        const history: ClipboardHistory = [
            { id: '1', text: 'hello', timestamp: 123 },
        ];
        expect(deduplicateEntries('world', history)).toBe(false);
    });

    it('deduplicateEntries returns false if history is empty', () => {
        expect(deduplicateEntries('hello', [])).toBe(false);
    });

    it('createEntry creates a valid item', () => {
        const item = createEntry('test text', 'app');
        expect(item.text).toBe('test text');
        expect(item.source).toBe('app');
        expect(item.id).toBeDefined();
        expect(item.timestamp).toBeDefined();
    });
});

describe('Storage Utils', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('saveHistory calls AsyncStorage.setItem', async () => {
        const history: ClipboardHistory = [{ id: '1', text: 'test', timestamp: 123 }];
        await saveHistory(history);
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
            '@clipboard_history',
            JSON.stringify(history)
        );
    });

    it('getHistory calls AsyncStorage.getItem and returns parsed data', async () => {
        const history: ClipboardHistory = [{ id: '1', text: 'test', timestamp: 123 }];
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(history));

        const result = await getHistory();
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('@clipboard_history');
        expect(result).toEqual(history);
    });

    it('getHistory returns empty array if storage is null', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
        const result = await getHistory();
        expect(result).toEqual([]);
    });
});
