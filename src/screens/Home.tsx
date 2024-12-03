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
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import FontAwesome6 from 'react-native-vector-icons/Foundation';

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
import BASE_URL from '../../baseUrl';

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
      const response = await axios.get(`${BASE_URL}/all-todos`);

      // dispatch(setTodos(response.data.todos));
      dispatch(setTodos(response.data));
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
      await axios.delete(`${BASE_URL}/delete-todo/${todoId}`);
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
      <Text style={styles.heading}>
        Todo List <Foundation name="clipboard-notes" size={22} />
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('NewTodo')}>
        <Ionicons name="add-circle" color={'white'} size={40} />
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
            <View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteTodo(todo._id)}>
                <Ionicons name="close" size={22} color={'red'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                // onPress={() => navigationToEditTodo.navigate('EditTodo')}
                onPress={() => handleEditButton(todo._id)}>
                {/* <Text style={styles.editText}>edit</Text> */}
                <Feather name="edit-3" color={'#7fb3eb'} size={22} />
              </TouchableOpacity>
            </View>
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
