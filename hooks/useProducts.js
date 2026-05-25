import { useState, useEffect, useCallback } from 'react';
import {
  getAllProducts,
  getProductsByCategory,
  searchProducts,
  getUserProducts,
} from '../services/productService';

const useProducts = (initialCategory = null) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(initialCategory);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let data;
      if (category) {
        data = await getProductsByCategory(category);
      } else {
        data = await getAllProducts();
      }
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [category]);

  const refreshProducts = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      let data;
      if (category) {
        data = await getProductsByCategory(category);
      } else {
        data = await getAllProducts();
      }
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRefreshing(false);
    }
  }, [category]);

  const search = useCallback(async (searchTerm) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await searchProducts(searchTerm);
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filterByCategory = useCallback((newCategory) => {
    setCategory(newCategory);
  }, []);

  const clearFilter = useCallback(() => {
    setCategory(null);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    isLoading,
    isRefreshing,
    error,
    category,
    refreshProducts,
    search,
    filterByCategory,
    clearFilter,
  };
};

export const useUserProducts = (userId) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProducts = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getUserProducts(userId);
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserProducts();
  }, [fetchUserProducts]);

  return { products, isLoading, error, refetch: fetchUserProducts };
};

export default useProducts;