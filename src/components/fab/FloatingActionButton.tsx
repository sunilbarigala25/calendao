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

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ selectedDate }) => {
    const { theme, themeType } = useTheme();
    const { user } = useAuth();
    const { createItem } = useCalendar();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const [isExpanded, setIsExpanded] = useState(false);
    const [animation] = useState(new Animated.Value(0));

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

    const handleAction = async (type: 'event' | 'note' | 'todo' | 'reminder') => {
        toggleMenu();

        // Quick Create for PRD Demonstration
        const title = `New ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        const payload: any = { title };

        if (type === 'event') {
            payload.startTime = '10:00 AM';
            payload.endTime = '11:00 AM';
        } else if (type === 'reminder') {
            payload.time = '09:00 AM';
        } else if (type === 'todo') {
            payload.completed = false;
        } else if (type === 'note') {
            payload.content = 'Start typing...';
        }

        try {
            await createItem({
                userId: 'demo-user',
                date: selectedDate,
                type,
                payload
            });
            console.log(`Created ${type} for ${selectedDate}`);
        } catch (error) {
            console.error('Failed to create item:', error);
        }
    };

    const actionButtons: { icon: string; label: string; type: 'event' | 'note' | 'todo' | 'reminder'; color: string }[] = [
        { icon: 'star', label: 'Event', type: 'event', color: user?.categoryColors.event || theme.colors.primary },
        { icon: 'notifications', label: 'Reminder', type: 'reminder', color: user?.categoryColors.reminder || theme.colors.warning },
        { icon: 'checkbox', label: 'To-Do', type: 'todo', color: user?.categoryColors.todo || theme.colors.success },
        { icon: 'document-text', label: 'Note', type: 'note', color: user?.categoryColors.note || theme.colors.secondary },
    ];

    return (
        <View style={styles.container} pointerEvents="box-none">
            {/* Overlay */}
            {isExpanded && (
                <TouchableOpacity
                    style={[styles.overlay, { backgroundColor: theme.colors.overlay }]}
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
                                    backgroundColor: themeType === 'glass' ? 'rgba(255,255,255,0.4)' : theme.colors.surface,
                                    borderColor: themeType === 'glass' ? 'rgba(255,255,255,0.3)' : theme.colors.divider,
                                    borderWidth: 1,
                                    ...theme.shadows.medium,
                                }
                            ]}
                            onPress={() => handleAction(action.type)}
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
                        backgroundColor: themeType === 'glass' ? 'rgba(255,255,255,0.4)' : theme.colors.primary,
                        ...theme.shadows.large,
                    },
                    themeType === 'glass' && { borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }
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
});
