import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { ClipboardItem } from '../utils/types';
import { Trash2, Copy, FileText, Check } from 'lucide-react-native';

interface HistoryItemProps {
    item: ClipboardItem;
    onPress: (item: ClipboardItem) => void;
    onDelete: (id: string) => void;
    onLongPress: (item: ClipboardItem) => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ item, onPress, onDelete, onLongPress }) => {
    const [isCopied, setIsCopied] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePress = async () => {
        await onPress(item);

        // Shrink Copy icon
        Animated.timing(scaleAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
        }).start(() => {
            setIsCopied(true);
            // Grow Check icon
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
                damping: 15,
                stiffness: 150,
            }).start();
        });

        setTimeout(() => {
            // Shrink Check icon
            Animated.timing(scaleAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }).start(() => {
                setIsCopied(false);
                // Grow Copy icon
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    damping: 15,
                    stiffness: 150,
                }).start();
            });
        }, 2000);
    };

    // Silme butonu animasyonu
    const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
        const trans = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [0, 10],
            extrapolate: 'clamp',
        });

        return (
            <TouchableOpacity onPress={() => onDelete(item.id)} className="bg-red-500 justify-center items-center w-20 h-[90%] my-auto rounded-r-2xl ml-[-10px]">
                <Animated.View style={{ transform: [{ translateX: trans }] }}>
                    <Trash2 color="white" size={24} />
                </Animated.View>
            </TouchableOpacity>
        );
    };

    // Basit tarih formatlayıcı (Örn: 14:30)
    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <View className="px-4 py-2">
            <Swipeable renderRightActions={renderRightActions} containerStyle={{ overflow: 'visible' }}>
                <TouchableOpacity
                    onPress={handlePress}
                    onLongPress={() => onLongPress(item)}
                    activeOpacity={0.7}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 flex-row items-center"
                >
                    {/* Sol İkon Alanı */}
                    <View className="bg-blue-50 dark:bg-blue-900/30 w-10 h-10 rounded-full items-center justify-center mr-3">
                        <FileText size={20} className="text-blue-500 dark:text-blue-400" />
                    </View>

                    {/* Orta Metin Alanı */}
                    <View className="flex-1 space-y-1">
                        <Text
                            className="text-gray-800 dark:text-gray-100 text-base font-semibold"
                            numberOfLines={1}
                        >
                            {item.text.replace(/\n/g, ' ')}
                        </Text>
                        <View className="flex-row items-center">
                            <Text className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                                {formatTime(item.timestamp)}
                            </Text>
                            {item.source && (
                                <>
                                    <View className="w-1 h-1 rounded-full bg-gray-300 mx-2" />
                                    <Text className="text-xs text-blue-500 font-medium bg-blue-50 px-2 py-0.5 rounded-md overflow-hidden">
                                        {item.source}
                                    </Text>
                                </>
                            )}
                        </View>
                    </View>

                    {/* Sağ Aksiyon İkonu */}
                    <View className="pl-2">
                        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                            {isCopied ? (
                                <Check size={20} color={"green"} className="text-green-500" />
                            ) : (
                                <Copy size={20} className="text-gray-300" />
                            )}
                        </Animated.View>
                    </View>
                </TouchableOpacity>
            </Swipeable>
        </View>
    );
};