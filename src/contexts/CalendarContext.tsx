import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CalendarItem } from '../models/types';
import { STORAGE_KEY_CALENDAR_ITEMS } from '../config/constants';

interface CalendarContextType {
    items: CalendarItem[];
    loading: boolean;
    createItem: (item: Omit<CalendarItem, 'id' | 'createdAt' | 'modifiedAt'>) => Promise<CalendarItem>;
    updateItem: (id: string, updates: Partial<CalendarItem>) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
    getItemsByDate: (date: string) => CalendarItem[];
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const useCalendar = () => {
    const context = useContext(CalendarContext);
    if (!context) {
        throw new Error('useCalendar must be used within a CalendarProvider');
    }
    return context;
};

interface CalendarProviderProps {
    children: ReactNode;
}

export const CalendarProvider: React.FC<CalendarProviderProps> = ({ children }) => {
    const [items, setItems] = useState<CalendarItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Initial load from storage
    useEffect(() => {
        const loadItems = async () => {
            try {
                const storedItems = await AsyncStorage.getItem(STORAGE_KEY_CALENDAR_ITEMS);
                if (storedItems) {
                    setItems(JSON.parse(storedItems));
                }
            } catch (error) {
                console.error('Failed to load calendar items:', error);
            } finally {
                setLoading(false);
            }
        };

        loadItems();
    }, []);

    // Helper to save to storage
    const saveToStorage = async (newItems: CalendarItem[]) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY_CALENDAR_ITEMS, JSON.stringify(newItems));
        } catch (error) {
            console.error('Failed to save calendar items:', error);
        }
    };

    const createItem = async (itemData: Omit<CalendarItem, 'id' | 'createdAt' | 'modifiedAt'>) => {
        const newItem: CalendarItem = {
            ...itemData,
            id: Math.random().toString(36).substring(7), // Simple local ID
            createdAt: new Date().toISOString() as any, // Mocking timestamp string for local dev
            modifiedAt: new Date().toISOString() as any,
        };

        const updatedItems = [...items, newItem];
        setItems(updatedItems);
        await saveToStorage(updatedItems);
        return newItem;
    };

    const updateItem = async (id: string, updates: Partial<CalendarItem>) => {
        const updatedItems = items.map(item =>
            item.id === id ? { ...item, ...updates, modifiedAt: new Date().toISOString() as any } : item
        );
        setItems(updatedItems);
        await saveToStorage(updatedItems);
    };

    const deleteItem = async (id: string) => {
        const updatedItems = items.filter(item => item.id !== id);
        setItems(updatedItems);
        await saveToStorage(updatedItems);
    };

    const getItemsByDate = (date: string) => {
        return items.filter(item => item.date === date);
    };

    return (
        <CalendarContext.Provider value={{ items, loading, createItem, updateItem, deleteItem, getItemsByDate }}>
            {children}
        </CalendarContext.Provider>
    );
};
