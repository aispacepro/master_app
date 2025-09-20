import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { OrderStatus } from '@/types/order';

interface ProgressIndicatorProps {
  currentStatus: OrderStatus;
}

const steps = [
  { key: 'pending' as OrderStatus, label: 'Ожидание' },
  { key: 'in_progress' as OrderStatus, label: 'В работе' },
  { key: 'photo_before' as OrderStatus, label: 'Фото до' },
  { key: 'checklist' as OrderStatus, label: 'Задачи' },
  { key: 'photo_after' as OrderStatus, label: 'Фото после' },
  { key: 'payment' as OrderStatus, label: 'Оплата' },
  { key: 'completed' as OrderStatus, label: 'Завершено' },
];

export function ProgressIndicator({ currentStatus }: ProgressIndicatorProps) {
  const currentIndex = steps.findIndex(s => s.key === currentStatus);

  return (
    <View style={styles.container}>
      {/* Линия прогресса */}
      <View style={styles.progressLine}>
        <View style={[
          styles.progressFill,
          { width: `${Math.max(0, (currentIndex / (steps.length - 1)) * 100)}%` }
        ]} />
      </View>
      
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <View key={step.key} style={styles.stepWrapper}>
              <View style={[
                styles.stepCircle,
                isCompleted && styles.completedCircle,
                isCurrent && styles.currentCircle,
                isUpcoming && styles.upcomingCircle,
              ]}>
                {isCompleted ? (
                  <Check size={14} color={Colors.white} />
                ) : (
                  <Text style={[
                    styles.stepNumber,
                    isCurrent && styles.currentNumber,
                    isUpcoming && styles.upcomingNumber,
                  ]}>
                    {index + 1}
                  </Text>
                )}
              </View>
              
              <Text style={[
                styles.stepLabel,
                isCompleted && styles.completedLabel,
                isCurrent && styles.currentLabel,
                isUpcoming && styles.upcomingLabel,
              ]} numberOfLines={2}>
                {step.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 12,
    backgroundColor: Colors.white,
    marginBottom: 8,
  },
  progressLine: {
    height: 2,
    backgroundColor: Colors.border,
    marginBottom: 20,
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 1,
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    position: 'relative',
  },
  stepWrapper: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  leftConnector: {
    position: 'absolute',
    top: 14,
    left: '50%',
    right: 0,
    height: 2,
    backgroundColor: Colors.border,
    zIndex: 0,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    backgroundColor: Colors.white,
    borderWidth: 2,
    zIndex: 2,
  },
  completedCircle: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  currentCircle: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  upcomingCircle: {
    backgroundColor: Colors.white,
    borderColor: Colors.border,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '600',
  },
  currentNumber: {
    color: Colors.white,
  },
  upcomingNumber: {
    color: Colors.text.secondary,
  },
  stepLabel: {
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 12,
    paddingHorizontal: 2,
  },
  completedLabel: {
    color: Colors.success,
    fontWeight: '500',
  },
  currentLabel: {
    color: Colors.primary,
    fontWeight: '600',
  },
  upcomingLabel: {
    color: Colors.text.light,
  },
  completedConnector: {
    backgroundColor: Colors.success,
  },
});