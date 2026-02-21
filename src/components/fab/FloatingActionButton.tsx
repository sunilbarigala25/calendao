import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Text, Platform, Modal, TextInput, Switch, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCalendar } from '../../contexts/CalendarContext';

interface FloatingActionButtonProps {
    selectedDate: string;
}

// Helper: get current time as hh:mm A string
const getCurrentTimeStr = (): string => {
    const now = new Date();
    let h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${String(h).padStart(2, '0')}:${m} ${ampm}`;
};

// Helper: add 1 hour to hh:mm A string
const addOneHour = (timeStr: string): string => {
    const [time, ampm] = timeStr.split(' ');
    let [h, m] = time.split(':').map(Number);

    let hours24 = ampm === 'PM' ? (h === 12 ? 12 : h + 12) : (h === 12 ? 0 : h);
    hours24 = (hours24 + 1) % 24;

    const newAmpm = hours24 >= 12 ? 'PM' : 'AM';
    let newH = hours24 % 12 || 12;
    return `${String(newH).padStart(2, '0')}:${String(m).padStart(2, '0')} ${newAmpm}`;
};

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
    const [startTime, setStartTime] = useState(getCurrentTimeStr());
    const [endTime, setEndTime] = useState(addOneHour(getCurrentTimeStr()));
    const [reminderTime, setReminderTime] = useState(getCurrentTimeStr());
    const [isAllDay, setIsAllDay] = useState(false);

    const [startAmpm, setStartAmpm] = useState(getCurrentTimeStr().split(' ')[1]);
    const [endAmpm, setEndAmpm] = useState(addOneHour(getCurrentTimeStr()).split(' ')[1]);
    const [reminderAmpm, setReminderAmpm] = useState(getCurrentTimeStr().split(' ')[1]);

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
        const nowFull = getCurrentTimeStr();
        const [nowTime, nowAp] = nowFull.split(' ');
        const nextFull = addOneHour(nowFull);
        const [nextTime, nextAp] = nextFull.split(' ');

        setStartTime(nowTime);
        setStartAmpm(nowAp);
        setEndTime(nextTime);
        setEndAmpm(nextAp);
        setReminderTime(nowTime);
        setReminderAmpm(nowAp);
        setIsAllDay(false);
        toggleMenu();
        setTimeout(() => setIsModalVisible(true), 300);
    };

    const handleCreate = async () => {
        const payload: any = { title: newTitle.trim() || `New ${activeType}` };

        if (activeType === 'event') {
            if (isAllDay) {
                payload.allDay = true;
                payload.startTime = '12:00 AM';
                payload.endTime = '11:59 PM';
            } else {
                payload.allDay = false;
                payload.startTime = `${startTime.split(' ')[0]} ${startAmpm}`;
                payload.endTime = `${endTime.split(' ')[0]} ${endAmpm}`;
            }
        } else if (activeType === 'reminder') {
            payload.time = `${reminderTime.split(' ')[0]} ${reminderAmpm}`;
        } else if (activeType === 'todo') {
            payload.completed = false;
            payload.time = `${reminderTime.split(' ')[0]} ${reminderAmpm}`;
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

    const activeAction = actionButtons.find(a => a.type === activeType);

    const showTimeFields = activeType === 'event' || activeType === 'reminder' || activeType === 'todo';

    return (
        <View style={styles.container} pointerEvents="box-none">
            {/* Creation Modal */}
            <Modal
                transparent
                visible={isModalVisible}
                animationType="slide"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        onPress={() => setIsModalVisible(false)}
                        activeOpacity={1}
                    />
                    <View style={[styles.modalCard, { backgroundColor: theme.colors.surface }]}>
                        {/* Header */}
                        <View style={[styles.modalHeader, { backgroundColor: (activeAction?.color || '#888') + '18' }]}>
                            <View style={[styles.modalHeaderIcon, { backgroundColor: activeAction?.color || '#888' }]}>
                                <Ionicons name={activeAction?.icon as any} size={20} color="#FFF" />
                            </View>
                            <Text style={[theme.typography.h3, { color: theme.colors.onSurface, marginLeft: 12, flex: 1 }]}>
                                New {activeType.charAt(0).toUpperCase() + activeType.slice(1)}
                            </Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                <Ionicons name="close" size={22} color={theme.colors.onSurfaceVariant} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled">
                            {/* Title */}
                            <Text style={[styles.fieldLabel, { color: theme.colors.onSurfaceVariant }]}>TITLE</Text>
                            <TextInput
                                style={[styles.input, { color: theme.colors.onSurface, borderColor: theme.colors.divider, backgroundColor: theme.colors.background }]}
                                value={newTitle}
                                onChangeText={setNewTitle}
                                placeholder={`Name your ${activeType}...`}
                                placeholderTextColor={theme.colors.onSurfaceVariant + '66'}
                                autoFocus
                                returnKeyType="next"
                            />

                            {/* Date */}
                            <Text style={[styles.fieldLabel, { color: theme.colors.onSurfaceVariant, marginTop: 16 }]}>DATE (DD-MM-YYYY)</Text>
                            <TextInput
                                style={[styles.input, { color: theme.colors.onSurface, borderColor: theme.colors.divider, backgroundColor: theme.colors.background }]}
                                value={newDate}
                                onChangeText={setNewDate}
                                placeholder="DD-MM-YYYY"
                                placeholderTextColor={theme.colors.onSurfaceVariant + '66'}
                            />

                            {/* Event-specific: All-Day toggle + Start/End Time */}
                            {activeType === 'event' && (
                                <>
                                    <View style={[styles.toggleRow, { borderColor: theme.colors.divider }]}>
                                        <View>
                                            <Text style={[theme.typography.body, { color: theme.colors.onSurface, fontWeight: '600' }]}>All-Day Event</Text>
                                            <Text style={[theme.typography.caption, { color: theme.colors.onSurfaceVariant }]}>No specific time required</Text>
                                        </View>
                                        <Switch
                                            value={isAllDay}
                                            onValueChange={setIsAllDay}
                                            trackColor={{ false: theme.colors.divider, true: activeAction?.color || theme.colors.primary }}
                                            thumbColor="#FFF"
                                        />
                                    </View>

                                    {!isAllDay && (
                                        <View style={styles.timeRow}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={[styles.fieldLabel, { color: theme.colors.onSurfaceVariant }]}>START TIME</Text>
                                                <View style={styles.timeInputWrapper}>
                                                    <TextInput
                                                        style={[styles.input, styles.timeInput, { color: theme.colors.onSurface, borderColor: theme.colors.divider, backgroundColor: theme.colors.background }]}
                                                        value={startTime.split(' ')[0]}
                                                        onChangeText={setStartTime}
                                                        placeholder="09:00"
                                                        placeholderTextColor={theme.colors.onSurfaceVariant + '66'}
                                                        keyboardType="numbers-and-punctuation"
                                                    />
                                                    <TouchableOpacity
                                                        style={[styles.ampmToggle, { backgroundColor: theme.colors.surfaceVariant }]}
                                                        onPress={() => setStartAmpm(startAmpm === 'AM' ? 'PM' : 'AM')}
                                                    >
                                                        <Text style={[styles.ampmText, { color: theme.colors.onSurface }]}>{startAmpm}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            <View style={styles.timeSeparator}>
                                                <Ionicons name="arrow-forward" size={16} color={theme.colors.onSurfaceVariant} />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={[styles.fieldLabel, { color: theme.colors.onSurfaceVariant }]}>END TIME</Text>
                                                <View style={styles.timeInputWrapper}>
                                                    <TextInput
                                                        style={[styles.input, styles.timeInput, { color: theme.colors.onSurface, borderColor: theme.colors.divider, backgroundColor: theme.colors.background }]}
                                                        value={endTime.split(' ')[0]}
                                                        onChangeText={setEndTime}
                                                        placeholder="10:00"
                                                        placeholderTextColor={theme.colors.onSurfaceVariant + '66'}
                                                        keyboardType="numbers-and-punctuation"
                                                    />
                                                    <TouchableOpacity
                                                        style={[styles.ampmToggle, { backgroundColor: theme.colors.surfaceVariant }]}
                                                        onPress={() => setEndAmpm(endAmpm === 'AM' ? 'PM' : 'AM')}
                                                    >
                                                        <Text style={[styles.ampmText, { color: theme.colors.onSurface }]}>{endAmpm}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                </>
                            )}

                            {(activeType === 'reminder' || activeType === 'todo') && (
                                <>
                                    <Text style={[styles.fieldLabel, { color: theme.colors.onSurfaceVariant, marginTop: 16 }]}>TIME</Text>
                                    <View style={styles.timeInputWrapper}>
                                        <TextInput
                                            style={[styles.input, styles.timeInput, { color: theme.colors.onSurface, borderColor: theme.colors.divider, backgroundColor: theme.colors.background }]}
                                            value={reminderTime.split(' ')[0]}
                                            onChangeText={setReminderTime}
                                            placeholder="09:00"
                                            placeholderTextColor={theme.colors.onSurfaceVariant + '66'}
                                            keyboardType="numbers-and-punctuation"
                                        />
                                        <TouchableOpacity
                                            style={[styles.ampmToggle, { backgroundColor: theme.colors.surfaceVariant }]}
                                            onPress={() => setReminderAmpm(reminderAmpm === 'AM' ? 'PM' : 'AM')}
                                        >
                                            <Text style={[styles.ampmText, { color: theme.colors.onSurface }]}>{reminderAmpm}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}

                            {/* Create Button */}
                            <TouchableOpacity
                                style={[styles.createButton, { backgroundColor: activeAction?.color || theme.colors.primary }]}
                                onPress={handleCreate}
                                activeOpacity={0.85}
                            >
                                <Ionicons name="add-circle" size={20} color="#FFF" />
                                <Text style={styles.createButtonText}>Add to Calendar</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Overlay when expanded */}
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
                    outputRange: [0, -(72 * (index + 1))],
                });
                const opacity = animation.interpolate({
                    inputRange: [0, 0.4, 1],
                    outputRange: [0, 0, 1],
                });
                const scale = animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.6, 1],
                });

                return (
                    <Animated.View
                        key={action.type}
                        style={[
                            styles.actionContainer,
                            {
                                bottom: 90 + insets.bottom,
                                transform: [{ translateY }, { scale }],
                                opacity,
                            },
                        ]}
                    >
                        <TouchableOpacity
                            style={[
                                styles.glassActionCard,
                                {
                                    backgroundColor: themeType === 'glass' ? 'rgba(255,255,255,0.85)' : theme.colors.surface,
                                    borderColor: themeType === 'glass' ? 'rgba(255,255,255,0.4)' : theme.colors.divider,
                                    borderWidth: 1,
                                    shadowColor: action.color,
                                    shadowOpacity: 0.2,
                                    shadowRadius: 8,
                                    shadowOffset: { width: 0, height: 4 },
                                    elevation: 6,
                                }
                            ]}
                            onPress={() => handleActionSelect(action.type)}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: action.color }]}>
                                <Ionicons name={action.icon as any} size={18} color="#FFFFFF" />
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
                        bottom: 90 + insets.bottom,
                        backgroundColor: themeType === 'glass' ? 'rgba(255,255,255,0.7)' : theme.colors.primary,
                        shadowColor: isExpanded ? theme.colors.primary : '#000',
                        shadowOpacity: isExpanded ? 0.4 : 0.25,
                        shadowRadius: isExpanded ? 16 : 8,
                        shadowOffset: { width: 0, height: 4 },
                        elevation: isExpanded ? 12 : 6,
                        transform: [{ scale: animation.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] }) }]
                    },
                    themeType === 'glass' && { borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' }
                ]}
                onPress={toggleMenu}
                activeOpacity={0.85}
            >
                <Animated.View
                    style={{
                        transform: [{
                            rotate: animation.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '45deg'],
                            }),
                        }],
                    }}
                >
                    <Ionicons
                        name="add"
                        size={30}
                        color={themeType === 'glass' ? 'rgba(0,0,0,0.6)' : theme.colors.onPrimary}
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
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    actionContainer: {
        position: 'absolute',
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        zIndex: 90,
    },
    glassActionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 18,
        minWidth: 140,
        gap: 10,
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
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'flex-end',
    },
    modalCard: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        maxHeight: '90%',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: -4 },
        elevation: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 16,
    },
    modalHeaderIcon: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBody: {
        paddingHorizontal: 20,
        paddingBottom: 32,
    },
    fieldLabel: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.8,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1.5,
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        fontWeight: '500',
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 4,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 14,
        borderWidth: 1.5,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginTop: 16,
    },
    timeInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    timeInput: {
        flex: 1,
    },
    ampmToggle: {
        width: 46,
        height: 46,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ampmText: {
        fontSize: 13,
        fontWeight: '800',
    },
    timeSeparator: {
        paddingTop: 36,
        alignItems: 'center',
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 24,
        marginBottom: 8,
        paddingVertical: 16,
        borderRadius: 18,
    },
    createButtonText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 16,
    },
});
