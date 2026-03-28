import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Order, OrderStatus, PaymentMethod } from '@/types/order';
import { mockOrder } from '@/mocks/orderData';

export const [OrderProvider, useOrderStore] = createContextHook(() => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Очищаем AsyncStorage при первом запуске для избежания проблем с JSON
    AsyncStorage.removeItem('currentOrder').then(() => {
      loadOrder();
    }).catch(() => {
      loadOrder();
    });
  }, []);

  const loadOrder = async () => {
    try {
      const stored = await AsyncStorage.getItem('currentOrder');
      if (stored && stored.trim() && stored !== 'undefined' && stored !== 'null') {
        try {
          const parsedOrder = JSON.parse(stored);
          // Проверяем, что это валидный объект заказа
          if (parsedOrder && typeof parsedOrder === 'object' && parsedOrder.id && parsedOrder.clientName) {
            setCurrentOrder(parsedOrder);
          } else {
            console.warn('Invalid order data structure, using mock data');
            await AsyncStorage.removeItem('currentOrder');
            setCurrentOrder(mockOrder);
          }
        } catch (parseError) {
          console.error('Error parsing stored order:', parseError, 'Data:', stored);
          // Очищаем поврежденные данные и используем моковые
          await AsyncStorage.removeItem('currentOrder');
          setCurrentOrder(mockOrder);
        }
      } else {
        // Используем моковые данные для демонстрации
        setCurrentOrder(mockOrder);
      }
    } catch (error) {
      console.error('Error loading order:', error);
      setCurrentOrder(mockOrder);
    } finally {
      setIsLoading(false);
    }
  };

  const saveOrder = async (order: Order) => {
    if (!order || !order.id || !order.clientName.trim()) {
      console.error('Invalid order data');
      return;
    }
    
    try {
      const orderString = JSON.stringify(order);
      await AsyncStorage.setItem('currentOrder', orderString);
      setCurrentOrder(order);
    } catch (error) {
      console.error('Error saving order:', error);
      // В случае ошибки сохранения, все равно обновляем состояние
      setCurrentOrder(order);
    }
  };

  const updateOrderStatus = useCallback((status: OrderStatus) => {
    if (!currentOrder) return;
    
    const updatedOrder = { ...currentOrder, status };
    
    if (status === 'in_progress') {
      updatedOrder.startTime = new Date().toISOString();
    } else if (status === 'completed') {
      updatedOrder.endTime = new Date().toISOString();
    }
    
    saveOrder(updatedOrder);
  }, [currentOrder]);

  const updateChecklist = useCallback((itemId: string, completed: boolean) => {
    if (!currentOrder) return;
    
    const updatedChecklist = currentOrder.checklist.map(item =>
      item.id === itemId ? { ...item, completed } : item
    );
    
    saveOrder({ ...currentOrder, checklist: updatedChecklist });
  }, [currentOrder]);

  const addChecklistItem = useCallback((title: string) => {
    if (!currentOrder || !title.trim()) return;
    
    const newItem = {
      id: Date.now().toString(),
      title: title.trim(),
      completed: false,
      addedBy: 'master' as const,
      addedAt: new Date().toISOString(),
    };
    
    const updatedChecklist = [...currentOrder.checklist, newItem];
    saveOrder({ ...currentOrder, checklist: updatedChecklist });
  }, [currentOrder]);

  const removeChecklistItem = useCallback((itemId: string) => {
    if (!currentOrder) return;
    
    const updatedChecklist = currentOrder.checklist.filter(item => item.id !== itemId);
    saveOrder({ ...currentOrder, checklist: updatedChecklist });
  }, [currentOrder]);

  const addPhotoBefore = useCallback((photoUri: string) => {
    if (!currentOrder || !photoUri.trim()) return;
    const updatedPhotos = [...currentOrder.photosBefore, photoUri];
    saveOrder({ ...currentOrder, photosBefore: updatedPhotos });
  }, [currentOrder]);

  const removePhotoBefore = useCallback((index: number) => {
    if (!currentOrder) return;
    const updatedPhotos = currentOrder.photosBefore.filter((_, i) => i !== index);
    saveOrder({ ...currentOrder, photosBefore: updatedPhotos });
  }, [currentOrder]);

  const addPhotoAfter = useCallback((photoUri: string) => {
    if (!currentOrder || !photoUri.trim()) return;
    const updatedPhotos = [...currentOrder.photosAfter, photoUri];
    saveOrder({ ...currentOrder, photosAfter: updatedPhotos });
  }, [currentOrder]);

  const removePhotoAfter = useCallback((index: number) => {
    if (!currentOrder) return;
    const updatedPhotos = currentOrder.photosAfter.filter((_, i) => i !== index);
    saveOrder({ ...currentOrder, photosAfter: updatedPhotos });
  }, [currentOrder]);

  const setPaymentMethod = useCallback((method: PaymentMethod) => {
    if (!currentOrder) return;
    saveOrder({ ...currentOrder, paymentMethod: method });
  }, [currentOrder]);

  const setCashReceived = useCallback((amount: number) => {
    if (!currentOrder || amount < 0) return;
    saveOrder({ ...currentOrder, cashReceived: amount });
  }, [currentOrder]);

  const updatePaymentAmount = useCallback((newAmount: number, reason?: string) => {
    if (!currentOrder || newAmount < 0) return;
    
    const updatedOrder = {
      ...currentOrder,
      paymentAmount: newAmount,
      amountChangedBy: 'master' as const,
      amountChangeReason: reason,
    };
    
    if (!currentOrder.originalAmount) {
      updatedOrder.originalAmount = currentOrder.paymentAmount;
    }
    
    saveOrder(updatedOrder);
  }, [currentOrder]);

  const completeOrder = useCallback(() => {
    if (!currentOrder) return;
    updateOrderStatus('completed');
  }, [currentOrder, updateOrderStatus]);

  const resetOrder = useCallback(async () => {
    try {
      // Для демонстрации сбрасываем на начальное состояние
      const newOrder = { ...mockOrder, status: 'pending' as OrderStatus };
      setCurrentOrder(newOrder);
      await AsyncStorage.removeItem('currentOrder');
    } catch (error) {
      console.error('Error resetting order:', error);
      // В случае ошибки все равно сбрасываем состояние
      setCurrentOrder({ ...mockOrder, status: 'pending' as OrderStatus });
    }
  }, []);

  return useMemo(() => ({
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
    completeOrder,
    resetOrder,
  }), [
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
    completeOrder,
    resetOrder,
  ]);
});