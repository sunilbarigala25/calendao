import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const NoteDetailScreen: React.FC<any> = ({ navigation, route }) => {
    const { item } = route.params;
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor: theme.colors.surface }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
                </TouchableOpacity>
                <Text style={[theme.typography.h3, { color: theme.colors.onSurface }]}>Note</Text>
                <TouchableOpacity style={styles.saveButton}>
                    <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.card, { backgroundColor: theme.colors.surface, ...theme.shadows.medium }]}>
                    <View style={[styles.typeBadge, { backgroundColor: '#5856D6' }]}>
                        <Ionicons name="document-text" size={16} color="#FFF" />
                        <Text style={styles.badgeText}>NOTE</Text>
                    </View>

                    <TextInput
                        style={[theme.typography.h1, { color: theme.colors.onSurface, marginTop: 16 }]}
                        defaultValue={item.payload.title}
                        placeholder="Title"
                        placeholderTextColor={theme.colors.onSurfaceVariant}
                    />

                    <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />

                    <TextInput
                        style={[theme.typography.body, { color: theme.colors.onSurface, minHeight: 200, textAlignVertical: 'top' }]}
                        defaultValue={item.payload.content || item.payload.description || ''}
                        placeholder="Start typing your thoughts..."
                        placeholderTextColor={theme.colors.onSurfaceVariant}
                        multiline
                    />
                </View>

                <Text style={[theme.typography.caption, { color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 12 }]}>
                    Last edited on {item.date}
                </Text>
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
    saveButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    content: { padding: 20 },
    card: {
        borderRadius: 24,
        padding: 24,
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
    divider: {
        height: 1,
        marginVertical: 16,
    }
});
