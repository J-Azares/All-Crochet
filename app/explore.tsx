import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import useProducts from '../hooks/useProducts';
import { ProductCard, LoadingSkeleton, EmptyState, ErrorState } from '../components';
import { CATEGORIES } from '../types';

const ExploreScreen = () => {
  const navigation = useNavigation() as any;
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { products, isLoading, error, search, filterByCategory, clearFilter } = useProducts();

  const handleProductPress = (product: any) => {
    navigation.navigate('ProductDetail', { product });
  };

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      search(searchQuery);
    }
  }, [searchQuery, search]);

  const handleCategoryPress = (category: string) => {
    if (activeCategory === category) {
      setActiveCategory(null);
      clearFilter();
    } else {
      setActiveCategory(category);
      filterByCategory(category);
    }
  };

  const renderProduct = ({ item }: { item: any }) => (
    <ProductCard product={item} onPress={() => handleProductPress(item)} />
  );

  const renderCategoryItem = (category: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryChip,
        activeCategory === category && styles.activeCategoryChip,
      ]}
      onPress={() => handleCategoryPress(category)}
    >
      <Text
        style={[
          styles.categoryText,
          activeCategory === category && styles.activeCategoryText,
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return <LoadingSkeleton count={5} />;
  }

  if (error) {
    return <ErrorState icon="alert-circle-outline" title="Something went wrong" message={error} onRetry={() => {}} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search crochet items..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map(renderCategoryItem)}
      </ScrollView>

      {products.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="No Results Found"
          message="Try adjusting your search or filter criteria"
          actionLabel={undefined}
          onAction={undefined}
        />
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 8,
  },
  activeCategoryChip: {
    backgroundColor: '#6C63FF',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#fff',
  },
  list: {
    padding: 16,
  },
});

export default ExploreScreen;