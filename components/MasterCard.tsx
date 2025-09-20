import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Star, User, Phone, CheckCircle, Clock } from 'lucide-react-native';
import { Master } from '@/types/order';

interface MasterCardProps {
  master: Master;
  onPress: () => void;
  isSelected?: boolean;
}

export default function MasterCard({ master, onPress, isSelected }: MasterCardProps) {
  const getAvailabilityColor = () => {
    if (!master.isOnline) return '#FF4444';
    if (master.currentOrders >= master.maxOrders) return '#FF8C00';
    return '#4CAF50';
  };

  const getAvailabilityText = () => {
    if (!master.isOnline) return 'Не в сети';
    if (master.currentOrders >= master.maxOrders) return 'Занят';
    return 'Доступен';
  };

  return (
    <TouchableOpacity 
      style={[
        styles.card,
        isSelected && styles.selectedCard,
        !master.isOnline && styles.offlineCard
      ]} 
      onPress={onPress} 
      activeOpacity={0.7}
      disabled={!master.isOnline || master.currentOrders >= master.maxOrders}
    >
      <View style={styles.header}>
        <View style={styles.nameContainer}>
          <User size={20} color="#333" />
          <Text style={styles.name}>{master.name}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getAvailabilityColor() }]}>
          <Text style={styles.statusText}>{getAvailabilityText()}</Text>
        </View>
      </View>

      <View style={styles.ratingContainer}>
        <Star size={16} color="#FFD700" fill="#FFD700" />
        <Text style={styles.rating}>{master.rating}</Text>
        <Text style={styles.completedOrders}>({master.completedOrders} заказов)</Text>
      </View>

      <View style={styles.workloadContainer}>
        <Clock size={16} color="#666" />
        <Text style={styles.workloadText}>
          {master.currentOrders}/{master.maxOrders} заказов
        </Text>
      </View>

      <View style={styles.specialtiesContainer}>
        <Text style={styles.specialtiesLabel}>Специализация:</Text>
        <View style={styles.specialtiesList}>
          {master.specialties.slice(0, 2).map((specialty) => (
            <View key={specialty} style={styles.specialtyBadge}>
              <Text style={styles.specialtyText}>{specialty}</Text>
            </View>
          ))}
          {master.specialties.length > 2 && (
            <Text style={styles.moreSpecialties}>+{master.specialties.length - 2}</Text>
          )}
        </View>
      </View>

      <View style={styles.contactContainer}>
        <Phone size={16} color="#666" />
        <Text style={styles.phone}>{master.phone}</Text>
      </View>

      {isSelected && (
        <View style={styles.selectedIndicator}>
          <CheckCircle size={20} color="#4CAF50" />
          <Text style={styles.selectedText}>Выбран</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#4CAF50',
    backgroundColor: '#f8fff8',
  },
  offlineCard: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  completedOrders: {
    fontSize: 14,
    color: '#666',
  },
  workloadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  workloadText: {
    fontSize: 14,
    color: '#666',
  },
  specialtiesContainer: {
    marginBottom: 12,
  },
  specialtiesLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  specialtiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  specialtyBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  specialtyText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
  moreSpecialties: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  phone: {
    fontSize: 14,
    color: '#666',
  },
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 8,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
  },
  selectedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
});