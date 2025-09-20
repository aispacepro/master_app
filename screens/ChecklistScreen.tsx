import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { ChecklistItem } from '@/types/order';
import { ChecklistView } from '@/components/ChecklistView';
import { ActionButton } from '@/components/ActionButton';

interface ChecklistScreenProps {
  orderTitle: string;
  items: ChecklistItem[];
  onToggle: (itemId: string, completed: boolean) => void;
  onAddItem: (title: string) => void;
  onRemoveItem: (itemId: string) => void;
  onComplete: () => void;
}

export function ChecklistScreen({
  orderTitle,
  items,
  onToggle,
  onAddItem,
  onRemoveItem,
  onComplete,
}: ChecklistScreenProps) {
  const allTasksCompleted = items.every(item => item.completed);
  const completedCount = items.filter(item => item.completed).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Заголовок с названием заказа */}
      <View style={styles.orderHeader}>
        <Text style={styles.orderTitle}>{orderTitle}</Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Чек-лист выполнения работ</Text>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Выполнено: {completedCount} из {items.length}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${items.length > 0 ? (completedCount / items.length) * 100 : 0}%` }
              ]} 
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ChecklistView
          items={items}
          onToggle={onToggle}
          onAddItem={onAddItem}
          onRemoveItem={onRemoveItem}
          allowAddItems={true}
        />
      </ScrollView>

      <View style={styles.footer}>
        {allTasksCompleted && items.length > 0 ? (
          <ActionButton
            title="Все задачи выполнены ✅"
            onPress={onComplete}
            variant="success"
            icon={<CheckCircle size={20} color={Colors.white} />}
          />
        ) : (
          <View style={styles.requirementNotice}>
            <Text style={styles.requirementText}>
              {items.length === 0 
                ? "⚙️ Добавьте пункты в чек-лист для продолжения"
                : "✅ Выполните все пункты чек-листа для продолжения"
              }
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  orderHeader: {
    backgroundColor: Colors.lightBlue,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  orderTitle: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  progressContainer: {
    gap: 8,
  },
  progressText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 4,
  },
  content: {
    flex: 1,
  },
  footer: {
    padding: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  requirementNotice: {
    backgroundColor: Colors.warning + '20',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  requirementText: {
    fontSize: 16,
    color: Colors.warning,
    textAlign: 'center',
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 100,
  },
});