import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, X, Check } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { ActionButton } from '@/components/ActionButton';

interface PhotoCaptureModalProps {
  visible: boolean;
  onClose: () => void;
  onCapture: (photoUri: string) => void;
  onRemove?: (index: number) => void;
  title: string;
  existingPhotos?: string[];
  maxPhotos?: number;
}

export function PhotoCaptureModal({
  visible,
  onClose,
  onCapture,
  onRemove,
  title,
  existingPhotos = [],
  maxPhotos = 5,
}: PhotoCaptureModalProps) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const requestPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ошибка', 'Необходимо разрешение на использование камеры');
        return false;
      }
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (photoUri) {
      onCapture(photoUri);
      setPhotoUri(null);
    }
  };

  const handleRemovePhoto = (index: number) => {
    if (onRemove) {
      onRemove(index);
    }
  };

  const canAddMore = existingPhotos.length < maxPhotos;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {existingPhotos.length > 0 && (
            <View style={styles.existingPhotos}>
              <Text style={styles.sectionTitle}>Сделанные фото ({existingPhotos.length}/{maxPhotos})</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosList}>
                {existingPhotos.map((photo, index) => (
                  <View key={`photo-${index}-${photo.slice(-10)}`} style={styles.existingPhotoContainer}>
                    <Image source={{ uri: photo }} style={styles.existingPhoto} />
                    <TouchableOpacity
                      style={styles.removePhotoButton}
                      onPress={() => handleRemovePhoto(index)}
                    >
                      <X size={16} color={Colors.white} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {photoUri ? (
            <View style={styles.photoContainer}>
              <Text style={styles.sectionTitle}>Новое фото</Text>
              <Image source={{ uri: photoUri }} style={styles.photo} />
              <View style={styles.photoActions}>
                <ActionButton
                  title="Переснять"
                  onPress={takePhoto}
                  variant="secondary"
                  size="medium"
                />
                <ActionButton
                  title="Из галереи"
                  onPress={pickImage}
                  variant="secondary"
                  size="medium"
                />
              </View>
            </View>
          ) : canAddMore ? (
            <View style={styles.noPhotoContainer}>
              <Camera size={80} color={Colors.text.light} />
              <Text style={styles.noPhotoText}>
                {existingPhotos.length === 0 ? 'Фотографии не сделаны' : 'Добавить еще фото'}
              </Text>
              <View style={styles.captureButtons}>
                <ActionButton
                  title="Сделать фото"
                  onPress={takePhoto}
                  icon={<Camera size={20} color={Colors.white} />}
                />
                <ActionButton
                  title="Выбрать из галереи"
                  onPress={pickImage}
                  variant="secondary"
                />
              </View>
            </View>
          ) : (
            <View style={styles.noPhotoContainer}>
              <Text style={styles.maxPhotosText}>Достигнуто максимальное количество фото ({maxPhotos})</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          {photoUri ? (
            <View style={styles.footerActions}>
              <ActionButton
                title="Отменить"
                onPress={() => setPhotoUri(null)}
                variant="secondary"
                size="medium"
              />
              <ActionButton
                title="Добавить фото"
                onPress={handleSave}
                variant="success"
                icon={<Check size={20} color={Colors.white} />}
              />
            </View>
          ) : (
            <ActionButton
              title="Закрыть"
              onPress={onClose}
              variant="secondary"
            />
          )}
        </View>
      </View>
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
  photoContainer: {
    flex: 1,
  },
  photo: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: Colors.border,
  },
  photoActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  noPhotoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  noPhotoText: {
    fontSize: 18,
    color: Colors.text.secondary,
  },
  captureButtons: {
    gap: 12,
    width: '100%',
    maxWidth: 300,
  },
  footer: {
    padding: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  existingPhotos: {
    marginBottom: 20,
  },
  photosList: {
    flexDirection: 'row',
  },
  existingPhotoContainer: {
    position: 'relative',
    marginRight: 12,
  },
  existingPhoto: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.border,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.danger,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  maxPhotosText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});