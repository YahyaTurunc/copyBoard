import React, { useState } from 'react';
import { View, Text, FlatList, Switch, TouchableOpacity, Alert, StatusBar, SafeAreaView, TextInput } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context'; // Expo'nun safe-area'sı daha iyidir
import { useClipboardHistory } from '../hooks/useClipboardHistory';
import { HistoryItem } from '../components/HistoryItem';
import { FAB } from '../components/FAB';
import { DetailModal } from './DetailModal';
import { ClipboardItem } from '../utils/types';
import { Settings, ClipboardList, Trash2, Search, X } from 'lucide-react-native';
import { exportData, importData } from '../utils/storage';
import * as Clipboard from 'expo-clipboard';

export const HomeScreen = () => {
    const {
        history,
        isAutoCaptureEnabled,
        setIsAutoCaptureEnabled,
        manualCapture,
        deleteEntry,
        refreshHistory,
        clearAll,
        copyToClipboard
    } = useClipboardHistory();

    const [selectedItem, setSelectedItem] = useState<ClipboardItem | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredHistory = history.filter(item =>
        item.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleToggleAutoCapture = (value: boolean) => {
        if (value) {
            Alert.alert(
                "Otomatik Kayıt",
                "iOS kısıtlamaları gereği, otomatik kayıt sadece uygulama açıkken çalışır.",
                [
                    { text: "Vazgeç", style: "cancel" },
                    { text: "Aç", onPress: () => setIsAutoCaptureEnabled(true) }
                ]
            );
        } else {
            setIsAutoCaptureEnabled(false);
        }
    };

    const handleItemPress = async (item: ClipboardItem) => {
        await copyToClipboard(item.text);
        // Haptic feedback eklenebilir buraya
    };

    const handleLongPress = (item: ClipboardItem) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const handleExportImport = () => {
        Alert.alert("Yedekleme", "Verilerinizi yönetin", [
            {
                text: "Dışa Aktar (Kopyala)", onPress: async () => {
                    const data = await exportData();
                    await copyToClipboard(data);
                    Alert.alert("Başarılı", "Yedek panoya kopyalandı.");
                }
            },
            {
                text: "İçe Aktar (Yapıştır)", onPress: async () => {
                    const content = await Clipboard.getStringAsync();
                    const success = await importData(content);
                    if (success) {
                        await refreshHistory();
                        Alert.alert("Başarılı", "Yedek geri yüklendi.");
                    } else {
                        Alert.alert("Hata", "Panoda geçerli veri bulunamadı.");
                    }
                }
            },
            { text: "İptal", style: "cancel" }
        ]);
    };

    const handleClearAll = () => {
        Alert.alert(
            "Tümünü Temizle",
            "Tüm geçmiş silinecek. Bu işlem geri alınamaz. Emin misiniz?",
            [
                { text: "Vazgeç", style: "cancel" },
                {
                    text: "Sil",
                    style: "destructive",
                    onPress: async () => {
                        await clearAll();
                    }
                }
            ]
        );
    };

    return (
        <View className="flex-1 bg-gray-50 dark:bg-slate-950">
            <StatusBar barStyle="dark-content" />
            <SafeAreaView className="flex-1" >

                {/* Header Alanı */}
                <View className="px-6 pt-2 pb-4 bg-gray-50 dark:bg-slate-950 z-10">
                    <View className="flex-row justify-between items-center mb-4">
                        <View>
                            <Text className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                                Geçmiş
                            </Text>
                            <Text className="text-sm text-gray-500 font-medium">
                                {history.length} kayıt saklanıyor
                            </Text>
                        </View>
                        <View className="flex-row gap-2">
                            <TouchableOpacity
                                onPress={handleClearAll}
                                className="bg-white dark:bg-slate-800 p-2.5 rounded-full shadow-sm border border-gray-100 dark:border-slate-700"
                            >
                                <Trash2 size={22} className="text-red-500" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleExportImport}
                                className="bg-white dark:bg-slate-800 p-2.5 rounded-full shadow-sm border border-gray-100 dark:border-slate-700"
                            >
                                <Settings size={22} className="text-gray-600 dark:text-gray-300" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Auto Capture Switch Kartı */}
                    <View className="bg-blue-600 rounded-2xl p-4 flex-row items-center justify-between shadow-lg shadow-blue-200">
                        <View className="flex-row items-center flex-1 mr-4">
                            <View className="bg-white/20 p-2 rounded-xl mr-3">
                                <ClipboardList size={20} color="white" />
                            </View>
                            <View>
                                <Text className="text-white font-bold text-base">Otomatik Kayıt</Text>
                                <Text className="text-blue-100 text-xs mt-0.5">Uygulama açıkken kaydet</Text>
                            </View>
                        </View>
                        <Switch
                            value={isAutoCaptureEnabled}
                            onValueChange={handleToggleAutoCapture}
                            trackColor={{ false: "#4b5563", true: "#93c5fd" }}
                            thumbColor={isAutoCaptureEnabled ? "#ffffff" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                        />
                    </View>
                </View>

                {/* Arama Çubuğu */}
                <View className="px-6 py-2 bg-gray-50 dark:bg-slate-950 z-10">
                    <View className="flex-row gap-2 items-center  bg-white dark:bg-slate-800 rounded-xl px-3 h-12 border border-gray-200 dark:border-slate-700">
                        <Search size={20} className="text-gray-400 mr-2 " />
                        <TextInput
                            className="flex-1 text-base text-gray-900 dark:text-white h-full mb-2"
                            placeholder=" Kaydedilenlerde ara..."
                            placeholderTextColor="#9ca3af"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoCapitalize="none"
                            textAlignVertical="center" // Android'de metni dikey ortalar
                            style={{ includeFontPadding: false }} // Android'de gereksiz boşlukları silerƒ
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <X size={20} className="text-gray-400" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Liste */}
                <FlatList
                    data={filteredHistory}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <HistoryItem
                            item={item}
                            onPress={handleItemPress}
                            onDelete={deleteEntry}
                            onLongPress={handleLongPress}
                        />
                    )}
                    contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View className="items-center justify-center mt-32 px-10">
                            <View className="bg-gray-100 dark:bg-slate-800 p-6 rounded-full mb-4">
                                <ClipboardList size={40} className="text-gray-300 dark:text-slate-600" />
                            </View>
                            <Text className="text-gray-900 dark:text-white font-bold text-lg mb-2">Henüz Kayıt Yok</Text>
                            <Text className="text-gray-400 text-center leading-5">
                                Panoya kopyaladığınız metinler burada görünecek. Otomatik kaydı açabilir veya sağ alttaki butonu kullanabilirsiniz.
                            </Text>
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
        </View>
    );
};