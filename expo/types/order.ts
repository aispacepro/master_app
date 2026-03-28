export type OrderStatus = 'pending' | 'in_progress' | 'photo_before' | 'checklist' | 'photo_after' | 'payment' | 'completed';

export type PaymentMethod = 'cash' | 'qr' | null;

export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  addedBy: 'dispatcher' | 'master';
  addedAt?: string;
}

export interface Order {
  id: string;
  clientName: string;
  clientPhone: string;
  clientPhoneRaw?: string;
  address: string;
  serviceType: string;
  scheduledTime: string;
  status: OrderStatus;
  photosBefore: string[];
  photosAfter: string[];
  checklist: ChecklistItem[];
  paymentMethod?: PaymentMethod;
  paymentAmount?: number;
  originalAmount?: number;
  amountChangedBy?: 'dispatcher' | 'master';
  amountChangeReason?: string;
  cashReceived?: number;
  startTime?: string;
  endTime?: string;
  notes?: string;
}

export interface Statistics {
  todayOrders: number;
  weekOrders: number;
  monthOrders: number;
  totalEarnings: number;
  averageTime: number;
  rating: number;
}

export interface Master {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  rating: number;
  completedOrders: number;
  isOnline: boolean;
  currentOrders: number;
  maxOrders: number;
  specialties: string[];
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface DispatcherOrder extends Order {
  masterId?: string;
  masterName?: string;
  priority: 'low' | 'medium' | 'high';
  estimatedDuration: number;
  createdAt: string;
  assignedAt?: string;
}