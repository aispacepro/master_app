import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { X, CreditCard, Banknote, QrCode, Check } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { ActionButton } from '@/components/ActionButton';
import { PaymentMethod } from '@/types/order';

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  onComplete: (method: PaymentMethod, cashReceived?: number) => void;
  amount: number;
  originalAmount?: number;
  amountChangedBy?: 'dispatcher' | 'master';
  onUpdateAmount?: (newAmount: number, reason: string) => void;
}

export function PaymentModal({ 
  visible, 
  onClose, 
  onComplete, 
  amount, 
  originalAmount,
  amountChangedBy,
  onUpdateAmount 
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [cashReceived, setCashReceived] = useState('');
  const [qrPaid, setQrPaid] = useState(false);
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [newAmount, setNewAmount] = useState(amount.toString());
  const [changeReason, setChangeReason] = useState('');

  const handleCashPayment = () => {
    const received = parseFloat(cashReceived);
    if (received >= amount) {
      onComplete('cash', received);
      onClose();
    }
  };

  const handleQrPayment = () => {
    if (qrPaid) {
      onComplete('qr');
      onClose();
    }
  };

  const change = cashReceived ? parseFloat(cashReceived) - amount : 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Оплата заказа</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.amountCard}>
            <View style={styles.amountHeader}>
              <Text style={styles.amountLabel}>К оплате:</Text>
              {!isEditingAmount && onUpdateAmount && (
                <TouchableOpacity
                  style={styles.editAmountButton}
                  onPress={() => setIsEditingAmount(true)}
                >
                  <Text style={styles.editAmountText}>Изменить</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {isEditingAmount ? (
              <View style={styles.editAmountForm}>
                <View style={styles.amountInputContainer}>
                  <TextInput
                    style={styles.amountInput}
                    value={newAmount}
                    onChangeText={setNewAmount}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={Colors.text.light}
                  />
                  <Text style={styles.currency}>₽</Text>
                </View>
                
                <TextInput
                  style={styles.reasonInput}
                  value={changeReason}
                  onChangeText={setChangeReason}
                  placeholder="Причина изменения (например: дополнительные работы)"
                  placeholderTextColor={Colors.text.light}
                  multiline
                />
                
                <View style={styles.editAmountActions}>
                  <ActionButton
                    title="Отмена"
                    onPress={() => {
                      setIsEditingAmount(false);
                      setNewAmount(amount.toString());
                      setChangeReason('');
                    }}
                    variant="secondary"
                    size="medium"
                  />
                  <ActionButton
                    title="Сохранить"
                    onPress={() => {
                      const parsedAmount = parseFloat(newAmount);
                      if (parsedAmount > 0 && changeReason.trim() && onUpdateAmount) {
                        onUpdateAmount(parsedAmount, changeReason.trim());
                        setIsEditingAmount(false);
                      }
                    }}
                    variant="success"
                    size="medium"
                    disabled={!newAmount || parseFloat(newAmount) <= 0 || !changeReason.trim()}
                  />
                </View>
              </View>
            ) : (
              <View>
                <Text style={styles.amountValue}>{amount.toLocaleString('ru-RU')} ₽</Text>
                {originalAmount && originalAmount !== amount && (
                  <View style={styles.amountChangeInfo}>
                    <Text style={styles.originalAmountText}>
                      Первоначально: {originalAmount.toLocaleString('ru-RU')} ₽
                    </Text>
                    <Text style={styles.amountChangedBy}>
                      Изменено {amountChangedBy === 'master' ? 'мастером' : 'диспетчером'}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {!selectedMethod && (
            <View style={styles.methodSelection}>
              <Text style={styles.sectionTitle}>Выберите способ оплаты:</Text>
              
              <TouchableOpacity
                style={styles.methodCard}
                onPress={() => setSelectedMethod('cash')}
                activeOpacity={0.7}
              >
                <Banknote size={32} color={Colors.success} />
                <View style={styles.methodInfo}>
                  <Text style={styles.methodTitle}>Наличные</Text>
                  <Text style={styles.methodDescription}>Оплата наличными деньгами</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.methodCard}
                onPress={() => setSelectedMethod('qr')}
                activeOpacity={0.7}
              >
                <QrCode size={32} color={Colors.primary} />
                <View style={styles.methodInfo}>
                  <Text style={styles.methodTitle}>QR-код</Text>
                  <Text style={styles.methodDescription}>Безналичная оплата по QR</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {selectedMethod === 'cash' && (
            <View style={styles.cashPayment}>
              <Text style={styles.sectionTitle}>Оплата наличными</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Получено от клиента:</Text>
                <TextInput
                  style={styles.input}
                  value={cashReceived}
                  onChangeText={setCashReceived}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={Colors.text.light}
                />
                <Text style={styles.currency}>₽</Text>
              </View>

              {change > 0 && (
                <View style={styles.changeCard}>
                  <Text style={styles.changeLabel}>Сдача:</Text>
                  <Text style={styles.changeValue}>{change.toLocaleString('ru-RU')} ₽</Text>
                </View>
              )}

              <View style={styles.actions}>
                <ActionButton
                  title="Назад"
                  onPress={() => {
                    setSelectedMethod(null);
                    setCashReceived('');
                  }}
                  variant="secondary"
                  size="medium"
                />
                <ActionButton
                  title="Подтвердить"
                  onPress={handleCashPayment}
                  variant="success"
                  disabled={!cashReceived || parseFloat(cashReceived) < amount}
                  icon={<Check size={20} color={Colors.white} />}
                />
              </View>
            </View>
          )}

          {selectedMethod === 'qr' && (
            <View style={styles.qrPayment}>
              <Text style={styles.sectionTitle}>Оплата по QR-коду</Text>
              
              <View style={styles.qrContainer}>
                <Image
                  source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=payment_' + amount }}
                  style={styles.qrCode}
                />
                <Text style={styles.qrAmount}>{amount.toLocaleString('ru-RU')} ₽</Text>
                <Text style={styles.qrInstruction}>
                  Покажите QR-код клиенту для оплаты
                </Text>
              </View>

              {!qrPaid ? (
                <ActionButton
                  title="Оплата получена"
                  onPress={() => setQrPaid(true)}
                  variant="primary"
                />
              ) : (
                <View style={styles.paidConfirmation}>
                  <Check size={48} color={Colors.success} />
                  <Text style={styles.paidText}>Оплата подтверждена!</Text>
                  <ActionButton
                    title="Завершить"
                    onPress={handleQrPayment}
                    variant="success"
                    icon={<Check size={20} color={Colors.white} />}
                  />
                </View>
              )}

              <ActionButton
                title="Назад"
                onPress={() => {
                  setSelectedMethod(null);
                  setQrPaid(false);
                }}
                variant="secondary"
                size="medium"
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  amountCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  amountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  amountLabel: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  editAmountButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.primary + '20',
    borderRadius: 6,
  },
  editAmountText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  amountValue: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  amountChangeInfo: {
    marginTop: 8,
    padding: 12,
    backgroundColor: Colors.warning + '10',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  originalAmountText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  amountChangedBy: {
    fontSize: 12,
    color: Colors.warning,
    fontWeight: '500',
  },
  editAmountForm: {
    gap: 16,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  reasonInput: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  editAmountActions: {
    flexDirection: 'row',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  methodSelection: {
    gap: 12,
  },
  methodCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  cashPayment: {
    gap: 20,
  },
  inputContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'right',
  },
  currency: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: 8,
  },
  changeCard: {
    backgroundColor: Colors.warning + '20',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  changeLabel: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  changeValue: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.warning,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  qrPayment: {
    gap: 20,
  },
  qrContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  qrCode: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  qrAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  qrInstruction: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  paidConfirmation: {
    alignItems: 'center',
    gap: 16,
  },
  paidText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.success,
  },
});