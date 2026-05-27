import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../hooks/useAuth';
import { updateProduct, uploadImage } from '../services/productService';
import { InputField, CustomButton } from '../components';
import { CATEGORIES } from '../types';

const EditProductScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { product } = route.params;

  const [formData, setFormData] = useState({
    title: product.title || '',
    description: product.description || '',
    price: product.price?.toString() || '',
    category: product.category || 'Amigurumi',
    imageUrl: product.imageUrl || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title || formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description || formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.imageUrl) {
      newErrors.imageUrl = 'Please add a product image';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photo library');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUploading(true);
      try {
        const downloadURL = await uploadImage(result.assets[0].uri, user.uid);
        handleInputChange('imageUrl', downloadURL);
      } catch (error) {
        Alert.alert('Error', 'Failed to upload image');
      } finally {
        setImageUploading(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await updateProduct(product.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        imageUrl: formData.imageUrl,
      });
      Alert.alert('Success', 'Product updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Edit Product</Text>

          <View style={styles.imagePickerContainer}>
            {formData.imageUrl ? (
              <Image source={{ uri: formData.imageUrl }} style={styles.previewImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="image-outline" size={48} color="#ccc" />
                <Text style={styles.placeholderText}>Add Product Image</Text>
              </View>
            )}
            <TouchableOpacity style={styles.imageButton} onPress={pickImage} disabled={imageUploading}>
              <Ionicons name="camera-outline" size={20} color="#6C63FF" />
              <Text style={styles.imageButtonText}>
                {imageUploading ? 'Uploading...' : 'Change Image'}
              </Text>
            </TouchableOpacity>
            {errors.imageUrl && <Text style={styles.errorText}>{errors.imageUrl}</Text>}
          </View>

          <InputField
            label="Title"
            placeholder="Enter product title"
            value={formData.title}
            onChangeText={(text) => handleInputChange('title', text)}
            error={errors.title}
            required
          />

          <InputField
            label="Description"
            placeholder="Describe your product"
            value={formData.description}
            onChangeText={(text) => handleInputChange('description', text)}
            error={errors.description}
            multiline
            numberOfLines={4}
            required
          />

          <InputField
            label="Price"
            placeholder="0.00"
            value={formData.price}
            onChangeText={(text) => handleInputChange('price', text)}
            error={errors.price}
            keyboardType="numeric"
            required
          />

          <View style={styles.categoryContainer}>
            <Text style={styles.label}>
              Category <Text style={styles.required}> *</Text>
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryOption,
                    formData.category === category && styles.selectedCategory,
                  ]}
                  onPress={() => handleInputChange('category', category)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      formData.category === category && styles.selectedCategoryText,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
          </View>

          <CustomButton
            title="Update Product"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 24,
  },
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  placeholderImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6C63FF',
  },
  imageButtonText: {
    color: '#6C63FF',
    marginLeft: 8,
    fontWeight: '600',
  },
  categoryContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#ff6b6b',
  },
  categoryOption: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: '#6C63FF',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  errorText: {
    fontSize: 12,
    color: '#ff6b6b',
    marginTop: 4,
  },
  submitButton: {
    marginTop: 16,
  },
});

export default EditProductScreen;