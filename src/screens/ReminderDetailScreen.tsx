import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ReminderDetailScreen: React.FC<any> = ({ navigation, route }) => {
    const { item } = route.params;
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const [isAlarm, setIsAlarm] = useState(false);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor: theme.colors.surface }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
                </TouchableOpacity>
                <Text style={[theme.typography.h3, { color: theme.colors.onSurface }]}>Reminder</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <View style={[styles.card, { backgroundColor: theme.colors.surface, ...theme.shadows.medium }]}>
                    <View style={[styles.typeBadge, { backgroundColor: '#FF3B30' }]}>
                        <Ionicons name="notifications" size={16} color="#FFF" />
                        <Text style={styles.badgeText}>REMINDER</Text>
                    </View>

                    <Text style={[theme.typography.h1, { color: theme.colors.onSurface, marginTop: 16 }]}>
                        {item.payload.title}
                    </Text>

                    <View style={styles.timeRow}>
                        <Text style={[styles.timeText, { color: theme.colors.onSurface }]}>
                            {item.payload.time || '09:00 AM'}
                        </Text>
                        <Ionicons name="alarm-outline" size={32} color={theme.colors.primary} />
                    </View>
                </View>

                <View style={[styles.settingSection, { backgroundColor: theme.colors.surface }]}>
                    <View style={styles.settingRow}>
                        <View>
                            <Text style={[theme.typography.body, { color: theme.colors.onSurface, fontWeight: '700' }]}>Set Alarm</Text>
                            <Text style={[theme.typography.caption, { color: theme.colors.onSurfaceVariant }]}>Ring even if phone is on silent</Text>
                        </View>
                        <Switch
                            value={isAlarm}
                            onValueChange={setIsAlarm}
                            trackColor={{ false: theme.colors.divider, true: theme.colors.primary }}
                        />
                    </View>
                </View>

                <TouchableOpacity style={[styles.deleteButton, { borderColor: '#FF3B30', borderWidth: 1 }]}>
                    <Text style={{ color: '#FF3B30', fontWeight: '700' }}>Delete Reminder</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: { padding: 20 },
    card: {
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
    },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '900',
        marginLeft: 6,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 24,
    },
    timeText: {
        fontSize: 48,
        fontWeight: '300',
    },
    settingSection: {
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    deleteButton: {
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 'auto',
    }
});
