import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle, RotateCcw } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { ActionButton } from '@/components/ActionButton';

interface CompletionScreenProps {
  orderTitle: string;
  onNewOrder: () => void;
}

export function CompletionScreen({ orderTitle, onNewOrder }: CompletionScreenProps) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.successContainer}>
          <CheckCircle size={120} color={Colors.success} />
          <Text style={styles.successTitle}>Заказ завершен!</Text>
          <Text style={styles.successSubtitle}>Отличная работа!</Text>
          
          <View style={styles.orderInfo}>
            <Text style={styles.completedOrderTitle}>{orderTitle}</Text>
            <Text style={styles.completedText}>успешно выполнен</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <ActionButton
          title="Новый заказ"
          onPress={onNewOrder}
          variant="primary"
          icon={<RotateCcw size={20} color={Colors.white} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successContainer: {
    alignItems: 'center',
    gap: 24,
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    maxWidth: 350,
    width: '100%',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.success,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 18,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  orderInfo: {
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    padding: 20,
    backgroundColor: Colors.lightBlue,
    borderRadius: 16,
    width: '100%',
  },
  completedOrderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    textAlign: 'center',
  },
  completedText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});