import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import Colors from '@/constants/colors';

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'secondary';
  size?: 'large' | 'medium';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export function ActionButton({
  title,
  onPress,
  variant = 'primary',
  size = 'large',
  disabled = false,
  loading = false,
  style,
  icon,
}: ActionButtonProps) {
  const getBackgroundColor = () => {
    if (disabled) return Colors.secondary;
    switch (variant) {
      case 'success': return Colors.success;
      case 'warning': return Colors.warning;
      case 'danger': return Colors.danger;
      case 'secondary': return Colors.secondary;
      default: return Colors.primary;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        size === 'large' ? styles.large : styles.medium,
        { backgroundColor: getBackgroundColor() },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={Colors.white} />
      ) : (
        <>
          {icon}
          <Text style={[
            styles.text,
            size === 'large' ? styles.largeText : styles.mediumText,
          ]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  large: {
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  medium: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  text: {
    color: Colors.white,
    fontWeight: '600',
  },
  largeText: {
    fontSize: 18,
  },
  mediumText: {
    fontSize: 16,
  },
});