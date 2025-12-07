import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Share } from 'react-native';
import { ClipboardItem } from '../utils/types';
import * as Clipboard from 'expo-clipboard';
import { Copy, Share2, Trash2, X } from 'lucide-react-native';

interface DetailModalProps {
    visible: boolean;
    item: ClipboardItem | null;
    onClose: () => void;
    onDelete: (id: string) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ visible, item, onClose, onDelete }) => {
    if (!item) return null;

    const handleCopy = async () => {
        await Clipboard.setStringAsync(item.text);
        onClose();
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: item.text,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = () => {
        onDelete(item.id);
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end bg-black/50">
                <View className="bg-white dark:bg-slate-900 rounded-t-3xl h-[80%] p-6 shadow-2xl">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-xl font-bold text-gray-900 dark:text-white">Details</Text>
                        <TouchableOpacity onPress={onClose} className="p-2 bg-gray-100 dark:bg-slate-800 rounded-full">
                            <X size={24} className="text-gray-600 dark:text-gray-300" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="flex-1 bg-gray-50 dark:bg-slate-800 rounded-xl p-4 mb-6">
                        <Text className="text-base text-gray-800 dark:text-gray-200">{item.text}</Text>
                    </ScrollView>

                    <View className="flex-row justify-around pb-6">
                        <TouchableOpacity onPress={handleCopy} className="items-center">
                            <View className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full justify-center items-center mb-1">
                                <Copy size={24} className="text-blue-600 dark:text-blue-300" />
                            </View>
                            <Text className="text-xs text-gray-600 dark:text-gray-400">Copy</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleShare} className="items-center">
                            <View className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full justify-center items-center mb-1">
                                <Share2 size={24} className="text-green-600 dark:text-green-300" />
                            </View>
                            <Text className="text-xs text-gray-600 dark:text-gray-400">Share</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleDelete} className="items-center">
                            <View className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full justify-center items-center mb-1">
                                <Trash2 size={24} className="text-red-600 dark:text-red-300" />
                            </View>
                            <Text className="text-xs text-gray-600 dark:text-gray-400">Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
