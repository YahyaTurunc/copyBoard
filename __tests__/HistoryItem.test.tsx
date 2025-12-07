import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HistoryItem } from '../src/components/HistoryItem';

// Mock Swipeable to just render children
jest.mock('react-native-gesture-handler/Swipeable', () => {
    const React = require('react');
    const { View } = require('react-native');
    return ({ children }: { children: React.ReactNode }) => <View>{children}</View>;
});

describe('HistoryItem', () => {
    const mockItem = {
        id: '1',
        text: 'Test Clipboard Content',
        timestamp: 1678886400000, // 2023-03-15 16:00:00
        source: 'TestApp',
    };

    const mockOnPress = jest.fn();
    const mockOnDelete = jest.fn();
    const mockOnLongPress = jest.fn();

    it('renders correctly', () => {
        const { getByText } = render(
            <HistoryItem
                item={mockItem}
                onPress={mockOnPress}
                onDelete={mockOnDelete}
                onLongPress={mockOnLongPress}
            />
        );

        expect(getByText('Test Clipboard Content')).toBeTruthy();
        expect(getByText('TestApp')).toBeTruthy();
    });

    it('calls onPress when tapped', () => {
        const { getByText } = render(
            <HistoryItem
                item={mockItem}
                onPress={mockOnPress}
                onDelete={mockOnDelete}
                onLongPress={mockOnLongPress}
            />
        );

        fireEvent.press(getByText('Test Clipboard Content'));
        expect(mockOnPress).toHaveBeenCalledWith(mockItem);
    });
});
