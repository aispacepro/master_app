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
import { PaymentMethod } from '@/types/order';
import { PaymentModal } from '@/screens/PaymentModal';
import { ActionButton } from '@/components/ActionButton';

interface PaymentScreenProps {
  orderTitle: string;
  amount: number;
  originalAmount?: number;
  amountChangedBy?: 'dispatcher' | 'master';
  onComplete: (method: PaymentMethod, cashReceived?: number) => void;
  onUpdateAmount: (newAmount: number, reason?: string) => void;
}

export function PaymentScreen({
  orderTitle,
  amount,
  originalAmount,
  amountChangedBy,
  onComplete,
  onUpdateAmount,
}: PaymentScreenProps) {
  const [paymentModalVisible, setPaymentModalVisible] = React.useState(true);

  const handlePaymentComplete = (method: PaymentMethod, cashReceived?: number) => {
    setPaymentModalVisible(false);
    onComplete(method, cashReceived);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Заголовок с названием заказа */}
      <View style={styles.orderHeader}>
        <Text style={styles.orderTitle}>{orderTitle}</Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Оплата работ</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.paymentInfo}>
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Сумма к оплате:</Text>
            <Text style={styles.amount}>{amount.toLocaleString('ru-RU')} ₽</Text>
          </View>

          {originalAmount && originalAmount !== amount && (
            <View style={styles.changeInfo}>
              <Text style={styles.changeLabel}>
                Первоначальная сумма: {originalAmount.toLocaleString('ru-RU')} ₽
              </Text>
              <Text style={styles.changeBy}>
                Изменено: {amountChangedBy === 'dispatcher' ? 'диспетчером' : 'мастером на месте'}
              </Text>
              <Text style={styles.changeDiff}>
                {amount > originalAmount ? '+' : ''}{(amount - originalAmount).toLocaleString('ru-RU')} ₽
              </Text>
            </View>
          )}

          <View style={styles.instructionContainer}>
            <CheckCircle size={24} color={Colors.success} />
            <Text style={styles.instructionText}>
              Выберите способ оплаты и завершите процесс получения средств от клиента
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <ActionButton
          title="Выбрать способ оплаты"
          onPress={() => setPaymentModalVisible(true)}
          variant="primary"
        />
      </View>

      <PaymentModal
        visible={paymentModalVisible}
        onClose={() => setPaymentModalVisible(false)}
        onComplete={handlePaymentComplete}
        amount={amount}
        originalAmount={originalAmount}
        amountChangedBy={amountChangedBy}
        onUpdateAmount={onUpdateAmount}
      />
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
  },
  content: {
    flex: 1,
    padding: 20,
  },
  paymentInfo: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  amountContainer: {
    alignItems: 'center',
    gap: 8,
  },
  amountLabel: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  amount: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.primary,
  },
  changeInfo: {
    backgroundColor: Colors.lightBlue,
    padding: 16,
    borderRadius: 12,
    gap: 4,
  },
  changeLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  changeBy: {
    fontSize: 12,
    color: Colors.text.light,
    fontStyle: 'italic',
  },
  changeDiff: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  instructionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.success + '10',
    padding: 16,
    borderRadius: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.primary,
    lineHeight: 20,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  footer: {
    padding: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});