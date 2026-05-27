import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import useProducts from '../hooks/useProducts';
import { ProductCard, LoadingSkeleton, EmptyState, ErrorState } from '../components';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, isAuthenticated } = useAuth();
  const { products, isLoading, isRefreshing, error, refreshProducts } = useProducts();

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const renderProduct = ({ item }) => (
    <ProductCard product={item} onPress={() => handleProductPress(item)} />
  );

  if (isLoading && !isRefreshing) {
    return <LoadingSkeleton count={5} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={refreshProducts} />;
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon="storefront-outline"
        title="No Products Yet"
        message="Be the first to add a crochet product!"
        actionLabel="Add Product"
        onAction={() => navigation.navigate('CreateTab', { screen: 'CreateProduct' })}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Welcome{isAuthenticated ? `, ${user?.displayName || 'Artisan'}` : ''}!
        </Text>
        <Text style={styles.subtitle}>Discover beautiful handmade crochet items</Text>
      </View>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refreshProducts} />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  list: {
    padding: 16,
  },
});

export default HomeScreen;