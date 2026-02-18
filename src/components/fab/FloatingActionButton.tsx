import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Text, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FloatingActionButtonProps {
    selectedDate: string;
}

import { useCalendar } from '../../contexts/CalendarContext';
import { Modal, TextInput } from 'react-native';

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ selectedDate }) => {
    const { theme, themeType } = useTheme();
    const { user } = useAuth();
    const { createItem } = useCalendar();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();

    const [isExpanded, setIsExpanded] = useState(false);
    const [animation] = useState(new Animated.Value(0));

    // Modal State
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [activeType, setActiveType] = useState<'event' | 'note' | 'todo' | 'reminder'>('event');
    const [newTitle, setNewTitle] = useState('');
    const [newDate, setNewDate] = useState(selectedDate);
    const [newTime, setNewTime] = useState('10:00 AM');

    const toggleMenu = () => {
        const toValue = isExpanded ? 0 : 1;
        Animated.spring(animation, {
            toValue,
            useNativeDriver: true,
            friction: 7,
            tension: 40,
        }).start();
        setIsExpanded(!isExpanded);
    };

    const handleActionSelect = (type: 'event' | 'note' | 'todo' | 'reminder') => {
        setActiveType(type);
        setNewTitle('');
        setNewDate(selectedDate);
        setNewTime(type === 'event' ? '10:00 AM' : type === 'reminder' ? '09:00 AM' : '12:00 PM');
        toggleMenu();
        setTimeout(() => setIsModalVisible(true), 300);
    };

    const handleCreate = async () => {
        const payload: any = { title: newTitle || `New ${activeType}` };

        if (activeType === 'event') {
            payload.startTime = newTime;
            payload.endTime = '11:00 AM';
        } else if (activeType === 'reminder') {
            payload.time = newTime;
        } else if (activeType === 'todo') {
            payload.completed = false;
            payload.time = newTime;
        } else if (activeType === 'note') {
            payload.content = '';
        }

        try {
            await createItem({
                userId: user?.userId || 'demo-user',
                date: newDate,
                type: activeType,
                payload
            });
            setIsModalVisible(false);
            console.log(`Created ${activeType} for ${newDate}`);
        } catch (error) {
            console.error('Failed to create item:', error);
        }
    };

    const actionButtons: { icon: string; label: string; type: 'event' | 'note' | 'todo' | 'reminder'; color: string }[] = [
        { icon: 'star', label: 'Event', type: 'event', color: '#FFD700' },
        { icon: 'notifications', label: 'Reminder', type: 'reminder', color: '#FF3B30' },
        { icon: 'checkbox', label: 'To-Do', type: 'todo', color: '#34C759' },
        { icon: 'document-text', label: 'Note', type: 'note', color: '#5856D6' },
    ];

    return (
        <View style={styles.container} pointerEvents="box-none">
            {/* Modal for Creation */}
            <Modal
                transparent
                visible={isModalVisible}
                animationType="fade"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        onPress={() => setIsModalVisible(false)}
                    />
                    <View style={[styles.modalCard, { backgroundColor: theme.colors.surface, ...theme.shadows.large }]}>
                        <View style={[styles.modalHeader, { backgroundColor: actionButtons.find(a => a.type === activeType)?.color + '22' }]}>
                            <Ionicons
                                name={actionButtons.find(a => a.type === activeType)?.icon as any}
                                size={24}
                                color={actionButtons.find(a => a.type === activeType)?.color}
                            />
                            <Text style={[theme.typography.h3, { color: theme.colors.onSurface, marginLeft: 12 }]}>
                                New {activeType.charAt(0).toUpperCase() + activeType.slice(1)}
                            </Text>
                        </View>

                        <View style={styles.modalContent}>
                            <Text style={[theme.typography.caption, { color: theme.colors.onSurfaceVariant, marginBottom: 8 }]}>TITLE</Text>
                            <TextInput
                                style={[styles.input, { color: theme.colors.onSurface, borderColor: theme.colors.divider }]}
                                value={newTitle}
                                onChangeText={setNewTitle}
                                placeholder="What's on your mind?"
                                placeholderTextColor={theme.colors.onSurfaceVariant + '88'}
                                autoFocus
                            />

                            <View style={styles.row}>
                                <View style={{ flex: 1 }}>
                                    <Text style={[theme.typography.caption, { color: theme.colors.onSurfaceVariant, marginBottom: 8, marginTop: 16 }]}>DATE</Text>
                                    <TextInput
                                        style={[styles.input, { color: theme.colors.onSurface, borderColor: theme.colors.divider }]}
                                        value={newDate}
                                        onChangeText={setNewDate}
                                    />
                                </View>
                                {activeType !== 'note' && (
                                    <View style={{ flex: 1, marginLeft: 16 }}>
                                        <Text style={[theme.typography.caption, { color: theme.colors.onSurfaceVariant, marginBottom: 8, marginTop: 16 }]}>TIME</Text>
                                        <TextInput
                                            style={[styles.input, { color: theme.colors.onSurface, borderColor: theme.colors.divider }]}
                                            value={newTime}
                                            onChangeText={setNewTime}
                                        />
                                    </View>
                                )}
                            </View>

                            <TouchableOpacity
                                style={[styles.createButton, { backgroundColor: theme.colors.primary }]}
                                onPress={handleCreate}
                            >
                                <Text style={styles.createButtonText}>Add to Calendar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Overlay */}
            {isExpanded && (
                <TouchableOpacity
                    style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.3)' }]}
                    activeOpacity={1}
                    onPress={toggleMenu}
                />
            )}

            {/* Action Buttons */}
            {actionButtons.map((action, index) => {
                const translateY = animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -(70 * (index + 1))],
                });

                const opacity = animation.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 0, 1],
                });

                const scale = animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                });

                return (
                    <Animated.View
                        key={action.type}
                        style={[
                            styles.actionContainer,
                            {
                                bottom: 100 + insets.bottom,
                                transform: [{ translateY }, { scale }],
                                opacity,
                            },
                        ]}
                    >
                        <TouchableOpacity
                            style={[
                                styles.glassActionCard,
                                {
                                    backgroundColor: themeType === 'glass' ? 'rgba(255,255,255,0.7)' : theme.colors.surface,
                                    borderColor: themeType === 'glass' ? 'rgba(255,255,255,0.3)' : theme.colors.divider,
                                    borderWidth: 1,
                                    ...theme.shadows.medium,
                                }
                            ]}
                            onPress={() => handleActionSelect(action.type)}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: action.color }]}>
                                <Ionicons name={action.icon as any} size={20} color="#FFFFFF" />
                            </View>
                            <Text style={[theme.typography.body, { color: theme.colors.onSurface, fontWeight: '600' }]}>
                                {action.label}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                );
            })}

            {/* Main FAB */}
            <TouchableOpacity
                style={[
                    styles.fab,
                    {
                        bottom: 100 + insets.bottom,
                        backgroundColor: themeType === 'glass' ? 'rgba(255,255,255,0.6)' : theme.colors.primary,
                        ...theme.shadows.large,
                        shadowColor: isExpanded ? theme.colors.primary : '#000',
                        shadowOpacity: isExpanded ? 0.5 : 0.3,
                        transform: [{ scale: animation.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }) }]
                    },
                    themeType === 'glass' && { borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' }
                ]}
                onPress={toggleMenu}
                activeOpacity={0.8}
            >
                <Animated.View
                    style={{
                        transform: [
                            {
                                rotate: animation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '45deg'],
                                }),
                            },
                        ],
                    }}
                >
                    <Ionicons
                        name="add"
                        size={32}
                        color={themeType === 'glass' ? 'rgba(0,0,0,0.5)' : theme.colors.onPrimary}
                    />
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        top: 0,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    fab: {
        position: 'absolute',
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    actionContainer: {
        position: 'absolute',
        right: 24,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 90,
    },
    glassActionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 16,
        minWidth: 140,
        gap: 12,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalCard: {
        width: '100%',
        borderRadius: 32,
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        padding: 24,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
    },
    createButton: {
        marginTop: 32,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    createButtonText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 16,
    }
});
