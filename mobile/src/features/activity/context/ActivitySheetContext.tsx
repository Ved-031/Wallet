import * as Haptics from 'expo-haptics';
import dayjs from '@/shared/utils/dayjs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/shared/constants/colors';
import { ActivityUI } from '@/features/activity/types';
import { formatCurrency } from '@/shared/utils/currency';
import { Text, View, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { createContext, useContext, useRef, useState, useCallback } from 'react';

type SheetHandlers = {
    onEdit?: (item: ActivityUI) => void;
    onDelete?: (item: ActivityUI) => void;
};

type ContextType = {
    openSheet: (item: ActivityUI, handlers?: SheetHandlers) => void;
};

const ActivitySheetContext = createContext<ContextType>({ openSheet: () => { } });

export const useActivitySheet = () => useContext(ActivitySheetContext);

export function ActivitySheetProvider({ children }: { children: React.ReactNode }) {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [selectedItem, setSelectedItem] = useState<ActivityUI | null>(null);

    const handlersRef = useRef<SheetHandlers>({});

    const openSheet = useCallback((item: ActivityUI, handlers?: SheetHandlers) => {
        Haptics.selectionAsync();
        setSelectedItem(item);
        handlersRef.current = handlers ?? {};
        bottomSheetRef.current?.expand();
    }, []);

    const closeSheet = useCallback(() => {
        bottomSheetRef.current?.close();
    }, []);

    const handleEdit = useCallback(() => {
        closeSheet();
        if (selectedItem) handlersRef.current.onEdit?.(selectedItem);
    }, [selectedItem, closeSheet]);

    const handleDelete = useCallback(() => {
        closeSheet();
        if (selectedItem) handlersRef.current.onDelete?.(selectedItem);
    }, [selectedItem, closeSheet]);

    const icon = selectedItem
        ? selectedItem.type === 'GROUP'
            ? 'people-outline'
            : selectedItem.type === 'SETTLEMENT'
                ? 'swap-horizontal-outline'
                : 'receipt-outline'
        : 'receipt-outline';

    return (
        <ActivitySheetContext.Provider value={{ openSheet }}>
            {children}

            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={['45%']}
                enablePanDownToClose
                enableDynamicSizing={false}
                backgroundStyle={{
                    backgroundColor: COLORS.card,
                    borderRadius: 35,
                    borderWidth: 2,
                    borderColor: COLORS.border,
                }}
            >
                <BottomSheetView style={{ flex: 1, padding: 24 }}>
                    {selectedItem && (
                        <>
                            {/* Header */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
                                <View style={{
                                    width: 44, height: 44, borderRadius: 22,
                                    backgroundColor: COLORS.border + '40',
                                    alignItems: 'center', justifyContent: 'center',
                                    marginRight: 12,
                                }}>
                                    <Ionicons name={icon} size={22} color={COLORS.text} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: '700' }}>
                                        {selectedItem.title}
                                    </Text>
                                    <Text style={{ color: COLORS.textLight, fontSize: 12, marginTop: 2 }}>
                                        {dayjs(selectedItem.createdAt).format('DD MMM YYYY, hh:mm A')}
                                    </Text>
                                </View>
                                {selectedItem.amount !== undefined && (
                                    <Text style={{
                                        fontSize: 18, fontWeight: '800',
                                        color: selectedItem.direction === 'out' ? COLORS.expense : COLORS.income,
                                    }}>
                                        {selectedItem.direction === 'out' ? '-' : '+'}{formatCurrency(selectedItem.amount)}
                                    </Text>
                                )}
                            </View>

                            {/* Details */}
                            <View style={{
                                backgroundColor: '#F5ECE6',
                                borderRadius: 16,
                                padding: 16,
                                gap: 12,
                                marginBottom: 24,
                            }}>
                                <DetailRow label="Type" value={selectedItem.type.toLowerCase()} />
                                <DetailRow
                                    label="Direction"
                                    value={selectedItem.direction === 'out' ? 'Expense' : 'Income'}
                                />
                                <DetailRow
                                    label="Date"
                                    value={dayjs(selectedItem.createdAt).format('DD MMM YYYY')}
                                />
                                <DetailRow
                                    label="Time"
                                    value={dayjs(selectedItem.createdAt).format('hh:mm A')}
                                />
                            </View>

                            {/* Actions */}
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                <TouchableOpacity
                                    onPress={handleEdit}
                                    className='flex-1 flex-row items-center justify-center gap-2 py-[14px] rounded-2xl bg-primary'
                                >
                                    <Ionicons name="pencil" size={18} color={COLORS.white} />
                                    <Text className='text-white text-[15px] font-semibold'>
                                        Edit
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={handleDelete}
                                    style={{
                                        flex: 1, flexDirection: 'row',
                                        alignItems: 'center', justifyContent: 'center',
                                        gap: 8, paddingVertical: 14,
                                        borderRadius: 14,
                                        backgroundColor: COLORS.expense + '15',
                                    }}
                                >
                                    <Ionicons name="trash-outline" size={18} color={COLORS.expense} />
                                    <Text style={{ color: COLORS.expense, fontSize: 15, fontWeight: '600' }}>
                                        Delete
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </BottomSheetView>
            </BottomSheet>
        </ActivitySheetContext.Provider>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: COLORS.textLight, fontSize: 13 }}>{label}</Text>
            <Text style={{ color: COLORS.text, fontSize: 13, fontWeight: '600', textTransform: 'capitalize' }}>{value}</Text>
        </View>
    );
}
