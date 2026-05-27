import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { archiveProduct, deleteProduct } from '../services/productService';
import { CustomButton } from '../components';

const ProductDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user, isAuthenticated } = useAuth();
  const { product } = route.params;

  const isOwner = isAuthenticated && user?.uid === product.userId;

  const formatPrice = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const handleEdit = () => {
    navigation.navigate('EditProduct', { product });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProduct(product.id);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete product');
            }
          },
        },
      ]
    );
  };

  const handleArchive = () => {
    Alert.alert(
      'Archive Product',
      'This will hide the product from the marketplace. You can restore it later.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive',
          onPress: async () => {
            try {
              await archiveProduct(product.id);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to archive product');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: product.imageUrl || 'https://via.placeholder.com/500' }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{product.category}</Text>
            </View>
            <Text style={styles.title}>{product.title}</Text>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Artisan</Text>
            <View style={styles.artisanContainer}>
              <Ionicons name="person-circle" size={40} color="#6C63FF" />
              <View style={styles.artisanInfo}>
                <Text style={styles.artisanName}>{product.userName || 'Anonymous'}</Text>
                <Text style={styles.artisanEmail}>{product.userEmail}</Text>
              </View>
            </View>
          </View>

          {isOwner && (
            <View style={styles.ownerActions}>
              <Text style={styles.sectionTitle}>Manage Product</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
                  <Ionicons name="create-outline" size={20} color="#6C63FF" />
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleArchive}>
                  <Ionicons name="archive-outline" size={20} color="#ff9500" />
                  <Text style={[styles.actionButtonText, { color: '#ff9500' }]}>Archive</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
                  <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
                  <Text style={[styles.actionButtonText, { color: '#ff6b6b' }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#6C63FF20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#6C63FF',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#6C63FF',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  artisanContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  artisanInfo: {
    marginLeft: 12,
  },
  artisanName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  artisanEmail: {
    fontSize: 14,
    color: '#666',
  },
  ownerActions: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#6C63FF',
    marginTop: 4,
  },
});

export default ProductDetailScreen;