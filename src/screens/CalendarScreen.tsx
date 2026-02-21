import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Animated,
    Dimensions,
    Platform
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import { formatDate, parseDate, isToday, getWeekDates } from '../utils/dateUtils';
import { FloatingActionButton } from '../components/fab/FloatingActionButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { addDays, subDays, addYears, subYears } from 'date-fns';
import { useSystemTime } from '../hooks/useSystemTime';
import { useAuth } from '../contexts/AuthContext';
import { useCalendar } from '../contexts/CalendarContext';

const { width } = Dimensions.get('window');

// Universal icon map — single source of truth
const ICON_MAP: Record<string, string> = {
    event: 'star',
    todo: 'checkbox',
    reminder: 'notifications',
    note: 'document-text',
};

export const CalendarScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const { theme, colorMode, themeType } = useTheme();
    const { user } = useAuth();
    const { getItemsByDate } = useCalendar();
    const insets = useSafeAreaInsets();
    const systemTime = useSystemTime();

    const [selectedDate, setSelectedDate] = useState(systemTime.fullDate);
    const [viewMode, setViewMode] = useState<'today' | 'week' | 'month'>('today');

    const pastelColors = [
        '#E3F2FD', '#E8F5E9', '#FFF3E0', '#FCE4EC',
        '#F3E5F5', '#EFEBE9', '#F1F8E9', '#FFFDE7',
        '#E0F2F1', '#E8EAF6', '#F9FBE7', '#FFF8E1'
    ];

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const weekDates = getWeekDates(parseDate(selectedDate));
    const currentYear = parseDate(selectedDate).getFullYear();

    const getContrastColor = (hexColor: string) => {
        const hex = hexColor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.6 ? '#1C1B1F' : '#FFFFFF';
    };

    const getItemColor = (item: any) => {
        const type = item.type;
        if (user?.categoryColors && user.categoryColors[type as keyof typeof user.categoryColors]) {
            return user.categoryColors[type as keyof typeof user.categoryColors];
        }
        const defaults: Record<string, string> = {
            event: '#EADDFF',
            todo: '#C8E6C9',
            note: '#F3E5F5',
            reminder: '#FFF3E0'
        };
        return defaults[type] || '#F5F5F5';
    };

    const dayItems = getItemsByDate(selectedDate);
    const displayEvents = dayItems;

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getPrioritizedIcons = (dateStr: string) => {
        const items = getItemsByDate(dateStr);
        if (items.length === 0) return [];
        const counts: Record<string, number> = {};
        items.forEach(item => {
            counts[item.type] = (counts[item.type] || 0) + 1;
        });
        return Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    };

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const weekScrollRef = useRef<ScrollView>(null);

    useEffect(() => {
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();

        if (viewMode === 'week' && weekScrollRef.current) {
            const dateIndex = weekDates.findIndex(d => formatDate(d) === selectedDate);
            if (dateIndex !== -1) {
                const scrollX = (dateIndex * 112) + 50 - (width / 2) + 56;
                weekScrollRef.current.scrollTo({ x: Math.max(0, scrollX), animated: true });
            }
        }
    }, [viewMode, selectedDate]);

    const goToPrev = () => {
        const d = parseDate(selectedDate);
        if (viewMode === 'today') setSelectedDate(formatDate(subDays(d, 1)));
        else if (viewMode === 'week') setSelectedDate(formatDate(subDays(d, 7)));
        else if (viewMode === 'month') setSelectedDate(formatDate(subYears(d, 1)));
    };

    const goToNext = () => {
        const d = parseDate(selectedDate);
        if (viewMode === 'today') setSelectedDate(formatDate(addDays(d, 1)));
        else if (viewMode === 'week') setSelectedDate(formatDate(addDays(d, 7)));
        else if (viewMode === 'month') setSelectedDate(formatDate(addYears(d, 1)));
    };

    const isShowingToday = selectedDate === systemTime.fullDate;

    const systemYear = new Date().getFullYear();
    const currentMonthIndex = new Date().getMonth();

    // Present month first, then sequential order for remaining months
    const sortedMonths = currentYear === systemYear
        ? [
            { name: months[currentMonthIndex], index: currentMonthIndex },
            ...Array.from({ length: 11 }, (_, i) => {
                const idx = (currentMonthIndex + 1 + i) % 12;
                return { name: months[idx], index: idx };
            })
        ]
        : months.map((name, index) => ({ name, index }));

    // Format display time from systemTime
    const displayHour = systemTime.displayTime;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Content Area */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: 10,
                    paddingBottom: insets.bottom + 200,
                }}
            >
                {/* ── TODAY VIEW ── */}
                {viewMode === 'today' && (
                    <Animated.View style={[styles.todayContent, { opacity: fadeAnim }]}>
                        {/* Primary Tile */}
                        {isShowingToday && (
                            <View style={[
                                styles.primaryTile,
                                { backgroundColor: theme.colors.surface },
                                themeType === 'glass' && { backgroundColor: 'rgba(255,255,255,0.4)' },
                                theme.shadows.medium,
                            ]}>
                                {/* Left Status Strip */}
                                <View style={styles.tileLeftStrip}>
                                    <View style={[styles.statusIconBox, { backgroundColor: '#C8E6C9' }]}>
                                        <Ionicons name="checkmark" size={16} color="#2E7D32" />
                                    </View>
                                    <View style={styles.categoryIconColumn}>
                                        {getPrioritizedIcons(systemTime.fullDate).slice(0, 3).map((type, idx) => (
                                            <View key={type} style={[styles.miniIconCircle, { backgroundColor: getItemColor({ type }), marginTop: idx === 0 ? 0 : 8 }]}>
                                                <Ionicons
                                                    name={ICON_MAP[type] as any}
                                                    size={12}
                                                    color={getContrastColor(getItemColor({ type }))}
                                                />
                                            </View>
                                        ))}
                                        {getPrioritizedIcons(systemTime.fullDate).length === 0 && (
                                            <View style={[styles.miniIconCircle, { backgroundColor: '#F5F5F5' }]}>
                                                <Ionicons name="sunny" size={12} color="#9E9E9E" />
                                            </View>
                                        )}
                                    </View>
                                </View>

                                {/* Center Info */}
                                <View style={styles.tileMainContent}>
                                    <View style={styles.tileDateRow}>
                                        <Text style={[styles.largeDateText, { color: theme.colors.onSurface }]}>
                                            {systemTime.date}
                                        </Text>
                                        <Text style={[styles.dateSuffix, { color: theme.colors.onSurface }]}>th</Text>
                                    </View>
                                    <Text style={[styles.dayNameText, { color: theme.colors.onSurface }]}>
                                        {systemTime.dayName}
                                    </Text>
                                    <View style={styles.tileBottomRow}>
                                        <View style={styles.timeDisplay}>
                                            <Text style={[styles.timeText, { color: theme.colors.onSurface }]}>{displayHour}</Text>
                                            <Text style={[styles.ampmSmall, { color: theme.colors.onSurfaceVariant }]}>{systemTime.ampm}</Text>
                                        </View>
                                        <Text style={[styles.monthLabel, { color: theme.colors.onSurfaceVariant }]}>
                                            {systemTime.monthName.toUpperCase()}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Section Header */}
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionLabelWrapper}>
                                <View style={[styles.sectionIndicator, { backgroundColor: theme.colors.primary }]} />
                                <Text style={[theme.typography.h3, { color: theme.colors.onSurface }]}>
                                    {isShowingToday ? 'Today\'s Schedule' : parseDate(selectedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}
                                </Text>
                            </View>
                            {!isShowingToday && (
                                <Text style={[theme.typography.bodySmall, { color: theme.colors.onSurfaceVariant }]}>
                                    {parseDate(selectedDate).toLocaleDateString('en-US', { weekday: 'long' })}
                                </Text>
                            )}
                        </View>

                        {/* Schedule Items */}
                        {displayEvents.length > 0 ? (
                            displayEvents.map((item: any) => {
                                const itemColor = getItemColor(item);
                                const contrastColor = getContrastColor(itemColor);
                                const timeLabel = item.payload.allDay
                                    ? 'All Day'
                                    : item.payload.startTime || item.payload.time || '—';
                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={[styles.scheduleItem, { backgroundColor: itemColor }, theme.shadows.small]}
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            const screenMap: Record<string, string> = {
                                                event: 'EventDetail',
                                                note: 'NoteDetail',
                                                reminder: 'ReminderDetail',
                                                todo: 'TodoDetail'
                                            };
                                            navigation.navigate(screenMap[item.type], { item });
                                        }}
                                    >
                                        <View style={styles.itemTimeSection}>
                                            <Text style={[styles.itemTimeMain, { color: contrastColor }]}>{timeLabel}</Text>
                                            {item.payload.endTime && !item.payload.allDay && (
                                                <Text style={[styles.itemTimeSub, { color: contrastColor + '99' }]}>
                                                    → {item.payload.endTime}
                                                </Text>
                                            )}
                                        </View>
                                        <View style={[styles.itemDivider, { backgroundColor: contrastColor + '33' }]} />
                                        <View style={[styles.itemIconCircle, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
                                            <Ionicons
                                                name={ICON_MAP[item.type] as any}
                                                size={18}
                                                color={itemColor}
                                            />
                                        </View>
                                        <Text style={[styles.itemTitle, { color: contrastColor }]} numberOfLines={1}>
                                            {item.payload.title}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emojiText}>😊</Text>
                                <Text style={[theme.typography.h3, { color: theme.colors.onSurface, textAlign: 'center' }]}>
                                    Have a great day!
                                </Text>
                                <Text style={[theme.typography.body, { color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 8 }]}>
                                    No events planned for {isShowingToday ? 'today' : 'this day'}.
                                </Text>
                            </View>
                        )}
                    </Animated.View>
                )}

                {/* ── WEEK VIEW ── */}
                {viewMode === 'week' && (
                    <View style={styles.weekContent}>
                        <Text style={[theme.typography.h2, { color: theme.colors.onSurface, marginBottom: 16 }]}>
                            {parseDate(selectedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </Text>

                        {/* Horizontal day strip */}
                        <ScrollView
                            ref={weekScrollRef}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.weekScrollContent}
                        >
                            <View style={{ width: width / 2 - 56 }} />
                            {weekDates.map((date) => {
                                const dateStr = formatDate(date);
                                const isTodayDate = isToday(date);
                                const isSelected = selectedDate === dateStr;
                                const prioritizedTypes = getPrioritizedIcons(dateStr);
                                return (
                                    <TouchableOpacity
                                        key={dateStr}
                                        activeOpacity={0.85}
                                        onPress={() => setSelectedDate(dateStr)}
                                        style={[
                                            styles.weekDayColumn,
                                            { backgroundColor: theme.colors.surface },
                                            theme.shadows.small,
                                            isSelected && { borderWidth: 2, borderColor: theme.colors.primary },
                                            isTodayDate && !isSelected && { backgroundColor: theme.colors.primaryContainer + '33' }
                                        ]}
                                    >
                                        <Text style={[theme.typography.caption, { color: isTodayDate ? theme.colors.primary : theme.colors.onSurfaceVariant, fontWeight: '800' }]}>
                                            {date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                                        </Text>
                                        <Text style={[theme.typography.h2, { color: isTodayDate ? theme.colors.primary : theme.colors.onSurface, fontSize: 30 }]}>
                                            {date.getDate()}
                                        </Text>
                                        <Text style={[theme.typography.caption, { color: theme.colors.onSurfaceVariant }]}>
                                            {date.toLocaleDateString('en-US', { month: 'short' })}
                                        </Text>

                                        {/* Event indicator icons */}
                                        <View style={styles.weekEventsPreview}>
                                            {prioritizedTypes.length > 0 ? (
                                                prioritizedTypes.slice(0, 3).map(type => (
                                                    <View key={type} style={[styles.weekIconCircle, { backgroundColor: getItemColor({ type }) + '44' }]}>
                                                        <Ionicons
                                                            name={ICON_MAP[type] as any}
                                                            size={9}
                                                            color={getItemColor({ type })}
                                                        />
                                                    </View>
                                                ))
                                            ) : (
                                                <Ionicons name="sunny-outline" size={12} color={theme.colors.onSurfaceVariant + '44'} />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                            <View style={{ width: width / 2 - 56 }} />
                        </ScrollView>

                        {/* Selected day detail */}
                        <View style={styles.weekDayDetail}>
                            <Text style={[theme.typography.h3, { color: theme.colors.onSurface, marginBottom: 16 }]}>
                                {parseDate(selectedDate).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </Text>
                            {dayItems.length > 0 ? (
                                dayItems.map(item => {
                                    const itemColor = getItemColor(item);
                                    const contrastColor = getContrastColor(itemColor);
                                    const timeLabel = item.payload.allDay
                                        ? 'All Day'
                                        : (item.payload as any).startTime || (item.payload as any).time || '—';
                                    return (
                                        <TouchableOpacity
                                            key={item.id}
                                            style={[styles.scheduleItem, { backgroundColor: itemColor }, theme.shadows.small]}
                                            activeOpacity={0.8}
                                            onPress={() => {
                                                const screenMap: Record<string, string> = {
                                                    event: 'EventDetail',
                                                    note: 'NoteDetail',
                                                    reminder: 'ReminderDetail',
                                                    todo: 'TodoDetail'
                                                };
                                                navigation.navigate(screenMap[item.type], { item });
                                            }}
                                        >
                                            <View style={styles.itemTimeSection}>
                                                <Text style={[styles.itemTimeMain, { color: contrastColor }]}>{timeLabel}</Text>
                                            </View>
                                            <View style={[styles.itemDivider, { backgroundColor: contrastColor + '33' }]} />
                                            <View style={[styles.itemIconCircle, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
                                                <Ionicons
                                                    name={ICON_MAP[item.type] as any}
                                                    size={18}
                                                    color={itemColor}
                                                />
                                            </View>
                                            <Text style={[styles.itemTitle, { color: contrastColor }]} numberOfLines={1}>
                                                {item.payload.title}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })
                            ) : (
                                <View style={[styles.emptyContainer, { marginTop: 16 }]}>
                                    <Text style={styles.emojiText}>😊</Text>
                                    <Text style={[theme.typography.body, { color: theme.colors.onSurfaceVariant, fontStyle: 'italic', textAlign: 'center' }]}>
                                        Nothing scheduled. Enjoy your day!
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}

                {/* ── MONTH VIEW ── */}
                {viewMode === 'month' && (
                    <View style={styles.monthContent}>
                        <View style={styles.yearHeader}>
                            <Text style={[theme.typography.h1, { color: theme.colors.onSurface, fontSize: 36, fontWeight: '800' }]}>
                                {currentYear}
                            </Text>
                        </View>
                        <View style={styles.monthGrid}>
                            {sortedMonths.map((m) => {
                                const daysInMonth = getDaysInMonth(currentYear, m.index);
                                const firstDay = new Date(currentYear, m.index, 1).getDay();
                                const isPresentMonth = m.index === currentMonthIndex && currentYear === systemYear;
                                const cardWidth = isPresentMonth ? '100%' : (width - 44) / 2;
                                const cardHeight = isPresentMonth ? 300 : 200;

                                return (
                                    <TouchableOpacity
                                        key={m.name}
                                        style={[
                                            styles.monthCard,
                                            {
                                                backgroundColor: isPresentMonth ? theme.colors.primaryContainer : pastelColors[m.index],
                                                width: cardWidth,
                                                minHeight: cardHeight,
                                                borderWidth: isPresentMonth ? 2.5 : 0,
                                                borderColor: theme.colors.primary,
                                            },
                                            theme.shadows.medium,
                                        ]}
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            const firstOfMonth = new Date(currentYear, m.index, 1);
                                            setSelectedDate(formatDate(firstOfMonth));
                                            setViewMode('today');
                                        }}
                                    >
                                        {/* Month header */}
                                        <View style={styles.monthCardHeader}>
                                            <Text style={[
                                                styles.monthCardTitle,
                                                {
                                                    color: isPresentMonth ? theme.colors.onPrimaryContainer : '#1C1B1F',
                                                    fontSize: isPresentMonth ? 22 : 16,
                                                }
                                            ]}>
                                                {m.name}
                                            </Text>
                                            {isPresentMonth && (
                                                <View style={[styles.presentBadge, { backgroundColor: theme.colors.primary }]}>
                                                    <Text style={styles.presentBadgeText}>NOW</Text>
                                                </View>
                                            )}
                                        </View>

                                        {/* Weekday headers */}
                                        <View style={styles.weekdayHeaderRow}>
                                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, idx) => (
                                                <Text
                                                    key={idx}
                                                    style={[
                                                        styles.miniWeekdayText,
                                                        {
                                                            color: isPresentMonth ? theme.colors.onPrimaryContainer + 'CC' : '#00000099',
                                                            flex: 1,
                                                            textAlign: 'center',
                                                        }
                                                    ]}
                                                >
                                                    {day}
                                                </Text>
                                            ))}
                                        </View>

                                        {/* Day grid */}
                                        <View style={styles.miniGrid}>
                                            {Array.from({ length: firstDay }).map((_, i) => (
                                                <View key={`pad-${i}`} style={styles.miniGridCell} />
                                            ))}
                                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                                const isTodayInGrid = isPresentMonth && (i + 1) === new Date().getDate();
                                                return (
                                                    <View
                                                        key={i}
                                                        style={[
                                                            styles.miniGridCell,
                                                            isTodayInGrid && { backgroundColor: theme.colors.primary, borderRadius: 6 },
                                                        ]}
                                                    >
                                                        <Text style={[
                                                            styles.miniGridText,
                                                            {
                                                                color: isTodayInGrid ? '#FFF' : isPresentMonth ? theme.colors.onPrimaryContainer + 'BB' : '#00000088',
                                                                fontWeight: isTodayInGrid ? '800' : '500',
                                                            }
                                                        ]}>
                                                            {i + 1}
                                                        </Text>
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Back to Today */}
            {!isShowingToday && (
                <TouchableOpacity
                    style={[
                        styles.backToToday,
                        {
                            bottom: insets.bottom + 175,
                            backgroundColor: theme.colors.primaryContainer,
                        },
                        theme.shadows.medium,
                    ]}
                    onPress={() => setSelectedDate(systemTime.fullDate)}
                >
                    <Ionicons name="today" size={18} color={theme.colors.onPrimaryContainer} />
                    <Text style={[theme.typography.caption, { color: theme.colors.onPrimaryContainer, marginLeft: 6, fontWeight: '800' }]}>
                        TODAY
                    </Text>
                </TouchableOpacity>
            )}

            {/* FAB — positioned above nav bar */}
            <FloatingActionButton selectedDate={selectedDate} />

            {/* Bottom Navigation Bar */}
            <View style={[
                styles.bottomNav,
                {
                    backgroundColor: themeType === 'glass' ? 'rgba(255,255,255,0.7)' : theme.colors.secondaryContainer + 'CC',
                    paddingBottom: insets.bottom + 16,
                    minHeight: 80 + insets.bottom,
                    borderTopWidth: 1,
                    borderTopColor: theme.colors.primary + '22',
                    overflow: 'hidden',
                },
                theme.shadows.large,
            ]}>
                {Platform.OS !== 'web' && (
                    <BlurView
                        intensity={60}
                        style={StyleSheet.absoluteFill}
                        tint={colorMode === 'dark' ? 'dark' : 'light'}
                    />
                )}
                <View style={styles.navControls}>
                    <TouchableOpacity onPress={goToPrev} style={[styles.navArrow, { backgroundColor: theme.colors.surface }]}>
                        <Ionicons name="chevron-back" size={22} color={theme.colors.onSurfaceVariant} />
                    </TouchableOpacity>

                    <View style={[styles.pillContainer, { backgroundColor: theme.colors.surface }]}>
                        {(['today', 'week', 'month'] as const).map(mode => (
                            <TouchableOpacity
                                key={mode}
                                style={[styles.pill, viewMode === mode && { backgroundColor: theme.colors.primary }]}
                                onPress={() => setViewMode(mode)}
                            >
                                <Text style={[styles.pillText, { color: viewMode === mode ? theme.colors.onPrimary : theme.colors.onSurfaceVariant }]}>
                                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity onPress={goToNext} style={[styles.navArrow, { backgroundColor: theme.colors.surface }]}>
                        <Ionicons name="chevron-forward" size={22} color={theme.colors.onSurfaceVariant} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1 },

    // Today view
    todayContent: { padding: 16 },
    primaryTile: {
        borderRadius: 28,
        padding: 24,
        height: 220,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    tileLeftStrip: {
        width: 56,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderRightWidth: 1,
        borderRightColor: '#00000008',
    },
    statusIconBox: {
        width: 34,
        height: 34,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryIconColumn: { alignItems: 'center' },
    miniIconCircle: {
        width: 26,
        height: 26,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tileMainContent: {
        flex: 1,
        paddingLeft: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tileDateRow: { flexDirection: 'row', alignItems: 'flex-start' },
    largeDateText: { fontSize: 100, fontWeight: '800', lineHeight: 100 },
    dateSuffix: { fontSize: 22, fontWeight: '700', marginTop: 14, marginLeft: 3 },
    dayNameText: { fontSize: 26, fontWeight: '700', marginTop: -8 },
    tileBottomRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 12,
        paddingHorizontal: 16,
    },
    timeDisplay: { flexDirection: 'row', alignItems: 'baseline' },
    timeText: { fontSize: 28, fontWeight: '800' },
    ampmSmall: { fontSize: 14, fontWeight: '600', marginLeft: 4 },
    monthLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 2 },

    // Section header
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 28,
        marginBottom: 14,
        paddingHorizontal: 4,
    },
    sectionLabelWrapper: { flexDirection: 'row', alignItems: 'center' },
    sectionIndicator: { width: 4, height: 22, borderRadius: 2, marginRight: 10 },

    // Schedule items (Day + Week detail — shared)
    scheduleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 20,
        marginBottom: 12,
    },
    itemTimeSection: { width: 60, alignItems: 'center' },
    itemTimeMain: { fontSize: 13, fontWeight: '800' },
    itemTimeSub: { fontSize: 10, fontWeight: '600', marginTop: 2 },
    itemDivider: { width: 1, height: 28, marginHorizontal: 10 },
    itemIconCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    itemTitle: { fontSize: 15, fontWeight: '700', flex: 1 },

    // Week view
    weekContent: { padding: 16 },
    weekScrollContent: { paddingRight: 32, paddingBottom: 8 },
    weekDayColumn: {
        width: 96,
        height: 140,
        borderRadius: 20,
        marginRight: 10,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    weekEventsPreview: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 3,
        marginTop: 6,
    },
    weekIconCircle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    weekDayDetail: {
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#00000008',
    },

    // Month view
    monthContent: { padding: 16 },
    yearHeader: { marginBottom: 20 },
    monthGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    monthCard: {
        padding: 16,
        borderRadius: 24,
        marginBottom: 4,
    },
    monthCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    monthCardTitle: {
        fontWeight: '800',
    },
    presentBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    presentBadgeText: {
        color: '#FFF',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    weekdayHeaderRow: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    miniWeekdayText: {
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 0.2,
    },
    miniGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    miniGridCell: {
        width: `${100 / 7}%` as any,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 1,
    },
    miniGridText: {
        fontSize: 9,
    },

    // Bottom nav
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingTop: 10,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        zIndex: 2000,
        elevation: 20,
    },
    navControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    navArrow: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pillContainer: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 24,
        padding: 4,
        marginHorizontal: 10,
    },
    pill: {
        flex: 1,
        paddingVertical: 9,
        borderRadius: 20,
        alignItems: 'center',
    },
    pillText: { fontSize: 13, fontWeight: '700' },

    // Empty state
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    emojiText: { fontSize: 44, marginBottom: 12 },

    // Back to today
    backToToday: {
        position: 'absolute',
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 24,
        zIndex: 100,
    },
});
