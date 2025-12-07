import React, { useState } from 'react';
import { View, Text, FlatList, Switch, TouchableOpacity, Alert, SafeAreaView, StatusBar } from 'react-native';
import { useClipboardHistory } from '../hooks/useClipboardHistory';
import { HistoryItem } from '../components/HistoryItem';
import { FAB } from '../components/FAB';
import { DetailModal } from './DetailModal';
import { ClipboardItem } from '../utils/types';
import { Info, Settings } from 'lucide-react-native';
import { exportData, importData } from '../utils/storage';
import * as Clipboard from 'expo-clipboard';

export const HomeScreen = () => {
    const {
        history,
        isAutoCaptureEnabled,
        setIsAutoCaptureEnabled,
        manualCapture,
        deleteEntry,
        refreshHistory
    } = useClipboardHistory();

    const [selectedItem, setSelectedItem] = useState<ClipboardItem | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const handleToggleAutoCapture = (value: boolean) => {
        if (value) {
            Alert.alert(
                "Enable Auto-Capture",
                "Auto-capture only works while the app is open in the foreground due to iOS privacy restrictions. You can disable this anytime.",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Enable", onPress: () => setIsAutoCaptureEnabled(true) }
                ]
            );
        } else {
            setIsAutoCaptureEnabled(false);
        }
    };

    const handleItemPress = async (item: ClipboardItem) => {
        await Clipboard.setStringAsync(item.text);
        // Optional: Show toast
        Alert.alert("Copied", "Text copied to clipboard");
    };

    const handleLongPress = (item: ClipboardItem) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const handleExport = async () => {
        const data = await exportData();
        await Clipboard.setStringAsync(data);
        Alert.alert("Exported", "Backup JSON copied to clipboard!");
    };

    const handleImport = async () => {
        const content = await Clipboard.getStringAsync();
        const success = await importData(content);
        if (success) {
            await refreshHistory();
            Alert.alert("Success", "History imported successfully");
        } else {
            Alert.alert("Error", "Invalid backup data in clipboard");
        }
    };

    const showSettings = () => {
        Alert.alert(
            "Settings",
            "Manage your data",
            [
                { text: "Export Backup", onPress: handleExport },
                { text: "Import Backup", onPress: handleImport },
                { text: "Cancel", style: "cancel" }
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-950">
            <StatusBar barStyle="dark-content" />
            <View className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex-row justify-between items-center shadow-sm">
                <View>
                    <Text className="text-xl font-bold text-blue-600 dark:text-blue-400">ClipboardKeeper</Text>
                    <Text className="text-xs text-gray-500">History Manager</Text>
                </View>
                <View className="flex-row items-center gap-3">
                    <View className="flex-row items-center bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                        <Text className="text-xs mr-2 text-gray-600 dark:text-gray-300">Auto</Text>
                        <Switch
                            value={isAutoCaptureEnabled}
                            onValueChange={handleToggleAutoCapture}
                            trackColor={{ false: "#767577", true: "#3b82f6" }}
                            thumbColor={isAutoCaptureEnabled ? "#ffffff" : "#f4f3f4"}
                            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                        />
                    </View>
                    <TouchableOpacity onPress={showSettings}>
                        <Settings size={24} className="text-gray-600 dark:text-gray-300" />
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={history}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <HistoryItem
                        item={item}
                        onPress={handleItemPress}
                        onDelete={deleteEntry}
                        onLongPress={handleLongPress}
                    />
                )}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListEmptyComponent={
                    <View className="flex-1 justify-center items-center mt-20">
                        <Info size={48} className="text-gray-300 mb-4" />
                        <Text className="text-gray-400 text-center">No history yet.{'\n'}Enable auto-capture or add manually.</Text>
                    </View>
                }
            />

            <FAB onPress={manualCapture} />

            <DetailModal
                visible={modalVisible}
                item={selectedItem}
                onClose={() => setModalVisible(false)}
                onDelete={deleteEntry}
            />
        </SafeAreaView>
    );
};
