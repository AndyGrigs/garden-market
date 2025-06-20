import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../../types/ICategories';

interface CategoryState {
  categories: Category[];
  selectedCategoryId: string | null;
}

const initialState: CategoryState = {
  categories: [],
  selectedCategoryId: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex(cat => cat._id === action.payload._id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    removeCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(cat => cat._id !== action.payload);
    },
    setSelectedCategoryId: (state, action: PayloadAction<string | null>) => {
      state.selectedCategoryId = action.payload;
    },
  },
});

export const {
  setCategories,
  addCategory,
  updateCategory,
  removeCategory,
  setSelectedCategoryId,
} = categorySlice.actions;

export default categorySlice.reducer;