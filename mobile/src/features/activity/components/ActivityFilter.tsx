import { cn } from '@/shared/utils/cn';
import { ActivityFilter } from '../types';
import { Pressable, Text, View } from 'react-native';

type Props = {
    value: ActivityFilter;
    onChange: (value: ActivityFilter) => void;
};

const filters: ActivityFilter[] = ['ALL', 'PERSONAL', 'GROUP', 'SETTLEMENT'];

export const ActivityFilterTabs = ({ value, onChange }: Props) => {
    return (
        <View className="flex-row bg-card rounded-2xl p-1 mb-3">
            {filters.map(filter => {
                const active = value === filter;

                return (
                    <Pressable
                        key={filter}
                        onPress={() => onChange(filter)}
                        className={cn(
                            'flex-1 py-2 rounded-xl items-center',
                            active ? 'bg-primary' : ''
                        )}
                    >
                        <Text
                            className={cn(
                                'text-sm font-semibold',
                                active ? 'text-white' : 'text-text'
                            )}
                        >
                            {filter === 'ALL'
                                ? 'All'
                                : filter === 'PERSONAL'
                                    ? 'Personal'
                                    : filter === 'GROUP'
                                        ? 'Group'
                                        : 'Settlement'
                            }
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
};
