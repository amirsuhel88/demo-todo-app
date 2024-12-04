import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Modal,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {RootState} from '../store/store';
import {useNavigation} from '@react-navigation/native';
import {
  removeTodo,
  setError,
  setSelectedTodoId,
  setStatus,
  setTodos,
} from '../store/slices/TodoSlice';
import BASE_URL from '../../baseUrl';
import {
  EditTodoScreenNavigationProp,
  NewTodoScreenNavigationProp,
} from '../../type';

const Home = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<NewTodoScreenNavigationProp>();
  const navigationToEditTodo = useNavigation<EditTodoScreenNavigationProp>();

  const fetchTodos = useCallback(async () => {
    dispatch(setStatus('loading'));
    try {
      const response = await axios.get(`${BASE_URL}/all-todos`);
      dispatch(setTodos(response.data));
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
    await fetchTodos();
    setRefreshing(false);
  };

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
    // Navigate to edit screen
    // Example: navigation.navigate('EditTodo');
    navigationToEditTodo.navigate('EditTodo');
    setModalVisible(false);
  };

  const handleLongPress = (todo: any) => {
    setSelectedTodo(todo);
    setModalVisible(true);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <Text style={styles.heading}>🔅Todo List 📒</Text>

      {todos?.length > 0 ? (
        [...todos].reverse().map((todo: any) => (
          <TouchableOpacity
            key={todo._id}
            onLongPress={() => handleLongPress(todo)}
            style={styles.todoItem}>
            <Text style={styles.todoTitle}>{todo.title}</Text>
            <Text style={styles.todoDescription}>{todo.description}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text>No Todos Found 😢</Text>
      )}

      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose an option</Text>
            <TouchableOpacity
              onPress={() => {
                handleEditButton(selectedTodo?._id);
              }}>
              <Text style={styles.modalOption}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                deleteTodo(selectedTodo?._id);
                setModalVisible(false);
              }}>
              <Text style={styles.modalOption}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalClose}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  todoItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  todoDescription: {
    fontSize: 14,
    color: '#6c757d',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalOption: {
    fontSize: 18,
    color: '#007bff',
    marginVertical: 8,
  },
  modalClose: {
    fontSize: 18,
    color: '#dc3545',
    marginTop: 12,
  },
});
