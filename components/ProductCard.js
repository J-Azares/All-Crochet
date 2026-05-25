import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProductCard = ({ product, onPress }) => {
  const { title, price, imageUrl, category, userName } = product;

  const formatPrice = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: imageUrl || 'https://via.placeholder.com/300' }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.price}>{formatPrice(price)}</Text>
          <View style={styles.artisanContainer}>
            <Ionicons name="person-circle-outline" size={16} color="#666" />
            <Text style={styles.artisanName} numberOfLines={1}>
              {userName || 'Anonymous'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#6C63FF20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#6C63FF',
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6C63FF',
  },
  artisanContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  artisanName: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    maxWidth: 100,
  },
});

export default ProductCard;