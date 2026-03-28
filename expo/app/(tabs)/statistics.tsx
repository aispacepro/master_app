import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  TrendingUp,
  Calendar,
  Clock,
  DollarSign,
  Star,
  Package,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { mockStatistics } from '@/mocks/orderData';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        {icon}
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function StatisticsScreen() {
  const stats = mockStatistics;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Моя статистика</Text>
          <Text style={styles.subtitle}>Результаты вашей работы</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon={<Package size={24} color={Colors.primary} />}
            label="Заказов сегодня"
            value={stats.todayOrders.toString()}
            color={Colors.primary}
          />

          <StatCard
            icon={<Calendar size={24} color={Colors.success} />}
            label="Заказов за неделю"
            value={stats.weekOrders.toString()}
            color={Colors.success}
          />

          <StatCard
            icon={<TrendingUp size={24} color={Colors.warning} />}
            label="Заказов за месяц"
            value={stats.monthOrders.toString()}
            color={Colors.warning}
          />

          <StatCard
            icon={<DollarSign size={24} color={Colors.success} />}
            label="Заработано за месяц"
            value={`${(stats.totalEarnings / 1000).toFixed(0)}к ₽`}
            color={Colors.success}
          />

          <StatCard
            icon={<Clock size={24} color={Colors.primary} />}
            label="Среднее время"
            value={`${stats.averageTime} ч`}
            color={Colors.primary}
          />

          <StatCard
            icon={<Star size={24} color={Colors.warning} />}
            label="Рейтинг"
            value={stats.rating.toFixed(1)}
            color={Colors.warning}
          />
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Итоги месяца</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Выполнено заказов:</Text>
            <Text style={styles.summaryValue}>{stats.monthOrders}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Общий заработок:</Text>
            <Text style={styles.summaryValue}>
              {stats.totalEarnings.toLocaleString('ru-RU')} ₽
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Средний чек:</Text>
            <Text style={styles.summaryValue}>
              {Math.round(stats.totalEarnings / stats.monthOrders).toLocaleString('ru-RU')} ₽
            </Text>
          </View>
        </View>

        <View style={styles.motivationCard}>
          <Text style={styles.motivationTitle}>Отличная работа! 🎉</Text>
          <Text style={styles.motivationText}>
            Вы в топ-10% лучших мастеров этого месяца. Продолжайте в том же духе!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  statsGrid: {
    padding: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  summaryLabel: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  motivationCard: {
    backgroundColor: Colors.success + '20',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  motivationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.success,
    marginBottom: 8,
  },
  motivationText: {
    fontSize: 14,
    color: Colors.text.primary,
    lineHeight: 20,
  },
});