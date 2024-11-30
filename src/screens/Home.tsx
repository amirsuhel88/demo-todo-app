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
import {
  removeTodo,
  setError,
  setSelectedTodoId,
  setStatus,
  setTodos,
} from '../store/slices/TodoSlice';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {
  EditTodoScreenNavigationProp,
  NewTodoScreenNavigationProp,
} from '../../type';

const Home = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const status = useSelector((state: RootState) => state.todos.status);
  const error = useSelector((state: RootState) => state.todos.error);

  const navigation = useNavigation<NewTodoScreenNavigationProp>();
  const navigationToEditTodo = useNavigation<EditTodoScreenNavigationProp>();
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

  // fetch todo
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTodos();
    setRefreshing(false);
  };

  // delete a todo
  const deleteTodo = async (todoId: string) => {
    try {
      await axios.delete(
        `http://192.168.255.150:5000/api/delete-todo/${todoId}`,
      );
      dispatch(removeTodo(todoId));
    } catch (error: any) {
      dispatch(setError(error.message));
    }
  };

  const handleEditButton = (todoId: string) => {
    dispatch(setSelectedTodoId(todoId));
    navigationToEditTodo.navigate('EditTodo');
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
              {flexDirection: 'row', justifyContent: 'space-between'}, // Divide into two sections
            ]}>
            <View style={{flex: 1}}>
              <Text style={styles.todoTitle}>{todo.title}</Text>
              <Text style={styles.todoDescription}>{todo.description}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              // onPress={() => navigationToEditTodo.navigate('EditTodo')}
              onPress={() => handleEditButton(todo._id)}>
              <Text style={styles.editText}>edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteTodo(todo._id)}>
              <Text style={styles.deleteText}>X</Text>
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
  deleteButton: {
    padding: 4,
    paddingRight: 20,
    borderRadius: 5,
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center',
  },
  deleteText: {
    color: '#ff0000',
  },
  editText: {
    color: '#0000ff',
  },
});
