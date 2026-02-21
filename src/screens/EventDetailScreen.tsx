import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert, Clipboard } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const EventDetailScreen: React.FC<any> = ({ navigation, route }) => {
    const { item } = route.params;
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    const meetLink: string | undefined = item.payload.meetLink;

    const handleOpenLink = () => {
        if (meetLink) {
            Linking.openURL(meetLink).catch(() =>
                Alert.alert('Cannot open link', meetLink)
            );
        }
    };

    const handleCopyLink = () => {
        if (meetLink) {
            Clipboard.setString(meetLink);
            Alert.alert('Copied!', 'Meeting link copied to clipboard.');
        }
    };

    const timeLabel = item.payload.allDay
        ? 'All-Day Event'
        : `${item.payload.startTime || '—'} → ${item.payload.endTime || '—'}`;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: theme.colors.surface }, theme.shadows.small]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={22} color={theme.colors.onSurface} />
                </TouchableOpacity>
                <Text style={[theme.typography.h3, { color: theme.colors.onSurface }]}>Event Details</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
                {/* Main Card */}
                <View style={[styles.card, { backgroundColor: theme.colors.surface }, theme.shadows.medium]}>
                    {/* Type badge */}
                    <View style={[styles.typeBadge, { backgroundColor: '#FFD700' }]}>
                        <Ionicons name="star" size={14} color="#FFF" />
                        <Text style={styles.badgeText}>EVENT</Text>
                    </View>

                    {/* Title */}
                    <Text style={[theme.typography.h1, { color: theme.colors.onSurface, marginTop: 16, fontSize: 26 }]}>
                        {item.payload.title}
                    </Text>

                    {/* Time */}
                    <View style={styles.infoRow}>
                        <Ionicons name="time-outline" size={20} color={theme.colors.onSurfaceVariant} />
                        <Text style={[theme.typography.body, { color: theme.colors.onSurface, marginLeft: 12, fontWeight: '600' }]}>
                            {timeLabel}
                        </Text>
                    </View>

                    {/* Location (conditional) */}
                    {item.payload.location ? (
                        <View style={styles.infoRow}>
                            <Ionicons name="location-outline" size={20} color={theme.colors.onSurfaceVariant} />
                            <Text style={[theme.typography.body, { color: theme.colors.onSurface, marginLeft: 12 }]}>
                                {item.payload.location}
                            </Text>
                        </View>
                    ) : null}

                    {/* Description (conditional) */}
                    {item.payload.description ? (
                        <View style={styles.infoRow}>
                            <Ionicons name="document-text-outline" size={20} color={theme.colors.onSurfaceVariant} />
                            <Text style={[theme.typography.body, { color: theme.colors.onSurface, marginLeft: 12, flex: 1 }]}>
                                {item.payload.description}
                            </Text>
                        </View>
                    ) : null}
                </View>

                {/* ── Meeting Link Section (conditional) ── */}
                {meetLink ? (
                    <View style={[styles.card, { backgroundColor: theme.colors.surface }, theme.shadows.medium]}>
                        <View style={styles.sectionTitleRow}>
                            <Ionicons name="videocam-outline" size={18} color={theme.colors.primary} />
                            <Text style={[theme.typography.caption, { color: theme.colors.primary, fontWeight: '800', marginLeft: 8, letterSpacing: 0.5 }]}>
                                MEETING LINK
                            </Text>
                        </View>

                        {/* URL display */}
                        <TouchableOpacity onPress={handleOpenLink} activeOpacity={0.7}>
                            <View style={[styles.linkBox, { backgroundColor: theme.colors.background, borderColor: theme.colors.divider }]}>
                                <Ionicons name="link-outline" size={16} color={theme.colors.primary} style={{ marginRight: 8 }} />
                                <Text
                                    style={[theme.typography.body, { color: theme.colors.primary, flex: 1 }]}
                                    numberOfLines={1}
                                    ellipsizeMode="middle"
                                >
                                    {meetLink}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {/* Action buttons */}
                        <View style={styles.meetActions}>
                            <TouchableOpacity
                                style={[styles.joinButton, { backgroundColor: theme.colors.primary }]}
                                onPress={handleOpenLink}
                                activeOpacity={0.85}
                            >
                                <Ionicons name="videocam" size={16} color="#FFF" />
                                <Text style={styles.joinButtonText}>Join Meeting</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.copyButton, { borderColor: theme.colors.divider }]}
                                onPress={handleCopyLink}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="copy-outline" size={16} color={theme.colors.onSurface} />
                                <Text style={[theme.typography.body, { color: theme.colors.onSurface, marginLeft: 6, fontWeight: '600' }]}>
                                    Copy
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : null}

                {/* RSVP Section */}
                <View style={[styles.card, { backgroundColor: theme.colors.surface }, theme.shadows.small]}>
                    <Text style={[theme.typography.h3, { color: theme.colors.onSurface, marginBottom: 16 }]}>RSVP</Text>
                    <View style={styles.rsvpOptions}>
                        {['Going', 'Maybe', 'No'].map(opt => (
                            <TouchableOpacity
                                key={opt}
                                style={[styles.rsvpOption, { borderColor: theme.colors.divider, borderWidth: 1.5 }]}
                            >
                                <Text style={[theme.typography.body, { color: theme.colors.onSurface, fontWeight: '600' }]}>{opt}</Text>
                            </TouchableOpacity>
                        ))}
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
        paddingBottom: 14,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: { padding: 16 },
    card: {
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
    },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        alignSelf: 'flex-start',
        gap: 5,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 14,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    linkBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 14,
    },
    meetActions: {
        flexDirection: 'row',
        gap: 10,
    },
    joinButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 12,
        borderRadius: 14,
    },
    joinButtonText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 14,
    },
    copyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 14,
        borderWidth: 1.5,
    },
    rsvpOptions: {
        flexDirection: 'row',
        gap: 10,
    },
    rsvpOption: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
    },
});
