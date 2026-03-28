import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import Colors from '@/constants/colors';
import { useOrderStore } from '@/hooks/useOrderStore';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { OrderDetailsScreen } from '@/screens/OrderDetailsScreen';
import { PhotoCaptureScreen } from '@/screens/PhotoCaptureScreen';
import { ChecklistScreen } from '@/screens/ChecklistScreen';
import { PaymentScreen } from '@/screens/PaymentScreen';
import { CompletionScreen } from '@/screens/CompletionScreen';
import { PaymentMethod } from '@/types/order';

export default function OrderScreen() {
  const {
    currentOrder,
    isLoading,
    updateOrderStatus,
    updateChecklist,
    addChecklistItem,
    removeChecklistItem,
    addPhotoBefore,
    removePhotoBefore,
    addPhotoAfter,
    removePhotoAfter,
    setPaymentMethod,
    setCashReceived,
    updatePaymentAmount,

    resetOrder,
  } = useOrderStore();

  if (isLoading || !currentOrder) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Загрузка...</Text>
      </View>
    );
  }

  const handleStartWork = () => {
    Alert.alert(
      'Начать работу?',
      'Вы готовы приступить к выполнению заказа?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Начать',
          style: 'default',
          onPress: () => updateOrderStatus('in_progress'),
        },
      ]
    );
  };

  const handlePhotoBeforeComplete = () => {
    if (currentOrder.photosBefore.length === 0) {
      Alert.alert(
        'Необходимо добавить фото',
        'Для продолжения работы необходимо сделать хотя бы одно фото ДО начала работ.',
        [{ text: 'Понятно', style: 'default' }]
      );
      return;
    }
    updateOrderStatus('photo_before');
  };

  const handleChecklistComplete = () => {
    const hasIncompleteItems = currentOrder.checklist.some(item => !item.completed);
    if (hasIncompleteItems) {
      Alert.alert(
        'Не все задачи выполнены',
        'Для продолжения необходимо выполнить все пункты чек-листа или удалить невыполненные.',
        [{ text: 'Понятно', style: 'default' }]
      );
      return;
    }
    if (currentOrder.checklist.length === 0) {
      Alert.alert(
        'Чек-лист пуст',
        'Добавьте хотя бы один пункт в чек-лист или обратитесь к диспетчеру.',
        [{ text: 'Понятно', style: 'default' }]
      );
      return;
    }
    updateOrderStatus('checklist');
  };

  const handlePhotoAfterComplete = () => {
    if (currentOrder.photosAfter.length === 0) {
      Alert.alert(
        'Необходимо добавить фото',
        'Для завершения работы необходимо сделать хотя бы одно фото ПОСЛЕ выполнения работ.',
        [{ text: 'Понятно', style: 'default' }]
      );
      return;
    }
    updateOrderStatus('photo_after');
  };



  const handlePayment = (method: PaymentMethod, cashReceived?: number) => {
    if (!method) return;
    
    setPaymentMethod(method);
    if (cashReceived && typeof cashReceived === 'number' && cashReceived > 0) {
      setCashReceived(cashReceived);
    }
    updateOrderStatus('completed');
  };

  const renderCurrentScreen = () => {
    switch (currentOrder.status) {
      case 'pending':
        return (
          <OrderDetailsScreen
            order={currentOrder}
            onStartWork={handleStartWork}
          />
        );
      case 'in_progress':
        return (
          <PhotoCaptureScreen
            title="Фото ДО начала работ"
            orderTitle={currentOrder.serviceType}
            existingPhotos={currentOrder.photosBefore}
            maxPhotos={5}
            onCapture={addPhotoBefore}
            onRemove={removePhotoBefore}
            onComplete={handlePhotoBeforeComplete}
          />
        );
      case 'photo_before':
        return (
          <ChecklistScreen
            orderTitle={currentOrder.serviceType}
            items={currentOrder.checklist}
            onToggle={updateChecklist}
            onAddItem={addChecklistItem}
            onRemoveItem={removeChecklistItem}
            onComplete={handleChecklistComplete}
          />
        );
      case 'checklist':
        return (
          <PhotoCaptureScreen
            title="Фото ПОСЛЕ выполнения"
            orderTitle={currentOrder.serviceType}
            existingPhotos={currentOrder.photosAfter}
            maxPhotos={5}
            onCapture={addPhotoAfter}
            onRemove={removePhotoAfter}
            onComplete={handlePhotoAfterComplete}
          />
        );
      case 'photo_after':
        return (
          <PaymentScreen
            orderTitle={currentOrder.serviceType}
            amount={currentOrder.paymentAmount || 0}
            originalAmount={currentOrder.originalAmount}
            amountChangedBy={currentOrder.amountChangedBy}
            onComplete={handlePayment}
            onUpdateAmount={updatePaymentAmount}
          />
        );
      case 'payment':
        return (
          <PaymentScreen
            orderTitle={currentOrder.serviceType}
            amount={currentOrder.paymentAmount || 0}
            originalAmount={currentOrder.originalAmount}
            amountChangedBy={currentOrder.amountChangedBy}
            onComplete={handlePayment}
            onUpdateAmount={updatePaymentAmount}
          />
        );
      case 'completed':
        return (
          <CompletionScreen
            orderTitle={currentOrder.serviceType}
            onNewOrder={resetOrder}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {currentOrder.status !== 'pending' && currentOrder.status !== 'completed' && (
        <ProgressIndicator currentStatus={currentOrder.status} />
      )}
      {renderCurrentScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: Colors.text.secondary,
  },
});