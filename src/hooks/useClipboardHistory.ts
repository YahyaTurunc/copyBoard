import { useState, useEffect, useCallback, useRef } from 'react';
import * as Clipboard from 'expo-clipboard';
import { AppState, AppStateStatus } from 'react-native';
import { ClipboardItem, ClipboardHistory } from '../utils/types';
import { getHistory, saveHistory, clearHistory as clearStorage } from '../utils/storage';
import { deduplicateEntries, createEntry } from '../utils/clipboard';

export const useClipboardHistory = () => {
    const [history, setHistory] = useState<ClipboardHistory>([]);
    const [isAutoCaptureEnabled, setIsAutoCaptureEnabled] = useState(false);
    const appState = useRef(AppState.currentState);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const isInternalCopy = useRef(false);

    // Load history on mount
    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        const data = await getHistory();
        setHistory(data);
    };

    const addEntry = useCallback(async (text: string, source?: string) => {
        setHistory((prev) => {
            if (deduplicateEntries(text, prev)) return prev;

            const newItem = createEntry(text, source);
            const newHistory = [newItem, ...prev].slice(0, 200); // Limit to 200
            saveHistory(newHistory);
            return newHistory;
        });
    }, []);

    const deleteEntry = useCallback(async (id: string) => {
        setHistory((prev) => {
            const newHistory = prev.filter((item) => item.id !== id);
            saveHistory(newHistory);
            return newHistory;
        });
    }, []);

    const clearAll = useCallback(async () => {
        await clearStorage();
        setHistory([]);
    }, []);

    const manualCapture = useCallback(async () => {
        const text = await Clipboard.getStringAsync();
        if (text) {
            await addEntry(text, 'Manual');
            return true;
        }
        return false;
    }, [addEntry]);

    const copyToClipboard = useCallback(async (text: string) => {
        isInternalCopy.current = true;
        await Clipboard.setStringAsync(text);
        // Reset flag after a short delay to be safe, though usually the next app state change handles it
        // But here we are just setting string, so the loop happens when we return to app or if we are already in app.
        // If we are in app, the interval might pick it up.
        setTimeout(() => {
            isInternalCopy.current = false;
        }, 1000);
    }, []);

    // Auto-capture logic
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        if (isAutoCaptureEnabled) {
            intervalRef.current = setInterval(async () => {
                // Only capture if app is active (foreground)
                if (appState.current === 'active') {
                    const hasString = await Clipboard.hasStringAsync();
                    if (hasString) {
                        const text = await Clipboard.getStringAsync();
                        if (text) {
                            if (isInternalCopy.current) {
                                isInternalCopy.current = false;
                                return;
                            }
                            // We don't know the source app easily in Expo without native modules, 
                            // so we leave it undefined or mark as 'Auto'
                            // Check dedupe inside addEntry
                            addEntry(text);
                        }
                    }
                }
            }, 3000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isAutoCaptureEnabled, addEntry]);

    return {
        history,
        isAutoCaptureEnabled,
        setIsAutoCaptureEnabled,
        manualCapture,
        deleteEntry,
        clearAll,
        refreshHistory: loadHistory,
        copyToClipboard,
    };
};
