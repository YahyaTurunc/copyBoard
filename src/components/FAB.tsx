import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Plus } from 'lucide-react-native';

interface FABProps {
    onPress: () => void;
}

export const FAB: React.FC<FABProps> = ({ onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="absolute bottom-6 right-6 bg-blue-600 w-14 h-14 rounded-full justify-center items-center shadow-lg elevation-5 active:bg-blue-700"
        >
            <Plus color="white" size={28} />
        </TouchableOpacity>
    );
};
