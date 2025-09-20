import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { X, CheckCircle, Users } from 'lucide-react-native';
import { useDispatcher } from '@/hooks/useDispatcherStore';
import { DispatcherOrder } from '@/types/order';
import MasterCard from '@/components/MasterCard';

interface AssignMasterModalProps {
  visible: boolean;
  order: DispatcherOrder | null;
  onClose: () => void;
}

export default function AssignMasterModal({ visible, order, onClose }: AssignMasterModalProps) {
  const { availableMasters, assignOrderToMaster } = useDispatcher();
  const [selectedMasterId, setSelectedMasterId] = useState<string | null>(null);

  const handleAssign = () => {
    if (!order || !selectedMasterId) return;

    Alert.alert(
      'Назначить мастера',
      'Вы уверены, что хотите назначить этого мастера на заказ?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Назначить',
          onPress: () => {
            assignOrderToMaster(order.id, selectedMasterId);
            setSelectedMasterId(null);
            onClose();
          },
        },
      ]
    );
  };

  const handleClose = () => {
    setSelectedMasterId(null);
    onClose();
  };

  if (!order) return null;

  const suitableMasters = availableMasters.filter(master =>
    master.specialties.some(specialty => 
      order.serviceType.toLowerCase().includes(specialty.toLowerCase()) ||
      specialty.toLowerCase().includes(order.serviceType.toLowerCase())
    )
  );

  const otherMasters = availableMasters.filter(master =>
    !master.specialties.some(specialty => 
      order.serviceType.toLowerCase().includes(specialty.toLowerCase()) ||
      specialty.toLowerCase().includes(order.serviceType.toLowerCase())
    )
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Назначить мастера</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.orderInfo}>
          <Text style={styles.orderTitle}>{order.serviceType}</Text>
          <Text style={styles.orderClient}>{order.clientName}</Text>
          <Text style={styles.orderAddress}>{order.address}</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {suitableMasters.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Users size={20} color="#4CAF50" />
                <Text style={styles.sectionTitle}>Подходящие мастера</Text>
              </View>
              {suitableMasters.map(master => (
                <MasterCard
                  key={master.id}
                  master={master}
                  isSelected={selectedMasterId === master.id}
                  onPress={() => setSelectedMasterId(master.id)}
                />
              ))}
            </View>
          )}

          {otherMasters.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Users size={20} color="#666" />
                <Text style={styles.sectionTitle}>Другие доступные мастера</Text>
              </View>
              {otherMasters.map(master => (
                <MasterCard
                  key={master.id}
                  master={master}
                  isSelected={selectedMasterId === master.id}
                  onPress={() => setSelectedMasterId(master.id)}
                />
              ))}
            </View>
          )}

          {availableMasters.length === 0 && (
            <View style={styles.emptyState}>
              <Users size={48} color="#ccc" />
              <Text style={styles.emptyTitle}>Нет доступных мастеров</Text>
              <Text style={styles.emptyText}>
                Все мастера заняты или не в сети. Попробуйте позже.
              </Text>
            </View>
          )}
        </ScrollView>

        {selectedMasterId && (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.assignButton} onPress={handleAssign}>
              <CheckCircle size={20} color="#fff" />
              <Text style={styles.assignButtonText}>Назначить мастера</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  orderInfo: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  orderClient: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2,
  },
  orderAddress: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  assignButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  assignButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});