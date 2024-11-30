import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Todo {
  _id: string;
  title: string;
  description: string;
}

interface todosSlice {
  todos: Todo[];
  selectedTodoId: string | null;
  // selectedTodo: string | null;
  status: 'idle' | 'loading' | 'succeed' | 'failed';
  error: string | null;
}

const initialState: todosSlice = {
  todos: [],
  selectedTodoId: null,
  // selectedTodo: null,
  status: 'idle',
  error: null,
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.todos = action.payload;
    },

    // setSingleTodo: (state, action: PayloadAction<Todo>) => {
    //   state.selectedTodoId = action.payload._id; // Track the selected todo's ID
    //   state.selectedTodo = action.payload; // Store the fetched todo
    // },
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.push(action.payload);
    },

    removeTodo(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter(todo => todo._id !== action.payload); // Remove todo by ID
    },

    updateTodo: (state, action: PayloadAction<Todo>) => {
      const updatedTodo = action.payload;
      const index = state.todos.findIndex(todo => todo._id === updatedTodo._id);
      if (index !== -1) {
        state.todos[index] = updatedTodo;
      }
    },

    setSelectedTodoId: (state, action: PayloadAction<string>) => {
      state.selectedTodoId = action.payload;
    },

    setStatus: (
      state,
      action: PayloadAction<'idle' | 'loading' | 'succeed' | 'failed'>,
    ) => {
      state.status = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setTodos,
  addTodo,
  removeTodo,
  setStatus,
  setError,
  setSelectedTodoId,
  updateTodo,
} = todosSlice.actions;
export default todosSlice.reducer;
