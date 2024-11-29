import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {setError, setStatus, setTodos} from '../store/slices/TodoSlice';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {NewTodoScreenNavigationProp} from '../../type';

const Home = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const status = useSelector((state: RootState) => state.todos.status);
  const error = useSelector((state: RootState) => state.todos.error);

  const navigation = useNavigation<NewTodoScreenNavigationProp>();
  const [refreshing, setRefreshing] = useState(false);

  const fetchTodos = useCallback(async () => {
    dispatch(setStatus('loading'));
    try {
      const response = await axios.get(
        'http://192.168.255.150:5000/api/all-todos',
      );

      dispatch(setTodos(response.data.todos));
      dispatch(setStatus('succeed'));
    } catch (err: any) {
      dispatch(setError(err.message));
      dispatch(setStatus('failed'));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTodos(); // Re-fetch todos when the user pulls to refresh
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <Text style={styles.heading}>Todo List</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('NewTodo')}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
      {todos?.length > 0 ? (
        [...todos].reverse().map((todo: any, index: number) => (
          <View
            key={todo._id}
            style={[
              styles.todoItem,
              index === todos.length - 1 && styles.lastTodoItem, // Conditional style for the last item
            ]}>
            <Text style={styles.todoTitle}>{todo.title}</Text>
            <Text style={styles.todoDescription}>{todo.description}</Text>
            <TouchableOpacity>
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text>No Todos Found</Text>
      )}
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  todoItem: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lastTodoItem: {
    marginBottom: 30,
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  todoDescription: {
    fontSize: 14,
    color: '#666',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#7fb3eb', // Button color
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center', // Center text horizontally
    marginTop: 16,
    marginBottom: 16,
  },
  buttonText: {
    color: '#ffffff', // Text color
    fontSize: 20,
    fontWeight: 'bold',
  },
});
