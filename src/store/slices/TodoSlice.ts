import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Todo {
  id: string;
  title: string;
  description: string;
}

interface todosSlice {
  todos: Todo[];
  status: 'idle' | 'loading' | 'succeed' | 'failed';
  error: string | null;
}

const initialState: todosSlice = {
  todos: [],
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
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.push(action.payload);
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

export const {setTodos, addTodo, setStatus, setError} = todosSlice.actions;
export default todosSlice.reducer;
