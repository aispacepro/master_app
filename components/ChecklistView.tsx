import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Check, Square, CheckSquare, Plus, X, User, Headphones } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { ChecklistItem } from '@/types/order';
import { ActionButton } from '@/components/ActionButton';

interface ChecklistViewProps {
  items: ChecklistItem[];
  onToggle: (itemId: string, completed: boolean) => void;
  onAddItem?: (title: string) => void;
  onRemoveItem?: (itemId: string) => void;
  allowAddItems?: boolean;
}

export function ChecklistView({ 
  items, 
  onToggle, 
  onAddItem, 
  onRemoveItem, 
  allowAddItems = false 
}: ChecklistViewProps) {
  const [newItemText, setNewItemText] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);
  
  const completedCount = items.filter(item => item.completed).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;
  
  const dispatcherItems = items.filter(item => item.addedBy === 'dispatcher');
  const masterItems = items.filter(item => item.addedBy === 'master');
  
  const handleAddItem = () => {
    if (newItemText.trim() && onAddItem) {
      onAddItem(newItemText.trim());
      setNewItemText('');
      setIsAddingItem(false);
    }
  };
  
  const handleRemoveItem = (itemId: string) => {
    if (onRemoveItem) {
      onRemoveItem(itemId);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Чек-лист работ</Text>
        <Text style={styles.progress}>{completedCount} из {items.length}</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {dispatcherItems.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Headphones size={16} color={Colors.primary} />
              <Text style={styles.sectionTitle}>От диспетчера</Text>
            </View>
            {dispatcherItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.item}
                onPress={() => onToggle(item.id, !item.completed)}
                activeOpacity={0.7}
              >
                {item.completed ? (
                  <CheckSquare size={24} color={Colors.success} />
                ) : (
                  <Square size={24} color={Colors.text.secondary} />
                )}
                <Text style={[
                  styles.itemText,
                  item.completed && styles.completedText,
                ]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        {masterItems.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <User size={16} color={Colors.warning} />
              <Text style={styles.sectionTitle}>Добавлено мастером</Text>
            </View>
            {masterItems.map((item) => (
              <View key={item.id} style={styles.masterItemContainer}>
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => onToggle(item.id, !item.completed)}
                  activeOpacity={0.7}
                >
                  {item.completed ? (
                    <CheckSquare size={24} color={Colors.success} />
                  ) : (
                    <Square size={24} color={Colors.text.secondary} />
                  )}
                  <Text style={[
                    styles.itemText,
                    item.completed && styles.completedText,
                  ]}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveItem(item.id)}
                >
                  <X size={16} color={Colors.danger} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        
        {allowAddItems && (
          <View style={styles.addSection}>
            {isAddingItem ? (
              <View style={styles.addItemForm}>
                <TextInput
                  style={styles.addItemInput}
                  value={newItemText}
                  onChangeText={setNewItemText}
                  placeholder="Введите новый пункт..."
                  placeholderTextColor={Colors.text.light}
                  autoFocus
                  multiline
                />
                <View style={styles.addItemActions}>
                  <ActionButton
                    title="Отмена"
                    onPress={() => {
                      setIsAddingItem(false);
                      setNewItemText('');
                    }}
                    variant="secondary"
                    size="medium"
                  />
                  <ActionButton
                    title="Добавить"
                    onPress={handleAddItem}
                    variant="success"
                    size="medium"
                    disabled={!newItemText.trim()}
                    icon={<Check size={16} color={Colors.white} />}
                  />
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setIsAddingItem(true)}
              >
                <Plus size={20} color={Colors.primary} />
                <Text style={styles.addButtonText}>Добавить пункт</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  progress: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 3,
  },
  list: {
    maxHeight: 300,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    color: Colors.text.primary,
    flex: 1,
  },
  completedText: {
    color: Colors.text.secondary,
    textDecorationLine: 'line-through',
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  masterItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
  addSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.primary + '10',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
  },
  addItemForm: {
    gap: 12,
  },
  addItemInput: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 44,
    textAlignVertical: 'top',
  },
  addItemActions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
});