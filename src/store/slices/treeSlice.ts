import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tree } from '../../types/ITree';

interface TreeState {
  trees: Tree[];
  editingTree: Tree | null;
}

const initialState: TreeState = {
  trees: [],
  editingTree: null,
};

const treeSlice = createSlice({
  name: 'tree',
  initialState,
  reducers: {
    setTrees: (state, action: PayloadAction<Tree[]>) => {
      state.trees = action.payload;
    },
    addTree: (state, action: PayloadAction<Tree>) => {
      state.trees.push(action.payload);
    },
    updateTree: (state, action: PayloadAction<Tree>) => {
      const index = state.trees.findIndex(tree => tree._id === action.payload._id);
      if (index !== -1) {
        state.trees[index] = action.payload;
      }
    },
    removeTree: (state, action: PayloadAction<string>) => {
      state.trees = state.trees.filter(tree => tree._id !== action.payload);
    },
    setEditingTree: (state, action: PayloadAction<Tree | null>) => {
      state.editingTree = action.payload;
    },
  },
});

export const {
  setTrees,
  addTree,
  updateTree,
  removeTree,
  setEditingTree,
} = treeSlice.actions;

export default treeSlice.reducer;