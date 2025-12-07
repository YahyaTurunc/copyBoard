import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClipboardHistory } from './types';

const STORAGE_KEY = '@clipboard_history';

export const saveHistory = async (history: ClipboardHistory): Promise<void> => {
    try {
        const jsonValue = JSON.stringify(history);
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
        console.error('Failed to save history', e);
    }
};

export const getHistory = async (): Promise<ClipboardHistory> => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Failed to fetch history', e);
        return [];
    }
};

export const clearHistory = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.error('Failed to clear history', e);
    }
};

export const exportData = async (): Promise<string> => {
    const history = await getHistory();
    return JSON.stringify(history, null, 2);
};

export const importData = async (jsonString: string): Promise<boolean> => {
    try {
        const history = JSON.parse(jsonString);
        if (Array.isArray(history)) {
            // Basic validation could be added here
            await saveHistory(history);
            return true;
        }
        return false;
    } catch (e) {
        console.error('Failed to import data', e);
        return false;
    }
};
