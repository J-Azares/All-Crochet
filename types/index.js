/**
 * @typedef {Object} CrochetProduct
 * @property {string} id - Unique document ID
 * @property {string} title - Product title
 * @property {string} description - Product description
 * @property {number} price - Product price
 * @property {string} category - Product category (Amigurumi, Clothing, Accessories)
 * @property {string} imageUrl - URL of product image
 * @property {string} userId - ID of the artisan who created the product
 * @property {string} [userName] - Display name of the artisan
 * @property {string} [userEmail] - Email of the artisan
 * @property {import('firebase/firestore').Timestamp} createdAt - Creation timestamp
 * @property {import('firebase/firestore').Timestamp} updatedAt - Last update timestamp
 * @property {boolean} isArchived - Whether the product is archived (soft delete)
 */

/**
 * @typedef {Object} User
 * @property {string} uid - Firebase user ID
 * @property {string} email - User email
 * @property {string} [displayName] - User display name
 * @property {string} [photoURL] - User profile photo URL
 */

/**
 * @typedef {Object} ProductFormData
 * @property {string} title
 * @property {string} description
 * @property {string} price
 * @property {string} category
 * @property {string} imageUrl
 */

/**
 * @typedef {Object} FormErrors
 * @property {string} [title]
 * @property {string} [description]
 * @property {string} [price]
 * @property {string} [category]
 * @property {string} [imageUrl]
 */

/**
 * @typedef {'Amigurumi' | 'Clothing' | 'Accessories'} ProductCategory
 */

/**
 * @typedef {Object} AuthState
 * @property {User | null} user
 * @property {boolean} isLoading
 * @property {string | null} error
 */

/**
 * @typedef {Object} ProductsState
 * @property {CrochetProduct[]} products
 * @property {boolean} isLoading
 * @property {string | null} error
 * @property {boolean} isRefreshing
 */

export const CATEGORIES = ['Amigurumi', 'Clothing', 'Accessories'];

export const INITIAL_PRODUCT_FORM = {
  title: '',
  description: '',
  price: '',
  category: 'Amigurumi',
  imageUrl: '',
};