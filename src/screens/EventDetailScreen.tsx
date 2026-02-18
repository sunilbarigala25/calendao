import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const EventDetailScreen: React.FC<any> = ({ navigation, route }) => {
    const { item } = route.params;
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    const handleJoinMeeting = () => {
        if (item.payload.meetLink) {
            Linking.openURL(item.payload.meetLink);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor: theme.colors.surface }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
                </TouchableOpacity>
                <Text style={[theme.typography.h3, { color: theme.colors.onSurface }]}>Event Details</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.card, { backgroundColor: theme.colors.surface, ...theme.shadows.medium }]}>
                    <View style={[styles.typeBadge, { backgroundColor: '#FFD700' }]}>
                        <Ionicons name="star" size={16} color="#FFF" />
                        <Text style={styles.badgeText}>EVENT</Text>
                    </View>

                    <Text style={[theme.typography.h1, { color: theme.colors.onSurface, marginTop: 16 }]}>
                        {item.payload.title}
                    </Text>

                    <View style={styles.infoRow}>
                        <Ionicons name="time-outline" size={20} color={theme.colors.onSurfaceVariant} />
                        <Text style={[theme.typography.body, { color: theme.colors.onSurface, marginLeft: 12 }]}>
                            {item.payload.startTime} - {item.payload.endTime || 'No end time'}
                        </Text>
                    </View>

                    {item.payload.location && (
                        <View style={styles.infoRow}>
                            <Ionicons name="location-outline" size={20} color={theme.colors.onSurfaceVariant} />
                            <Text style={[theme.typography.body, { color: theme.colors.onSurface, marginLeft: 12 }]}>
                                {item.payload.location}
                            </Text>
                        </View>
                    )}

                    <View style={[styles.meetSection, { borderTopWidth: 1, borderTopColor: theme.colors.divider, marginTop: 24, paddingTop: 24 }]}>
                        <Text style={[theme.typography.caption, { color: theme.colors.onSurfaceVariant, fontWeight: '700', marginBottom: 12 }]}>
                            VIDEO CALL
                        </Text>
                        <View style={styles.meetRow}>
                            <View style={[styles.meetBrandIcon, { backgroundColor: '#E8F0FE' }]}>
                                <Ionicons name="videocam" size={20} color="#1a73e8" />
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={[theme.typography.body, { color: theme.colors.onSurface, fontWeight: '600' }]}>
                                    Google Meet
                                </Text>
                                <Text style={[theme.typography.caption, { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>
                                    {item.payload.meetLink || 'meet.google.com/abc-defg-hij'}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={handleJoinMeeting}
                                style={[styles.joinChip, { backgroundColor: theme.colors.primary }]}
                            >
                                <Text style={styles.joinText}>Join</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={[styles.rsvpSection, { backgroundColor: theme.colors.surface, ...theme.shadows.small }]}>
                    <Text style={[theme.typography.h3, { color: theme.colors.onSurface }]}>RSVP</Text>
                    <View style={styles.rsvpOptions}>
                        <TouchableOpacity style={[styles.rsvpOption, { borderColor: theme.colors.divider, borderWidth: 1 }]}>
                            <Text style={{ color: theme.colors.onSurface }}>Going</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.rsvpOption, { borderColor: theme.colors.divider, borderWidth: 1 }]}>
                            <Text style={{ color: theme.colors.onSurface }}>Maybe</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.rsvpOption, { borderColor: theme.colors.divider, borderWidth: 1 }]}>
                            <Text style={{ color: theme.colors.onSurface }}>No</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
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
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
    },
    meetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 16,
        marginTop: 24,
    },
    meetSection: {
        width: '100%',
    },
    meetRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    meetBrandIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    joinChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    joinText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 12,
    },
    rsvpSection: {
        borderRadius: 24,
        padding: 24,
    },
    rsvpOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    rsvpOption: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    }
});
