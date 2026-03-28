import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BarChart3, Users, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react-native';
import { useDispatcher } from '@/hooks/useDispatcherStore';

export default function DispatcherStatsScreen() {
  const { getOrdersStats, masters, allOrders } = useDispatcher();
  const stats = getOrdersStats();

  const onlineMasters = masters.filter(m => m.isOnline).length;
  const availableMasters = masters.filter(m => m.isOnline && m.currentOrders < m.maxOrders).length;
  
  const todayRevenue = allOrders
    .filter(order => {
      const today = new Date().toDateString();
      return new Date(order.createdAt).toDateString() === today && order.status === 'completed';
    })
    .reduce((sum, order) => sum + (order.paymentAmount || 0), 0);

  const avgOrderValue = allOrders.length > 0 
    ? allOrders.reduce((sum, order) => sum + (order.paymentAmount || 0), 0) / allOrders.length 
    : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <BarChart3 size={24} color="#2196F3" />
        <Text style={styles.title}>Статистика диспетчера</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <AlertCircle size={24} color="#FF8C00" />
          </View>
          <Text style={styles.statValue}>{stats.pending}</Text>
          <Text style={styles.statLabel}>Ожидают</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Clock size={24} color="#2196F3" />
          </View>
          <Text style={styles.statValue}>{stats.inProgress}</Text>
          <Text style={styles.statLabel}>В работе</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <CheckCircle size={24} color="#4CAF50" />
          </View>
          <Text style={styles.statValue}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Завершено</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <TrendingUp size={24} color="#9C27B0" />
          </View>
          <Text style={styles.statValue}>{stats.todayTotal}</Text>
          <Text style={styles.statLabel}>Сегодня</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Мастера</Text>
        <View style={styles.mastersStats}>
          <View style={styles.masterStatItem}>
            <Users size={20} color="#4CAF50" />
            <Text style={styles.masterStatValue}>{onlineMasters}</Text>
            <Text style={styles.masterStatLabel}>Онлайн</Text>
          </View>
          <View style={styles.masterStatItem}>
            <Users size={20} color="#2196F3" />
            <Text style={styles.masterStatValue}>{availableMasters}</Text>
            <Text style={styles.masterStatLabel}>Доступны</Text>
          </View>
          <View style={styles.masterStatItem}>
            <Users size={20} color="#666" />
            <Text style={styles.masterStatValue}>{masters.length}</Text>
            <Text style={styles.masterStatLabel}>Всего</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Финансы</Text>
        <View style={styles.financeStats}>
          <View style={styles.financeItem}>
            <Text style={styles.financeLabel}>Выручка сегодня</Text>
            <Text style={styles.financeValue}>{todayRevenue.toLocaleString('ru-RU')} ₽</Text>
          </View>
          <View style={styles.financeItem}>
            <Text style={styles.financeLabel}>Средний чек</Text>
            <Text style={styles.financeValue}>{Math.round(avgOrderValue).toLocaleString('ru-RU')} ₽</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Топ мастера</Text>
        {masters
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3)
          .map((master, index) => (
            <View key={master.id} style={styles.topMasterItem}>
              <View style={styles.topMasterRank}>
                <Text style={styles.rankNumber}>{index + 1}</Text>
              </View>
              <View style={styles.topMasterInfo}>
                <Text style={styles.topMasterName}>{master.name}</Text>
                <Text style={styles.topMasterRating}>⭐ {master.rating} ({master.completedOrders} заказов)</Text>
              </View>
              <View style={[styles.topMasterStatus, { 
                backgroundColor: master.isOnline ? '#4CAF50' : '#FF4444' 
              }]}>
                <Text style={styles.topMasterStatusText}>
                  {master.isOnline ? 'Онлайн' : 'Офлайн'}
                </Text>
              </View>
            </View>
          ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  mastersStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  masterStatItem: {
    alignItems: 'center',
    gap: 4,
  },
  masterStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  masterStatLabel: {
    fontSize: 12,
    color: '#666',
  },
  financeStats: {
    gap: 12,
  },
  financeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  financeLabel: {
    fontSize: 16,
    color: '#666',
  },
  financeValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
  },
  topMasterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  topMasterRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  topMasterInfo: {
    flex: 1,
  },
  topMasterName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  topMasterRating: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  topMasterStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  topMasterStatusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});