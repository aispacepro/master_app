import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Phone,
  MapPin,
  User,
  Calendar,
  Clock,
  Play,
  Book,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Order } from '@/types/order';
import { ActionButton } from '@/components/ActionButton';

interface OrderDetailsScreenProps {
  order: Order;
  onStartWork: () => void;
}

export function OrderDetailsScreen({ order, onStartWork }: OrderDetailsScreenProps) {
  const phoneNumber = order.clientPhoneRaw || order.clientPhone.replace(/\D/g, '');
  
  const handlePhonePress = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleAddressPress = () => {
    const address = encodeURIComponent(order.address);
    const url = Platform.select({
      ios: `maps:0,0?q=${address}`,
      android: `geo:0,0?q=${address}`,
      default: `https://maps.google.com/?q=${address}`,
    });
    Linking.openURL(url);
  };
  
  const handleWhatsApp = () => {
    const url = `whatsapp://send?phone=${phoneNumber}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log('WhatsApp не установлен на устройстве');
      }
    });
  };
  
  const handleTelegram = () => {
    const url = `tg://msg?to=${phoneNumber}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log('Telegram не установлен на устройстве');
      }
    });
  };
  
  const handleViber = () => {
    const url = `viber://chat?number=${phoneNumber}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log('Viber не установлен на устройстве');
      }
    });
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    
    const timeString = date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    if (isToday) {
      return { date: 'Сегодня', time: timeString };
    } else if (isTomorrow) {
      return { date: 'Завтра', time: timeString };
    } else {
      const dateString = date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit'
      });
      return { date: dateString, time: timeString };
    }
  };
  
  const { date, time } = formatDateTime(order.scheduledTime);
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Выделенный блок с датой и временем */}
        <View style={styles.dateTimeHighlight}>
          <View style={styles.dateTimeHeader}>
            <Text style={styles.dateTimeTitle}>ВРЕМЯ ВЫПОЛНЕНИЯ ЗАКАЗА</Text>
          </View>
          <View style={styles.dateTimeContent}>
            <View style={styles.dateSection}>
              <Calendar size={28} color={Colors.white} />
              <View>
                <Text style={styles.dateLabel}>Дата заказа:</Text>
                <Text style={styles.dateText}>{date}</Text>
              </View>
            </View>
            <View style={styles.timeSeparator} />
            <View style={styles.timeSection}>
              <Clock size={28} color={Colors.white} />
              <View>
                <Text style={styles.timeLabel}>Время заказа:</Text>
                <Text style={styles.timeText}>{time}</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Информация о заказе */}
        <View style={styles.orderCard}>
          <View style={styles.serviceHeader}>
            <Book size={24} color={Colors.primary} />
            <Text style={styles.serviceType}>{order.serviceType}</Text>
          </View>

          <TouchableOpacity style={styles.addressRow} onPress={handleAddressPress}>
            <MapPin size={20} color={Colors.primary} />
            <Text style={styles.address}>{order.address}</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.clientInfo}>
            <View style={styles.infoRow}>
              <User size={20} color={Colors.text.secondary} />
              <Text style={styles.clientName}>{order.clientName}</Text>
            </View>

            <View style={styles.phoneSection}>
              <TouchableOpacity style={styles.callButton} onPress={handlePhonePress}>
                <Phone size={24} color={Colors.white} />
                <Text style={styles.callButtonText}>Позвонить клиенту</Text>
              </TouchableOpacity>
              
              <View style={styles.messengerButtons}>
                <TouchableOpacity style={[styles.messengerButton, styles.whatsappButton]} onPress={handleWhatsApp}>
                  <Text style={styles.messengerIcon}>💬</Text>
                  <Text style={styles.messengerLabel}>WhatsApp</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.messengerButton, styles.telegramButton]} onPress={handleTelegram}>
                  <Text style={styles.messengerIcon}>✈️</Text>
                  <Text style={styles.messengerLabel}>Telegram</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.messengerButton, styles.viberButton]} onPress={handleViber}>
                  <Text style={styles.messengerIcon}>📞</Text>
                  <Text style={styles.messengerLabel}>Viber</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {order.paymentAmount && (
            <>
              <View style={styles.divider} />
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentLabel}>Стоимость работ:</Text>
                <Text style={styles.paymentAmount}>{order.paymentAmount.toLocaleString('ru-RU')} ₽</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.actionContainer}>
          <ActionButton
            title="Начать работу"
            onPress={onStartWork}
            variant="primary"
            icon={<Play size={20} color={Colors.white} />}
          />
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
  dateTimeHighlight: {
    backgroundColor: Colors.accent,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  dateTimeHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  dateTimeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 1,
    textAlign: 'center',
  },
  dateTimeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  timeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  timeSeparator: {
    width: 2,
    height: 60,
    backgroundColor: Colors.white + '40',
    marginHorizontal: 16,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white + 'CC',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white + 'CC',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timeText: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: -0.5,
  },
  orderCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  serviceType: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  clientInfo: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clientName: {
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  phoneSection: {
    gap: 16,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  callButtonText: {
    fontSize: 18,
    color: Colors.white,
    fontWeight: '700',
  },
  messengerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
    marginTop: 12,
  },
  messengerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
    minWidth: 80,
  },
  messengerIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  messengerLabel: {
    fontSize: 11,
    color: Colors.white,
    fontWeight: '700',
    textAlign: 'center',
  },
  whatsappButton: {
    backgroundColor: Colors.messengers.whatsapp,
  },
  telegramButton: {
    backgroundColor: Colors.messengers.telegram,
  },
  viberButton: {
    backgroundColor: Colors.messengers.viber,
  },
  address: {
    fontSize: 16,
    color: Colors.primary,
    flex: 1,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  paymentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentLabel: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  paymentAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  actionContainer: {
    padding: 20,
    paddingBottom: 20,
  },
});