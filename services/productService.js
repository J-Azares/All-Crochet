import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

const PRODUCTS_COLLECTION = 'crochet_products';

/**
 * Create a new product listing
 * @param {Object} productData - Product data
 * @param {string} userId - Creator's user ID
 * @param {string} userName - Creator's display name
 * @param {string} userEmail - Creator's email
 * @returns {Promise<string>} - Created document ID
 */
export const createProduct = async (productData, userId, userName, userEmail) => {
  try {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...productData,
      userId,
      userName: userName || 'Anonymous Artisan',
      userEmail,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isArchived: false,
    });
    return docRef.id;
  } catch (error) {
    throw new Error(`Failed to create product: ${error.message}`);
  }
};

/**
 * Get a single product by ID
 * @param {string} productId - Product document ID
 * @returns {Promise<Object>} - Product data
 */
export const getProductById = async (productId) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    throw new Error('Product not found');
  } catch (error) {
    throw new Error(`Failed to fetch product: ${error.message}`);
  }
};

/**
 * Get all active products (not archived)
 * @param {number} pageSize - Number of products per page
 * @returns {Promise<Array>} - Array of products
 */
export const getAllProducts = async (pageSize = 20) => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('isArchived', '==', false),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }
};

/**
 * Get products by category
 * @param {string} category - Product category
 * @param {number} pageSize - Number of products per page
 * @returns {Promise<Array>} - Array of products
 */
export const getProductsByCategory = async (category, pageSize = 20) => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('isArchived', '==', false),
      where('category', '==', category),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Failed to fetch products by category: ${error.message}`);
  }
};

/**
 * Search products by title or description
 * @param {string} searchTerm - Search term
 * @param {number} pageSize - Number of products per page
 * @returns {Promise<Array>} - Array of matching products
 */
export const searchProducts = async (searchTerm, pageSize = 20) => {
  try {
    const allProducts = await getAllProducts(100);
    const term = searchTerm.toLowerCase();
    
    return allProducts.filter(product =>
      product.title.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)
    ).slice(0, pageSize);
  } catch (error) {
    throw new Error(`Failed to search products: ${error.message}`);
  }
};

/**
 * Get products by user ID
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of user's products
 */
export const getUserProducts = async (userId) => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Failed to fetch user products: ${error.message}`);
  }
};

/**
 * Update a product
 * @param {string} productId - Product document ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateProduct = async (productId, updates) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw new Error(`Failed to update product: ${error.message}`);
  }
};

/**
 * Soft delete a product (archive it)
 * @param {string} productId - Product document ID
 * @returns {Promise<void>}
 */
export const archiveProduct = async (productId) => {
  try {
    await updateProduct(productId, { isArchived: true });
  } catch (error) {
    throw new Error(`Failed to archive product: ${error.message}`);
  }
};

/**
 * Hard delete a product
 * @param {string} productId - Product document ID
 * @returns {Promise<void>}
 */
export const deleteProduct = async (productId) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(docRef);
  } catch (error) {
    throw new Error(`Failed to delete product: ${error.message}`);
  }
};

/**
 * Upload image to Firebase Storage
 * @param {string} uri - Local image URI
 * @param {string} userId - User ID for path organization
 * @returns {Promise<string>} - Download URL
 */
export const uploadImage = async (uri, userId) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const timestamp = Date.now();
    const filename = `products/${userId}/${timestamp}`;
    const storageRef = ref(storage, filename);
    
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

/**
 * Paginate products
 * @param {number} pageSize - Number of products per page
 * @param {Object} lastDoc - Last document snapshot for pagination
 * @returns {Promise<{products: Array, lastDoc: Object}>}
 */
export const paginateProducts = async (pageSize = 20, lastDoc = null) => {
  try {
    let q;
    if (lastDoc) {
      q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('isArchived', '==', false),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(pageSize)
      );
    } else {
      q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('isArchived', '==', false),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );
    }
    
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
    
    return { products, lastDoc: newLastDoc };
  } catch (error) {
    throw new Error(`Failed to paginate products: ${error.message}`);
  }
};