import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, MapPin, User, AlertCircle, CheckCircle, Play } from 'lucide-react-native';
import { DispatcherOrder } from '@/types/order';

interface DispatcherOrderCardProps {
  order: DispatcherOrder;
  onPress: () => void;
  onAssign?: () => void;
}

export default function DispatcherOrderCard({ order, onPress, onAssign }: DispatcherOrderCardProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#FF4444';
      case 'medium': return '#FF8C00';
      case 'low': return '#4CAF50';
      default: return '#666';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FF8C00';
      case 'in_progress': return '#2196F3';
      case 'completed': return '#4CAF50';
      default: return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return AlertCircle;
      case 'in_progress': return Play;
      case 'completed': return CheckCircle;
      default: return AlertCircle;
    }
  };

  const StatusIcon = getStatusIcon(order.status);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          <StatusIcon size={16} color={getStatusColor(order.status)} />
          <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
            {order.status === 'pending' ? 'Ожидает' : 
             order.status === 'in_progress' ? 'В работе' : 'Завершен'}
          </Text>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(order.priority) }]}>
          <Text style={styles.priorityText}>
            {order.priority === 'high' ? 'Высокий' : 
             order.priority === 'medium' ? 'Средний' : 'Низкий'}
          </Text>
        </View>
      </View>

      <Text style={styles.serviceType}>{order.serviceType}</Text>
      
      <View style={styles.infoRow}>
        <User size={16} color="#666" />
        <Text style={styles.clientName}>{order.clientName}</Text>
      </View>

      <View style={styles.infoRow}>
        <MapPin size={16} color="#666" />
        <Text style={styles.address} numberOfLines={1}>{order.address}</Text>
      </View>

      <View style={styles.timeContainer}>
        <View style={styles.timeRow}>
          <Clock size={16} color="#666" />
          <Text style={styles.timeText}>
            {formatDate(order.scheduledTime)} в {formatTime(order.scheduledTime)}
          </Text>
        </View>
        <Text style={styles.duration}>{order.estimatedDuration}ч</Text>
      </View>

      {order.masterName && (
        <View style={styles.masterContainer}>
          <Text style={styles.masterLabel}>Мастер:</Text>
          <Text style={styles.masterName}>{order.masterName}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.amount}>{order.paymentAmount?.toLocaleString('ru-RU')} ₽</Text>
        {order.status === 'pending' && onAssign && (
          <TouchableOpacity 
            style={styles.assignButton} 
            onPress={(e) => {
              e.stopPropagation();
              onAssign();
            }}
          >
            <Text style={styles.assignButtonText}>Назначить</Text>
          </TouchableOpacity>
        )}
      </View>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  serviceType: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  address: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  duration: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
  masterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  masterLabel: {
    fontSize: 14,
    color: '#666',
  },
  masterName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
  },
  assignButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  assignButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});