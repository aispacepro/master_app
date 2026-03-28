import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useMemo } from 'react';
import { Master, DispatcherOrder } from '@/types/order';
import { mockMasters, mockDispatcherOrders } from '@/mocks/orderData';

export const [DispatcherProvider, useDispatcher] = createContextHook(() => {
  const [masters, setMasters] = useState<Master[]>(mockMasters);
  const [orders, setOrders] = useState<DispatcherOrder[]>(mockDispatcherOrders);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  const assignOrderToMaster = useCallback((orderId: string, masterId: string) => {
    const master = masters.find(m => m.id === masterId);
    if (!master) return;

    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            masterId, 
            masterName: master.name, 
            status: 'in_progress' as const,
            assignedAt: new Date().toISOString()
          }
        : order
    ));

    setMasters(prev => prev.map(m => 
      m.id === masterId 
        ? { ...m, currentOrders: m.currentOrders + 1 }
        : m
    ));
  }, [masters]);

  const unassignOrder = useCallback((orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order?.masterId) return;

    setOrders(prev => prev.map(o => 
      o.id === orderId 
        ? { 
            ...o, 
            masterId: undefined, 
            masterName: undefined, 
            status: 'pending' as const,
            assignedAt: undefined
          }
        : o
    ));

    setMasters(prev => prev.map(m => 
      m.id === order.masterId 
        ? { ...m, currentOrders: Math.max(0, m.currentOrders - 1) }
        : m
    ));
  }, [orders]);

  const updateOrderPriority = useCallback((orderId: string, priority: 'low' | 'medium' | 'high') => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, priority } : order
    ));
  }, []);

  const filteredOrders = orders.filter(order => {
    if (selectedFilter === 'all') return true;
    return order.status === selectedFilter;
  });

  const availableMasters = masters.filter(master => 
    master.isOnline && master.currentOrders < master.maxOrders
  );

  const getOrdersStats = useCallback(() => {
    const today = new Date().toDateString();
    const todayOrders = orders.filter(order => 
      new Date(order.createdAt).toDateString() === today
    );
    
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      inProgress: orders.filter(o => o.status === 'in_progress').length,
      completed: orders.filter(o => o.status === 'completed').length,
      todayTotal: todayOrders.length,
    };
  }, [orders]);

  return useMemo(() => ({
    masters,
    orders: filteredOrders,
    allOrders: orders,
    selectedFilter,
    setSelectedFilter,
    assignOrderToMaster,
    unassignOrder,
    updateOrderPriority,
    availableMasters,
    getOrdersStats,
  }), [
    masters,
    filteredOrders,
    orders,
    selectedFilter,
    setSelectedFilter,
    assignOrderToMaster,
    unassignOrder,
    updateOrderPriority,
    availableMasters,
    getOrdersStats,
  ]);
});