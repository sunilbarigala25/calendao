import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const TodoDetailScreen: React.FC<any> = ({ navigation, route }) => {
    const { item } = route.params;
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    // Mock checklist items for demonstration
    const [checklist, setChecklist] = useState([
        { id: '1', title: 'Prepare documents', completed: true },
        { id: '2', title: 'Call client', completed: false },
        { id: '3', title: 'Finalize draft', completed: false },
    ]);

    const toggleItem = (id: string) => {
        setChecklist(prev => prev.map(c => c.id === id ? { ...c, completed: !c.completed } : c));
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor: theme.colors.surface }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
                </TouchableOpacity>
                <Text style={[theme.typography.h3, { color: theme.colors.onSurface }]}>To-Do</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.card, { backgroundColor: theme.colors.surface, ...theme.shadows.medium }]}>
                    <View style={[styles.typeBadge, { backgroundColor: '#34C759' }]}>
                        <Ionicons name="checkbox" size={16} color="#FFF" />
                        <Text style={styles.badgeText}>TO-DO</Text>
                    </View>

                    <Text style={[theme.typography.h1, { color: theme.colors.onSurface, marginTop: 16 }]}>
                        {item.payload.title}
                    </Text>

                    <View style={styles.progressRow}>
                        <View style={[styles.progressBar, { backgroundColor: theme.colors.divider }]}>
                            <View style={[
                                styles.progressFill,
                                {
                                    backgroundColor: '#34C759',
                                    width: `${(checklist.filter(c => c.completed).length / checklist.length) * 100}%`
                                }
                            ]} />
                        </View>
                        <Text style={[theme.typography.caption, { color: theme.colors.onSurfaceVariant, marginLeft: 12 }]}>
                            {checklist.filter(c => c.completed).length}/{checklist.length} done
                        </Text>
                    </View>
                </View>

                <View style={styles.checklistSection}>
                    <Text style={[theme.typography.h3, { color: theme.colors.onSurface, marginBottom: 16 }]}>Checklist</Text>
                    {checklist.map(c => (
                        <TouchableOpacity
                            key={c.id}
                            onPress={() => toggleItem(c.id)}
                            style={[styles.checkItem, { backgroundColor: theme.colors.surface, ...theme.shadows.small }]}
                        >
                            <Ionicons
                                name={c.completed ? "checkbox" : "square-outline"}
                                size={24}
                                color={c.completed ? "#34C759" : theme.colors.onSurfaceVariant}
                            />
                            <Text style={[
                                theme.typography.body,
                                {
                                    color: theme.colors.onSurface,
                                    marginLeft: 12,
                                    textDecorationLine: c.completed ? 'line-through' : 'none',
                                    opacity: c.completed ? 0.6 : 1
                                }
                            ]}>
                                {c.title}
                            </Text>
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity style={[styles.addButton, { borderColor: theme.colors.primary, borderStyle: 'dashed', borderWidth: 1 }]}>
                        <Ionicons name="add" size={20} color={theme.colors.primary} />
                        <Text style={{ color: theme.colors.primary, fontWeight: '700', marginLeft: 8 }}>Add item</Text>
                    </TouchableOpacity>
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
        marginBottom: 24,
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
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    progressBar: {
        flex: 1,
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
    },
    checklistSection: {
        marginTop: 8,
    },
    checkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 16,
        marginTop: 8,
    }
});
