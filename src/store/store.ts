import {combineReducers, configureStore} from '@reduxjs/toolkit';
import todosReducer from './slices/TodoSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer} from 'redux-persist';
import persistStore from 'redux-persist/es/persistStore';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['selectedTodoId'],
};
const rootReducer = combineReducers({
  todos: todosReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer); // Wrap the rootReducer here
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
        ],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
