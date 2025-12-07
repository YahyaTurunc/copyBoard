import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { ClipboardItem } from '../utils/types';
import { Trash2 } from 'lucide-react-native';

interface HistoryItemProps {
    item: ClipboardItem;
    onPress: (item: ClipboardItem) => void;
    onDelete: (id: string) => void;
    onLongPress: (item: ClipboardItem) => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ item, onPress, onDelete, onLongPress }) => {
    const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
        const trans = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [0, 100],
            extrapolate: 'clamp',
        });

        return (
            <TouchableOpacity onPress={() => onDelete(item.id)} className="bg-red-500 justify-center items-center w-20 h-full rounded-r-xl">
                <Animated.View style={{ transform: [{ translateX: trans }] }}>
                    <Trash2 color="white" size={24} />
                </Animated.View>
            </TouchableOpacity>
        );
    };

    const date = new Date(item.timestamp);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

    return (
        <Swipeable renderRightActions={renderRightActions}>
            <TouchableOpacity
                onPress={() => onPress(item)}
                onLongPress={() => onLongPress(item)}
                className="bg-white dark:bg-slate-800 p-4 border-b border-gray-100 dark:border-slate-700 active:bg-gray-50 dark:active:bg-slate-700"
            >
                <View className="flex-row justify-between items-start">
                    <Text className="text-gray-800 dark:text-gray-100 text-base font-medium flex-1 mr-2" numberOfLines={1}>
                        {item.text}
                    </Text>
                    <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {formattedDate}
                    </Text>
                </View>
                {item.source && (
                    <Text className="text-xs text-blue-500 mt-1">
                        {item.source}
                    </Text>
                )}
            </TouchableOpacity>
        </Swipeable>
    );
};
